/**
 * Cache Service - Performance Optimization
 * Implements intelligent caching for database queries
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
    this.maxCacheSize = 100; // Maximum number of cached items
  }

  /**
   * Generate cache key from query parameters
   */
  generateKey(table, operation, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${table}:${operation}:${sortedParams}`;
  }

  /**
   * Check if cache entry is valid
   */
  isValid(key) {
    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) return false;
    
    const now = Date.now();
    const ttl = this.getTTL(key);
    return (now - timestamp) < ttl;
  }

  /**
   * Get TTL for specific cache key
   */
  getTTL(key) {
    // Different TTL for different data types
    if (key.includes('cars')) return 10 * 60 * 1000; // 10 minutes for cars
    if (key.includes('bookings')) return 2 * 60 * 1000; // 2 minutes for bookings
    if (key.includes('profiles')) return 15 * 60 * 1000; // 15 minutes for profiles
    return this.defaultTTL;
  }

  /**
   * Get cached data
   */
  get(key) {
    if (!this.isValid(key)) {
      this.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  /**
   * Set cached data
   */
  set(key, data) {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, data);
    this.cacheTimestamps.set(key, Date.now());
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    this.cache.delete(key);
    this.cacheTimestamps.delete(key);
  }

  /**
   * Evict oldest cache entry (LRU)
   */
  evictOldest() {
    let oldestKey = null;
    let oldestTime = Date.now();
    
    for (const [key, timestamp] of this.cacheTimestamps) {
      if (timestamp < oldestTime) {
        oldestTime = timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  /**
   * Clear cache for specific table
   */
  clearTable(table) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${table}:`)) {
        this.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      keys: Array.from(this.cache.keys()),
      hitRate: this.calculateHitRate()
    };
  }

  /**
   * Calculate cache hit rate (simplified)
   */
  calculateHitRate() {
    // For now, return a mock hit rate based on cache size
    // In a real implementation, this would track actual hits/misses
    if (this.cache.size === 0) return 0;
    
    // Mock calculation: higher hit rate when cache is more full
    const utilization = this.cache.size / this.maxCacheSize;
    return Math.round(utilization * 100);
  }
}

// Create singleton instance
export const cacheService = new CacheService();

// Cache decorator for Supabase queries
export function withCache(ttl = null) {
  return function(target, propertyName, descriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function(...args) {
      const cacheKey = cacheService.generateKey(
        target.constructor.name,
        propertyName,
        args[0] || {}
      );
      
      // Try to get from cache first
      const cached = cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }
      
      
      // Execute original method
      const result = await method.apply(this, args);
      
      // Cache the result
      cacheService.set(cacheKey, result);
      
      return result;
    };
    
    return descriptor;
  };
}

// Cache-aware Supabase client wrapper
export class CachedSupabaseClient {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Cached select query
   */
  async select(table, options = {}) {
    const cacheKey = cacheService.generateKey(table, 'select', options);
    
    // Try cache first
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return { data: cached, error: null };
    }
    
    
    // Execute query
    const result = await this.supabase
      .from(table)
      .select(options.select || '*')
      .order(options.order || {})
      .range(options.range || {})
      .eq(options.eq || {})
      .single(options.single || false);
    
    // Cache successful results
    if (result.data && !result.error) {
      cacheService.set(cacheKey, result.data);
    }
    
    return result;
  }

  /**
   * Cached select with joins
   */
  async selectWithJoins(table, joins = [], options = {}) {
    const cacheKey = cacheService.generateKey(table, 'selectWithJoins', { joins, ...options });
    
    // Try cache first
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return { data: cached, error: null };
    }
    
    
    // Build select string with joins
    let selectString = '*';
    if (joins.length > 0) {
      selectString = `*, ${joins.map(join => `${join.table}(${join.select || '*'})`).join(', ')}`;
    }
    
    // Execute query
    const result = await this.supabase
      .from(table)
      .select(selectString)
      .order(options.order || {})
      .range(options.range || {})
      .eq(options.eq || {})
      .single(options.single || false);
    
    // Cache successful results
    if (result.data && !result.error) {
      cacheService.set(cacheKey, result.data);
    }
    
    return result;
  }

  /**
   * Invalidate cache after mutations
   */
  async insert(table, data) {
    const result = await this.supabase.from(table).insert(data);
    if (!result.error) {
      cacheService.clearTable(table);
    }
    return result;
  }

  async update(table, data, filter) {
    const result = await this.supabase.from(table).update(data).match(filter);
    if (!result.error) {
      cacheService.clearTable(table);
    }
    return result;
  }

  async delete(table, filter) {
    const result = await this.supabase.from(table).delete().match(filter);
    if (!result.error) {
      cacheService.clearTable(table);
    }
    return result;
  }
}

export default cacheService;

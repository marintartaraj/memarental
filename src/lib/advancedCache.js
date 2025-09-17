/**
 * Advanced Caching Strategy
 * Multi-layer caching with intelligent invalidation
 */

class AdvancedCache {
  constructor() {
    this.memoryCache = new Map();
    this.indexedDBCache = null;
    this.serviceWorkerCache = null;
    this.cacheStrategies = {
      'stale-while-revalidate': this.staleWhileRevalidate.bind(this),
      'cache-first': this.cacheFirst.bind(this),
      'network-first': this.networkFirst.bind(this),
      'network-only': this.networkOnly.bind(this),
      'cache-only': this.cacheOnly.bind(this)
    };
    this.maxMemorySize = 50 * 1024 * 1024; // 50MB
    this.maxAge = 5 * 60 * 1000; // 5 minutes default
    this.init();
  }

  /**
   * Initialize cache systems
   */
  async init() {
    await this.initIndexedDB();
    await this.initServiceWorkerCache();
    this.setupCleanup();
  }

  /**
   * Initialize IndexedDB for persistent caching
   */
  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MemaRentalCache', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.indexedDBCache = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores for different data types
        if (!db.objectStoreNames.contains('api')) {
          db.createObjectStore('api', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('pages')) {
          db.createObjectStore('pages', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Initialize Service Worker cache
   */
  async initServiceWorkerCache() {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        this.serviceWorkerCache = await caches.open('mema-rental-v1');
      } catch (error) {
        console.warn('Service Worker cache initialization failed:', error);
      }
    }
  }

  /**
   * Set cache entry with strategy
   */
  async set(key, data, options = {}) {
    const {
      strategy = 'stale-while-revalidate',
      maxAge = this.maxAge,
      tags = [],
      priority = 'normal'
    } = options;

    const cacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      maxAge,
      strategy,
      tags,
      priority,
      size: this.calculateSize(data)
    };

    // Store in memory cache
    this.memoryCache.set(key, cacheEntry);

    // Store in IndexedDB for persistence
    await this.storeInIndexedDB(cacheEntry);

    // Store in Service Worker cache if applicable
    if (this.serviceWorkerCache && options.cacheInSW) {
      await this.storeInServiceWorkerCache(key, data);
    }

    return cacheEntry;
  }

  /**
   * Get cache entry with strategy
   */
  async get(key, options = {}) {
    const { strategy = 'stale-while-revalidate', fallback = null } = options;

    const strategyFunction = this.cacheStrategies[strategy];
    if (!strategyFunction) {
      throw new Error(`Unknown cache strategy: ${strategy}`);
    }

    return await strategyFunction(key, options, fallback);
  }

  /**
   * Stale-while-revalidate strategy
   */
  async staleWhileRevalidate(key, options, fallback) {
    // Try to get from cache first
    const cached = await this.getFromCache(key);
    
    if (cached && !this.isExpired(cached)) {
      // Return cached data immediately
      this.refreshInBackground(key, options);
      return cached.data;
    }

    // If no cache or expired, try to fetch fresh data
    try {
      const freshData = await this.fetchFreshData(key, options);
      if (freshData) {
        await this.set(key, freshData, options);
        return freshData;
      }
    } catch (error) {
      console.warn(`Failed to fetch fresh data for ${key}:`, error);
    }

    // Return stale data if available, otherwise fallback
    return cached ? cached.data : fallback;
  }

  /**
   * Cache-first strategy
   */
  async cacheFirst(key, options, fallback) {
    const cached = await this.getFromCache(key);
    
    if (cached && !this.isExpired(cached)) {
      return cached.data;
    }

    // Try to fetch fresh data
    try {
      const freshData = await this.fetchFreshData(key, options);
      if (freshData) {
        await this.set(key, freshData, options);
        return freshData;
      }
    } catch (error) {
      console.warn(`Failed to fetch fresh data for ${key}:`, error);
    }

    return fallback;
  }

  /**
   * Network-first strategy
   */
  async networkFirst(key, options, fallback) {
    try {
      const freshData = await this.fetchFreshData(key, options);
      if (freshData) {
        await this.set(key, freshData, options);
        return freshData;
      }
    } catch (error) {
      console.warn(`Failed to fetch fresh data for ${key}:`, error);
    }

    // Fall back to cache
    const cached = await this.getFromCache(key);
    return cached ? cached.data : fallback;
  }

  /**
   * Network-only strategy
   */
  async networkOnly(key, options, fallback) {
    try {
      const freshData = await this.fetchFreshData(key, options);
      if (freshData) {
        await this.set(key, freshData, options);
        return freshData;
      }
    } catch (error) {
      console.warn(`Failed to fetch fresh data for ${key}:`, error);
    }

    return fallback;
  }

  /**
   * Cache-only strategy
   */
  async cacheOnly(key, options, fallback) {
    const cached = await this.getFromCache(key);
    return cached ? cached.data : fallback;
  }

  /**
   * Get data from cache (memory -> IndexedDB -> Service Worker)
   */
  async getFromCache(key) {
    // Try memory cache first
    let cached = this.memoryCache.get(key);
    if (cached && !this.isExpired(cached)) {
      return cached;
    }

    // Try IndexedDB
    cached = await this.getFromIndexedDB(key);
    if (cached && !this.isExpired(cached)) {
      // Restore to memory cache
      this.memoryCache.set(key, cached);
      return cached;
    }

    // Try Service Worker cache
    cached = await this.getFromServiceWorkerCache(key);
    if (cached && !this.isExpired(cached)) {
      return cached;
    }

    return null;
  }

  /**
   * Store in IndexedDB
   */
  async storeInIndexedDB(cacheEntry) {
    if (!this.indexedDBCache) return;

    try {
      const transaction = this.indexedDBCache.transaction(['api'], 'readwrite');
      const store = transaction.objectStore('api');
      await store.put(cacheEntry);
    } catch (error) {
      console.warn('Failed to store in IndexedDB:', error);
    }
  }

  /**
   * Get from IndexedDB
   */
  async getFromIndexedDB(key) {
    if (!this.indexedDBCache) return null;

    try {
      const transaction = this.indexedDBCache.transaction(['api'], 'readonly');
      const store = transaction.objectStore('api');
      const request = store.get(key);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Failed to get from IndexedDB:', error);
      return null;
    }
  }

  /**
   * Store in Service Worker cache
   */
  async storeInServiceWorkerCache(key, data) {
    if (!this.serviceWorkerCache) return;

    try {
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      await this.serviceWorkerCache.put(key, response);
    } catch (error) {
      console.warn('Failed to store in Service Worker cache:', error);
    }
  }

  /**
   * Get from Service Worker cache
   */
  async getFromServiceWorkerCache(key) {
    if (!this.serviceWorkerCache) return null;

    try {
      const response = await this.serviceWorkerCache.get(key);
      if (response) {
        const data = await response.json();
        return {
          key,
          data,
          timestamp: Date.now(),
          maxAge: this.maxAge
        };
      }
    } catch (error) {
      console.warn('Failed to get from Service Worker cache:', error);
    }

    return null;
  }

  /**
   * Fetch fresh data
   */
  async fetchFreshData(key, options) {
    const { url, method = 'GET', headers = {}, body } = options;
    
    if (!url) {
      throw new Error('URL is required for fetching fresh data');
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        ...headers
      },
      body
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Refresh data in background
   */
  async refreshInBackground(key, options) {
    // Use requestIdleCallback for background refresh
    if ('requestIdleCallback' in window) {
      requestIdleCallback(async () => {
        try {
          const freshData = await this.fetchFreshData(key, options);
          if (freshData) {
            await this.set(key, freshData, options);
          }
        } catch (error) {
          console.warn(`Background refresh failed for ${key}:`, error);
        }
      });
    }
  }

  /**
   * Check if cache entry is expired
   */
  isExpired(cacheEntry) {
    return Date.now() - cacheEntry.timestamp > cacheEntry.maxAge;
  }

  /**
   * Calculate data size
   */
  calculateSize(data) {
    return new Blob([JSON.stringify(data)]).size;
  }

  /**
   * Invalidate cache by tags
   */
  async invalidateByTags(tags) {
    const keysToInvalidate = [];

    // Check memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        keysToInvalidate.push(key);
      }
    }

    // Remove from memory cache
    keysToInvalidate.forEach(key => this.memoryCache.delete(key));

    // Remove from IndexedDB
    if (this.indexedDBCache) {
      const transaction = this.indexedDBCache.transaction(['api'], 'readwrite');
      const store = transaction.objectStore('api');
      keysToInvalidate.forEach(key => store.delete(key));
    }

    // Remove from Service Worker cache
    if (this.serviceWorkerCache) {
      keysToInvalidate.forEach(key => this.serviceWorkerCache.delete(key));
    }
  }

  /**
   * Clear all caches
   */
  async clear() {
    this.memoryCache.clear();
    
    if (this.indexedDBCache) {
      const transaction = this.indexedDBCache.transaction(['api'], 'readwrite');
      const store = transaction.objectStore('api');
      await store.clear();
    }

    if (this.serviceWorkerCache) {
      await this.serviceWorkerCache.delete('mema-rental-v1');
      await this.initServiceWorkerCache();
    }
  }

  /**
   * Setup automatic cleanup
   */
  setupCleanup() {
    // Cleanup expired entries every 5 minutes
    setInterval(() => {
      this.cleanupExpired();
    }, 5 * 60 * 1000);

    // Cleanup memory cache when it gets too large
    setInterval(() => {
      this.cleanupMemoryCache();
    }, 60 * 1000);
  }

  /**
   * Cleanup expired entries
   */
  cleanupExpired() {
    const now = Date.now();
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp > entry.maxAge) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Cleanup memory cache when it gets too large
   */
  cleanupMemoryCache() {
    let totalSize = 0;
    const entries = Array.from(this.memoryCache.entries());
    
    // Calculate total size
    entries.forEach(([key, entry]) => {
      totalSize += entry.size;
    });

    // If too large, remove oldest entries
    if (totalSize > this.maxMemorySize) {
      const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      for (const [key, entry] of sortedEntries) {
        this.memoryCache.delete(key);
        totalSize -= entry.size;
        
        if (totalSize <= this.maxMemorySize * 0.8) {
          break;
        }
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const memoryEntries = Array.from(this.memoryCache.values());
    const totalSize = memoryEntries.reduce((sum, entry) => sum + entry.size, 0);
    
    return {
      memoryEntries: this.memoryCache.size,
      totalSize: totalSize,
      maxMemorySize: this.maxMemorySize,
      hasIndexedDB: !!this.indexedDBCache,
      hasServiceWorker: !!this.serviceWorkerCache
    };
  }
}

// Create singleton instance
export const advancedCache = new AdvancedCache();

export default advancedCache;

/**
 * Pagination Service - Advanced Server-Side Pagination
 * Implements efficient server-side filtering, sorting, and pagination
 */

import { supabase } from './customSupabaseClient';
import { cacheService } from './cacheService';

class PaginationService {
  constructor() {
    this.cache = cacheService;
  }

  /**
   * Build Supabase query with filters
   */
  buildQuery(table, filters = {}) {
    let query = supabase.from(table);

    // Apply filters - temporarily disabled search to fix compatibility issues
    if (filters.search) {
      // TODO: Fix search functionality with proper Supabase v2.30.0 syntax
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // Apply date filters
    if (filters.dateFilter && filters.dateFilter !== 'all') {
      const now = new Date();
      let startDate, endDate;

      switch (filters.dateFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 'week':
          startDate = now;
          endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = now;
          endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
        case 'past':
          endDate = now;
          break;
        default:
          break;
      }

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }
    }

    // Apply range filters
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        query = query.gte('daily_rate', filters.priceRange.min);
      }
      if (filters.priceRange.max !== undefined) {
        query = query.lte('daily_rate', filters.priceRange.max);
      }
    }

    if (filters.yearRange) {
      if (filters.yearRange.min !== undefined) {
        query = query.gte('year', filters.yearRange.min);
      }
      if (filters.yearRange.max !== undefined) {
        query = query.lte('year', filters.yearRange.max);
      }
    }

    // Apply specific filters
    if (filters.fuelType && filters.fuelType !== 'all') {
      query = query.eq('fuel_type', filters.fuelType);
    }

    if (filters.transmission && filters.transmission !== 'all') {
      query = query.eq('transmission', filters.transmission);
    }

    if (filters.seats && filters.seats !== 'all') {
      query = query.eq('seats', parseInt(filters.seats));
    }

    return query;
  }

  /**
   * Get paginated data with server-side filtering and sorting
   */
  async getPaginatedData(table, options = {}) {
    const {
      page = 1,
      limit = 20,
      filters = {},
      sortBy = 'created_at',
      sortOrder = 'desc',
      joins = []
    } = options;

    const cacheKey = this.cache.generateKey(table, 'getPaginated', {
      page,
      limit,
      filters,
      sortBy,
      sortOrder,
      joins
    });

    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }


    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Build query with filters
      let query = this.buildQuery(table, filters);

      // Add joins if specified
      if (joins.length > 0) {
        const selectString = `*, ${joins.map(join => `${join.table}(${join.select || '*'})`).join(', ')}`;
        query = query.select(selectString);
      } else {
        query = query.select('*');
      }

      // Apply sorting
      const sortConfig = this.buildSortConfig(sortBy, sortOrder);
      query = query.order(sortConfig.field, { ascending: sortConfig.ascending });

      // Get total count
      const countQuery = this.buildQuery(table, filters);
      const { count, error: countError } = await countQuery
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Get paginated data
      const { data, error } = await query.range(from, to);

      if (error) throw error;

      // Process data if needed
      const processedData = this.processData(data, table, joins);

      const result = {
        data: processedData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalCount: count,
          hasNextPage: page < Math.ceil(count / limit),
          hasPrevPage: page > 1,
          limit,
          from: from + 1,
          to: Math.min(to + 1, count)
        },
        filters,
        sortBy,
        sortOrder
      };

      // Cache the result
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error(`Error fetching paginated ${table} data:`, error);
      throw error;
    }
  }

  /**
   * Build sort configuration
   */
  buildSortConfig(sortBy, sortOrder) {
    const ascending = sortOrder === 'asc';
    
    // Map frontend sort fields to database fields
    const fieldMapping = {
      'customer': 'customer_name',
      'car': 'car_id',
      'date': 'created_at',
      'status': 'status',
      'price': 'total_price',
      'brand': 'brand',
      'model': 'model',
      'year': 'year',
      'rate': 'daily_rate',
      'name': 'full_name',
      'email': 'email',
      'created': 'created_at'
    };

    return {
      field: fieldMapping[sortBy] || sortBy,
      ascending
    };
  }

  /**
   * Process data based on table and joins
   */
  processData(data, table, joins) {
    if (!data) return [];

    return data.map(item => {
      // Process bookings with profile and car data
      if (table === 'bookings') {
        return {
          ...item,
          profiles: item.profiles || {
            full_name: item.customer_name || 'Anonymous Customer',
            email: item.customer_email || 'No email',
            phone: item.customer_phone || 'No phone'
          },
          cars: item.cars || null
        };
      }

      return item;
    });
  }

  /**
   * Get available filter options for a table
   */
  async getFilterOptions(table, filterType) {
    const cacheKey = this.cache.generateKey(table, 'filterOptions', { filterType });

    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      let query = supabase.from(table).select(filterType);

      if (filterType === 'status') {
        query = query.select('status').not('status', 'is', null);
      } else if (filterType === 'fuel_type') {
        query = query.select('fuel_type').not('fuel_type', 'is', null);
      } else if (filterType === 'transmission') {
        query = query.select('transmission').not('transmission', 'is', null);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Extract unique values
      const uniqueValues = [...new Set(data.map(item => item[filterType]))]
        .filter(value => value !== null && value !== undefined)
        .sort();

      const result = uniqueValues.map(value => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1)
      }));

      // Cache the result
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error(`Error fetching filter options for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(table, searchTerm, limit = 10) {
    if (!searchTerm || searchTerm.length < 2) return [];

    const cacheKey = this.cache.generateKey(table, 'searchSuggestions', { searchTerm, limit });

    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      let query = supabase.from(table);

      if (table === 'bookings') {
        query = query
          .select('customer_name, customer_email')
          .or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`)
          .limit(limit);
      } else if (table === 'cars') {
        query = query
          .select('brand, model')
          .or(`brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`)
          .limit(limit);
      } else if (table === 'profiles') {
        query = query
          .select('full_name, email')
          .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
          .limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process suggestions
      const suggestions = data.map(item => {
        if (table === 'bookings') {
          return {
            id: item.customer_name,
            label: `${item.customer_name} (${item.customer_email})`,
            type: 'customer'
          };
        } else if (table === 'cars') {
          return {
            id: `${item.brand} ${item.model}`,
            label: `${item.brand} ${item.model}`,
            type: 'car'
          };
        } else if (table === 'profiles') {
          return {
            id: item.full_name,
            label: `${item.full_name} (${item.email})`,
            type: 'user'
          };
        }
        return item;
      });

      // Cache the result
      this.cache.set(cacheKey, suggestions);

      return suggestions;
    } catch (error) {
      console.error(`Error fetching search suggestions for ${table}:`, error);
      throw error;
    }
  }

  /**
   * Clear cache for a specific table
   */
  clearTableCache(table) {
    this.cache.clearTable(table);
  }

  /**
   * Get pagination statistics
   */
  getPaginationStats() {
    return {
      cacheSize: this.cache.getStats().size,
      cacheHitRate: this.cache.getStats().hitRate || 0
    };
  }
}

// Create singleton instance
export const paginationService = new PaginationService();

export default paginationService;

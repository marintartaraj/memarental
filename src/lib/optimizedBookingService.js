/**
 * Optimized Booking Service - Performance Enhanced
 * Fixes N+1 queries and implements intelligent caching
 */

import { supabase } from './customSupabaseClient';
import { cacheService } from './cacheService';

class OptimizedBookingService {
  constructor() {
    this.cache = cacheService;
  }

  /**
   * Get all bookings with profiles and cars in a single query (fixes N+1)
   */
  async getAllBookingsWithDetails(options = {}) {
    const cacheKey = this.cache.generateKey('bookings', 'getAllWithDetails', options);
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('🎯 Cache HIT: getAllBookingsWithDetails');
      return cached;
    }

    console.log('🔄 Cache MISS: getAllBookingsWithDetails');

    try {
      // Single query with car joins to get all data at once (customer data is stored directly in bookings)
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars:car_id (
            brand,
            model,
            daily_rate,
            image_url,
            year
          )
        `)
        .order('created_at', { ascending: false })
        .range(options.range?.from || 0, options.range?.to || 1000);

      if (error) throw error;

      // Process the data to handle anonymous bookings
      const processedData = (data || []).map(booking => ({
        ...booking,
        profiles: booking.profiles || {
          full_name: booking.customer_name || 'Anonymous Customer',
          email: booking.customer_email || 'No email',
          phone: booking.customer_phone || 'No phone'
        },
        cars: booking.cars || null
      }));

      // Cache the result
      this.cache.set(cacheKey, processedData);
      
      return processedData;
    } catch (error) {
      console.error('Error fetching bookings with details:', error);
      throw error;
    }
  }

  /**
   * Get paginated bookings with details
   */
  async getBookingsPaginated(page = 1, limit = 20, filters = {}) {
    const cacheKey = this.cache.generateKey('bookings', 'getPaginated', { page, limit, filters });
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('🎯 Cache HIT: getBookingsPaginated');
      return cached;
    }

    console.log('🔄 Cache MISS: getBookingsPaginated');

    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Get total count
      const { count, error: countError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Get paginated data with car joins only (customer data is stored directly in bookings)
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars:car_id (
            brand,
            model,
            daily_rate,
            image_url,
            year
          )
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Process the data
      const processedData = (data || []).map(booking => ({
        ...booking,
        profiles: booking.profiles || {
          full_name: booking.customer_name || 'Anonymous Customer',
          email: booking.customer_email || 'No email',
          phone: booking.customer_phone || 'No phone'
        },
        cars: booking.cars || null
      }));

      const result = {
        data: processedData,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(count / limit),
        hasPrevPage: page > 1
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error fetching paginated bookings:', error);
      throw error;
    }
  }

  /**
   * Get all cars with caching
   */
  async getAllCars() {
    const cacheKey = this.cache.generateKey('cars', 'getAll');
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('🎯 Cache HIT: getAllCars');
      return cached;
    }

    console.log('🔄 Cache MISS: getAllCars');

    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Cache the result
      this.cache.set(cacheKey, data || []);
      
      return data || [];
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  }

  /**
   * Get car by ID with caching
   */
  async getCarById(id) {
    const cacheKey = this.cache.generateKey('cars', 'getById', { id });
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('🎯 Cache HIT: getCarById');
      return cached;
    }

    console.log('🔄 Cache MISS: getCarById');

    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Cache the result
      this.cache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Error fetching car:', error);
      throw error;
    }
  }

  /**
   * Get booking by ID with details
   */
  async getBookingById(id) {
    const cacheKey = this.cache.generateKey('bookings', 'getById', { id });
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('🎯 Cache HIT: getBookingById');
      return cached;
    }

    console.log('🔄 Cache MISS: getBookingById');

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars:car_id (
            brand,
            model,
            daily_rate,
            image_url,
            year
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Process the data
      const processedData = {
        ...data,
        profiles: data.profiles || {
          full_name: data.customer_name || 'Anonymous Customer',
          email: data.customer_email || 'No email',
          phone: data.customer_phone || 'No phone'
        },
        cars: data.cars || null
      };

      // Cache the result
      this.cache.set(cacheKey, processedData);
      
      return processedData;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  /**
   * Create booking and invalidate cache
   */
  async createBooking(bookingData) {
    try {
      // Filter out non-existent database columns
      const validColumns = [
        'customer_name', 'customer_email', 'customer_phone', 'car_id',
        'pickup_date', 'return_date', 'total_price', 'notes', 'status'
      ];
      
      const filteredData = {};
      
      // Include only valid fields
      validColumns.forEach(column => {
        if (bookingData[column] !== undefined && bookingData[column] !== null) {
          filteredData[column] = bookingData[column];
        }
      });
      
      console.log('Creating booking with:', filteredData);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([filteredData])
        .select()
        .single();

      if (error) throw error;

      // Invalidate bookings cache
      this.cache.clearTable('bookings');
      
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  /**
   * Update booking and invalidate cache
   */
  async updateBooking(id, updates) {
    try {
      // Filter out non-existent database columns
      const validColumns = [
        'customer_name', 'customer_email', 'customer_phone', 'car_id',
        'pickup_date', 'return_date', 'total_price', 'notes', 'status'
      ];
      
      const filteredUpdates = {};
      
      // Include only valid fields
      validColumns.forEach(column => {
        if (updates[column] !== undefined && updates[column] !== null) {
          filteredUpdates[column] = updates[column];
        }
      });
      
      console.log('Updating booking with:', filteredUpdates);
      
      const { data, error } = await supabase
        .from('bookings')
        .update(filteredUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate bookings cache
      this.cache.clearTable('bookings');
      
      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  /**
   * Delete booking and invalidate cache
   */
  async deleteBooking(id) {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Invalidate bookings cache
      this.cache.clearTable('bookings');
      
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics with caching
   */
  async getDashboardStats() {
    const cacheKey = this.cache.generateKey('dashboard', 'getStats');
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('🎯 Cache HIT: getDashboardStats');
      return cached;
    }

    console.log('🔄 Cache MISS: getDashboardStats');

    try {
      // Get all stats in parallel
      const [carsResult, bookingsResult, profilesResult] = await Promise.all([
        supabase.from('cars').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ]);

      const stats = {
        totalCars: carsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalUsers: profilesResult.count || 0,
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      this.cache.set(cacheKey, stats);
      
      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Clear all cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }
}

// Create singleton instance
export const optimizedBookingService = new OptimizedBookingService();

export default optimizedBookingService;

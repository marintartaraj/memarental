/**
 * Admin Service - Comprehensive Admin Operations
 * Handles all admin-related operations with caching and optimization
 */

import { supabase } from './customSupabaseClient';
import { cacheService } from './cacheService';

class AdminService {
  constructor() {
    this.cache = cacheService;
  }

  /**
   * Get comprehensive dashboard statistics
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
      const [carsResult, bookingsResult, profilesResult, revenueResult] = await Promise.all([
        supabase.from('cars').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('total_price').not('total_price', 'is', null)
      ]);

      // Calculate total revenue
      const totalRevenue = revenueResult.data?.reduce((sum, booking) => 
        sum + (parseFloat(booking.total_price) || 0), 0
      ) || 0;

      // Get additional stats
      const [availableCarsResult, pendingBookingsResult, confirmedBookingsResult] = await Promise.all([
        supabase.from('cars').select('*', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed')
      ]);

      const stats = {
        totalCars: carsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalUsers: profilesResult.count || 0,
        totalRevenue,
        availableCars: availableCarsResult.count || 0,
        pendingBookings: pendingBookingsResult.count || 0,
        confirmedBookings: confirmedBookingsResult.count || 0,
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
   * Get recent bookings with details
   */
  async getRecentBookings(limit = 10) {
    const cacheKey = this.cache.generateKey('bookings', 'getRecent', { limit });
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('🎯 Cache HIT: getRecentBookings');
      return cached;
    }

    console.log('🔄 Cache MISS: getRecentBookings');

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
        .order('created_at', { ascending: false })
        .limit(limit);

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

      // Cache the result
      this.cache.set(cacheKey, processedData);
      
      return processedData;
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
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
   * Get all users with caching
   */
  async getAllUsers() {
    const cacheKey = this.cache.generateKey('profiles', 'getAll');
    
    // Try cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('🎯 Cache HIT: getAllUsers');
      return cached;
    }

    console.log('🔄 Cache MISS: getAllUsers');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Cache the result
      this.cache.set(cacheKey, data || []);
      
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Create car and invalidate cache
   */
  async createCar(carData) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .insert([carData])
        .select()
        .single();

      if (error) throw error;

      // Invalidate cars cache
      this.cache.clearTable('cars');
      
      return data;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  }

  /**
   * Update car and invalidate cache
   */
  async updateCar(id, updates) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate cars cache
      this.cache.clearTable('cars');
      
      return data;
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  }

  /**
   * Delete car and invalidate cache
   */
  async deleteCar(id) {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Invalidate cars cache
      this.cache.clearTable('cars');
      
      return true;
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  }

  /**
   * Update user and invalidate cache
   */
  async updateUser(id, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate profiles cache
      this.cache.clearTable('profiles');
      
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user and invalidate cache
   */
  async deleteUser(id) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Invalidate profiles cache
      this.cache.clearTable('profiles');
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
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
   * Update booking and invalidate cache
   */
  async updateBooking(id, updates) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
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
   * Clear all cache
   */
  clearAllCache() {
    this.cache.clear();
  }

  /**
   * Clear cache for specific table
   */
  clearTableCache(table) {
    this.cache.clearTable(table);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * Export data to CSV
   */
  exportToCSV(data, filename) {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          typeof row[header] === 'string' && row[header].includes(',') 
            ? `"${row[header]}"` 
            : row[header] || ''
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Create singleton instance
export const adminService = new AdminService();

export default adminService;

/**
 * Booking Service - Simplified Version
 * Handles all booking-related operations
 */

import { supabase } from './customSupabaseClient';

class BookingService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get all bookings with optimized joins (fixes N+1 query issue)
   */
  async getAllBookings(options = {}) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles!inner(
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          cars!inner(
            id,
            make,
            model,
            year,
            price_per_day
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles!inner(
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          cars!inner(
            id,
            make,
            model,
            year,
            price_per_day
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  /**
   * Create new booking
   */
  async createBooking(bookingData) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  /**
   * Update booking
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
      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  /**
   * Delete booking
   */
  async deleteBooking(id) {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  /**
   * Get all cars
   */
  async getAllCars() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  }

  /**
   * Get car by ID
   */
  async getCarById(id) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching car:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const bookingService = new BookingService();

// Export class for direct instantiation if needed
export { BookingService };

// Export for use in components
export default bookingService;
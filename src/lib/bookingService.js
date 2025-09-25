/**
 * Booking Service - Simplified Version
 * Handles all booking-related operations
 */

import { supabase } from './customSupabaseClient';

class BookingService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.isOnline = true;
  }

  /**
   * Check if Supabase is available
   */
  async checkHealth() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .limit(1);
      
      this.isOnline = !error;
      return !error;
    } catch (error) {
      this.isOnline = false;
      return false;
    }
  }

  /**
   * Retry mechanism for failed requests
   */
  async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
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
          profiles(
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          cars(
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
      // Check if we're online first
      if (!this.isOnline) {
        const isHealthy = await this.checkHealth();
        if (!isHealthy) {
          return {
            success: false,
            error: 'Service temporarily unavailable. Please try again later.'
          };
        }
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles(
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          cars(
            id,
            make,
            model,
            year,
            price_per_day
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        this.isOnline = false;
        throw error;
      }
      
      return {
        success: true,
        booking: data
      };
    } catch (error) {
      console.error('Error fetching booking:', error);
      
      // Check if it's a network/service error
      if (error.message?.includes('503') || error.message?.includes('Service Unavailable')) {
        this.isOnline = false;
        return {
          success: false,
          error: 'Service temporarily unavailable. Please try again later.'
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to fetch booking'
      };
    }
  }

  /**
   * Create new booking
   */
  async createBooking(bookingData) {
    try {
      // Check if we're online first
      if (!this.isOnline) {
        const isHealthy = await this.checkHealth();
        if (!isHealthy) {
          return {
            success: false,
            error: 'Service temporarily unavailable. Please try again later.'
          };
        }
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        this.isOnline = false;
        throw error;
      }
      
      return {
        success: true,
        booking: data,
        bookingId: data.id
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // Check if it's a network/service error
      if (error.message?.includes('503') || error.message?.includes('Service Unavailable')) {
        this.isOnline = false;
        return {
          success: false,
          error: 'Service temporarily unavailable. Please try again later.'
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to create booking'
      };
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

  /**
   * Get availability for multiple cars
   */
  async getAvailabilityForCars(carIds, pickupDate, returnDate) {
    try {
      if (!carIds || carIds.length === 0) {
        return {};
      }

      if (!pickupDate || !returnDate) {
        // If no dates provided, assume all cars are available
        return carIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
      }

      // Check for conflicting bookings
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('car_id')
        .in('car_id', carIds)
        .or(`and(pickup_date.lte.${returnDate},return_date.gte.${pickupDate})`)
        .in('status', ['confirmed', 'pending']);

      if (error) throw error;

      // Create availability map
      const availability = {};
      const bookedCarIds = new Set(bookings?.map(b => b.car_id) || []);

      carIds.forEach(carId => {
        availability[carId] = !bookedCarIds.has(carId);
      });

      return availability;
    } catch (error) {
      console.error('Error checking car availability:', error);
      // Return all cars as available in case of error
      return carIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
    }
  }
}

// Create singleton instance
export const bookingService = new BookingService();

// Export class for direct instantiation if needed
export { BookingService };

// Export for use in components
export default bookingService;
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
      // First get the booking data
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (bookingError) throw bookingError;

      // Then get the car data separately
      const { data: carData, error: carError } = await supabase
        .from('cars')
        .select('id, brand, model, year, daily_rate')
        .eq('id', bookingData.car_id)
        .single();

      if (carError) throw carError;

      // Combine the data
      const result = {
        ...bookingData,
        cars: carData
      };

      return {
        success: true,
        booking: result
      };
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        error: error.message
      };
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
      
      return {
        success: true,
        booking: data
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Booking data that failed:', bookingData);
      return {
        success: false,
        error: error.message,
        details: error.details || null,
        hint: error.hint || null
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
   * Check availability for multiple cars
   */
  async getAvailabilityForCars(carIds, pickupDate, returnDate) {
    try {
      if (!carIds || carIds.length === 0) {
        return {};
      }

      // Check for overlapping bookings
      const { data, error } = await supabase
        .from('bookings')
        .select('car_id')
        .in('car_id', carIds)
        .or(`and(pickup_date.lte.${returnDate},return_date.gte.${pickupDate})`)
        .eq('status', 'confirmed');

      if (error) throw error;

      // Create availability map
      const availabilityMap = {};
      const unavailableCarIds = new Set(data?.map(booking => booking.car_id) || []);

      carIds.forEach(carId => {
        availabilityMap[carId] = !unavailableCarIds.has(carId);
      });

      return availabilityMap;
    } catch (error) {
      console.error('Error checking car availability:', error);
      throw error;
    }
  }

  /**
   * Check availability for a single car
   */
  async getAvailabilityForCar(carId, pickupDate, returnDate) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('car_id', carId)
        .or(`and(pickup_date.lte.${returnDate},return_date.gte.${pickupDate})`)
        .eq('status', 'confirmed')
        .limit(1);

      if (error) throw error;
      return data?.length === 0; // Available if no conflicting bookings
    } catch (error) {
      console.error('Error checking car availability:', error);
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
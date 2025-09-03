import { supabase } from './customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

export class BookingService {
  static async createBooking(bookingData) {
    try {
      // Get current user session
      const { data: { user } } = await supabase.auth.getUser();
      
      // First, check if car is still available
      const { data: car, error: carError } = await supabase
        .from('cars')
        .select('id, status, daily_rate')
        .eq('id', bookingData.carId)
        .single();

      if (carError) {
        throw new Error('Failed to verify car availability');
      }

      if (car.status !== 'available') {
        throw new Error('Car is no longer available');
      }

      // Calculate total price
      const days = this.calculateDays(bookingData.pickupDate, bookingData.returnDate);
      const basePrice = days * car.daily_rate;
      const extrasTotal = bookingData.extras.reduce((total, extra) => {
        return total + (extra.price * days);
      }, 0);
      const totalPrice = basePrice + extrasTotal;

      // Prepare booking data
      const bookingInsertData = {
        car_id: bookingData.carId,
        pickup_date: bookingData.pickupDate,
        return_date: bookingData.returnDate,
        pickup_time: bookingData.pickupTime,
        return_time: bookingData.returnTime,
        pickup_location: bookingData.pickupLocation,
        return_location: bookingData.returnLocation,
        total_price: totalPrice,
        customer_name: `${bookingData.firstName} ${bookingData.lastName}`,
        customer_email: bookingData.email,
        customer_phone: bookingData.phone,
        license_number: bookingData.licenseNumber,
        license_expiry: bookingData.licenseExpiry,
        extras: bookingData.extras.map(extra => extra.name), // Store as array of names
        special_requests: bookingData.specialRequests,
        status: 'confirmed'
      };

      // Add user_id only if user is authenticated and profile exists
      if (user) {
        // Check if profile exists for this user
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (profile && !profileError) {
          bookingInsertData.user_id = user.id;
        }
        // If no profile exists, don't set user_id (allows anonymous booking)
      }

      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingInsertData)
        .select()
        .single();

      if (bookingError) {
        throw new Error('Failed to create booking');
      }

      // Update car status to booked
      const { error: updateError } = await supabase
        .from('cars')
        .update({ status: 'booked' })
        .eq('id', bookingData.carId);

      if (updateError) {
        console.error('Failed to update car status:', updateError);
        // Don't throw here as booking was created successfully
      }

      return {
        success: true,
        booking,
        bookingId: booking.id
      };

    } catch (error) {
      console.error('Booking creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static calculateDays(pickupDate, returnDate) {
    const pickup = new Date(pickupDate);
    const returnDateObj = new Date(returnDate);
    const diffTime = returnDateObj - pickup;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1; // Minimum 1 day
  }

  static async checkCarAvailability(carId) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('id, status')
        .eq('id', carId)
        .single();

      if (error) {
        throw new Error('Failed to check car availability');
      }

      return {
        available: data.status === 'available',
        status: data.status
      };
    } catch (error) {
      console.error('Availability check failed:', error);
      return {
        available: false,
        error: error.message
      };
    }
  }

  static async getBookingById(bookingId) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars (
            brand,
            model,
            year,
            image_url
          )
        `)
        .eq('id', bookingId)
        .single();

      if (error) {
        throw new Error('Failed to fetch booking');
      }

      return { success: true, booking: data };
    } catch (error) {
      console.error('Failed to get booking:', error);
      return { success: false, error: error.message };
    }
  }

  static async cancelBooking(bookingId) {
    try {
      // Get booking details first
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('car_id, status')
        .eq('id', bookingId)
        .single();

      if (fetchError) {
        throw new Error('Failed to fetch booking');
      }

      if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      // Update booking status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (updateError) {
        throw new Error('Failed to cancel booking');
      }

      // Update car status back to available
      const { error: carUpdateError } = await supabase
        .from('cars')
        .update({ status: 'available' })
        .eq('id', booking.car_id);

      if (carUpdateError) {
        console.error('Failed to update car status:', carUpdateError);
      }

      return { success: true };
    } catch (error) {
      console.error('Booking cancellation failed:', error);
      return { success: false, error: error.message };
    }
  }
}

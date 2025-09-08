import { supabase } from './customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

export class BookingService {
  static async createBooking(bookingData) {
    try {
      // Get current user session
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check if car is available for the requested dates
      const isAvailable = await this.checkCarAvailabilityForDates(
        bookingData.carId, 
        bookingData.pickupDate, 
        bookingData.returnDate
      );
      
      if (!isAvailable) {
        throw new Error('Car is not available for the selected dates');
      }

      // Get car details for pricing
      const { data: car, error: carError } = await supabase
        .from('cars')
        .select('id, daily_rate')
        .eq('id', bookingData.carId)
        .single();

      if (carError) {
        throw new Error('Failed to get car details');
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

      // Note: We don't update car status to 'booked' anymore
      // The car remains 'available' and we check date conflicts instead

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

  static async checkCarAvailabilityForDates(carId, pickupDate, returnDate) {
    try {
      console.log(`Checking availability for car ${carId} from ${pickupDate} to ${returnDate}`);
      
      // Check if there are any existing bookings for this car that overlap with the requested dates
      // A booking conflicts if:
      // - The booking starts before or on the requested return date AND
      // - The booking ends after or on the requested pickup date
      const { data: conflictingBookings, error } = await supabase
        .from('bookings')
        .select('id, pickup_date, return_date, status')
        .eq('car_id', carId)
        .in('status', ['confirmed', 'active'])
        .or(`and(pickup_date.lte.${returnDate},return_date.gte.${pickupDate})`);

      if (error) {
        console.error('Error checking date conflicts:', error);
        return false; // If we can't check, assume not available for safety
      }

      const isAvailable = !conflictingBookings || conflictingBookings.length === 0;
      
      if (conflictingBookings && conflictingBookings.length > 0) {
        console.log(`Car ${carId} has ${conflictingBookings.length} conflicting bookings:`, conflictingBookings);
      } else {
        console.log(`Car ${carId} is available for the requested dates`);
      }

      return isAvailable;
    } catch (error) {
      console.error('Date availability check failed:', error);
      return false;
    }
  }

  static async getCarAvailabilityForDateRange(carId, startDate, endDate) {
    try {
      // Get all bookings for this car in the date range
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('pickup_date, return_date, status')
        .eq('car_id', carId)
        .in('status', ['confirmed', 'active'])
        .gte('pickup_date', startDate)
        .lte('return_date', endDate);

      if (error) {
        console.error('Error getting car availability:', error);
        return { available: false, error: error.message };
      }

      return {
        available: !bookings || bookings.length === 0,
        bookings: bookings || []
      };
    } catch (error) {
      console.error('Car availability check failed:', error);
      return { available: false, error: error.message };
    }
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

      // A car is available if its status is 'available' (not 'maintenance' or 'out_of_service')
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

      // Note: We don't need to update car status anymore
      // The car remains 'available' and date conflicts are checked dynamically

      return { success: true };
    } catch (error) {
      console.error('Booking cancellation failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async testAvailabilityLogic() {
    try {
      console.log('Testing availability logic...');
      
      // Get all cars
      const { data: cars, error: carsError } = await supabase
        .from('cars')
        .select('id, brand, model')
        .limit(3);

      if (carsError) {
        console.error('Error fetching cars for test:', carsError);
        return;
      }

      // Get all bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('car_id, pickup_date, return_date, status')
        .in('status', ['confirmed', 'active']);

      if (bookingsError) {
        console.error('Error fetching bookings for test:', bookingsError);
        return;
      }

      console.log('Test data:', {
        cars: cars?.length || 0,
        bookings: bookings?.length || 0,
        sampleBookings: bookings?.slice(0, 3)
      });

      // Test availability for a sample date range
      const testPickupDate = '2024-12-20';
      const testReturnDate = '2024-12-25';

      for (const car of cars || []) {
        const isAvailable = await this.checkCarAvailabilityForDates(
          car.id,
          testPickupDate,
          testReturnDate
        );
        console.log(`Test: Car ${car.id} (${car.brand} ${car.model}) availability for ${testPickupDate} to ${testReturnDate}:`, isAvailable);
      }

    } catch (error) {
      console.error('Availability logic test failed:', error);
    }
  }
}

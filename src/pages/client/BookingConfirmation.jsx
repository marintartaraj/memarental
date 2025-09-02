import React, { useEffect, useState } from 'react';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Car, Phone, Mail, Download, Printer } from 'lucide-react';
import { BookingService } from '@/lib/bookingService';
import { toast } from '@/components/ui/use-toast';

function BookingConfirmation() {
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const { bookingId } = location.state || {};
        
        if (bookingId) {
          const result = await BookingService.getBookingById(bookingId);
          if (result.success) {
            setBooking(result.booking);
          } else {
            setError(result.error);
          }
        } else {
          setError('No booking information found');
        }
      } catch (err) {
        setError('Failed to load booking details');
        console.error('Error loading booking:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [location.state]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text version of the booking details
    const bookingText = `
MEMA Rental - Booking Confirmation

Booking Reference: ${booking?.booking_reference}
Car: ${booking?.cars?.brand} ${booking?.cars?.model} (${booking?.cars?.year})

Customer Details:
Name: ${booking?.customer_name}
Email: ${booking?.customer_email}
Phone: ${booking?.customer_phone}

Rental Details:
Pickup: ${formatDate(booking?.pickup_date)} at ${formatTime(booking?.pickup_time)}
Return: ${formatDate(booking?.return_date)} at ${formatTime(booking?.return_time)}
Pickup Location: ${booking?.pickup_location}
Return Location: ${booking?.return_location}

Total Price: €${booking?.total_price}

Status: ${booking?.status?.toUpperCase()}

Thank you for choosing MEMA Rental!
    `;

    const blob = new Blob([bookingText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking?.booking_reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center border-0">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'We couldn\'t find your booking details. Please contact us for assistance.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600">
              <Link to="/cars">Back to Cars</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`Booking Confirmed - ${booking.booking_reference} - MEMA Rental`}
        description={`Your car rental booking has been confirmed. Booking reference: ${booking.booking_reference}`}
        path="/booking-confirmation"
        image="/images/cars/placeholder-car.jpg"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-0 mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your reservation. Your booking has been successfully created.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
              <p className="text-yellow-800 font-semibold">
                Booking Reference: <span className="text-yellow-600">{booking.booking_reference}</span>
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Car className="h-5 w-5 mr-2 text-yellow-600" />
                Car Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Car className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {booking.cars?.brand} {booking.cars?.model}
                    </h3>
                    <p className="text-gray-600">Year: {booking.cars?.year}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-2xl font-bold text-yellow-600">
                    €{booking.total_price}
                  </p>
                  <p className="text-sm text-gray-600">Total rental cost</p>
                </div>
              </div>
            </div>

            {/* Rental Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-yellow-600" />
                Rental Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Pickup</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.pickup_date)} at {formatTime(booking.pickup_time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Return</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.return_date)} at {formatTime(booking.return_time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Pickup Location</p>
                    <p className="text-sm text-gray-600">{booking.pickup_location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Return Location</p>
                    <p className="text-sm text-gray-600">{booking.return_location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-0 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-800">{booking.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{booking.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-800">{booking.customer_phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Number</p>
                <p className="font-medium text-gray-800">{booking.license_number}</p>
              </div>
            </div>
            {booking.special_requests && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">Special Requests</p>
                <p className="text-gray-800">{booking.special_requests}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-0 mt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handlePrint} variant="outline" className="flex items-center space-x-2">
                <Printer className="h-4 w-4" />
                <span>Print Confirmation</span>
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download Details</span>
              </Button>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600">
                <Link to="/cars">Book Another Car</Link>
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-0 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">Call Us</p>
                  <p className="text-sm text-gray-600">+355 4 123 4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Email Us</p>
                  <p className="text-sm text-gray-600">info@memarental.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-800">Visit Us</p>
                  <p className="text-sm text-gray-600">Tirana City Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingConfirmation;
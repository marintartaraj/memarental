/**
 * Booking Mobile Cards Component
 * Displays bookings in card format for mobile devices
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  Mail,
  Phone,
  MapPin,
  Car,
  Calendar
} from 'lucide-react';

const BookingMobileCards = ({
  bookings,
  selectedBookings,
  onSelectBooking,
  onEditBooking,
  onDeleteBooking
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <Clock className="h-4 w-4" />;
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const calculateDuration = (pickupDate, returnDate) => {
    const days = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getDaysUntilPickup = (pickupDate) => {
    const days = Math.ceil((new Date(pickupDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (bookings.length === 0) {
    return (
      <Card className="p-8 text-center border-0 shadow-sm">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-500 mb-4">
          Try adjusting your search or filter criteria.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Getting Started:</strong> When customers make bookings through your website, they will appear here for you to manage.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="border-0 shadow-sm hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedBookings.includes(booking.id)}
                    onChange={() => onSelectBooking(booking.id)}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    aria-label={`Select booking for ${booking.profiles?.full_name}`}
                  />
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {booking.profiles?.full_name || 'Unknown Customer'}
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    <span className="truncate">{booking.profiles?.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" aria-hidden="true" />
                    <span>{booking.cars?.brand} {booking.cars?.model} ({booking.cars?.year})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <span>{booking.pickup_date} - {booking.return_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>{calculateDuration(booking.pickup_date, booking.return_date)} days</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(booking.status)}
                    <span>{booking.status}</span>
                  </div>
                </span>
                <div className="text-xl font-bold text-yellow-600">€{booking.total_price}</div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditBooking(booking)}
                  className="text-gray-600 hover:text-yellow-600"
                  aria-label={`Edit booking for ${booking.profiles?.full_name}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeleteBooking(booking.id)}
                  className="text-gray-600 hover:text-red-600"
                  aria-label={`Delete booking for ${booking.profiles?.full_name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {booking.status === 'confirmed' && (
                <div className="text-xs text-blue-600">
                  {getDaysUntilPickup(booking.pickup_date) > 0 
                    ? `${getDaysUntilPickup(booking.pickup_date)} days until pickup`
                    : 'Pickup today'
                  }
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingMobileCards;


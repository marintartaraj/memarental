/**
 * Booking Table Component
 * Displays bookings in table format for desktop
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const BookingTable = ({
  bookings,
  selectedBookings,
  onSelectAll,
  onSelectBooking,
  onEditBooking,
  onDeleteBooking,
  sortField,
  sortDirection,
  onSort
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

  const getSortIcon = (field) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 text-gray-400" />;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
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
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedBookings.length === bookings.length && bookings.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  aria-label="Select all bookings"
                />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('customer')}
                role="columnheader"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSort('customer')}
              >
                <div className="flex items-center gap-1">
                  Customer
                  {getSortIcon('customer')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('car')}
                role="columnheader"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSort('car')}
              >
                <div className="flex items-center gap-1">
                  Car
                  {getSortIcon('car')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('pickup_date')}
                role="columnheader"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSort('pickup_date')}
              >
                <div className="flex items-center gap-1">
                  Dates
                  {getSortIcon('pickup_date')}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('total_price')}
                role="columnheader"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSort('total_price')}
              >
                <div className="flex items-center gap-1">
                  Total
                  {getSortIcon('total_price')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('status')}
                role="columnheader"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedBookings.includes(booking.id)}
                    onChange={() => onSelectBooking(booking.id)}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    aria-label={`Select booking for ${booking.profiles?.full_name}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">
                      {booking.profiles?.full_name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.profiles?.email || 'No email'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">
                      {booking.cars?.brand} {booking.cars?.model}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.cars?.year} • {booking.cars?.transmission}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{booking.pickup_date}</div>
                    <div className="text-sm text-gray-500">to {booking.return_date}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {calculateDuration(booking.pickup_date, booking.return_date)} days
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-semibold text-yellow-600">
                    €{booking.total_price}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">{booking.status}</span>
                  </span>
                  {booking.status === 'confirmed' && (
                    <div className="text-xs text-blue-600 mt-1">
                      {getDaysUntilPickup(booking.pickup_date) > 0 
                        ? `${getDaysUntilPickup(booking.pickup_date)} days until pickup`
                        : 'Pickup today'
                      }
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEditBooking(booking)}
                      className="text-gray-500 hover:text-yellow-600"
                      aria-label={`Edit booking for ${booking.profiles?.full_name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDeleteBooking(booking.id)}
                      className="text-gray-500 hover:text-red-600"
                      aria-label={`Delete booking for ${booking.profiles?.full_name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default BookingTable;


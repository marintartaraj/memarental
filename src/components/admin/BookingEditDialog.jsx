/**
 * Booking Edit Dialog Component
 * Modal for editing booking details
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit } from 'lucide-react';

const BookingEditDialog = ({
  isOpen,
  onClose,
  bookingFormData,
  setBookingFormData,
  bookedDates,
  loadingBookedDates,
  dateValidationErrors,
  onDateChange,
  onSubmit,
  editingBooking
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Booking
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={bookingFormData.status} 
              onValueChange={value => setBookingFormData({...bookingFormData, status: value})}
            >
              <SelectTrigger id="status" aria-label="Booking status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickup_date">Pickup Date</Label>
              <DatePicker
                value={bookingFormData.pickup_date}
                onChange={(value) => onDateChange('pickup_date', value)}
                placeholder="Select pickup date"
                minDate={new Date().toISOString().split('T')[0]}
                bookedDates={bookedDates}
                disabled={loadingBookedDates}
                loadingBookedDates={loadingBookedDates}
                className={`mt-1 ${dateValidationErrors.pickup_date ? 'border-red-500 focus:border-red-500' : ''}`}
                rangeStart={bookingFormData.pickup_date}
                rangeEnd={bookingFormData.return_date}
                aria-label="Pickup date"
              />
              {dateValidationErrors.pickup_date && (
                <p className="text-sm text-red-600 mt-1" role="alert">
                  {dateValidationErrors.pickup_date}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="return_date">Return Date</Label>
              <DatePicker
                value={bookingFormData.return_date}
                onChange={(value) => onDateChange('return_date', value)}
                placeholder="Select return date"
                minDate={bookingFormData.pickup_date || new Date().toISOString().split('T')[0]}
                bookedDates={bookedDates}
                disabled={loadingBookedDates}
                loadingBookedDates={loadingBookedDates}
                className={`mt-1 ${dateValidationErrors.return_date ? 'border-red-500 focus:border-red-500' : ''}`}
                rangeStart={bookingFormData.pickup_date}
                rangeEnd={bookingFormData.return_date}
                aria-label="Return date"
              />
              {dateValidationErrors.return_date && (
                <p className="text-sm text-red-600 mt-1" role="alert">
                  {dateValidationErrors.return_date}
                </p>
              )}
            </div>
          </div>
          
          {dateValidationErrors.date_range && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200" role="alert">
              <p className="text-sm">{dateValidationErrors.date_range}</p>
            </div>
          )}
          
          <div>
            <Label htmlFor="total_price">Total Price (€)</Label>
            <Input 
              id="total_price"
              type="number" 
              step="0.01" 
              value={bookingFormData.total_price} 
              onChange={e => setBookingFormData({...bookingFormData, total_price: e.target.value})} 
              required
              aria-label="Total price in euros"
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes"
              value={bookingFormData.notes} 
              onChange={e => setBookingFormData({...bookingFormData, notes: e.target.value})} 
              placeholder="Additional notes..."
              aria-label="Additional notes"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-yellow-500 hover:bg-yellow-600"
            aria-label="Update booking"
          >
            Update Booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingEditDialog;


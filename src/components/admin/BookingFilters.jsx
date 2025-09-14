/**
 * Booking Filters Component
 * Handles search, status, and date filtering
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar as CalendarIcon } from 'lucide-react';

const BookingFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  selectedBookings,
  onBulkDelete,
  onClearSelection,
  totalCount,
  filteredCount,
  currentPage,
  totalPages
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
                aria-hidden="true"
              />
              <Input
                placeholder="Search by customer name, email, or car..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
                aria-label="Search bookings"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48" aria-label="Filter by status">
                <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full lg:w-48" aria-label="Filter by date">
                <CalendarIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="past">Past Bookings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Bulk Actions */}
          {selectedBookings.length > 0 && (
            <div 
              className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200"
              role="region"
              aria-label="Bulk actions for selected bookings"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-yellow-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {selectedBookings.length}
                  </span>
                </div>
                <span className="text-sm font-medium text-yellow-800">
                  {selectedBookings.length} booking{selectedBookings.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onBulkDelete}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded border border-red-200 transition-colors"
                  aria-label={`Delete ${selectedBookings.length} selected bookings`}
                >
                  Delete Selected
                </button>
                <button
                  onClick={onClearSelection}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded border border-gray-200 transition-colors"
                  aria-label="Clear selection"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredCount} of {totalCount} bookings
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingFilters;


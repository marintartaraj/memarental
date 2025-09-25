/**
 * Admin Bookings Page - Refactored
 * Uses smaller, focused components and global state management
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw,
  FileText,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import useAdminStore from '@/stores/adminStore';
import BookingStatsCards from '@/components/admin/BookingStatsCards';
import BookingFilters from '@/components/admin/BookingFilters';
import BookingTable from '@/components/admin/BookingTable';
import BookingMobileCards from '@/components/admin/BookingMobileCards';
import BookingEditDialog from '@/components/admin/BookingEditDialog';
import { errorHandler } from '@/lib/errorHandler';
import { toast } from '@/components/ui/use-toast.jsx';

const AdminBookingsRefactored = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Global state from Zustand store
  const {
    bookings,
    bookingsLoading,
    bookingsError,
    bookingsStats,
    currentPage,
    itemsPerPage,
    totalPages,
    totalCount,
    searchTerm,
    statusFilter,
    dateFilter,
    sortField,
    sortDirection,
    selectedBookings,
    editingBooking,
    isBookingDialogOpen,
    bookingFormData,
    bookedDates,
    loadingBookedDates,
    dateValidationErrors,
    refreshing,
    
    // Actions
    loadBookings,
    loadBookingStats,
    updateBooking,
    deleteBooking,
    bulkDeleteBookings,
    loadBookedDatesForCar,
    exportBookings,
    handleEditBooking,
    resetBookingForm,
    handleSelectAll,
    handleSelectBooking,
    handleSort,
    setSearchTerm,
    setStatusFilter,
    setDateFilter,
    setCurrentPage,
    setIsBookingDialogOpen,
    setBookingFormData,
    setDateValidationErrors
  } = useAdminStore();

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadBookings();
      loadBookingStats();
    }
  }, [user, loadBookings, loadBookingStats]);

  // Handle booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate date overlap before submitting
    const dateErrors = validateDateOverlap(bookingFormData.pickup_date, bookingFormData.return_date);
    if (Object.keys(dateErrors).length > 0) {
      setDateValidationErrors(dateErrors);
      toast({ 
        title: "Date Conflict", 
        description: "The selected dates conflict with existing bookings. Please choose different dates.", 
        variant: "destructive" 
      });
      return;
    }
    
    try {
      await updateBooking(editingBooking.id, bookingFormData);
      setIsBookingDialogOpen(false);
      resetBookingForm();
      toast({ 
        title: "Booking Updated", 
        description: "Booking has been updated successfully." 
      });
    } catch (error) {
      toast({ 
        title: "Update Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteBooking(bookingId);
      toast({ 
        title: "Booking Deleted", 
        description: "The booking has been removed." 
      });
    } catch (error) {
      toast({ 
        title: "Delete Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedBookings.length} bookings? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await bulkDeleteBookings(selectedBookings);
      toast({ 
        title: "Bulk Delete Successful", 
        description: `${selectedBookings.length} bookings have been removed.` 
      });
    } catch (error) {
      toast({ 
        title: "Bulk Delete Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      await exportBookings();
      toast({
        title: "Export successful",
        description: `Exported ${bookings.length} bookings to CSV.`
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Validate date overlap
  const validateDateOverlap = (pickupDate, returnDate) => {
    const errors = {};
    
    if (pickupDate && isDateBooked(pickupDate)) {
      errors.pickup_date = 'This pickup date is already booked. Please select a different date.';
    }
    
    if (returnDate && isDateBooked(returnDate)) {
      errors.return_date = 'This return date is already booked. Please select a different date.';
    }
    
    // Check if any date in the range is booked
    if (pickupDate && returnDate) {
      const startDate = new Date(pickupDate);
      const endDate = new Date(returnDate);
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        if (isDateBooked(currentDate.toISOString().split('T')[0])) {
          errors.date_range = 'Some dates in this range are already booked. Please select different dates.';
          break;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    return errors;
  };

  // Check if a date is booked
  const isDateBooked = (dateString) => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === selectedDate.toDateString()
    );
  };

  // Handle date changes and clear validation errors
  const handleDateChange = (field, value) => {
    setBookingFormData({
      ...bookingFormData,
      [field]: value
    });
    
    // Clear validation errors for this field
    if (dateValidationErrors[field]) {
      setDateValidationErrors({
        ...dateValidationErrors,
        [field]: null
      });
    }
    
    // Clear date range error if it exists
    if (dateValidationErrors.date_range) {
      setDateValidationErrors({
        ...dateValidationErrors,
        date_range: null
      });
    }
  };

  // Handle dialog close
  const handleDialogClose = (isOpen) => {
    setIsBookingDialogOpen(isOpen);
    if (!isOpen) {
      resetBookingForm();
    }
  };

  // Handle clear selection
  const handleClearSelection = () => {
    useAdminStore.getState().setSelectedBookings([]);
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      loadBookings();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      loadBookings();
    }
  };

  // Loading state
  if (bookingsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        
        <BookingStatsCards stats={null} />
        
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  // Error state
  if (bookingsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Bookings</h3>
          <p className="text-gray-600 mb-4 text-sm">{bookingsError}</p>
          <div className="space-y-3">
            <Button onClick={() => loadBookings()} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Bookings - MEMA Rental Admin</title>
        <meta name="description" content="Manage bookings and reservations for MEMA Rental" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('manageBookings')}</h1>
            <p className="text-gray-600 mt-1">Manage and track all rental bookings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              aria-label="Export bookings data"
            >
              <FileText className="h-4 w-4" />
              Export {selectedBookings.length > 0 ? `(${selectedBookings.length})` : ''}
            </Button>
            <Button 
              onClick={() => loadBookings(true)}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              aria-label="Refresh bookings data"
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <BookingStatsCards stats={bookingsStats} />

        {/* Filters */}
        <BookingFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          selectedBookings={selectedBookings}
          onBulkDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
          totalCount={totalCount}
          filteredCount={bookings.length}
          currentPage={currentPage}
          totalPages={totalPages}
        />

        {/* Mobile Cards View */}
        <div className="lg:hidden">
          <BookingMobileCards
            bookings={bookings}
            selectedBookings={selectedBookings}
            onSelectBooking={handleSelectBooking}
            onEditBooking={handleEditBooking}
            onDeleteBooking={handleDeleteBooking}
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <BookingTable
            bookings={bookings}
            selectedBookings={selectedBookings}
            onSelectAll={handleSelectAll}
            onSelectBooking={handleSelectBooking}
            onEditBooking={handleEditBooking}
            onDeleteBooking={handleDeleteBooking}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, bookings.length)} of {bookings.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setCurrentPage(page);
                        loadBookings();
                      }}
                      className="w-8 h-8 p-0"
                      aria-label={`Go to page ${page}`}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Edit Booking Dialog */}
        <BookingEditDialog
          isOpen={isBookingDialogOpen}
          onClose={handleDialogClose}
          bookingFormData={bookingFormData}
          setBookingFormData={setBookingFormData}
          bookedDates={bookedDates}
          loadingBookedDates={loadingBookedDates}
          dateValidationErrors={dateValidationErrors}
          onDateChange={handleDateChange}
          onSubmit={handleBookingSubmit}
          editingBooking={editingBooking}
        />
      </div>
    </>
  );
};

export default AdminBookingsRefactored;


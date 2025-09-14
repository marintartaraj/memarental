/**
 * Admin Store
 * Global state management for admin functionality using Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { bookingService } from '@/lib/bookingService';
import { errorHandler } from '@/lib/errorHandler';

const useAdminStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        bookings: [],
        bookingsLoading: false,
        bookingsError: null,
        bookingsStats: null,
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 0,
        totalCount: 0,
        searchTerm: '',
        statusFilter: 'all',
        dateFilter: 'all',
        sortField: 'created_at',
        sortDirection: 'desc',
        selectedBookings: [],
        editingBooking: null,
        isBookingDialogOpen: false,
        bookingFormData: {
          status: 'confirmed',
          pickup_date: '',
          return_date: '',
          total_price: '',
          notes: ''
        },
        bookedDates: [],
        loadingBookedDates: false,
        dateValidationErrors: {},
        refreshing: false,

        // Actions
        setBookings: (bookings) => set({ bookings }),
        
        setBookingsLoading: (loading) => set({ bookingsLoading: loading }),
        
        setBookingsError: (error) => set({ bookingsError: error }),
        
        setBookingsStats: (stats) => set({ bookingsStats: stats }),
        
        setCurrentPage: (page) => set({ currentPage: page }),
        
        setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
        
        setTotalPages: (totalPages) => set({ totalPages }),
        
        setTotalCount: (totalCount) => set({ totalCount }),
        
        setSearchTerm: (searchTerm) => set({ searchTerm }),
        
        setStatusFilter: (statusFilter) => set({ statusFilter }),
        
        setDateFilter: (dateFilter) => set({ dateFilter }),
        
        setSortField: (sortField) => set({ sortField }),
        
        setSortDirection: (sortDirection) => set({ sortDirection }),
        
        setSelectedBookings: (selectedBookings) => set({ selectedBookings }),
        
        setEditingBooking: (editingBooking) => set({ editingBooking }),
        
        setIsBookingDialogOpen: (isOpen) => set({ isBookingDialogOpen: isOpen }),
        
        setBookingFormData: (formData) => set({ bookingFormData: formData }),
        
        setBookedDates: (dates) => set({ bookedDates: dates }),
        
        setLoadingBookedDates: (loading) => set({ loadingBookedDates: loading }),
        
        setDateValidationErrors: (errors) => set({ dateValidationErrors: errors }),
        
        setRefreshing: (refreshing) => set({ refreshing }),

        // Complex actions
        loadBookings: async (showRefreshing = false) => {
          const state = get();
          
          if (showRefreshing) {
            set({ refreshing: true });
          } else {
            set({ bookingsLoading: true });
          }
          
          set({ bookingsError: null });

          try {
            const result = await bookingService.getBookings({
              page: state.currentPage,
              limit: state.itemsPerPage,
              search: state.searchTerm,
              status: state.statusFilter,
              dateFilter: state.dateFilter,
              sortField: state.sortField,
              sortDirection: state.sortDirection
            });

            set({
              bookings: result.bookings,
              totalPages: result.totalPages,
              totalCount: result.totalCount,
              hasNextPage: result.hasNextPage,
              hasPreviousPage: result.hasPreviousPage
            });

            // Load stats if not already loaded
            if (!state.bookingsStats) {
              const stats = await bookingService.getBookingStats();
              set({ bookingsStats: stats });
            }

          } catch (error) {
            await errorHandler.handleError(error, { action: 'loadBookings' }, 'high');
            set({ bookingsError: error.message });
          } finally {
            set({ 
              bookingsLoading: false, 
              refreshing: false 
            });
          }
        },

        loadBookingStats: async () => {
          try {
            const stats = await bookingService.getBookingStats();
            set({ bookingsStats: stats });
          } catch (error) {
            await errorHandler.handleError(error, { action: 'loadBookingStats' }, 'medium');
          }
        },

        updateBooking: async (bookingId, updates) => {
          try {
            await bookingService.updateBooking(bookingId, updates);
            await get().loadBookings();
          } catch (error) {
            await errorHandler.handleError(error, { action: 'updateBooking', bookingId, updates }, 'high');
            throw error;
          }
        },

        deleteBooking: async (bookingId) => {
          try {
            await bookingService.deleteBooking(bookingId);
            await get().loadBookings();
          } catch (error) {
            await errorHandler.handleError(error, { action: 'deleteBooking', bookingId }, 'high');
            throw error;
          }
        },

        bulkDeleteBookings: async (bookingIds) => {
          try {
            await bookingService.bulkDeleteBookings(bookingIds);
            set({ selectedBookings: [] });
            await get().loadBookings();
          } catch (error) {
            await errorHandler.handleError(error, { action: 'bulkDeleteBookings', bookingIds }, 'high');
            throw error;
          }
        },

        loadBookedDatesForCar: async (carId, excludeBookingId = null) => {
          set({ loadingBookedDates: true });
          try {
            const dates = await bookingService.getBookedDatesForCar(carId, excludeBookingId);
            set({ bookedDates: dates });
          } catch (error) {
            await errorHandler.handleError(error, { action: 'loadBookedDatesForCar', carId }, 'medium');
          } finally {
            set({ loadingBookedDates: false });
          }
        },

        exportBookings: async () => {
          try {
            const csvContent = await bookingService.exportBookings({
              search: get().searchTerm,
              status: get().statusFilter,
              dateFilter: get().dateFilter,
              sortField: get().sortField,
              sortDirection: get().sortDirection
            });

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookings-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            return csvContent;
          } catch (error) {
            await errorHandler.handleError(error, { action: 'exportBookings' }, 'medium');
            throw error;
          }
        },

        handleEditBooking: (booking) => {
          set({
            editingBooking: booking,
            bookingFormData: {
              status: booking.status,
              pickup_date: booking.pickup_date,
              return_date: booking.return_date,
              total_price: booking.total_price,
              notes: booking.notes || ''
            },
            isBookingDialogOpen: true
          });

          // Load booked dates for this car
          if (booking.car_id) {
            get().loadBookedDatesForCar(booking.car_id, booking.id);
          }
        },

        resetBookingForm: () => {
          set({
            editingBooking: null,
            bookingFormData: {
              status: 'confirmed',
              pickup_date: '',
              return_date: '',
              total_price: '',
              notes: ''
            },
            bookedDates: [],
            dateValidationErrors: {}
          });
        },

        handleSelectAll: () => {
          const state = get();
          const paginatedBookings = state.bookings.slice(
            (state.currentPage - 1) * state.itemsPerPage,
            state.currentPage * state.itemsPerPage
          );

          if (state.selectedBookings.length === paginatedBookings.length) {
            set({ selectedBookings: [] });
          } else {
            set({ selectedBookings: paginatedBookings.map(b => b.id) });
          }
        },

        handleSelectBooking: (bookingId) => {
          const state = get();
          set({
            selectedBookings: state.selectedBookings.includes(bookingId)
              ? state.selectedBookings.filter(id => id !== bookingId)
              : [...state.selectedBookings, bookingId]
          });
        },

        handleSort: (field) => {
          const state = get();
          if (state.sortField === field) {
            set({ sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' });
          } else {
            set({ sortField: field, sortDirection: 'asc' });
          }
          get().loadBookings();
        },

        // Reset all filters
        resetFilters: () => {
          set({
            searchTerm: '',
            statusFilter: 'all',
            dateFilter: 'all',
            sortField: 'created_at',
            sortDirection: 'desc',
            currentPage: 1,
            selectedBookings: []
          });
        },

        // Clear all data
        clearData: () => {
          set({
            bookings: [],
            bookingsStats: null,
            bookingsError: null,
            selectedBookings: [],
            editingBooking: null,
            isBookingDialogOpen: false,
            bookingFormData: {
              status: 'confirmed',
              pickup_date: '',
              return_date: '',
              total_price: '',
              notes: ''
            },
            bookedDates: [],
            dateValidationErrors: {}
          });
        }
      }),
      {
        name: 'admin-store',
        partialize: (state) => ({
          // Only persist certain state
          itemsPerPage: state.itemsPerPage,
          searchTerm: state.searchTerm,
          statusFilter: state.statusFilter,
          dateFilter: state.dateFilter,
          sortField: state.sortField,
          sortDirection: state.sortDirection
        })
      }
    ),
    {
      name: 'admin-store'
    }
  )
);

export default useAdminStore;


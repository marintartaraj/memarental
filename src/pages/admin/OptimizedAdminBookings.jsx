import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Eye,
  Clock,
  DollarSign,
  Users,
  FileText,
  Calendar as CalendarIcon,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Square,
  Mail,
  Phone,
  MapPin,
  Car
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast.jsx';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { optimizedBookingService } from '@/lib/optimizedBookingService';

const OptimizedAdminBookings = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // Form state for creating/editing bookings
  const [bookingForm, setBookingForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    car_id: '',
    pickup_date: '',
    return_date: '',
    total_price: '',
    notes: '',
    status: 'confirmed'
  });

  const loadData = useCallback(async (page = 1, showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      
      // Use optimized service with pagination
      const result = await optimizedBookingService.getBookingsPaginated(
        page, 
        itemsPerPage, 
        {
          search: searchTerm,
          status: statusFilter,
          date: dateFilter
        }
      );
      
      setBookings(result.data);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      
      
    } catch (error) {
      console.error('❌ Error loading bookings:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error Loading Bookings",
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, statusFilter, dateFilter]);

  // Load data on component mount and when filters change
  useEffect(() => {
    loadData(1);
  }, [loadData]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    loadData(newPage);
  }, [loadData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    // Clear cache and reload
    optimizedBookingService.clearCache();
    loadData(currentPage, true);
  }, [loadData, currentPage]);

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  // Handle status filter
  const handleStatusFilter = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  // Handle date filter
  const handleDateFilter = useCallback((value) => {
    setDateFilter(value);
    setCurrentPage(1);
  }, []);

  // Handle booking selection
  const handleBookingSelect = useCallback((bookingId) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  }, []);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(bookings.map(booking => booking.id));
    }
  }, [selectedBookings.length, bookings]);

  // Handle create booking
  const handleCreateBooking = useCallback(async () => {
    try {
      await optimizedBookingService.createBooking(bookingForm);
      toast({
        title: "Success",
        description: "Booking created successfully!",
      });
      setShowCreateDialog(false);
      setBookingForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        car_id: '',
        pickup_date: '',
        return_date: '',
        total_price: '',
        notes: '',
        status: 'confirmed'
      });
      handleRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }, [bookingForm, handleRefresh]);

  // Handle edit booking
  const handleEditBooking = useCallback(async () => {
    try {
      await optimizedBookingService.updateBooking(editingBooking.id, bookingForm);
      toast({
        title: "Success",
        description: "Booking updated successfully!",
      });
      setShowEditDialog(false);
      setEditingBooking(null);
      handleRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }, [editingBooking, bookingForm, handleRefresh]);

  // Handle delete booking
  const handleDeleteBooking = useCallback(async (bookingId) => {
    try {
      await optimizedBookingService.deleteBooking(bookingId);
      toast({
        title: "Success",
        description: "Booking deleted successfully!",
      });
      handleRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }, [handleRefresh]);

  // Filtered and sorted bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = !searchTerm || 
        booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Cache statistics
  const cacheStats = useMemo(() => {
    return optimizedBookingService.getCacheStats();
  }, [bookings]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Helmet>
        <title>Admin Bookings - MEMA Rental</title>
        <meta name="description" content="Manage bookings and reservations" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
              <p className="text-gray-600 mt-2">Manage all bookings and reservations</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Cache Stats */}
              <div className="text-sm text-gray-500">
                Cache: {cacheStats.size}/{cacheStats.maxSize} items
              </div>
              <Button onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${bookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={handleDateFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedBookings.length === bookings.length ? (
                    <CheckSquare className="w-4 h-4 mr-2" />
                  ) : (
                    <Square className="w-4 h-4 mr-2" />
                  )}
                  Select All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading bookings...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
                <Button onClick={handleRefresh} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`border rounded-lg p-4 ${
                      selectedBookings.includes(booking.id) ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.id)}
                          onChange={() => handleBookingSelect(booking.id)}
                          className="rounded"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {booking.profiles?.full_name || booking.customer_name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              {booking.cars?.brand} {booking.cars?.model}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              ${booking.total_price}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingBooking(booking);
                            
                            // Format dates for HTML date inputs (YYYY-MM-DD format)
                            const formatDateForInput = (dateString) => {
                              if (!dateString) return '';
                              
                              // If it's already in YYYY-MM-DD format, return as is
                              if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                                return dateString;
                              }
                              
                              // Otherwise, parse and format the date
                              const date = new Date(dateString);
                              if (isNaN(date.getTime())) {
                                console.warn('Invalid date format:', dateString);
                                return '';
                              }
                              
                              return date.toISOString().split('T')[0];
                            };
                            
                            setBookingForm({
                              customer_name: booking.customer_name || '',
                              customer_email: booking.customer_email || '',
                              customer_phone: booking.customer_phone || '',
                              car_id: booking.car_id || '',
                              pickup_date: formatDateForInput(booking.pickup_date) || '',
                              return_date: formatDateForInput(booking.return_date) || '',
                              total_price: booking.total_price || '',
                              notes: booking.notes || '',
                              status: booking.status || 'confirmed'
                            });
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} bookings
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Booking Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleEditBooking();
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  id="customer_name"
                  value={bookingForm.customer_name}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, customer_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customer_email">Customer Email</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={bookingForm.customer_email}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, customer_email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_phone">Customer Phone</Label>
                <Input
                  id="customer_phone"
                  value={bookingForm.customer_phone}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, customer_phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="total_price">Total Price</Label>
                <Input
                  id="total_price"
                  type="number"
                  step="0.01"
                  value={bookingForm.total_price}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, total_price: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickup_date">Pickup Date</Label>
                <Input
                  id="pickup_date"
                  type="date"
                  value={bookingForm.pickup_date}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, pickup_date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="return_date">Return Date</Label>
                <Input
                  id="return_date"
                  type="date"
                  value={bookingForm.return_date}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, return_date: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={bookingForm.status} onValueChange={(value) => setBookingForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Booking
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OptimizedAdminBookings;

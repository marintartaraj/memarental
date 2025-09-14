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
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const AdminBookings = () => {
  const { t } = useLanguage();
  const { user } = useAuth(); // Add this line to get the current user
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingBooking, setEditingBooking] = useState(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    status: 'confirmed',
    pickup_date: '',
    return_date: '',
    total_price: '',
    notes: ''
  });
  const [bookedDates, setBookedDates] = useState([]);
  const [loadingBookedDates, setLoadingBookedDates] = useState(false);
  const [dateValidationErrors, setDateValidationErrors] = useState({});

  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      console.log('🔍 Starting to load bookings data...');
      console.log('👤 Current user:', user?.email || 'Not authenticated');
      
      // Check if user is authenticated
      if (!user) {
        throw new Error('User not authenticated. Please log in first.');
      }
      
      // Test 1: Check if we can access the bookings table at all
      console.log('Test 1: Checking basic table access...');
      const { data: basicTest, error: basicError } = await supabase
        .from('bookings')
        .select('id')
        .limit(1);
      
      if (basicError) {
        console.error('Basic table access failed:', basicError);
        throw new Error(`Basic table access failed: ${basicError.message}`);
      }
      
      console.log('Basic table access successful');
      
      // Test 2: Check if we can access with relationships
      console.log('Test 2: Checking relationships access...');
      const { data: relationshipTest, error: relationshipError } = await supabase
        .from('bookings')
        .select(`
          id,
          user_id,
          customer_name,
          customer_email
        `)
        .limit(1);
      
      if (relationshipError) {
        console.error('Relationship access failed:', relationshipError);
        throw new Error(`Relationship access failed: ${relationshipError.message}`);
      }
      
      console.log('Relationship access successful');
      
      // Test 3: Check if we can access cars table
      console.log('Test 3: Checking cars table access...');
      const { data: carsTest, error: carsError } = await supabase
        .from('cars')
        .select('id, brand, model')
        .limit(1);
      
      if (carsError) {
        console.error('Cars table access failed:', carsError);
        throw new Error(`Cars table access failed: ${carsError.message}`);
      }
      
      console.log('Cars table access successful');
      
      // Now load the full data
      console.log('Loading full bookings data...');
      const { data: fullBookingsData, error: fullError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fullError) {
        console.error('Full data loading error:', fullError);
        throw new Error(`Full data loading error: ${fullError.message}`);
      }
      
      // Fetch profile and car data separately for each booking
      const bookingsWithProfiles = await Promise.all(
        (fullBookingsData || []).map(async (booking) => {
          let profile = null;
          let car = null;
          
          // Fetch profile data if user_id exists
          if (booking.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, email, phone')
              .eq('id', booking.user_id)
              .single();
            profile = profileData;
          } else {
            // For anonymous bookings, use customer details from the booking
            profile = {
              full_name: booking.customer_name || 'Anonymous Customer',
              email: booking.customer_email || 'No email',
              phone: booking.customer_phone || 'No phone'
            };
          }
          
          // Fetch car data
          if (booking.car_id) {
            const { data: carData } = await supabase
              .from('cars')
              .select('brand, model, daily_rate, year, transmission, fuel_type')
              .eq('id', booking.car_id)
              .single();
            car = carData;
          }
          
          return {
            ...booking,
            profiles: profile,
            cars: car
          };
        })
      );
      
      console.log('Successfully loaded bookings:', bookingsWithProfiles?.length || 0);
      setBookings(bookingsWithProfiles || []);
      
      // If no bookings found, that's okay - just log it
      if (!bookingsWithProfiles || bookingsWithProfiles.length === 0) {
        console.log('Info: No bookings found in database - this is normal for a new system');
      }

    } catch (error) {
      console.error('Error loading bookings:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load bookings';
      
      if (error.message.includes('Basic table access failed')) {
        errorMessage = 'Cannot access the bookings table. Please check your authentication and RLS policies.';
      } else if (error.message.includes('Relationship access failed')) {
        errorMessage = 'Cannot access customer details. Please check if the customer data columns exist.';
      } else if (error.message.includes('Cars table access failed')) {
        errorMessage = 'Cannot access the cars table. Please check if the cars table exists and RLS policies.';
      } else if (error.message.includes('Full data loading error')) {
        errorMessage = 'Error loading complete booking data. Please check table structure.';
      } else if (error.message.includes('RLS')) {
        errorMessage = 'Row Level Security (RLS) is blocking access. Please check your authentication and permissions.';
      } else {
        errorMessage = `Failed to load bookings: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Enhanced filtering and sorting
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings.filter(booking => {
      const matchesSearch = !searchTerm || 
        booking.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.cars?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.cars?.model?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      const matchesDate = dateFilter === 'all' || (() => {
        const now = new Date();
        const bookingDate = new Date(booking.pickup_date);
        const daysDiff = Math.ceil((bookingDate - now) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'today': return daysDiff === 0;
          case 'week': return daysDiff >= 0 && daysDiff <= 7;
          case 'month': return daysDiff >= 0 && daysDiff <= 30;
          case 'past': return daysDiff < 0;
          default: return true;
        }
      })();
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'customer':
          aValue = a.profiles?.full_name || '';
          bValue = b.profiles?.full_name || '';
          break;
        case 'car':
          aValue = `${a.cars?.brand} ${a.cars?.model}` || '';
          bValue = `${b.cars?.brand} ${b.cars?.model}` || '';
          break;
        case 'pickup_date':
          aValue = new Date(a.pickup_date);
          bValue = new Date(b.pickup_date);
          break;
        case 'total_price':
          aValue = parseFloat(a.total_price) || 0;
          bValue = parseFloat(b.total_price) || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [bookings, searchTerm, statusFilter, dateFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBookings.length / itemsPerPage);
  const paginatedBookings = filteredAndSortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics calculation
  const stats = useMemo(() => {
    const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);
    const activeBookings = bookings.filter(b => b.status === 'active').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    
    const today = new Date();
    const upcomingBookings = bookings.filter(b => {
      const pickupDate = new Date(b.pickup_date);
      return pickupDate >= today && b.status === 'confirmed';
    }).length;

    return {
      totalRevenue,
      activeBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      upcomingBookings,
      totalBookings: bookings.length
    };
  }, [bookings]);

  // Booking management functions
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
      let result;
      if (editingBooking) {
        result = await supabase
          .from('bookings')
          .update(bookingFormData)
          .eq('id', editingBooking.id)
          .select();
        toast({ title: "Booking Updated", description: "Booking has been updated successfully." });
      }
      
      if (result?.error) throw result.error;
      
      await loadData();
      setIsBookingDialogOpen(false);
      resetBookingForm();
    } catch (error) {
      toast({ title: "Operation failed", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) return;
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
      if (error) throw error;
      toast({ title: "Booking Deleted", description: "The booking has been removed." });
      await loadData();
    } catch (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedBookings.length} bookings? This action cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('bookings').delete().in('id', selectedBookings);
      if (error) throw error;
      toast({ title: "Bulk Delete Successful", description: `${selectedBookings.length} bookings have been removed.` });
      setSelectedBookings([]);
      await loadData();
    } catch (error) {
      toast({ title: "Bulk Delete Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleEditBooking = (booking) => {
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
    
    setBookingFormData({
      status: booking.status,
      pickup_date: formatDateForInput(booking.pickup_date),
      return_date: formatDateForInput(booking.return_date),
      total_price: booking.total_price,
      notes: booking.notes || ''
    });
    setIsBookingDialogOpen(true);
    
    // Load booked dates for this car (excluding the current booking)
    if (booking.car_id) {
      loadBookedDatesForCar(booking.car_id, booking.id);
    }
  };

  const resetBookingForm = () => {
    setEditingBooking(null);
    setBookingFormData({
      status: 'confirmed',
      pickup_date: '',
      return_date: '',
      total_price: '',
      notes: ''
    });
    setBookedDates([]);
    setDateValidationErrors({});
  };

  // Load booked dates for a specific car (excluding the current booking being edited)
  const loadBookedDatesForCar = async (carId, excludeBookingId = null) => {
    setLoadingBookedDates(true);
    try {
      let query = supabase
        .from('bookings')
        .select('pickup_date, return_date, status')
        .eq('car_id', carId)
        .in('status', ['confirmed', 'active']);

      // Exclude the current booking being edited
      if (excludeBookingId) {
        query = query.neq('id', excludeBookingId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading booked dates:', error);
        return;
      }

      // Convert date ranges to individual dates
      const dates = [];
      (data || []).forEach(booking => {
        const startDate = new Date(booking.pickup_date);
        const endDate = new Date(booking.return_date);
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      
      setBookedDates(dates);
    } catch (error) {
      console.error('Error loading booked dates:', error);
    } finally {
      setLoadingBookedDates(false);
    }
  };

  // Check if a date is booked
  const isDateBooked = (dateString) => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === selectedDate.toDateString()
    );
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

  // Handle date changes and clear validation errors
  const handleDateChange = (field, value) => {
    setBookingFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation errors for this field
    if (dateValidationErrors[field]) {
      setDateValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
    
    // Clear date range error if it exists
    if (dateValidationErrors.date_range) {
      setDateValidationErrors(prev => ({
        ...prev,
        date_range: null
      }));
    }
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === paginatedBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(paginatedBookings.map(b => b.id));
    }
  };

  const handleSelectBooking = (bookingId) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  // Export function
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      toast({ title: "No Data", description: "No data to export.", variant: "destructive" });
      return;
    }

    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportBookings = () => {
    const exportData = (selectedBookings.length > 0 ? bookings.filter(b => selectedBookings.includes(b.id)) : bookings).map(booking => ({
      ID: booking.id,
      Customer: booking.profiles?.full_name || 'Unknown',
      Email: booking.profiles?.email || '',
      Phone: booking.profiles?.phone || '',
      Car: `${booking.cars?.brand} ${booking.cars?.model}`,
      Year: booking.cars?.year || '',
      Pickup_Date: booking.pickup_date,
      Return_Date: booking.return_date,
      Duration_Days: Math.ceil((new Date(booking.return_date) - new Date(booking.pickup_date)) / (1000 * 60 * 60 * 24)),
      Total_Price: booking.total_price,
      Daily_Rate: booking.cars?.daily_rate || '',
      Status: booking.status,
      Notes: booking.notes || '',
      Created_At: booking.created_at
    }));
    exportToCSV(exportData, 'bookings-export');
    toast({
      title: "Export successful",
      description: `Exported ${exportData.length} bookings to CSV.`
    });
  };

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Bookings</h3>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <div className="space-y-3">
            <Button onClick={() => loadData()} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => {
                setError(null);
                setBookings([]);
                setLoading(false);
              }} 
              variant="ghost" 
              className="w-full"
            >
              Continue with Empty Data
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
              onClick={exportBookings}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              aria-label="Export bookings data"
            >
              <FileText className="h-4 w-4" />
              Export {selectedBookings.length > 0 ? `(${selectedBookings.length})` : ''}
            </Button>
            <Button 
              onClick={() => loadData(true)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'Total Revenue', 
              value: `€${stats.totalRevenue.toFixed(2)}`, 
              icon: DollarSign, 
              color: 'bg-green-50 border-l-4 border-green-500',
              iconColor: 'text-green-600'
            },
            { 
              title: 'Active Bookings', 
              value: stats.activeBookings, 
              icon: Calendar, 
              color: 'bg-blue-50 border-l-4 border-blue-500',
              iconColor: 'text-blue-600'
            },
            { 
              title: 'Upcoming', 
              value: stats.upcomingBookings, 
              icon: Clock, 
              color: 'bg-yellow-50 border-l-4 border-yellow-500',
              iconColor: 'text-yellow-600'
            },
            { 
              title: 'Total Bookings', 
              value: stats.totalBookings, 
              icon: Users, 
              color: 'bg-purple-50 border-l-4 border-purple-500',
              iconColor: 'text-purple-600'
            },
          ].map((stat, index) => (
            <Card key={stat.title} className={`hover:shadow-lg transition-all duration-200 border-0 shadow-sm ${stat.color}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
            
        {/* Search and Filter */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                    <Filter className="h-4 w-4 mr-2" />
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
                    <CalendarIcon className="h-4 w-4 mr-2" />
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
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      {selectedBookings.length} booking{selectedBookings.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleBulkDelete}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      aria-label="Delete selected bookings"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedBookings([])}
                      aria-label="Clear selection"
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredAndSortedBookings.length} of {bookings.length} bookings
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Cards View */}
        <div className="lg:hidden space-y-4">
          {paginatedBookings.length === 0 ? (
            <Card className="p-8 text-center border-0 shadow-sm">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No bookings have been made yet. This is normal for a new system.'}
              </p>
              {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Getting Started:</strong> When customers make bookings through your website, they will appear here for you to manage.
                  </p>
                </div>
              )}
            </Card>
          ) : (
            paginatedBookings.map((booking) => (
              <Card key={booking.id} className="border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.id)}
                          onChange={() => handleSelectBooking(booking.id)}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                          aria-label={`Select booking for ${booking.profiles?.full_name}`}
                        />
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {booking.profiles?.full_name || 'Unknown Customer'}
                        </h3>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{booking.profiles?.email || 'No email'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          <span>{booking.cars?.brand} {booking.cars?.model} ({booking.cars?.year})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{booking.pickup_date} - {booking.return_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
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
                        onClick={() => handleEditBooking(booking)}
                        className="text-gray-600 hover:text-yellow-600"
                        aria-label={`Edit booking for ${booking.profiles?.full_name}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteBooking(booking.id)}
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
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Card className="border-0 shadow-sm overflow-hidden">
            {paginatedBookings.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No bookings have been made yet. This is normal for a new system.'}
                </p>
                {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Getting Started:</strong> When customers make bookings through your website, they will appear here for you to manage.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedBookings.length === paginatedBookings.length && paginatedBookings.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                          aria-label="Select all bookings"
                        />
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('customer')}
                      >
                        <div className="flex items-center gap-1">
                          Customer
                          {getSortIcon('customer')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('car')}
                      >
                        <div className="flex items-center gap-1">
                          Car
                          {getSortIcon('car')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('pickup_date')}
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
                        onClick={() => handleSort('total_price')}
                      >
                        <div className="flex items-center gap-1">
                          Total
                          {getSortIcon('total_price')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('status')}
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
                    {paginatedBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={() => handleSelectBooking(booking.id)}
                            className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                            aria-label={`Select booking for ${booking.profiles?.full_name}`}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{booking.profiles?.full_name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{booking.profiles?.email || 'No email'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{booking.cars?.brand} {booking.cars?.model}</div>
                            <div className="text-sm text-gray-500">{booking.cars?.year} • {booking.cars?.transmission}</div>
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
                          <div className="text-lg font-semibold text-yellow-600">€{booking.total_price}</div>
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
                              onClick={() => handleEditBooking(booking)}
                              className="text-gray-500 hover:text-yellow-600"
                              aria-label={`Edit booking for ${booking.profiles?.full_name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteBooking(booking.id)}
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
            )}
          </Card>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedBookings.length)} of {filteredAndSortedBookings.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
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
                      onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Edit Booking Dialog */}
        <Dialog open={isBookingDialogOpen} onOpenChange={(isOpen) => { setIsBookingDialogOpen(isOpen); if (!isOpen) resetBookingForm(); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Booking
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={bookingFormData.status} onValueChange={value => setBookingFormData({...bookingFormData, status: value})}>
                  <SelectTrigger id="status">
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
                    onChange={(value) => handleDateChange('pickup_date', value)}
                    placeholder="Select pickup date"
                    minDate={new Date().toISOString().split('T')[0]}
                    bookedDates={bookedDates}
                    disabled={loadingBookedDates}
                    loadingBookedDates={loadingBookedDates}
                    className={`mt-1 ${dateValidationErrors.pickup_date ? 'border-red-500 focus:border-red-500' : ''}`}
                    rangeStart={bookingFormData.pickup_date}
                    rangeEnd={bookingFormData.return_date}
                  />
                  {dateValidationErrors.pickup_date && (
                    <p className="text-sm text-red-600 mt-1">{dateValidationErrors.pickup_date}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="return_date">Return Date</Label>
                  <DatePicker
                    value={bookingFormData.return_date}
                    onChange={(value) => handleDateChange('return_date', value)}
                    placeholder="Select return date"
                    minDate={bookingFormData.pickup_date || new Date().toISOString().split('T')[0]}
                    bookedDates={bookedDates}
                    disabled={loadingBookedDates}
                    loadingBookedDates={loadingBookedDates}
                    className={`mt-1 ${dateValidationErrors.return_date ? 'border-red-500 focus:border-red-500' : ''}`}
                    rangeStart={bookingFormData.pickup_date}
                    rangeEnd={bookingFormData.return_date}
                  />
                  {dateValidationErrors.return_date && (
                    <p className="text-sm text-red-600 mt-1">{dateValidationErrors.return_date}</p>
                  )}
                </div>
              </div>
              {dateValidationErrors.date_range && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
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
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input 
                  id="notes"
                  value={bookingFormData.notes} 
                  onChange={e => setBookingFormData({...bookingFormData, notes: e.target.value})} 
                  placeholder="Additional notes..." 
                />
              </div>
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
                Update Booking
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminBookings;


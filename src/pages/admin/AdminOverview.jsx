import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Car, 
  Calendar, 
  Users, 
  DollarSign, 
  Download, 
  BarChart3, 
  FileText, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Link } from 'react-router-dom';

const AdminOverview = () => {
  const { t } = useLanguage();
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Load cars
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (carsError) throw carsError;
      setCars(carsData || []);

      // Load bookings with related data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (bookingsError) throw bookingsError;
      
      // Fetch profile and car data separately for each booking
      const bookingsWithProfiles = await Promise.all(
        (bookingsData || []).map(async (booking) => {
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
              .select('brand, model, daily_rate')
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
      
      setBookings(bookingsWithProfiles || []);

      // Load user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Enhanced statistics calculation with trends
  const getStats = () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const currentBookings = bookings.filter(b => {
      const bookingDate = new Date(b.created_at);
      return selectedPeriod === 'all' || bookingDate >= lastMonth;
    });

    const totalRevenue = currentBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
    const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active').length;
    const availableCars = cars.filter(c => c.status === 'available').length;
    const totalUsers = profiles.length;
    const totalCars = cars.length;
    const bookedCars = cars.filter(c => c.status === 'booked').length;
    const maintenanceCars = cars.filter(c => c.status === 'maintenance').length;
    
    // Calculate average daily rate
    const avgDailyRate = cars.length > 0 
      ? cars.reduce((sum, car) => sum + (Number(car.daily_rate) || 0), 0) / cars.length 
      : 0;

    // Calculate trends (simplified - in real app, compare with previous period)
    const revenueTrend = totalRevenue > 0 ? 'up' : 'neutral';
    const bookingsTrend = activeBookings > 0 ? 'up' : 'neutral';
    const carsTrend = availableCars > totalCars / 2 ? 'up' : 'down';
    const usersTrend = totalUsers > 0 ? 'up' : 'neutral';

    return {
      totalRevenue,
      activeBookings,
      availableCars,
      totalUsers,
      totalCars,
      bookedCars,
      maintenanceCars,
      avgDailyRate,
      revenueTrend,
      bookingsTrend,
      carsTrend,
      usersTrend
    };
  };

  const stats = getStats();

  // Filter bookings based on search and period
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = searchTerm === '' || 
        booking.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${booking.cars?.brand} ${booking.cars?.model}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedPeriod === 'all') return matchesSearch;
      
      const bookingDate = new Date(booking.created_at);
      const lastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
      return matchesSearch && bookingDate >= lastMonth;
    })
    .slice(0, 5);

  // Export functions
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      alert('No data to export');
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
    const exportData = bookings.map(booking => ({
      ID: booking.id,
      Customer: booking.profiles?.full_name || 'Unknown',
      Car: `${booking.cars?.brand} ${booking.cars?.model}`,
      Pickup_Date: booking.pickup_date,
      Return_Date: booking.return_date,
      Total_Price: booking.total_price,
      Status: booking.status,
      Created_At: booking.created_at
    }));
    exportToCSV(exportData, 'bookings-export');
  };

  const exportCars = () => {
    const exportData = cars.map(car => ({
      ID: car.id,
      Brand: car.brand,
      Model: car.model,
      Year: car.year,
      Daily_Rate: car.daily_rate,
      Status: car.status,
      Transmission: car.transmission,
      Seats: car.seats,
      Fuel_Type: car.fuel_type,
      Created_At: car.created_at
    }));
    exportToCSV(exportData, 'cars-export');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'active':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadData()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Overview - MEMA Rental</title>
        <meta name="description" content="Admin dashboard overview for MEMA Rental" />
      </Helmet>

      <div className="space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your rental business.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <Button 
                onClick={exportBookings}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                aria-label="Export bookings data"
              >
                <FileText className="h-4 w-4" />
                Export Bookings
              </Button>
              <Button 
                onClick={exportCars}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                aria-label="Export cars data"
              >
                <FileText className="h-4 w-4" />
                Export Cars
              </Button>
            </div>
            <Button 
              onClick={() => loadData(true)}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              aria-label="Refresh dashboard data"
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

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'Total Revenue', 
              value: `€${stats.totalRevenue.toFixed(2)}`, 
              icon: DollarSign, 
              color: 'bg-yellow-50 border-l-4 border-yellow-500',
              iconColor: 'text-yellow-600',
              trend: stats.revenueTrend,
              subtitle: selectedPeriod === 'all' ? 'All time earnings' : 'Last 30 days'
            },
            { 
              title: 'Active Bookings', 
              value: stats.activeBookings, 
              icon: Calendar, 
              color: 'bg-orange-50 border-l-4 border-orange-500',
              iconColor: 'text-orange-600',
              trend: stats.bookingsTrend,
              subtitle: 'Currently active'
            },
            { 
              title: 'Available Cars', 
              value: stats.availableCars, 
              icon: Car, 
              color: 'bg-yellow-50 border-l-4 border-yellow-500',
              iconColor: 'text-yellow-600',
              trend: stats.carsTrend,
              subtitle: 'Ready to rent'
            },
            { 
              title: 'Total Users', 
              value: stats.totalUsers, 
              icon: Users, 
              color: 'bg-yellow-50 border-l-4 border-yellow-500',
              iconColor: 'text-yellow-600',
              trend: stats.usersTrend,
              subtitle: 'Registered users'
            },
          ].map((stat, index) => (
            <Card key={stat.title} className={`hover:shadow-lg transition-all duration-200 border-0 shadow-sm ${stat.color}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  {getTrendIcon(stat.trend)}
                </div>
                <p className="text-xs text-gray-600 mt-2">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fleet Status */}
          <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="h-5 w-5 text-yellow-600" />
                Fleet Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Total Cars</span>
                  <span className="font-bold text-lg">{stats.totalCars}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Available</span>
                  <span className="font-bold text-green-600">{stats.availableCars}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Booked</span>
                  <span className="font-bold text-orange-600">{stats.bookedCars}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Maintenance</span>
                  <span className="font-bold text-red-600">{stats.maintenanceCars}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-gray-700 font-medium">Avg Daily Rate</span>
                  <span className="font-bold text-green-600">€{stats.avgDailyRate.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Recent Bookings
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                  aria-label="Filter bookings by period"
                >
                  <option value="all">All Time</option>
                  <option value="month">Last 30 Days</option>
                </select>
                <div className="relative">
                  <Search className="h-3 w-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-xs border border-gray-300 rounded pl-7 pr-2 py-1 bg-white w-24"
                    aria-label="Search bookings"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {booking.profiles?.full_name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {booking.cars?.brand} {booking.cars?.model}
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="font-semibold text-sm text-gray-900">€{booking.total_price}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {getStatusIcon(booking.status)}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No bookings found</p>
                  {searchTerm && (
                    <p className="text-xs mt-1">Try adjusting your search</p>
                  )}
                </div>
              )}
              {filteredBookings.length > 0 && (
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/admin/bookings" aria-label="View all bookings">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Bookings
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start h-12" variant="outline">
                <Link to="/admin/bookings" aria-label="View all bookings">
                  <Calendar className="h-4 w-4 mr-3" />
                  View All Bookings
                </Link>
              </Button>
              <Button asChild className="w-full justify-start h-12" variant="outline">
                <Link to="/admin/cars" aria-label="Manage fleet">
                  <Car className="h-4 w-4 mr-3" />
                  Manage Fleet
                </Link>
              </Button>
              <Button asChild className="w-full justify-start h-12" variant="outline">
                <Link to="/admin/users" aria-label="User management">
                  <Users className="h-4 w-4 mr-3" />
                  User Management
                </Link>
              </Button>
              <Button asChild className="w-full justify-start h-12 bg-yellow-500 hover:bg-yellow-600 text-white">
                <Link to="/admin" aria-label="Dashboard overview">
                  <Plus className="h-4 w-4 mr-3" />
                  Add New Car
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;

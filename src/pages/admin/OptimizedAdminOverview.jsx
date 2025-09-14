import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Filter,
  Activity,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { optimizedBookingService } from '@/lib/optimizedBookingService';
import { paginationService } from '@/lib/paginationService';
import PerformanceMonitor from '@/components/PerformanceMonitor';

const OptimizedAdminOverview = () => {
  const { t } = useLanguage();
  
  // Data state
  const [stats, setStats] = useState({
    totalCars: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentBookings: [],
    availableCars: 0,
    pendingBookings: 0,
    confirmedBookings: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load dashboard data with optimized service
  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      console.log('🚀 Loading dashboard data with optimized service...');
      
      // Load all data in parallel using optimized services
      const [
        dashboardStats,
        recentBookingsResult,
        carsResult,
        bookingsResult
      ] = await Promise.all([
        optimizedBookingService.getDashboardStats(),
        optimizedBookingService.getBookingsPaginated(1, 5), // Get 5 recent bookings
        paginationService.getPaginatedData('cars', { page: 1, limit: 1000 }),
        paginationService.getPaginatedData('bookings', { page: 1, limit: 1000 })
      ]);

      // Calculate additional stats
      const cars = carsResult.data || [];
      const bookings = bookingsResult.data || [];
      
      const totalRevenue = bookings.reduce((sum, booking) => 
        sum + (parseFloat(booking.total_price) || 0), 0
      );
      
      const availableCars = cars.filter(car => car.status === 'available').length;
      const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
      const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;

      setStats({
        ...dashboardStats,
        totalRevenue,
        recentBookings: recentBookingsResult.data || [],
        availableCars,
        pendingBookings,
        confirmedBookings
      });

      console.log('✅ Dashboard data loaded successfully');

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    optimizedBookingService.clearCache();
    paginationService.clearTableCache('cars');
    paginationService.clearTableCache('bookings');
    loadData(true);
  }, [loadData]);

  // Filter recent bookings by search term
  const filteredRecentBookings = useMemo(() => {
    if (!searchTerm) return stats.recentBookings;
    
    return stats.recentBookings.filter(booking => 
      booking.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cars?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cars?.model?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stats.recentBookings, searchTerm]);

  // Filter bookings by period
  const filteredBookingsByPeriod = useMemo(() => {
    if (selectedPeriod === 'all') return stats.recentBookings;
    
    const now = new Date();
    return stats.recentBookings.filter(booking => {
      const bookingDate = new Date(booking.created_at);
      const daysDiff = Math.ceil((now - bookingDate) / (1000 * 60 * 60 * 24));
      
      switch (selectedPeriod) {
        case 'today': return daysDiff === 0;
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        default: return true;
      }
    });
  }, [stats.recentBookings, selectedPeriod]);

  // Get performance metrics
  const performanceMetrics = useMemo(() => {
    const cacheStats = optimizedBookingService.getCacheStats();
    return {
      cacheHitRate: cacheStats.hitRate || 0,
      cacheSize: cacheStats.size,
      maxCacheSize: cacheStats.maxSize
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Helmet>
        <title>Admin Dashboard - MEMA Rental</title>
        <meta name="description" content="Admin dashboard overview" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile first */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard Overview</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Welcome back! Here's what's happening with your rental business.</p>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
              <div className="text-xs text-gray-500 sm:text-sm">
                Cache: {performanceMetrics.cacheSize}/{performanceMetrics.maxCacheSize} items
              </div>
              <Button onClick={handleRefresh} disabled={refreshing} size="sm" className="w-full sm:w-auto justify-center">
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Performance Monitor */}
        <div className="mb-8">
          <PerformanceMonitor />
        </div>

        {/* Stats Cards - Mobile first grid */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 md:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Cars</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalCars}</p>
                  <p className="text-xs text-green-600 truncate">{stats.availableCars} available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                  <p className="text-xs text-blue-600 truncate">{stats.confirmedBookings} confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500 truncate">Registered customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-green-600 truncate">All time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/cars">
                <Button variant="outline" className="w-full justify-start">
                  <Car className="w-4 h-4 mr-2" />
                  Manage Cars
                </Button>
              </Link>
              <Link to="/admin/bookings">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Bookings
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Bookings</span>
                <span className="text-sm font-semibold text-yellow-600">{stats.pendingBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cars in Maintenance</span>
                <span className="text-sm font-semibold text-red-600">{stats.totalCars - stats.availableCars}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Confirmed Bookings</span>
                <span className="text-sm font-semibold text-green-600">{stats.confirmedBookings}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cache Hit Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {performanceMetrics.cacheHitRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cache Usage</span>
                <span className="text-sm font-semibold text-blue-600">
                  {performanceMetrics.cacheSize}/{performanceMetrics.maxCacheSize}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Loaded</span>
                <span className="text-sm font-semibold text-purple-600">
                  {stats.totalCars + stats.totalBookings} items
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Bookings
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRecentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent bookings</h3>
                <p className="text-gray-500">No bookings match your current filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecentBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="w-6 h-6 text-gray-400" />
                        </div>
                        
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
                        <Link to="/admin/bookings">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OptimizedAdminOverview;

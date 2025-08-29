import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Car, Calendar, Users, DollarSign, Plus, Edit, Trash2, Search, Filter, Download, BarChart3, Eye, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/customSupabaseClient';
import AddCarsButton from '@/components/AddCarsButton';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [carFormData, setCarFormData] = useState({
    brand: '', 
    model: '', 
    year: new Date().getFullYear(), 
    daily_rate: '',
    transmission: 'automatic', 
    seats: 5, 
    luggage: 2, 
    fuel_type: 'petrol', 
    status: 'available',
    engine: '',
    image_url: ''
  });
  const [editingCar, setEditingCar] = useState(null);
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);

  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Load cars with real-time subscription
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (carsError) throw carsError;
      setCars(carsData || []);

      // Load bookings with related data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles(full_name, email),
          cars(brand, model, daily_rate)
        `)
        .order('created_at', { ascending: false });
      
      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Load user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

      toast({ 
        title: "Data Updated", 
        description: "Dashboard data has been refreshed successfully." 
      });

    } catch (error) {
      console.error('Error loading data:', error);
      toast({ 
        title: "Error loading data", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingCar) {
        result = await supabase.from('cars').update(carFormData).eq('id', editingCar.id).select();
        toast({ title: "Car Updated", description: `${carFormData.brand} ${carFormData.model} has been updated.` });
      } else {
        result = await supabase.from('cars').insert(carFormData).select();
        toast({ title: "Car Added", description: `${carFormData.brand} ${carFormData.model} has been added.` });
      }
      
      if (result.error) throw result.error;
      
      await loadData();
      setIsCarDialogOpen(false);
      resetCarForm();
    } catch (error) {
      toast({ title: "Operation failed", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car? This action cannot be undone.")) return;
    try {
      const { error } = await supabase.from('cars').delete().eq('id', carId);
      if (error) throw error;
      toast({ title: "Car Deleted", description: "The car has been removed from the fleet.", variant: "destructive" });
      await loadData();
    } catch (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setCarFormData(car);
    setIsCarDialogOpen(true);
  };

  const resetCarForm = () => {
    setEditingCar(null);
    setCarFormData({
      brand: '', model: '', year: new Date().getFullYear(), daily_rate: '',
      transmission: 'automatic', seats: 5, luggage: 2, fuel_type: 'petrol', status: 'available'
    });
  };

  // Enhanced statistics calculation
  const getStats = () => {
    const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
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

    return {
      totalRevenue,
      activeBookings,
      availableCars,
      totalUsers,
      totalCars,
      bookedCars,
      maintenanceCars,
      avgDailyRate
    };
  };

  const stats = getStats();

  // Filter cars based on search and status
  const filteredCars = cars.filter(car => {
    const matchesSearch = !searchTerm || 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || car.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'bookings', label: t('manageBookings'), icon: Calendar },
    { id: 'cars', label: t('manageCars'), icon: Car },
    { id: 'users', label: t('users'), icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header with refresh button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
              <Button 
                onClick={() => loadData(true)}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                {refreshing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {[
                { title: 'Total Revenue', value: `€${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-50 text-green-600', subtitle: 'All time earnings' },
                { title: 'Active Bookings', value: stats.activeBookings, icon: Calendar, color: 'bg-blue-50 text-blue-600', subtitle: 'Current bookings' },
                { title: 'Available Cars', value: stats.availableCars, icon: Car, color: 'bg-yellow-50 text-yellow-600', subtitle: 'Ready to rent' },
                { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-50 text-purple-600', subtitle: 'Registered users' },
              ].map(stat => (
                <Card key={stat.title} className="stats-card hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Fleet Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Cars</span>
                    <span className="font-semibold">{stats.totalCars}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Booked Cars</span>
                    <span className="font-semibold text-orange-600">{stats.bookedCars}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">In Maintenance</span>
                    <span className="font-semibold text-red-600">{stats.maintenanceCars}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Daily Rate</span>
                    <span className="font-semibold text-green-600">€{stats.avgDailyRate.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.slice(0, 3).map((booking, index) => (
                    <div key={booking.id || index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">{booking.cars?.brand} {booking.cars?.model}</p>
                        <p className="text-xs text-gray-500">{booking.profiles?.full_name || 'Unknown'}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setActiveTab('cars')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Car
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('bookings')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Bookings
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('users')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );
      case 'cars':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold">{t('manageCars')}</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <AddCarsButton />
                <Dialog open={isCarDialogOpen} onOpenChange={(isOpen) => { setIsCarDialogOpen(isOpen); if (!isOpen) resetCarForm(); }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsCarDialogOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" /> {t('add')} Car
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-md sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingCar ? 'Edit Car' : 'Add New Car'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCarSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Label>Brand</Label><Input value={carFormData.brand} onChange={e => setCarFormData({...carFormData, brand: e.target.value})} required /></div>
                      <div><Label>Model</Label><Input value={carFormData.model} onChange={e => setCarFormData({...carFormData, model: e.target.value})} required /></div>
                      <div><Label>Year</Label><Input type="number" value={carFormData.year} onChange={e => setCarFormData({...carFormData, year: parseInt(e.target.value)})} required /></div>
                      <div><Label>Daily Rate (€)</Label><Input type="number" step="0.01" value={carFormData.daily_rate} onChange={e => setCarFormData({...carFormData, daily_rate: parseFloat(e.target.value)})} required /></div>
                      <div><Label>Seats</Label><Input type="number" value={carFormData.seats} onChange={e => setCarFormData({...carFormData, seats: parseInt(e.target.value)})} /></div>
                      <div><Label>Luggage</Label><Input type="number" value={carFormData.luggage} onChange={e => setCarFormData({...carFormData, luggage: parseInt(e.target.value)})} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Label>Engine</Label><Input value={carFormData.engine} onChange={e => setCarFormData({...carFormData, engine: e.target.value})} placeholder="e.g., 1.4 Diesel" /></div>
                      <div><Label>Image URL</Label><Input value={carFormData.image_url} onChange={e => setCarFormData({...carFormData, image_url: e.target.value})} placeholder="/images/cars/car.jpg" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Label>Transmission</Label><Select value={carFormData.transmission} onValueChange={value => setCarFormData({...carFormData, transmission: value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="automatic">Automatic</SelectItem><SelectItem value="manual">Manual</SelectItem></SelectContent></Select></div>
                      <div><Label>Fuel Type</Label><Select value={carFormData.fuel_type} onValueChange={value => setCarFormData({...carFormData, fuel_type: value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="petrol">Petrol</SelectItem><SelectItem value="diesel">Diesel</SelectItem><SelectItem value="electric">Electric</SelectItem></SelectContent></Select></div>
                    </div>
                    <div><Label>Status</Label><Select value={carFormData.status} onValueChange={value => setCarFormData({...carFormData, status: value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="available">Available</SelectItem><SelectItem value="booked">Booked</SelectItem><SelectItem value="maintenance">Under Maintenance</SelectItem></SelectContent></Select></div>
                    <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">{editingCar ? 'Update Car' : 'Add Car'}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
            
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search cars by brand or model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredCars.length} of {cars.length} cars
                </p>
                <Button 
                  onClick={() => loadData(true)}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-4">
              {filteredCars.length === 0 ? (
                <Card className="p-8 text-center">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Get started by adding your first car to the fleet.'}
                  </p>
                  <Button onClick={() => setIsCarDialogOpen(true)} className="bg-yellow-500 hover:bg-yellow-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Car
                  </Button>
                </Card>
              ) : (
                filteredCars.map(car => (
                <Card key={car.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{car.brand} {car.model}</h3>
                      <p className="text-sm text-gray-500">Year: {car.year}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      car.status === 'available' ? 'bg-green-100 text-green-800' : 
                      car.status === 'booked' ? 'bg-orange-100 text-orange-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {car.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-yellow-600">€{car.daily_rate}/day</div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCar(car)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCar(car.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              {filteredCars.length === 0 ? (
                <div className="p-8 text-center">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Get started by adding your first car to the fleet.'}
                  </p>
                  <Button onClick={() => setIsCarDialogOpen(true)} className="bg-yellow-500 hover:bg-yellow-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Car
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCars.map(car => (
                        <tr key={car.id}>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium">{car.brand} {car.model}</div><div className="text-sm text-gray-500">{car.year}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap">€{car.daily_rate}/day</td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${car.status === 'available' ? 'bg-green-100 text-green-800' : car.status === 'booked' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>{car.status}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="icon" onClick={() => handleEditCar(car)}><Edit className="h-4 w-4 text-gray-500 hover:text-yellow-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCar(car.id)}><Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        );
      case 'bookings':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Bookings</h2>
              <Button 
                onClick={() => loadData(true)}
                disabled={refreshing}
                variant="outline"
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-4">
              {bookings.map(booking => (
                <Card key={booking.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.cars?.brand} {booking.cars?.model}</h3>
                      <p className="text-sm text-gray-500">{booking.profiles?.full_name || 'Unknown User'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span>{new Date(booking.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold text-green-600">€{booking.total_price}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{booking.cars?.brand} {booking.cars?.model}</div>
                          <div className="text-sm text-gray-500">€{booking.cars?.daily_rate}/day</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{booking.profiles?.full_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{booking.profiles?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{new Date(booking.start_date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">to {new Date(booking.end_date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">€{booking.total_price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case 'users':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Users</h2>
              <Button 
                onClick={() => loadData(true)}
                disabled={refreshing}
                variant="outline"
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-4">
              {profiles.map(profile => (
                <Card key={profile.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{profile.full_name || 'Unknown'}</h3>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      profile.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {profile.role || 'user'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{profile.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined:</span>
                      <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profiles.map(profile => (
                      <tr key={profile.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{profile.full_name || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.phone || 'Not provided'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            profile.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {profile.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      default:
        return <p className="text-center text-gray-500 mt-10">This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀</p>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('adminDashboard')} - MEMA Rental</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:flex lg:flex-col`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-700 lg:border-none">
            <h1 className="text-xl lg:text-2xl font-bold text-yellow-400">Admin Panel</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 p-6 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? 'bg-yellow-500 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 lg:p-8 bg-gray-100">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Car, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Check, 
  X, 
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Eye,
  EyeOff,
  DollarSign,
  Calendar,
  Users,
  Fuel,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast.jsx';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { paginationService } from '@/lib/paginationService';
import { supabase } from '@/lib/customSupabaseClient';

const OptimizedAdminCars = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Data state
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState({});

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    fuelType: 'all',
    transmission: 'all',
    seats: 'all',
    priceRange: { min: '', max: '' },
    yearRange: { min: '', max: '' }
  });

  // Sort state
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Form state
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    status: [],
    fuelType: [],
    transmission: []
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load filter options
  const loadFilterOptions = useCallback(async () => {
    try {
      const [statusOptions, fuelOptions, transmissionOptions] = await Promise.all([
        paginationService.getFilterOptions('cars', 'status'),
        paginationService.getFilterOptions('cars', 'fuel_type'),
        paginationService.getFilterOptions('cars', 'transmission')
      ]);

      setFilterOptions({
        status: statusOptions,
        fuelType: fuelOptions,
        transmission: transmissionOptions
      });
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  }, []);

  // Load cars data with simple approach (no complex pagination service)
  const loadData = useCallback(async (page = 1, showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {

      // Simple query without complex pagination service
      let query = supabase.from('cars').select('*');

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply fuel type filter
      if (filters.fuelType && filters.fuelType !== 'all') {
        query = query.eq('fuel_type', filters.fuelType);
      }

      // Apply transmission filter
      if (filters.transmission && filters.transmission !== 'all') {
        query = query.eq('transmission', filters.transmission);
      }

      // Apply price range filters
      if (filters.priceRange.min) {
        query = query.gte('daily_rate', parseFloat(filters.priceRange.min));
      }
      if (filters.priceRange.max) {
        query = query.lte('daily_rate', parseFloat(filters.priceRange.max));
      }

      // Apply year range filters
      if (filters.yearRange.min) {
        query = query.gte('year', parseInt(filters.yearRange.min));
      }
      if (filters.yearRange.max) {
        query = query.lte('year', parseInt(filters.yearRange.max));
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const itemsPerPage = 20;
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) throw error;

      // Client-side search filtering (since server-side search is problematic)
      let filteredData = data || [];
      if (debouncedSearchTerm) {
        filteredData = filteredData.filter(car => 
          car.brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }

      setCars(filteredData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      setCurrentPage(page);


    } catch (error) {
      console.error('❌ Error loading cars:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error Loading Cars",
        description: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [debouncedSearchTerm, filters, sortBy, sortOrder]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    loadData(1);
  }, [loadData]);

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    loadData(newPage);
  }, [loadData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    paginationService.clearTableCache('cars');
    loadData(currentPage, true);
  }, [loadData, currentPage]);

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  }, []);

  // Handle sort
  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  }, [sortBy]);

  // Handle create car
  const handleCreateCar = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('cars')
        .insert([carFormData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car created successfully!",
      });

      setIsCarDialogOpen(false);
      setCarFormData({
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

      handleRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [carFormData, handleRefresh]);

  // Handle edit car
  const handleEditCar = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('cars')
        .update(carFormData)
        .eq('id', editingCar.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car updated successfully!",
      });

      setIsCarDialogOpen(false);
      setEditingCar(null);
      handleRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [carFormData, editingCar, handleRefresh]);

  // Handle delete car
  const handleDeleteCar = useCallback(async (carId) => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car deleted successfully!",
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

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Helmet>
        <title>Admin Cars - MEMA Rental</title>
        <meta name="description" content="Manage car fleet and inventory" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cars Management</h1>
              <p className="text-gray-600 mt-2">Manage your car fleet and inventory</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setIsCarDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Car
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Cars</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter(c => c.status === 'available').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter(c => c.status === 'maintenance').length}
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
                  <p className="text-sm font-medium text-gray-600">Avg Daily Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${cars.length > 0 ? (cars.reduce((sum, c) => sum + (parseFloat(c.daily_rate) || 0), 0) / cars.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search cars by brand, model..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {filterOptions.status.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Fuel Type Filter */}
              <Select value={filters.fuelType} onValueChange={(value) => handleFilterChange('fuelType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  {filterOptions.fuelType.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Filters */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Min price"
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
                />
                <Input
                  placeholder="Max price"
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Min year"
                  type="number"
                  value={filters.yearRange.min}
                  onChange={(e) => handleFilterChange('yearRange', { ...filters.yearRange, min: e.target.value })}
                />
                <Input
                  placeholder="Max year"
                  type="number"
                  value={filters.yearRange.max}
                  onChange={(e) => handleFilterChange('yearRange', { ...filters.yearRange, max: e.target.value })}
                />
              </div>

              <Select value={filters.transmission} onValueChange={(value) => handleFilterChange('transmission', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transmissions</SelectItem>
                  {filterOptions.transmission.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cars Table */}
        <Card>
          <CardHeader>
            <CardTitle>Cars ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading cars...</p>
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
                {cars.map((car) => (
                  <div key={car.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          {car.image_url ? (
                            <img 
                              src={car.image_url} 
                              alt={`${car.brand} ${car.model}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Car className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {car.brand} {car.model}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              car.status === 'available' ? 'bg-green-100 text-green-800' :
                              car.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                              car.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {car.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {car.year}
                            </div>
                            <div className="flex items-center gap-2">
                              <Fuel className="w-4 h-4" />
                              {car.fuel_type}
                            </div>
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              {car.transmission}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {car.seats} seats
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${car.daily_rate}
                          </p>
                          <p className="text-sm text-gray-500">per day</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCar(car);
                              setCarFormData({
                                brand: car.brand || '',
                                model: car.model || '',
                                year: car.year || new Date().getFullYear(),
                                daily_rate: car.daily_rate || '',
                                transmission: car.transmission || 'automatic',
                                seats: car.seats || 5,
                                luggage: car.luggage || 2,
                                fuel_type: car.fuel_type || 'petrol',
                                status: car.status || 'available',
                                engine: car.engine || '',
                                image_url: car.image_url || ''
                              });
                              setIsCarDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCar(car.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
              Showing {paginationInfo.from || 1} to {paginationInfo.to || cars.length} of {totalCount} cars
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
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
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Car Edit/Create Dialog */}
      <Dialog open={isCarDialogOpen} onOpenChange={setIsCarDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCar ? 'Edit Car' : 'Add New Car'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (editingCar) {
              handleEditCar();
            } else {
              handleCreateCar();
            }
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={carFormData.brand}
                  onChange={(e) => setCarFormData(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="e.g., Toyota, BMW"
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={carFormData.model}
                  onChange={(e) => setCarFormData(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="e.g., Camry, X5"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={carFormData.year}
                  onChange={(e) => setCarFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="daily_rate">Daily Rate (€) *</Label>
                <Input
                  id="daily_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={carFormData.daily_rate}
                  onChange={(e) => setCarFormData(prev => ({ ...prev, daily_rate: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select value={carFormData.transmission} onValueChange={(value) => setCarFormData(prev => ({ ...prev, transmission: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Select value={carFormData.fuel_type} onValueChange={(value) => setCarFormData(prev => ({ ...prev, fuel_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  max="10"
                  value={carFormData.seats}
                  onChange={(e) => setCarFormData(prev => ({ ...prev, seats: parseInt(e.target.value) || 5 }))}
                />
              </div>
              <div>
                <Label htmlFor="luggage">Luggage Capacity</Label>
                <Input
                  id="luggage"
                  type="number"
                  min="0"
                  max="10"
                  value={carFormData.luggage}
                  onChange={(e) => setCarFormData(prev => ({ ...prev, luggage: parseInt(e.target.value) || 2 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="engine">Engine</Label>
              <Input
                id="engine"
                value={carFormData.engine}
                onChange={(e) => setCarFormData(prev => ({ ...prev, engine: e.target.value }))}
                placeholder="e.g., 2.0L Turbo"
              />
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={carFormData.image_url}
                onChange={(e) => setCarFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/car-image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={carFormData.status} onValueChange={(value) => setCarFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCarDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingCar ? 'Update Car' : 'Create Car')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OptimizedAdminCars;

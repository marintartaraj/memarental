import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Car, Search, Filter, Download, Edit, Trash2, Plus, Upload, RefreshCw, Settings, Fuel, Users, AlertCircle, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
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

const AdminCars = () => {
  const { t } = useLanguage();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Enhanced filtering state
  const [filters, setFilters] = useState({
    status: 'all',
    priceRange: { min: 0, max: 1000 },
    yearRange: { min: 1900, max: new Date().getFullYear() },
    fuelType: 'all',
    transmission: 'all',
    seats: 'all'
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;
  
  // Enhanced error handling
  const [error, setError] = useState(null);
  
  // File upload states with preview
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Enhanced form validation
  const [formErrors, setFormErrors] = useState({});

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

  // Debug log for form data changes
  useEffect(() => {
    console.log('Form data changed:', carFormData);
  }, [carFormData]);
  const [editingCar, setEditingCar] = useState(null);
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);

  // Enhanced confirmation dialog
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    carId: null,
    carName: ''
  });

  // Bulk operations state
  const [selectedCars, setSelectedCars] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const errors = {};
    
    console.log('Validating form data:', carFormData); // Debug log
    
    if (!carFormData.brand?.trim()) errors.brand = 'Brand is required';
    if (!carFormData.model?.trim()) errors.model = 'Model is required';
    if (carFormData.year < 1900 || carFormData.year > new Date().getFullYear() + 1) {
      errors.year = 'Invalid year';
    }
    if (carFormData.daily_rate <= 0) errors.daily_rate = 'Daily rate must be positive';
    if (carFormData.seats < 1 || carFormData.seats > 10) errors.seats = 'Invalid seat count';
    if (carFormData.luggage < 0 || carFormData.luggage > 10) errors.luggage = 'Invalid luggage capacity';
    
    console.log('Validation errors:', errors); // Debug log
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [carFormData]);

  const loadData = useCallback(async (page = 1, showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Get total count
      const { count } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count);
      setTotalPages(Math.ceil(count / itemsPerPage));
      
      // Get paginated data
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      
      if (carsError) throw carsError;
      setCars(carsData || []);

    } catch (error) {
      console.error('Error loading cars:', error);
      setError({
        message: error.message,
        code: error.code,
        retry: () => loadData(page)
      });
      toast({
        title: "Error loading cars",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    loadData(currentPage);
  }, [loadData, currentPage]);

  // Enhanced file upload with preview
  const uploadImage = async (file) => {
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `car-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      setSelectedImage(file);
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setCarFormData(prev => ({ ...prev, image_url: imageUrl }));
        toast({
          title: "Image uploaded",
          description: "Car image has been uploaded successfully."
        });
      }
    }
  };

  // Enhanced filtering with memoization
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = !debouncedSearchTerm || 
        car.brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || car.status === filters.status;
      const matchesPrice = car.daily_rate >= filters.priceRange.min && 
                          car.daily_rate <= filters.priceRange.max;
      const matchesYear = car.year >= filters.yearRange.min && 
                         car.year <= filters.yearRange.max;
      const matchesFuel = filters.fuelType === 'all' || car.fuel_type === filters.fuelType;
      const matchesTransmission = filters.transmission === 'all' || 
                                 car.transmission === filters.transmission;
      const matchesSeats = filters.seats === 'all' || car.seats === parseInt(filters.seats);
      
      return matchesSearch && matchesStatus && matchesPrice && 
             matchesYear && matchesFuel && matchesTransmission && matchesSeats;
    });
  }, [cars, debouncedSearchTerm, filters]);

  // Export function
  const exportToCSV = (data, filename) => {
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

  const exportCars = () => {
    const exportData = filteredCars.map(car => ({
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
    toast({
      title: "Export successful",
      description: "Cars data has been exported to CSV."
    });
  };

  // Enhanced car submit with validation
  const handleCarSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submitting form data:', carFormData); // Debug log
    console.log('Editing car:', editingCar); // Debug log
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      let result;
      if (editingCar) {
        const { id, created_at, updated_at, ...updateData } = carFormData;
        
        const cleanedUpdateData = {
          ...updateData,
          year: parseInt(updateData.year) || new Date().getFullYear(),
          daily_rate: parseFloat(updateData.daily_rate) || 0,
          seats: parseInt(updateData.seats) || 5,
          luggage: parseInt(updateData.luggage) || 2
        };
        
        result = await supabase.from('cars').update(cleanedUpdateData).eq('id', editingCar.id).select();
        
        if (result.error) throw result.error;
        
        console.log('Update result:', result); // Debug log
        console.log('Updated car data:', cleanedUpdateData); // Debug log
        
        // Update the local state immediately for better UX
        setCars(prevCars => {
          const updatedCars = prevCars.map(car => 
            car.id === editingCar.id 
              ? { ...car, ...cleanedUpdateData }
              : car
          );
          console.log('Updated cars state:', updatedCars); // Debug log
          return updatedCars;
        });
        
        toast({ title: "Car Updated", description: `${carFormData.brand} ${carFormData.model} has been updated.` });
      } else {
        result = await supabase.from('cars').insert(carFormData).select();
        
        if (result.error) throw result.error;
        
        // Add the new car to local state immediately
        if (result.data && result.data[0]) {
          setCars(prevCars => [result.data[0], ...prevCars]);
        }
        
        toast({ title: "Car Added", description: `${carFormData.brand} ${carFormData.model} has been added.` });
      }
      
      // Refresh data from server to ensure consistency
      await loadData(currentPage);
      
      // Close dialog and reset form
      setIsCarDialogOpen(false);
      setTimeout(() => {
        resetCarForm();
      }, 100);
    } catch (error) {
      console.error('Car submit error:', error);
      toast({ title: "Operation failed", description: error.message, variant: "destructive" });
    }
  };

  // Enhanced delete with styled confirmation
  const handleDeleteCar = async (carId) => {
    const car = cars.find(c => c.id === carId);
    setDeleteConfirmation({
      isOpen: true,
      carId,
      carName: `${car.brand} ${car.model}`
    });
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase.from('cars').delete().eq('id', deleteConfirmation.carId);
      if (error) throw error;
      toast({ title: "Car Deleted", description: "The car has been removed from the fleet." });
      await loadData(currentPage);
    } catch (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } finally {
      setDeleteConfirmation({ isOpen: false, carId: null, carName: '' });
    }
  };

  // Bulk operations
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedCars.size} cars?`)) return;
    
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .in('id', Array.from(selectedCars));
      
      if (error) throw error;
      toast({ title: "Bulk Delete", description: `${selectedCars.size} cars deleted.` });
      setSelectedCars(new Set());
      await loadData(currentPage);
    } catch (error) {
      toast({ title: "Bulk Delete Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('cars')
        .update({ status: newStatus })
        .in('id', Array.from(selectedCars));
      
      if (error) throw error;
      toast({ title: "Status Updated", description: `${selectedCars.size} cars updated.` });
      setSelectedCars(new Set());
      await loadData(currentPage);
    } catch (error) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setIsCarDialogOpen(true);
    setFormErrors({});
    
    // Set form data immediately without setTimeout
    const formData = {
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
    };
    
    console.log('Setting form data for edit:', formData); // Debug log
    setCarFormData(formData);
    setImagePreview(car.image_url || null);
  };

  const resetCarForm = () => {
    setEditingCar(null);
    setCarFormData({
      brand: '', model: '', year: new Date().getFullYear(), daily_rate: '',
      transmission: 'automatic', seats: 5, luggage: 2, fuel_type: 'petrol', status: 'available',
      engine: '', image_url: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
    setFormErrors({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'booked': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fleet data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Cars - MEMA Rental Admin</title>
        <meta name="description" content="Manage car fleet for MEMA Rental" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('manageCars')}</h1>
            <p className="text-gray-600 mt-1">Manage your car fleet and vehicle inventory</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isCarDialogOpen} onOpenChange={(isOpen) => { setIsCarDialogOpen(isOpen); if (!isOpen) resetCarForm(); }}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsCarDialogOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Add Car
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {editingCar ? 'Edit Car' : 'Add New Car'}
                  </DialogTitle>
                </DialogHeader>
                <form key={editingCar?.id || 'new-car'} onSubmit={handleCarSubmit} className="space-y-6 pt-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Brand *</Label>
                        <Input 
                          value={carFormData.brand || ''} 
                          onChange={e => {
                            console.log('Brand changed to:', e.target.value); // Debug log
                            setCarFormData({...carFormData, brand: e.target.value});
                          }} 
                          required 
                          placeholder="e.g., Mercedes"
                          className={formErrors.brand ? 'border-red-500' : ''}
                        />
                        {formErrors.brand && <p className="text-red-500 text-sm mt-1">{formErrors.brand}</p>}
                      </div>
                      <div>
                        <Label>Model *</Label>
                        <Input 
                          value={carFormData.model || ''} 
                          onChange={e => setCarFormData({...carFormData, model: e.target.value})} 
                          required 
                          placeholder="e.g., C-Class"
                          className={formErrors.model ? 'border-red-500' : ''}
                        />
                        {formErrors.model && <p className="text-red-500 text-sm mt-1">{formErrors.model}</p>}
                      </div>
                      <div>
                        <Label>Year *</Label>
                        <Input 
                          type="number" 
                          value={carFormData.year || ''} 
                          onChange={e => setCarFormData({...carFormData, year: e.target.value})} 
                          required 
                          min="1900"
                          max={new Date().getFullYear() + 1}
                          className={formErrors.year ? 'border-red-500' : ''}
                        />
                        {formErrors.year && <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>}
                      </div>
                      <div>
                        <Label>Daily Rate (€) *</Label>
                        <Input 
                          type="number" 
                          step="0.01" 
                          value={carFormData.daily_rate || ''} 
                          onChange={e => setCarFormData({...carFormData, daily_rate: e.target.value})} 
                          required 
                          placeholder="0.00"
                          className={formErrors.daily_rate ? 'border-red-500' : ''}
                        />
                        {formErrors.daily_rate && <p className="text-red-500 text-sm mt-1">{formErrors.daily_rate}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Specifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Engine</Label>
                        <Input 
                          value={carFormData.engine || ''} 
                          onChange={e => setCarFormData({...carFormData, engine: e.target.value})} 
                          placeholder="e.g., 1.4 Diesel"
                        />
                      </div>
                      <div>
                        <Label>Seats</Label>
                        <Input 
                          type="number" 
                          value={carFormData.seats || ''} 
                          onChange={e => setCarFormData({...carFormData, seats: e.target.value})} 
                          min="1"
                          max="10"
                          className={formErrors.seats ? 'border-red-500' : ''}
                        />
                        {formErrors.seats && <p className="text-red-500 text-sm mt-1">{formErrors.seats}</p>}
                      </div>
                      <div>
                        <Label>Luggage Capacity</Label>
                        <Input 
                          type="number" 
                          value={carFormData.luggage || ''} 
                          onChange={e => setCarFormData({...carFormData, luggage: e.target.value})} 
                          min="0"
                          max="10"
                          className={formErrors.luggage ? 'border-red-500' : ''}
                        />
                        {formErrors.luggage && <p className="text-red-500 text-sm mt-1">{formErrors.luggage}</p>}
                      </div>
                      <div>
                        <Label>Transmission</Label>
                        <Select value={carFormData.transmission || 'automatic'} onValueChange={value => setCarFormData({...carFormData, transmission: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Fuel Type</Label>
                        <Select value={carFormData.fuel_type || 'petrol'} onValueChange={value => setCarFormData({...carFormData, fuel_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="petrol">Petrol</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={carFormData.status || 'available'} onValueChange={value => setCarFormData({...carFormData, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="booked">Booked</SelectItem>
                            <SelectItem value="maintenance">Under Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Image Upload with Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Car Image</h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Image URL</Label>
                        <Input 
                          value={carFormData.image_url || ''} 
                          onChange={e => setCarFormData({...carFormData, image_url: e.target.value})} 
                          placeholder="/images/cars/car.jpg" 
                        />
                      </div>
                      <div>
                        <Label>Upload Image</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="flex-1"
                          />
                          {uploadingImage && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                          )}
                        </div>
                        {selectedImage && (
                          <p className="text-xs text-gray-500 mt-1">Selected: {selectedImage.name}</p>
                        )}
                      </div>
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mt-2">
                          <Label>Preview</Label>
                          <div className="relative inline-block">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-32 h-24 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                              onClick={() => {
                                setImagePreview(null);
                                setSelectedImage(null);
                                setCarFormData(prev => ({ ...prev, image_url: '' }));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 h-12">
                    {editingCar ? 'Update Car' : 'Add Car'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-6 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>Error: {error.message}</span>
            </div>
            <Button onClick={error.retry} className="mt-2">
              Retry
            </Button>
          </Card>
        )}
            
        {/* Enhanced Search and Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cars by brand or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Select value={filters.status} onValueChange={value => setFilters({...filters, status: value})}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.fuelType} onValueChange={value => setFilters({...filters, fuelType: value})}>
              <SelectTrigger className="w-full sm:w-48">
                <Fuel className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fuel Types</SelectItem>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredCars.length} of {totalCount} cars (Page {currentPage} of {totalPages})
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={exportCars}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button 
                onClick={() => loadData(currentPage, true)}
                disabled={refreshing}
                variant="outline"
                size="sm"
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
        </div>

        {/* Bulk Operations */}
        {selectedCars.size > 0 && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-800">
                {selectedCars.size} car(s) selected
              </span>
              <div className="flex gap-2">
                <Select onValueChange={handleBulkStatusUpdate}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedCars(new Set())}
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Add Sample Cars Section */}
        <div>
          <AddCarsButton />
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden space-y-4">
          {filteredCars.length === 0 ? (
            <Card className="p-8 text-center border-0 shadow-md">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filters.status !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Get started by adding your first car to the fleet.'}
              </p>
              <Button onClick={() => setIsCarDialogOpen(true)} className="bg-yellow-500 hover:bg-yellow-600">
                <Plus className="mr-2 h-4 w-4" />
                Add First Car
              </Button>
            </Card>
          ) : (
            filteredCars.map((car, index) => (
              <Card key={car.id} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{car.brand} {car.model}</h3>
                    <p className="text-sm text-gray-600 mt-1">Year: {car.year}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {car.seats} seats
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="h-4 w-4" />
                        {car.fuel_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings className="h-4 w-4" />
                        {car.transmission}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(car.status)}`}>
                    {car.status}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-xl font-bold text-yellow-600">€{car.daily_rate}/day</div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditCar(car)}
                      className="text-gray-600 hover:text-yellow-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteCar(car.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Card className="border-0 shadow-md overflow-hidden">
            {filteredCars.length === 0 ? (
              <div className="p-8 text-center">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filters.status !== 'all' 
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
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={(e) => {
                            setSelectAll(e.target.checked);
                            if (e.target.checked) {
                              setSelectedCars(new Set(filteredCars.map(car => car.id)));
                            } else {
                              setSelectedCars(new Set());
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCars.map((car, index) => (
                      <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedCars.has(car.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedCars);
                              if (e.target.checked) {
                                newSelected.add(car.id);
                              } else {
                                newSelected.delete(car.id);
                              }
                              setSelectedCars(newSelected);
                              setSelectAll(newSelected.size === filteredCars.length);
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{car.brand} {car.model}</div>
                          <div className="text-sm text-gray-500">{car.year}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{car.seats} seats • {car.transmission}</div>
                          <div className="text-sm text-gray-500">{car.fuel_type} • {car.engine}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-semibold text-yellow-600">€{car.daily_rate}/day</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(car.status)}`}>
                            {car.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditCar(car)}
                              className="text-gray-500 hover:text-yellow-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteCar(car.id)}
                              className="text-gray-500 hover:text-red-600"
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Styled Confirmation Dialog */}
      <Dialog open={deleteConfirmation.isOpen} onOpenChange={(open) => !open && setDeleteConfirmation({ isOpen: false, carId: null, carName: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete <span className="font-semibold">"{deleteConfirmation.carName}"</span>? 
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmation({ isOpen: false, carId: null, carName: '' })}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete Car
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminCars;

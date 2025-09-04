import React, { useEffect, useMemo, useState } from 'react';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { BookingService } from '@/lib/bookingService';
import { getValidationErrors, canProceedToNextStep } from '@/lib/validation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Shield, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Car,
  Star,
  Users,
  Fuel,
  Zap,
  Navigation,
  Wifi,
  Heart,
  AlertCircle,
  Loader2
} from 'lucide-react';
// Removed HeroHeader per request


const BookingPage = () => {
  const { carId } = useParams();
  const { t, tFormat } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [car, setCar] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [bookedDates, setBookedDates] = useState([]);
  const [loadingBookedDates, setLoadingBookedDates] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Dates
    pickupDate: '',
    returnDate: '',
    pickupTime: '',
    returnTime: '',
    
    // Step 2: Personal Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    
    // Step 3: Extras & Location
    pickupLocation: '',
    returnLocation: '',
    extras: [],
    specialRequests: '',
    
    // Terms acceptance
    acceptTerms: false
  });

  useEffect(() => {
    let isMounted = true;
    const loadCar = async () => {
      setLoading(true);
      setFetchError(null);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();
      if (!isMounted) return;
      if (error) {
        console.error('Failed to load car:', error);
        setFetchError(error.message || 'Failed to load car');
      }
      setCar(data || null);
      setLoading(false);
    };
    loadCar();
    return () => { isMounted = false; };
  }, [carId]);

  // Fetch booked dates for the car
  useEffect(() => {
    if (!carId) return;
    
    const loadBookedDates = async () => {
      setLoadingBookedDates(true);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('pickup_date, return_date, status')
          .eq('car_id', carId)
          .in('status', ['confirmed', 'active']);
        
        if (error) {
          console.error('Failed to load booked dates:', error);
          return;
        }
        
        // Convert booking data to date ranges
        const dates = [];
        (data || []).forEach(booking => {
          const startDate = new Date(booking.pickup_date);
          const endDate = new Date(booking.return_date);
          
          // Add all dates in the range
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
    
    loadBookedDates();
  }, [carId]);

  const carData = useMemo(() => {
    if (!car) return null;
    const dailyRate = Number(car?.daily_rate) || 0;
    const category = dailyRate > 70 ? 'Luxury' : dailyRate > 50 ? 'Premium' : 'Economy';
    const transmission = (car?.transmission || '').toLowerCase() === 'manual' ? 'Manual' : 'Automatic';
    const fuelType = (car?.fuel_type || '').toLowerCase();
    const fuel = fuelType ? fuelType.charAt(0).toUpperCase() + fuelType.slice(1) : 'Petrol';
    return {
      id: car.id,
      brand: car.brand || 'Unknown',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      price: dailyRate,
      image: 'https://images.unsplash.com/photo-1612935459247-3f90353c6c50',
      rating: 4.8,
      reviews: 0,
      seats: car.seats ?? 5,
      fuel,
      transmission,
      category,
      status: car.status || 'available',
      pickupTime: '24/7'
    };
  }, [car]);

  const carUnavailable = !!carData && carData.status !== 'available';

  const locations = [
    'Tirana Airport',
    'Tirana City Center',
    'Durres Port',
    'Hotel Pickup',
    'Custom Location'
  ];

  const extras = [
    { id: 'gps', name: 'GPS Navigation', price: 5, description: 'Turn-by-turn navigation' },
    { id: 'insurance', name: 'Additional Insurance', price: 15, description: 'Comprehensive coverage' },
    { id: 'child-seat', name: 'Child Seat', price: 8, description: 'Safe for children' },
    { id: 'wifi', name: 'Mobile WiFi', price: 10, description: 'Internet on the go' }
  ];

  const localBenefits = [
    { icon: Shield, title: 'Fully Insured', description: 'Comprehensive coverage for peace of mind' },
    { icon: Clock, title: '24/7 Support', description: 'Round-the-clock assistance in Tirana' },
    { icon: Zap, title: 'Quick Booking', description: 'Reserve your car in minutes' },
    { icon: Heart, title: 'Best Rates', description: 'Competitive pricing guaranteed' }
  ];

  // Check if a date is booked
  const isDateBooked = (dateString) => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === selectedDate.toDateString()
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleExtraToggle = (extraId) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter(id => id !== extraId)
        : [...prev.extras, extraId]
    }));
  };

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const diffTime = returnDate - pickup;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const basePrice = days * carData.price;
    const extrasTotal = formData.extras.reduce((total, extraId) => {
      const extra = extras.find(e => e.id === extraId);
      return total + (extra ? extra.price * days : 0);
    }, 0);
    return basePrice + extrasTotal;
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const errors = getValidationErrors(formData, currentStep);
    
    // Check for booked dates
    if (currentStep === 1) {
      if (formData.pickupDate && isDateBooked(formData.pickupDate)) {
        errors.pickupDate = 'This date is already booked. Please select a different date.';
      }
      if (formData.returnDate && isDateBooked(formData.returnDate)) {
        errors.returnDate = 'This date is already booked. Please select a different date.';
      }
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        variant: 'destructive'
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!carData) return;
    
    // Final validation
    const errors = getValidationErrors(formData, currentStep);
    
    // Check for booked dates
    if (formData.pickupDate && isDateBooked(formData.pickupDate)) {
      errors.pickupDate = 'This date is already booked. Please select a different date.';
    }
    if (formData.returnDate && isDateBooked(formData.returnDate)) {
      errors.returnDate = 'This date is already booked. Please select a different date.';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // Prepare booking data
      const bookingData = {
        carId: carData.id,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        pickupTime: formData.pickupTime,
        returnTime: formData.returnTime,
        pickupLocation: formData.pickupLocation,
        returnLocation: formData.returnLocation,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
        extras: formData.extras.map(extraId => {
          const extra = extras.find(e => e.id === extraId);
          return extra ? { id: extra.id, name: extra.name, price: extra.price } : null;
        }).filter(Boolean),
        specialRequests: formData.specialRequests
      };

      // Create booking
      const result = await BookingService.createBooking(bookingData);
      
      if (result.success) {
        toast({
          title: 'Booking Confirmed!',
          description: `Your booking has been created successfully. Reference: ${result.booking.booking_reference}`,
          variant: 'default'
        });
        
        // Navigate to confirmation page with booking details
        navigate('/booking-confirmation', { 
          state: { 
            bookingId: result.bookingId,
            bookingReference: result.booking.booking_reference 
          } 
        });
      } else {
        toast({
          title: 'Booking Failed',
          description: result.error || 'Failed to create booking. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      toast({
        title: 'Booking Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Reservation",
    "name": `Car Rental Booking - ${carData?.brand} ${carData?.model}`,
    "description": `Book your ${carData?.brand} ${carData?.model} rental car in Tirana, Albania`,
    "provider": {
      "@type": "Organization",
      "name": "MEMA Rental",
      "url": "https://memarental.com"
    },
    "reservationFor": {
      "@type": "Car",
      "brand": carData?.brand,
      "model": carData?.model,
      "year": carData?.year
    }
  };

  return (
    <>
      {carData && (
        <Seo
          title={tFormat('seoBookingTitle', { brand: carData.brand, model: carData.model })}
          description={tFormat('seoBookingDesc', { brand: carData.brand, model: carData.model })}
          path={`/booking/${carId}`}
          image={carData.image}
          keywords={`book car rental Tirana, car rental booking Albania, ${carData.brand} ${carData.model} rental Tirana, car hire booking Albania, Tirana car rental booking, Albania car rental reservation, book car Tirana, car rental online booking Albania, Tirana airport car rental booking, Albania car hire reservation`}
          schema={structuredData}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {loading ? (
          <div className="text-center py-8 text-gray-500">{t('loading') || 'Loading...'}</div>
        ) : fetchError || !carData ? (
          <div className="text-center py-8 text-red-600">{fetchError || 'Car not found'}</div>
        ) : null}
        <div className="container-mobile py-6 sm:py-8">
          {/* Header */}
          {carData && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">{t('bookingHeaderTitle')}</h1>
              <p className="text-lg sm:text-xl text-gray-600">
                {tFormat('bookingHeaderCopyFmt', { brand: carData.brand, model: carData.model })}
              </p>
            </motion.div>
          )}

          {(!loading && carData) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                    <span>{t('bookingDetails')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {carUnavailable && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                      {t('notAvailable') || 'This car is currently booked and not available.'}
                    </div>
                  )}
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step <= currentStep 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step}
                        </div>
                        {step < 3 && (
                          <div className={`w-16 h-1 mx-2 ${
                            step < currentStep ? 'bg-yellow-500' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Form Steps */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: currentStep > (currentStep - 1) ? 50 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: currentStep > (currentStep - 1) ? -50 : 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentStep === 1 && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('step1Title')}</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="pickupDate" className="flex items-center">
                                {t('pickupDate')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <DatePicker
                                value={formData.pickupDate}
                                onChange={(value) => handleInputChange('pickupDate', value)}
                                minDate={new Date().toISOString().split('T')[0]}
                                bookedDates={bookedDates}
                                placeholder="Add dates"
                                className={`mt-1 ${validationErrors.pickupDate ? 'border-red-500 focus:border-red-500' : ''}`}
                                disabled={loadingBookedDates}
                                loadingBookedDates={loadingBookedDates}
                                rangeStart={formData.pickupDate}
                                rangeEnd={formData.returnDate}
                              />
                              {validationErrors.pickupDate && (
                                <p id="pickupDate-error" className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.pickupDate}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="returnDate" className="flex items-center">
                                {t('returnDate')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <DatePicker
                                value={formData.returnDate}
                                onChange={(value) => handleInputChange('returnDate', value)}
                                minDate={formData.pickupDate || new Date().toISOString().split('T')[0]}
                                bookedDates={bookedDates}
                                placeholder="Add dates"
                                className={`mt-1 ${validationErrors.returnDate ? 'border-red-500 focus:border-red-500' : ''}`}
                                disabled={loadingBookedDates}
                                loadingBookedDates={loadingBookedDates}
                                rangeStart={formData.pickupDate}
                                rangeEnd={formData.returnDate}
                              />
                              {validationErrors.returnDate && (
                                <p id="returnDate-error" className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.returnDate}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="pickupTime" className="flex items-center">
                                {t('pickupTime')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Select value={formData.pickupTime} onValueChange={(value) => handleInputChange('pickupTime', value)}>
                                <SelectTrigger className={`mt-1 ${validationErrors.pickupTime ? 'border-red-500 focus:border-red-500' : ''}`}>
                                  <SelectValue placeholder={t('selectPickupTime')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="08:00">8:00 AM</SelectItem>
                                  <SelectItem value="09:00">9:00 AM</SelectItem>
                                  <SelectItem value="10:00">10:00 AM</SelectItem>
                                  <SelectItem value="11:00">11:00 AM</SelectItem>
                                  <SelectItem value="12:00">12:00 PM</SelectItem>
                                  <SelectItem value="13:00">1:00 PM</SelectItem>
                                  <SelectItem value="14:00">2:00 PM</SelectItem>
                                  <SelectItem value="15:00">3:00 PM</SelectItem>
                                  <SelectItem value="16:00">4:00 PM</SelectItem>
                                  <SelectItem value="17:00">5:00 PM</SelectItem>
                                </SelectContent>
                              </Select>
                              {validationErrors.pickupTime && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.pickupTime}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="returnTime" className="flex items-center">
                                {t('returnTime')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Select value={formData.returnTime} onValueChange={(value) => handleInputChange('returnTime', value)}>
                                <SelectTrigger className={`mt-1 ${validationErrors.returnTime ? 'border-red-500 focus:border-red-500' : ''}`}>
                                  <SelectValue placeholder={t('selectReturnTime')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="08:00">8:00 AM</SelectItem>
                                  <SelectItem value="09:00">9:00 AM</SelectItem>
                                  <SelectItem value="10:00">10:00 AM</SelectItem>
                                  <SelectItem value="11:00">11:00 AM</SelectItem>
                                  <SelectItem value="12:00">12:00 PM</SelectItem>
                                  <SelectItem value="13:00">1:00 PM</SelectItem>
                                  <SelectItem value="14:00">2:00 PM</SelectItem>
                                  <SelectItem value="15:00">3:00 PM</SelectItem>
                                  <SelectItem value="16:00">4:00 PM</SelectItem>
                                  <SelectItem value="17:00">5:00 PM</SelectItem>
                                </SelectContent>
                              </Select>
                              {validationErrors.returnTime && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.returnTime}
                                </p>
                              )}
                            </div>
                          </div>
                          
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('step2Title')}</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="firstName" className="flex items-center">
                                {t('firstName')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className={`mt-1 ${validationErrors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
                                aria-describedby={validationErrors.firstName ? 'firstName-error' : undefined}
                              />
                              {validationErrors.firstName && (
                                <p id="firstName-error" className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.firstName}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="lastName" className="flex items-center">
                                {t('lastName')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className={`mt-1 ${validationErrors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
                                aria-describedby={validationErrors.lastName ? 'lastName-error' : undefined}
                              />
                              {validationErrors.lastName && (
                                <p id="lastName-error" className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.lastName}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="email" className="flex items-center">
                                Email <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`mt-1 ${validationErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                aria-describedby={validationErrors.email ? 'email-error' : undefined}
                              />
                              {validationErrors.email && (
                                <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.email}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="phone" className="flex items-center">
                                {t('phoneNumber')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={`mt-1 ${validationErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                                aria-describedby={validationErrors.phone ? 'phone-error' : undefined}
                              />
                              {validationErrors.phone && (
                                <p id="phone-error" className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.phone}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="licenseNumber" className="flex items-center">
                                {t('driversLicenseNumber')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Input
                                id="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                                className={`mt-1 ${validationErrors.licenseNumber ? 'border-red-500 focus:border-red-500' : ''}`}
                                aria-describedby={validationErrors.licenseNumber ? 'licenseNumber-error' : undefined}
                              />
                              {validationErrors.licenseNumber && (
                                <p id="licenseNumber-error" className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.licenseNumber}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="licenseExpiry" className="flex items-center">
                                {t('licenseExpiry')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Input
                                id="licenseExpiry"
                                type="date"
                                value={formData.licenseExpiry}
                                onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={`mt-1 ${validationErrors.licenseExpiry ? 'border-red-500 focus:border-red-500' : ''}`}
                                aria-describedby={validationErrors.licenseExpiry ? 'licenseExpiry-error' : undefined}
                              />
                              {validationErrors.licenseExpiry && (
                                <p id="licenseExpiry-error" className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.licenseExpiry}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('step3Title')}</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="pickupLocation" className="flex items-center">
                                {t('pickupLocationLabel')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Select value={formData.pickupLocation} onValueChange={(value) => handleInputChange('pickupLocation', value)}>
                                <SelectTrigger className={`mt-1 ${validationErrors.pickupLocation ? 'border-red-500 focus:border-red-500' : ''}`}>
                                  <SelectValue placeholder={t('selectPickupLocation')} />
                                </SelectTrigger>
                                <SelectContent>
                                  {locations.map((location) => (
                                    <SelectItem key={location} value={location}>{location}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {validationErrors.pickupLocation && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.pickupLocation}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="returnLocation" className="flex items-center">
                                {t('returnLocationLabel')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              <Select value={formData.returnLocation} onValueChange={(value) => handleInputChange('returnLocation', value)}>
                                <SelectTrigger className={`mt-1 ${validationErrors.returnLocation ? 'border-red-500 focus:border-red-500' : ''}`}>
                                  <SelectValue placeholder={t('selectReturnLocation')} />
                                </SelectTrigger>
                                <SelectContent>
                                  {locations.map((location) => (
                                    <SelectItem key={location} value={location}>{location}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {validationErrors.returnLocation && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.returnLocation}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">{t('additionalServices')}</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                              {extras.map((extra) => (
                                <div key={extra.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                                  <Checkbox
                                    id={extra.id}
                                    checked={formData.extras.includes(extra.id)}
                                    onCheckedChange={() => handleExtraToggle(extra.id)}
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={extra.id} className="font-medium">{extra.name}</Label>
                                    <p className="text-sm text-gray-600">{extra.description}</p>
                                  </div>
                                  <span className="text-yellow-600 font-semibold">€{extra.price}{t('perDayLower')}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="specialRequests">{t('specialRequests')}</Label>
                            <Textarea
                              id="specialRequests"
                              value={formData.specialRequests}
                              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                              placeholder={t('specialRequestsPlaceholder')}
                              className="mt-1 resize-none"
                              rows={3}
                            />
                          </div>

                          {/* Payment Information */}
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2 mb-3">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                              <h4 className="font-semibold text-gray-800">Cash Payment</h4>
                            </div>
                            <p className="text-gray-700 text-sm">
                              Payment will be collected in cash upon pickup. No online payment required.
                            </p>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="acceptTerms"
                              checked={formData.acceptTerms}
                              onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                            />
                            <div className="flex-1">
                              <Label htmlFor="acceptTerms" className="text-sm flex items-start">
                                {t('acceptTerms')} <span className="text-red-500 ml-1">*</span>
                              </Label>
                              {validationErrors.acceptTerms && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {validationErrors.acceptTerms}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex justify-between mt-8">
                        <Button
                          variant="outline"
                          onClick={handleBack}
                          disabled={currentStep === 1 || submitting}
                          className="flex items-center space-x-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>{t('back')}</span>
                        </Button>
                        
                        {currentStep < 3 ? (
                          <Button
                            onClick={handleNext}
                            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600"
                            disabled={carUnavailable || submitting}
                          >
                            <span>{t('next')}</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmit}
                            disabled={!formData.acceptTerms || carUnavailable || submitting}
                            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Creating Booking...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                <span>{t('completeBooking')}</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* Car Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-6 w-6 text-yellow-600" />
                    <span>{t('carSummary')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Car Image */}
                    <div className="relative overflow-hidden rounded-lg">
                      <img 
                        src={carData.image} 
                        alt={`${carData.brand} ${carData.model} car rental in Tirana, Albania`}
                        className="w-full h-48 object-cover"
                      />
                      {carUnavailable && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">{t('notAvailable') || 'Not available'}</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">{carData.rating}</span>
                      </div>
                    </div>

                    {/* Car Details */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {carData.brand} {carData.model}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{carData.seats} {t('seatsLower')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Fuel className="h-4 w-4 text-green-500" />
                          <span>{carData.fuel}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-purple-500" />
                          <span>{carData.transmission}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-yellow-500" />
                           <span>{t('insured')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3">{t('bookingSummary')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t('rentalPeriod')}</span>
                          <span>{calculateDays()} {t('daysLower')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('basePrice')}</span>
                          <span>€{carData.price}{t('perDayLower')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status</span>
                          <span className={`font-medium ${carUnavailable ? 'text-red-600' : 'text-green-600'}`}>
                            {carUnavailable ? (t('notAvailable') || 'Booked') : (t('available') || 'Available')}
                          </span>
                        </div>
                        {formData.extras.length > 0 && (
                          <div className="border-t pt-2">
                            <div className="font-medium mb-2">{t('extrasLabel')}</div>
                            {formData.extras.map((extraId) => {
                              const extra = extras.find(e => e.id === extraId);
                              return extra ? (
                                <div key={extraId} className="flex justify-between text-xs">
                                  <span>{extra.name}:</span>
                                  <span>€{extra.price}/day</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total:</span>
                            <span>€{calculateTotal()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Local Benefits */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3">{t('whyChooseMemaShort')}</h4>
                      <div className="space-y-3">
                        {localBenefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="p-1 bg-yellow-100 rounded-full">
                              <benefit.icon className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{benefit.title}</div>
                              <div className="text-xs text-gray-600">{benefit.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3">{t('needHelp')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span>+355 4 123 4567</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span>info@memarental.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-red-600" />
                          <span>Tirana City Center</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-yellow-500 to-orange-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Explore Albania?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Book your car rental in Tirana today and start your Albanian adventure with the best rates and service. 
              Available for pickup in Tirana city center and airport.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="bg-white text-yellow-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/cars">
                  Book Your Car Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-yellow-600 text-lg px-8 py-4">
                <Link to="/contact">
                  Get in Touch
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BookingPage;
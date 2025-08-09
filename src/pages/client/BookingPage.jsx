
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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
  Heart
} from 'lucide-react';

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    
    // Step 4: Payment
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardholderName: '',
    acceptTerms: false
  });

  // Mock car data
  const carData = {
    id: carId,
    brand: 'BMW',
    model: '3 Series',
    year: 2023,
    price: 65,
    image: 'https://images.unsplash.com/photo-1612935459247-3f90353c6c50',
    rating: 4.8,
    reviews: 127,
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Automatic',
    category: 'Luxury'
  };

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Simulate booking submission
    console.log('Booking submitted:', formData);
    // Navigate to confirmation page
    navigate('/booking-confirmation');
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Reservation",
    "name": `Car Rental Booking - ${carData.brand} ${carData.model} in Tirana, Albania`,
    "description": `Book your ${carData.brand} ${carData.model} rental in Tirana, Albania. Secure online booking with instant confirmation.`,
    "provider": {
      "@type": "Organization",
      "name": "MEMA Rental - Car Rental Tirana Albania",
      "alternateName": "MEMA Car Rental",
      "url": "https://memarental.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rruga e Durresit 123",
        "addressLocality": "Tirana",
        "addressRegion": "Tirana",
        "postalCode": "1001",
        "addressCountry": "AL"
      },
      "telephone": "+355-4-123-4567",
      "email": "info@memarental.com",
      "openingHours": [
        "Mo-Su 08:00-20:00"
      ]
    },
    "reservationFor": {
      "@type": "Car",
      "name": `${carData.brand} ${carData.model}`,
      "brand": {
        "@type": "Brand",
        "name": carData.brand
      },
      "model": carData.model,
      "vehicleCategory": carData.category
    },
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": carData.price,
      "priceCurrency": "EUR",
      "unitText": "per day"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Albania"
    },
    "serviceArea": {
      "@type": "Place",
      "name": "Tirana, Albania"
    }
  };

  return (
    <>
      <Helmet>
        <title>Book Car Rental in Tirana, Albania - {carData.brand} {carData.model} | MEMA Rental</title>
        <meta name="title" content="Book Car Rental in Tirana, Albania - {carData.brand} {carData.model} | MEMA Rental" />
        <meta name="description" content={`Book your ${carData.brand} ${carData.model} rental in Tirana, Albania. Secure online booking with instant confirmation. Best car rental service in Tirana with competitive rates.`} />
        <meta name="keywords" content={`book car rental Tirana, car rental booking Albania, ${carData.brand} ${carData.model} rental Tirana, car hire booking Albania, Tirana car rental booking, Albania car rental reservation, book car Tirana, car rental online booking Albania, Tirana airport car rental booking, Albania car hire reservation`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="MEMA Rental" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://memarental.com/booking/${carId}`} />
        <meta property="og:title" content={`Book Car Rental in Tirana, Albania - ${carData.brand} ${carData.model} | MEMA Rental`} />
        <meta property="og:description" content={`Book your ${carData.brand} ${carData.model} rental in Tirana, Albania. Secure online booking with instant confirmation.`} />
        <meta property="og:image" content={carData.image} />
        <meta property="og:site_name" content="MEMA Rental" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://memarental.com/booking/${carId}`} />
        <meta property="twitter:title" content={`Book Car Rental in Tirana, Albania - ${carData.brand} ${carData.model} | MEMA Rental`} />
        <meta property="twitter:description" content={`Book your ${carData.brand} ${carData.model} rental in Tirana, Albania. Secure online booking with instant confirmation.`} />
        <meta property="twitter:image" content={carData.image} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="AL" />
        <meta name="geo.placename" content="Tirana" />
        <meta name="geo.position" content="41.3275;19.8187" />
        <meta name="ICBM" content="41.3275, 19.8187" />
        <meta name="DC.title" content={`Book Car Rental in Tirana, Albania - ${carData.brand} ${carData.model} | MEMA Rental`} />
        <meta name="DC.description" content={`Book your ${carData.brand} ${carData.model} rental in Tirana, Albania.`} />
        <meta name="DC.subject" content="Car Rental, Booking, Tirana, Albania" />
        <meta name="DC.creator" content="MEMA Rental" />
        <meta name="DC.publisher" content="MEMA Rental" />
        <meta name="DC.coverage" content="Tirana, Albania" />
        <meta name="DC.language" content="en" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://memarental.com/booking/${carId}`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Book Your Car Rental in Tirana, Albania
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              Complete your booking for the {carData.brand} {carData.model} - Best car rental service in Tirana
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                    <span>Booking Details - Car Rental in Tirana</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step <= currentStep 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step}
                        </div>
                        {step < 4 && (
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
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Dates & Times</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="pickupDate">Pickup Date</Label>
                              <Input
                                id="pickupDate"
                                type="date"
                                value={formData.pickupDate}
                                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="returnDate">Return Date</Label>
                              <Input
                                id="returnDate"
                                type="date"
                                value={formData.returnDate}
                                onChange={(e) => handleInputChange('returnDate', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="pickupTime">Pickup Time</Label>
                              <Select value={formData.pickupTime} onValueChange={(value) => handleInputChange('pickupTime', value)}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select pickup time" />
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
                            </div>
                            <div>
                              <Label htmlFor="returnTime">Return Time</Label>
                              <Select value={formData.returnTime} onValueChange={(value) => handleInputChange('returnTime', value)}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select return time" />
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
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Details</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="licenseNumber">Driver's License Number</Label>
                              <Input
                                id="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                              <Input
                                id="licenseExpiry"
                                type="date"
                                value={formData.licenseExpiry}
                                onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">Extras & Location</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="pickupLocation">Pickup Location</Label>
                              <Select value={formData.pickupLocation} onValueChange={(value) => handleInputChange('pickupLocation', value)}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select pickup location" />
                                </SelectTrigger>
                                <SelectContent>
                                  {locations.map((location) => (
                                    <SelectItem key={location} value={location}>{location}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="returnLocation">Return Location</Label>
                              <Select value={formData.returnLocation} onValueChange={(value) => handleInputChange('returnLocation', value)}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select return location" />
                                </SelectTrigger>
                                <SelectContent>
                                  {locations.map((location) => (
                                    <SelectItem key={location} value={location}>{location}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">Additional Services</Label>
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
                                  <span className="text-yellow-600 font-semibold">€{extra.price}/day</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="specialRequests">Special Requests</Label>
                            <Textarea
                              id="specialRequests"
                              value={formData.specialRequests}
                              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                              placeholder="Any special requests or requirements..."
                              className="mt-1 resize-none"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}

                      {currentStep === 4 && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                value={formData.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cardholderName">Cardholder Name</Label>
                              <Input
                                id="cardholderName"
                                value={formData.cardholderName}
                                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cardExpiry">Expiry Date</Label>
                              <Input
                                id="cardExpiry"
                                value={formData.cardExpiry}
                                onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                                placeholder="MM/YY"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cardCVC">CVC</Label>
                              <Input
                                id="cardCVC"
                                value={formData.cardCVC}
                                onChange={(e) => handleInputChange('cardCVC', e.target.value)}
                                placeholder="123"
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="acceptTerms"
                              checked={formData.acceptTerms}
                              onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                            />
                            <Label htmlFor="acceptTerms" className="text-sm">
                              I accept the terms and conditions and privacy policy
                            </Label>
                          </div>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex justify-between mt-8">
                        <Button
                          variant="outline"
                          onClick={handleBack}
                          disabled={currentStep === 1}
                          className="flex items-center space-x-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>Back</span>
                        </Button>
                        
                        {currentStep < 4 ? (
                          <Button
                            onClick={handleNext}
                            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600"
                          >
                            <span>Next</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmit}
                            disabled={!formData.acceptTerms}
                            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Complete Booking</span>
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
                    <span>Car Summary</span>
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
                          <span>{carData.seats} seats</span>
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
                          <span>Insured</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Booking Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Rental Period:</span>
                          <span>{calculateDays()} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Base Price:</span>
                          <span>€{carData.price}/day</span>
                        </div>
                        {formData.extras.length > 0 && (
                          <div className="border-t pt-2">
                            <div className="font-medium mb-2">Extras:</div>
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
                      <h4 className="font-semibold text-gray-800 mb-3">Why Choose MEMA Rental?</h4>
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
                      <h4 className="font-semibold text-gray-800 mb-3">Need Help?</h4>
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


import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Users, Fuel, Calendar, MapPin, Phone, ChevronDown, ChevronUp, X, Zap, Shield, Clock, Car, Award, TrendingUp, Heart, Eye, Mail, Navigation, CheckCircle } from 'lucide-react';

const dummyCars = [
  { 
    id: '1', 
    brand: 'BMW', 
    model: '3 Series', 
    year: 2023, 
    price: 65, 
    image: 'modern-white-bmw-sedan',
    rating: 4.8,
    reviews: 127,
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Automatic',
    available: true,
    category: 'Luxury',
    mileage: 'Unlimited',
    location: 'Tirana',
    features: ['Bluetooth', 'GPS Navigation', 'Backup Camera', 'Heated Seats'],
    pickupTime: '24/7',
    popular: true,
    discount: 10
  },
  { 
    id: '2', 
    brand: 'Mercedes-Benz', 
    model: 'C-Class', 
    year: 2023, 
    price: 75, 
    image: 'luxury-mercedes-c-class-car',
    rating: 4.9,
    reviews: 89,
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Automatic',
    available: true,
    category: 'Luxury',
    mileage: 'Unlimited',
    location: 'Tirana',
    features: ['Premium Audio', 'Leather Seats', 'Parking Sensors', 'LED Headlights'],
    pickupTime: '8:00-20:00',
    popular: false,
    discount: 0
  },
  { 
    id: '3', 
    brand: 'Audi', 
    model: 'A4', 
    year: 2022, 
    price: 70, 
    image: 'sleek-audi-a4-driving',
    rating: 4.7,
    reviews: 156,
    seats: 5,
    fuel: 'Diesel',
    transmission: 'Automatic',
    available: true,
    category: 'Premium',
    mileage: 'Unlimited',
    location: 'Tirana',
    features: ['Virtual Cockpit', 'Quattro AWD', 'Matrix LED', 'Wireless Charging'],
    pickupTime: '24/7',
    popular: true,
    discount: 5
  },
  { 
    id: '4', 
    brand: 'Volkswagen', 
    model: 'Golf', 
    year: 2023, 
    price: 45, 
    image: 'compact-volkswagen-golf-car',
    rating: 4.6,
    reviews: 203,
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Manual',
    available: true,
    category: 'Economy',
    mileage: 'Unlimited',
    location: 'Tirana',
    features: ['Apple CarPlay', 'Android Auto', 'Cruise Control', 'Bluetooth'],
    pickupTime: '8:00-20:00',
    popular: false,
    discount: 0
  },
  { 
    id: '5', 
    brand: 'Toyota', 
    model: 'Corolla', 
    year: 2023, 
    price: 40, 
    image: 'reliable-toyota-corolla-sedan',
    rating: 4.5,
    reviews: 178,
    seats: 5,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    available: true,
    category: 'Economy',
    mileage: 'Unlimited',
    location: 'Tirana',
    features: ['Hybrid Engine', 'Safety Sense', 'Smart Key', 'Backup Camera'],
    pickupTime: '24/7',
    popular: true,
    discount: 15
  },
  { 
    id: '6', 
    brand: 'Ford', 
    model: 'Focus', 
    year: 2022, 
    price: 38, 
    image: 'blue-ford-focus-hatchback',
    rating: 4.4,
    reviews: 134,
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Manual',
    available: true,
    category: 'Economy',
    mileage: 'Unlimited',
    location: 'Tirana',
    features: ['SYNC 3', 'Bluetooth', 'USB Ports', 'Air Conditioning'],
    pickupTime: '8:00-20:00',
    popular: false,
    discount: 0
  },
];

const CarsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filteredCars = dummyCars.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = !priceFilter || 
                        (priceFilter === 'low' && car.price <= 50) ||
                        (priceFilter === 'medium' && car.price > 50 && car.price <= 70) ||
                        (priceFilter === 'high' && car.price > 70);
    const matchesBrand = !brandFilter || car.brand === brandFilter;
    const matchesCategory = !categoryFilter || car.category === categoryFilter;
    
    return matchesSearch && matchesPrice && matchesBrand && matchesCategory;
  });

  const brands = [...new Set(dummyCars.map(car => car.brand))];
  const categories = [...new Set(dummyCars.map(car => car.category))];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Car Rental Fleet - MEMA Rental Tirana Albania",
    "description": "Browse our complete fleet of rental cars in Tirana, Albania. From economy to luxury vehicles. Best car rental service in Tirana with competitive rates.",
    "url": "https://memarental.com/cars",
    "numberOfItems": dummyCars.length,
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
    "areaServed": {
      "@type": "Country",
      "name": "Albania"
    },
    "serviceArea": {
      "@type": "Place",
      "name": "Tirana, Albania"
    },
    "itemListElement": dummyCars.map((car, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Car",
        "name": `${car.brand} ${car.model} - Car Rental in Tirana, Albania`,
        "description": `${car.year} ${car.brand} ${car.model} for rent in Tirana, Albania. Available for car rental in Tirana.`,
        "brand": {
          "@type": "Brand",
          "name": car.brand
        },
        "model": car.model,
        "vehicleModelDate": car.year.toString(),
        "vehicleSeatingCapacity": car.seats,
        "fuelType": car.fuel,
        "vehicleTransmission": car.transmission,
        "offers": {
          "@type": "Offer",
          "price": car.price,
          "priceCurrency": "EUR",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": car.price,
            "priceCurrency": "EUR",
            "unitText": "per day"
          },
          "availability": car.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
      }
    }))
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Car Rental Fleet Tirana Albania | Best Car Hire Service in Tirana | MEMA Rental</title>
        <meta name="title" content="Car Rental Fleet Tirana Albania | Best Car Hire Service in Tirana | MEMA Rental" />
        <meta name="description" content="Browse our complete car rental fleet in Tirana, Albania. Rent BMW, Mercedes, Audi, Toyota, Volkswagen, and Ford vehicles from €38/day. Best car hire selection in Albania. Located in Tirana city center." />
        <meta name="keywords" content="car rental fleet Tirana, car rental vehicles Albania, rent BMW Tirana, rent Mercedes Albania, rent Audi Tirana, rent Toyota Albania, rent Volkswagen Tirana, rent Ford Albania, luxury car rental Tirana, economy car rental Albania, SUV rental Tirana, car hire fleet Albania, Tirana car rental vehicles, Albania car rental selection, best car rental Tirana, car rental service Albania, Tirana airport car rental, Albania car hire service" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="MEMA Rental" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://memarental.com/cars" />
        <meta property="og:title" content="Car Rental Fleet Tirana Albania | Best Car Hire Service in Tirana | MEMA Rental" />
        <meta property="og:description" content="Browse our complete car rental fleet in Tirana, Albania. Rent BMW, Mercedes, Audi, Toyota, Volkswagen, and Ford vehicles from €38/day." />
        <meta property="og:image" content="https://memarental.com/cars-fleet-image.jpg" />
        <meta property="og:site_name" content="MEMA Rental" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://memarental.com/cars" />
        <meta property="twitter:title" content="Car Rental Fleet Tirana Albania | Best Car Hire Service in Tirana | MEMA Rental" />
        <meta property="twitter:description" content="Browse our complete car rental fleet in Tirana, Albania. Rent BMW, Mercedes, Audi, Toyota, Volkswagen, and Ford vehicles from €38/day." />
        <meta property="twitter:image" content="https://memarental.com/cars-fleet-image.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="AL" />
        <meta name="geo.placename" content="Tirana" />
        <meta name="geo.position" content="41.3275;19.8187" />
        <meta name="ICBM" content="41.3275, 19.8187" />
        <meta name="DC.title" content="Car Rental Fleet Tirana Albania | MEMA Rental" />
        <meta name="DC.description" content="Browse our complete car rental fleet in Tirana, Albania. Rent BMW, Mercedes, Audi, Toyota, Volkswagen, and Ford vehicles from €38/day." />
        <meta name="DC.subject" content="Car Rental Fleet, Tirana, Albania" />
        <meta name="DC.creator" content="MEMA Rental" />
        <meta name="DC.publisher" content="MEMA Rental" />
        <meta name="DC.coverage" content="Tirana, Albania" />
        <meta name="DC.language" content="en" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://memarental.com/cars" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6"
              >
                Car Rental Fleet in Tirana, Albania
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg lg:text-xl text-white/90 max-w-4xl mx-auto px-4 leading-relaxed"
              >
                Browse our complete selection of rental cars in Tirana. From economy to luxury vehicles, find the perfect car for your Albanian adventure. 
                All vehicles are well-maintained and come with comprehensive insurance. Located in the heart of Tirana city center.
              </motion.p>
              
              {/* Quick Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6 sm:mt-8"
              >
                {[
                  { icon: Car, label: '6+ Vehicles', value: 'Available' },
                  { icon: Star, label: '4.8 Rating', value: 'Average' },
                  { icon: Shield, label: '100% Insured', value: 'Coverage' },
                  { icon: Clock, label: '24/7 Support', value: 'Available' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
                  >
                    <stat.icon className="h-4 w-4 text-white" />
                    <span className="text-white text-sm font-medium">{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border-0">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search cars by brand or model for rent in Tirana..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base sm:text-lg border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                />
              </div>

              {/* Filter Toggle and View Mode */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <span className="text-sm text-gray-600">
                  {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} available for rent in Tirana, Albania
                </span>
                <div className="flex items-center space-x-3">
                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 px-3"
                    >
                      <div className="grid grid-cols-2 gap-1 w-4 h-4">
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                      </div>
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 px-3"
                    >
                      <div className="flex flex-col gap-1 w-4 h-4">
                        <div className="bg-current rounded-sm h-1"></div>
                        <div className="bg-current rounded-sm h-1"></div>
                        <div className="bg-current rounded-sm h-1"></div>
                      </div>
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 border-2 hover:border-yellow-500 hover:bg-yellow-50"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                        <Select value={brandFilter} onValueChange={setBrandFilter}>
                          <SelectTrigger className="border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200">
                            <SelectValue placeholder="All brands" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All brands</SelectItem>
                            {brands.map(brand => (
                              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200">
                            <SelectValue placeholder="All categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All categories</SelectItem>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                        <Select value={priceFilter} onValueChange={setPriceFilter}>
                          <SelectTrigger className="border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200">
                            <SelectValue placeholder="All prices" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All prices</SelectItem>
                            <SelectItem value="low">Under €50/day</SelectItem>
                            <SelectItem value="medium">€50-€70/day</SelectItem>
                            <SelectItem value="high">Over €70/day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm('');
                            setPriceFilter('');
                            setBrandFilter('');
                            setCategoryFilter('');
                          }}
                          className="flex-1 border-2 hover:border-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Cars Grid/List */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
            : "space-y-4"
          }>
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className={`overflow-hidden car-card h-full flex flex-col hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 ${viewMode === 'list' ? 'flex-row' : ''}`}>
                  <Link to={`/cars/${car.id}`} className={`block relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                    <div className="relative overflow-hidden">
                      <img 
                        className={`${viewMode === 'list' ? 'h-full' : 'h-48 sm:h-56'} w-full object-cover transition-transform duration-500 group-hover:scale-110`} 
                        alt={`${car.brand} ${car.model} car rental in Tirana, Albania - MEMA Rental`} 
                        src="https://images.unsplash.com/photo-1612935459247-3f90353c6c50" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1 shadow-lg">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{car.rating}</span>
                      <span className="text-xs text-gray-500">({car.reviews})</span>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
                      {car.category}
                    </div>
                    
                    {/* Popular Badge */}
                    {car.popular && (
                      <div className="absolute top-12 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        Popular
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {car.discount > 0 && (
                      <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
                        -{car.discount}%
                      </div>
                    )}
                    
                    {/* Availability Overlay */}
                    {!car.available && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-semibold text-lg">Not Available</span>
                      </div>
                    )}
                  </Link>
                  
                  <div className={`flex-grow flex flex-col ${viewMode === 'list' ? 'w-2/3 p-6' : 'p-4'}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg sm:text-xl lg:text-2xl">{car.brand} {car.model}</CardTitle>
                      <p className="text-gray-500 text-sm">Year: {car.year} • Location: {car.location}, Albania</p>
                    </CardHeader>
                    
                    <CardContent className="flex-grow flex flex-col">
                      {/* Car Features */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{car.seats}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <Fuel className="h-4 w-4 text-green-500" />
                          <span>{car.fuel}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <Calendar className="h-4 w-4 text-purple-500" />
                          <span>{car.transmission}</span>
                        </div>
                      </div>
                      
                      {/* Features Preview */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {car.features.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              <Zap className="h-3 w-3 mr-1" />
                              {feature}
                            </span>
                          ))}
                          {car.features.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              +{car.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="text-xl sm:text-2xl font-bold text-yellow-600">€{car.price}</p>
                              {car.discount > 0 && (
                                <p className="text-sm text-gray-500 line-through">€{Math.round(car.price * (1 + car.discount / 100))}</p>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">per day</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="border-2 hover:border-blue-500 hover:text-blue-600"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button 
                              asChild 
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 sm:px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                              disabled={!car.available}
                            >
                              <Link to={`/cars/${car.id}`}>
                                {car.available ? 'Rent This Car' : 'Not Available'}
                              </Link>
                            </Button>
                          </div>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{car.pickupTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3" />
                            <span>Insured</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredCars.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                <p>Try adjusting your search criteria or contact us for custom car rental requests in Tirana.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setPriceFilter('');
                  setBrandFilter('');
                  setCategoryFilter('');
                }}
                className="border-2 hover:border-yellow-500"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}

          {/* Additional SEO Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Car Rental Information - Tirana, Albania</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Car Rental Requirements in Tirana</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Valid driver's license (minimum 1 year)</li>
                    <li>Passport or ID card</li>
                    <li>Credit card for deposit</li>
                    <li>Minimum age: 21 years</li>
                    <li>International driving permit recommended</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Car Rental Services in Albania</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Free pickup and delivery in Tirana</li>
                    <li>24/7 roadside assistance</li>
                    <li>Comprehensive insurance coverage</li>
                    <li>GPS navigation available</li>
                    <li>Child seats available</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
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

export default CarsPage;

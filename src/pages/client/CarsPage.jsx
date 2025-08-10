
import React, { useEffect, useState } from 'react';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeroHeader from '@/components/HeroHeader';
import { Search, Filter, Star, Users, Fuel, Calendar, MapPin, Phone, ChevronDown, ChevronUp, X, Zap, Shield, Clock, Car, Award, TrendingUp, Heart, Eye, Mail, Navigation, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const normalizeCarRecord = (record) => {
  const dailyRate = Number(record?.daily_rate) || 0;
  const category = dailyRate > 70 ? 'Luxury' : dailyRate > 50 ? 'Premium' : 'Economy';
  const transmission = (record?.transmission || '').toLowerCase() === 'manual' ? 'Manual' : 'Automatic';
  const fuelType = (record?.fuel_type || '').toLowerCase();
  const fuel = fuelType
    ? fuelType.charAt(0).toUpperCase() + fuelType.slice(1)
    : 'Petrol';
  const isAvailable = (record?.status || 'available') === 'available';

  return {
    id: record?.id,
    brand: record?.brand || 'Unknown',
    model: record?.model || '',
    year: record?.year || new Date().getFullYear(),
    price: dailyRate,
    rating: 4.8,
    reviews: 0,
    seats: record?.seats ?? 5,
    fuel,
    transmission,
    available: isAvailable,
    category,
    mileage: 'Unlimited',
    location: 'Tirana',
    features: ['Bluetooth', 'Air Conditioning'],
    pickupTime: '24/7',
    popular: dailyRate >= 70,
    discount: 0,
  };
};

const CarsPage = () => {
  const { t, tFormat } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCars = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      if (!isMounted) return;
      if (error) {
        console.error('Failed to load cars:', error);
        setCars([]);
      } else {
        setCars((data || []).map(normalizeCarRecord));
      }
      setLoading(false);
    };
    loadCars();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCars = cars.filter(car => {
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

  const brands = [...new Set(cars.map(car => car.brand))];
  const categories = [...new Set(cars.map(car => car.category))];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Car Rental Fleet - MEMA Rental Tirana Albania",
    "description": "Browse our complete fleet of rental cars in Tirana, Albania. From economy to luxury vehicles. Best car rental service in Tirana with competitive rates.",
    "url": "https://memarental.com/cars",
    "numberOfItems": cars.length,
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
    "itemListElement": cars.map((car, index) => ({
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
      <Seo
        title={t('seoCarsTitle')}
        description={t('seoCarsDescription')}
        path="/cars"
        image="https://memarental.com/cars-fleet-image.jpg"
        keywords="car rental fleet Tirana, car rental vehicles Albania, rent BMW Tirana, rent Mercedes Albania, rent Audi Tirana, rent Toyota Albania, rent Volkswagen Tirana, rent Ford Albania, luxury car rental Tirana, economy car rental Albania, SUV rental Tirana, car hire fleet Albania, Tirana car rental vehicles, Albania car rental selection, best car rental Tirana, car rental service Albania, Tirana airport car rental, Albania car hire service"
        schema={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <HeroHeader
          title={t('carsHeroTitle')}
          subtitle={t('carsHeroSubtitle')}
          stats={[
            { icon: Car, label: t('vehiclesCount') },
            { icon: Star, label: t('averageRating') },
            { icon: Shield, label: t('fullyInsured') },
            { icon: Clock, label: t('support247') },
          ]}
        />

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
                  placeholder={t('carsSearchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base sm:text-lg border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                />
              </div>

              {/* Filter Toggle and View Mode */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <span className="text-sm text-gray-600">
                  {tFormat('carsAvailableCount', { count: filteredCars.length, plural: filteredCars.length !== 1 ? 's' : '' })}
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
                    <span className="hidden sm:inline">{t('filters')}</span>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('brand')}</label>
                        <Select value={brandFilter} onValueChange={setBrandFilter}>
                          <SelectTrigger className="border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200">
                            <SelectValue placeholder={t('allBrands')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t('allBrands')}</SelectItem>
                            {brands.map(brand => (
                              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('category')}</label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200">
                            <SelectValue placeholder={t('allCategories')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t('allCategories')}</SelectItem>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('priceRangeLabel')}</label>
                        <Select value={priceFilter} onValueChange={setPriceFilter}>
                          <SelectTrigger className="border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200">
                            <SelectValue placeholder={t('allPrices')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t('allPrices')}</SelectItem>
                            <SelectItem value="low">{t('under50')}</SelectItem>
                            <SelectItem value="medium">{t('between50And70')}</SelectItem>
                            <SelectItem value="high">{t('over70')}</SelectItem>
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
                          {t('clear')}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Cars Grid/List */}
          {loading && (
            <div className="text-center text-gray-500 py-10">{t('loading') || 'Loading cars...'}</div>
          )}
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
                        <span className="text-white font-semibold text-lg">{t('notAvailable')}</span>
                      </div>
                    )}
                  </Link>
                  
                  <div className={`flex-grow flex flex-col ${viewMode === 'list' ? 'w-2/3 p-6' : 'p-4'}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg sm:text-xl lg:text-2xl">{car.brand} {car.model}</CardTitle>
                      <p className="text-gray-500 text-sm">{t('year')}: {car.year} • {t('location')}: {car.location}, Albania</p>
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
                              +{car.features.length - 2} {t('more')}
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
                            <p className="text-sm text-gray-500">{t('perDay')}</p>
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
                                {car.available ? t('rentThisCar') : t('notAvailable')}
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
                            <span>{t('insured')}</span>
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
          {!loading && filteredCars.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('noCarsFound')}</h3>
                <p>{t('tryAdjusting')}</p>
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
                {t('clearAllFilters')}
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
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{t('infoTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('infoReqs')}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('req1')}</li>
                    <li>{t('req2')}</li>
                    <li>{t('req3')}</li>
                    <li>{t('req4')}</li>
                    <li>{t('req5')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('infoServices')}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('serv1')}</li>
                    <li>{t('serv2')}</li>
                    <li>{t('serv3')}</li>
                    <li>{t('serv4')}</li>
                    <li>{t('serv5')}</li>
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">{t('homeCtaTitle')}</h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              {t('homeCtaCopy')}
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="bg-white text-yellow-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/cars">
                  {t('bookNow')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-yellow-600 text-lg px-8 py-4">
                <Link to="/contact">
                  {t('getInTouch')}
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

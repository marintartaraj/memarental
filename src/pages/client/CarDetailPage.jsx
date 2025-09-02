import React, { useState, useEffect } from 'react';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Fuel, 
  Calendar, 
  MapPin, 
  Clock, 
  Shield, 
  Zap, 
  CheckCircle,
  Car,
  Phone,
  Mail,
  Navigation,
  Heart,
  Award,
  Loader2
} from 'lucide-react';
// Removed HeroHeader per request
import { supabase } from '@/lib/customSupabaseClient';
import { getAvailableCarImages } from '@/lib/addCarsToDatabase';

const CarDetailPage = () => {
  const { carId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch car data from database
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', carId)
          .single();

        if (error) {
          console.error('Error fetching car:', error);
          setError('Car not found');
          return;
        }

        if (!data) {
          setError('Car not found');
          return;
        }

        // Get available images for this car's brand
        const availableImages = getAvailableCarImages()[data.brand] || [];
        
        // Create car data object with real data and available images
        const car = {
          id: data.id,
          brand: data.brand,
          model: data.model,
          year: data.year,
          price: data.daily_rate,
          rating: 4.8,
          reviews: 127,
          seats: data.seats,
          fuel: data.fuel_type?.charAt(0).toUpperCase() + data.fuel_type?.slice(1) || 'Petrol',
          transmission: data.transmission?.charAt(0).toUpperCase() + data.transmission?.slice(1) || 'Automatic',
          category: data.daily_rate > 70 ? 'Luxury' : data.daily_rate > 50 ? 'Premium' : 'Economy',
          mileage: 'Unlimited',
          location: 'Tirana',
          pickupTime: '24/7',
          engine: data.engine || '',
          luggage: data.luggage || 2,
          status: data.status,
          image_url: data.image_url,
          features: [
            'Bluetooth Connectivity',
            'GPS Navigation',
            'Backup Camera',
            'Air Conditioning',
            'USB Charging Ports',
            'Cruise Control',
            'Parking Sensors',
            'Insurance Included'
          ],
          images: availableImages.length > 0 ? availableImages : [data.image_url || '/images/cars/placeholder-car.jpg'],
          description: `Experience the ${data.brand} ${data.model} - a perfect blend of comfort, style, and performance. This ${data.year} model offers excellent value for money and is perfect for exploring Albania. Available for rent in Tirana with competitive rates.`,
          specifications: {
            engine: data.engine || 'Standard Engine',
            seats: `${data.seats} Seats`,
            luggage: `${data.luggage} Luggage`,
            transmission: data.transmission?.charAt(0).toUpperCase() + data.transmission?.slice(1) || 'Automatic',
            fuelType: data.fuel_type?.charAt(0).toUpperCase() + data.fuel_type?.slice(1) || 'Petrol',
            status: data.status?.charAt(0).toUpperCase() + data.status?.slice(1) || 'Available'
          }
        };

        setCarData(car);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId]);

  const localBenefits = [
    { icon: Shield, title: 'Fully Insured', description: 'Comprehensive coverage for peace of mind' },
    { icon: Clock, title: '24/7 Support', description: 'Round-the-clock assistance in Tirana' },
    { icon: Zap, title: 'Quick Booking', description: 'Reserve your car in minutes' },
    { icon: Heart, title: 'Best Rates', description: 'Competitive pricing guaranteed' }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !carData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Car Not Found</h1>
          <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/cars">Back to Cars</Link>
          </Button>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": `${carData.brand} ${carData.model} - Car Rental in Tirana, Albania`,
    "description": `${carData.description} Available for rent in Tirana, Albania.`,
    "brand": {
      "@type": "Brand",
      "name": carData.brand
    },
    "model": carData.model,
    "vehicleModelDate": carData.year.toString(),
    "vehicleSeatingCapacity": carData.seats,
    "fuelType": carData.fuel,
    "vehicleTransmission": carData.transmission,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": carData.rating.toString(),
      "reviewCount": carData.reviews.toString()
    },
    "offers": {
      "@type": "Offer",
      "price": carData.price,
      "priceCurrency": "EUR",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": carData.price,
        "priceCurrency": "EUR",
        "unitText": "per day"
      },
      "availability": carData.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
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
      }
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
      <Seo
        title={`${carData.brand} ${carData.model} ${t('carDetailHeaderSuffix')} - ${carData.year}`}
        description={`Rent a ${carData.brand} ${carData.model} in Tirana, Albania. ${carData.description} Book now for €${carData.price}/day. Best car rental service in Tirana with competitive rates.`}
        path={`/cars/${carId}`}
        image={carData.images[0]}
        keywords={`${carData.brand} ${carData.model} rental Tirana, ${carData.brand} ${carData.model} car rental Albania, ${carData.brand} ${carData.model} hire Tirana, car rental ${carData.brand} ${carData.model} Albania, Tirana ${carData.brand} ${carData.model} rental, Albania car rental ${carData.brand} ${carData.model}, luxury car rental Tirana, ${carData.category} car rental Albania`}
        schema={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Removed top hero header section */}
        <div className="container-mobile py-6 sm:py-8">
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <Button asChild variant="ghost" className="flex items-center space-x-2 min-h-[44px]">
              <Link to="/cars">
                <ArrowLeft className="h-4 w-4" />
                <span>{t('backToCars')}</span>
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Images */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:sticky lg:top-8 self-start"
            >
              <Card className="overflow-hidden shadow-xl border-0">
                <div className="relative">
                  <img 
                    src={carData.images[selectedImage]} 
                    alt={`${carData.brand} ${carData.model} car rental in Tirana, Albania - Image ${selectedImage + 1}`}
                    className="w-full aspect-photo object-cover"
                    onError={(e) => {
                      e.target.src = "/images/cars/placeholder-car.jpg";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-white">
                      {carData.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{carData.rating}</span>
                    <span className="text-sm text-gray-600">({carData.reviews})</span>
                  </div>
                </div>
                
                {/* Thumbnail Navigation */}
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {carData.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-yellow-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${carData.brand} ${carData.model} car rental Tirana thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/images/cars/placeholder-car.jpg";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Additional Information (desktop-only, to balance column heights) */}
              <div className="hidden lg:block mt-8">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Car className="h-6 w-6 text-yellow-600" />
                      <span>{t('whyChooseMema')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {localBenefits.map((benefit, index) => (
                        <div key={index} className="text-center">
                          <div className="inline-block p-3 bg-yellow-100 rounded-full mb-2">
                            <benefit.icon className="h-6 w-6 text-yellow-600" />
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-1 text-sm">{benefit.title}</h4>
                          <p className="text-gray-600 text-xs">
                            {benefit.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Car Details */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Header */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
                  {carData.brand} {carData.model} {t('carDetailHeaderSuffix')}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {carData.year} • {carData.location}, Albania
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl sm:text-4xl font-bold text-yellow-600">
                    €{carData.price}/{t('perDay')}
                  </div>
                  <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Link to={`/booking/${carData.id}`}>
                      {t('bookThisCar')}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">{carData.seats} Seats</span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Fuel className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">{carData.fuel}</span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">{carData.transmission}</span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Zap className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">{carData.luggage} Luggage</span>
                </div>
              </div>
              
              {/* Engine Information */}
              {carData.engine && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-800">Engine</h4>
                  </div>
                  <p className="text-gray-700">{carData.engine}</p>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('description')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {carData.description} Perfect for exploring Albania with comfort and style. Available for rent in Tirana city center and airport pickup.
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('features')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {carData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('specifications')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(carData.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location & Pickup Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">{t('pickupLocation')}</h4>
                  </div>
                  <p className="text-gray-600">Tirana City Center</p>
                  <p className="text-sm text-gray-500">Rruga e Durresit 123, Tirana, Albania</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-gray-800">{t('pickupTimeLabel')}</h4>
                  </div>
                  <p className="text-gray-600">{carData.pickupTime}</p>
                  <p className="text-sm text-gray-500">{t('flexibleScheduling')}</p>
                </div>
              </div>

              {/* Contact Button */}
              <div className="flex">
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link to="/contact">
                    {t('contactUs')}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Additional Information (mobile/tablet only) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 lg:hidden"
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="h-6 w-6 text-yellow-600" />
                  <span>{t('whyChooseMema')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {localBenefits.map((benefit, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-block p-3 bg-yellow-100 rounded-full mb-3">
                        <benefit.icon className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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

export default CarDetailPage;
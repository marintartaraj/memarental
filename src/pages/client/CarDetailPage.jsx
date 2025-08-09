
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
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
  Award
} from 'lucide-react';

const CarDetailPage = () => {
  const { carId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock car data
  const carData = {
    id: carId,
    brand: 'BMW',
    model: '3 Series',
    year: 2023,
    price: 65,
    rating: 4.8,
    reviews: 127,
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Automatic',
    category: 'Luxury',
    mileage: 'Unlimited',
    location: 'Tirana',
    pickupTime: '24/7',
    features: [
      'Bluetooth Connectivity',
      'GPS Navigation',
      'Backup Camera',
      'Heated Seats',
      'Automatic Climate Control',
      'USB Charging Ports',
      'Cruise Control',
      'Parking Sensors'
    ],
    images: [
      'https://images.unsplash.com/photo-1612935459247-3f90353c6c50',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6'
    ],
    description: 'Experience luxury and performance with our BMW 3 Series. This premium sedan offers the perfect blend of comfort, style, and driving dynamics. Perfect for business travel or exploring Albania in style.',
    specifications: {
      engine: '2.0L Turbo',
      power: '184 HP',
      acceleration: '7.1s (0-100 km/h)',
      topSpeed: '235 km/h',
      fuelConsumption: '6.2L/100km',
      trunkCapacity: '480L'
    }
  };

  const localBenefits = [
    { icon: Shield, title: 'Fully Insured', description: 'Comprehensive coverage for peace of mind' },
    { icon: Clock, title: '24/7 Support', description: 'Round-the-clock assistance in Tirana' },
    { icon: Zap, title: 'Quick Booking', description: 'Reserve your car in minutes' },
    { icon: Heart, title: 'Best Rates', description: 'Competitive pricing guaranteed' }
  ];

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
      "availability": "https://schema.org/InStock",
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
      <Helmet>
        <title>{carData.brand} {carData.model} Car Rental in Tirana, Albania - {carData.year} | MEMA Rental</title>
        <meta name="title" content={`${carData.brand} ${carData.model} Car Rental in Tirana, Albania - ${carData.year} | MEMA Rental`} />
        <meta name="description" content={`Rent a ${carData.brand} ${carData.model} in Tirana, Albania. ${carData.description} Book now for €${carData.price}/day. Best car rental service in Tirana with competitive rates.`} />
        <meta name="keywords" content={`${carData.brand} ${carData.model} rental Tirana, ${carData.brand} ${carData.model} car rental Albania, ${carData.brand} ${carData.model} hire Tirana, car rental ${carData.brand} ${carData.model} Albania, Tirana ${carData.brand} ${carData.model} rental, Albania car rental ${carData.brand} ${carData.model}, luxury car rental Tirana, ${carData.category} car rental Albania`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="MEMA Rental" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://memarental.com/cars/${carId}`} />
        <meta property="og:title" content={`${carData.brand} ${carData.model} Car Rental in Tirana, Albania - ${carData.year} | MEMA Rental`} />
        <meta property="og:description" content={`Rent a ${carData.brand} ${carData.model} in Tirana, Albania. ${carData.description} Book now for €${carData.price}/day.`} />
        <meta property="og:image" content={carData.images[0]} />
        <meta property="og:site_name" content="MEMA Rental" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://memarental.com/cars/${carId}`} />
        <meta property="twitter:title" content={`${carData.brand} ${carData.model} Car Rental in Tirana, Albania - ${carData.year} | MEMA Rental`} />
        <meta property="twitter:description" content={`Rent a ${carData.brand} ${carData.model} in Tirana, Albania. ${carData.description} Book now for €${carData.price}/day.`} />
        <meta property="twitter:image" content={carData.images[0]} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="AL" />
        <meta name="geo.placename" content="Tirana" />
        <meta name="geo.position" content="41.3275;19.8187" />
        <meta name="ICBM" content="41.3275, 19.8187" />
        <meta name="DC.title" content={`${carData.brand} ${carData.model} Car Rental in Tirana, Albania - ${carData.year} | MEMA Rental`} />
        <meta name="DC.description" content={`Rent a ${carData.brand} ${carData.model} in Tirana, Albania.`} />
        <meta name="DC.subject" content="Car Rental, Tirana, Albania, ${carData.brand}, ${carData.model}" />
        <meta name="DC.creator" content="MEMA Rental" />
        <meta name="DC.publisher" content="MEMA Rental" />
        <meta name="DC.coverage" content="Tirana, Albania" />
        <meta name="DC.language" content="en" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://memarental.com/cars/${carId}`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <Button asChild variant="ghost" className="flex items-center space-x-2">
              <Link to="/cars">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Cars</span>
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Images */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="overflow-hidden shadow-xl border-0">
                <div className="relative">
                  <img 
                    src={carData.images[selectedImage]} 
                    alt={`${carData.brand} ${carData.model} car rental in Tirana, Albania - Image ${selectedImage + 1}`}
                    className="w-full h-80 sm:h-96 object-cover"
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
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Car Details */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
                  {carData.brand} {carData.model} - Car Rental in Tirana
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {carData.year} • {carData.location}, Albania
                </p>
                <div className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-4">
                  €{carData.price}/day
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
                  <Shield className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Insured</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {carData.description} Perfect for exploring Albania with comfort and style. Available for rent in Tirana city center and airport pickup.
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Features</h3>
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
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Specifications</h3>
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
                    <h4 className="font-semibold text-gray-800">Pickup Location</h4>
                  </div>
                  <p className="text-gray-600">Tirana City Center</p>
                  <p className="text-sm text-gray-500">Rruga e Durresit 123, Tirana, Albania</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-gray-800">Pickup Time</h4>
                  </div>
                  <p className="text-gray-600">{carData.pickupTime}</p>
                  <p className="text-sm text-gray-500">Flexible scheduling</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white">
                  <Link to={`/booking/${carData.id}`}>
                    Book This Car
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Additional Information */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="h-6 w-6 text-yellow-600" />
                  <span>Why Choose MEMA Rental for Car Rental in Tirana?</span>
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

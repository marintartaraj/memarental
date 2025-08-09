
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car, 
  Star, 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  Users, 
  Award,
  Zap,
  Heart,
  Globe,
  TrendingUp,
  Navigation,
  CreditCard,
  Wifi
} from 'lucide-react';

const HomePage = () => {
  // Mock data
  const destinations = [
    { name: 'Tirana City Center', emoji: '🏙️', description: 'Explore the capital of Albania' },
    { name: 'Durres Beach', emoji: '🏖️', description: 'Coastal adventures in Albania' },
    { name: 'Albanian Alps', emoji: '⛰️', description: 'Mountain escapes in Albania' },
    { name: 'Historical Sites', emoji: '🏛️', description: 'Cultural heritage of Albania' }
  ];

  const benefits = [
    { icon: Shield, title: 'Fully Insured', description: 'Comprehensive coverage for peace of mind' },
    { icon: Clock, title: '24/7 Support', description: 'Round-the-clock assistance in Tirana' },
    { icon: Zap, title: 'Quick Booking', description: 'Reserve your car in minutes' },
    { icon: Heart, title: 'Best Rates', description: 'Competitive pricing guaranteed' },
    { icon: Navigation, title: 'Free GPS', description: 'Navigation included with every rental' },
    { icon: CreditCard, title: 'Flexible Payment', description: 'Multiple payment options accepted' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "name": "MEMA Rental - Car Rental Tirana Albania",
    "alternateName": "MEMA Car Rental",
    "description": "Premium car rental service in Tirana, Albania. Rent cars, SUVs, and luxury vehicles for your Albanian adventure. Best car rental in Tirana with competitive rates.",
    "url": "https://memarental.com",
    "telephone": "+355-4-123-4567",
    "email": "info@memarental.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rruga e Durresit 123",
      "addressLocality": "Tirana",
      "addressRegion": "Tirana",
      "postalCode": "1001",
      "addressCountry": "AL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.3275",
      "longitude": "19.8187"
    },
    "openingHours": [
      "Mo-Su 08:00-20:00"
    ],
    "priceRange": "€€",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Albania"
    },
    "serviceArea": {
      "@type": "Place",
      "name": "Tirana, Albania"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Car Rental Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Economy Car Rental Tirana"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "SUV Rental Albania"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Luxury Car Rental Tirana"
          }
        }
      ]
    },
    "sameAs": [
      "https://facebook.com/memarental",
      "https://instagram.com/memarental"
    ]
  };

  return (
    <>
      <Helmet>
        <title>Car Rental Tirana Albania | Best Car Hire Service in Tirana | MEMA Rental</title>
        <meta name="title" content="Car Rental Tirana Albania | Best Car Hire Service in Tirana | MEMA Rental" />
        <meta name="description" content="Best car rental in Tirana, Albania. Rent cars, SUVs, and luxury vehicles from €25/day. Free pickup, 24/7 support, and competitive rates. Book your car rental in Albania today! Located in Tirana city center." />
        <meta name="keywords" content="car rental Tirana, car rental Albania, rent car Tirana, car hire Albania, Tirana car rental, Albania car rental, luxury car rental Tirana, economy car rental Albania, SUV rental Tirana, car rental service Albania, Tirana airport car rental, Albania car hire service, car rental Tirana city center, best car rental Tirana, cheap car rental Albania, car rental near me Tirana" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="MEMA Rental" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://memarental.com" />
        <meta property="og:title" content="Car Rental Tirana Albania | Best Car Hire Service in Tirana | MEMA Rental" />
        <meta property="og:description" content="Best car rental in Tirana, Albania. Rent cars, SUVs, and luxury vehicles from €25/day. Free pickup, 24/7 support, and competitive rates." />
        <meta property="og:image" content="https://memarental.com/hero-image.jpg" />
        <meta property="og:site_name" content="MEMA Rental" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://memarental.com" />
        <meta property="twitter:title" content="Car Rental Tirana Albania | Best Car Hire Service in Tirana | MEMA Rental" />
        <meta property="twitter:description" content="Best car rental in Tirana, Albania. Rent cars, SUVs, and luxury vehicles from €25/day. Free pickup, 24/7 support, and competitive rates." />
        <meta property="twitter:image" content="https://memarental.com/hero-image.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="AL" />
        <meta name="geo.placename" content="Tirana" />
        <meta name="geo.position" content="41.3275;19.8187" />
        <meta name="ICBM" content="41.3275, 19.8187" />
        <meta name="DC.title" content="Car Rental Tirana Albania | MEMA Rental" />
        <meta name="DC.description" content="Best car rental in Tirana, Albania. Rent cars, SUVs, and luxury vehicles from €25/day." />
        <meta name="DC.subject" content="Car Rental, Tirana, Albania" />
        <meta name="DC.creator" content="MEMA Rental" />
        <meta name="DC.publisher" content="MEMA Rental" />
        <meta name="DC.coverage" content="Tirana, Albania" />
        <meta name="DC.language" content="en" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://memarental.com" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold text-white mb-6 sm:mb-8"
              >
                Car Rental in Tirana, Albania
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed"
              >
                Discover Albania with the best car rental service in Tirana. 
                From economy to luxury vehicles, we provide reliable transportation for your Albanian adventure. 
                Located in the heart of Tirana city center.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button asChild size="lg" className="bg-white text-yellow-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/cars">
                    Browse Our Fleet
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-yellow-600 text-lg px-8 py-4">
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Why Choose MEMA Rental for Car Rental in Tirana?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                We provide the best car rental experience in Tirana, Albania with competitive rates, 
                reliable vehicles, and exceptional customer service. Your trusted car rental partner in Albania.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="text-center">
                      <div className="inline-block p-3 bg-yellow-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                        <benefit.icon className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Popular Destinations Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Popular Destinations in Albania
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Explore the best of Albania with our reliable car rental service from Tirana
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {destinations.map((destination, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="text-center">
                      <div className="text-4xl mb-4">{destination.emoji}</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{destination.name}</h3>
                      <p className="text-gray-600">{destination.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

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
      </div>
    </>
  );
};

export default HomePage;

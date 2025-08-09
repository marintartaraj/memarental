import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Award, 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  Heart,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle,
  Car
} from 'lucide-react';

const AboutPage = () => {
  // Mock data
  const stats = [
    { icon: Car, label: 'Vehicles', value: '50+', color: 'blue' },
    { icon: Users, label: 'Happy Customers', value: '1000+', color: 'green' },
    { icon: Star, label: 'Rating', value: '4.9', color: 'yellow' },
    { icon: Award, label: 'Years', value: '10+', color: 'purple' }
  ];

  const localBenefits = [
    { icon: Shield, title: 'Fully Insured', description: 'Comprehensive coverage for peace of mind' },
    { icon: Clock, title: '24/7 Support', description: 'Round-the-clock assistance in Tirana' },
    { icon: Zap, title: 'Quick Booking', description: 'Reserve your car in minutes' },
    { icon: Heart, title: 'Best Rates', description: 'Competitive pricing guaranteed' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MEMA Rental - Car Rental Tirana Albania",
    "alternateName": "MEMA Car Rental",
    "description": "Premium car rental service in Tirana, Albania. Providing reliable transportation solutions since 2014. Best car rental in Tirana with competitive rates.",
    "url": "https://memarental.com",
    "logo": "https://memarental.com/logo.jpg",
    "foundingDate": "2014",
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
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+355-4-123-4567",
      "contactType": "customer service",
      "email": "info@memarental.com",
      "availableLanguage": "English, Albanian"
    },
    "openingHours": [
      "Mo-Su 08:00-20:00"
    ],
    "priceRange": "€€",
    "areaServed": {
      "@type": "Country",
      "name": "Albania"
    },
    "serviceArea": {
      "@type": "Place",
      "name": "Tirana, Albania"
    },
    "sameAs": [
      "https://facebook.com/memarental",
      "https://instagram.com/memarental"
    ]
  };

  return (
    <>
      <Helmet>
        <title>About MEMA Rental - Car Rental Service in Tirana, Albania | Best Car Hire</title>
        <meta name="title" content="About MEMA Rental - Car Rental Service in Tirana, Albania | Best Car Hire" />
        <meta name="description" content="Learn about MEMA Rental, the leading car rental service in Tirana, Albania. Our story and commitment to providing the best car rental experience in Albania since 2014." />
        <meta name="keywords" content="about MEMA Rental, car rental company Tirana, car rental service Albania, MEMA Rental story, car rental history Albania, best car rental Tirana, car rental company Albania, Tirana car rental service, Albania car hire company" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="MEMA Rental" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://memarental.com/about" />
        <meta property="og:title" content="About MEMA Rental - Car Rental Service in Tirana, Albania | Best Car Hire" />
        <meta property="og:description" content="Learn about MEMA Rental, the leading car rental service in Tirana, Albania. Our story and commitment to providing the best car rental experience." />
        <meta property="og:image" content="https://memarental.com/about-image.jpg" />
        <meta property="og:site_name" content="MEMA Rental" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://memarental.com/about" />
        <meta property="twitter:title" content="About MEMA Rental - Car Rental Service in Tirana, Albania | Best Car Hire" />
        <meta property="twitter:description" content="Learn about MEMA Rental, the leading car rental service in Tirana, Albania. Our story and commitment to providing the best car rental experience." />
        <meta property="twitter:image" content="https://memarental.com/about-image.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="AL" />
        <meta name="geo.placename" content="Tirana" />
        <meta name="geo.position" content="41.3275;19.8187" />
        <meta name="ICBM" content="41.3275, 19.8187" />
        <meta name="DC.title" content="About MEMA Rental - Car Rental Service in Tirana, Albania" />
        <meta name="DC.description" content="Learn about MEMA Rental, the leading car rental service in Tirana, Albania." />
        <meta name="DC.subject" content="Car Rental, Tirana, Albania, About" />
        <meta name="DC.creator" content="MEMA Rental" />
        <meta name="DC.publisher" content="MEMA Rental" />
        <meta name="DC.coverage" content="Tirana, Albania" />
        <meta name="DC.language" content="en" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://memarental.com/about" />
        
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
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8"
              >
                About MEMA Rental - Car Rental in Tirana, Albania
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed"
              >
                Your trusted partner for car rental in Tirana, Albania since 2014. 
                We provide reliable, affordable, and convenient car rental services to help you explore the beauty of Albania.
                Located in the heart of Tirana city center.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="text-center">
                      <div className={`inline-block p-3 bg-${stat.color}-100 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                  Our Story - Car Rental in Tirana
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Founded in 2014, MEMA Rental began with a simple mission: to provide reliable and affordable car rental services in Tirana, Albania. What started as a small family business has grown into one of the most trusted car rental companies in the region.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  We understand that exploring Albania requires more than just a vehicle - it requires a partner you can trust. That's why we've built our business on the principles of reliability, transparency, and exceptional customer service. Our commitment to providing the best car rental experience in Tirana has made us a preferred choice for both locals and tourists.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, we're proud to serve thousands of customers each year, helping them discover the beauty of Albania with our modern fleet of vehicles and dedicated support team. Our location in Tirana city center makes us easily accessible for all your car rental needs in Albania.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43" 
                  alt="MEMA Rental office and team in Tirana, Albania - car rental service"
                  className="rounded-2xl shadow-xl w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose MEMA Rental Section */}
        <section className="py-12 sm:py-16 lg:py-20">
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {localBenefits.map((benefit, index) => (
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

        {/* Contact Information Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Contact Information - Car Rental Tirana
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Get in touch with us for any questions about car rental in Tirana, Albania. 
                We're located in the heart of Tirana city center for your convenience.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <div className="text-center">
                    <div className="inline-block p-3 bg-blue-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Location</h3>
                    <p className="text-gray-600">Rruga e Durresit 123, Tirana, Albania</p>
                    <p className="text-sm text-gray-500 mt-2">City Center Location</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <div className="text-center">
                    <div className="inline-block p-3 bg-green-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
                    <p className="text-gray-600">+355 4 123 4567</p>
                    <p className="text-sm text-gray-500 mt-2">24/7 Support Available</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <div className="text-center">
                    <div className="inline-block p-3 bg-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
                    <p className="text-gray-600">info@memarental.com</p>
                    <p className="text-sm text-gray-500 mt-2">Quick Response Guaranteed</p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Simple Contact Text */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="text-lg sm:text-xl text-gray-600">
                Want to get in touch? <Link to="/contact" className="text-yellow-600 underline font-semibold">Contact us here</Link>
              </p>
            </motion.div>
          </div>
        </section>
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

export default AboutPage;
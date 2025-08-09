import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle,
  MessageSquare,
  Car,
  Shield,
  Zap,
  Navigation,
  Heart,
  Award,
  Users,
  Building2
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'Rruga e Durresit 123, Tirana, Albania',
      subtitle: 'City Center Location',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+355 4 123 4567',
      subtitle: '24/7 Support Available',
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'info@memarental.com',
      subtitle: 'Quick Response Guaranteed',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon-Sun: 8:00 AM - 8:00 PM',
      subtitle: 'Extended hours available',
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 2000);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact MEMA Rental - Car Rental Service in Tirana, Albania",
    "description": "Get in touch with MEMA Rental for car rental services in Tirana, Albania. Contact us for bookings, support, or inquiries about car rental in Tirana.",
    "url": "https://memarental.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "MEMA Rental - Car Rental Tirana Albania",
      "alternateName": "MEMA Car Rental",
      "description": "Premium car rental service in Tirana, Albania. Providing reliable transportation solutions since 2014.",
      "url": "https://memarental.com",
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
      "telephone": "+355-4-123-4567",
      "email": "info@memarental.com",
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
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact MEMA Rental - Car Rental Service in Tirana, Albania | Get in Touch</title>
        <meta name="title" content="Contact MEMA Rental - Car Rental Service in Tirana, Albania | Get in Touch" />
        <meta name="description" content="Contact MEMA Rental for car rental services in Tirana, Albania. Get in touch for bookings, support, or inquiries about car rental in Tirana. Located in Tirana city center." />
        <meta name="keywords" content="contact MEMA Rental, car rental contact Tirana, car rental support Albania, MEMA Rental phone, car rental email Tirana, contact car rental Tirana, car rental contact Albania, Tirana car rental contact, Albania car hire contact, car rental phone Tirana, car rental email Albania" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="MEMA Rental" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://memarental.com/contact" />
        <meta property="og:title" content="Contact MEMA Rental - Car Rental Service in Tirana, Albania | Get in Touch" />
        <meta property="og:description" content="Contact MEMA Rental for car rental services in Tirana, Albania. Get in touch for bookings, support, or inquiries about car rental in Tirana." />
        <meta property="og:image" content="https://memarental.com/contact-image.jpg" />
        <meta property="og:site_name" content="MEMA Rental" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://memarental.com/contact" />
        <meta property="twitter:title" content="Contact MEMA Rental - Car Rental Service in Tirana, Albania | Get in Touch" />
        <meta property="twitter:description" content="Contact MEMA Rental for car rental services in Tirana, Albania. Get in touch for bookings, support, or inquiries about car rental in Tirana." />
        <meta property="twitter:image" content="https://memarental.com/contact-image.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="AL" />
        <meta name="geo.placename" content="Tirana" />
        <meta name="geo.position" content="41.3275;19.8187" />
        <meta name="ICBM" content="41.3275, 19.8187" />
        <meta name="DC.title" content="Contact MEMA Rental - Car Rental Service in Tirana, Albania" />
        <meta name="DC.description" content="Contact MEMA Rental for car rental services in Tirana, Albania." />
        <meta name="DC.subject" content="Contact, Car Rental, Tirana, Albania" />
        <meta name="DC.creator" content="MEMA Rental" />
        <meta name="DC.publisher" content="MEMA Rental" />
        <meta name="DC.coverage" content="Tirana, Albania" />
        <meta name="DC.language" content="en" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://memarental.com/contact" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center p-2 bg-yellow-100 rounded-full mb-6">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Ready to explore Albania? Contact us for the best car rental experience in Tirana. 
              We're here to help you with your transportation needs.
            </p>
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <Card className="border-green-200 bg-green-50 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">Message Sent Successfully!</h3>
                        <p className="text-green-700">We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information Cards */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="xl:col-span-1"
            >
              <div className="space-y-6">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <Building2 className="h-7 w-7 text-yellow-600" />
                      <span>Contact Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {contactInfo.map((info, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{ y: -3, scale: 1.02 }}
                          className={`group p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 ${info.bgColor} hover:shadow-md`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-full ${info.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                              <info.icon className={`h-6 w-6 ${info.iconColor}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 text-lg mb-1">{info.title}</h3>
                              <p className="text-gray-700 font-medium">{info.content}</p>
                              <p className="text-sm text-gray-500 mt-1">{info.subtitle}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="xl:col-span-2"
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <Send className="h-8 w-8 text-yellow-600" />
                    <span>Send us a Message</span>
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-700 font-medium">Subject *</Label>
                        <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="booking">Car Rental Booking</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="inquiry">General Inquiry</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 font-medium">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us how we can help you with car rental in Tirana, Albania..."
                        className="border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 resize-none"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Sending Message...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <Send className="h-5 w-5" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Map and Additional Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Map Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <MapPin className="h-7 w-7 text-blue-600" />
                    <span>Find Us - Car Rental Tirana</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border-2 border-blue-200">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-blue-700 font-medium text-lg">Interactive map coming soon</p>
                      <p className="text-blue-600 font-semibold mt-3 text-lg">
                        Rruga e Durresit 123, Tirana, Albania
                      </p>
                      <p className="text-blue-500 text-sm mt-1">City Center Location</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Requirements Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <CheckCircle className="h-7 w-7 text-green-600" />
                    <span>Car Rental Requirements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h3 className="font-semibold text-gray-800 mb-3 text-lg">Requirements in Tirana</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Valid driver's license (minimum 1 year)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Passport or ID card</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Credit card for deposit</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Minimum age: 21 years</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>International driving permit recommended</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
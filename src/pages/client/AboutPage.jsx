import React from 'react';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import HeroHeader from '@/components/HeroHeader';
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
  const { t } = useLanguage();
  // Mock data
  const stats = [
    { icon: Car, label: t('statsVehicles'), value: '50+', color: 'blue' },
    { icon: Users, label: t('statsHappyCustomers'), value: '1000+', color: 'green' },
    { icon: Star, label: t('statsRating'), value: '4.9', color: 'yellow' },
    { icon: Award, label: t('statsYears'), value: '10+', color: 'purple' }
  ];

  const localBenefits = [
    { icon: Shield, title: t('fullyInsured'), description: t('benefitFullyInsuredDesc') },
    { icon: Clock, title: t('support247'), description: t('support247Desc') },
    { icon: Zap, title: t('benefitQuickBookingTitle'), description: t('benefitQuickBookingDesc') },
    { icon: Heart, title: t('benefitBestRatesTitle'), description: t('benefitBestRatesDesc') }
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
      <Seo
        title={t('seoAboutTitle')}
        description={t('seoAboutDescription')}
        path="/about"
        image="https://memarental.com/about-image.jpg"
        keywords="about MEMA Rental, car rental company Tirana, car rental service Albania, MEMA Rental story, car rental history Albania, best car rental Tirana, car rental company Albania, Tirana car rental service, Albania car hire company"
        schema={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <HeroHeader
          title={t('aboutHeroTitle')}
          subtitle={t('aboutHeroSubtitle')}
        />

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
                  {t('aboutStoryTitle')}
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {t('aboutStoryP1')}
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {t('aboutStoryP2')}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('aboutStoryP3')}
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
                {t('aboutWhyTitle')}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                {t('aboutWhyCopy')}
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
                {t('contactInfoTitle')}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                {t('contactInfoCopy')}
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
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('contactLocation')}</h3>
                    <p className="text-gray-600">Rruga e Durresit 123, Tirana, Albania</p>
                    <p className="text-sm text-gray-500 mt-2">{t('contactCityCenter')}</p>
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
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('contactPhone')}</h3>
                    <p className="text-gray-600">+355 4 123 4567</p>
                    <p className="text-sm text-gray-500 mt-2">{t('contactSupport')}</p>
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
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('contactEmail')}</h3>
                    <p className="text-gray-600">info@memarental.com</p>
                    <p className="text-sm text-gray-500 mt-2">{t('contactQuickResponse')}</p>
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
                {t('wantToGetInTouch')} <Link to="/contact" className="text-yellow-600 underline font-semibold">{t('contactUsHere')}</Link>
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
              {t('homeCtaTitle')}
            </h2>
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
                <Link to="/cars">{t('bookNow')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-yellow-600 text-lg px-8 py-4">
                <Link to="/contact">{t('getInTouch')}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
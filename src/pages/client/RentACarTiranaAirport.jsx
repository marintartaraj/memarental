"use client"

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, Zap, Heart, Navigation, CreditCard, Phone, Mail, MapPin, Calendar, CheckCircle, ArrowRight, Play, Sparkles, Star, Users, Award, Plane, Car, Globe } from "lucide-react"
import { useLanguage } from '../../contexts/LanguageContext';
import Seo from '../../components/Seo';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../../seo/structuredData';
import localSeo from '../../seo/local_seo.json';

const RentACarTiranaAirport = () => {
  const { t, language } = useLanguage();
  const prefersReducedMotion = useReducedMotion()

  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" },
    viewport: { once: true, amount: 0.3 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Rent a Car at Tirana Airport', url: '/rent-a-car-tirana-airport' }
  ];

  const airportServices = [
    {
      title: language === 'sq' ? 'Marrje në Aeroport' : 'Airport Pickup',
      description: language === 'sq' 
        ? 'Marrje falas direkt nga Aeroporti Ndërkombëtar i Tiranës (TIA/Rinas)'
        : 'Free pickup directly from Tirana International Airport (TIA/Rinas)',
      icon: Plane,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: language === 'sq' ? 'Dorëzim në Aeroport' : 'Airport Drop-off',
      description: language === 'sq'
        ? 'Dorëzimi i makinës në aeroport për udhëtimet tuaja të kthimit'
        : 'Car drop-off at the airport for your return journeys',
      icon: Car,
      color: "from-green-500 to-green-600"
    },
    {
      title: language === 'sq' ? 'Rezervim Online' : 'Online Booking',
      description: language === 'sq'
        ? 'Rezervoni makinën tuaj online dhe gati për marrje në aeroport'
        : 'Book your car online and ready for pickup at the airport',
      icon: Globe,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: language === 'sq' ? 'Sigurim i Plotë' : 'Full Insurance',
      description: language === 'sq'
        ? 'Sigurim gjithëpërfshirës për të gjitha qerat në aeroport'
        : 'Comprehensive insurance for all airport rentals',
      icon: Shield,
      color: "from-red-500 to-red-600"
    }
  ];

  const airportInfo = {
    name: 'Tirana International Airport (TIA)',
    code: 'TIA',
    location: 'Rinas, Albania',
    distance: '17 km from Tirana city center',
    coordinates: '41.4147° N, 19.7206° E'
  };

  const howItWorks = [
    {
      step: 1,
      title: language === 'sq' ? 'Rezervoni Online' : 'Book Online',
      description: language === 'sq' 
        ? 'Zgjidhni makinën dhe datat tuaja të qerasë në faqen tonë të internetit.'
        : 'Choose your car and rental dates on our website.',
      icon: Globe
    },
    {
      step: 2,
      title: language === 'sq' ? 'Marrja në Aeroport' : 'Airport Pickup',
      description: language === 'sq' 
        ? 'Ekipi ynë do t\'ju takojë në aeroport me makinën tuaj të gatshme.'
        : 'Our team will meet you at the airport with your car ready.',
      icon: Plane
    },
    {
      step: 3,
      title: language === 'sq' ? 'Udhëtoni' : 'Travel',
      description: language === 'sq' 
        ? 'Shijoni udhëtimin tuaj në Shqipëri me makinën tuaj të sigurt dhe të rehatshme.'
        : 'Enjoy your journey in Albania with your safe and comfortable car.',
      icon: Car
    }
  ];

  const faqs = [
    {
      question: "How far is Tirana Airport from the city center?",
      answer: "Tirana International Airport (TIA) is located 17 km from Tirana city center. The drive takes approximately 20-30 minutes depending on traffic."
    },
    {
      question: "Do you offer 24/7 airport pickup service?",
      answer: "Yes, we provide 24/7 airport pickup service. Our team will meet you at the airport regardless of your arrival time."
    },
    {
      question: "How long does it take to process the rental at the airport?",
      answer: "Our airport pickup process is streamlined and typically takes 15-20 minutes. We'll have your car ready and waiting."
    },
    {
      question: "Can I return the car at the airport?",
      answer: "Yes, you can return the car at Tirana Airport. We offer flexible drop-off locations including the airport for your convenience."
    },
    {
      question: "What documents do I need for airport pickup?",
      answer: "You'll need your driver's license, passport or ID, and the credit card used for booking. We'll handle the rest at the airport."
    }
  ];

  const faqsSq = [
    {
      question: "Sa larg është Aeroporti i Tiranës nga qendra e qytetit?",
      answer: "Aeroporti Ndërkombëtar i Tiranës (TIA) ndodhet 17 km nga qendra e Tiranës. Udhëtimi me makinë zgjat afërsisht 20-30 minuta në varësi të trafikut."
    },
    {
      question: "A ofroni shërbim marrjeje në aeroport 24/7?",
      answer: "Po, ofrojmë shërbim marrjeje në aeroport 24/7. Ekipi ynë do t'ju takojë në aeroport pavarësisht orarit të mbërritjes suaj."
    },
    {
      question: "Sa kohë duhet për të përpunuar qeranë në aeroport?",
      answer: "Procesi ynë i marrjes në aeroport është i optimizuar dhe zakonisht zgjat 15-20 minuta. Do të kemi makinën tuaj të gatshme dhe duke pritur."
    },
    {
      question: "A mund ta kthej makinën në aeroport?",
      answer: "Po, mund ta ktheni makinën në Aeroportin e Tiranës. Ofrojmë vendndodhje fleksibël dorëzimi duke përfshirë aeroportin për komoditetin tuaj."
    },
    {
      question: "Çfarë dokumentesh më nevojiten për marrjen në aeroport?",
      answer: "Do t'ju nevojiten leja juaj e drejtimit, pasaporta ose ID-ja, dhe karta e kredisë e përdorur për rezervimin. Do të trajtojmë pjesën tjetër në aeroport."
    }
  ];

  const currentFaqs = language === 'sq' ? faqsSq : faqs;

  const handleContactClick = (type) => {
    if (type === 'phone') {
      window.open('tel:+355-4-123-4567', '_self')
    } else if (type === 'email') {
      window.open('mailto:info@memarental.com', '_self')
    }
  }

  return (
    <>
      <Seo
        title={language === 'sq' 
          ? 'Qera Makinash në Aeroportin e Tiranës - Marrje në Aeroport TIA/Rinas'
          : 'Rent a Car at Tirana Airport - Airport Pickup TIA/Rinas'
        }
        description={language === 'sq' 
          ? 'Qera makinash në Aeroportin Ndërkombëtar të Tiranës (TIA/Rinas). Marrje falas në aeroport, sigurim i plotë dhe mbështetje 24/7. Rezervoni sot!'
          : 'Car rental at Tirana International Airport (TIA/Rinas). Free airport pickup, comprehensive insurance, and 24/7 support. Book your airport car rental today!'
        }
        path="/rent-a-car-tirana-airport"
        schema={[
          generateLocalBusinessSchema(),
          generateBreadcrumbSchema(breadcrumbs)
        ]}
        language={language}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Global light effects */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Ambient light rays */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/15 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-100/10 to-transparent rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              
              {/* Light rays effect */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-yellow-300/30 via-yellow-200/20 to-transparent animate-pulse"></div>
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-orange-300/20 via-orange-200/15 to-transparent animate-pulse animation-delay-1000"></div>
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-yellow-300/25 via-yellow-200/15 to-transparent animate-pulse animation-delay-2000"></div>
              </div>
            </div>

            <div className="container-mobile py-16 sm:py-20 lg:py-28 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-yellow-200 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/50 to-orange-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plane className="h-4 w-4 relative z-10 animate-pulse" />
                <span className="relative z-10">TIA Airport • Free Pickup</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.div>

              <motion.h1
                {...fadeUp}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground text-balance leading-tight relative mb-6"
              >
                <span className="relative">
                  {language === 'sq' 
                    ? 'Qera Makinash në Aeroportin e Tiranës'
                    : 'Rent a Car at Tirana Airport'
                  }
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed mb-8"
              >
                {language === 'sq' 
                  ? 'Marrje falas në Aeroportin Ndërkombëtar të Tiranës (TIA/Rinas). Shërbim i shkëlqyer qeraje makinash me sigurim të plotë.'
                  : 'Free pickup at Tirana International Airport (TIA/Rinas). Excellent car rental service with comprehensive insurance.'
                }
              </motion.p>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                >
                  <Link to="/cars">
                    <span className="relative z-10 flex items-center">
                      {language === 'sq' ? 'Shfletoni Flotën' : 'Browse Our Fleet'}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                </Button>
                <Button asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-8 py-6 text-lg bg-transparent transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                >
                  <Link to="/contact">
                    <span className="relative z-10 flex items-center">
                      {language === 'sq' ? 'Na Kontaktoni' : 'Contact Us'}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Airport Info Section */}
          <section className="py-16 lg:py-24 bg-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for airport info section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  {language === 'sq' 
                    ? 'Aeroporti Ndërkombëtar i Tiranës (TIA)'
                    : 'Tirana International Airport (TIA)'
                  }
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  {language === 'sq'
                    ? 'Aeroporti kryesor i Shqipërisë me lidhje direkte në Evropë dhe më gjerë.'
                    : 'Albania\'s main airport with direct connections to Europe and beyond.'
                  }
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                <motion.div variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }} className="group">
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 overflow-hidden relative h-full">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/10 via-blue-300/10 to-blue-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold mb-4 text-blue-800">
                        {language === 'sq' ? 'Informacione të Aeroportit' : 'Airport Information'}
                      </h3>
                      <div className="space-y-2 text-left">
                        <p><strong>{language === 'sq' ? 'Emri:' : 'Name:'}</strong> {airportInfo.name}</p>
                        <p><strong>{language === 'sq' ? 'Kodi:' : 'Code:'}</strong> {airportInfo.code}</p>
                        <p><strong>{language === 'sq' ? 'Vendndodhja:' : 'Location:'}</strong> {airportInfo.location}</p>
                        <p><strong>{language === 'sq' ? 'Distanca:' : 'Distance:'}</strong> {airportInfo.distance}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                <motion.div variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }} className="group">
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 overflow-hidden relative h-full">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-400/10 via-green-300/10 to-green-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold mb-4 text-green-800">
                        {language === 'sq' ? 'Shërbimet Tona' : 'Our Services'}
                      </h3>
                      <div className="space-y-2 text-left">
                        <p>✓ {language === 'sq' ? 'Marrje falas në aeroport' : 'Free airport pickup'}</p>
                        <p>✓ {language === 'sq' ? 'Sigurim i plotë' : 'Full insurance'}</p>
                        <p>✓ {language === 'sq' ? 'Mbështetje 24/7' : '24/7 support'}</p>
                        <p>✓ {language === 'sq' ? 'Flotë moderne' : 'Modern fleet'}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Airport Services Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  {language === 'sq' 
                    ? 'Shërbimet e Aeroportit'
                    : 'Airport Services'
                  }
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  {language === 'sq'
                    ? 'Shërbime të plota dhe profesionale për të gjitha nevojat tuaja të qerasë së makinave në aeroport.'
                    : 'Complete and professional services for all your airport car rental needs.'
                  }
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {airportServices.map((service, index) => (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden rounded-2xl relative text-center">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className={`inline-block p-4 bg-gradient-to-br ${service.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden`}>
                          <service.icon className="h-7 w-7 text-white relative z-10" aria-hidden="true" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-card-foreground">{service.title}</h3>
                        <p className="text-muted-foreground text-sm text-pretty">{service.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 lg:py-24 bg-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for how it works section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  {language === 'sq' 
                    ? 'Si Funksionon'
                    : 'How It Works'
                  }
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  {language === 'sq'
                    ? 'Procesi i thjeshtë dhe i shpejtë për të marrë makinën tuaj në aeroport.'
                    : 'Simple and fast process to get your car at the airport.'
                  }
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              >
                {howItWorks.map((step, index) => (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                    className="group text-center"
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative h-full">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden">
                          <span className="text-2xl font-bold text-white relative z-10">{step.step}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-card-foreground">{step.title}</h3>
                        <p className="text-muted-foreground text-pretty">{step.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative" aria-labelledby="faq-title">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for FAQ section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 id="faq-title" className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  {language === 'sq' ? 'Pyetje të Bëra Shpesh' : 'Frequently Asked Questions'}
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  {language === 'sq'
                    ? 'Gjeni përgjigjet për pyetjet më të zakonshme rreth qerasë së makinave në aeroport.'
                    : 'Find answers to the most common questions about airport car rental.'
                  }
                </p>
              </motion.div>

              <motion.div 
                {...fadeUp}
                className="mx-auto max-w-4xl"
              >
                <div className="grid gap-6">
                  {currentFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Card className="p-0 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden rounded-2xl relative">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className="px-8 py-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                                {index + 1}
                              </div>
                              <h3 className="text-lg font-semibold text-card-foreground">{faq.question}</h3>
                            </div>
                            <div className="pl-12">
                              <p className="text-muted-foreground leading-relaxed text-base text-pretty">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
            
            {/* Light rays for CTA */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-white/30 via-white/20 to-transparent animate-pulse"></div>
              <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-white/25 via-white/15 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center space-y-8">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-balance">
                  {language === 'sq' 
                    ? 'Gati për të Filluar Aventurën Tuaj?'
                    : 'Ready to Start Your Adventure?'
                  }
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto text-pretty">
                  {language === 'sq' 
                    ? 'Rezervoni makinën tuaj për marrje në Aeroportin e Tiranës dhe nisni udhëtimin tuaj shqiptar.'
                    : 'Book your car for pickup at Tirana Airport and start your Albanian journey.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild
                    size="lg"
                    className="bg-white text-yellow-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                  >
                    <Link to="/cars">
                      <span className="flex items-center relative z-10">
                        {language === 'sq' ? 'Rezervoni Tani' : 'Book Now'}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </Link>
                  </Button>
                  <div className="flex items-center gap-4 text-white/80">
                    <button 
                      onClick={() => handleContactClick('phone')}
                      className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
                    >
                      <Phone className="h-4 w-4 group-hover:animate-pulse" />
                      <span>+355-4-123-4567</span>
                    </button>
                    <button 
                      onClick={() => handleContactClick('email')}
                      className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
                    >
                      <Mail className="h-4 w-4 group-hover:animate-pulse" />
                      <span>info@memarental.com</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default RentACarTiranaAirport;

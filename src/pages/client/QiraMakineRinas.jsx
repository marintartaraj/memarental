"use client"

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, Zap, Heart, Navigation, CreditCard, Phone, Mail, MapPin, Calendar, CheckCircle, ArrowRight, Play, Sparkles, Star, Users, Award, Car, Plane, Wrench, Euro, Bus } from "lucide-react"
import { useLanguage } from '../../contexts/LanguageContext';
import Seo from '../../components/Seo';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../../seo/structuredData';
import localSeo from '../../seo/local_seo.json';

const QiraMakineRinas = () => {
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
    { name: 'Kryefaqja', url: '/' },
    { name: 'Qira Makine Rinas', url: '/qira-makine-rinas' }
  ];

  const rinasServices = [
    {
      title: 'Marrje në Aeroport Rinas',
      description: 'Marrje falas direkt nga Aeroporti Ndërkombëtar i Tiranës në Rinas',
      icon: Plane,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: 'Dorëzim në Aeroport',
      description: 'Dorëzimi i makinës në aeroportin Rinas për udhëtimet tuaja të kthimit',
      icon: Car,
      color: "from-green-500 to-green-600"
    },
    {
      title: 'Rezervim Online',
      description: 'Rezervoni makinën tuaj online dhe gati për marrje në aeroportin Rinas',
      icon: Wrench,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: 'Sigurim i Plotë',
      description: 'Sigurim gjithëpërfshirës për të gjitha qerat në aeroportin Rinas',
      icon: Shield,
      color: "from-red-500 to-red-600"
    }
  ];

  const rinasInfo = {
    name: 'Aeroporti Ndërkombëtar i Tiranës (TIA)',
    code: 'TIA',
    location: 'Rinas, Tiranë, Shqipëri',
    distance: '17 km nga qendra e Tiranës',
    coordinates: '41.4147° N, 19.7206° E',
    features: [
      'Parking i madh falas',
      'Restorante dhe kafene',
      'Dyqane dhe shërbime',
      'Transport publik në Tiranë',
      'Taksi dhe shërbime transporti'
    ]
  };

  const howItWorks = [
    {
      step: 1,
      title: 'Rezervoni Online',
      description: 'Zgjidhni makinën dhe datat tuaja të qerasë në faqen tonë të internetit.',
      icon: Wrench
    },
    {
      step: 2,
      title: 'Marrja në Aeroportin Rinas',
      description: 'Ekipi ynë do t\'ju takojë në aeroportin Rinas me makinën tuaj të gatshme.',
      icon: Plane
    },
    {
      step: 3,
      title: 'Udhëtoni',
      description: 'Shijoni udhëtimin tuaj në Shqipëri me makinën tuaj të sigurt dhe të rehatshme.',
      icon: Car
    }
  ];

  const transportationOptions = [
    {
      title: 'Makina me Qera',
      description: 'Rezervoni makinën tuaj online dhe marrje falas në aeroportin Rinas',
      icon: Car,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: 'Transport Publik',
      description: 'Autobusët e linjës Tiranë-Rinas me çmime të përballueshme',
      icon: Bus,
      color: "from-green-500 to-green-600"
    },
    {
      title: 'Taksi',
      description: 'Shërbim taksi i disponueshëm 24/7 në aeroportin Rinas',
      icon: Navigation,
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  const faqs = [
    {
      question: "Sa larg është Aeroporti Rinas nga Tiranë?",
      answer: "Aeroporti Rinas ndodhet 17 km nga qendra e Tiranës. Udhëtimi me makinë zgjat afërsisht 20-30 minuta në varësi të trafikut."
    },
    {
      question: "A ofroni shërbim marrjeje në aeroportin Rinas 24/7?",
      answer: "Po, ofrojmë shërbim marrjeje në aeroportin Rinas 24/7. Ekipi ynë do t'ju takojë në aeroport pavarësisht orarit të mbërritjes suaj."
    },
    {
      question: "Sa kohë duhet për të përpunuar qeranë në aeroportin Rinas?",
      answer: "Procesi ynë i marrjes në aeroportin Rinas është i optimizuar dhe zakonisht zgjat 15-20 minuta. Do të kemi makinën tuaj të gatshme dhe duke pritur."
    },
    {
      question: "A mund ta kthej makinën në aeroportin Rinas?",
      answer: "Po, mund ta ktheni makinën në aeroportin Rinas. Ofrojmë vendndodhje fleksibël dorëzimi duke përfshirë aeroportin për komoditetin tuaj."
    },
    {
      question: "Çfarë dokumentesh më nevojiten për marrjen në aeroportin Rinas?",
      answer: "Do t'ju nevojiten leja juaj e drejtimit, pasaporta ose ID-ja, dhe karta e kredisë e përdorur për rezervimin. Do të trajtojmë pjesën tjetër në aeroport."
    },
    {
      question: "A ka parking në aeroportin Rinas?",
      answer: "Po, aeroporti Rinas ka parking të madh falas për automjetet. Mund të parkoni makinën tuaj nëse dëshironi të përdorni transportin publik për të shkuar në qendër."
    }
  ];

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
        title="Qira Makine Rinas - Qera Makinash në Aeroportin Rinas, Tiranë"
        description="Qira makine Rinas, Tiranë. Marrje falas në aeroportin Rinas, sigurim i plotë dhe mbështetje 24/7. Rezervoni makinën tuaj për marrje në aeroportin Rinas sot!"
        path="/qira-makine-rinas"
        schema={[
          generateLocalBusinessSchema(),
          generateBreadcrumbSchema(breadcrumbs)
        ]}
        language="sq"
        hreflang={false}
      />

      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* Breadcrumb Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-2" aria-label="Breadcrumb">
        <div className="container-mobile">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-yellow-600 transition-colors">
                Ballina
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">
              Qira Makine në Rinas
            </li>
          </ol>
        </div>
      </nav>

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

            <div className="container-mobile py-8 sm:py-12 lg:py-16 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-yellow-200 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/50 to-orange-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plane className="h-4 w-4 relative z-10 animate-pulse" />
                <span className="relative z-10">Rinas Airport • Free Pickup</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.div>

              <motion.h1
                {...fadeUp}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground text-balance leading-tight relative mb-6"
              >
                <span className="relative">
                  Qira Makine Rinas
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed mb-8"
              >
                Marrje falas në Aeroportin Ndërkombëtar të Tiranës në Rinas. Shërbim i shkëlqyer qeraje makinash me sigurim të plotë.
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
                      Shfletoni Flotën
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
                      Na Kontaktoni
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Rinas Airport Info Section */}
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
                  Aeroporti Ndërkombëtar i Tiranës (TIA) - Rinas
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Aeroporti kryesor i Shqipërisë me lidhje direkte në Evropë dhe më gjerë.
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
                        Informacione të Aeroportit
                      </h3>
                      <div className="space-y-2 text-left">
                        <p><strong>Emri:</strong> {rinasInfo.name}</p>
                        <p><strong>Kodi:</strong> {rinasInfo.code}</p>
                        <p><strong>Vendndodhja:</strong> {rinasInfo.location}</p>
                        <p><strong>Distanca:</strong> {rinasInfo.distance}</p>
                        <p><strong>Koordinatat:</strong> {rinasInfo.coordinates}</p>
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
                        Veçoritë e Aeroportit
                      </h3>
                      <div className="space-y-2 text-left">
                        {rinasInfo.features.map((feature, index) => (
                          <p key={index}>✓ {feature}</p>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Rinas Services Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Shërbimet Tona në Aeroportin Rinas
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Shërbime të plota dhe profesionale për të gjitha nevojat tuaja të qerasë së makinave në aeroportin Rinas.
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {rinasServices.map((service, index) => (
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
                  Si Funksionon Qeraja në Aeroportin Rinas
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Procesi i thjeshtë dhe i shpejtë për të marrë makinën tuaj në aeroportin Rinas.
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

          {/* Transportation Options Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Opsionet e Transportit nga Aeroporti Rinas
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Zgjidhni nga opsionet e ndryshme të transportit për të shkuar nga aeroporti Rinas në Tiranë.
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {transportationOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden rounded-2xl relative">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className={`inline-block p-4 bg-gradient-to-br ${option.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden`}>
                          <option.icon className="h-7 w-7 text-white relative z-10" aria-hidden="true" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-card-foreground">{option.title}</h3>
                        <p className="text-muted-foreground text-pretty">{option.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 lg:py-24 bg-white relative" aria-labelledby="faq-title">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for FAQ section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 id="faq-title" className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Pyetje të Bëra Shpesh
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Gjeni përgjigjet për pyetjet më të zakonshme rreth qerasë së makinave në aeroportin Rinas.
                </p>
              </motion.div>

              <motion.div 
                {...fadeUp}
                className="mx-auto max-w-4xl"
              >
                <div className="grid gap-6">
                  {faqs.map((faq, index) => (
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

        </main>
      </div>
    </>
  );
};

export default QiraMakineRinas;

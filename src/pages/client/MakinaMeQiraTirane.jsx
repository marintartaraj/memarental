"use client"

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, Zap, Heart, Navigation, CreditCard, Phone, Mail, MapPin, Calendar, CheckCircle, ArrowRight, Play, Sparkles, Star, Users, Award, Car, Plane, Wrench, Euro } from "lucide-react"
import { useLanguage } from '../../contexts/LanguageContext';
import Seo from '../../components/Seo';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../../seo/structuredData';
import localSeo from '../../seo/local_seo.json';

const MakinaMeQiraTirane = () => {
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
    { name: 'Makina me Qira në Tiranë', url: '/makina-me-qira-tirane' }
  ];

  const services = [
    {
      title: 'Qera Makinash në Tiranë',
      description: 'Shërbim profesional qeraje makinash me flotë moderne dhe çmime konkurruese',
      icon: Car,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: 'Marrje në Aeroport',
      description: 'Marrje falas në Aeroportin Ndërkombëtar të Tiranës (TIA/Rinas)',
      icon: Plane,
      color: "from-green-500 to-green-600"
    },
    {
      title: 'Sigurim i Plotë',
      description: 'Sigurim gjithëpërfshirës për të gjitha qerat me mbulim të plotë',
      icon: Shield,
      color: "from-red-500 to-red-600"
    },
    {
      title: 'Mbështetje 24/7',
      description: 'Asistencë e klientit dhe mbështetje teknike gjatë gjithë kohës',
      icon: Clock,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: 'Flotë Moderne',
      description: 'Automjete të modeleve të fundit me mirëmbajtje të rregullt',
      icon: Wrench,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: 'Çmime Konkurruese',
      description: 'Tarifa të përballueshme pa kosto të fshehura ose tarifa shtesë',
      icon: Euro,
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const fleetCategories = [
    {
      category: 'Ekonomike',
      price: 'Nga €25/ditë',
      description: 'Ideal për udhëtime të shkurtra',
      icon: Car,
      color: "from-green-500 to-green-600"
    },
    {
      category: 'Mesatare',
      price: 'Nga €40/ditë',
      description: 'Për familje dhe udhëtime mesatare',
      icon: Car,
      color: "from-blue-500 to-blue-600"
    },
    {
      category: 'SUV',
      price: 'Nga €60/ditë',
      description: 'Për aventura dhe terren të vështirë',
      icon: Car,
      color: "from-orange-500 to-orange-600"
    },
    {
      category: 'Luksoze',
      price: 'Nga €80/ditë',
      description: 'Për eksperienca premium',
      icon: Car,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const faqs = [
    {
      question: "Çfarë më duhet për të marrë me qera një makinë në Tiranë?",
      answer: "Ju nevojitet një leje drejtimi e vlefshme (minimumi 1 vit), pasaportë ose kartë ID, kartë krediti për garanci dhe mosha minimale 21 vjeç. Rekomandohet leja ndërkombëtare drejtimi."
    },
    {
      question: "A ofroni marrje në aeroport në Tiranë?",
      answer: "Po, ofrojmë shërbim falas marrjeje dhe dorëzimi në Aeroportin Ndërkombëtar të Tiranës (TIA/Rinas) për komoditetin tuaj."
    },
    {
      question: "Çfarë mbulimi sigurimi përfshihet?",
      answer: "Të gjitha qerat tona përfshijnë mbulim të plotë sigurimi. Opsione shtesë mbulimi janë të disponueshme për mbrojtje shtesë gjatë udhëtimit tuaj."
    },
    {
      question: "A mund të marr me qera një makinë për vetëm një ditë?",
      answer: "Po, ofrojmë periudha fleksibël qeraje nga 1 ditë deri në qera afatgjata. Na kontaktoni për tarifa të veçanta për qera të zgjeruara."
    },
    {
      question: "Çfarë metodash pagese pranoni?",
      answer: "Pranojmë karta krediti, karta debiti, para në dorë dhe transferta bankare. Një kartë krediti kërkohet për depozitën e sigurisë."
    },
    {
      question: "A ofroni shërbim marrjeje në shtëpi?",
      answer: "Po, ofrojmë marrje dhe dorëzim falas në Tiranë dhe rrethinat e saj për komoditetin tuaj."
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
        title="Makina me Qira në Tiranë - Qera Makinash në Tiranë, Shqipëri"
        description="Makina me qira në Tiranë, Shqipëri. Shërbim i shkëlqyer qeraje makinash me çmime konkurruese. Marrje në aeroport, sigurim i plotë dhe mbështetje 24/7. Rezervoni sot!"
        path="/makina-me-qira-tirane"
        schema={[
          generateLocalBusinessSchema(),
          generateBreadcrumbSchema(breadcrumbs)
        ]}
        language="sq"
        hreflang={false}
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
                <Car className="h-4 w-4 relative z-10 animate-pulse" />
                <span className="relative z-10">Tirana • Makina me Qira</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.div>

              <motion.h1
                {...fadeUp}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground text-balance leading-tight relative mb-6"
              >
                <span className="relative">
                  Makina me Qira në Tiranë
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed mb-8"
              >
                Shërbimi më i mirë i qerasë së makinave në Tiranë, Shqipëri. Çmime konkurruese, flotë moderne dhe mbështetje 24/7.
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

          {/* Features Section */}
          <section id="why-us" className="py-16 lg:py-24 bg-white relative" aria-labelledby="why-us-title">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for features section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2
                  id="why-us-title"
                  className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance relative"
                >
                  <span className="relative">
                    Pse të Zgjidhni MEMA Rental për Makina me Qira në Tiranë?
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Përvoja premium e qerasë së makinave me çmime transparente, sigurim gjithëpërfshirës dhe mbështetje të jashtëzakonshme të klientit.
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <motion.div
                  variants={fadeUp}
                  whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="p-6 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative h-full">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="text-center relative z-10 space-y-4">
                      <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden">
                        <Wrench className="h-7 w-7 text-white relative z-10" aria-hidden="true" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-card-foreground">Flotë Moderne</h3>
                      <p className="text-muted-foreground text-pretty">Automjete të modeleve të fundit me sigurim të plotë dhe mirëmbajtje të rregullt.</p>
                    </div>
                  </Card>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="p-6 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative h-full">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="text-center relative z-10 space-y-4">
                      <div className="inline-block p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden">
                        <Plane className="h-7 w-7 text-white relative z-10" aria-hidden="true" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-card-foreground">Marrje në Aeroport</h3>
                      <p className="text-muted-foreground text-pretty">Marrje dhe dorëzim falas në Aeroportin Ndërkombëtar të Tiranës (TIA/Rinas).</p>
                    </div>
                  </Card>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="p-6 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative h-full">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="text-center relative z-10 space-y-4">
                      <div className="inline-block p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden">
                        <Clock className="h-7 w-7 text-white relative z-10" aria-hidden="true" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-card-foreground">Mbështetje 24/7</h3>
                      <p className="text-muted-foreground text-pretty">Asistencë e klientit dhe mbështetje teknike gjatë gjithë kohës.</p>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Shërbimet Tona
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Shërbime të plota dhe profesionale për të gjitha nevojat tuaja të qerasë së makinave.
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {services.map((service, index) => (
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
                        <p className="text-muted-foreground text-pretty">{service.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Fleet Preview Section */}
          <section className="py-16 lg:py-24 bg-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for fleet section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Flota Jonë e Makinave
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Zgjidhni nga një gamë e gjerë makinash për të gjitha nevojat dhe buxhetet tuaja.
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {fleetCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white overflow-hidden rounded-2xl relative text-center">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className={`inline-block p-4 bg-gradient-to-br ${category.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden`}>
                          <category.icon className="h-7 w-7 text-white relative z-10" aria-hidden="true" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-card-foreground">{category.category}</h3>
                        <p className="text-lg font-bold text-primary mb-2">{category.price}</p>
                        <p className="text-sm text-muted-foreground text-pretty">{category.description}</p>
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
                  Pyetje të Bëra Shpesh
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Gjeni përgjigjet për pyetjet më të zakonshme rreth qerasë së makinave në Tiranë.
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
                  Gati për të Eksploruar Shqipërinë?
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto text-pretty">
                  Rezervoni sot makinën tuaj me qera në Tiranë dhe nisni aventurën shqiptare me çmimet dhe shërbimin më të mirë.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild
                    size="lg"
                    className="bg-white text-yellow-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                  >
                    <Link to="/cars">
                      <span className="flex items-center relative z-10">
                        Rezervoni Tani
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

export default MakinaMeQiraTirane;

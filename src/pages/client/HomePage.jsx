"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Star, Users, Award, Shield, Clock, Zap, Heart, Navigation, CreditCard, Mail, Calendar, CheckCircle, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLanguage } from "../../contexts/LanguageContext"
import Seo from "../../components/Seo"
import { generateLocalBusinessSchema, generateWebSiteSchema, generateBreadcrumbSchema } from "../../seo/structuredData"
import { supabase } from "../../lib/customSupabaseClient"

const HomePage = () => {
  const { language } = useLanguage()
  const prefersReducedMotion = useReducedMotion()
  const [featuredCar, setFeaturedCar] = useState(null)
  const [loadingCar, setLoadingCar] = useState(true)

  // Fetch Mercedes-Benz E-Class car data
  useEffect(() => {
    const fetchFeaturedCar = async () => {
      try {
        setLoadingCar(true)
        console.log('Fetching featured Mercedes-Benz car...')
        
        // Try to find any Mercedes-Benz E-Class first (most likely to exist)
        let { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('brand', 'Mercedes-Benz')
          .ilike('model', '%E%')
          .single()

        // If still not found, get any Mercedes-Benz car
        if (error || !data) {
          console.log('E-Class not found, trying any Mercedes-Benz...')
          const { data: mercedesData, error: mercedesError } = await supabase
            .from('cars')
            .select('*')
            .eq('brand', 'Mercedes-Benz')
            .single()
          
          if (!mercedesError && mercedesData) {
            data = mercedesData
            error = null
          } else {
            error = mercedesError
          }
        }

        // If still not found, get any premium car
        if (error || !data) {
          console.log('Mercedes-Benz not found, trying any premium car...')
          const { data: premiumData, error: premiumError } = await supabase
            .from('cars')
            .select('*')
            .in('brand', ['Mercedes-Benz', 'BMW', 'Audi'])
            .single()
          
          if (!premiumError && premiumData) {
            data = premiumData
            error = null
          } else {
            error = premiumError
          }
        }

        if (error) {
          console.error('Error fetching featured car:', error)
          // Don't set a fallback car - let the buttons redirect to /cars
          setFeaturedCar(null)
          return
        }

        if (data) {
          console.log('Featured car found:', data)
          setFeaturedCar(data)
        } else {
          console.log('No Mercedes-Benz car found in database')
          // Don't set a fallback car - let the buttons redirect to /cars
          setFeaturedCar(null)
        }
      } catch (err) {
        console.error('Error fetching featured car:', err)
        // Don't set a fallback car - let the buttons redirect to /cars
        setFeaturedCar(null)
      } finally {
        setLoadingCar(false)
      }
    }

    fetchFeaturedCar()
  }, [])

  // FAQ items for rich results
  const faqItems = [
    {
      question: language === 'sq' 
        ? "Çfarë dokumentesh më duhen për të marrë me qira një makinë?"
        : "What documents do I need to rent a car?",
      answer: language === 'sq'
        ? "Ju duhet një patentë e vlefshme, pasaportë ose ID kombëtare dhe një kartë krediti. Patenta ndërkombëtare rekomandohet për qytetarët jo-EU. Mosha minimale 21 vjeç me 2+ vite përvoja në vozitje."
        : "You'll need a valid driver's license, passport or national ID, and a credit card. International license recommended for non-EU citizens. Minimum age 21 with 2+ years driving experience."
    },
    {
      question: language === 'sq'
        ? "A ofroni marrje në aeroport?"
        : "Do you offer airport pickup?",
      answer: language === 'sq'
        ? "Po! Ne ofrojmë marrje dhe dorëzim 24/7 në Aeroportin Ndërkombëtar të Tiranës. Stafi ynë do t'ju takojë në arritje me automjetin tuaj gati për të shkuar."
        : "Yes! We provide 24/7 pickup and drop-off at Tirana International Airport. Our staff will meet you at arrivals with your vehicle ready to go."
    },
    {
      question: language === 'sq'
        ? "A është sigurimi i përfshirë?"
        : "Is insurance included?",
      answer: language === 'sq'
        ? "Të gjitha qirat përfshijnë mbulim të plotë sigurimi. Ne ofrojmë opsione shtesë mbrojtje përfshirë mbrojtjen nga dëmi i përplasjes dhe asistencën rrugore."
        : "All rentals include comprehensive insurance coverage. We offer additional protection options including collision damage waiver and roadside assistance."
    },
    {
      question: language === 'sq'
        ? "A mund të vozit në vende të tjera?"
        : "Can I drive to other countries?",
      answer: language === 'sq'
        ? "Po, udhëtimi ndërkufitar në Greqi, Maqedoni të Veriut, Mal të Zi dhe Kosovë është i lejuar. Ju lutemi na informoni paraprakisht për dokumentimin e duhur."
        : "Yes, cross-border travel to Greece, North Macedonia, Montenegro, and Kosovo is permitted. Please inform us in advance for proper documentation."
    },
    {
      question: language === 'sq'
        ? "Cila është politika juaj e anulimit?"
        : "What is your cancellation policy?",
      answer: language === 'sq'
        ? "Anulim falas deri në 24 orë para marrjes. Anulimet brenda 24 orësh mund të përfshijnë një tarifë të vogël. Ne kuptojmë që ndodhin emergjenca, kështu që ju lutemi na kontaktoni sa më shpejt të jetë e mundur."
        : "Free cancellation up to 24 hours before pickup. Cancellations within 24 hours may incur a small fee. We understand emergencies happen, so please contact us as soon as possible."
    },
    {
      question: language === 'sq'
        ? "Sa kohë përpara duhet të rezervoj?"
        : "How far in advance should I book?",
      answer: language === 'sq'
        ? "Ne rekomandojmë rezervimin të paktën 1-2 javë përpara, veçanërisht gjatë sezonit të lartë (Qershor-Shtator). Për marrje në aeroport ose lloje specifike automjetesh, rezervimi 2-3 javë përpara siguron disponueshmërinë."
        : "We recommend booking at least 1-2 weeks in advance, especially during peak season (June-September). For airport pickup or specific vehicle types, booking 2-3 weeks ahead ensures availability."
    },
    {
      question: language === 'sq'
        ? "A mund të marr makinën në Aeroportin e Tiranës?"
        : "Can I pick up my car at Tirana Airport?",
      answer: language === 'sq'
        ? "Po! Ne ofrojmë marrje dhe dorëzim direkt në Aeroportin Ndërkombëtar të Tiranës (TIA). Stafi ynë do t'ju presë në terminalin e arritjeve me automjetin tuaj gati për të shkuar."
        : "Yes! We provide direct pickup and drop-off at Tirana International Airport (TIA). Our staff will meet you at the arrivals terminal with your vehicle ready to go."
    },
    {
      question: language === 'sq'
        ? "Çfarë lloj makinash ofroni në Tiranë?"
        : "What types of cars do you offer in Tirana?",
      answer: language === 'sq'
        ? "Ne ofrojmë një gamë të gjerë automjetesh nga ekonomike deri te luksoze: sedan, SUV, hatchback, dhe makina premium si Mercedes-Benz E-Class. Të gjitha makinat janë të reja dhe të mirëmbajtura."
        : "We offer a wide range of vehicles from economy to luxury: sedans, SUVs, hatchbacks, and premium cars like Mercedes-Benz E-Class. All vehicles are new and well-maintained."
    },
    {
      question: language === 'sq'
        ? "A është e sigurt të vozit në Shqipëri?"
        : "Is it safe to drive in Albania?",
      answer: language === 'sq'
        ? "Po, vozitja në Shqipëri është e sigurt. Rrugët kryesore janë në gjendje të mirë dhe ne ofrojmë GPS falas për navigim të lehtë. Rekomandojmë vozitje të kujdesshme në zonat malore."
        : "Yes, driving in Albania is safe. Main roads are in good condition and we provide free GPS for easy navigation. We recommend careful driving in mountainous areas."
    }
  ]

  // FAQ schema for rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(({question, answer}) => ({
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    }))
  }

  // Reviews schema for rich results
  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "MEMA Rental",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Maria K."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Perfect experience! Car was spotless and the staff provided excellent local recommendations. Made our Albanian road trip unforgettable.",
        "datePublished": "2024-01-15"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Ahmed S."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Excellent service from start to finish. The SUV was perfect for our mountain adventure. Professional and reliable!",
        "datePublished": "2024-01-10"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah L."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Amazing experience! Seamless airport pickup and the car was in perfect condition. Highly recommend MEMA Rental.",
        "datePublished": "2024-01-05"
      }
    ]
  }

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: language === 'sq' ? 'Ballina' : 'Home', url: '/' },
    { name: language === 'sq' ? 'Qira Makine Tiranë' : 'Car Rental Tirana', url: '/' }
  ])

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

  const destinations = [
    { 
      name: "Tirana City Center", 
      emoji: "🏛️", 
      description: "Vibrant capital with museums, Blloku nightlife, and easy day trips.", 
      image: "/images/cars/tirana.png",
      link: "https://en.wikivoyage.org/wiki/Tirana"
    },
    { 
      name: "Berat & Gjirokastër (UNESCO)", 
      emoji: "🏰", 
      description: "Ottoman-era townscapes, castles, and stone houses.", 
      image: "/images/cars/berat.png",
      link: "https://whc.unesco.org/en/list/569"
    },
    { 
      name: "Butrint National Park (UNESCO)", 
      emoji: "🏛️", 
      description: "Ancient city amid lagoons and forests near Sarandë.", 
      image: "/images/cars/butrint.png",
      link: "https://whc.unesco.org/en/list/570"
    },
    { 
      name: "Ksamil & Islets", 
      emoji: "🏝️", 
      description: "Iconic turquoise waters and tiny islands.", 
      image: "/images/cars/ksamil.png",
      link: "https://en.wikivoyage.org/wiki/Ksamil"
    },
    { 
      name: "Valbona Valley National Park", 
      emoji: "⛰️", 
      description: "Alpine valley, clear river, classic hiking base.", 
      image: "/images/cars/valbona.png",
      link: "https://en.wikivoyage.org/wiki/Valbona_Valley_National_Park"
    },
    { 
      name: "Theth National Park", 
      emoji: "🏔️", 
      description: "Rugged mountains, waterfalls, and stone towers.", 
      image: "/images/cars/theth.png",
      link: "https://en.wikivoyage.org/wiki/Theth"
    },
    { 
      name: "Albanian Riviera", 
      emoji: "🌊", 
      description: "Himarë–Dhërmi coastline, beaches, and coves.", 
      image: "/images/cars/albaniariveria.png",
      link: "https://en.wikivoyage.org/wiki/Albanian_Riviera"
    },
    { 
      name: "Gjipe Beach", 
      emoji: "🏖️", 
      description: "Spectacular secluded cove between cliffs.", 
      image: "/images/cars/gjipe.png",
      link: "https://en.wikivoyage.org/wiki/Dhërmi"
    },
    { 
      name: "Krujë Castle & Skanderbeg Museum", 
      emoji: "🏰", 
      description: "Historic fortress, museum, and Ottoman bazaar.", 
      image: "/images/cars/kruja.png",
      link: "https://en.wikivoyage.org/wiki/Krujë"
    },
    { 
      name: "Shkodër & Rozafa Castle", 
      emoji: "🏯", 
      description: "Hilltop fortress with river and city views.", 
      image: "/images/cars/shkodra.png",
      link: "https://en.wikivoyage.org/wiki/Shkodër"
    },
    { 
      name: "Lake Ohrid (Pogradec)", 
      emoji: "🏞️", 
      description: "Ancient UNESCO lake with unique biodiversity.", 
      image: "/images/cars/pogradeci.png",
      link: "https://whc.unesco.org/en/list/99"
    },
    { 
      name: "Durrës & Ancient Amphitheater", 
      emoji: "🏛️", 
      description: "Historic port city with Roman amphitheater and Adriatic beaches.", 
      image: "/images/cars/durres.png",
      link: "https://en.wikivoyage.org/wiki/Durrës"
    }
  ]

  const benefits = [
    { icon: Shield, title: "Fully Insured", description: "Complete coverage and peace of mind", color: "from-blue-500 to-blue-600" },
    { icon: Clock, title: "24/7 Support", description: "Round-the-clock assistance when you need it", color: "from-green-500 to-green-600" },
    { icon: Zap, title: "Instant Booking", description: "Reserve your car in under 2 minutes", color: "from-yellow-500 to-yellow-600" },
    { icon: Heart, title: "Best Rates", description: "Competitive pricing with no hidden fees", color: "from-red-500 to-red-600" },
    { icon: Navigation, title: "Free GPS", description: "Navigate Albania with confidence", color: "from-purple-500 to-purple-600" },
    { icon: CreditCard, title: "Flexible Payment", description: "Multiple payment options available", color: "from-indigo-500 to-indigo-600" },
  ]


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
          ? 'Qira Makine Tiranë | MEMA Rental (Aeroporti TIA)'
          : 'Rent a Car in Tirana | MEMA Rental (Airport Pickup)'
        }
        description={language === 'sq' 
          ? 'Qira makine në Tiranë dhe Aeroportin TIA. Makina të siguruara, mbështetje 24/7, dorëzim falas në qendër. Rezervo online për 2 minuta.'
          : 'Premium car rental in Tirana and TIA airport. Fully insured cars, 24/7 support, free city-center delivery. Book online in minutes.'
        }
        path="/"
        schema={[
          generateLocalBusinessSchema(),
          generateWebSiteSchema(),
          faqSchema,
          reviewsSchema,
          breadcrumbSchema
        ]}
        language={language}
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
                {language === 'sq' ? 'Ballina' : 'Home'}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">
              {language === 'sq' ? 'Qira Makine Tiranë' : 'Car Rental Tirana'}
            </li>
          </ol>
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Global light effects */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Ambient light rays */}
          <div className={`absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-transparent rounded-full blur-3xl ${prefersReducedMotion ? "" : "md:animate-pulse"}`}></div>
          <div className={`absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/15 to-transparent rounded-full blur-3xl ${prefersReducedMotion ? "" : "md:animate-pulse"}`}></div>
          <div className={`absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-100/10 to-transparent rounded-full blur-3xl hidden sm:block ${prefersReducedMotion ? "" : "md:animate-pulse"}`}></div>
        </div>

        <main id="main" className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-white pt-8 pb-8 sm:pt-12 sm:pb-12 lg:pt-16 lg:pb-12">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${prefersReducedMotion ? "" : "animate-blob"}`}></div>
              <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${prefersReducedMotion ? "" : "animate-blob"} animation-delay-2000`}></div>
              <div className={`absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${prefersReducedMotion ? "" : "animate-blob"} animation-delay-4000`}></div>
            </div>

            <div className="container-mobile relative z-10">
              <div className="flex flex-col gap-8 sm:gap-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-16">
              {/* Hero Content */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-5 lg:space-y-6 text-center lg:text-left">
                  <motion.div
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: 0.1 }}
                    className="space-y-3 sm:space-y-4"
                  >
                    <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-foreground text-balance leading-tight">
                      <span className="relative">
                        {language === 'sq' ? 'Qira Makine në Tiranë' : 'Rent a Car in Tirana'}
                      </span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto lg:mx-0 text-pretty leading-relaxed">
                      {language === 'sq'
                        ? 'Shërbim premium i qirasë së makinave në Tiranë dhe në të gjithë Shqipërinë. Automjete të siguruara plotësisht, marrje në aeroport dhe çmime transparente për aventurën tuaj të përsosur shqiptare.'
                        : 'Premium car rental service in Tirana and across Albania. Fully insured vehicles, airport pickup, and transparent pricing for your perfect Albanian adventure.'
                      }
                    </p>
                  </motion.div>

                  {/* Intent paragraph with internal links */}
                  <motion.div
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: 0.2 }}
                    className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0"
                  >
                    {language === 'sq' ? (
                      <>
                          Looking for <Link to="/makina-me-qira-tirane" className="text-yellow-600 hover:text-yellow-700 underline font-medium">qira makine në Tiranë</Link> or <Link to="/qira-makine-rinas" className="text-yellow-600 hover:text-yellow-700 underline font-medium">qira makine në Rinas</Link> for the best travel experience
                      </>
                    ) : (
                      <>
                          Looking for <Link to="/rent-a-car-tirana" className="text-yellow-600 hover:text-yellow-700 underline font-medium">rent a car in Tirana</Link> or <Link to="/rent-a-car-tirana-airport" className="text-yellow-600 hover:text-yellow-700 underline font-medium">rent a car at Tirana airport</Link> for the best travel experience
                      </>
                    )}
                  </motion.div>

                  {/* Quick Action Buttons */}
                  <motion.div
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2"
                  >
                    <Link 
                      to={featuredCar ? `/booking/${featuredCar.id}` : "/cars"}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 font-semibold text-sm sm:text-base"
                    >
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      {featuredCar ? "Book Now" : "View Cars"}
                    </Link>
                    <Link 
                      to="/cars"
                      className="inline-flex items-center justify-center gap-2 border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white rounded-full px-6 py-3 transition-all duration-300 ease-in-out transform hover:scale-105 font-semibold text-sm sm:text-base"
                    >
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      Our Cars
                    </Link>
                  </motion.div>
                </div>

              {/* Featured Car Card */}
              <motion.div 
                {...fadeUp} 
                transition={{ ...fadeUp.transition, delay: 0.15 }} 
                className="lg:col-span-5 order-last lg:order-none"
              >
                <div className="relative">
                  {/* Featured Badge */}
                  <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    Featured
                  </div>
                  
                  <Card className="p-0 shadow-2xl border-0 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-500 group bg-white">
                    <div className="flex flex-col">
                      {/* Car Image */}
                      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        <img
                          src="/images/cars/e%20class1.jpeg"
                          alt={language === 'sq' 
                            ? 'Mercedes-Benz E-Class sedan luksoze për qira në Tiranë, Shqipëri - Automjet premium me sigurim të plotë dhe marrje në aeroport' 
                            : 'Premium Mercedes-Benz E-Class luxury sedan for rent in Tirana, Albania - Executive car with full insurance and airport pickup service'}
                           className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                           loading="eager"
                           width="1600"
                           height="1200"
                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        
                        {/* Status Badge */}
                        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-semibold text-gray-900 shadow-lg">
                          Available Now
                        </div>
                      </div>

                      {/* Car Details */}
                      <div className="p-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <p className="text-xs uppercase tracking-wider text-yellow-700 font-bold">Premium Selection</p>
                          </div>
                          <h3 className="font-heading text-xl lg:text-2xl font-bold text-card-foreground">Mercedes-Benz E-Class</h3>
                          <p className="text-sm text-muted-foreground">Executive • Automatic • Premium</p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 pt-2">
                          <span className="font-heading text-3xl lg:text-4xl font-black text-yellow-600">
                            €{featuredCar ? featuredCar.daily_rate : '85'}
                          </span>
                          <span className="text-base text-muted-foreground">/ day</span>
                        </div>

                        {/* Action Button - Hidden on Desktop */}
                        <div className="pt-2 lg:hidden">
                          <Link 
                            to={featuredCar ? `/booking/${featuredCar.id}` : "/cars"}
                            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 font-semibold text-base"
                          >
                            <Calendar className="h-5 w-5" />
                            {featuredCar ? "Book This Car" : "View All Cars"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="why-us" className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-gray-50 relative" aria-labelledby="why-us-title">
            
            {/* Light rays for features section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
              <div className={`absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent ${prefersReducedMotion ? "" : "animate-pulse animation-delay-1000"}`}></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-12 lg:mb-16 space-y-4">
                <h2
                  id="why-us-title"
                  className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance relative"
                >
                  <span className="relative">
                    Why Choose MEMA Rental
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Experience premium car rental service with transparent pricing, comprehensive insurance, and
                  exceptional customer support.
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative h-full group-hover:scale-105">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="text-center relative z-10 space-y-4">
                        <div className={`inline-block p-4 bg-gradient-to-br ${benefit.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden`}>
                          <benefit.icon className="h-7 w-7 text-white relative z-10" aria-hidden="true" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-card-foreground">{benefit.title}</h3>
                        <p className="text-muted-foreground text-pretty">{benefit.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Popular Destinations */}
          <section id="destinations" className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-white relative" aria-labelledby="destinations-title">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-12 lg:mb-16 space-y-4">
                <h2
                  id="destinations-title"
                  className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance"
                >
                  Popular Destinations
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Discover Albania's most beautiful locations with the freedom of your own vehicle.
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                {destinations.map((destination, index) => (
                  <motion.div
                    key={destination.name}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-0 hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white overflow-hidden rounded-2xl relative group-hover:scale-105">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <a
                        href={destination.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        aria-label={`Learn more about ${destination.name}`}
                      >
                        <div className="relative z-10">
                          <div className="relative h-32 lg:h-48 overflow-hidden">
                            <img
                              src={destination.image}
                              alt={language === 'sq' ? `${destination.name} në Shqipëri - ${destination.description}` : `${destination.name} in Albania - ${destination.description}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              loading="lazy"
                              width="800"
                              height="600"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              onError={(e) => { e.currentTarget.src = "/images/cars/placeholder-car.jpg"; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 text-2xl lg:text-4xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out pointer-events-none" aria-hidden="true">
                              {destination.emoji}
                            </div>
                            
                            {/* Light overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/10 via-transparent to-orange-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          </div>
                          <div className="p-3 lg:p-6">
                            <h3 className="font-heading text-base lg:text-lg font-bold text-card-foreground mb-1 lg:mb-2 line-clamp-2">{destination.name}</h3>
                            <p className="text-muted-foreground text-sm text-pretty line-clamp-3">{destination.description}</p>
                          </div>
                        </div>
                      </a>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-gray-50 relative" aria-labelledby="testimonials-title">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30"></div>
            
            {/* Light rays for testimonials */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute top-1/3 left-1/4 w-px h-1/3 bg-gradient-to-b from-yellow-300/15 via-yellow-200/10 to-transparent ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
              <div className={`absolute bottom-1/3 right-1/4 w-px h-1/3 bg-gradient-to-b from-orange-300/10 via-orange-200/8 to-transparent ${prefersReducedMotion ? "" : "animate-pulse animation-delay-2000"}`}></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-12 lg:mb-16 space-y-4">
                <h2 id="testimonials-title" className="font-heading text-3xl sm:text-4xl font-black text-foreground">
                  Trusted by Travelers Worldwide
                </h2>
                <p className="text-lg text-muted-foreground">
                  See what our customers say about their Albanian adventure
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="overflow-x-auto snap-x snap-mandatory -mx-4 px-4 sm:overflow-visible sm:mx-0 sm:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6"
              >
                {[
                  {
                    name: "Maria K.",
                    location: "Italy",
                    rating: 5,
                    text: "Perfect experience! Car was spotless and the staff provided excellent local recommendations. Made our Albanian road trip unforgettable.",
                    date: "2 weeks ago",
                    avatar: "🇮🇹"
                  },
                  {
                    name: "Ahmed S.",
                    location: "Germany",
                    rating: 5,
                    text: "Excellent service from start to finish. The SUV was perfect for our mountain adventure. Professional and reliable!",
                    date: "1 month ago",
                    avatar: "🇩🇪"
                  },
                  {
                    name: "Sarah L.",
                    location: "UK",
                    rating: 4.5,
                    text: "Amazing experience! Seamless airport pickup and the car was in perfect condition. Highly recommend MEMA Rental.",
                    date: "3 weeks ago",
                    avatar: "🇬🇧"
                  },
                  {
                    name: "Nikolai P.",
                    location: "Russia",
                    rating: 5,
                    text: "Great value for money! Rented a luxury car for our business trip. Professional service, clean vehicle, and excellent customer support.",
                    date: "1 week ago",
                    avatar: "🇷🇺"
                  },
                  {
                    name: "Elena M.",
                    location: "Greece",
                    rating: 4,
                    text: "Perfect for our road trip through Albania! The car was in excellent condition, fuel-efficient, and the staff provided great recommendations.",
                    date: "2 months ago",
                    avatar: "🇬🇷"
                  },
                  {
                    name: "David R.",
                    location: "USA",
                    rating: 5,
                    text: "Outstanding service! Rented for 10 days to explore the country. Car was reliable, GPS worked perfectly, and the team was always available.",
                    date: "1 month ago",
                    avatar: "🇺🇸"
                  },
                  {
                    name: "Sophie M.",
                    location: "France",
                    rating: 5,
                    text: "Fantastic car rental experience in Tirana! The Mercedes-Benz was luxurious and comfortable. Airport pickup was seamless and the staff was very helpful.",
                    date: "3 weeks ago",
                    avatar: "🇫🇷"
                  },
                  {
                    name: "Marco R.",
                    location: "Italy",
                    rating: 5,
                    text: "Best car rental service in Tirana! Clean cars, fair prices, and excellent customer service. Will definitely use MEMA Rental again on my next visit.",
                    date: "1 month ago",
                    avatar: "🇮🇹"
                  },
                  {
                    name: "Anna K.",
                    location: "Poland",
                    rating: 5,
                    text: "Highly recommended! The car was perfect for exploring Albania's beautiful coastline. Great value and professional service throughout our trip.",
                    date: "2 weeks ago",
                    avatar: "🇵🇱"
                  }
                ].map((testimonial, i) => (
                  <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }} className="snap-start min-w-[85%] sm:min-w-0">
                    <Card className="p-6 h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/5 via-orange-400/5 to-yellow-400/5 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-yellow-600 mb-3" aria-hidden="true">
                          {Array.from({ length: testimonial.rating }, (_, i) => (
                            <span key={i} className={prefersReducedMotion ? "" : "group-hover:animate-pulse"}>★</span>
                          ))}
                        </div>
                        <p className="text-card-foreground mb-4 italic text-pretty leading-relaxed">"{testimonial.text}"</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">{testimonial.avatar}</div>
                            <div>
                              <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                              <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-white relative" aria-labelledby="faq-title">
            
            {/* Light rays for FAQ section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
              <div className={`absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent ${prefersReducedMotion ? "" : "animate-pulse animation-delay-1000"}`}></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-12 lg:mb-16 space-y-4">
                <h2 id="faq-title" className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Everything you need to know about renting with us
                </p>
              </motion.div>

              <motion.div 
                {...fadeUp}
                className="mx-auto max-w-4xl"
              >
                <div className="grid gap-6">
                  {faqItems.map((faq, index) => (
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
                          <Accordion type="single" collapsible>
                            <AccordionItem value={`faq-${index}`} className="border-0">
                              <AccordionTrigger className="px-8 py-6 text-left hover:text-yellow-600 transition-colors font-semibold text-lg group-hover:bg-yellow-50/50 rounded-t-2xl min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                <div className="flex items-center gap-4 w-full">
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                                    {index + 1}
                                  </div>
                                  <span className="flex-1 text-left">{faq.question}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-8 pb-6 pt-0">
                                <div className="pl-12">
                                  <p className="text-muted-foreground leading-relaxed text-base text-pretty">
                                    {faq.answer}
                                  </p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
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
  )
}

export default HomePage



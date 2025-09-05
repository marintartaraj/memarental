"use client"

import React from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Star, Users, Award, Shield, Clock, Zap, Heart, Navigation, CreditCard, Phone, Mail, MapPin, Calendar, CheckCircle, ArrowRight, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLanguage } from "../../contexts/LanguageContext"
import Seo from "../../components/Seo"
import { generateLocalBusinessSchema, generateWebSiteSchema } from "../../seo/structuredData"

const HomePage = () => {
  const { language } = useLanguage()
  const prefersReducedMotion = useReducedMotion()

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

  const handleWhatsAppClick = () => {
    const phoneNumber = '+355-4-123-4567'
    const message = 'Hello! I would like to inquire about car rental services in Tirana.'
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
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
          faqSchema
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Global light effects */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Ambient light rays */}
          <div className={`absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-transparent rounded-full blur-3xl ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
          <div className={`absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/15 to-transparent rounded-full blur-3xl ${prefersReducedMotion ? "" : "animate-pulse animation-delay-2000"}`}></div>
          <div className={`absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-100/10 to-transparent rounded-full blur-3xl ${prefersReducedMotion ? "" : "animate-pulse animation-delay-4000"}`}></div>
        </div>

        <main id="main" className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Enhanced Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Main floating orbs */}
              <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-yellow-300/25 to-transparent rounded-full blur-3xl ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
              <div className={`absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-orange-300/25 to-transparent rounded-full blur-3xl ${prefersReducedMotion ? "" : "animate-pulse animation-delay-2000"}`}></div>
              
              {/* Additional subtle orbs */}
              <div className={`absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-yellow-200/15 to-transparent rounded-full blur-2xl ${prefersReducedMotion ? "" : "animate-pulse animation-delay-3000"}`}></div>
              <div className={`absolute bottom-1/3 left-1/3 w-32 h-32 bg-gradient-to-br from-orange-200/15 to-transparent rounded-full blur-2xl ${prefersReducedMotion ? "" : "animate-pulse animation-delay-1500"}`}></div>
              
              {/* Subtle light rays */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className={`absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-yellow-300/20 via-yellow-200/10 to-transparent ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
                <div className={`absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-orange-300/15 via-orange-200/8 to-transparent ${prefersReducedMotion ? "" : "animate-pulse animation-delay-2000"}`}></div>
              </div>
              
              {/* Subtle grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_1px_1px,rgb(251,191,36)_1px,transparent_0)] bg-[length:32px_32px]"></div>
            </div>

            <div className="container-mobile py-6 sm:py-8 lg:py-16 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] items-center relative z-10">
              {/* Hero Content */}
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 shadow-sm"
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>4.9/5 Rating • 1000+ Happy Customers</span>
                </motion.div>

                <motion.h1
                  {...fadeUp}
                  className="font-heading text-2xl sm:text-3xl lg:text-6xl font-black tracking-tight text-foreground text-balance leading-[1.1] relative group"
                >
                  <span className="relative">
                    {language === 'sq' ? (
                      <>
                        <span className="block">Qira Makine në</span>
                        <span className="block bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                          Tiranë
                        </span>
                        <span className="block text-sm sm:text-lg lg:text-4xl font-semibold text-muted-foreground mt-1 sm:mt-2">
                          Marrje në Aeroport & Dorëzim në Qendër
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="block">Rent a Car in</span>
                        <span className="block bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                          Tirana
                        </span>
                        <span className="block text-sm sm:text-lg lg:text-4xl font-semibold text-muted-foreground mt-1 sm:mt-2">
                          Airport Pickup & City Delivery
                        </span>
                      </>
                    )}
                  </span>
                </motion.h1>

                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 }}
                  className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed"
                >
                  {language === 'sq'
                    ? 'Shërbim premium i qirasë së makinave në Tiranë dhe në të gjithë Shqipërinë. Automjete të siguruara plotësisht, marrje në aeroport dhe çmime transparente për aventurën tuaj të përsosur shqiptare.'
                    : 'Premium car rental service in Tirana and across Albania. Fully insured vehicles, airport pickup, and transparent pricing for your perfect Albanian adventure.'
                  }
                </motion.p>

                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.15 }}
                  className="text-xs sm:text-sm text-muted-foreground max-w-2xl"
                >
                  {language === 'sq' ? (
                    <>
                      Shiko ofertat tona: <Link to="/makina-me-qira-tirane" className="text-yellow-600 hover:text-yellow-700 underline">Qira Makine në Tiranë</Link> dhe <Link to="/qira-makine-rinas" className="text-yellow-600 hover:text-yellow-700 underline">Qira Makine në Rinas</Link>
                    </>
                  ) : (
                    <>
                      View our offers: <Link to="/rent-a-car-tirana" className="text-yellow-600 hover:text-yellow-700 underline">Rent a Car in Tirana</Link> and <Link to="/rent-a-car-tirana-airport" className="text-yellow-600 hover:text-yellow-700 underline">Rent a Car at Tirana Airport</Link>
                    </>
                  )}
                </motion.p>

                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.2 }}
                  className="flex justify-start"
                >
                  <Button asChild
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-5 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Link to="/cars">
                      <span className="flex items-center">
                        Find Your Car
                        <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-5 sm:w-5" />
                      </span>
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.3 }}
                  className="flex flex-wrap gap-2 sm:gap-3 items-center text-xs sm:text-sm text-muted-foreground pt-3 sm:pt-4"
                  aria-label="Trust signals"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-sm border">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 fill-current" />
                    <span className="text-xs sm:text-sm">4.9/5 rating</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-sm border">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                    <span className="text-xs sm:text-sm">1000+ customers</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-sm border">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                    <span className="text-xs sm:text-sm">Fully insured</span>
                  </div>
                </motion.div>
              </div>

              {/* Featured Car Card */}
              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
                <Card className="p-0 shadow-xl border rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 group">
                  <div className="flex flex-col">
                    <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <img
                        src="/images/cars/e class1.jpeg"
                        alt={language === 'sq' ? 'Mercedes-Benz E-Class për qira në Tiranë' : 'Mercedes-Benz E-Class available for rent in Tirana'}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="eager"
                        fetchPriority="high"
                        width="1600"
                        height="1200"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-gray-900 shadow-sm">
                        Available Now
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-yellow-700 font-semibold mb-1">Premium Selection</p>
                        <h3 className="font-heading text-lg sm:text-2xl font-bold text-card-foreground">Mercedes-Benz E-Class</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">Executive • Automatic • Premium</p>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-2xl sm:text-3xl font-black text-yellow-600">€85</span>
                        <span className="text-sm sm:text-base text-muted-foreground">/ day</span>
                      </div>

                      <div className="flex gap-2 sm:gap-3">
                        <Button asChild className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm sm:text-base py-2 sm:py-3">
                          <Link to="/cars">Book Now</Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1 border-yellow-500 text-yellow-600 hover:bg-yellow-50 text-sm sm:text-base py-2 sm:py-3">
                          <Link to="/cars">View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section id="why-us" className="py-16 lg:py-24 bg-white relative" aria-labelledby="why-us-title">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for features section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
              <div className={`absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent ${prefersReducedMotion ? "" : "animate-pulse animation-delay-1000"}`}></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
          <section id="destinations" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative" aria-labelledby="destinations-title">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
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
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
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
                        className="block w-full h-full cursor-pointer"
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
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
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
                            <h3 className="font-heading text-sm lg:text-lg font-bold text-card-foreground mb-1 lg:mb-2 line-clamp-2">{destination.name}</h3>
                            <p className="text-muted-foreground text-xs lg:text-sm text-pretty line-clamp-3">{destination.description}</p>
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
          <section id="testimonials" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative" aria-labelledby="testimonials-title">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30"></div>
            
            {/* Light rays for testimonials */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute top-1/3 left-1/4 w-px h-1/3 bg-gradient-to-b from-yellow-300/15 via-yellow-200/10 to-transparent ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
              <div className={`absolute bottom-1/3 right-1/4 w-px h-1/3 bg-gradient-to-b from-orange-300/10 via-orange-200/8 to-transparent ${prefersReducedMotion ? "" : "animate-pulse animation-delay-2000"}`}></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
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
                className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
                    rating: 5,
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
                    rating: 5,
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
                  }
                ].map((testimonial, i) => (
                  <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}>
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
          <section id="faq" className="py-16 lg:py-24 bg-white relative" aria-labelledby="faq-title">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for FAQ section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
              <div className={`absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent ${prefersReducedMotion ? "" : "animate-pulse animation-delay-1000"}`}></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
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
                              <AccordionTrigger className="px-8 py-6 text-left hover:text-yellow-600 transition-colors font-semibold text-lg group-hover:bg-yellow-50/50 rounded-t-2xl">
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

          {/* CTA */}
          <section className="py-16 lg:py-24 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

            {/* Light rays for CTA */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-white/30 via-white/20 to-transparent ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
              <div className={`absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-white/25 via-white/15 to-transparent ${prefersReducedMotion ? "" : "animate-pulse animation-delay-1000"}`}></div>
            </div>

            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center space-y-8">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-balance">
                  Ready to Explore Albania?
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto text-pretty">
                  Book your premium rental car today and discover the beauty of Albania with complete confidence and
                  comfort.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild
                    size="lg"
                    className="bg-white text-yellow-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                  >
                    <Link to="/cars">
                      <span className="flex items-center relative z-10">
                        Book Your Car Now
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
                      <Phone className={`h-4 w-4 ${prefersReducedMotion ? "" : "group-hover:animate-pulse"}`} />
                      <span>+355-4-123-4567</span>
                    </button>
                    <button 
                      onClick={() => handleContactClick('email')}
                      className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
                    >
                      <Mail className={`h-4 w-4 ${prefersReducedMotion ? "" : "group-hover:animate-pulse"}`} />
                      <span>info@memarental.com</span>
                    </button>
                  </div>
                </div>

                {/* NAP Block */}
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.4 }}
                  className="mt-8 text-center text-white/90"
                >
                  <p className="text-sm">
                    {language === 'sq' ? (
                      <>
                        <strong>MEMA Rental</strong> • Rruga Myslym Shyri, Nr. 23, Tiranë 1001, Shqipëri • 
                        <a href="tel:+355-4-123-4567" className="hover:text-white underline">+355-4-123-4567</a> • 
                        <a href="mailto:info@memarental.com" className="hover:text-white underline">info@memarental.com</a>
                      </>
                    ) : (
                      <>
                        <strong>MEMA Rental</strong> • Rruga Myslym Shyri, Nr. 23, Tirana 1001, Albania • 
                        <a href="tel:+355-4-123-4567" className="hover:text-white underline">+355-4-123-4567</a> • 
                        <a href="mailto:info@memarental.com" className="hover:text-white underline">info@memarental.com</a>
                      </>
                    )}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>

      </div>
    </>
  )
}

export default HomePage



"use client"

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, Zap, Heart, Navigation, CreditCard, Phone, Mail, MapPin, Calendar, CheckCircle, ArrowRight, Play, Sparkles, Star, Users, Award } from "lucide-react"
import { useLanguage } from '../../contexts/LanguageContext';
import Seo from '../../components/Seo';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../../seo/structuredData';
import localSeo from '../../seo/local_seo.json';
import EnhancedCTA from '../../components/EnhancedCTA';

const RentACarTirana = () => {
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
    { name: 'Rent a Car in Tirana', url: '/rent-a-car-tirana' }
  ];

  const benefits = [
    { icon: Shield, title: language === 'sq' ? "Flotë Moderne" : "Modern Fleet", description: language === 'sq' ? "Automjete të modeleve të fundit me sigurim të plotë dhe mirëmbajtje të rregullt." : "Latest model vehicles with comprehensive insurance and regular maintenance.", color: "from-blue-500 to-blue-600" },
    { icon: Navigation, title: language === 'sq' ? "Marrje në Aeroport" : "Airport Pickup", description: language === 'sq' ? "Marrje dhe dorëzim falas në Aeroportin Ndërkombëtar të Tiranës (TIA/Rinas)." : "Free pickup and delivery at Tirana International Airport (TIA/Rinas).", color: "from-green-500 to-green-600" },
    { icon: Clock, title: language === 'sq' ? "Mbështetje 24/7" : "24/7 Support", description: language === 'sq' ? "Asistencë e klientit dhe mbështetje teknike gjatë gjithë kohës." : "Round-the-clock customer assistance and technical support.", color: "from-yellow-500 to-yellow-600" },
    { icon: Heart, title: language === 'sq' ? "Çmime Konkurruese" : "Competitive Rates", description: language === 'sq' ? "Çmimet më të mira në treg me pa pagesa të fshehura." : "Best rates in the market with no hidden fees.", color: "from-red-500 to-red-600" },
    { icon: Zap, title: language === 'sq' ? "Rezervim i Shpejtë" : "Quick Booking", description: language === 'sq' ? "Rezervoni makinën tuaj në më pak se 2 minuta." : "Book your car in under 2 minutes.", color: "from-purple-500 to-purple-600" },
    { icon: CreditCard, title: language === 'sq' ? "Pagesa Fleksibël" : "Flexible Payment", description: language === 'sq' ? "Opsione të shumëfishta pagese të disponueshme." : "Multiple payment options available.", color: "from-indigo-500 to-indigo-600" },
  ];

  const faqs = [
    {
      question: "What do I need to rent a car in Tirana?",
      answer: "You need a valid driver's license (minimum 1 year), passport or ID card, credit card for deposit, and minimum age of 21 years. International driving permit is recommended."
    },
    {
      question: "Do you offer airport pickup in Tirana?",
      answer: "Yes, we provide free airport pickup and delivery service at Tirana International Airport (TIA/Rinas) for your convenience."
    },
    {
      question: "What insurance coverage is included?",
      answer: "All our rentals include comprehensive insurance coverage. Additional coverage options are available for extra protection during your trip."
    },
    {
      question: "Can I rent a car for just one day?",
      answer: "Yes, we offer flexible rental periods from 1 day to long-term rentals. Contact us for special rates on extended rentals."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, debit cards, cash, and bank transfers. A credit card is required for the security deposit."
    }
  ];

  const faqsSq = [
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
        title={language === 'sq' ? 'Qera Makinash në Tiranë - Makina me Qera në Tiranë, Shqipëri' : 'Rent a Car in Tirana - Car Rental Service in Tirana, Albania'}
        description={language === 'sq' 
          ? 'Qera makinash në Tiranë, Shqipëri. Shërbim i shkëlqyer qeraje makinash me çmime konkurruese. Marrje në aeroport, sigurim i plotë dhe mbështetje 24/7. Rezervoni sot!'
          : 'Best car rental service in Tirana, Albania. Competitive rates, airport pickup, comprehensive insurance, and 24/7 support. Book your car rental in Tirana today!'
        }
        path="/rent-a-car-tirana"
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
                <Sparkles className="h-4 w-4 relative z-10 animate-pulse" />
                <span className="relative z-10">Tirana • Car Rental</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.div>

              <motion.h1
                {...fadeUp}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground text-balance leading-tight relative mb-6"
              >
                <span className="relative">
                  {language === 'sq' ? 'Qera Makinash në Tiranë' : 'Rent a Car in Tirana'}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed mb-8"
              >
                {language === 'sq' 
                  ? 'Shërbimi më i mirë i qerasë së makinave në Tiranë, Shqipëri. Çmime konkurruese, flotë moderne dhe mbështetje 24/7.'
                  : 'The best car rental service in Tirana, Albania. Competitive rates, modern fleet, and 24/7 support.'
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
                    {language === 'sq' 
                      ? 'Pse të Zgjidhni MEMA Rental për Qera Makinash në Tiranë?'
                      : 'Why Choose MEMA Rental for Car Rental in Tirana?'
                    }
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  {language === 'sq'
                    ? 'Përvoja premium e qerasë së makinave me çmime transparente, sigurim gjithëpërfshirës dhe mbështetje të jashtëzakonshme të klientit.'
                    : 'Experience premium car rental service with transparent pricing, comprehensive insurance, and exceptional customer support.'
                  }
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
                    <Card className="p-6 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative h-full">
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

          {/* Services Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  {language === 'sq' ? 'Shërbimet Tona' : 'Our Services'}
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  {language === 'sq'
                    ? 'Shërbime të plota dhe profesionale për të gjitha nevojat tuaja të qerasë së makinave.'
                    : 'Complete and professional services for all your car rental needs.'
                  }
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {localSeo.services.map((service, index) => (
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
                        <h3 className="text-lg font-semibold mb-3 text-card-foreground">{service}</h3>
                        <p className="text-muted-foreground text-pretty">
                          {language === 'sq' 
                            ? 'Shërbim profesional dhe i besueshëm për të gjitha nevojat tuaja të qerasë.'
                            : 'Professional and reliable service for all your rental needs.'
                          }
                        </p>
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
                  {language === 'sq' ? 'Pyetje të Bëra Shpesh' : 'Frequently Asked Questions'}
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  {language === 'sq'
                    ? 'Gjeni përgjigjet për pyetjet më të zakonshme rreth qerasë së makinave në Tiranë.'
                    : 'Find answers to the most common questions about car rental in Tirana.'
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

          {/* Enhanced CTA */}
          <EnhancedCTA 
            title={language === 'sq' ? 'Gati për të Eksploruar Shqipërinë?' : 'Ready to Explore Albania?'}
            subtitle={language === 'sq' 
              ? 'Rezervoni sot makinën tuaj me qera në Tiranë dhe nisni aventurën shqiptare.'
              : 'Book your car rental in Tirana today and start your Albanian adventure.'
            }
            secondaryButton={{
              text: language === 'sq' ? 'Rezervoni Tani' : 'Book Now',
              link: "/cars",
              icon: Calendar
            }}
          />
        </main>
      </div>
    </>
  );
};

export default RentACarTirana;

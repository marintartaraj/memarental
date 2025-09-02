"use client"

import React from "react"
import Seo from "@/components/Seo"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Users, Award, Shield, Clock, MapPin, Phone, Mail, Star, Heart, Zap, Car, CheckCircle, Globe, Target, TrendingUp, Sparkles, ArrowRight } from "lucide-react"
import HeroHeader from "@/components/HeroHeader"

const AboutPage = () => {
  const { t } = useLanguage()
  const prefersReducedMotion = useReducedMotion()

  // Respect prefers-reduced-motion to avoid motion sickness
  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" },
    viewport: { once: true, amount: 0.3 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // Fixed class mapping to avoid dynamic Tailwind classes (better for SEO and CSS purge)
  const colorStyles = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-200" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
  }

  const stats = [
    { icon: Car, label: t("statsVehicles") || "Vehicles", value: "50+", color: "blue", description: "Modern fleet" },
    { icon: Users, label: t("statsHappyCustomers") || "Happy Customers", value: "1000+", color: "green", description: "Satisfied clients" },
    { icon: Star, label: t("statsRating") || "Rating", value: "4.9", color: "yellow", description: "Out of 5 stars" },
    { icon: Award, label: t("statsYears") || "Years", value: "10+", color: "purple", description: "Of experience" },
  ]

  const localBenefits = [
    { icon: Shield, title: t("fullyInsured") || "Fully Insured", description: t("benefitFullyInsuredDesc") || "Complete coverage for peace of mind" },
    { icon: Clock, title: t("support247") || "24/7 Support", description: t("support247Desc") || "Round-the-clock assistance" },
    { icon: Zap, title: t("benefitQuickBookingTitle") || "Quick Booking", description: t("benefitQuickBookingDesc") || "Instant reservation process" },
    { icon: Heart, title: t("benefitBestRatesTitle") || "Best Rates", description: t("benefitBestRatesDesc") || "Competitive pricing guaranteed" },
  ]

  const values = [
    { icon: Target, title: "Excellence", description: "We strive for excellence in every aspect of our service" },
    { icon: Heart, title: "Customer First", description: "Your satisfaction is our top priority" },
    { icon: Shield, title: "Reliability", description: "Trustworthy service you can count on" },
    { icon: Globe, title: "Local Expertise", description: "Deep knowledge of Albania and local roads" },
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MEMA Rental - Car Rental Tirana Albania",
    alternateName: "MEMA Car Rental",
    description:
      "Premium car rental service in Tirana, Albania. Providing reliable transportation solutions since 2014. Best car rental in Tirana with competitive rates.",
    url: "https://memarental.com",
    logo: "https://memarental.com/logo.jpg",
    foundingDate: "2014",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rruga e Durresit 123",
      addressLocality: "Tirana",
      addressRegion: "Tirana",
      postalCode: "1001",
      addressCountry: "AL",
    },
    geo: { "@type": "GeoCoordinates", latitude: "41.3275", longitude: "19.8187" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+355-4-123-4567",
      contactType: "customer service",
      email: "info@memarental.com",
      availableLanguage: "English, Albanian",
    },
    openingHours: ["Mo-Su 08:00-20:00"],
    priceRange: "€€",
    areaServed: { "@type": "Country", name: "Albania" },
    serviceArea: { "@type": "Place", name: "Tirana, Albania" },
    sameAs: ["https://facebook.com/memarental", "https://instagram.com/memarental"],
  }

  return (
    <>
      <Seo
        title={t("seoAboutTitle") || "About MEMA Rental - Premium Car Rental in Tirana, Albania"}
        description={t("seoAboutDescription") || "Discover MEMA Rental's story - 10+ years of excellence in car rental services in Tirana, Albania. Trusted by 1000+ customers with 4.9/5 rating."}
        path="/about"
        image="https://memarental.com/about-image.jpg"
        keywords="about MEMA rental, car rental company Tirana, car rental history Albania, MEMA rental story, car rental service Tirana, trusted car rental Albania, car rental company history, MEMA rental about us, car rental service about, Tirana car rental company, Albania car rental about"
        schema={structuredData}
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
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 sm:py-20 lg:py-28">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-yellow-200 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/50 to-orange-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Sparkles className="h-4 w-4 relative z-10 animate-pulse" />
                  <span className="relative z-10">10+ Years of Excellence • 1000+ Happy Customers</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.div>

                <motion.h1
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 }}
                  className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground text-balance leading-tight"
                >
                  <span className="relative">
                    Our Story of
                    <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Excellence</span>
                  </span>
                </motion.h1>

                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.2 }}
                  className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed"
                >
                  Since 2014, MEMA Rental has been the trusted choice for premium car rental services in Tirana and across Albania. 
                  We've built our reputation on reliability, quality, and exceptional customer service.
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 lg:py-24 bg-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for stats section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance relative">
                  <span className="relative">
                    Trusted by Thousands
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Our numbers speak for themselves - we've earned the trust of customers through consistent quality and service.
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative h-full">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="text-center relative z-10 space-y-4">
                        <div className={`inline-block p-4 bg-gradient-to-br ${colorStyles[stat.color].bg} ${colorStyles[stat.color].text} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden`}>
                          <stat.icon className="h-7 w-7 relative z-10" aria-hidden="true" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <div className="font-heading text-3xl font-black text-foreground group-hover:animate-pulse">{stat.value}</div>
                        <h3 className="font-heading text-lg font-bold text-card-foreground">{stat.label}</h3>
                        <p className="text-muted-foreground text-sm">{stat.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Our Journey
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  From humble beginnings to becoming Albania's most trusted car rental service
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                <motion.div variants={fadeUp} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-heading text-2xl font-bold text-foreground">How It All Started</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Founded in 2014, MEMA Rental began with a simple mission: to provide reliable, affordable, and 
                      high-quality car rental services to visitors and locals in Tirana, Albania.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      What started as a small fleet of 5 vehicles has grown into a comprehensive service with over 50 
                      modern cars, serving thousands of satisfied customers every year.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-heading text-2xl font-bold text-foreground">Our Growth</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Over the years, we've expanded our services to include airport pickup, 24/7 support, and a 
                      diverse fleet ranging from economy cars to luxury vehicles.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Our commitment to customer satisfaction has earned us a 4.9/5 rating and the trust of travelers 
                      from around the world.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="relative">
                  <Card className="p-0 shadow-2xl border-0 bg-white/95 backdrop-blur rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-300 group relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        <img
                          src="/images/cars/c-class1.jpeg"
                          alt="MEMA Rental fleet - Premium cars in Tirana"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                        
                        {/* Light overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/10 via-transparent to-orange-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 lg:py-24 bg-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for values section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/3 left-1/4 w-px h-1/3 bg-gradient-to-b from-yellow-300/15 via-yellow-200/10 to-transparent animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-px h-1/3 bg-gradient-to-b from-orange-300/10 via-orange-200/8 to-transparent animate-pulse animation-delay-2000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Our Core Values
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  The principles that guide everything we do
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative h-full">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 space-y-4">
                        <div className="inline-block p-4 bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-700 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden">
                          <value.icon className="h-7 w-7 relative z-10" aria-hidden="true" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-card-foreground">{value.title}</h3>
                        <p className="text-muted-foreground text-pretty">{value.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30"></div>
            
            {/* Light rays for benefits section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/3 left-1/4 w-px h-1/3 bg-gradient-to-b from-yellow-300/15 via-yellow-200/10 to-transparent animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-px h-1/3 bg-gradient-to-b from-orange-300/10 via-orange-200/8 to-transparent animate-pulse animation-delay-2000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Why Choose MEMA Rental
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  We go above and beyond to ensure your car rental experience is exceptional
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {localBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden relative h-full">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/5 via-orange-400/5 to-yellow-400/5 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 text-center space-y-4">
                        <div className="inline-block p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden">
                          <benefit.icon className="h-7 w-7 text-white relative z-10" aria-hidden="true" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-card-foreground">{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm text-pretty">{benefit.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
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
                  Ready to Experience Excellence?
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto text-pretty">
                  Join thousands of satisfied customers who have chosen MEMA Rental for their Albanian adventure
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild
                    size="lg"
                    className="bg-white text-yellow-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                  >
                    <Link to="/cars">
                      <span className="flex items-center relative z-10">
                        Browse Our Fleet
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </Link>
                  </Button>
                  <Button asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-yellow-600 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                  >
                    <Link to="/contact">
                      <span className="flex items-center relative z-10">
                        Contact Us
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default AboutPage
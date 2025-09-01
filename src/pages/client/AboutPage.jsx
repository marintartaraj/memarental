import React from "react"
import Seo from "@/components/Seo"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Users, Award, Shield, Clock, MapPin, Phone, Mail, Star, Heart, Zap, Car, CheckCircle, Globe, Target, TrendingUp } from "lucide-react"
import HeroHeader from "@/components/HeroHeader"

const AboutPage = () => {
  const { t } = useLanguage()
  const prefersReducedMotion = useReducedMotion()

  // Respect prefers-reduced-motion to avoid motion sickness
  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" },
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
        keywords="about MEMA Rental, car rental company Tirana, car rental service Albania, MEMA Rental story, car rental history Albania, best car rental Tirana, car rental company Albania, Tirana car rental service, Albania car hire company"
        schema={structuredData}
      />

      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:m-4 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>

      <div className="min-h-screen">
        {/* Hero Section with Colored Background */}
        <HeroHeader
          title={t("aboutHeroTitle") || "Our Story"}
          subtitle={t("aboutHeroSubtitle") || "10+ years of excellence in car rental services across Albania"}
          gradientClassName="bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600"
        />

        <main id="main">
          {/* Stats Section with Enhanced Design */}
          <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div {...fadeUp} className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {t("aboutStatsTitle") || "Our Impact in Numbers"}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Trusted by thousands of customers across Albania
                </p>
              </motion.div>

              <motion.ul
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                aria-label={t("aboutStatsAria") || "Company statistics"}
              >
                {stats.map((stat, index) => {
                  const style = colorStyles[stat.color]
                  const Icon = stat.icon
                  return (
                    <li key={stat.label}>
                      <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.3 + index * 0.1 }}
                        whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                        className="group"
                      >
                        <Card className="p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-white/80 backdrop-blur-sm border border-gray-200/50">
                          <div className="text-center">
                            <div
                              className={`inline-flex p-4 ${style.bg} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 border ${style.border}`}
                            >
                              <Icon className={`h-8 w-8 ${style.text}`} aria-hidden="true" />
                            </div>
                            <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                            <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                            <div className="text-sm text-gray-500">{stat.description}</div>
                          </div>
                        </Card>
                      </motion.div>
                    </li>
                  )
                })}
              </motion.ul>
            </div>
          </section>

          {/* Story Section with Enhanced Layout */}
          <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
                    <Star className="h-4 w-4 mr-2" />
                    Since 2014
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {t("aboutStoryTitle") || "Our Journey"}
                  </h2>
                  <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                    <p>{t("aboutStoryP1") || "Founded in 2014, MEMA Rental began with a simple mission: to provide reliable, affordable, and high-quality car rental services in Tirana and across Albania."}</p>
                    <p>{t("aboutStoryP2") || "Over the past decade, we've grown from a small local business to one of Albania's most trusted car rental companies, serving thousands of satisfied customers."}</p>
                    <p>{t("aboutStoryP3") || "Today, we continue to innovate and expand our services while maintaining the personal touch and local expertise that our customers value most."}</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3">
                      <Link to="/cars">View Our Fleet</Link>
                    </Button>
                    <Button variant="outline" asChild className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 px-8 py-3">
                      <Link to="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10">
                    <img
                        src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                      width={960}
                      height={640}
                        alt="MEMA Rental office and team in Tirana, Albania - premium car rental service"
                      className="w-full h-80 sm:h-96 object-cover"
                      loading="lazy"
                      decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                  {/* Floating Stats Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">1000+</div>
                        <div className="text-sm text-gray-600">Happy Customers</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Values Section - New */}
          <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Our Values
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  The principles that guide everything we do
                </p>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {values.map((value, index) => {
                  const Icon = value.icon
                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <div className="inline-flex p-4 bg-yellow-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </section>

          {/* Why Choose MEMA Rental - Enhanced */}
          <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t("aboutWhyTitle") || "Why Choose MEMA Rental"}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {t("aboutWhyCopy") || "Experience the difference with our premium car rental services"}
                </p>
              </motion.div>

              <motion.ul
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                aria-label={t("aboutWhyAria") || "Why choose MEMA Rental"}
              >
                {localBenefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <li key={benefit.title}>
                      <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.3 + index * 0.1 }}
                        whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                        className="group"
                      >
                        <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                          <div className="text-center">
                            <div className="inline-flex p-4 bg-yellow-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                              <Icon className="h-8 w-8 text-yellow-600" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                          </div>
                        </Card>
                      </motion.div>
                    </li>
                  )
                })}
              </motion.ul>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-yellow-500 to-orange-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div {...fadeUp} className="text-center text-white">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  Ready to Experience Albania?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                  Book your car today and discover the beauty of Albania with MEMA Rental
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-yellow-700 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl"
                  >
                    <Link to="/cars">Book Now</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-yellow-700 text-lg px-8 py-4 bg-transparent"
                  >
                    <Link to="/contact">Contact Us</Link>
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

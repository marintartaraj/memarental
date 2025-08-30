"use client"
import Seo from "@/components/Seo"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Users, Award, Shield, Clock, Star, Heart, Zap, Car, CheckCircle, Globe, Target } from "lucide-react"
import HeroHeader from "@/components/HeroHeader"

const AboutPage = () => {
  const { t } = useLanguage()
  const prefersReducedMotion = useReducedMotion()

  // Respect prefers-reduced-motion to avoid motion sickness
  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" },
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
    {
      icon: Users,
      label: t("statsHappyCustomers") || "Happy Customers",
      value: "1000+",
      color: "green",
      description: "Satisfied clients",
    },
    { icon: Star, label: t("statsRating") || "Rating", value: "4.9", color: "yellow", description: "Out of 5 stars" },
    { icon: Award, label: t("statsYears") || "Years", value: "10+", color: "purple", description: "Of experience" },
  ]

  const localBenefits = [
    {
      icon: Shield,
      title: t("fullyInsured") || "Fully Insured",
      description: t("benefitFullyInsuredDesc") || "Complete coverage for peace of mind",
    },
    {
      icon: Clock,
      title: t("support247") || "24/7 Support",
      description: t("support247Desc") || "Round-the-clock assistance",
    },
    {
      icon: Zap,
      title: t("benefitQuickBookingTitle") || "Quick Booking",
      description: t("benefitQuickBookingDesc") || "Instant reservation process",
    },
    {
      icon: Heart,
      title: t("benefitBestRatesTitle") || "Best Rates",
      description: t("benefitBestRatesDesc") || "Competitive pricing guaranteed",
    },
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
        description={
          t("seoAboutDescription") ||
          "Discover MEMA Rental's story - 10+ years of excellence in car rental services in Tirana, Albania. Trusted by 1000+ customers with 4.9/5 rating."
        }
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

      <div className="min-h-screen pt-[env(safe-area-inset-top)]">
        {/* Hero Section with Colored Background */}
        <HeroHeader
          title={t("aboutHeroTitle") || "Our Story"}
          subtitle={t("aboutHeroSubtitle") || "10+ years of excellence serving Tirana and nearby areas"}
          gradientClassName="bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600"
        />

        <main id="main">
          <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-screen-sm mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 relative z-10">
              <motion.div {...fadeUp} className="text-center mb-8">
                <h2 className="text-[clamp(24px,6vw,32px)] font-semibold tracking-tight text-gray-900 mb-4 text-balance">
                  {t("aboutStatsTitle") || "Our Impact in Numbers"}
                </h2>
                <p className="text-[clamp(16px,3.8vw,18px)] leading-relaxed text-gray-600 text-balance">
                  Trusted by thousands of customers across Albania
                </p>
              </motion.div>

              <motion.ul
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                aria-label={t("aboutStatsAria") || "Company statistics"}
              >
                {stats.map((stat, index) => {
                  const style = colorStyles[stat.color]
                  const Icon = stat.icon
                  return (
                    <li key={stat.label}>
                      <motion.div
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.2 + index * 0.05 }}
                        whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.01 }}
                        className="group"
                      >
                        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm border border-gray-200/50 min-h-[120px] flex flex-col justify-center">
                          <div className="text-center">
                            <div
                              className={`inline-flex p-3 ${style.bg} rounded-xl mb-3 group-hover:scale-105 transition-transform duration-200 border ${style.border}`}
                            >
                              <Icon className={`h-6 w-6 ${style.text}`} aria-hidden="true" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm sm:text-base font-semibold text-gray-700 mb-1">{stat.label}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{stat.description}</div>
                          </div>
                        </Card>
                      </motion.div>
                    </li>
                  )
                })}
              </motion.ul>
            </div>
          </section>

          <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
            <div className="max-w-screen-sm mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-3 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
                    <Star className="h-4 w-4 mr-2" />
                    Since 2014
                  </div>
                  <h2 className="text-[clamp(24px,6vw,32px)] font-semibold tracking-tight text-gray-900 leading-tight text-balance">
                    {t("aboutStoryTitle") || "Our Journey"}
                  </h2>
                  <div className="space-y-4 text-[clamp(16px,3.8vw,18px)] leading-relaxed text-gray-700">
                    <p className="text-balance">
                      {t("aboutStoryP1") ||
                        "Founded in 2014, MEMA Rental began with a simple mission: to provide reliable, affordable, and high-quality car rental services in Tirana and across Albania."}
                    </p>

                    <h3 className="text-[clamp(18px,5vw,22px)] font-semibold text-gray-900 mt-6 mb-3">
                      Growing with Albania
                    </h3>
                    <p className="text-balance">
                      {t("aboutStoryP2") ||
                        "Over the past decade, we've grown from a small local business to one of Albania's most trusted car rental companies, serving thousands of satisfied customers."}
                    </p>

                    <h3 className="text-[clamp(18px,5vw,22px)] font-semibold text-gray-900 mt-6 mb-3">
                      Innovation & Excellence
                    </h3>
                    <p className="text-balance">
                      {t("aboutStoryP3") ||
                        "Today, we continue to innovate and expand our services while maintaining the personal touch and local expertise that our customers value most."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      asChild
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 min-h-[44px] text-base"
                    >
                      <Link to="/cars">View Our Fleet</Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 px-6 py-3 min-h-[44px] text-base bg-transparent"
                    >
                      <Link to="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
                <div className="relative order-first lg:order-last">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/10">
                    <div className="aspect-[16/9] relative">
                      <img
                        src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="MEMA Rental office and team in Tirana, Albania - premium car rental service"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">1000+</div>
                        <div className="text-xs text-gray-600">Happy Customers</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-12 sm:py-16 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
            <div className="max-w-screen-sm mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <motion.div {...fadeUp} className="text-center mb-8">
                <h2 className="text-[clamp(24px,6vw,32px)] font-semibold tracking-tight text-gray-900 mb-4 text-balance">
                  Our Values
                </h2>
                <p className="text-[clamp(16px,3.8vw,18px)] leading-relaxed text-gray-600 text-balance">
                  The principles that guide everything we do
                </p>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {values.map((value, index) => {
                  const Icon = value.icon
                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                      className="group"
                    >
                      <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm min-h-[160px] flex flex-col justify-center">
                        <div className="inline-flex p-3 bg-yellow-100 rounded-xl mb-4 group-hover:scale-105 transition-transform duration-200 mx-auto">
                          <Icon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed text-balance">{value.description}</p>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </section>

          <section className="py-12 sm:py-16 pb-[calc(3rem+env(safe-area-inset-bottom))] bg-gradient-to-r from-yellow-500 to-orange-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="max-w-screen-sm mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 relative z-10">
              <motion.div {...fadeUp} className="text-center text-white">
                <h2 className="text-[clamp(24px,6vw,32px)] font-semibold tracking-tight mb-4 text-balance">
                  Ready to Experience Albania?
                </h2>
                <p className="text-[clamp(16px,3.8vw,18px)] leading-relaxed text-white/90 mb-6 text-balance">
                  Book your car today and discover the beauty of Albania with MEMA Rental
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-yellow-700 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl min-h-[48px] w-full sm:w-auto"
                  >
                    <Link to="/cars">Book Now</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-yellow-700 text-lg px-8 py-4 bg-transparent min-h-[48px] w-full sm:w-auto"
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

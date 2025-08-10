"use client"

import React from "react"
import Seo from "@/components/Seo"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Users, Award, Shield, Clock, MapPin, Phone, Mail, Star, Heart, Zap, Car } from "lucide-react"
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
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
  }

  const stats = [
    { icon: Car, label: t("statsVehicles"), value: "50+", color: "blue" },
    { icon: Users, label: t("statsHappyCustomers"), value: "1000+", color: "green" },
    { icon: Star, label: t("statsRating"), value: "4.9", color: "yellow" },
    { icon: Award, label: t("statsYears"), value: "10+", color: "purple" },
  ]

  const localBenefits = [
    { icon: Shield, title: t("fullyInsured"), description: t("benefitFullyInsuredDesc") },
    { icon: Clock, title: t("support247"), description: t("support247Desc") },
    { icon: Zap, title: t("benefitQuickBookingTitle"), description: t("benefitQuickBookingDesc") },
    { icon: Heart, title: t("benefitBestRatesTitle"), description: t("benefitBestRatesDesc") },
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
        title={t("seoAboutTitle")}
        description={t("seoAboutDescription")}
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <HeroHeader title={t("aboutHeroTitle")} subtitle={t("aboutHeroSubtitle")} />

        {/* Stats Section */}
        <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="stats-title">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="stats-title" className="sr-only">
              {t("aboutStatsTitle") || "Our impact in numbers"}
            </h2>
            <motion.ul
              {...fadeUp}
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
                      transition={{ ...fadeUp.transition, delay: index * 0.08 }}
                      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                      className="group"
                    >
                      <Card className="p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                        <div className="text-center">
                          <div
                            className={`inline-flex p-3 ${style.bg} rounded-full mb-3 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className={`h-6 w-6 ${style.text}`} aria-hidden="true" />
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                      </Card>
                    </motion.div>
                  </li>
                )
              })}
            </motion.ul>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="story-title">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 id="story-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t("aboutStoryTitle")}
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{t("aboutStoryP1")}</p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{t("aboutStoryP2")}</p>
                <p className="text-lg text-gray-700 leading-relaxed">{t("aboutStoryP3")}</p>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43"
                    width={960}
                    height={640}
                    alt="MEMA Rental office and team in Tirana, Albania - premium car rental service"
                    className="w-full h-64 sm:h-80 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose MEMA Rental */}
        <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="why-title">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
              <h2 id="why-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {t("aboutWhyTitle")}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">{t("aboutWhyCopy")}</p>
            </motion.div>

            <motion.ul
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
              aria-label={t("aboutWhyAria") || "Why choose MEMA Rental"}
            >
              {localBenefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <li key={benefit.title}>
                    <motion.div
                      {...fadeUp}
                      transition={{ ...fadeUp.transition, delay: 0.3 + index * 0.08 }}
                      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                      className="group"
                    >
                      <Card className="p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                        <div className="text-center">
                          <div className="inline-flex p-3 bg-yellow-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                          <p className="mt-1.5 text-gray-600">{benefit.description}</p>
                        </div>
                      </Card>
                    </motion.div>
                  </li>
                )
              })}
            </motion.ul>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="contact-info-title">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
              <h2 id="contact-info-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {t("contactInfoTitle")}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">{t("contactInfoCopy")}</p>
            </motion.div>

            <motion.ul
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              aria-label={t("contactInfoAria") || "Ways to contact MEMA Rental"}
            >
              <li>
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.3 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                  className="group"
                >
                  <Card className="p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="text-center">
                      <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("contactLocation")}</h3>
                      <p className="text-gray-700">Rruga e Durresit 123, Tirana, Albania</p>
                      <p className="text-sm text-gray-500 mt-2">{t("contactCityCenter")}</p>
                    </div>
                  </Card>
                </motion.div>
              </li>

              <li>
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.4 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                  className="group"
                >
                  <Card className="p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="text-center">
                      <div className="inline-flex p-3 bg-green-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Phone className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("contactPhone")}</h3>
                      <p className="text-gray-700">+355 4 123 4567</p>
                      <p className="text-sm text-gray-500 mt-2">{t("contactSupport")}</p>
                    </div>
                  </Card>
                </motion.div>
              </li>

              <li>
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.5 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                  className="group"
                >
                  <Card className="p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="text-center">
                      <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Mail className="h-6 w-6 text-purple-600" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("contactEmail")}</h3>
                      <p className="text-gray-700">info@memarental.com</p>
                      <p className="text-sm text-gray-500 mt-2">{t("contactQuickResponse")}</p>
                    </div>
                  </Card>
                </motion.div>
              </li>
            </motion.ul>
          </div>
        </section>

        {/* Simple Contact Text */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="simple-contact-title">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center">
              <h2 id="simple-contact-title" className="sr-only">
                {t("simpleContactTitle") || "Contact MEMA Rental"}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700">
                {t("wantToGetInTouch")}{" "}
                <Link to="/contact" className="text-yellow-700 underline font-semibold hover:text-yellow-800">
                  {t("contactUsHere")}
                </Link>
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-yellow-500 to-orange-600"
        aria-labelledby="cta-title"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center">
            <h2 id="cta-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t("homeCtaTitle")}
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">{t("homeCtaCopy")}</p>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-yellow-700 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl"
              >
                <Link to="/cars">{t("bookNow")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-yellow-700 text-lg px-8 py-4 bg-transparent"
              >
                <Link to="/contact">{t("getInTouch")}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default AboutPage

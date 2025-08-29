"use client"

import React from "react"
import Seo from "@/components/Seo"
import { useLanguage } from "@/contexts/LanguageContext"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Car, Star, Users, Award, Shield, Clock, Zap, Heart, Navigation, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import WhatsAppButton from "@/components/WhatsAppButton"

const HomePage = () => {
  const { t } = useLanguage()
  const prefersReducedMotion = useReducedMotion()

  // Animations (respect prefers-reduced-motion)
  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" },
  }

  // Content
  const destinations = [
    { name: t("destTiranaCenterName"), emoji: "🏙️", description: t("destTiranaCenterDesc") },
    { name: t("destDurresBeachName"), emoji: "🏖️", description: t("destDurresBeachDesc") },
    { name: t("destAlbanianAlpsName"), emoji: "⛰️", description: t("destAlbanianAlpsDesc") },
    { name: t("destHistoricalSitesName"), emoji: "🏛️", description: t("destHistoricalSitesDesc") },
  ]

  const benefits = [
    { icon: Shield, title: t("fullyInsured"), description: t("benefitFullyInsuredDesc") },
    { icon: Clock, title: t("support247"), description: t("support247Desc") },
    { icon: Zap, title: t("benefitQuickBookingTitle"), description: t("benefitQuickBookingDesc") },
    { icon: Heart, title: t("benefitBestRatesTitle"), description: t("benefitBestRatesDesc") },
    { icon: Navigation, title: t("benefitFreeGpsTitle"), description: t("benefitFreeGpsDesc") },
    { icon: CreditCard, title: t("benefitFlexiblePaymentTitle"), description: t("benefitFlexiblePaymentDesc") },
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    name: "MEMA Rental - Car Rental Tirana Albania",
    alternateName: "MEMA Car Rental",
    description:
      "Premium car rental service in Tirana, Albania. Rent cars, SUVs, and luxury vehicles for your Albanian adventure. Best car rental in Tirana with competitive rates.",
    url: "https://memarental.com",
    telephone: "+355-4-123-4567",
    email: "info@memarental.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rruga e Durresit 123",
      addressLocality: "Tirana",
      addressRegion: "Tirana",
      postalCode: "1001",
      addressCountry: "AL",
    },
    geo: { "@type": "GeoCoordinates", latitude: "41.3275", longitude: "19.8187" },
    openingHours: ["Mo-Su 08:00-20:00"],
    priceRange: "€€",
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "127" },
    areaServed: { "@type": "Country", name: "Albania" },
    serviceArea: { "@type": "Place", name: "Tirana, Albania" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Car Rental Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Economy Car Rental Tirana" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "SUV Rental Albania" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Luxury Car Rental Tirana" } },
      ],
    },
    sameAs: ["https://facebook.com/memarental", "https://instagram.com/memarental"],
  }

  return (
    <>
      <Seo
        title={t("seoHomeTitle")}
        description={t("seoHomeDescription")}
        path="/"
        image="https://memarental.com/hero-image.jpg"
        keywords="car rental Tirana, car rental Albania, rent car Tirana, car hire Albania, Tirana car rental, Albania car rental, luxury car rental Tirana, economy car rental Albania, SUV rental Tirana, car rental service Albania, Tirana airport car rental, Albania car hire service, car rental Tirana city center, best car rental Tirana, cheap car rental Albania, car rental near me Tirana"
        schema={structuredData}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:m-4 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <main id="main">
          {/* Hero */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container-mobile py-16 sm:py-20 lg:py-28 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div>
                <motion.h1
                  {...fadeUp}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900"
                >
                  {t("heroTitle")}
                </motion.h1>
                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.08 }}
                  className="mt-4 text-lg sm:text-xl text-gray-700 max-w-2xl"
                >
                  {t("heroSubtitle")}
                </motion.p>

                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.16 }}
                  className="mt-8 flex flex-col sm:flex-row gap-3"
                >
                  <Button asChild size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white min-h-[44px]">
                    <Link to="/cars">{t("bookNow")}</Link>
                  </Button>
                </motion.div>

                {/* Trust signals */}
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.24 }}
                  className="mt-8 flex flex-wrap gap-6 items-center text-sm text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" aria-hidden="true" />
                    <span>4.9/5 average rating from 127 reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-yellow-600" aria-hidden="true" />
                    <span>Trusted by travelers across Albania</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-600" aria-hidden="true" />
                    <span>Fully insured, transparent pricing</span>
                  </div>
                </motion.div>

                {/* SEO-friendly internal links */}
                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.3 }}
                  className="mt-6 text-sm text-gray-600"
                >
                  Popular:{" "}
                  <Link className="underline underline-offset-2 hover:text-gray-900" to="/cars?type=economy">
                    Economy car rental in Tirana
                  </Link>{" "}
                  ·{" "}
                  <Link className="underline underline-offset-2 hover:text-gray-900" to="/cars?type=suv">
                    SUV rental in Albania
                  </Link>{" "}
                  ·{" "}
                  <Link className="underline underline-offset-2 hover:text-gray-900" to="/cars?type=luxury">
                    Luxury car hire in Tirana
                  </Link>
                </motion.p>
              </div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.12 }}
                className="relative"
              >
                <Card className="p-0 shadow-xl border-0 bg-white/90 backdrop-blur rounded-2xl overflow-hidden">
                  <div className="flex flex-col">
                    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-gray-100">
                      <img
                        src="/images/cars/e class1.jpeg"
                        alt="Mercedes-Benz E-Class available for rent in Tirana, Albania"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                        onError={(e) => { e.currentTarget.src = "/images/cars/placeholder-car.jpg"; }}
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                    <div className="p-6 sm:p-8 lg:p-10 flex flex-col gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-yellow-700 font-semibold mb-1">Featured</p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Mercedes‑Benz E‑Class</h3>
                        <p className="text-sm text-gray-600">Executive comfort • Automatic • Diesel • Premium</p>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold text-yellow-700">€85</span>
                        <span className="text-sm text-gray-600">/ {t("perDay")}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white min-h-[44px]">
                          <Link to="/cars">{t("bookNow")}</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="min-h-[44px]">
                          <Link to="/cars">See all cars</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Features */}
          <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="why-us-title">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
                <h2 id="why-us-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  {t("homeWhyTitle")}
                </h2>
                <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">{t("homeWhyCopy")}</p>
              </motion.div>

              <ul className="grid-mobile">
                {benefits.map((benefit, index) => (
                  <li key={benefit.title}>
                    <motion.div
                      {...fadeUp}
                      transition={{ ...fadeUp.transition, delay: 0.12 + index * 0.06 }}
                      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                      className="group"
                    >
                      <Card className="p-6 hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                        <div className="text-center">
                          <div className="inline-block p-3 bg-yellow-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                            <benefit.icon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                          <p className="mt-1.5 text-gray-600">{benefit.description}</p>
                        </div>
                      </Card>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Popular Destinations */}
          <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="destinations-title">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
                <h2 id="destinations-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  {t("homeDestinationsTitle")}
                </h2>
                <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">{t("homeDestinationsCopy")}</p>
              </motion.div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {destinations.map((destination, index) => (
                  <li key={destination.name}>
                    <motion.div
                      {...fadeUp}
                      transition={{ ...fadeUp.transition, delay: 0.12 + index * 0.06 }}
                      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                      className="group"
                    >
                      <Card className="p-6 hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                        <div className="text-center">
                          <div className="text-4xl mb-3" aria-hidden="true">
                            {destination.emoji}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{destination.name}</h3>
                          <p className="mt-1.5 text-gray-600">{destination.description}</p>
                        </div>
                      </Card>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-12 sm:py-16 lg:py-20 bg-gray-50" aria-labelledby="testimonials-title">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-10">
                <h2 id="testimonials-title" className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Trusted by Travelers Worldwide
                </h2>
                <p className="mt-3 text-gray-700">
                  See what our customers say about their car rental experience in Albania
                </p>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Maria K.",
                    location: "Italy",
                    rating: 5,
                    text: "Perfect experience! Picked up at Tirana Airport, car was spotless and fuel-efficient. Drove to Durres and the Albanian Riviera without any issues. Staff was incredibly helpful with local tips.",
                    date: "2 weeks ago"
                  },
                  {
                    name: "Ahmed S.",
                    location: "Germany",
                    rating: 5,
                    text: "Excellent service from start to finish. The SUV was perfect for our family trip to the mountains. GPS included, full insurance, and transparent pricing. Will definitely rent again!",
                    date: "1 month ago"
                  },
                  {
                    name: "Sarah L.",
                    location: "UK",
                    rating: 5,
                    text: "Amazing experience exploring Albania with MEMA Rental. The car was reliable, staff spoke perfect English, and the pickup/drop-off at the airport was seamless. Highly recommend!",
                    date: "3 weeks ago"
                  },
                  {
                    name: "Nikolai P.",
                    location: "Russia",
                    rating: 5,
                    text: "Great value for money! Rented a luxury car for our business trip. Professional service, clean vehicle, and excellent customer support. Made our stay in Tirana much more convenient.",
                    date: "1 week ago"
                  },
                  {
                    name: "Elena M.",
                    location: "Greece",
                    rating: 5,
                    text: "Perfect for our road trip through Albania! The car was in excellent condition, fuel-efficient, and the staff provided great recommendations for our journey. Very satisfied!",
                    date: "2 months ago"
                  },
                  {
                    name: "David R.",
                    location: "USA",
                    rating: 5,
                    text: "Outstanding service! Rented for 10 days to explore the country. Car was reliable, GPS worked perfectly, and the team was always available for support. Best car rental experience!",
                    date: "1 month ago"
                  }
                ].map((testimonial, i) => (
                  <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 + i * 0.06 }}>
                    <Card className="p-4 sm:p-6 h-full">
                      <div className="flex items-center gap-2 text-yellow-600 mb-3" aria-hidden="true">
                        {Array.from({ length: testimonial.rating }, (_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 mb-4 italic">
                        "{testimonial.text}"
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-xs text-gray-500">{testimonial.location}</p>
                        </div>
                        <p className="text-xs text-gray-400">{testimonial.date}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="faq-title">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-10">
                <h2 id="faq-title" className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="mt-3 text-gray-700">
                  Everything you need to know about renting a car in Albania
                </p>
              </motion.div>

              <div className="mx-auto max-w-3xl">
                <Accordion type="single" collapsible>
                  <AccordionItem value="q1">
                    <AccordionTrigger>
                      What documents do I need to rent a car?
                    </AccordionTrigger>
                    <AccordionContent>
                      You'll need a valid driver's license (international license recommended for non-EU citizens), passport or national ID, and a credit or debit card for the security deposit. The driver must be at least 21 years old with at least 2 years of driving experience.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q2">
                    <AccordionTrigger>
                      Can I pick up at Tirana Airport?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes! We offer convenient pickup and drop-off at Tirana International Airport (TIA). Our staff will meet you at the arrivals hall with your vehicle. Airport pickup is available 24/7, and we can also arrange delivery to your hotel or any location in Tirana.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q3">
                    <AccordionTrigger>Is insurance included?</AccordionTrigger>
                    <AccordionContent>
                      All our rentals include basic third-party liability insurance. We also offer comprehensive coverage options including collision damage waiver (CDW), theft protection, and roadside assistance. You can select your preferred coverage level during booking.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q4">
                    <AccordionTrigger>What is the fuel policy?</AccordionTrigger>
                    <AccordionContent>
                      Our fuel policy is "full-to-full" - you receive the car with a full tank and return it with a full tank. If you return the car with less fuel, we'll charge the difference at current market rates plus a small service fee.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q5">
                    <AccordionTrigger>Can I drive to other countries?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can drive to neighboring countries including Greece, North Macedonia, Montenegro, and Kosovo. Please inform us in advance about your travel plans, and we'll ensure you have the necessary documentation and insurance coverage for cross-border travel.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q6">
                    <AccordionTrigger>What happens if I have an accident or breakdown?</AccordionTrigger>
                    <AccordionContent>
                      We provide 24/7 roadside assistance. In case of an accident, contact us immediately at +355-4-123-4567. We'll guide you through the process and arrange for a replacement vehicle if needed. All our vehicles are fully insured and maintained to the highest standards.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q7">
                    <AccordionTrigger>How far in advance should I book?</AccordionTrigger>
                    <AccordionContent>
                      We recommend booking at least 1-2 weeks in advance, especially during peak season (June-September) and holidays. For airport pickup or specific vehicle types, booking 2-3 weeks ahead ensures availability. Last-minute bookings are possible but subject to availability.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q8">
                    <AccordionTrigger>What are your cancellation policies?</AccordionTrigger>
                    <AccordionContent>
                      Free cancellation up to 24 hours before pickup. Cancellations within 24 hours may incur a small fee. No-show or same-day cancellations are charged 50% of the rental fee. We understand emergencies happen, so please contact us as soon as possible if you need to modify your booking.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-yellow-500 to-orange-600">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center text-white">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{t("homeCtaTitle")}</h2>
                <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">{t("homeCtaCopy")}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-yellow-700 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl min-h-[44px]"
                  >
                    <Link to="/cars">{t("bookNow")}</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Mobile sticky CTA */}
        <div className="sticky-bottom-cta">
          <div className="mx-auto max-w-md rounded-xl shadow-lg ring-1 ring-black/5 bg-white p-3">
            <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-white min-h-[44px]">
              <Link to="/cars">{t("bookNow")}</Link>
            </Button>
          </div>
        </div>

        {/* WhatsApp Button */}
        <WhatsAppButton 
          phoneNumber="+355-4-123-4567"
          message="Hello! I'm interested in renting a car from MEMA Rental. Can you help me with availability and pricing?"
        />

      </div>
    </>
  )
}

export default HomePage

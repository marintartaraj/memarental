import React from 'react';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Car, Star, Users, Award, Shield, Clock, Zap, Heart, Navigation, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HomePage = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeOut' },
  };

  const destinations = [
    { name: t('destTiranaCenterName'), emoji: '🏙️', description: t('destTiranaCenterDesc') },
    { name: t('destDurresBeachName'), emoji: '🏖️', description: t('destDurresBeachDesc') },
    { name: t('destAlbanianAlpsName'), emoji: '⛰️', description: t('destAlbanianAlpsDesc') },
    { name: t('destHistoricalSitesName'), emoji: '🏛️', description: t('destHistoricalSitesDesc') },
  ];

  const benefits = [
    { icon: Shield, title: t('fullyInsured'), description: t('benefitFullyInsuredDesc') },
    { icon: Clock, title: t('support247'), description: t('support247Desc') },
    { icon: Zap, title: t('benefitQuickBookingTitle'), description: t('benefitQuickBookingDesc') },
    { icon: Heart, title: t('benefitBestRatesTitle'), description: t('benefitBestRatesDesc') },
    { icon: Navigation, title: t('benefitFreeGpsTitle'), description: t('benefitFreeGpsDesc') },
    { icon: CreditCard, title: t('benefitFlexiblePaymentTitle'), description: t('benefitFlexiblePaymentDesc') },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CarRental',
    name: 'MEMA Rental - Car Rental Tirana Albania',
    alternateName: 'MEMA Car Rental',
    description:
      'Premium car rental service in Tirana, Albania. Rent cars, SUVs, and luxury vehicles for your Albanian adventure. Best car rental in Tirana with competitive rates.',
    url: 'https://memarental.com',
    telephone: '+355-4-123-4567',
    email: 'info@memarental.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rruga e Durresit 123',
      addressLocality: 'Tirana',
      addressRegion: 'Tirana',
      postalCode: '1001',
      addressCountry: 'AL',
    },
    geo: { '@type': 'GeoCoordinates', latitude: '41.3275', longitude: '19.8187' },
    openingHours: ['Mo-Su 08:00-20:00'],
    priceRange: '€€',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '127' },
    areaServed: { '@type': 'Country', name: 'Albania' },
    serviceArea: { '@type': 'Place', name: 'Tirana, Albania' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Car Rental Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Economy Car Rental Tirana' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SUV Rental Albania' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Luxury Car Rental Tirana' } },
      ],
    },
    sameAs: ['https://facebook.com/memarental', 'https://instagram.com/memarental'],
  };

  return (
    <>
      <Seo
        title={t('seoHomeTitle')}
        description={t('seoHomeDescription')}
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div>
                <motion.h1
                  {...fadeUp}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900"
                >
                  {t('heroTitle')}
                </motion.h1>
                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.08 }}
                  className="mt-4 text-lg sm:text-xl text-gray-700 max-w-2xl"
                >
                  {t('heroSubtitle')}
                </motion.p>

                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.16 }}
                  className="mt-8 flex flex-col sm:flex-row gap-3"
                >
                  <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Link to="/cars">{t('bookNow')}</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-yellow-600 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                  >
                    <Link to="/contact">{t('getInTouch')}</Link>
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
                  Popular:{' '}
                  <Link className="underline underline-offset-2 hover:text-gray-900" to="/cars?type=economy">
                    Economy car rental in Tirana
                  </Link>{' '}
                  ·{' '}
                  <Link className="underline underline-offset-2 hover:text-gray-900" to="/cars?type=suv">
                    SUV rental in Albania
                  </Link>{' '}
                  ·{' '}
                  <Link className="underline underline-offset-2 hover:text-gray-900" to="/cars?type=luxury">
                    Luxury car hire in Tirana
                  </Link>
                </motion.p>
              </div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.12 }}
                className="relative"
                aria-hidden="true"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5">
                  <img
                    src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1920&auto=format&fit=crop"
                    width={960}
                    height={720}
                    alt="Modern rental car on the Albanian coast road near Tirana"
                    className="h-auto w-full object-cover"
                    loading="eager"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features */}
          <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="why-us-title">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
                <h2 id="why-us-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  {t('homeWhyTitle')}
                </h2>
                <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">{t('homeWhyCopy')}</p>
              </motion.div>

              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
                <h2 id="destinations-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  {t('homeDestinationsTitle')}
                </h2>
                <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">{t('homeDestinationsCopy')}</p>
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="text-center mb-10">
                <h2 id="testimonials-title" className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {t('homeTestimonialsTitle') || 'What travelers say'}
                </h2>
                <p className="mt-3 text-gray-700">
                  {t('homeTestimonialsCopy') || 'Real experiences from real trips across Albania.'}
                </p>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((n, i) => (
                  <motion.div key={n} {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 + i * 0.06 }}>
                    <Card className="h-full p-6">
                      <div className="flex items-center gap-2 text-yellow-600" aria-hidden="true">
                        {'★★★★★'}
                      </div>
                      <p className="mt-3 text-sm text-gray-700">
                        “Smooth pickup at Tirana Airport and great support. Car was clean and fuel-efficient. Highly
                        recommend!”
                      </p>
                      <p className="mt-2 text-xs text-gray-500">Verified review</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ (using native details/summary to avoid extra deps) */}
          <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="faq-title">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="text-center mb-10">
                <h2 id="faq-title" className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {t('homeFaqTitle') || 'Frequently asked questions'}
                </h2>
                <p className="mt-3 text-gray-700">
                  {t('homeFaqCopy') || 'Everything you need to know about booking and driving.'}
                </p>
              </motion.div>

              <div className="mx-auto max-w-3xl space-y-3">
                <details className="rounded-lg border bg-white p-4 [&_summary]:cursor-pointer">
                  <summary className="font-medium">{t('faqDocsQuestion') || 'What documents do I need to rent a car?'}</summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('faqDocsAnswer') ||
                      'A valid driver’s license, passport/ID, and a credit or debit card for the security deposit.'}
                  </p>
                </details>
                <details className="rounded-lg border bg-white p-4 [&_summary]:cursor-pointer">
                  <summary className="font-medium">{t('faqAirportPickupQuestion') || 'Can I pick up at Tirana Airport?'}</summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('faqAirportPickupAnswer') ||
                      'Yes, we offer flexible airport pickup and drop-off. Select “Tirana Airport” during checkout.'}
                  </p>
                </details>
                <details className="rounded-lg border bg-white p-4 [&_summary]:cursor-pointer">
                  <summary className="font-medium">{t('faqInsuranceQuestion') || 'Is insurance included?'}</summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('faqInsuranceAnswer') ||
                      'All rentals include basic insurance. Full coverage options are available during booking.'}
                  </p>
                </details>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-yellow-500 to-orange-600">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="text-center text-white">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{t('homeCtaTitle')}</h2>
                <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">{t('homeCtaCopy')}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-yellow-700 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl"
                  >
                    <Link to="/cars">{t('bookNow')}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-yellow-700 text-lg px-8 py-4 bg-transparent"
                  >
                    <Link to="/contact">{t('getInTouch')}</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-4 inset-x-0 px-4 sm:hidden z-40">
          <div className="mx-auto max-w-md rounded-xl shadow-lg ring-1 ring-black/5 bg-white p-3 flex gap-2">
            <Button asChild className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white">
              <Link to="/cars">{t('bookNow')}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-yellow-600 text-yellow-700 hover:bg-yellow-50 bg-transparent"
            >
              <Link to="/contact">{t('getInTouch')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

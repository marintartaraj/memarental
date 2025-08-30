"use client"
import { motion, useReducedMotion } from "framer-motion"
import { Star, Users, Award, Shield, Clock, Zap, Heart, Navigation, CreditCard, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const HomePage = () => {
  const prefersReducedMotion = useReducedMotion()

  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" },
    viewport: { once: true, amount: 0.3 },
  }

  const destinations = [
    { name: "Tirana City Center", emoji: "🏙️", description: "Explore Albania's vibrant capital with ease" },
    { name: "Durres Beach", emoji: "🏖️", description: "Drive to the stunning Adriatic coastline" },
    { name: "Albanian Alps", emoji: "⛰️", description: "Adventure through breathtaking mountain roads" },
    { name: "Historical Sites", emoji: "🏛️", description: "Visit ancient castles and UNESCO sites" },
  ]

  const benefits = [
    { icon: Shield, title: "Fully Insured", description: "Complete coverage and peace of mind" },
    { icon: Clock, title: "24/7 Support", description: "Round-the-clock assistance when you need it" },
    { icon: Zap, title: "Instant Booking", description: "Reserve your car in under 2 minutes" },
    { icon: Heart, title: "Best Rates", description: "Competitive pricing with no hidden fees" },
    { icon: Navigation, title: "Free GPS", description: "Navigate Albania with confidence" },
    { icon: CreditCard, title: "Flexible Payment", description: "Multiple payment options available" },
  ]

  return (
    <>
      <title>MEMA Rental - Premium Car Rental in Albania | Tirana Airport Pickup</title>
      <meta
        name="description"
        content="Rent premium cars in Albania with MEMA Rental. Airport pickup, fully insured vehicles, and 24/7 support. Book your Albanian adventure today!"
      />

      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to content
      </a>

      <div className="min-h-screen bg-background">
        <main id="main">
          <section className="relative overflow-hidden bg-background" aria-labelledby="hero-title">
            <div className="container-mobile py-12 sm:py-16 lg:py-24 grid gap-8 lg:grid-cols-2 items-center">
              {/* Hero Content */}
              <div className="space-y-6">
                <motion.h1
                  {...fadeUp}
                  id="hero-title"
                  className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground text-balance"
                >
                  Explore Albania with Confidence
                </motion.h1>

                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 }}
                  className="text-lg sm:text-xl text-muted-foreground max-w-2xl text-pretty"
                >
                  Premium car rental service in Tirana and across Albania. Fully insured vehicles, airport pickup, and
                  transparent pricing for your perfect Albanian adventure.
                </motion.p>

                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl"
                  >
                    Find Your Car
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-8 py-6 text-lg bg-transparent">
                    View Fleet
                  </Button>
                </motion.div>

                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.3 }}
                  className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground pt-4"
                  aria-label="Trust signals"
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" aria-hidden="true" />
                    <span>4.9/5 rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                    <span>1000+ happy customers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                    <span>Fully insured</span>
                  </div>
                </motion.div>
              </div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
                <Card className="p-0 shadow-2xl border-0 bg-card rounded-xl overflow-hidden">
                  <div className="relative w-full aspect-[4/3] bg-muted">
                    <img
                      src="/mercedes-benz-e-class-luxury-sedan-in-silver.png"
                      alt="Mercedes-Benz E-Class available for rent"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-yellow-600 font-semibold mb-1">Featured</p>
                      <h3 className="font-heading text-2xl font-bold text-card-foreground">Mercedes-Benz E-Class</h3>
                      <p className="text-muted-foreground">Executive • Automatic • Premium</p>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-3xl font-black text-yellow-600">€85</span>
                      <span className="text-muted-foreground">/ day</span>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl">Book Now</Button>
                      <Button variant="outline" className="flex-1 bg-transparent border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

          <section id="why-us" className="py-16 lg:py-24 bg-muted/30" aria-labelledby="why-us-title">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2
                  id="why-us-title"
                  className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance"
                >
                  Why Choose MEMA Rental
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Experience premium car rental service with transparent pricing, comprehensive insurance, and
                  exceptional customer support.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: 0.1 + index * 0.05 }}
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-card h-full">
                      <div className="text-center space-y-4">
                        <div className="inline-flex p-3 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-colors">
                          <benefit.icon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-card-foreground">{benefit.title}</h3>
                        <p className="text-muted-foreground text-pretty">{benefit.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="destinations" className="py-16 lg:py-24 bg-background" aria-labelledby="destinations-title">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinations.map((destination, index) => (
                  <motion.div
                    key={destination.name}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: 0.1 + index * 0.05 }}
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-card text-center h-full">
                      <div className="text-4xl mb-4" aria-hidden="true">
                        {destination.emoji}
                      </div>
                      <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">{destination.name}</h3>
                      <p className="text-muted-foreground text-sm text-pretty">{destination.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="testimonials" className="py-16 lg:py-24 bg-muted/30" aria-labelledby="testimonials-title">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 id="testimonials-title" className="font-heading text-3xl sm:text-4xl font-black text-foreground">
                  Trusted by Travelers Worldwide
                </h2>
                <p className="text-lg text-muted-foreground">
                  See what our customers say about their Albanian adventure
                </p>
              </motion.div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Maria K.",
                    location: "Italy",
                    rating: 5,
                    text: "Perfect experience! Car was spotless and the staff provided excellent local recommendations. Made our Albanian road trip unforgettable.",
                    date: "2 weeks ago",
                  },
                  {
                    name: "Ahmed S.",
                    location: "Germany",
                    rating: 5,
                    text: "Excellent service from start to finish. The SUV was perfect for our mountain adventure. Professional and reliable!",
                    date: "1 month ago",
                  },
                  {
                    name: "Sarah L.",
                    location: "UK",
                    rating: 5,
                    text: "Amazing experience! Seamless airport pickup and the car was in perfect condition. Highly recommend MEMA Rental.",
                    date: "3 weeks ago",
                  },
                ].map((testimonial, i) => (
                  <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 + i * 0.05 }}>
                    <Card className="p-6 h-full bg-card">
                      <div className="flex items-center gap-1 text-yellow-500 mb-3" aria-hidden="true">
                        {Array.from({ length: testimonial.rating }, (_, j) => (
                          <Star key={j} className="h-4 w-4 fill-current" />
                        ))}
                        <span className="sr-only">{testimonial.rating} out of 5 stars</span>
                      </div>
                      <p className="text-card-foreground mb-4 italic text-pretty">"{testimonial.text}"</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="py-16 lg:py-24 bg-background" aria-labelledby="faq-title">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 id="faq-title" className="font-heading text-3xl sm:text-4xl font-black text-foreground">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-muted-foreground">Everything you need to know about renting with us</p>
              </motion.div>

              <div className="mx-auto max-w-3xl">
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="q1" className="border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">
                      What documents do I need to rent a car?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      You'll need a valid driver's license, passport or national ID, and a credit card. International
                      license recommended for non-EU citizens. Minimum age 21 with 2+ years driving experience.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="q2" className="border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">
                      Do you offer airport pickup?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes! We provide 24/7 pickup and drop-off at Tirana International Airport. Our staff will meet you
                      at arrivals with your vehicle ready to go.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="q3" className="border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">
                      Is insurance included?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      All rentals include comprehensive insurance coverage. We offer additional protection options
                      including collision damage waiver and roadside assistance.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="q4" className="border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">
                      Can I drive to other countries?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes, cross-border travel to Greece, North Macedonia, Montenegro, and Kosovo is permitted. Please
                      inform us in advance for proper documentation.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          <section className="py-16 lg:py-24 bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center space-y-8">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-balance">
                  Ready to Explore Albania?
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto text-pretty">
                  Book your premium rental car today and discover the beauty of Albania with complete confidence and
                  comfort.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    className="bg-white text-yellow-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl"
                  >
                    Book Your Car Now
                  </Button>
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+355-4-123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>info@memarental.com</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <div className="sticky-bottom-cta sm:hidden">
          <div className="mx-auto max-w-md">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 text-lg shadow-xl">
              Book Your Car
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage

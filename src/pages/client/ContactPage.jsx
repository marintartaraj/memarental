"use client"

import { useState } from "react"
import Seo from "@/components/Seo"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Calendar, Navigation, MessageCircle } from "lucide-react"
import HeroHeader from "@/components/HeroHeader"

const ContactPage = () => {
  const { t } = useLanguage()
  const prefersReducedMotion = useReducedMotion()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Respect prefers-reduced-motion for all animations
  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" },
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contactLocation") || "Location",
      details: "Rruga e Durresit 123, Tirana, Albania",
      subtitle: t("contactCityCenter") || "City Center Location",
      color: "blue",
      action: "Get Directions",
      actionIcon: Navigation,
    },
    {
      icon: Phone,
      title: t("contactPhone") || "Phone",
      details: "+355 4 123 4567",
      subtitle: t("contactSupport") || "24/7 Support Available",
      color: "green",
      action: "Call Now",
      actionIcon: Phone,
    },
    {
      icon: Mail,
      title: t("contactEmail") || "Email",
      details: "info@memarental.com",
      subtitle: t("contactQuickResponse") || "Quick Response Guaranteed",
      color: "yellow",
      action: "Send Email",
      actionIcon: Mail,
    },
    {
      icon: Clock,
      title: t("businessHours") || "Business Hours",
      details: "Monday - Sunday",
      subtitle: "8:00 AM - 8:00 PM",
      color: "purple",
      action: "Book Now",
      actionIcon: Calendar,
    },
  ]

  const colorStyles = {
    blue: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    green: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-300" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-400" },
    purple: { bg: "bg-gray-50", text: "text-gray-800", border: "border-gray-200" },
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after showing success message
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 5000)
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MEMA Rental - Car Rental Tirana Albania",
    description:
      "Get in touch with MEMA Rental for car rental services in Tirana, Albania. Contact us for bookings, support, or inquiries.",
    url: "https://memarental.com/contact",
    mainEntity: {
      "@type": "Organization",
      name: "MEMA Rental",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rruga e Durresit 123",
        addressLocality: "Tirana",
        addressRegion: "Tirana",
        postalCode: "1001",
        addressCountry: "AL",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+355-4-123-4567",
          contactType: "customer service",
          availableLanguage: "English, Albanian",
        },
        {
          "@type": "ContactPoint",
          email: "info@memarental.com",
          contactType: "customer service",
        },
      ],
    },
  }

  return (
    <>
      <Seo
        title={t("seoContactTitle") || "Contact MEMA Rental - Car Rental Tirana Albania"}
        description={
          t("seoContactDescription") ||
          "Contact MEMA Rental for car rental services in Tirana, Albania. Get in touch for bookings, support, or inquiries. 24/7 customer service available."
        }
        path="/contact"
        image="https://memarental.com/contact-image.jpg"
        keywords="contact MEMA Rental, car rental contact Tirana, car rental phone Albania, MEMA Rental email, car rental support Albania, Tirana car rental contact, Albania car hire contact, car rental customer service Tirana"
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
          title={t("contactHeroTitle") || "Get in Touch"}
          subtitle={t("contactHeroSubtitle") || "We're here to help with all your car rental needs"}
          gradientClassName="bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600"
        />

        <main id="main">
          {/* Contact Information Section */}
          <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t("contactInfoTitle") || "Contact Information"}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {t("contactInfoCopy") || "Multiple ways to reach us for your car rental needs"}
                </p>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {contactInfo.map((info, index) => {
                  const style = colorStyles[info.color]
                  const Icon = info.icon
                  const ActionIcon = info.actionIcon
                  return (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group"
                    >
                      <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-white/80 backdrop-blur-sm border border-gray-200/50">
                        <div className="text-center">
                          <div
                            className={`inline-flex p-4 ${style.bg} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 border ${style.border}`}
                          >
                            <Icon className={`h-8 w-8 ${style.text}`} aria-hidden="true" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                          <p className="text-lg text-gray-700 mb-2 font-semibold">{info.details}</p>
                          <p className="text-gray-500 mb-6">{info.subtitle}</p>
                          <Button
                            variant="outline"
                            className={`w-full border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-all duration-300`}
                          >
                            <ActionIcon className="h-4 w-4 mr-2" />
                            {info.action}
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Form */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                      {t("contactFormTitle") || "Send us a Message"}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {t("contactFormCopy") ||
                        "Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible."}
                    </p>
                  </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center"
                    >
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                      <p className="text-green-700">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <Card className="p-8 shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300"
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300"
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div>
                            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                              Subject *
                            </label>
                            <Select value={formData.subject} onValueChange={handleSelectChange} required>
                              <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="booking">Booking Inquiry</SelectItem>
                                <SelectItem value="support">Customer Support</SelectItem>
                                <SelectItem value="pricing">Pricing Question</SelectItem>
                                <SelectItem value="general">General Inquiry</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                            Message *
                          </label>
                          <Textarea
                            id="message"
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 resize-none"
                            placeholder="Tell us how we can help you..."
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Card>
                  )}
                </div>

                {/* Map and Additional Info */}
                <div className="space-y-8">
                  {/* Map */}
                  <div className="relative">
                    <Card className="p-0 overflow-hidden shadow-2xl border-0">
                      <div className="relative h-80 bg-gray-200 rounded-2xl overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
                          alt="MEMA Rental location in Tirana, Albania"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                          <h3 className="text-xl font-bold mb-2">Our Location</h3>
                          <p className="text-white/90">Rruga e Durresit 123, Tirana, Albania</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Quick Contact */}
                  <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Help?</h3>
                      <p className="text-gray-600 mb-6">
                        For urgent inquiries or immediate assistance, call us directly
                      </p>
                      <Button
                        asChild
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg font-semibold"
                      >
                        <a href="tel:+35541234567">
                          <Phone className="mr-2 h-5 w-5" />
                          Call +355 4 123 4567
                        </a>
                      </Button>
                    </div>
                  </Card>

                  {/* Business Hours */}
                  <Card className="p-8 shadow-xl border-0 bg-white">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors duration-300">
                        Business Hours
                      </h3>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                          <span>Monday - Friday:</span>
                          <span className="font-semibold">8:00 AM - 8:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday:</span>
                          <span className="font-semibold">8:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sunday:</span>
                          <span className="font-semibold">9:00 AM - 5:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Quick answers to common questions about our car rental services
                </p>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {[
                  {
                    question: "What documents do I need to rent a car?",
                    answer:
                      "You'll need a valid driver's license, passport/ID, and a credit or debit card for the security deposit.",
                  },
                  {
                    question: "Can I pick up at Tirana Airport?",
                    answer: "Yes! We offer convenient pickup and drop-off at Tirana International Airport (TIA).",
                  },
                  {
                    question: "What is your cancellation policy?",
                    answer:
                      "Free cancellation up to 24 hours before pickup. Cancellations within 24 hours may incur a small fee.",
                  },
                  {
                    question: "Do you offer insurance?",
                    answer: "All rentals include basic insurance. Full coverage options are available during booking.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="group"
                  >
                    <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors duration-300">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default ContactPage

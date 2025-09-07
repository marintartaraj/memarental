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
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Calendar, Navigation, MessageCircle, Sparkles, ArrowRight } from "lucide-react"
import HeroHeader from "@/components/HeroHeader"
import EnhancedCTA from "@/components/EnhancedCTA"

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
    viewport: { once: true, amount: 0.3 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
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

  const handleContactAction = (type, details) => {
    if (type === "phone") {
      window.open(`tel:${details}`, "_self")
    } else if (type === "email") {
      window.open(`mailto:${details}`, "_self")
    } else if (type === "directions") {
      // Open Google Maps with the address
      const address = encodeURIComponent("Rruga e Durresit 123, Tirana, Albania")
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank")
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MEMA Rental - Car Rental Tirana Albania",
    description: "Get in touch with MEMA Rental for car rental services in Tirana, Albania. Contact us for bookings, support, and inquiries.",
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
          availableLanguage: "English, Albanian",
        },
      ],
    },
  }

  return (
    <>
      <Seo
        title={t("seoContactTitle") || "Contact MEMA Rental - Car Rental Service in Tirana, Albania"}
        description={t("seoContactDescription") || "Contact MEMA Rental for premium car rental services in Tirana, Albania. Get in touch for bookings, support, and inquiries. 24/7 customer service available."}
        path="/contact"
        image="https://memarental.com/contact-image.jpg"
        keywords="contact MEMA rental, car rental contact Tirana, car rental service contact Albania, MEMA rental contact, car rental phone Tirana, car rental email Albania, car rental support Tirana, car rental customer service Albania, Tirana car rental contact, Albania car rental support"
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
                  <span className="relative z-10">24/7 Support • Quick Response • Expert Help</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.div>

                <motion.h1
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 }}
                  className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground text-balance leading-tight"
                >
                  <span className="relative">
                    Get in
                    <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Touch</span>
                  </span>
                </motion.h1>

                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.2 }}
                  className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed"
                >
                  Have questions about our car rental services? Need help with your booking? 
                  Our friendly team is here to help you 24/7. Reach out to us today!
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="py-16 lg:py-24 bg-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for contact info section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance relative">
                  <span className="relative">
                    Multiple Ways to
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </span>
                  <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Connect</span>
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Choose the most convenient way to reach us. We're here to help with any questions or assistance you need.
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative h-full">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="text-center relative z-10 space-y-4">
                        <div className={`inline-block p-4 bg-gradient-to-br ${colorStyles[info.color].bg} ${colorStyles[info.color].text} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden`}>
                          <info.icon className="h-7 w-7 relative z-10" aria-hidden="true" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-card-foreground">{info.title}</h3>
                        <p className="text-card-foreground font-semibold">{info.details}</p>
                        <p className="text-muted-foreground text-sm">{info.subtitle}</p>
                        <Button
                          onClick={() => handleContactAction(
                            info.action.toLowerCase().includes("call") ? "phone" : 
                            info.action.toLowerCase().includes("email") ? "email" : 
                            info.action.toLowerCase().includes("directions") ? "directions" : "phone",
                            info.details
                          )}
                          variant="outline"
                          className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <info.actionIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform relative z-10" />
                          <span className="relative z-10">{info.action}</span>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Send Us a Message
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Fill out the form below and we'll get back to you as soon as possible. 
                  We typically respond within 2 hours during business hours.
                </p>
              </motion.div>

              <motion.div {...fadeUp} className="max-w-2xl mx-auto">
                <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur rounded-3xl overflow-hidden relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-yellow-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                      >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                            Message Sent Successfully!
                          </h3>
                          <p className="text-muted-foreground">
                            Thank you for contacting us. We'll get back to you within 2 hours during business hours.
                          </p>
                        </div>
                        <Button
                          onClick={() => setIsSubmitted(false)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                        >
                          Send Another Message
                        </Button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-foreground">
                              Full Name *
                            </label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              className="border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 h-12"
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                              Email Address *
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 h-12"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium text-foreground">
                              Phone Number
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 h-12"
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium text-foreground">
                              Subject *
                            </label>
                            <Select value={formData.subject} onValueChange={handleSelectChange} required>
                              <SelectTrigger className="border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 h-12">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="booking">Booking Question</SelectItem>
                                <SelectItem value="support">Technical Support</SelectItem>
                                <SelectItem value="feedback">Feedback</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium text-foreground">
                            Message *
                          </label>
                          <Textarea
                            id="message"
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={6}
                            className="border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 resize-none"
                            placeholder="Tell us how we can help you..."
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <span className="flex items-center justify-center relative z-10">
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Sending Message...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                Send Message
                              </>
                            )}
                          </span>
                        </Button>
                      </form>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 lg:py-24 bg-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for FAQ section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/3 left-1/4 w-px h-1/3 bg-gradient-to-b from-yellow-300/15 via-yellow-200/10 to-transparent animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-px h-1/3 bg-gradient-to-b from-orange-300/10 via-orange-200/8 to-transparent animate-pulse animation-delay-2000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-foreground text-balance">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                  Quick answers to common questions about our car rental services
                </p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {[
                  {
                    question: "What are your business hours?",
                    answer: "We're open Monday through Sunday from 8:00 AM to 8:00 PM. For airport pickups outside these hours, please contact us in advance."
                  },
                  {
                    question: "How quickly do you respond to inquiries?",
                    answer: "We typically respond to all inquiries within 2 hours during business hours. For urgent matters, you can call us directly."
                  },
                  {
                    question: "Do you offer support in multiple languages?",
                    answer: "Yes! Our team speaks both English and Albanian fluently, ensuring clear communication for all our customers."
                  },
                  {
                    question: "Can I get help with my booking outside business hours?",
                    answer: "Absolutely! Our 24/7 support line is available for urgent matters, and we'll get back to you first thing in the morning for non-urgent inquiries."
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.01 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden relative">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/5 via-orange-400/5 to-yellow-400/5 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <h3 className="font-heading text-lg font-bold text-card-foreground mb-3 group-hover:text-yellow-600 transition-colors">
                          {faq.question}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Enhanced CTA */}
          <EnhancedCTA 
            title="Ready to Get Started?"
            subtitle="Don't wait! Contact us today and let us help you plan your perfect Albanian adventure."
            secondaryButton={{
              text: "Call Us Now",
              link: "tel:+355-4-123-4567",
              icon: Phone
            }}
          />
        </main>
      </div>
    </>
  )
}

export default ContactPage
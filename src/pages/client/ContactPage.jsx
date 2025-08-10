"use client"

import React, { useState } from "react"
import Seo from "@/components/Seo"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, User, Calendar } from "lucide-react"
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
    },
    {
      icon: Phone,
      title: t("contactPhone") || "Phone",
      details: "+355 4 123 4567",
      subtitle: t("contactSupport") || "24/7 Support Available",
      color: "green",
    },
    {
      icon: Mail,
      title: t("contactEmail") || "Email",
      details: "info@memarental.com",
      subtitle: t("contactQuickResponse") || "Quick Response Guaranteed",
      color: "purple",
    },
    {
      icon: Clock,
      title: t("businessHours") || "Business Hours",
      details: "Monday - Sunday",
      subtitle: "8:00 AM - 8:00 PM",
      color: "yellow",
    },
  ]

  const colorStyles = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
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
    }, 3000)
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MEMA Rental - Car Rental Tirana Albania",
    description: "Contact MEMA Rental for car rental services in Tirana, Albania. Get in touch for bookings, support, and inquiries about our car rental fleet.",
    url: "https://memarental.com/contact",
    mainEntity: {
      "@type": "Organization",
      name: "MEMA Rental - Car Rental Tirana Albania",
      alternateName: "MEMA Car Rental",
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
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "08:00",
          closes: "20:00",
        },
      },
    },
  }

  return (
    <>
      <Seo
        title={t("seoContactTitle") || "Contact MEMA Rental - Car Rental Tirana Albania"}
        description={t("seoContactDescription") || "Contact MEMA Rental for car rental services in Tirana, Albania. Get in touch for bookings, support, and inquiries about our car rental fleet."}
        path="/contact"
        image="https://memarental.com/contact-image.jpg"
        keywords="contact MEMA Rental, car rental contact Tirana, car rental support Albania, MEMA Rental phone, car rental email Tirana, car rental office Albania, Tirana car rental contact, Albania car hire contact"
        schema={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <HeroHeader 
          title={t("contactHeroTitle") || "Get in Touch"} 
          subtitle={t("contactHeroSubtitle") || "Ready to explore Albania? Contact us for the best car rental experience in Tirana. We're here to help you with your transportation needs."} 
        />

        {/* Contact Information */}
        <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="contact-info-title">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
              <h2 id="contact-info-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {t("contactInfoTitle") || "Contact Information"}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
                {t("contactInfoCopy") || "Get in touch with us for any questions about car rental in Tirana, Albania. We're located in the heart of Tirana city center for your convenience."}
              </p>
            </motion.div>

            <motion.ul
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
              aria-label={t("contactInfoAria") || "Ways to contact MEMA Rental"}
            >
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                const style = colorStyles[info.color]
                return (
                  <li key={info.title}>
                    <motion.div
                      {...fadeUp}
                      transition={{ ...fadeUp.transition, delay: 0.3 + index * 0.08 }}
                      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                      className="group"
                    >
                      <Card className="p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                        <div className="text-center">
                          <div
                            className={`inline-flex p-3 ${style.bg} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className={`h-6 w-6 ${style.text}`} aria-hidden="true" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h3>
                          <p className="text-gray-700">{info.details}</p>
                          <p className="text-sm text-gray-500 mt-2">{info.subtitle}</p>
                        </div>
                      </Card>
                    </motion.div>
                  </li>
                )
              })}
            </motion.ul>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="contact-form-title">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="max-w-4xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h2 id="contact-form-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {t("sendMessage") || "Send us a Message"}
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
                  {t("contactFormCopy") || "Have a question about our car rental services? Fill out the form below and we'll get back to you as soon as possible."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.2 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          {t("fullName") || "Full Name"} *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                          placeholder={t("enterFullName") || "Enter your full name"}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          {t("email") || "Email"} *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                          placeholder={t("enterEmail") || "Enter your email"}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          {t("phone") || "Phone"}
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                          placeholder={t("enterPhone") || "Enter your phone number"}
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          {t("subject") || "Subject"} *
                        </label>
                        <Select value={formData.subject} onValueChange={handleSelectChange}>
                          <SelectTrigger className="w-full border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200">
                            <SelectValue placeholder={t("selectSubject") || "Select a subject"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">{t("generalInquiry") || "General Inquiry"}</SelectItem>
                            <SelectItem value="booking">{t("bookingQuestion") || "Booking Question"}</SelectItem>
                            <SelectItem value="support">{t("technicalSupport") || "Technical Support"}</SelectItem>
                            <SelectItem value="feedback">{t("feedback") || "Feedback"}</SelectItem>
                            <SelectItem value="other">{t("other") || "Other"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        {t("message") || "Message"} *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                        placeholder={t("enterMessage") || "Enter your message"}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          {t("sending") || "Sending..."}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          {t("sendMessage") || "Send Message"}
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Success Message */}
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">{t("messageSent") || "Message Sent!"}</p>
                        <p className="text-sm text-green-700">{t("weWillRespond") || "We'll respond to your message as soon as possible."}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Additional Information */}
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.4 }}
                  className="space-y-8"
                >
                  {/* Office Hours */}
                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {t("businessHours") || "Business Hours"}
                        </h3>
                        <div className="space-y-1 text-gray-700">
                          <p><strong>Monday - Sunday:</strong> 8:00 AM - 8:00 PM</p>
                          <p className="text-sm text-gray-500">{t("albaniaTime") || "Albania Time (CET)"}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Response Time */}
                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <MessageSquare className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {t("responseTime") || "Response Time"}
                        </h3>
                        <div className="space-y-1 text-gray-700">
                          <p><strong>Email:</strong> Within 2-4 hours</p>
                          <p><strong>Phone:</strong> Immediate assistance</p>
                          <p><strong>WhatsApp:</strong> Within 1 hour</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Location Info */}
                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {t("ourLocation") || "Our Location"}
                        </h3>
                        <div className="space-y-1 text-gray-700">
                          <p><strong>Address:</strong> Rruga e Durresit 123</p>
                          <p>Tirana, Albania 1001</p>
                          <p className="text-sm text-gray-500">{t("cityCenter") || "City Center"}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Contact */}
                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {t("quickContact") || "Quick Contact"}
                        </h3>
                        <div className="space-y-2">
                          <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start border-2 hover:border-green-500 hover:text-green-700 bg-transparent"
                          >
                            <a href="tel:+35541234567">
                              <Phone className="h-4 w-4 mr-2" />
                              +355 4 123 4567
                            </a>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start border-2 hover:border-blue-500 hover:text-blue-700 bg-transparent"
                          >
                            <a href="mailto:info@memarental.com">
                              <Mail className="h-4 w-4 mr-2" />
                              info@memarental.com
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="map-title">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 id="map-title" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t("findUs") || "Find Us"}
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                {t("mapDescription") || "Visit our office in the heart of Tirana city center for the best car rental experience in Albania."}
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5"
            >
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t("mapPlaceholder") || "Interactive map will be displayed here"}</p>
                  <p className="text-sm text-gray-500 mt-2">Rruga e Durresit 123, Tirana, Albania</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ContactPage
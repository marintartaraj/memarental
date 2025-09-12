import React from "react"
import Seo from "@/components/Seo"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Users, Award, Shield, Clock, MapPin, Phone, Mail, Star, Car, Globe, Target } from "lucide-react"
import { generateLocalBusinessSchema } from "@/seo/structuredData"

const AboutPage = () => {
  const { t, language } = useLanguage()

  // Base URL for structured data
  const baseUrl = import.meta.env.VITE_SITE_URL || "https://memarental.com"
  const canonicalUrl = new URL("/about", baseUrl).toString()

  // SEO titles and descriptions based on language
  const seoData = {
    sq: {
      title: "Rreth MEMA Rental | Qira Makine në Tiranë",
      description: "Njihuni me MEMA Rental: ekip lokal në Tiranë, makina të siguruara, mbështetje 24/7 dhe dorëzim në Aeroportin TIA. Lexoni historinë, vlerat dhe standardet tona."
    },
    en: {
      title: "About MEMA Rental | Car Rental in Tirana",
      description: "Meet MEMA Rental: Tirana-based team, fully insured cars, 24/7 support, and TIA airport delivery. Read our story, values, and standards."
    }
  }

  // Structured data schemas
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": language === "sq" ? "Rreth MEMA Rental" : "About MEMA Rental",
    "description": (language === "sq"
      ? "Njihuni me MEMA Rental: ekip lokal në Tiranë, makina të siguruara, mbështetje 24/7 dhe dorëzim në Aeroportin TIA."
      : "Meet MEMA Rental: Tirana-based team, fully insured cars, 24/7 support, and TIA airport delivery."),
    "isPartOf": canonicalUrl,
    "about": { "@id": `${baseUrl}#organization` }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": language === "sq" ? "Kreu" : "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": language === "sq" ? "Rreth Nesh" : "About Us", "item": canonicalUrl }
    ]
  }

  // Simple animation variants
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true, amount: 0.3 },
  }

  const stats = [
    { icon: Car, label: t("statsVehicles") || "Vehicles", value: "50+", description: "Modern fleet" },
    { icon: Users, label: t("statsHappyCustomers") || "Happy Customers", value: "1000+", description: "Satisfied clients" },
    { icon: Star, label: t("statsRating") || "Rating", value: "4.9", description: "Out of 5 stars" },
    { icon: Award, label: t("statsYears") || "Years", value: "10+", description: "Of experience" },
  ]

  const benefits = [
    { icon: Shield, title: t("fullyInsured") || "Fully Insured", description: t("benefitFullyInsuredDesc") || "Complete coverage for peace of mind" },
    { icon: Clock, title: t("support247") || "24/7 Support", description: t("support247Desc") || "Round-the-clock assistance" },
    { icon: Globe, title: "Local Expertise", description: "Deep knowledge of Albania and local roads" },
    { icon: Target, title: "Excellence", description: "We strive for excellence in every aspect of our service" },
  ]

  return (
    <>
      <Seo
        title={seoData[language]?.title || seoData.en.title}
        description={seoData[language]?.description || seoData.en.description}
        path="/about"
        image="https://memarental.com/about-image.jpg"
        schema={[generateLocalBusinessSchema(), aboutSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200 py-3">
        <div className="container-mobile">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-yellow-600 transition-colors">
                {language === 'sq' ? 'Ballina' : 'Home'}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">
              {language === 'sq' ? 'Rreth Nesh' : 'About Us'}
            </li>
          </ol>
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/15 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-100/10 to-transparent rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 sm:py-12">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-200/50 rounded-2xl text-sm font-semibold mb-6 shadow-lg">
                  <div className="p-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    10+ Years of Excellence • 1000+ Happy Customers
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    {language === "sq" ? "Rreth MEMA Rental" : "About MEMA Rental"}
                  </span>
                  <br />
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-600">
                    {language === "sq" ? "Qira Makine në Tiranë" : "Car Rental in Tirana"}
                  </span>
                </h1>

                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {language === "sq" 
                    ? "Që nga viti 2014, MEMA Rental ka qenë zgjedhja e besuar për shërbimet premium të qirasë së makinave në Tiranë dhe në të gjithë Shqipërinë. Kemi ndërtuar reputacionin tonë mbi besueshmërinë, cilësinë dhe shërbimin e jashtëzakonshëm të klientëve."
                    : "Since 2014, MEMA Rental has been the trusted choice for premium car rental services in Tirana and across Albania. We've built our reputation on reliability, quality, and exceptional customer service."
                  }
                </p>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-8 sm:py-12 bg-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-sm font-medium mb-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">Trusted by Thousands</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {language === "sq" ? "Të Besuar nga Mijëra" : "Trusted by Thousands"}
                  </span>
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {language === "sq" 
                    ? "Numrat tanë flasin vetë - kemi fituar besimin e klientëve përmes cilësisë dhe shërbimit të vazhdueshëm."
                    : "Our numbers speak for themselves - we've earned the trust of customers through consistent quality and service."
                  }
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={stat.label} 
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <stat.icon className="h-8 w-8 text-white" />
                        </div>
                        
                        <div className="text-4xl font-black text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                          {stat.value}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{stat.label}</h3>
                        <p className="text-sm text-gray-600 font-medium">{stat.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium mb-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">Our Story</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {language === "sq" ? "Jeta Jonë" : "Our Journey"}
                  </span>
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {language === "sq" 
                    ? "Nga fillimet e thjeshta deri në bërjen e shërbimit më të besuar të qirasë së makinave në Shqipëri"
                    : "From humble beginnings to becoming Albania's most trusted car rental service"
                  }
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div {...fadeUp} className="space-y-8">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
                    <div className="pl-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {language === "sq" ? "Si Filloi Gjithçka" : "How It All Started"}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {language === "sq"
                          ? "E themeluar në vitin 2014, MEMA Rental filloi me një mision të thjeshtë: të ofrojë shërbime të besueshme, të përballueshme dhe me cilësi të lartë të qirasë së makinave për vizitorët dhe vendasit në Tiranë, Shqipëri."
                          : "Founded in 2014, MEMA Rental began with a simple mission: to provide reliable, affordable, and high-quality car rental services to visitors and locals in Tirana, Albania."
                        }
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {language === "sq"
                          ? "Ajo që filloi si një flotë e vogël prej 5 automjetesh është rritur në një shërbim gjithëpërfshirës me më shumë se 50 makina moderne, duke shërbyer mijëra klientë të kënaqur çdo vit."
                          : "What started as a small fleet of 5 vehicles has grown into a comprehensive service with over 50 modern cars, serving thousands of satisfied customers every year."
                        }
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                    <div className="pl-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {language === "sq" ? "Rritja Jonë" : "Our Growth"}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {language === "sq"
                          ? "Gjatë viteve, kemi zgjeruar shërbimet tona për të përfshirë marrjen nga aeroporti, mbështetjen 24/7 dhe një flotë të larmishme që varion nga makina ekonomike deri te automjetet luksoze."
                          : "Over the years, we've expanded our services to include airport pickup, 24/7 support, and a diverse fleet ranging from economy cars to luxury vehicles."
                        }
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {language === "sq"
                          ? "Angazhimi ynë për kënaqësinë e klientëve na ka dhënë një vlerësim 4.9/5 dhe besimin e udhëtarëve nga e gjithë bota."
                          : "Our commitment to customer satisfaction has earned us a 4.9/5 rating and the trust of travelers from around the world."
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div {...fadeUp} className="relative group">
                  <Card className="overflow-hidden border-0 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                    <div className="relative">
                      <img
                        src="/images/cars/c-class1.jpeg"
                        alt={language === "sq" ? "Flota MEMA Rental - Makina premium në Tiranë" : "MEMA Rental fleet - Premium cars in Tirana"}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                          <h4 className="font-bold text-gray-900 mb-1">Premium Fleet</h4>
                          <p className="text-sm text-gray-600">Modern, reliable vehicles for every need</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-8 sm:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/3 left-1/4 w-px h-1/3 bg-gradient-to-b from-yellow-300/15 via-yellow-200/10 to-transparent animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-px h-1/3 bg-gradient-to-b from-orange-300/10 via-orange-200/8 to-transparent animate-pulse animation-delay-2000"></div>
            </div>
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-sm font-medium mb-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">Why Choose Us</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {language === "sq" ? "Pse të Zgjidhni MEMA Rental" : "Why Choose MEMA Rental"}
                  </span>
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {language === "sq" 
                    ? "Shkojmë më tej për të siguruar që përvoja juaj e qirasë së makinës të jetë e jashtëzakonshme"
                    : "We go above and beyond to ensure your car rental experience is exceptional"
                  }
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={benefit.title} 
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <benefit.icon className="h-8 w-8 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-8 sm:py-12 bg-gray-50 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium mb-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">Get in Touch</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {language === "sq" ? "Ku të Na Gjeni" : "Where to Find Us"}
                  </span>
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {language === "sq" 
                    ? "Na gjeni në qendër të Tiranës për shërbimet më të mira të qirasë së makinave"
                    : "Find us in the heart of Tirana for the best car rental services"
                  }
                </p>
              </motion.div>

              <motion.div {...fadeUp} className="max-w-3xl mx-auto">
                <Card className="p-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 border-0 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-yellow-500/5"></div>
                  
                  <div className="relative z-10 text-center space-y-6">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl text-white font-bold text-xl shadow-lg">
                      <Car className="h-6 w-6" />
                      MEMA Rental
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col items-center space-y-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-yellow-200/50">
                        <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-center">
                          <h4 className="font-bold text-gray-900 mb-1">Address</h4>
                          <p className="text-sm text-gray-600">Rruga e Durrësit 123<br />Tiranë 1001, Albania</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-yellow-200/50">
                        <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-center">
                          <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                          <a href="tel:+35541234567" className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold transition-colors">
                            +355 4 123 4567
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-yellow-200/50">
                        <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-center">
                          <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                          <a href="mailto:info@memarental.com" className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold transition-colors">
                            info@memarental.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

        </main>
      </div>
    </>
  )
}

export default AboutPage
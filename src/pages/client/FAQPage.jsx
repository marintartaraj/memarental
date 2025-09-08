"use client"

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Mail, Sparkles } from "lucide-react"
import Seo from '../../components/Seo';
import { generateLocalBusinessSchema, generateBreadcrumbSchema, generateFAQSchema } from '../../seo/structuredData';

const FAQPage = () => {
  const { language } = useLanguage();
  const prefersReducedMotion = useReducedMotion()

  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" },
    viewport: { once: true, amount: 0.3 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const breadcrumbs = [
    { name: language === 'sq' ? 'Kryefaqja' : 'Home', url: '/' },
    { name: language === 'sq' ? 'Pyetje të Bëra Shpesh' : 'FAQ', url: '/faq' }
  ];

  const faqs = [
    {
      question: "What do I need to rent a car in Tirana?",
      answer: "You need a valid driver's license (minimum 1 year), passport or ID card, credit card for deposit, and minimum age of 21 years. International driving permit is recommended for non-EU citizens."
    },
    {
      question: "Do you offer airport pickup service?",
      answer: "Yes, we provide free airport pickup and delivery service at Tirana International Airport (TIA/Rinas). Our team will meet you at the airport with your car ready."
    },
    {
      question: "What insurance coverage is included?",
      answer: "All our rentals include comprehensive insurance coverage with basic protection. Additional coverage options like collision damage waiver and personal accident insurance are available for extra protection."
    },
    {
      question: "Can I rent a car for just one day?",
      answer: "Yes, we offer flexible rental periods from 1 day to long-term rentals. Contact us for special rates on extended rentals of 7 days or more."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards (Visa, MasterCard), debit cards, cash (EUR), and bank transfers. A credit card is required for the security deposit."
    },
    {
      question: "Do you offer one-way rentals?",
      answer: "Yes, we offer one-way rentals within Albania. Additional fees may apply depending on the distance and return location."
    },
    {
      question: "What happens if I have an accident?",
      answer: "In case of an accident, contact us immediately. We'll guide you through the process and assist with insurance claims. Always call local emergency services if needed."
    },
    {
      question: "Can I add additional drivers?",
      answer: "Yes, you can add additional drivers for a small fee. All drivers must meet the same requirements and be present during pickup."
    },
    {
      question: "What fuel policy do you have?",
      answer: "We operate on a 'full-to-full' fuel policy. You receive the car with a full tank and should return it with a full tank. Fuel costs are not included in the rental price."
    },
    {
      question: "Do you provide child seats?",
      answer: "Yes, we offer child seats and booster seats for an additional fee. Please request them when making your reservation."
    }
  ];

  const faqsSq = [
    {
      question: "Çfarë më duhet për të marrë me qera një makinë në Tiranë?",
      answer: "Ju nevojitet një leje drejtimi e vlefshme (minimumi 1 vit), pasaportë ose kartë ID, kartë krediti për garanci dhe mosha minimale 21 vjeç. Rekomandohet leja ndërkombëtare drejtimi për qytetarët jo-EU."
    },
    {
      question: "A ofroni shërbim marrjeje në aeroport?",
      answer: "Po, ofrojmë shërbim falas marrjeje dhe dorëzimi në Aeroportin Ndërkombëtar të Tiranës (TIA/Rinas). Ekipi ynë do t'ju takojë në aeroport me makinën tuaj të gatshme."
    },
    {
      question: "Çfarë mbulimi sigurimi përfshihet?",
      answer: "Të gjitha qerat tona përfshijnë mbulim të plotë sigurimi me mbrojtje bazë. Opsione shtesë mbulimi si dëmshpërblimi i përplasjes dhe sigurimi i aksidentit personal janë të disponueshme për mbrojtje shtesë."
    },
    {
      question: "A mund të marr me qera një makinë për vetëm një ditë?",
      answer: "Po, ofrojmë periudha fleksibël qeraje nga 1 ditë deri në qera afatgjata. Na kontaktoni për tarifa të veçanta për qera të zgjeruara prej 7 ditësh ose më shumë."
    },
    {
      question: "Çfarë metodash pagese pranoni?",
      answer: "Pranojmë karta krediti (Visa, MasterCard), karta debiti, para në dorë (EUR) dhe transferta bankare. Një kartë krediti kërkohet për depozitën e sigurisë."
    },
    {
      question: "A ofroni qera një drejtim?",
      answer: "Po, ofrojmë qera një drejtim brenda Shqipërisë. Mund të aplikohen tarifa shtesë në varësi të distancës dhe vendndodhjes së kthimit."
    },
    {
      question: "Çfarë ndodh nëse kam një aksident?",
      answer: "Në rast aksidenti, na kontaktoni menjëherë. Do t'ju udhëzojmë përmes procesit dhe do t'ju ndihmojmë me kërkesat e sigurimit. Gjithmonë telefononi shërbimet e emergjencës lokale nëse nevojiten."
    },
    {
      question: "A mund të shtoj shoferë shtesë?",
      answer: "Po, mund të shtoni shoferë shtesë për një tarifë të vogël. Të gjithë shoferët duhet të plotësojnë të njëjtat kërkesa dhe të jenë të pranishëm gjatë marrjes."
    },
    {
      question: "Çfarë politike karburanti keni?",
      answer: "Operojmë me një politikë 'plotë-nga-plotë' karburanti. Ju merrni makinën me një rezervuar të plotë dhe duhet ta ktheni me një rezervuar të plotë. Kostot e karburantit nuk përfshiren në çmimin e qerasë."
    },
    {
      question: "A ofroni sende për fëmijë?",
      answer: "Po, ofrojmë sende për fëmijë dhe sende për ngritje për një tarifë shtesë. Ju lutemi t'i kërkoni kur bëni rezervimin tuaj."
    }
  ];

  const currentFaqs = language === 'sq' ? faqsSq : faqs;

  const handleContactClick = (type) => {
    if (type === 'phone') {
      window.open('tel:+355-4-123-4567', '_self')
    } else if (type === 'email') {
      window.open('mailto:info@memarental.com', '_self')
    }
  }

  return (
    <>
      <Seo
        title={language === 'sq' 
          ? 'Pyetje të Bëra Shpesh - Qera Makinash në Tiranë'
          : 'Frequently Asked Questions - Car Rental in Tirana'
        }
        description={language === 'sq' 
          ? 'Pyetje të bëra shpesh për qeranë e makinave në Tiranë. Gjeni përgjigjet për të gjitha pyetjet tuaja rreth qerasë së makinave në Shqipëri.'
          : 'Frequently asked questions about car rental in Tirana. Find answers to all your questions about car rental in Albania.'
        }
        path="/faq"
        schema={[
          generateLocalBusinessSchema(),
          generateBreadcrumbSchema(breadcrumbs),
          generateFAQSchema(currentFaqs)
        ]}
        language={language}
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
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              
              {/* Light rays effect */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-yellow-300/30 via-yellow-200/20 to-transparent animate-pulse"></div>
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-orange-300/20 via-orange-200/15 to-transparent animate-pulse animation-delay-1000"></div>
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-yellow-300/25 via-yellow-200/15 to-transparent animate-pulse animation-delay-2000"></div>
              </div>
            </div>

            <div className="container-mobile py-8 sm:py-12 lg:py-16 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-yellow-200 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/50 to-orange-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Sparkles className="h-4 w-4 relative z-10 animate-pulse" />
                <span className="relative z-10">FAQ • Help Center</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.div>

              <motion.h1
                {...fadeUp}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground text-balance leading-tight relative mb-6"
              >
                <span className="relative">
              {language === 'sq' ? 'Pyetje të Bëra Shpesh' : 'Frequently Asked Questions'}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed"
              >
              {language === 'sq' 
                ? 'Gjeni përgjigjet për të gjitha pyetjet tuaja rreth qerasë së makinave në Tiranë, Shqipëri.'
                : 'Find answers to all your questions about car rental in Tirana, Albania.'
              }
              </motion.p>
          </div>
        </section>

        {/* FAQ Section */}
          <section className="py-16 lg:py-24 bg-white relative" aria-labelledby="faq-title">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white"></div>
            
            {/* Light rays for FAQ section */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-0 w-px h-1/2 bg-gradient-to-b from-yellow-300/20 via-yellow-200/15 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 right-0 w-px h-1/2 bg-gradient-to-b from-orange-300/15 via-orange-200/10 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div 
                {...fadeUp}
                className="mx-auto max-w-4xl"
              >
                <div className="grid gap-6">
              {currentFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Card className="p-0 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden rounded-2xl relative">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                          <Accordion type="single" collapsible>
                            <AccordionItem value={`faq-${index}`} className="border-0">
                              <AccordionTrigger className="px-8 py-6 text-left hover:text-yellow-600 transition-colors font-semibold text-lg group-hover:bg-yellow-50/50 rounded-t-2xl">
                                <div className="flex items-center gap-4 w-full">
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform duration-300">
                                    {index + 1}
                                  </div>
                                  <span className="flex-1 text-left">{faq.question}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-8 pb-6 pt-0">
                                <div className="pl-12">
                                  <p className="text-muted-foreground leading-relaxed text-base text-pretty">
                    {faq.answer}
                  </p>
                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </Card>
                    </motion.div>
              ))}
            </div>
              </motion.div>
          </div>
        </section>

        {/* Contact CTA Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
            
            {/* Light rays for CTA */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-white/30 via-white/20 to-transparent animate-pulse"></div>
              <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-white/25 via-white/15 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="container-mobile relative z-10">
              <motion.div {...fadeUp} className="text-center space-y-8">
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-balance">
              {language === 'sq' 
                ? 'Nuk Gjetët Përgjigjen?'
                : 'Didn\'t Find Your Answer?'
              }
            </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto text-pretty">
              {language === 'sq' 
                ? 'Na kontaktoni për ndihmë shtesë ose pyetje specifike rreth qerasë së makinave në Tiranë.'
                : 'Contact us for additional help or specific questions about car rental in Tirana.'
              }
            </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    className="bg-white text-yellow-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                    onClick={() => handleContactClick('phone')}
                  >
                    <span className="flex items-center relative z-10">
                {language === 'sq' ? 'Na Telefononi' : 'Call Us'}
                      <Phone className="ml-2 h-5 w-5 group-hover:animate-pulse" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-yellow-600 font-semibold px-8 py-6 text-lg bg-transparent transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                    onClick={() => handleContactClick('email')}
                  >
                    <span className="flex items-center relative z-10">
                {language === 'sq' ? 'Na Emailoni' : 'Email Us'}
                      <Mail className="ml-2 h-5 w-5 group-hover:animate-pulse" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-white/80 justify-center">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+355-4-123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>info@memarental.com</span>
            </div>
                </div>
              </motion.div>
          </div>
        </section>
        </main>
      </div>
    </>
  );
};

export default FAQPage;

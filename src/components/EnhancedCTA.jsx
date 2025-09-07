import React from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  Calendar,
  Car
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

const EnhancedCTA = ({ 
  variant = "default", // "default", "minimal"
  title,
  subtitle,
  primaryButton = { text: "Book Now", link: "/cars", icon: Calendar },
  secondaryButton = { text: "Contact Us", link: "/contact", icon: Phone },
  showContactInfo = false,
  className = "",
  ...props 
}) => {
  const { language } = useLanguage()
  const prefersReducedMotion = useReducedMotion()

  // Simple animation
  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" },
  }

  // Default content based on variant
  const getDefaultContent = () => {
    switch (variant) {
      case "minimal":
        return {
          title: language === "sq" 
            ? "Gati për të Filluar Udhëtimin Tuaj?" 
            : "Ready to Start Your Journey?",
          subtitle: language === "sq"
            ? "Rezervoni makinën tuaj të përsosur të qirasë sot"
            : "Book your perfect rental car today",
          primaryButton: {
            text: language === "sq" ? "Rezervoni Tani" : "Book Now",
            link: "/cars",
            icon: Calendar
          },
          secondaryButton: {
            text: language === "sq" ? "Kontakt" : "Contact",
            link: "/contact",
            icon: Phone
          }
        }
      default:
        return {
          title: language === "sq" 
            ? "Gati për të Eksploruar Shqipërinë?" 
            : "Ready to Explore Albania?",
          subtitle: language === "sq"
            ? "Rezervoni makinën tuaj premium të qirasë sot"
            : "Book your premium rental car today",
          primaryButton: {
            text: language === "sq" ? "Rezervoni Tani" : "Book Now",
            link: "/cars",
            icon: Calendar
          },
          secondaryButton: {
            text: language === "sq" ? "Kontakt" : "Contact",
            link: "/contact",
            icon: Phone
          }
        }
    }
  }

  const content = {
    title: title || getDefaultContent().title,
    subtitle: subtitle || getDefaultContent().subtitle,
    primaryButton: { ...getDefaultContent().primaryButton, ...primaryButton },
    secondaryButton: { ...getDefaultContent().secondaryButton, ...secondaryButton }
  }

  return (
    <section className={`py-12 sm:py-16 bg-gradient-to-r from-yellow-500 to-orange-500 relative ${className}`} {...props}>
      <div className="container-mobile">
        <motion.div {...fadeUp} className="text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
            {content.title}
          </h2>
          <p className="text-white/95 max-w-2xl mx-auto text-base sm:text-lg">
            {content.subtitle}
          </p>
          <div className="flex justify-center items-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-yellow-600 px-8 py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px] bg-transparent backdrop-blur-sm"
            >
              {content.secondaryButton.link.startsWith('tel:') || content.secondaryButton.link.startsWith('mailto:') ? (
                <a href={content.secondaryButton.link} className="text-white hover:text-yellow-600">
                  <span className="flex items-center">
                    <content.secondaryButton.icon className="mr-2 h-4 w-4" />
                    {content.secondaryButton.text}
                  </span>
                </a>
              ) : (
                <Link to={content.secondaryButton.link} className="text-white hover:text-yellow-600">
                  <span className="flex items-center">
                    <content.secondaryButton.icon className="mr-2 h-4 w-4" />
                    {content.secondaryButton.text}
                  </span>
                </Link>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default EnhancedCTA

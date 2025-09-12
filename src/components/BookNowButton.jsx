import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Calendar } from "lucide-react"
import { useMobileMenu } from "@/contexts/MobileMenuContext"

const BookNowButton = () => {
  const { isMobileMenuOpen } = useMobileMenu()
  const location = useLocation()
  
  // Don't show on admin pages or booking pages
  const shouldShow = !location.pathname.startsWith('/admin') && 
                    !location.pathname.startsWith('/booking') &&
                    !location.pathname.startsWith('/booking-confirmation') &&
                    !isMobileMenuOpen

  if (!shouldShow) return null

  return (
    <div className="fixed bottom-4 right-16 sm:bottom-6 sm:right-20 lg:hidden z-[60]">
      <Link 
        to="/cars" 
        aria-label="Book a car now"
        className="
          inline-flex items-center justify-center gap-2
          bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-hover hover:to-brand-secondary-hover
          text-white rounded-full p-3 sm:p-4
          shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          transform hover:scale-110 active:scale-95
          group
          font-semibold text-sm sm:text-base
        "
      >
        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-300" />
        <span className="hidden sm:inline">Book Now</span>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            Book your car now
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default BookNowButton
import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Car, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"
import { useMobileMenu } from "@/contexts/MobileMenuContext"
import { supabase } from "@/lib/customSupabaseClient"

const BookNowButton = () => {
  const { t } = useLanguage()
  const { isMobileMenuOpen } = useMobileMenu()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [availableCars, setAvailableCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [showButton, setShowButton] = useState(false)

  // Don't show on admin pages or booking pages
  const shouldShow = !location.pathname.startsWith('/admin') && 
                    !location.pathname.startsWith('/booking') &&
                    !location.pathname.startsWith('/booking-confirmation') &&
                    !isMobileMenuOpen

  // Fetch available cars for quick booking
  const fetchAvailableCars = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('id, brand, model, daily_rate, image_url')
        .eq('status', 'available')
        .order('daily_rate', { ascending: true })
        .limit(3)

      if (error) throw error
      setAvailableCars(data || [])
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show button after a delay to avoid being annoying
  useEffect(() => {
    if (shouldShow) {
      const timer = setTimeout(() => {
        setShowButton(true)
      }, 3000) // Show after 3 seconds
      return () => clearTimeout(timer)
    } else {
      setShowButton(false)
    }
  }, [shouldShow])

  // Fetch cars when expanded
  useEffect(() => {
    if (isExpanded && availableCars.length === 0) {
      fetchAvailableCars()
    }
  }, [isExpanded])

  const handleQuickBook = (carId) => {
    navigate(`/booking/${carId}`)
    setIsExpanded(false)
  }

  const handleBrowseCars = () => {
    navigate('/cars')
    setIsExpanded(false)
  }

  if (!showButton) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[60]"
      >
        {/* Main Book Now Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
            size="lg"
          >
            <Calendar className="h-5 w-5 mr-2" />
            <span className="font-semibold">{t('bookNow')}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="h-4 w-4 ml-2" />
            </motion.div>
          </Button>

          {/* Quick booking dropdown */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full mb-3 left-0 w-80 sm:w-96"
              >
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Car className="h-4 w-4 mr-2 text-yellow-600" />
                        {t('quickBooking')}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(false)}
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mx-auto"></div>
                          <p className="text-sm text-gray-500 mt-2">{t('loading')}</p>
                        </div>
                      ) : availableCars.length > 0 ? (
                        <>
                          <p className="text-sm text-gray-600 mb-3">
                            {t('quickBookAvailable')}
                          </p>
                          <div className="space-y-2">
                            {availableCars.map((car) => (
                              <motion.div
                                key={car.id}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => handleQuickBook(car.id)}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                    {car.image_url ? (
                                      <img
                                        src={car.image_url}
                                        alt={`${car.brand} ${car.model}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Car className="h-5 w-5 text-gray-400" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm text-gray-900">
                                      {car.brand} {car.model}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      €{car.daily_rate}/day
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xs px-3 py-1"
                                >
                                  {t('bookNow')}
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <Car className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 mb-3">
                            {t('noCarsAvailable')}
                          </p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-200">
                        <Button
                          onClick={handleBrowseCars}
                          variant="outline"
                          className="w-full text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                        >
                          {t('browseAllCars')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BookNowButton

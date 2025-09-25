"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Seo from "@/components/Seo"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Search,
  Filter,
  X,
  Car,
  Sparkles,
  Calendar,
} from "lucide-react"
import { supabase } from "@/lib/customSupabaseClient"
import { getAvailableCarImages } from "@/lib/addCarsToDatabase"
import { bookingService } from "@/lib/bookingService"
import { DatePicker } from "@/components/ui/date-picker"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import CarCardWithSlider from "@/components/CarCardWithSlider"

// Normalize car records for consistent UI
const normalizeCarRecord = (record) => {
  const dailyRate = Number(record?.daily_rate) || 0
  const category = dailyRate > 70 ? "Luxury" : dailyRate > 50 ? "Premium" : "Economy"
  const transmission = (record?.transmission || "").toLowerCase() === "manual" ? "Manual" : "Automatic"
  const fuelType = (record?.fuel_type || "").toLowerCase()
  const fuel = fuelType ? fuelType.charAt(0).toUpperCase() + fuelType.slice(1) : "Petrol"
  const isAvailable = (record?.status || "available") === "available"
  
  // Generate fallback image based on brand and model using actual photos
  const getFallbackImage = (brand, model) => {
    const brandLower = brand?.toLowerCase() || 'car'
    const modelLower = model?.toLowerCase() || ''
    
    if (brandLower.includes('mercedes')) {
      // Use specific model images for Mercedes-Benz
      if (modelLower.includes('c-class') || modelLower.includes('c class')) {
        return "/images/cars/c-class1.jpeg"
      } else if (modelLower.includes('e-class') || modelLower.includes('e class')) {
        return "/images/cars/e class1.jpeg"
      }
      return "/images/cars/c-class1.jpeg" // Default Mercedes fallback
    } else if (brandLower.includes('volkswagen')) {
      // Use specific model images for Volkswagen
      if (modelLower.includes('passat')) {
        return "/images/cars/passat1.jpeg"
      } else if (modelLower.includes('jetta')) {
        return "/images/cars/jetta1.jpeg"
      }
      return "/images/cars/jetta1.jpeg" // Default Volkswagen fallback
    } else if (brandLower.includes('toyota')) {
      return "/images/cars/yaris1.jpeg"
    } else if (brandLower.includes('hyundai')) {
      return "/images/cars/santa%20fe1.jpeg"
    } else if (brandLower.includes('volvo')) {
      return "/images/cars/xc601.jpeg"
    } else {
      return "/images/cars/placeholder-car.jpg"
    }
  }

  // Prefer local images from public/images/cars for the Cars page
  const brandImages = getAvailableCarImages()[record?.brand] || []
  let localBrandImage = brandImages[0]
  
  // For Mercedes-Benz and Volkswagen, select model-specific images
  if ((record?.brand === 'Mercedes-Benz' || record?.brand === 'Volkswagen') && brandImages.length > 0) {
    const modelLower = record?.model?.toLowerCase() || ''
    
    if (record?.brand === 'Mercedes-Benz') {
      if (modelLower.includes('c-class') || modelLower.includes('c class')) {
        localBrandImage = brandImages.find(img => img.includes('c-class')) || brandImages[0]
      } else if (modelLower.includes('e-class') || modelLower.includes('e class')) {
        localBrandImage = brandImages.find(img => img.includes('e class')) || brandImages[0]
      }
    } else if (record?.brand === 'Volkswagen') {
      if (modelLower.includes('passat')) {
        localBrandImage = brandImages.find(img => img.includes('passat')) || brandImages[0]
      } else if (modelLower.includes('jetta')) {
        localBrandImage = brandImages.find(img => img.includes('jetta')) || brandImages[0]
      }
    }
  }
  
  return {
    id: record?.id,
    brand: record?.brand || "Unknown",
    model: record?.model || "",
    year: record?.year || new Date().getFullYear(),
    price: dailyRate,
    rating: 4.8,
    reviews: Number(record?.reviews) || 0,
    seats: record?.seats ?? 5,
    fuel,
    transmission,
    available: isAvailable,
    category,
    mileage: "Unlimited",
    location: record?.location || "Tirana",
    features: record?.features?.length ? record.features : ["Bluetooth", "Air Conditioning"],
    pickupTime: "24/7",
    popular: dailyRate >= 70,
    discount: Number(record?.discount) || 0,
    created_at: record?.created_at,
    engine: record?.engine || "",
    luggage: record?.luggage || 2,
    // Force usage of local images in the Cars page grid
    image_url: localBrandImage || getFallbackImage(record?.brand, record?.model),
  }
}

const CarsPage = () => {
  const { t, tFormat } = useLanguage()
  const prefersReducedMotion = useReducedMotion()

  // UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [transmissionFilter, setTransmissionFilter] = useState("all")
  const [fuelFilter, setFuelFilter] = useState("all")
  const [seatsFilter, setSeatsFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recommended")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cars, setCars] = useState([])
  
  // Date filter state
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [carAvailability, setCarAvailability] = useState({})
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false)
  

  // Animation variants
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

  // Persist view mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cars_view_mode", "grid") // Keep grid view for now
    }
  }, [])

  // Debounce search to reduce re-renders and CPU
  useEffect(() => {
    const tId = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 250)
    return () => clearTimeout(tId)
  }, [searchTerm])

  // Check car availability when dates are selected
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!pickupDate || !returnDate || cars.length === 0) {
        setCarAvailability({});
        return;
      }

      // Validate dates
      const pickup = new Date(pickupDate);
      const dropoff = new Date(returnDate);
      if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime()) || pickup >= dropoff) {
        console.warn("Invalid date range provided:", { pickupDate, returnDate });
        setCarAvailability({});
        return;
      }

      // Debounce to reduce churn
      setCheckingAvailability(true);
      const handle = setTimeout(async () => {
        try {
          const ids = cars.map((c) => c.id);
          const map = await bookingService.getAvailabilityForCars(ids, pickupDate, returnDate);
          if (!cancelled) {
            setCarAvailability(map);
            const available = Object.entries(map).filter(([, v]) => v === true).length;
            const unavailable = Object.entries(map).filter(([, v]) => v === false).length;
          }
        } catch (e) {
          console.error("Batch availability error:", e);
          if (!cancelled) setCarAvailability({});
        } finally {
          if (!cancelled) setCheckingAvailability(false);
        }
      }, 350);

      return () => clearTimeout(handle);
    };

    const done = run();
    return () => {
      cancelled = true;
    };
  }, [pickupDate, returnDate, cars])

  // Load cars
  useEffect(() => {
    let isMounted = true
    const loadCars = async () => {
      setIsLoading(true)
      try {
        // Try ordering by created_at (preferred). If the column doesn't exist, retry ordering by id.
        let { data, error } = await supabase
          .from("cars")
          .select("*")
          .order("created_at", { ascending: false })

        // If created_at is missing (undefined column), fall back to ordering by id
        if (error && (error.code === "42703" || /column .*created_at.* does not exist/i.test(error.message))) {
          console.warn('created_at column not found, falling back to id ordering')
          const retry = await supabase
            .from("cars")
            .select("*")
            .order("id", { ascending: false })
          data = retry.data
          error = retry.error
        }

        if (!isMounted) return
        
        if (error) {
          console.error("Database error loading cars:", error)
          throw new Error(`Failed to load cars: ${error.message}`)
        }
        
        if (!data || data.length === 0) {
          console.warn("No cars found in database")
          if (isMounted) setCars([])
          return
        }
        
        const normalizedCars = data.map(normalizeCarRecord)
        if (isMounted) setCars(normalizedCars)
      } catch (err) {
        console.error("Failed to load cars:", err)
        if (isMounted) {
          setCars([])
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadCars()
    return () => {
      isMounted = false
    }
  }, [])

  const brands = useMemo(() => {
    const s = new Set()
    for (const c of cars) s.add(c.brand)
    return Array.from(s).sort((a, b) => a.localeCompare(b))
  }, [cars])

  const categories = useMemo(() => {
    const s = new Set()
    for (const c of cars) s.add(c.category)
    return Array.from(s)
  }, [cars])

  // Filtering cars - optimized with useMemo to prevent unnecessary re-renders
  const filteredCars = useMemo(() => {
    const term = debouncedSearch.toLowerCase()
    
    // If dates are selected but we're still checking availability, don't show any cars
    if (pickupDate && returnDate && checkingAvailability) {
      return []
    }
    
    let list = cars.filter((car) => {
      const matchesSearch = !term || car.brand.toLowerCase().includes(term) || car.model.toLowerCase().includes(term)
      
      // Price filter logic
      let matchesPrice = true
      if (priceFilter && priceFilter !== "all") {
        if (priceFilter === "0-30") {
          matchesPrice = car.price <= 30
        } else if (priceFilter === "30-50") {
          matchesPrice = car.price > 30 && car.price <= 50
        } else if (priceFilter === "50-70") {
          matchesPrice = car.price > 50 && car.price <= 70
        } else if (priceFilter === "70+") {
          matchesPrice = car.price > 70
        }
      }
      
      // Brand filter logic
      const matchesBrand = brandFilter === 'all' || car.brand.toLowerCase() === brandFilter.toLowerCase()
      
      // Category filter logic
      const matchesCategory = categoryFilter === 'all' || car.category.toLowerCase() === categoryFilter.toLowerCase()
      
      // Transmission filter logic
      const matchesTransmission = transmissionFilter === 'all' || car.transmission.toLowerCase() === transmissionFilter.toLowerCase()
      
      // Fuel filter logic
      const matchesFuel = fuelFilter === 'all' || car.fuel.toLowerCase() === fuelFilter.toLowerCase()
      
      // Seats filter logic
      const matchesSeats = seatsFilter === 'all' || car.seats.toString() === seatsFilter
      
      // Date availability filter logic
      let matchesDates = true;
      if (pickupDate && returnDate) {
        // Only show cars explicitly marked available
        matchesDates = carAvailability[car.id] === true;
        if (!matchesDates) {
          // Optional debug (keep it if helpful)
        }
      }
      
      return matchesSearch && matchesPrice && matchesBrand && matchesCategory && matchesTransmission && matchesFuel && matchesSeats && matchesDates
    })

    // Sorting
    const sorted = [...list]
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "popular":
        sorted.sort((a, b) => (a.popular ? -1 : 1))
        break
      default:
        // recommended: popular first, then rating, then price
        sorted.sort((a, b) => {
          if (a.popular !== b.popular) return a.popular ? -1 : 1
          if (a.rating !== b.rating) return b.rating - a.rating
          return a.price - b.price
        })
    }
    return sorted
  }, [cars, debouncedSearch, priceFilter, brandFilter, categoryFilter, transmissionFilter, fuelFilter, seatsFilter, sortBy, pickupDate, returnDate, carAvailability, checkingAvailability])

  const visibleCars = useMemo(() => filteredCars.slice(0, 9), [filteredCars]) // Show 9 cars per page

  // Calculate availability statistics
  const availabilityStats = useMemo(() => {
    if (!pickupDate || !returnDate || Object.keys(carAvailability).length === 0) {
      return { available: cars.length, total: cars.length, unavailable: 0 }
    }
    
    const available = cars.filter(car => carAvailability[car.id] === true).length
    const unavailable = cars.filter(car => carAvailability[car.id] === false).length
    const total = cars.length
    
    return { available, total, unavailable }
  }, [cars, carAvailability, pickupDate, returnDate])

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Car Rental Fleet - MEMA Rental Tirana Albania",
    description:
      "Browse our complete fleet of rental cars in Tirana, Albania. From economy to luxury vehicles. Best car rental service in Tirana with competitive rates.",
    url: "https://memarental.com/cars",
    numberOfItems: cars.length,
    provider: {
      "@type": "Organization",
      name: "MEMA Rental - Car Rental Tirana Albania",
      alternateName: "MEMA Car Rental",
      url: "https://memarental.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rruga e Durresit 123",
        addressLocality: "Tirana",
        addressRegion: "Tirana",
        postalCode: "1001",
        addressCountry: "AL",
      },
      telephone: "+355-4-123-4567",
      email: "info@memarental.com",
      openingHours: ["Mo-Su 08:00-20:00"],
    },
    areaServed: { "@type": "Country", name: "Albania" },
    serviceArea: { "@type": "Place", name: "Tirana, Albania" },
    itemListElement: cars.map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Car",
        name: `${car.brand} ${car.model} - Car Rental in Tirana, Albania`,
        description: `${car.year} ${car.brand} ${car.model} for rent in Tirana, Albania. Available for car rental in Tirana.`,
        brand: { "@type": "Brand", name: car.brand },
        model: car.model,
        vehicleModelDate: String(car.year),
        vehicleSeatingCapacity: car.seats,
        fuelType: car.fuel,
        vehicleTransmission: car.transmission,
        offers: {
          "@type": "Offer",
          price: car.price,
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: car.price,
            priceCurrency: "EUR",
            unitText: "per day",
          },
          availability: car.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      },
    })),
  }

  // Accessibility: focus first filter control when opening filter panel
  useEffect(() => {
    if (showFilters) {
      // Find the first filter element and focus it
      const firstFilterElement = document.querySelector('#filter-panel .grid > div:first-child');
      if (firstFilterElement) {
        firstFilterElement.focus();
      }
    }
  }, [showFilters])

  const clearAll = () => {
    setSearchTerm("")
    setPriceFilter("all")
    setBrandFilter("all")
    setCategoryFilter("all")
    setTransmissionFilter("all")
    setFuelFilter("all")
    setSeatsFilter("all")
    setSortBy("recommended")
    setPickupDate("")
    setReturnDate("")
  }

  const handleDateSelection = () => {
    if (pickupDate && returnDate) {
      setIsDateDialogOpen(false)
    }
  }

  const formatDateRange = () => {
    if (!pickupDate || !returnDate) return "Select Dates"
    
    try {
      // Parse dates safely
      const pickupDateObj = new Date(pickupDate + 'T00:00:00')
      const returnDateObj = new Date(returnDate + 'T00:00:00')
      
      // Validate dates
      if (isNaN(pickupDateObj.getTime()) || isNaN(returnDateObj.getTime())) {
        return "Invalid Dates"
      }
      
      // Format dates in European timezone
      const pickup = pickupDateObj.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short',
        timeZone: 'Europe/Rome'
      })
      const returnDateFormatted = returnDateObj.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short',
        timeZone: 'Europe/Rome'
      })
      
      // Calculate duration
      const diffTime = returnDateObj - pickupDateObj;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return `${pickup} → ${returnDateFormatted} (${diffDays} day${diffDays !== 1 ? 's' : ''})`
    } catch (error) {
      console.error('Error formatting date range:', error)
      return "Select Dates"
    }
  }

  return (
    <>
      <Seo
        title={t("seoCarsTitle") || "Car Fleet - Premium Rental Cars in Tirana, Albania | MEMA Rental"}
        description={t("seoCarsDescription") || "Choose from our premium fleet of rental cars in Tirana, Albania. From economy to luxury vehicles, all fully insured with 24/7 support. Book your perfect car today!"}
        path="/cars"
        image="https://memarental.com/cars-image.jpg"
        keywords="car rental fleet Tirana, car rental vehicles Albania, rent BMW Tirana, rent Mercedes Albania, rent Audi Tirana, rent Toyota Albania, rent Volkswagen Tirana, rent Ford Albania, luxury car rental Tirana, economy car rental Albania, SUV rental Tirana, car hire fleet Albania, Tirana car rental vehicles, Albania car rental selection, best car rental Tirana, car rental service Albania, Tirana airport car rental, Albania car hire service"
        schema={structuredData}
      />

      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* Breadcrumb Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-2" aria-label="Breadcrumb">
        <div className="container-mobile">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-yellow-600 transition-colors">
                {t('home') || 'Home'}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">
              {t('cars') || 'Cars'}
            </li>
          </ol>
        </div>
      </nav>

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
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 sm:py-12 lg:py-16">
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
                  <span className="relative z-10">Premium Fleet • 50+ Vehicles • Fully Insured</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.div>

                <motion.h1
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 }}
                  className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground text-balance leading-tight"
                >
                  <span className="relative">
                    Choose Your Perfect
                    <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Rental Car</span>
                  </span>
                </motion.h1>

                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.2 }}
                  className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed"
                >
                  From compact city cars to luxury SUVs, our premium fleet offers the perfect vehicle for every journey. 
                  All cars are fully insured, regularly maintained, and ready for your Albanian adventure.
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Search and Filters Section */}
          <section className="py-6 bg-white/80 backdrop-blur-sm border-b border-gray-100">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search cars by brand, model, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  />
                </div>

                {/* Date Filter and Filter Toggle */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {/* Enhanced Select Dates Button */}
                  <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button
                          variant="default"
                          size="lg"
                          className="px-6 sm:px-8 py-3 sm:py-4 group relative overflow-hidden"
                        >
                          <Calendar className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-semibold">
                            {formatDateRange()}
                          </span>
                          {pickupDate && returnDate && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </Button>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] sm:w-auto sm:max-w-3xl p-0 overflow-hidden max-h-[95vh] overflow-y-auto">
                      <div className="bg-gradient-to-br from-brand-primary/5 via-white to-brand-secondary/5">
                        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
                          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center">
                            <Calendar className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                            Select Your Rental Dates
                          </DialogTitle>
                          <p className="text-white/90 text-xs sm:text-sm mt-1">
                            Choose your pickup and return dates to see available cars
                          </p>
                        </DialogHeader>
                        
                        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                          {/* Date Selection Section */}
                          <div className="space-y-4">
                            <div className="text-center">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Select Your Dates</h3>
                              <p className="text-xs sm:text-sm text-gray-600">Choose pickup and return dates to filter available cars</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                              {/* Pickup Date Card */}
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="relative"
                              >
                                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                  <label className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 block flex items-center">
                                    <div className="h-2 w-2 sm:h-3 sm:w-3 bg-brand-success rounded-full mr-2 sm:mr-3"></div>
                                    Pickup Date
                                  </label>
                                  <DatePicker
                                    value={pickupDate}
                                    onChange={setPickupDate}
                                    placeholder="Select pickup date"
                                    minDate={(() => {
                                      const today = new Date();
                                      const europeanToday = new Date(today.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
                                      const year = europeanToday.getFullYear();
                                      const month = String(europeanToday.getMonth() + 1).padStart(2, '0');
                                      const day = String(europeanToday.getDate()).padStart(2, '0');
                                      return `${year}-${month}-${day}`;
                                    })()}
                                    className="w-full"
                                  />
                                  {pickupDate && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-2 sm:mt-3 text-xs text-brand-success font-medium flex items-center"
                                    >
                                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-brand-success rounded-full mr-1.5 sm:mr-2"></div>
                                      Pickup date selected
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>

                              {/* Return Date Card */}
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative"
                              >
                                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                  <label className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 block flex items-center">
                                    <div className="h-2 w-2 sm:h-3 sm:w-3 bg-brand-secondary rounded-full mr-2 sm:mr-3"></div>
                                    Return Date
                                  </label>
                                  <DatePicker
                                    value={returnDate}
                                    onChange={setReturnDate}
                                    placeholder="Select return date"
                                    minDate={pickupDate || (() => {
                                      const today = new Date();
                                      const europeanToday = new Date(today.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
                                      const year = europeanToday.getFullYear();
                                      const month = String(europeanToday.getMonth() + 1).padStart(2, '0');
                                      const day = String(europeanToday.getDate()).padStart(2, '0');
                                      return `${year}-${month}-${day}`;
                                    })()}
                                    className="w-full"
                                  />
                                  {returnDate && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-2 sm:mt-3 text-xs text-brand-secondary font-medium flex items-center"
                                    >
                                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-brand-secondary rounded-full mr-1.5 sm:mr-2"></div>
                                      Return date selected
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                            </div>
                          </div>

                          {/* Date Range Summary */}
                          {pickupDate && returnDate && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-xl p-4 sm:p-5 border border-brand-primary/20"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center shadow-lg">
                                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800 text-base sm:text-lg">Rental Period</p>
                                    <p className="text-xs sm:text-sm text-gray-600">{formatDateRange()}</p>
                                  </div>
                                </div>
                                <div className="text-left sm:text-right">
                                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Duration</p>
                                  <p className="font-bold text-brand-primary text-lg sm:text-xl">
                                    {(() => {
                                      const pickup = new Date(pickupDate);
                                      const returnDateObj = new Date(returnDate);
                                      const diffTime = returnDateObj - pickup;
                                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
                                    })()}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Action Buttons */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4"
                          >
                            <Button
                              onClick={handleDateSelection}
                              disabled={!pickupDate || !returnDate}
                              variant="default"
                              className="flex-1 py-3 sm:py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg touch-manipulation"
                            >
                              <Calendar className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                              Apply Dates
                            </Button>
                            <Button
                              onClick={() => {
                                setPickupDate("")
                                setReturnDate("")
                              }}
                              variant="secondary"
                              className="flex-1 py-3 sm:py-4 font-semibold transition-all duration-300 text-base sm:text-lg touch-manipulation"
                            >
                              <X className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                              Clear All
                            </Button>
                          </motion.div>

                          {/* Helpful Tips */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-brand-primary/5 rounded-lg p-4 sm:p-5 border border-brand-primary/20"
                          >
                            <div className="flex items-start space-x-3 sm:space-x-4">
                              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs sm:text-sm font-bold">i</span>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-brand-primary mb-1 sm:mb-2">Pro Tips</p>
                                <ul className="text-xs sm:text-sm text-brand-primary/80 space-y-1">
                                  <li>• Select dates to see real-time availability</li>
                                  <li>• Unavailable dates are marked with an X</li>
                                  <li>• Minimum rental period is 1 day</li>
                                  <li>• All cars are fully insured and maintained</li>
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Filter Toggle */}
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    size="lg"
                    className="px-6 py-3 group"
                  >
                    <Filter className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </span>
                  </Button>
                </div>

                {/* Availability Status */}
                {checkingAvailability && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand-info"></div>
                      <span>Checking availability against booking data...</span>
                    </div>
                  </div>
                )}
                {pickupDate && returnDate && !checkingAvailability && (
                  <div className="flex justify-center">
                    <div className="text-sm text-brand-success font-medium bg-brand-success/10 px-4 py-2 rounded-lg border border-brand-success/20">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-brand-success rounded-full animate-pulse"></div>
                        <span>Showing {availabilityStats.available} available cars</span>
                        <span className="text-xs text-brand-success/80">
                          ({availabilityStats.unavailable} cars are booked for {formatDateRange()})
                        </span>
                      </div>
                    </div>
                  </div>
                )}


                {/* Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                 {/* Price Filter */}
                         <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Price Range</label>
                           <Select value={priceFilter} onValueChange={setPriceFilter}>
                             <SelectTrigger className="border-2 border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20">
                               <SelectValue placeholder="Select Price" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="all">Any Price</SelectItem>
                               <SelectItem value="0-30">€0 - €30</SelectItem>
                               <SelectItem value="30-50">€30 - €50</SelectItem>
                               <SelectItem value="50-70">€50 - €70</SelectItem>
                               <SelectItem value="70+">€70+</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>

                                                 {/* Brand Filter */}
                         <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Brand</label>
                           <Select value={brandFilter} onValueChange={setBrandFilter}>
                             <SelectTrigger className="border-2 border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20">
                               <SelectValue placeholder="Select Brand" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="all">Any Brand</SelectItem>
                               {brands.map((brand) => (
                                 <SelectItem key={brand} value={brand}>
                                   {brand}
                                 </SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                         </div>

                                                 {/* Category Filter */}
                         <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Category</label>
                           <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                             <SelectTrigger className="border-2 border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20">
                               <SelectValue placeholder="Select Category" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="all">Any Category</SelectItem>
                               <SelectItem value="economy">Economy</SelectItem>
                               <SelectItem value="premium">Premium</SelectItem>
                               <SelectItem value="luxury">Luxury</SelectItem>
                               <SelectItem value="suv">SUV</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>

                                                 {/* Transmission Filter */}
                         <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Transmission</label>
                           <Select value={transmissionFilter} onValueChange={setTransmissionFilter}>
                             <SelectTrigger className="border-2 border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20">
                               <SelectValue placeholder="Select Transmission" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="all">Any Transmission</SelectItem>
                               <SelectItem value="automatic">Automatic</SelectItem>
                               <SelectItem value="manual">Manual</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>

                                                 {/* Fuel Filter */}
                         <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Fuel Type</label>
                           <Select value={fuelFilter} onValueChange={setFuelFilter}>
                             <SelectTrigger className="border-2 border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20">
                               <SelectValue placeholder="Select Fuel Type" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="all">Any Fuel Type</SelectItem>
                               <SelectItem value="petrol">Petrol</SelectItem>
                               <SelectItem value="diesel">Diesel</SelectItem>
                               <SelectItem value="hybrid">Hybrid</SelectItem>
                               <SelectItem value="electric">Electric</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>

                                                 {/* Seats Filter */}
                         <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Seats</label>
                           <Select value={seatsFilter} onValueChange={setSeatsFilter}>
                             <SelectTrigger className="border-2 border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20">
                               <SelectValue placeholder="Select Seats" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="all">Any Number of Seats</SelectItem>
                               <SelectItem value="2">2 Seats</SelectItem>
                               <SelectItem value="4">4 Seats</SelectItem>
                               <SelectItem value="5">5 Seats</SelectItem>
                               <SelectItem value="7">7+ Seats</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                      </div>

                      {/* Clear Filters */}
                      <div className="flex justify-center mt-6">
                        <Button
                          onClick={clearAll}
                          variant="secondary"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>

          {/* Cars Grid Section */}
          <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container-mobile">
              {/* Results Header */}
              <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    {pickupDate && returnDate ? (
                      <>
                        {filteredCars.length} of {availabilityStats.total} Cars Available
                        <span className="text-lg font-normal text-muted-foreground ml-2">
                          for {formatDateRange()}
                        </span>
                      </>
                    ) : (
                      `${filteredCars.length} Cars Available`
                    )}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {pickupDate && returnDate ? (
                      <>
                        {availabilityStats.available} available, {availabilityStats.unavailable} booked
                        <span className="text-xs text-brand-info ml-2">(real-time booking data)</span>
                      </>
                    ) : (
                      "Find the perfect car for your journey"
                    )}
                  </p>
                </div>

                {/* Sort Options */}
                <div className="mt-4 sm:mt-0">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {/* Loading State */}
              {isLoading && (
                <motion.div {...fadeUp} className="text-center py-16">
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
                    <span>Loading cars...</span>
                  </div>
                </motion.div>
              )}

              {/* Availability Checking State */}
              {!isLoading && pickupDate && returnDate && checkingAvailability && (
                <motion.div {...fadeUp} className="text-center py-16">
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-info"></div>
                    <span>Checking availability against booking data...</span>
                  </div>
                </motion.div>
              )}

              {/* Cars Grid */}
              {!isLoading && !(pickupDate && returnDate && checkingAvailability) && (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8"
                >
                  {visibleCars.map((car, index) => (
                    <CarCardWithSlider
                      key={car.id}
                      car={car}
                      index={index}
                      selectedDates={pickupDate && returnDate ? { pickupDate, returnDate } : null}
                    />
                  ))}
                </motion.div>
              )}

              {/* No Results */}
              {!isLoading && filteredCars.length === 0 && (
                <motion.div {...fadeUp} className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      {pickupDate && returnDate ? "No cars available for these dates" : "No cars found"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {pickupDate && returnDate ? (
                        <>
                          All {availabilityStats.total} cars in our fleet are booked for {formatDateRange()}.
                          <br />
                          Try selecting different dates or adjusting your filters to find available cars.
                        </>
                      ) : (
                        "Try adjusting your filters or search terms to find more cars."
                      )}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={clearAll}
                        variant="secondary"
                      >
                        Clear All Filters
                      </Button>
                      {pickupDate && returnDate && (
                        <Button
                          onClick={() => {
                            setPickupDate("")
                            setReturnDate("")
                          }}
                          variant="outline"
                          className="border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                        >
                          Clear Dates
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default CarsPage
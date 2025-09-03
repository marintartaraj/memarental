"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Seo from "@/components/Seo"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Search,
  Filter,
  Star,
  Users,
  Fuel,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  Shield,
  Clock,
  Car,
  TrendingUp,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { supabase } from "@/lib/customSupabaseClient"
import { getAvailableCarImages } from "@/lib/addCarsToDatabase"
import CarCardWithSlider from "@/components/CarCardWithSlider"

// Normalize car records for consistent UI
const normalizeCarRecord = (record) => {
  const dailyRate = Number(record?.daily_rate) || 0
  const category = dailyRate > 70 ? "Luxury" : dailyRate > 50 ? "Premium" : "Economy"
  const transmission = (record?.transmission || "").toLowerCase() === "manual" ? "Manual" : "Automatic"
  const fuelType = (record?.fuel_type || "").toLowerCase()
  const fuel = fuelType ? fuelType.charAt(0).toUpperCase() + fuelType.slice(1) : "Petrol"
  const isAvailable = (record?.status || "available") === "available"
  
  // Generate fallback image based on brand using actual photos
  const getFallbackImage = (brand) => {
    const brandLower = brand?.toLowerCase() || 'car'
    if (brandLower.includes('mercedes')) {
      return "/images/cars/c-class1.jpeg"
    } else if (brandLower.includes('volkswagen')) {
      return "/images/cars/jetta1.jpeg"
    } else if (brandLower.includes('toyota')) {
      return "/images/cars/yaris1.jpeg"
    } else if (brandLower.includes('hyundai')) {
      return "/images/cars/santa fe1.jpeg"
    } else if (brandLower.includes('volvo')) {
      return "/images/cars/xc601.jpeg"
    } else {
      return "/images/cars/placeholder-car.jpg"
    }
  }

  // Prefer local images from public/images/cars for the Cars page
  const brandImages = getAvailableCarImages()[record?.brand] || []
  const localBrandImage = brandImages[0]
  
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
    image_url: localBrandImage || getFallbackImage(record?.brand),
  }
}

const CarsPage = () => {
  const { t, tFormat } = useLanguage()
  const prefersReducedMotion = useReducedMotion()

  // UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [priceFilter, setPriceFilter] = useState("")
  const [brandFilter, setBrandFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [transmissionFilter, setTransmissionFilter] = useState("")
  const [fuelFilter, setFuelFilter] = useState("")
  const [seatsFilter, setSeatsFilter] = useState("")
  const [sortBy, setSortBy] = useState("recommended")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [selectedCar, setSelectedCar] = useState(null)
  const [showCarModal, setShowCarModal] = useState(false)

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
          const retry = await supabase
            .from("cars")
            .select("*")
            .order("id", { ascending: false })
          data = retry.data
          error = retry.error
        }

        if (!isMounted) return
        if (error) {
          throw error
        }
        setCars((data || []).map(normalizeCarRecord))
      } catch (err) {
        console.error("Failed to load cars:", err)
        if (isMounted) setCars([])
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

  // Filtering
  useEffect(() => {
    const term = debouncedSearch.toLowerCase()
    const list = cars.filter((car) => {
      const matchesSearch = !term || car.brand.toLowerCase().includes(term) || car.model.toLowerCase().includes(term)
      const matchesPrice =
        !priceFilter ||
        (priceFilter === "low" && car.price <= 50) ||
        (priceFilter === "medium" && car.price > 50 && car.price <= 70) ||
        (priceFilter === "high" && car.price > 70)
      const matchesBrand = !brandFilter || car.brand === brandFilter
      const matchesCategory = !categoryFilter || car.category === categoryFilter
      return matchesSearch && matchesPrice && matchesBrand && matchesCategory
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
    setFilteredCars(sorted)
  }, [cars, debouncedSearch, priceFilter, brandFilter, categoryFilter, sortBy])

  const visibleCars = useMemo(() => filteredCars.slice(0, 9), [filteredCars]) // Show 9 cars per page
  const canLoadMore = filteredCars.length > 9

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
    setPriceFilter("")
    setBrandFilter("")
    setCategoryFilter("")
    setTransmissionFilter("")
    setFuelFilter("")
    setSeatsFilter("")
    setSortBy("recommended")
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
          <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-gray-100">
            <div className="container-mobile">
              <motion.div {...fadeUp} className="space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search cars by brand, model, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 rounded-xl transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md"
                  />
                </div>

                {/* Filter Toggle */}
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-6 py-3 bg-transparent transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Filter className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </span>
                  </Button>
                </div>

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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Price Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Price Range</label>
                          <Select value={priceFilter} onValueChange={setPriceFilter}>
                            <SelectTrigger className="border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20">
                              <SelectValue placeholder="Select Price" />
                            </SelectTrigger>
                            <SelectContent>
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
                            <SelectTrigger className="border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20">
                              <SelectValue placeholder="Select Brand" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                              <SelectItem value="volkswagen">Volkswagen</SelectItem>
                              <SelectItem value="toyota">Toyota</SelectItem>
                              <SelectItem value="hyundai">Hyundai</SelectItem>
                              <SelectItem value="volvo">Volvo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Category Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Category</label>
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
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
                            <SelectTrigger className="border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20">
                              <SelectValue placeholder="Select Transmission" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="automatic">Automatic</SelectItem>
                              <SelectItem value="manual">Manual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <div className="flex justify-center mt-6">
                        <Button
                          onClick={() => {
                            setPriceFilter("")
                            setBrandFilter("")
                            setCategoryFilter("")
                            setTransmissionFilter("")
                            setFuelFilter("")
                            setSeatsFilter("")
                          }}
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
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
          <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container-mobile">
              {/* Results Header */}
              <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    {filteredCars.length} Cars Available
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Find the perfect car for your journey
                  </p>
                </div>

                {/* Sort Options */}
                <div className="mt-4 sm:mt-0">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 w-48">
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
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                    <span>Loading cars...</span>
                  </div>
                </motion.div>
              )}

              {/* Cars Grid */}
              {!isLoading && (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {visibleCars.map((car, index) => (
                    <CarCardWithSlider
                      key={car.id}
                      car={car}
                      index={index}
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
                      No cars found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters or search terms to find more cars.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setPriceFilter("")
                        setBrandFilter("")
                        setCategoryFilter("")
                        setTransmissionFilter("")
                        setFuelFilter("")
                        setSeatsFilter("")
                      }}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-yellow-500 to-orange-600 relative overflow-hidden">
        {/* Light effects for CTA */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-white/30 via-white/20 to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-white/25 via-white/15 to-transparent animate-pulse animation-delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 relative">
              <span className="relative z-10">Ready to Start Your Journey?</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">Book your perfect rental car today and experience the freedom of the open road. Our team is here to help you find the ideal vehicle for your needs.</p>
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: 0.15 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-yellow-700 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl group relative overflow-hidden"
              >
                <Link to="/cars">
                  <span className="relative z-10 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-yellow-700 text-lg px-8 py-4 bg-transparent group relative overflow-hidden"
              >
                <Link to="/contact">Get In Touch</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default CarsPage
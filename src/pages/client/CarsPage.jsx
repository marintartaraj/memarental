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
  const [sortBy, setSortBy] = useState("recommend")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("cars_view_mode") || "grid" : "grid",
  )
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 9
  const firstFilterRef = useRef(null)

  // Respect prefers-reduced-motion for all animations
  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.45, ease: "easeOut" },
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
      localStorage.setItem("cars_view_mode", viewMode)
    }
  }, [viewMode])

  // Debounce search to reduce re-renders and CPU
  useEffect(() => {
    const tId = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 250)
    return () => clearTimeout(tId)
  }, [searchTerm])

  // Load cars
  useEffect(() => {
    let isMounted = true
    const loadCars = async () => {
      setLoading(true)
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
        if (isMounted) setLoading(false)
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
  const filteredCars = useMemo(() => {
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
      case "priceAsc":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "priceDesc":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "newest":
        sorted.sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
        break
      default:
        // recommend: popular first, then rating, then price
        sorted.sort((a, b) => {
          if (a.popular !== b.popular) return a.popular ? -1 : 1
          if (a.rating !== b.rating) return b.rating - a.rating
          return a.price - b.price
        })
    }
    return sorted
  }, [cars, debouncedSearch, priceFilter, brandFilter, categoryFilter, sortBy])

  const visibleCars = useMemo(() => filteredCars.slice(0, page * pageSize), [filteredCars, page])
  const canLoadMore = visibleCars.length < filteredCars.length

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
    if (showFilters && firstFilterRef.current) {
      firstFilterRef.current.focus()
    }
  }, [showFilters])

  const clearAll = () => {
    setSearchTerm("")
    setPriceFilter("")
    setBrandFilter("")
    setCategoryFilter("")
    setSortBy("recommend")
    setPage(1)
  }

  return (
    <>
      <Seo
        title={t("seoCarsTitle")}
        description={t("seoCarsDescription")}
        path="/cars"
        image="https://memarental.com/cars-fleet-image.jpg"
        keywords="car rental fleet Tirana, car rental vehicles Albania, rent BMW Tirana, rent Mercedes Albania, rent Audi Tirana, rent Toyota Albania, rent Volkswagen Tirana, rent Ford Albania, luxury car rental Tirana, economy car rental Albania, SUV rental Tirana, car hire fleet Albania, Tirana car rental vehicles, Albania car rental selection, best car rental Tirana, car rental service Albania, Tirana airport car rental, Albania car hire service"
        schema={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Global light effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-200/15 to-orange-200/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/12 to-yellow-200/8 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-100/8 to-transparent rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Removed top hero header section */}

        <nav aria-label="Breadcrumb" className="container-mobile pt-2 relative z-10">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:underline group relative overflow-hidden inline-block">
                <span className="relative z-10">{t("navHome") || "Home"}</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-400">
              /
            </li>
            <li aria-current="page" className="text-gray-800 font-medium relative">
              <span className="relative z-10">{t("navCars") || "Cars"}</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </li>
          </ol>
        </nav>

        <div className="container-mobile py-6 sm:py-8 relative z-10">
          {/* Search and Controls */}
          <motion.section
            {...fadeUp}
            className="mb-6 sm:mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-0 relative overflow-hidden group"
            aria-labelledby="filters-title"
          >
            {/* Glow effect for search section */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="sr-only" id="filters-title">
              {t("filters") || "Filters"}
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <label htmlFor="car-search" className="sr-only">
                {t("carsSearchPlaceholder")}
              </label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-yellow-500 transition-colors duration-300" aria-hidden="true" />
              <Input
                id="car-search"
                placeholder={t("carsSearchPlaceholder")}
                value={searchTerm}
                onChange={(e) => {
                  setPage(1)
                  setSearchTerm(e.target.value)
                }}
                className="pl-10 h-12 text-base sm:text-lg border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 min-h-[44px] bg-white/80 backdrop-blur-sm group-hover:bg-white/90 transition-all duration-300"
                autoComplete="off"
                enterKeyHint="search"
              />
            </div>

            {/* Top Row: Count, Sort, View Mode, Toggle Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-1">
              <span aria-live="polite" className="text-sm text-gray-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                {tFormat("carsAvailableCount", {
                  count: filteredCars.length,
                  plural: filteredCars.length !== 1 ? "s" : "",
                })}
              </span>

              <div className="flex flex-wrap items-center gap-3">
                {/* Sort */}
                <div className="min-w-[180px]">
                  <label htmlFor="sortBy" className="sr-only">
                    {t("sortBy") || "Sort by"}
                  </label>
                  <Select
                    value={sortBy}
                    onValueChange={(v) => {
                      setSortBy(v)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[220px] border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 min-h-[44px] bg-white/80 backdrop-blur-sm group-hover:bg-white/90 transition-all duration-300">
                      <SelectValue placeholder={t("sortBy") || "Sort by"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommend">{t("sortRecommended") || "Recommended"}</SelectItem>
                      <SelectItem value="priceAsc">{t("sortPriceAsc") || "Price: Low to High"}</SelectItem>
                      <SelectItem value="priceDesc">{t("sortPriceDesc") || "Price: High to Low"}</SelectItem>
                      <SelectItem value="newest">{t("sortNewest") || "Newest"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode */}
                <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-lg p-1" role="tablist" aria-label="View mode">
                  <Button
                    role="tab"
                    aria-selected={viewMode === "grid"}
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 px-3 min-h-[44px] group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Grid</span>
                  </Button>
                  <Button
                    role="tab"
                    aria-selected={viewMode === "list"}
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 px-3 min-h-[44px] group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">List</span>
                  </Button>
                </div>

                {/* Toggle Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 group relative overflow-hidden"
                  aria-expanded={showFilters}
                  aria-controls="filters-panel"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Filter className="mr-2 h-4 w-4 group-hover:animate-pulse relative z-10" />
                  <span className="relative z-10">{t("filters") || "Filters"}</span>
                  {showFilters ? (
                    <ChevronUp className="ml-2 h-4 w-4 relative z-10" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4 relative z-10" />
                  )}
                </Button>
              </div>
            </div>

            {/* Active filter chips */}
            {(brandFilter || categoryFilter || priceFilter || debouncedSearch) && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none]">
                {debouncedSearch && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
                    “{debouncedSearch}”
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setSearchTerm("")}
                      aria-label={t("clearSearch") || "Clear search"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {brandFilter && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {brandFilter}
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setBrandFilter("")}
                      aria-label={t("clearBrand") || "Clear brand"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {categoryFilter && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {categoryFilter}
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setCategoryFilter("")}
                      aria-label={t("clearCategory") || "Clear category"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {priceFilter && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {priceFilter === "low"
                      ? t("under50")
                      : priceFilter === "medium"
                        ? t("between50And70")
                        : t("over70")}
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setPriceFilter("")}
                      aria-label={t("clearPrice") || "Clear price"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-yellow-700 hover:text-yellow-800">
                  {t("clearAllFilters") || "Clear all"}
                </Button>
              </div>
            )}

            {/* Filters Panel */}
            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div
                  id="filter-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t mt-4">
                    <div ref={firstFilterRef} tabIndex={-1}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t("brand")}</label>
                      <Select
                        value={brandFilter}
                        onValueChange={(v) => {
                          setBrandFilter(v)
                          setPage(1)
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-[220px] border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 min-h-[44px] bg-white/80 backdrop-blur-sm group-hover:bg-white/90 transition-all duration-300">
                          <SelectValue placeholder={t("allBrands")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("allBrands")}</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t("category")}</label>
                      <Select
                        value={categoryFilter}
                        onValueChange={(v) => {
                          setCategoryFilter(v)
                          setPage(1)
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-[220px] border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 min-h-[44px] bg-white/80 backdrop-blur-sm group-hover:bg-white/90 transition-all duration-300">
                          <SelectValue placeholder={t("allCategories")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("allCategories")}</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t("priceRangeLabel")}</label>
                      <Select
                        value={priceFilter}
                        onValueChange={(v) => {
                          setPriceFilter(v)
                          setPage(1)
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-[220px] border-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 min-h-[44px] bg-white/80 backdrop-blur-sm group-hover:bg-white/90 transition-all duration-300">
                          <SelectValue placeholder={t("allPrices")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("allPrices")}</SelectItem>
                          <SelectItem value="low">{t("under50")}</SelectItem>
                          <SelectItem value="medium">{t("between50And70")}</SelectItem>
                          <SelectItem value="high">{t("over70")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        onClick={clearAll}
                        className="flex-1 border-2 hover:border-red-500 hover:text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t("clear")}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Results */}
          <section aria-labelledby="results-title">
            <h2 id="results-title" className="sr-only">
              {t("resultsTitle") || "Available cars"}
            </h2>

            {loading && (
              <div
                role="status"
                aria-live="polite"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {Array.from({ length: pageSize }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden bg-white shadow animate-pulse">
                    <div className="h-48 sm:h-56 w-full bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-2/3" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && (
              <>
                <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className={
                    viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" : "space-y-4"
                  }
                  aria-busy={loading}
                >
                  {visibleCars.map((car, index) => (
                    <motion.div
                      key={car.id}
                      variants={fadeUp}
                      whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.02 }}
                      className="group"
                    >
                      <Card
                        className={`overflow-hidden car-card h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm relative ${
                          viewMode === "list" ? "flex-row" : ""
                        }`}
                      >
                        {/* Glow effect for car card */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Link
                          to={`/cars/${car.id}`}
                          className={`block relative ${viewMode === "list" ? "w-1/3" : ""}`}
                          aria-label={`${car.brand} ${car.model}`}
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={car.image_url || "/images/cars/placeholder-car.jpg"}
                              width={960}
                              height={560}
                              alt={`${car.brand} ${car.model} car rental in ${car.location}, Albania - MEMA Rental`}
                              className={`${viewMode === "list" ? "h-full" : "aspect-card"} w-full object-cover transition-transform duration-500 group-hover:scale-105`}
                              loading="lazy"
                              decoding="async"
                              draggable={false}
                              onError={(e) => {
                                e.target.src = "/images/cars/placeholder-car.jpg";
                              }}
                            />
                            <div
                              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                              aria-hidden="true"
                            />
                          </div>

                          {/* Rating Badge */}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
                            <Star className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                            <span className="text-sm font-semibold">{car.rating}</span>
                            <span className="text-xs text-gray-500">({car.reviews})</span>
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
                            {car.category}
                          </div>

                          {/* Popular Badge */}
                          {car.popular && (
                            <div className="absolute top-12 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
                              <TrendingUp className="h-3 w-3 inline mr-1" aria-hidden="true" />
                              {t("popular") || "Popular"}
                            </div>
                          )}

                          {/* Discount Badge */}
                          {car.discount > 0 && (
                            <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
                              -{car.discount}%
                            </div>
                          )}

                          {/* Availability Overlay */}
                          {!car.available && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                              <span className="text-white font-semibold text-lg">{t("notAvailable")}</span>
                            </div>
                          )}
                        </Link>

                        <div className={`flex-grow flex flex-col ${viewMode === "list" ? "w-2/3 p-6" : "p-4 sm:p-6"}`}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg sm:text-xl lg:text-2xl line-clamp-1">
                              {car.brand} {car.model}
                            </CardTitle>
                            <p className="text-gray-500 text-sm">
                              {t("year")}: {car.year} • {t("location")}: {car.location}, Albania
                            </p>
                          </CardHeader>

                          <CardContent className="flex-grow flex flex-col">
                            {/* Car Features */}
                                                      <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                              <Users className="h-4 w-4 text-blue-500" aria-hidden="true" />
                              <span className="sr-only">{t("seats") || "Seats"}: </span>
                              <span aria-label={`${car.seats} ${t("seats") || "seats"}`}>{car.seats}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                              <Fuel className="h-4 w-4 text-green-600" aria-hidden="true" />
                              <span className="sr-only">{t("fuel") || "Fuel"}: </span>
                              <span>{car.fuel}</span>
                            </div>
                            {car.engine && (
                              <div className="flex items-center gap-1 text-sm text-gray-700 bg-gray-50 p-2 rounded col-span-2">
                                <Zap className="h-4 w-4 text-orange-500" aria-hidden="true" />
                                <span className="sr-only">Engine: </span>
                                <span className="truncate">{car.engine}</span>
                              </div>
                            )}
                          </div>

                            {/* Features Preview */}
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {car.features.slice(0, 2).map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800"
                                  >
                                    <Zap className="h-3 w-3 mr-1" aria-hidden="true" />
                                    {feature}
                                  </span>
                                ))}
                                {car.features.length > 2 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                    +{car.features.length - 2} {t("more")}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mt-auto">
                              <div className="flex flex-col gap-4 sm:gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xl sm:text-2xl font-bold text-yellow-700">€{car.price}</p>
                                    {car.discount > 0 && (
                                      <p className="text-sm text-gray-500 line-through">
                                        €{Math.round(car.price * (1 + car.discount / 100))}
                                      </p>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500">{t("perDay")}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
                                  <Button
                                    asChild
                                    className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 sm:px-6 shadow-lg hover:shadow-xl transition-colors duration-200 min-h-[44px]"
                                    disabled={!car.available}
                                  >
                                    <Link to={`/cars/${car.id}`}>
                                      {car.available ? t("rentThisCar") : t("notAvailable")}
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label={t("saveToFavorites") || "Save to favorites"}
                                    className="w-full sm:w-auto border-2 hover:border-yellow-500 hover:text-yellow-700 bg-transparent min-h-[44px]"
                                  >
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Additional Info */}
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" aria-hidden="true" />
                                  <span>{car.pickupTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" aria-hidden="true" />
                                  <span>{t("insured")}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Load More */}
                {filteredCars.length > 0 && canLoadMore && (
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={() => setPage((p) => p + 1)}
                      className="w-full sm:w-auto bg-white text-yellow-700 border border-yellow-600 hover:bg-yellow-50"
                      variant="outline"
                    >
                      {t("loadMore") || "Load more"}
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!loading && filteredCars.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">{t("noCarsFound")}</h3>
                  <p>{t("tryAdjusting")}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="border-2 hover:border-yellow-500 bg-transparent"
                >
                  {t("clearAllFilters")}
                </Button>
              </motion.div>
            )}
          </section>

          {/* Additional SEO content */}
          <motion.section {...fadeUp} className="mt-8" aria-labelledby="info-title">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-0">
              <h2 id="info-title" className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                {t("infoTitle")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("infoReqs")}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t("req1")}</li>
                    <li>{t("req2")}</li>
                    <li>{t("req3")}</li>
                    <li>{t("req4")}</li>
                    <li>{t("req5")}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("infoServices")}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t("serv1")}</li>
                    <li>{t("serv2")}</li>
                    <li>{t("serv3")}</li>
                    <li>{t("serv4")}</li>
                    <li>{t("serv5")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
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
              <span className="relative z-10">{t("homeCtaTitle")}</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">{t("homeCtaCopy")}</p>
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
                    {t("bookNow")}
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
                <Link to="/contact">{t("getInTouch")}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default CarsPage

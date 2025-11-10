"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import {
  Mic,
  Sparkles,
  SlidersHorizontal,
  Grid3x3,
  LayoutList,
  ArrowLeft,
  TrendingUp,
  Clock,
  DollarSign,
  MapPin,
  X,
  ChevronDown,
  Heart,
  Share2,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ListingCard from "@/components/ListingCard"
import CategoryFilter from "@/components/CategoryFilter"
import Link from "next/link"
import { VehicleFilters, defaultFilters } from "@/types/filters"

const ITEMS_PER_PAGE = 12

export default function SearchResultsPage() {
  const searchParams = useSearchParams()

  // Get AI search params
  const queryParam = searchParams.get("q")
  const filtersParam = searchParams.get("filters")
  const isAISearch = searchParams.get("ai") === "true"

  // Parse AI filters if available
  const aiFilters: Partial<VehicleFilters> = useMemo(() => {
    if (filtersParam) {
      try {
        return JSON.parse(filtersParam)
      } catch (e) {
        console.error("Failed to parse filters:", e)
        return {}
      }
    }
    return {}
  }, [filtersParam])

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState(
    queryParam || "Luxury vehicles under $100K"
  )
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState<number[]>(
    aiFilters.priceRange || [0, 200000]
  )
  const [location, setLocation] = useState("All Locations")
  const [savedSearches, setSavedSearches] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Build active filters from AI filters
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Update filters when AI search params change
  useEffect(() => {
    const filters: string[] = []

    if (aiFilters.make && aiFilters.make.length > 0) {
      filters.push(`Make: ${aiFilters.make.join(", ")}`)
    }
    if (aiFilters.model) {
      filters.push(`Model: ${aiFilters.model}`)
    }
    if (aiFilters.bodyStyle) {
      filters.push(`Body: ${aiFilters.bodyStyle}`)
    }
    if (aiFilters.priceRange) {
      const [min, max] = aiFilters.priceRange
      if (max < 999999) {
        filters.push(`Price: Under $${(max / 1000).toFixed(0)}K`)
      }
    }
    if (aiFilters.mileageRange) {
      const [min, max] = aiFilters.mileageRange
      if (max < 999999) {
        filters.push(`Mileage: Under ${(max / 1000).toFixed(0)}K miles`)
      }
    }
    if (aiFilters.fuelType && aiFilters.fuelType.length > 0) {
      filters.push(`Fuel: ${aiFilters.fuelType.join(", ")}`)
    }
    if (aiFilters.features && aiFilters.features.length > 0) {
      filters.push(`Features: ${aiFilters.features.join(", ")}`)
    }

    setActiveFilters(filters)
  }, [aiFilters])

  // Mock data - in production, this would come from your backend API
  const allListings = [
    {
      image: "/images/vip/listing-car-plain-2.jpg",
      title: "Tesla Model S Plaid",
      price: "$94,990",
      location: "San Francisco, CA",
      badge: "Best match",
      category: "Vehicles",
      verified: true,
      views: 1234,
    },
    {
      image: "/images/vip/listing-car-plain-1.jpg",
      title: "2024 Porsche 911 Turbo S",
      price: "$189,900",
      location: "Miami, FL",
      badge: "Premium choice",
      category: "Vehicles",
      verified: true,
      views: 856,
    },
    {
      image: "/images/vip/listing-motorcycle-plain.jpg",
      title: "Ducati Panigale V4",
      price: "$28,500",
      location: "Los Angeles, CA",
      badge: "Popular near you",
      category: "Motorcycles",
      views: 542,
    },
    {
      image: "/images/vip/listing-rv-plain.jpg",
      title: "2023 Mercedes Sprinter RV",
      price: "$89,900",
      location: "Denver, CO",
      badge: "Great value",
      category: "RVs",
      verified: true,
      views: 678,
    },
    {
      image: "/images/vip/listing-boat-plain.jpg",
      title: "28ft Center Console Boat",
      price: "$45,000",
      location: "Fort Lauderdale, FL",
      category: "Boats",
      views: 423,
    },
    {
      image: "/images/vip/listing-home-plain.jpg",
      title: "Charming Suburban Home",
      price: "$425,000",
      location: "Charlotte, NC",
      category: "Homes",
      verified: true,
      views: 2103,
    },
    // Additional mock listings for pagination demo
    ...Array.from({ length: 54 }, (_, i) => ({
      image: `/images/vip/listing-car-plain-${(i % 2) + 1}.jpg`,
      title: `Vehicle ${i + 7}`,
      price: `$${((i + 1) * 5000).toLocaleString()}`,
      location: "Various, US",
      category: "Vehicles",
      verified: i % 3 === 0,
      views: Math.floor(Math.random() * 1000) + 100,
    })),
  ]

  // Calculate pagination
  const totalResults = allListings.length
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentListings = allListings.slice(startIndex, endIndex)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      // Calculate range around current page
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("...")
      }

      // Add pages around current
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("...")
      }

      // Show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setPriceRange([0, 200000])
    setLocation("All Locations")
  }

  const formatPrice = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* AI Search Interpretation Banner */}
      {isAISearch && queryParam && (
        <div className="pt-20">
          <Alert className="container mx-auto max-w-6xl bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-900 dark:text-blue-100">
              <span className="font-semibold">🤖 AI Search:</span> Showing
              results for "{queryParam}"
              {activeFilters.length > 0 && (
                <span className="ml-2 text-sm">
                  • Applied {activeFilters.length} smart filter
                  {activeFilters.length !== 1 ? "s" : ""}
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Search Section */}
      <section className="relative pt-24 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
        </div>

        <div className="container mx-auto relative z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Home</span>
          </Link>

          {/* Enhanced Search Bar */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="glass-strong rounded-3xl p-3 border border-primary/20 glow-primary">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 flex-1 bg-background/80 rounded-2xl px-6 py-4">
                  <Sparkles className="h-6 w-6 text-primary flex-shrink-0 animate-pulse" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                    placeholder="Ask AI to find anything..."
                  />
                  <button className="hover:bg-accent/10 p-3 rounded-xl transition-all hover:scale-110">
                    <Mic className="h-5 w-5 text-muted-foreground hover:text-accent transition-colors" />
                  </button>
                </div>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 px-12 py-7 rounded-2xl font-bold text-lg glow-hover"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Filters Row */}
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="glass w-[200px] border-border/50">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  <SelectItem value="California">California</SelectItem>
                  <SelectItem value="Florida">Florida</SelectItem>
                  <SelectItem value="Texas">Texas</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="glass border-border/50 hover:border-primary/50"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Price Range
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="glass-strong border-l border-border/50 w-full sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="font-display text-2xl">
                      Price Range
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Minimum
                        </span>
                        <span className="font-bold text-lg">
                          {formatPrice(priceRange[0])}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Maximum
                        </span>
                        <span className="font-bold text-lg">
                          {formatPrice(priceRange[1])}
                        </span>
                      </div>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500000}
                      step={5000}
                      className="w-full"
                    />
                    <Button className="w-full mt-6">Apply Price Filter</Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                className={`glass border-border/50 hover:border-primary/50 ${savedSearches ? "bg-primary/10 border-primary" : ""}`}
                onClick={() => setSavedSearches(!savedSearches)}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${savedSearches ? "fill-primary" : ""}`}
                />
                Save Search
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-10">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          {/* Results Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    {totalResults.toLocaleString()}
                  </span>{" "}
                  Results
                </h1>
                {isAISearch && (
                  <Badge
                    variant="outline"
                    className="glass-strong border-primary/30 text-sm px-3 py-1"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Matched
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, totalResults)} of{" "}
                {totalResults.toLocaleString()} results for "{searchQuery}"
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort Options */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="glass w-[180px] border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Best Match
                    </div>
                  </SelectItem>
                  <SelectItem value="recent">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="price-low">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Price: Low to High
                    </div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Most Popular
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 glass-strong rounded-xl p-1.5 border border-border/30">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="px-4 rounded-lg"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="px-4 rounded-lg"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-8 p-4 glass-strong rounded-xl border border-border/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Active Filters:</span>
              </div>
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  className="glass-strong px-4 py-2 text-sm font-semibold border border-primary/30 hover:bg-primary/10 cursor-pointer transition-all hover:scale-105"
                >
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-2 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground font-medium ml-auto"
                onClick={clearAllFilters}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Listings Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {currentListings.map((listing, index) => (
              <div
                key={`${currentPage}-${index}`}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ListingCard {...listing} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center gap-6 mt-16">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="glass border-border/50 hover:border-primary/50"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(currentPage - 1)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {pageNumbers.map((page, index) =>
                  typeof page === "number" ? (
                    <Button
                      key={`page-${page}`}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setCurrentPage(page)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        page === currentPage
                          ? "glow-primary"
                          : "glass border-border/50 hover:border-primary/50"
                      }`}
                    >
                      {page}
                    </Button>
                  ) : (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-muted-foreground"
                    >
                      {page}
                    </span>
                  )
                )}
              </div>

              <Button
                variant="outline"
                className="glass border-border/50 hover:border-primary/50"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(currentPage + 1)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              >
                Next
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, totalResults)} of{" "}
              {totalResults.toLocaleString()} results
            </p>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        <Button
          size="lg"
          className="h-14 w-14 rounded-2xl glass-strong border border-border/50 hover:border-primary/50 shadow-lg hover:scale-110 transition-all"
        >
          <Share2 className="h-5 w-5" />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-2xl bg-primary shadow-glass glow-primary animate-glow-pulse hover:scale-110 transition-transform"
            >
              <div className="relative">
                <SlidersHorizontal className="h-6 w-6" />
                <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-accent" />
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent className="glass-strong border-l border-border/50 w-full sm:w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl flex items-center gap-2">
                <SlidersHorizontal className="h-6 w-6 text-primary" />
                Advanced Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold">Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="glass border-border/50">
                    New
                  </Button>
                  <Button variant="outline" className="glass border-border/50">
                    Used
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Year</label>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Min" className="glass border-border/50" />
                  <Input placeholder="Max" className="glass border-border/50" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Features</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="glass border-border/50 text-xs"
                  >
                    GPS
                  </Button>
                  <Button
                    variant="outline"
                    className="glass border-border/50 text-xs"
                  >
                    Sunroof
                  </Button>
                  <Button
                    variant="outline"
                    className="glass border-border/50 text-xs"
                  >
                    Leather
                  </Button>
                  <Button
                    variant="outline"
                    className="glass border-border/50 text-xs"
                  >
                    4WD
                  </Button>
                </div>
              </div>

              <Button className="w-full mt-8 glow-hover">Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

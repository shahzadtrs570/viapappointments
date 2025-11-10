import { useState } from "react"
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
import Header from "@/components/Header"
import ListingCard from "@/components/ListingCard"
import CategoryFilter from "@/components/CategoryFilter"
import Footer from "@/components/Footer"
import { useNavigate } from "react-router-dom"

import carImage1 from "@/assets/listing-car-plain-1.jpg"
import boatImage from "@/assets/listing-boat-plain.jpg"
import motorcycleImage from "@/assets/listing-motorcycle-plain.jpg"
import homeImage from "@/assets/listing-home-plain.jpg"
import rvImage from "@/assets/listing-rv-plain.jpg"
import carImage2 from "@/assets/listing-car-plain-2.jpg"

const SearchResults = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("Luxury vehicles under $100K")
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [location, setLocation] = useState("All Locations")
  const [savedSearches, setSavedSearches] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "Luxury",
    "Under $100K",
  ])

  const listings = [
    {
      image: carImage2,
      title: "Tesla Model S Plaid",
      price: "$94,990",
      location: "San Francisco, CA",
      badge: "Best match",
      category: "Vehicles",
      verified: true,
      views: 1234,
    },
    {
      image: carImage1,
      title: "2024 Porsche 911 Turbo S",
      price: "$189,900",
      location: "Miami, FL",
      badge: "Premium choice",
      category: "Vehicles",
      verified: true,
      views: 856,
    },
    {
      image: motorcycleImage,
      title: "Ducati Panigale V4",
      price: "$28,500",
      location: "Los Angeles, CA",
      badge: "Popular near you",
      category: "Motorcycles",
      views: 542,
    },
    {
      image: rvImage,
      title: "2023 Mercedes Sprinter RV",
      price: "$89,900",
      location: "Denver, CO",
      badge: "Great value",
      category: "RVs",
      verified: true,
      views: 678,
    },
    {
      image: boatImage,
      title: "28ft Center Console Boat",
      price: "$45,000",
      location: "Fort Lauderdale, FL",
      category: "Boats",
      views: 423,
    },
    {
      image: homeImage,
      title: "Charming Suburban Home",
      price: "$425,000",
      location: "Charlotte, NC",
      category: "Homes",
      verified: true,
      views: 2103,
    },
  ]

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
      <Header />

      {/* Hero Search Section */}
      <section className="relative pt-24 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
        </div>

        <div className="container mx-auto relative z-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Home</span>
          </button>

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
                    847
                  </span>{" "}
                  Results
                </h1>
                <Badge
                  variant="outline"
                  className="glass-strong border-primary/30 text-sm px-3 py-1"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Matched
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Showing the best matches for "{searchQuery}"
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
            {listings.map((listing, index) => (
              <div
                key={index}
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
                disabled
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="sm"
                    className={`w-10 h-10 rounded-lg ${
                      page === 1
                        ? "glow-primary"
                        : "glass border-border/50 hover:border-primary/50"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                className="glass border-border/50 hover:border-primary/50"
              >
                Next
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing 1-12 of 847 results
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

      <Footer />
    </div>
  )
}

export default SearchResults

"use client"

import Hero from "@/components/Hero"
import CategoryFilter from "@/components/CategoryFilter"
import ListingCard from "@/components/ListingCard"
import React, { useState, useEffect, useMemo } from "react"
import { api } from "@/lib/trpc/react"
import type { VehicleFilters } from "@/types/filters"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface HomePageProps {
  params: {
    lng: string
  }
}

export default function HomePage({ params: { lng } }: HomePageProps) {
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState("all")
  const [aiFilters, setAiFilters] = useState<Partial<VehicleFilters> | null>(
    null
  )
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingStage, setLoadingStage] = useState<"ai" | "db" | null>(null)

  // Convert AI filters to tRPC query format using useMemo
  const inventoryFilters = useMemo(() => {
    if (!aiFilters) return null

    return {
      make:
        aiFilters.make && aiFilters.make.length > 0
          ? aiFilters.make
          : undefined,
      model: aiFilters.model || undefined,
      minYear: aiFilters.yearRange?.[0] || undefined,
      maxYear: aiFilters.yearRange?.[1] || undefined,
      minPrice: aiFilters.priceRange?.[0] || undefined,
      maxPrice: aiFilters.priceRange?.[1] || undefined,
      minMileage: aiFilters.mileageRange?.[0] || undefined,
      maxMileage: aiFilters.mileageRange?.[1] || undefined,
      bodyStyle: aiFilters.bodyStyle || undefined,
      fuelType:
        aiFilters.fuelType && aiFilters.fuelType.length > 0
          ? aiFilters.fuelType
          : undefined,
      transmission:
        aiFilters.transmission && aiFilters.transmission.length > 0
          ? aiFilters.transmission
          : undefined,
      drivetrain:
        aiFilters.drivetrain && aiFilters.drivetrain.length > 0
          ? aiFilters.drivetrain
          : undefined,
      condition: aiFilters.condition || undefined,
      features:
        aiFilters.features && aiFilters.features.length > 0
          ? aiFilters.features
          : undefined,
      limit: 10,
      skip: 0,
      sortBy: "created_desc" as const,
      isActive: true,
    }
  }, [aiFilters])

  // Fetch inventory when AI filters are set
  const inventoryQuery = api.inventory.getInventory.useQuery(
    inventoryFilters!,
    {
      enabled: !!aiFilters, // Only fetch when we have AI filters
    }
  )

  // Handle loading stages and success
  React.useEffect(() => {
    if (inventoryQuery.isSuccess && loadingStage === "db") {
      setLoadingStage(null)
      toast({
        title: "🎯 Results Ready!",
        description: `Found ${inventoryQuery.data?.total || 0} vehicles matching your search`,
      })
    }
    if (inventoryQuery.isError && loadingStage === "db") {
      setLoadingStage(null)
      toast({
        title: "Database Error",
        description: "Failed to fetch results",
        variant: "destructive",
      })
    }
  }, [
    inventoryQuery.isSuccess,
    inventoryQuery.isError,
    loadingStage,
    inventoryQuery.data?.total,
    toast,
  ])

  const handleAiSearch = async (query: string) => {
    setIsSearching(true)
    setSearchQuery(query)
    setLoadingStage("ai")

    try {
      // Call AI search API
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) throw new Error("AI search failed")

      const data = await response.json()

      // Show AI understanding
      toast({
        title: "✨ AI Understanding Complete",
        description: data.interpretation || `Understood: "${query}"`,
      })

      // Set the AI filters which will trigger the inventory query
      setLoadingStage("db")
      setAiFilters(data.filters)
    } catch (error) {
      console.error("AI search error:", error)
      toast({
        title: "Search failed",
        description: "Please try again",
        variant: "destructive",
      })
      setLoadingStage(null)
    } finally {
      setIsSearching(false)
    }
  }

  const clearAiSearch = () => {
    setAiFilters(null)
    setSearchQuery("")
    setLoadingStage(null)
  }

  return (
    <main className="min-h-screen">
      <Hero onAiSearch={handleAiSearch} isSearching={isSearching} />

      {/* AI Search Results Section */}
      {aiFilters && (
        <section className="container mx-auto px-6 py-12 border-t border-border/50">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-black tracking-tight mb-2">
                  🤖 AI Search{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Results
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  {loadingStage === "ai" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI Understanding your request...
                    </span>
                  ) : loadingStage === "db" || inventoryQuery.isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Fetching results from database...
                    </span>
                  ) : (
                    `Found ${inventoryQuery.data?.total || 0} results for "${searchQuery}"`
                  )}
                </p>
              </div>
              <button
                onClick={clearAiSearch}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg hover:bg-accent/10"
              >
                Clear Search
              </button>
            </div>

            {/* Active AI Filters Display */}
            <div className="flex flex-wrap gap-2 mb-6">
              {aiFilters.make && aiFilters.make.length > 0 && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  Make: {aiFilters.make.join(", ")}
                </span>
              )}
              {aiFilters.model && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  Model: {aiFilters.model}
                </span>
              )}
              {aiFilters.bodyStyle && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  Body: {aiFilters.bodyStyle}
                </span>
              )}
              {aiFilters.priceRange && aiFilters.priceRange[1] < 999999 && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  Price: ${(aiFilters.priceRange[0] / 1000).toFixed(0)}K - $
                  {(aiFilters.priceRange[1] / 1000).toFixed(0)}K
                </span>
              )}
              {aiFilters.fuelType && aiFilters.fuelType.length > 0 && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  Fuel: {aiFilters.fuelType.join(", ")}
                </span>
              )}
              {aiFilters.condition && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  Condition: {aiFilters.condition}
                </span>
              )}
              {aiFilters.features && aiFilters.features.length > 0 && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  Features: {aiFilters.features.join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* Results Grid */}
          {loadingStage === "ai" ||
          loadingStage === "db" ||
          inventoryQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] bg-gradient-to-br from-muted/20 to-muted/10 animate-pulse rounded-xl flex flex-col items-center justify-center gap-3 border border-border/50"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground font-medium">
                    {loadingStage === "ai"
                      ? "AI Understanding..."
                      : "Loading top 10 results..."}
                  </p>
                </div>
              ))}
            </div>
          ) : inventoryQuery.data?.items &&
            inventoryQuery.data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventoryQuery.data.items.map((car, index) => {
                  // Extract image URL
                  let imageUrl = "/images/vip/listing-car-plain-1.jpg"
                  if (car.images) {
                    if (Array.isArray(car.images) && car.images.length > 0) {
                      const firstImage = car.images[0]
                      if (typeof firstImage === "string") {
                        imageUrl = firstImage
                      } else if (
                        typeof firstImage === "object" &&
                        firstImage !== null &&
                        "url" in firstImage
                      ) {
                        imageUrl = (firstImage as any).url
                      }
                    }
                  }

                  return (
                    <div
                      key={car.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ListingCard
                        image={imageUrl}
                        title={`${car.year || ""} ${car.make || ""} ${car.model || ""}`.trim()}
                        price={`$${(car.priceAmount || 0).toLocaleString()}`}
                        location={car.dealership?.name || "Dealership"}
                        category="Vehicles"
                        verified={car.isFeatured}
                        views={(parseInt(car.id.slice(-3), 16) % 1000) + 100}
                      />
                    </div>
                  )
                })}
              </div>

              {/* View All Results Button */}
              <div className="text-center mt-12">
                <a
                  href={`/${lng}/cars/shop?${new URLSearchParams(
                    Object.entries(inventoryFilters || {})
                      .filter(([_, v]) => v !== undefined)
                      .map(([k, v]) => [
                        k,
                        Array.isArray(v) ? v.join(",") : String(v),
                      ])
                  ).toString()}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors glow-hover"
                >
                  View All {inventoryQuery.data.total} Results
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground text-lg mb-6">
                Try adjusting your search or browse our categories below
              </p>
              <button
                onClick={clearAiSearch}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      )}

      {/* Categories Section - Only show when no AI search */}
      {!aiFilters && (
        <>
          <section className="container mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl lg:text-5xl font-black tracking-tight mb-4">
                Browse by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Category
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover amazing deals across all categories
              </p>
            </div>

            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </section>

          {/* Featured Listings Section */}
          <section className="container mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl lg:text-5xl font-black tracking-tight mb-4">
                Featured{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Listings
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Hand-picked premium selections just for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ListingCard
                    image={`/images/vip/listing-car-plain-${(index % 2) + 1}.jpg`}
                    title={`Featured Vehicle ${index + 1}`}
                    price="$45,990"
                    location="Various, US"
                    badge={index === 0 ? "Best Value" : undefined}
                    category="Vehicles"
                    verified={index % 2 === 0}
                    views={250 + index * 50}
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Active Listings" },
              { value: "5K+", label: "Happy Customers" },
              { value: "50+", label: "Verified Dealers" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="font-display text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

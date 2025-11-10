/* eslint-disable  */

import type { Metadata } from "next"
import { useTranslation } from "@/lib/i18n"
import Hero from "@/components/Hero"
import CategoryFilter from "@/components/CategoryFilter"
import ListingCard from "@/components/ListingCard"
import AIFilterButton from "@/components/AIFilterButton"
import { Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/rules-of-hooks */
// Generate dynamic metadata from translations
export async function generateMetadata({
  params: { lng },
}: {
  params: { lng: string }
}): Promise<Metadata> {
  const { t } = await useTranslation(lng, ["landing"])

  return {
    title: t(
      "meta.title",
      "Check The Lot | AI-Powered Marketplace for Vehicles, Homes, Boats & More"
    ),
    description: t(
      "meta.description",
      "Discover your next dream purchase with AI-powered search. Browse vehicles, motorcycles, RVs, boats, homes and more in one intelligent marketplace."
    ),
  }
}

// Landing page component
export default async function LandingPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  // Get translations for landing page
  const { t } = await useTranslation(lng, ["landing", "common"])

  const featuredListings = [
    {
      image: "/images/vip/listing-car-1.jpg",
      title: "2024 Tesla Model S Plaid",
      price: "$94,990",
      location: "San Francisco, CA",
      badge: "Best match",
      category: "Vehicles",
      verified: true,
      views: 1234,
    },
    {
      image: "/images/vip/listing-car-2.jpg",
      title: "2024 Porsche 911 Turbo S",
      price: "$189,900",
      location: "Miami, FL",
      badge: "Premium choice",
      category: "Vehicles",
      verified: true,
      views: 856,
    },
    {
      image: "/images/vip/listing-motorcycle-1.jpg",
      title: "Ducati Panigale V4",
      price: "$28,500",
      location: "Los Angeles, CA",
      badge: "Popular",
      category: "Motorcycles",
      views: 542,
    },
    {
      image: "/images/vip/listing-rv-1.jpg",
      title: "2023 Mercedes Sprinter RV",
      price: "$89,900",
      location: "Denver, CO",
      badge: "Great value",
      category: "RVs",
      verified: true,
      views: 678,
    },
    {
      image: "/images/vip/listing-boat-1.jpg",
      title: "28ft Center Console Boat",
      price: "$45,000",
      location: "Fort Lauderdale, FL",
      category: "Boats",
      views: 423,
    },
    {
      image: "/images/vip/listing-home-1.jpg",
      title: "Charming Suburban Home",
      price: "$425,000",
      location: "Charlotte, NC",
      category: "Homes",
      verified: true,
      views: 2103,
    },
  ]

  return (
    <main className="bg-background dark:bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Category Filter Section */}
      <section className="py-12 px-6 bg-background/95 backdrop-blur-sm border-t border-border/50">
        <div className="container mx-auto">
          <CategoryFilter />
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight">
                  Featured Listings
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                AI-curated picks based on trending searches
              </p>
            </div>
            <Link href="/search">
              <Button size="lg" className="hidden md:flex glow-hover">
                View All Listings
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ListingCard {...listing} />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12 md:hidden">
            <Link href="/search">
              <Button size="lg" className="glow-hover">
                View All Listings
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: "847", label: "Active Listings" },
              { value: "5K+", label: "Happy Buyers" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "24/7", label: "AI Support" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="font-display text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="container mx-auto relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight">
              Ready to find your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                perfect match?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of buyers discovering their dream purchases with
              AI-powered search.
            </p>
            <Link href="/search">
              <Button size="lg" className="h-14 px-10 text-lg glow-hover">
                Start Searching Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating AI Filter Button */}
      <AIFilterButton />
    </main>
  )
}

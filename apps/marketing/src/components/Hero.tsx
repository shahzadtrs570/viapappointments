"use client"

import { useState } from "react"
import { Mic, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface HeroProps {
  onAiSearch?: (query: string) => Promise<void>
  isSearching?: boolean
}

const Hero = ({ onAiSearch, isSearching: externalIsSearching }: HeroProps) => {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [internalIsSearching, setInternalIsSearching] = useState(false)

  const isSearching = externalIsSearching || internalIsSearching

  const handleAISearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter a search query",
        description: "Please describe what you're looking for",
        variant: "destructive",
      })
      return
    }

    if (onAiSearch) {
      // Use the callback from parent
      await onAiSearch(searchQuery)
    } else {
      // Fallback behavior if no callback provided
      setInternalIsSearching(true)
      try {
        const response = await fetch("/api/ai-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        })
        if (response.ok) {
          const data = await response.json()
          toast({
            title: "AI Understanding",
            description: data.interpretation || "Processing your search...",
          })
        }
      } catch (error) {
        console.error("AI search error:", error)
        toast({
          title: "Search Error",
          description: "Please try again",
          variant: "destructive",
        })
      } finally {
        setInternalIsSearching(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSearching) {
      handleAISearch()
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 blur-sm"
        >
          <source src="/video/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[120px] animate-float"
        style={{ animationDelay: "3s" }}
      ></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center animate-fade-in-up">
        <h1 className="font-display text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
          Discover Your Next
          <span className="block mt-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow-pulse">
            Dream Purchase
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
          One marketplace for vehicles, motorcycles, RVs, boats, and more.
          <br />
          <span className="text-primary">
            Powered by AI. Built for discovery.
          </span>
        </p>

        {/* AI Search Bar */}
        <div className="max-w-4xl mx-auto glass-strong rounded-2xl p-2 shadow-glass glow-hover mb-8">
          <div className="flex items-center gap-3 bg-background/60 rounded-xl px-6 py-4">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Try: 'Tesla under $60K' or 'Luxury SUV with low miles'"
              className="border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 font-medium flex-1"
              disabled={isSearching}
            />
            <Button
              size="sm"
              onClick={handleAISearch}
              disabled={isSearching}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 rounded-xl font-bold text-sm glow-primary shadow-lg disabled:opacity-50 flex-shrink-0 min-w-[120px]"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                "Ask AI"
              )}
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-6 font-medium">
          <span className="text-primary">Popular:</span> "Electric cars under
          $50K" • "Waterfront homes for rent" • "Best value boats near me"
        </p>
      </div>
    </section>
  )
}

export default Hero

"use client"

import {
  Heart,
  MapPin,
  Sparkles,
  Eye,
  MessageCircle,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Image from "next/image"

interface ListingCardProps {
  image: string
  title: string
  price: string
  location: string
  badge?: string
  category: string
  verified?: boolean
  views?: number
}

const ListingCard = ({
  image,
  title,
  price,
  location,
  badge,
  category,
  verified = false,
  views,
}: ListingCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative glass-strong rounded-3xl overflow-hidden shadow-card hover:shadow-glass transition-all duration-700 hover:-translate-y-3 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-all duration-1000 group-hover:scale-110"
          style={{
            filter: isHovered
              ? "brightness(1.1) contrast(1.05)"
              : "brightness(1) contrast(1)",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

        {/* Top Row Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            {badge && (
              <div className="glass-strong px-3 py-1.5 rounded-full flex items-center gap-2 animate-scale-in backdrop-blur-xl">
                <Sparkles className="h-3 w-3 text-accent" />
                <span className="text-xs font-semibold text-accent">
                  {badge}
                </span>
              </div>
            )}
            {verified && (
              <div className="glass-strong px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-xl">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  Verified
                </span>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsFavorited(!isFavorited)
            }}
            className={`glass-strong p-2.5 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-110 ${
              isFavorited ? "bg-primary/20" : ""
            }`}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${
                isFavorited ? "fill-primary text-primary" : "text-foreground"
              }`}
            />
          </button>
        </div>

        {/* Category Badge */}
        <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground border-border/50 font-medium px-3 py-1">
          {category}
        </Badge>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-0 transition-all duration-500">
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-2xl font-bold mb-2 line-clamp-1 text-white drop-shadow-lg">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-white/90 mb-3">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-bold text-white drop-shadow-lg">
                {price}
              </p>
            </div>
          </div>
        </div>

        {/* Hover Actions */}
        <div
          className={`absolute inset-x-0 bottom-0 p-6 flex gap-3 transition-all duration-500 ${
            isHovered
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <Button
            className="flex-1 bg-primary/95 backdrop-blur-sm hover:bg-primary shadow-lg font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-background/95 backdrop-blur-sm hover:bg-background/100 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      {views && (
        <div className="px-6 py-3 border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="font-medium">
                {views.toLocaleString()} views
              </span>
            </div>
            <span className="text-xs">Listed 2 days ago</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListingCard

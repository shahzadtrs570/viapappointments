import { cn } from "@package/utils"
import Image from "next/image"

import { AspectRatio } from "../AspectRatio/AspectRatio"
import { Badge } from "../Badge/Badge"
import { Card, CardContent, CardFooter } from "../Card/Card"

export interface PropertyCardProps {
  id: string
  title: string
  address: {
    streetLine1: string
    streetLine2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
  price: number
  currency?: string
  imageUrl: string
  bedroomCount: number
  bathroomCount: number
  totalAreaSqM: number
  propertyType: string
  className?: string
  showViewButton?: boolean
  onViewClick?: (id: string) => void
}

export function PropertyCard({
  id,
  title,
  address,
  price,
  currency = "£",
  imageUrl,
  bedroomCount,
  bathroomCount,
  totalAreaSqM,
  propertyType,
  className,
  showViewButton = true,
  onViewClick,
}: PropertyCardProps) {
  // Format location string
  const location = [
    address.city,
    address.state,
    address.country,
  ].filter(Boolean).join(", ")

  // Format price with appropriate currency
  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency === "£" ? "GBP" : currency === "€" ? "EUR" : "USD",
    maximumFractionDigits: 0,
  }).format(price)

  // Format area with appropriate unit
  const formattedArea = `${totalAreaSqM} m²`
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <AspectRatio ratio={16 / 9} className="relative">
        <Image
          src={imageUrl || "/placeholder-property.jpg"}
          alt={title}
          fill
          className="object-cover"
        />
        <Badge
          className="absolute top-2 right-2 bg-primary text-primary-foreground"
        >
          {propertyType}
        </Badge>
      </AspectRatio>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-1">{location}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-primary">{formattedPrice}</p>
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bed">
                <path d="M2 9V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3" />
                <path d="M2 11v3" />
                <path d="M22 11v3" />
                <path d="M2 9h20" />
                <path d="M2 14h20" />
              </svg>
              {bedroomCount}
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bath">
                <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                <line x1="10" x2="8" y1="5" y2="7" />
                <line x1="2" x2="22" y1="12" y2="12" />
              </svg>
              {bathroomCount}
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square">
                <rect width="18" height="18" x="3" y="3" rx="2" />
              </svg>
              {formattedArea}
            </span>
          </div>
        </div>
      </CardContent>
      {showViewButton && (
        <CardFooter className="p-4 pt-0">
          <button
            onClick={() => onViewClick?.(id)}
            className="w-full py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
          >
            View Property
          </button>
        </CardFooter>
      )}
    </Card>
  )
} 
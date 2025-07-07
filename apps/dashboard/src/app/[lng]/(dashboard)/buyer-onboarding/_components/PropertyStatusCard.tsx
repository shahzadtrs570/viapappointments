import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { Card, CardContent, CardFooter } from "@package/ui/card"
import Image from "next/image"

import type { Property } from "./types"

interface PropertyStatusCardProps {
  property: Property
  onView?: () => void
  onEdit?: () => void
}

export function PropertyStatusCard({
  property,
  onView,
  onEdit,
}: PropertyStatusCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
            Pending
          </Badge>
        )
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
            Active
          </Badge>
        )
      case "sold":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
            Sold
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400">
            Inactive
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </Badge>
        )
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          fill
          alt={property.address}
          className="object-cover"
          src={property.image}
        />
        {getStatusBadge(property.status)}
      </div>
      <CardContent className="p-4">
        <div className="mb-2 text-lg font-semibold">{property.address}</div>
        <div className="mb-1 text-sm text-muted-foreground">
          {property.city}, {property.state} {property.zipCode}
        </div>
        <div className="text-lg font-bold text-primary">
          {formatCurrency(property.price)}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          {property.bedrooms && (
            <div>
              <div className="font-medium">{property.bedrooms}</div>
              <div className="text-xs text-muted-foreground">Beds</div>
            </div>
          )}
          {property.bathrooms && (
            <div>
              <div className="font-medium">{property.bathrooms}</div>
              <div className="text-xs text-muted-foreground">Baths</div>
            </div>
          )}
          {property.squareFeet && (
            <div>
              <div className="font-medium">{property.squareFeet}</div>
              <div className="text-xs text-muted-foreground">Sq Ft</div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/20 p-3">
        <Button size="sm" variant="outline" onClick={onView}>
          View Details
        </Button>
        <Button size="sm" onClick={onEdit}>
          Edit Property
        </Button>
      </CardFooter>
    </Card>
  )
}

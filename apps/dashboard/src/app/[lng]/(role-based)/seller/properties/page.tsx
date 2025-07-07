/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable sort-imports*/
/*eslint-disable react/no-unescaped-entities*/

"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { mockProperties, mockSellerProperties } from "@/mock-data/properties"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { Plus } from "lucide-react"
import type { PropertyType } from "@/mock-data/types"
import { PlaceholderImage } from "@/components/ui/PlaceholderImage"
import { useRouter } from "next/navigation"

// Helper function to format property type
const formatPropertyType = (type: PropertyType) => {
  const mapping: Record<PropertyType, string> = {
    HOUSE: "House",
    APARTMENT: "Apartment",
    BUNGALOW: "Bungalow",
    COTTAGE: "Cottage",
    VILLA: "Villa",
    OTHER: "Other",
  }
  return mapping[type] || "Property"
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function PropertiesPage() {
  const router = useRouter()
  // In a real app, this would fetch from an API
  const sellerProperties = mockSellerProperties

  const properties = sellerProperties
    .map((sp) => mockProperties.find((p) => p.id === sp.propertyId))
    .filter(Boolean)

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-muted-foreground">
            Manage and track all your properties
          </p>
        </div>
        <Button onClick={() => router.push("/seller/properties/add")}>
          <Plus className="mr-2 size-4" />
          Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map(
          (property) =>
            property && (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative h-48">
                  <PlaceholderImage
                    alt={`${property.address.streetLine1}, ${property.address.city}`}
                    text={`${formatPropertyType(property.propertyType)} - ${property.address.city}`}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute left-3 top-3">
                    {formatPropertyType(property.propertyType)}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {property.address.streetLine1}
                  </CardTitle>
                  <CardDescription>
                    {property.address.city}, {property.address.postalCode}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Estimated Value
                      </span>
                      <span className="font-medium">
                        {formatCurrency(property.estimatedValue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bedrooms</span>
                      <span className="font-medium">
                        {property.bedroomCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Area</span>
                      <span className="font-medium">
                        {property.totalAreaSqM} m²
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      className="mt-4 w-full"
                      onClick={() => {
                        router.push(`/seller/properties/${property.id}`)
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
        )}
      </div>
    </div>
  )
}

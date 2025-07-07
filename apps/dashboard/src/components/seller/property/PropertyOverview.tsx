/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

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
import { CalendarIcon, HomeIcon, MapPinIcon, RulerIcon } from "lucide-react"
import { PropertyType, PropertyCondition } from "@/mock-data/types"
import { PlaceholderImage } from "@/components/ui/PlaceholderImage"

// Helper functions to display formatted property information
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

const formatPropertyCondition = (condition: PropertyCondition) => {
  const mapping: Record<PropertyCondition, string> = {
    EXCELLENT: "Excellent",
    GOOD: "Good",
    FAIR: "Fair",
    NEEDS_RENOVATION: "Needs Renovation",
  }
  return mapping[condition] || "Unknown"
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value)
}

export function PropertyOverview() {
  // In a real application, this would fetch the seller's properties from the API
  // For now, we're using mock data - assuming the first property
  const sellerProperty = mockSellerProperties[0]
  const property = mockProperties.find(
    (p) => p.id === sellerProperty.propertyId
  )

  if (!property) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Not Found</CardTitle>
          <CardDescription>
            No property information is available. Please contact support.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Overview</CardTitle>
          <CardDescription>
            Details of your property in the Srenova platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="relative h-60 overflow-hidden rounded-lg">
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-gray-900/40 to-gray-900/0" />
              <PlaceholderImage
                alt={`${property.address.streetLine1}, ${property.address.city}`}
                text={`${formatPropertyType(property.propertyType as PropertyType)} - ${property.address.city}`}
                fill
                className="object-cover"
              />
              <Badge className="absolute left-3 top-3 z-20">
                {formatPropertyType(property.propertyType as PropertyType)}
              </Badge>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                {property.address.streetLine1}
              </h3>
              <p className="flex items-center gap-1 text-muted-foreground">
                <MapPinIcon className="size-4" />
                {property.address.city}, {property.address.postalCode}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p className="font-medium">{property.bedroomCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                  <p className="font-medium">{property.bathroomCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="font-medium">{property.totalAreaSqM} m²</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-medium">
                    {formatPropertyCondition(property.condition)}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(property.estimatedValue)}
                </p>
                {property.confirmedValue && (
                  <p className="text-sm text-muted-foreground">
                    Confirmed Value: {formatCurrency(property.confirmedValue)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ownership Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ownership</span>
                <span className="font-medium">
                  {sellerProperty.ownershipPercentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registration Date</span>
                <span className="font-medium">
                  {new Date(sellerProperty.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" size="sm">
                <CalendarIcon className="mr-2 size-4" />
                Request Valuation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Property Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <HomeIcon className="mr-2 size-4" />
                Update Property Details
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <RulerIcon className="mr-2 size-4" />
                Add Property Features
              </Button>
              <Button variant="secondary" className="w-full">
                Upload Photos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

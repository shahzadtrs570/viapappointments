/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable import/no-default-export*/
"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Input } from "@package/ui/input"
import { Button } from "@package/ui/button"
import { Badge } from "@package/ui/badge"
import { Slider } from "@package/ui/slider"
import { Checkbox } from "@package/ui/checkbox"
import { Label } from "@package/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import {
  Search,
  MapPin,
  Home,
  Bed,
  Bath,
  Bookmark,
  ArrowUpDown,
} from "lucide-react"
import { mockProperties } from "@/mock-data"
import { PropertyType } from "@/mock-data/types"
import { PlaceholderImage } from "@/components/ui/PlaceholderImage"

// Helper functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value)
}

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

// Filterable Properties Component
export default function PropertySearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<
    PropertyType[]
  >([])
  const [minBedrooms, setMinBedrooms] = useState(0)
  const [sortOption, setSortOption] = useState("price-desc")

  // Filter properties based on search criteria
  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      !searchQuery ||
      property.address.streetLine1
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      property.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.postalCode
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesPrice =
      property.estimatedValue >= priceRange[0] &&
      property.estimatedValue <= priceRange[1]

    const matchesPropertyType =
      selectedPropertyTypes.length === 0 ||
      selectedPropertyTypes.includes(property.propertyType)

    const matchesBedrooms = property.bedroomCount >= minBedrooms

    return (
      matchesSearch && matchesPrice && matchesPropertyType && matchesBedrooms
    )
  })

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.estimatedValue - b.estimatedValue
      case "price-desc":
        return b.estimatedValue - a.estimatedValue
      case "bedrooms-desc":
        return b.bedroomCount - a.bedroomCount
      case "size-desc":
        return b.totalAreaSqM - a.totalAreaSqM
      default:
        return 0
    }
  })

  // Toggle property type selection
  const togglePropertyType = (type: PropertyType) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter((t) => t !== type))
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type])
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Search</CardTitle>
          <CardDescription>
            Find and filter properties based on your investment criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by address, city, or postal code"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Price Range</h3>
              <Slider
                defaultValue={[0, 2000000]}
                max={2000000}
                step={50000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
              <div className="flex justify-between">
                <span className="text-sm">{formatCurrency(priceRange[0])}</span>
                <span className="text-sm">{formatCurrency(priceRange[1])}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Property Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PropertyType).map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedPropertyTypes.includes(type)}
                      onCheckedChange={() => togglePropertyType(type)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm">
                      {formatPropertyType(type)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Minimum Bedrooms</h3>
                <Select
                  value={String(minBedrooms)}
                  onValueChange={(value) => setMinBedrooms(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Sort By</h3>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-desc">
                      Price (High to Low)
                    </SelectItem>
                    <SelectItem value="price-asc">
                      Price (Low to High)
                    </SelectItem>
                    <SelectItem value="bedrooms-desc">
                      Bedrooms (Most first)
                    </SelectItem>
                    <SelectItem value="size-desc">
                      Size (Largest first)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setPriceRange([0, 2000000])
              setSelectedPropertyTypes([])
              setMinBedrooms(0)
              setSortOption("price-desc")
            }}
          >
            Reset Filters
          </Button>
          <div className="text-sm text-muted-foreground">
            {sortedProperties.length} properties found
          </div>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedProperties.length > 0 ? (
          sortedProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative h-48">
                <PlaceholderImage
                  text={`${property.address.streetLine1}, ${property.address.city}`}
                  alt={`${property.address.streetLine1}, ${property.address.city}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/10" />
                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="truncate font-semibold text-white">
                    {property.address.streetLine1}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-white/80">
                    <MapPin className="mr-1 size-3" />
                    {property.address.city}, {property.address.postalCode}
                  </div>
                </div>
                <Badge className="absolute right-4 top-4 bg-white/90 text-gray-800">
                  {formatPropertyType(property.propertyType)}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-lg font-bold">
                    {formatCurrency(property.estimatedValue)}
                  </div>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="flex items-center">
                      <Bed className="mr-1 size-3" />
                      {property.bedroomCount}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Bath className="mr-1 size-3" />
                      {property.bathroomCount}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Home className="mr-1 size-3" />
                      {property.totalAreaSqM} m²
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-4 py-3">
                <Button size="sm" variant="outline" className="mr-2 flex-1">
                  <ArrowUpDown className="mr-2 size-4" />
                  Compare
                </Button>
                <Button size="sm" className="flex-1">
                  <Bookmark className="mr-2 size-4" />
                  Save
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 rounded-lg border bg-muted/10 p-8 text-center">
            <h3 className="mb-2 font-semibold">No Properties Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria to see more properties.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

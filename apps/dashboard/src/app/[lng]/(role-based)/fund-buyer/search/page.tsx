/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable sort-imports*/
/*eslint-disable jsx-a11y/label-has-associated-control*/

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Input } from "@package/ui/input"
import { Button } from "@package/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Slider } from "@package/ui/slider"
import { Badge } from "@package/ui/badge"
import {
  Search,
  MapPin,
  BedDouble,
  Bath,
  SlidersHorizontal,
  Square,
} from "lucide-react"
import { mockProperties } from "@/mock-data"
import Link from "next/link"
import { PlaceholderImage } from "@/components/ui/PlaceholderImage"

export default function PropertySearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [propertyType, setPropertyType] = useState<string | undefined>(
    undefined
  )
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [minBedrooms, setMinBedrooms] = useState<string | undefined>(undefined)
  const [location, setLocation] = useState("")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setPropertyType(undefined)
    setPriceRange([0, 1000000])
    setMinBedrooms(undefined)
    setLocation("")
  }

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      searchTerm === "" ||
      property.address.streetLine1
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      property.address.city.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType =
      !propertyType ||
      propertyType === "all" ||
      property.propertyType === propertyType
    const matchesPrice =
      property.estimatedValue >= priceRange[0] &&
      property.estimatedValue <= priceRange[1]
    const matchesBedrooms =
      !minBedrooms ||
      minBedrooms === "all" ||
      property.bedroomCount >= parseInt(minBedrooms)
    const matchesLocation =
      location === "" ||
      property.address.city.toLowerCase().includes(location.toLowerCase())

    return (
      matchesSearch &&
      matchesType &&
      matchesPrice &&
      matchesBedrooms &&
      matchesLocation
    )
  })

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Property Search</h1>
        <p className="text-muted-foreground">
          Search and filter properties that match your investment criteria.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Search Filters</CardTitle>
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="text-sm"
          >
            Clear Filters
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by address or city..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                More Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="HOUSE">House</SelectItem>
                    <SelectItem value="APARTMENT">Apartment</SelectItem>
                    <SelectItem value="BUNGALOW">Bungalow</SelectItem>
                    <SelectItem value="VILLA">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Bedrooms</label>
                <Select value={minBedrooms} onValueChange={setMinBedrooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter city..."
                    className="pl-8"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="pt-2">
                  <Slider
                    min={0}
                    max={1000000}
                    step={50000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full py-8 text-center">
            <p className="text-muted-foreground">
              No properties match your search criteria.
            </p>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {/* In a real app, this would be an actual image */}
                <PlaceholderImage
                  text={`${property.address.streetLine1}, ${property.address.city}`}
                  alt={`${property.address.streetLine1}, ${property.address.city}`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {property.address.streetLine1}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {property.address.city}
                    </p>
                  </div>
                  <Badge variant="secondary">{property.propertyType}</Badge>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-1">
                    <BedDouble className="size-4 text-muted-foreground" />
                    <span className="text-sm">{property.bedroomCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="size-4 text-muted-foreground" />
                    <span className="text-sm">{property.bathroomCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="size-4 text-muted-foreground" />
                    <span className="text-sm">{property.totalAreaSqM}m²</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    {formatCurrency(property.estimatedValue)}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/fund-buyer/properties/${property.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

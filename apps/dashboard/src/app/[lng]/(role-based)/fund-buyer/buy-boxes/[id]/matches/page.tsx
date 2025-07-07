/*eslint-disable react/jsx-sort-props*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable import/order*/
/*eslint-disable sort-imports*/

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Input } from "@package/ui/input"
import { Button } from "@package/ui/button"
import { Badge } from "@package/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Progress } from "@package/ui/progress"
import { Search, ArrowLeft, BedDouble, Bath, Square } from "lucide-react"
import Link from "next/link"
import {
  mockProperties,
  findBuyBoxById,
  findPropertiesByBuyBoxId,
} from "@/mock-data"
import { PlaceholderImage } from "@/components/ui/PlaceholderImage"

type SortOption = "price-asc" | "price-desc" | "bedrooms-asc" | "bedrooms-desc"

export default function BuyBoxMatchesPage({
  params,
}: {
  params: { id: string }
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("price-desc")
  const buyBox = findBuyBoxById(params.id)
  const matchingProperties = findPropertiesByBuyBoxId(params.id)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const filteredAndSortedProperties = matchingProperties
    .filter(
      (property) =>
        searchTerm === "" ||
        property.address.streetLine1
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        property.address.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.estimatedValue - b.estimatedValue
        case "price-desc":
          return b.estimatedValue - a.estimatedValue
        case "bedrooms-asc":
          return a.bedroomCount - b.bedroomCount
        case "bedrooms-desc":
          return b.bedroomCount - a.bedroomCount
        default:
          return 0
      }
    })

  if (!buyBox) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold">Buy Box not found</h1>
      </div>
    )
  }

  const matchPercentage =
    (matchingProperties.length / mockProperties.length) * 100

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/fund-buyer/buy-boxes">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{buyBox.name}</h1>
          <p className="text-muted-foreground">
            Viewing {matchingProperties.length} matching properties
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Total Investment Value
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  matchingProperties.reduce(
                    (sum, p) => sum + p.estimatedValue,
                    0
                  )
                )}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Average Property Value
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  matchingProperties.reduce(
                    (sum, p) => sum + p.estimatedValue,
                    0
                  ) / matchingProperties.length || 0
                )}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Match Rate</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{matchingProperties.length} properties</span>
                  <span>{Math.round(matchPercentage)}%</span>
                </div>
                <Progress value={matchPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
            <SelectItem value="bedrooms-desc">Bedrooms (Most)</SelectItem>
            <SelectItem value="bedrooms-asc">Bedrooms (Least)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
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
        ))}
      </div>
    </div>
  )
}

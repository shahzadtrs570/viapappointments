/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Button } from "@package/ui/button"
import { Badge } from "@package/ui/badge"
import { Progress } from "@package/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import {
  Plus,
  Building2,
  Settings2,
  AlertCircle,
  CheckCircle2,
  Clock,
  PauseCircle,
} from "lucide-react"
import Link from "next/link"
import {
  findPropertiesByBuyBoxId,
  mockBuyBoxes,
  mockProperties,
} from "@/mock-data"
import type { MockBuyBox } from "@/mock-data/types"

export default function BuyBoxesPage() {
  const [activeTab, setActiveTab] = useState<string>("active")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle2 className="size-4 text-emerald-500" />
      case "PAUSED":
        return <PauseCircle className="size-4 text-amber-500" />
      case "DRAFT":
        return <Clock className="size-4 text-slate-500" />
      default:
        return <AlertCircle className="size-4 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-700"
      case "PAUSED":
        return "bg-amber-100 text-amber-700"
      case "DRAFT":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-red-100 text-red-700"
    }
  }

  const buyBoxes = mockBuyBoxes.filter((box) =>
    activeTab === "active" ? box.status === "ACTIVE" : box.status !== "ACTIVE"
  )

  // Calculate matching properties for each buy box
  const getMatchingPropertiesCount = (box: MockBuyBox) => {
    const properties = findPropertiesByBuyBoxId(box.id)
    return properties.length
  }

  const getMatchingPercentage = (box: MockBuyBox) => {
    const properties = findPropertiesByBuyBoxId(box.id)
    // For demo purposes, we'll calculate a percentage based on properties count
    return (properties.length / mockProperties.length) * 100
  }

  // Calculate price range from properties
  const getPriceRange = (box: MockBuyBox) => {
    const properties = findPropertiesByBuyBoxId(box.id)
    if (properties.length === 0) return { min: 0, max: 0 }

    const values = properties.map((p) => p.estimatedValue)
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    }
  }

  // Get unique property types from properties
  const getPropertyTypes = (box: MockBuyBox) => {
    const properties = findPropertiesByBuyBoxId(box.id)
    return [...new Set(properties.map((p) => p.propertyType))]
  }

  // Get unique locations from properties
  const getLocations = (box: MockBuyBox) => {
    const properties = findPropertiesByBuyBoxId(box.id)
    return [...new Set(properties.map((p) => p.address.city))]
  }

  // Get minimum bedrooms from properties
  const getMinBedrooms = (box: MockBuyBox) => {
    const properties = findPropertiesByBuyBoxId(box.id)
    if (properties.length === 0) return 0
    return Math.min(...properties.map((p) => p.bedroomCount))
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Buy Boxes</h1>
          <p className="text-muted-foreground">
            Create and manage your property investment criteria.
          </p>
        </div>
        <Button asChild>
          <Link
            href="/fund-buyer/buy-boxes/add"
            className="flex items-center gap-2"
          >
            <Plus className="size-4" />
            Create Buy Box
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Buy Boxes</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Buy Boxes</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {buyBoxes.map((box) => {
              const priceRange = getPriceRange(box)
              const propertyTypes = getPropertyTypes(box)
              const locations = getLocations(box)
              const minBedrooms = getMinBedrooms(box)

              return (
                <Card key={box.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {box.name}
                          <Badge
                            variant="secondary"
                            className={getStatusColor(box.status)}
                          >
                            {box.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Created on{" "}
                          {new Date(box.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusIcon(box.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Price Range
                        </span>
                        <span className="font-medium">
                          {formatCurrency(priceRange.min)} -{" "}
                          {formatCurrency(priceRange.max)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Property Types
                        </span>
                        <span className="font-medium">
                          {propertyTypes.join(", ")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Locations</span>
                        <span className="font-medium">
                          {locations.join(", ")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Min. Bedrooms
                        </span>
                        <span className="font-medium">{minBedrooms}+</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total Value
                        </span>
                        <span className="font-medium">
                          {formatCurrency(box.totalValue)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Initial Investment
                        </span>
                        <span className="font-medium">
                          {formatCurrency(box.initialInvestmentAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Monthly Income
                        </span>
                        <span className="font-medium">
                          {formatCurrency(box.estimatedMonthlyIncome)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Indexation Rate
                        </span>
                        <span className="font-medium">
                          {box.averageIndexationRate}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Matching Properties</span>
                        <span className="font-medium">
                          {getMatchingPropertiesCount(box)}
                        </span>
                      </div>
                      <Progress
                        value={getMatchingPercentage(box)}
                        className="h-2"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 hover:bg-secondary/80"
                        asChild
                      >
                        <Link
                          href={`/fund-buyer/buy-boxes/${box.id}`}
                          className="flex items-center justify-center gap-2"
                        >
                          <Building2 className="size-4" />
                          View Properties
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-accent"
                        asChild
                      >
                        <Link
                          href={`/fund-buyer/buy-boxes/${box.id}`}
                          className="flex items-center justify-center gap-2"
                        >
                          <Settings2 className="size-4" />
                          Edit Box
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {buyBoxes.map((box) => {
              const priceRange = getPriceRange(box)
              const propertyTypes = getPropertyTypes(box)

              return (
                <Card key={box.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {box.name}
                          <Badge
                            variant="secondary"
                            className={getStatusColor(box.status)}
                          >
                            {box.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Last updated{" "}
                          {new Date(box.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusIcon(box.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Price Range
                        </span>
                        <span className="font-medium">
                          {formatCurrency(priceRange.min)} -{" "}
                          {formatCurrency(priceRange.max)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Property Types
                        </span>
                        <span className="font-medium">
                          {propertyTypes.join(", ")}
                        </span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/fund-buyer/buy-boxes/${box.id}/edit`}
                        className="flex items-center justify-center gap-2"
                      >
                        <Settings2 className="size-4" />
                        Edit Buy Box
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

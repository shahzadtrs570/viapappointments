/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
/*eslint-disable @typescript-eslint/no-unused-vars*/
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Button } from "@package/ui/button"
import { Badge } from "@package/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Progress } from "@package/ui/progress"
import {
  BuildingIcon,
  HomeIcon,
  PackageIcon,
  Plus,
  Eye,
  Settings,
  Edit,
  MapPin,
} from "lucide-react"
import { mockBuyBoxes, mockProperties } from "@/mock-data"
import type { BuyBoxStatus } from "@/mock-data/types"

// Helper functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value)
}

const formatBuyBoxStatus = (status: BuyBoxStatus) => {
  const mapping: Record<BuyBoxStatus, { label: string; color: string }> = {
    DRAFT: {
      label: "Draft",
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
    ACTIVE: {
      label: "Active",
      color: "bg-green-50 text-green-700 border-green-200",
    },
    PENDING_OFFER: {
      label: "Pending Offer",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    SOLD: {
      label: "Sold",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    ARCHIVED: {
      label: "Archived",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
  }
  return mapping[status] || { label: status, color: "" }
}

export function BuyBoxManagement() {
  // Get all Buy Boxes from mock data
  const buyBoxes = mockBuyBoxes

  // Get list of properties for each buy box
  const buyBoxProperties = (buyBoxId: string) => {
    // The actual implementation would use the mock data for BuyBoxProperty
    // For now, we'll return a mock list of property IDs
    return mockProperties.slice(0, 3).map((p) => p.id)
  }

  // Portfolio Buy Boxes created by administrators
  const portfolioBuyBoxes = buyBoxes.filter((box) => box.isAdminCreated)

  // Custom Buy Boxes created by the fund buyer
  const customBuyBoxes = buyBoxes.filter((box) => !box.isAdminCreated)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-xl font-semibold">Buy Box Management</h2>
          <p className="text-muted-foreground">
            Browse and manage property portfolios
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Create Buy Box
        </Button>
      </div>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="portfolio">Portfolio Buy Boxes</TabsTrigger>
          <TabsTrigger value="custom">Custom Buy Boxes</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {portfolioBuyBoxes.map((buyBox) => {
              // Get property IDs for this Buy Box
              const propertyIds = buyBoxProperties(buyBox.id)

              // Calculate total value of properties in this Buy Box
              const totalValue = propertyIds.reduce(
                (sum: number, propertyId: string) => {
                  const property = mockProperties.find(
                    (p) => p.id === propertyId
                  )
                  return sum + (property?.estimatedValue || 0)
                },
                0
              )

              // Get status badge style
              const statusInfo = formatBuyBoxStatus(buyBox.status)

              return (
                <Card key={buyBox.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{buyBox.name}</CardTitle>
                        <CardDescription>
                          {propertyIds.length} properties ·{" "}
                          {formatCurrency(totalValue)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="mb-4">
                      <div className="mb-1 text-sm text-muted-foreground">
                        Portfolio Composition
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full">
                        <div
                          className="h-2 bg-primary/80"
                          style={{ width: "40%" }}
                        />
                        <div
                          className="h-2 bg-primary/60"
                          style={{ width: "30%" }}
                        />
                        <div
                          className="h-2 bg-primary/40"
                          style={{ width: "20%" }}
                        />
                        <div
                          className="h-2 bg-primary/20"
                          style={{ width: "10%" }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>Houses (40%)</span>
                        <span>Apartments (30%)</span>
                        <span>Others (30%)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <HomeIcon className="mr-2 size-4 text-muted-foreground" />
                        <span className="text-sm">
                          Average property value:{" "}
                          {formatCurrency(
                            totalValue / (propertyIds.length || 1)
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 size-4 text-muted-foreground" />
                        <span className="text-sm">UK Prime</span>
                      </div>
                      <div className="flex items-center">
                        <BuildingIcon className="mr-2 size-4 text-muted-foreground" />
                        <span className="text-sm">Target ROI: 8.5%</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-2 size-4" />
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Make Offer
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}

            {portfolioBuyBoxes.length === 0 && (
              <div className="col-span-2 rounded-lg border bg-muted/10 p-8 text-center">
                <h3 className="mb-2 font-semibold">
                  No Portfolio Buy Boxes Available
                </h3>
                <p className="mb-4 text-muted-foreground">
                  There are currently no portfolio Buy Boxes available for
                  investment.
                </p>
                <Button variant="outline">
                  <PackageIcon className="mr-2 size-4" />
                  Check Back Later
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {customBuyBoxes.map((buyBox) => {
              // Get property IDs for this Buy Box
              const propertyIds = buyBoxProperties(buyBox.id)

              // Calculate total value of properties in this Buy Box
              const totalValue = propertyIds.reduce(
                (sum: number, propertyId: string) => {
                  const property = mockProperties.find(
                    (p) => p.id === propertyId
                  )
                  return sum + (property?.estimatedValue || 0)
                },
                0
              )

              // Get status badge style
              const statusInfo = formatBuyBoxStatus(buyBox.status)

              return (
                <Card key={buyBox.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{buyBox.name}</CardTitle>
                        <CardDescription>
                          {propertyIds.length} properties ·{" "}
                          {formatCurrency(totalValue)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="mb-4">
                      <div className="mb-1 text-sm text-muted-foreground">
                        Portfolio Completion
                      </div>
                      <Progress
                        value={propertyIds.length * 10}
                        className="h-2"
                      />
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>{propertyIds.length} of 10 properties added</span>
                        <span>{propertyIds.length * 10}% complete</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <HomeIcon className="mr-2 size-4 text-muted-foreground" />
                        <span className="text-sm">
                          Average property value:{" "}
                          {formatCurrency(
                            totalValue / (propertyIds.length || 1)
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 size-4 text-muted-foreground" />
                        <span className="text-sm">Custom Selection</span>
                      </div>
                      <div className="flex items-center">
                        <BuildingIcon className="mr-2 size-4 text-muted-foreground" />
                        <span className="text-sm">Target ROI: 7.2%</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="mr-2 size-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="mr-2 size-4" />
                      Manage
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}

            {customBuyBoxes.length === 0 && (
              <div className="col-span-2 rounded-lg border bg-muted/10 p-8 text-center">
                <h3 className="mb-2 font-semibold">No Custom Buy Boxes Yet</h3>
                <p className="mb-4 text-muted-foreground">
                  Create your first custom Buy Box by selecting properties from
                  the Property Search.
                </p>
                <Button>
                  <Plus className="mr-2 size-4" />
                  Create Buy Box
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

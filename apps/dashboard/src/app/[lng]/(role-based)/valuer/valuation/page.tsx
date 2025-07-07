/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/no-explicit-any*/
/*eslint-disable no-nested-ternary*/

"use client"

import { useState } from "react"
import { PropertyValuation } from "@/components/valuer/valuation/PropertyValuation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@package/ui/table"
import { Input } from "@package/ui/input"
import { Search, Building, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"

// Mock property data
const properties = [
  {
    id: "prop1",
    address: "15 Willow Avenue, Manchester",
    postcode: "M14 5TP",
    propertyType: "Semi-detached house",
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 1998,
    tenure: "Freehold",
    status: "pending" as const,
  },
  {
    id: "prop2",
    address: "42 Oak Street, London",
    postcode: "E1 6AN",
    propertyType: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    yearBuilt: 2005,
    tenure: "Leasehold",
    status: "in_progress" as const,
  },
  {
    id: "prop3",
    address: "7 Maple Road, Birmingham",
    postcode: "B15 2TT",
    propertyType: "Detached house",
    bedrooms: 4,
    bathrooms: 3,
    yearBuilt: 1985,
    tenure: "Freehold",
    status: "pending" as const,
  },
  {
    id: "prop4",
    address: "29 Pine Lane, Leeds",
    postcode: "LS1 4DL",
    propertyType: "Terraced house",
    bedrooms: 3,
    bathrooms: 1,
    yearBuilt: 1930,
    tenure: "Freehold",
    status: "completed" as const,
  },
  {
    id: "prop5",
    address: "8 Elm Court, Bristol",
    postcode: "BS1 5AZ",
    propertyType: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: 2010,
    tenure: "Leasehold",
    status: "pending" as const,
  },
]

export default function PropertyValuationPage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  )
  const [searchQuery, setSearchQuery] = useState("")

  const selectedProperty = selectedPropertyId
    ? properties.find((prop) => prop.id === selectedPropertyId)
    : null

  const filteredProperties = properties.filter(
    (prop) =>
      prop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.postcode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSaveValuation = () => {
    // In a real app, this would update the property status in the database
    // and then refresh the property list or navigate away
    setSelectedPropertyId(null)
  }

  const pendingCount = properties.filter((p) => p.status === "pending").length

  return (
    <RoleBasedLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Property Valuation</h1>
        <p className="text-muted-foreground">
          Complete property valuations and generate valuation reports.
        </p>

        {pendingCount > 0 && !selectedProperty && (
          <Alert className="mt-2">
            <AlertCircle className="size-4" />
            <AlertTitle>Properties awaiting valuation</AlertTitle>
            <AlertDescription>
              There are {pendingCount} properties awaiting valuation. Please
              review and assess them.
            </AlertDescription>
          </Alert>
        )}

        {selectedProperty ? (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => setSelectedPropertyId(null)}
              className="mb-4"
            >
              ← Back to property list
            </Button>
            <PropertyValuation
              property={selectedProperty}
              onSave={handleSaveValuation}
            />
          </div>
        ) : (
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Properties for Valuation</CardTitle>
                  <CardDescription>
                    Select a property to begin or continue valuation
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search properties..."
                    className="w-[300px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Postcode</TableHead>
                    <TableHead>Property Type</TableHead>
                    <TableHead>Bedrooms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        {property.address}
                      </TableCell>
                      <TableCell>{property.postcode}</TableCell>
                      <TableCell>{property.propertyType}</TableCell>
                      <TableCell>{property.bedrooms}</TableCell>
                      <TableCell>
                        <Badge
                          className={`
                            ${property.status === "pending" ? "bg-amber-500" : ""}
                            ${property.status === "in_progress" ? "bg-blue-500" : ""}
                            ${property.status === "completed" ? "bg-green-500" : ""}
                          `}
                        >
                          {property.status === "pending"
                            ? "Pending"
                            : property.status === "in_progress"
                              ? "In Progress"
                              : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => setSelectedPropertyId(property.id)}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Building className="size-4" />
                          {property.status === "pending"
                            ? "Start Valuation"
                            : property.status === "in_progress"
                              ? "Continue Valuation"
                              : "View Report"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredProperties.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No properties found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </RoleBasedLayout>
  )
}

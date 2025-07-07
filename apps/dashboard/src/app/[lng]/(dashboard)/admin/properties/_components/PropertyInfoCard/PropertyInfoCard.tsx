/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Typography } from "@package/ui/typography"
import { Bath, Bed, Calendar, Home, MapPin, Square, Tag } from "lucide-react"

import type { FullProperty } from "../../_types"
import type { LucideProps } from "lucide-react"

// Create a custom SquareFootage icon since it doesn't exist in lucide-react
function SquareFootage(props: LucideProps) {
  return (
    <Square {...props}>
      <path
        d="M10 10L14 14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </Square>
  )
}

// Function to format address data into a readable format
function formatAddressData(addressData: any) {
  if (!addressData) return null

  // Check if we have the new structure with lookup and manual
  const lookupData = addressData.lookup || null
  const manualData = addressData.manual || null

  // If neither lookup nor manual exists, treat the addressData as a legacy format
  const dataToUse = lookupData || manualData || addressData

  const sections = [
    {
      title: "Address Details",
      fields: [
        { key: "line_1", label: "Address Line 1", manual: "address" },
        { key: "line_2", label: "Address Line 2" },
        { key: "line_3", label: "Address Line 3" },
        { key: "post_town", label: "Town", manual: "town" },
        { key: "postcode", label: "Postcode", manual: "postcode" },
        { key: "thoroughfare", label: "Street" },
        { key: "building_number", label: "Building Number" },
        { key: "building_name", label: "Building Name" },
      ],
    },
    {
      title: "Geographical Data",
      fields: [
        { key: "country", label: "Country" },
        { key: "county", label: "County", manual: "county" },
        { key: "traditional_county", label: "Traditional County" },
        { key: "district", label: "District" },
        { key: "ward", label: "Ward" },
        { key: "latitude", label: "Latitude" },
        { key: "longitude", label: "Longitude" },
      ],
    },
    {
      title: "Property Details",
      fields: [
        { key: "uprn", label: "UPRN" },
        { key: "udprn", label: "UDPRN" },
        { key: "propertyType", label: "Property Type", manual: "propertyType" },
        { key: "bedrooms", label: "Bedrooms", manual: "bedrooms" },
        { key: "bathrooms", label: "Bathrooms", manual: "bathrooms" },
        { key: "yearBuilt", label: "Year Built", manual: "yearBuilt" },
        {
          key: "propertySize",
          label: "Property Size (m²)",
          manual: "propertySize",
        },
        {
          key: "propertyStatus",
          label: "Property Status",
          manual: "propertyStatus",
        },
        { key: "condition", label: "Condition", manual: "condition" },
        {
          key: "estimatedValue",
          label: "Estimated Value",
          manual: "estimatedValue",
          format: (val: string) => `£${parseInt(val).toLocaleString()}`,
        },
      ],
    },
    {
      title: "Features",
      fields: [
        {
          key: "features",
          label: "Features",
          manual: "features",
          format: (arr: string[]) => arr.join(", "),
        },
      ],
    },
    {
      title: "Identifiers",
      fields: [{ key: "id", label: "ID" }],
    },
  ]

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        // Check for values in either lookup or manual data
        const hasData = section.fields.some((field) => {
          // Check in lookup data first
          if (lookupData && lookupData[field.key]) {
            return true
          }

          // Then check in manual data using the manual field key if available
          if (manualData && field.manual && manualData[field.manual]) {
            return true
          }

          // Finally check in legacy data
          return !lookupData && !manualData && dataToUse[field.key]
        })

        if (!hasData) return null

        return (
          <div
            key={section.title}
            className="border-t pt-4 first:border-t-0 first:pt-0"
          >
            <h4 className="mb-2 font-medium text-primary">{section.title}</h4>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {section.fields.map((field) => {
                // Get value from lookup or manual or legacy data
                let value = null

                // Try lookup data first
                if (lookupData && lookupData[field.key] !== undefined) {
                  value = lookupData[field.key]
                }
                // Then try manual data
                else if (
                  manualData &&
                  field.manual &&
                  manualData[field.manual] !== undefined
                ) {
                  value = manualData[field.manual]
                }
                // Finally fallback to legacy data
                else if (
                  !lookupData &&
                  !manualData &&
                  dataToUse[field.key] !== undefined
                ) {
                  value = dataToUse[field.key]
                }

                // Skip if no value found
                if (value === null || value === undefined || value === "") {
                  return null
                }

                // Format value if needed
                const displayValue = field.format ? field.format(value) : value

                return (
                  <div key={field.key} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {field.label}:
                    </span>
                    <span className="font-medium">{displayValue}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

type PropertyInfoCardProps = {
  property: FullProperty
}

export function PropertyInfoCard({ property }: PropertyInfoCardProps) {
  // Extract addressData for display
  const addressData = property.address?.addressData as
    | Record<string, any>
    | null
    | undefined

  // Pass the addressData directly to the formatAddressData function
  const formattedAddress = addressData ? formatAddressData(addressData) : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2">
              <Home className="size-4 text-muted-foreground" />
              <div>
                <Typography variant="muted">Property Type</Typography>
                <Typography>
                  {property.propertyType.charAt(0) +
                    property.propertyType.slice(1).toLowerCase()}
                </Typography>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Bed className="size-4 text-muted-foreground" />
              <div>
                <Typography variant="muted">Bedrooms</Typography>
                <Typography>{property.bedroomCount}</Typography>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Bath className="size-4 text-muted-foreground" />
              <div>
                <Typography variant="muted">Bathrooms</Typography>
                <Typography>{property.bathroomCount}</Typography>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SquareFootage className="size-4 text-muted-foreground" />
              <div>
                <Typography variant="muted">Total Area</Typography>
                <Typography>{property.totalAreaSqM.toFixed(2)} m²</Typography>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="size-4 text-muted-foreground" />
              <div>
                <Typography variant="muted">Condition</Typography>
                <Typography>
                  {property.condition.charAt(0) +
                    property.condition.slice(1).toLowerCase().replace("_", " ")}
                </Typography>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <Typography variant="muted">Listed On</Typography>
                <Typography>
                  {new Date(property.createdAt).toLocaleDateString()}
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Data Section */}
      {formattedAddress && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                <span>Detailed Address Information</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>{formattedAddress}</CardContent>
        </Card>
      )}
    </div>
  )
}

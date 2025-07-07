/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  no-nested-ternary */
/* eslint-disable  react/no-unescaped-entities */
/* eslint-disable  max-lines */
/* eslint-disable  react/jsx-max-depth */
/* eslint-disable  @typescript-eslint/no-unused-vars*/
"use client"

import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"
import { ClipboardIcon } from "lucide-react"

// Helper function to format values based on type
const formatValue = (key: string, value: any): React.ReactNode => {
  if (value === null || value === undefined) {
    return <span className="italic text-muted-foreground">None</span>
  }

  // Format date fields
  if (
    typeof value === "string" &&
    (key.includes("At") || key.includes("Date")) &&
    /^\d{4}-\d{2}-\d{2}T/.test(value)
  ) {
    try {
      const date = new Date(value)
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    } catch (e) {
      return value
    }
  }

  // Format boolean values
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        Yes
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        No
      </span>
    )
  }

  // Format currency fields
  if (
    typeof value === "number" &&
    (key.includes("Value") || key.includes("Amount") || key.includes("Price"))
  ) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format special fields like propertyType or condition
  if (typeof value === "string" && value.includes("_")) {
    return value.replace(/_/g, " ")
  }

  // Default formatting for simple values
  return String(value)
}

// Render checklist and considerations
const renderReviewSection = (review: any) => {
  return (
    <div className="space-y-6">
      {review.checklist && (
        <div className="rounded-lg border p-4">
          <Typography className="mb-4" variant="h4">
            Checklist
          </Typography>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(review.checklist).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className={`flex size-5 items-center justify-center rounded-full ${
                    value
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {value ? "✓" : "✗"}
                </div>
                <Typography>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}

      {review.considerations && (
        <div className="rounded-lg border p-4">
          <Typography className="mb-4" variant="h4">
            Considerations
          </Typography>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(review.considerations).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className={`flex size-5 items-center justify-center rounded-full ${
                    value
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {value ? "✓" : "✗"}
                </div>
                <Typography>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Recursive function to render nested objects
const renderNestedObject = (data: any, level = 0) => {
  if (data === null || data === undefined) {
    return <span className="italic text-muted-foreground">None</span>
  }

  if (typeof data !== "object") {
    return formatValue("", data)
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="italic text-muted-foreground">No items</span>
    }

    // Special case for reviewAndReccommendations
    if (data.length > 0 && data[0]?.checklist && data[0]?.considerations) {
      return (
        <div className="space-y-4">
          {data.map((review, index) => (
            <div key={index}>
              {index > 0 && (
                <Typography className="mb-2">Review {index + 1}</Typography>
              )}
              {renderReviewSection(review)}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="rounded-lg border p-4">
            <Typography className="mb-4" variant="h4">
              Item {index + 1}
            </Typography>
            {renderNestedObject(item, level + 1)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Object.entries(data).map(([key, value]) => {
        // Skip rendering internal IDs unless explicitly requested
        if (level > 0 && (key === "id" || key.endsWith("Id"))) {
          return null
        }

        // Skip rendering redundant dates at deeper levels
        if (level > 0 && (key === "createdAt" || key === "updatedAt")) {
          return null
        }

        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())

        return (
          <div key={key} className="rounded-lg border p-4">
            <Typography className="font-medium text-muted-foreground">
              {formattedKey}
              {key === "id" && (
                <Button
                  className="ml-2 h-6 p-0"
                  size="sm"
                  variant="ghost"
                  onClick={() => navigator.clipboard.writeText(String(value))}
                >
                  <ClipboardIcon className="size-3" />
                </Button>
              )}
            </Typography>
            {typeof value === "object" && value !== null ? (
              renderNestedObject(value, level + 1)
            ) : (
              <Typography variant="h4">{formatValue(key, value)}</Typography>
            )}
          </div>
        )
      })}
    </div>
  )
}

interface PropertyAttributesProps {
  data: any
}

export function PropertyAttributes({ data }: PropertyAttributesProps) {
  // Group the property attributes in sections
  const mainInfo = {
    id: data.id,
    propertyType: data.propertyType,
    bedroomCount: data.bedroomCount,
    bathroomCount: data.bathroomCount,
    totalAreaSqM: data.totalAreaSqM,
    condition: data.condition,
    estimatedValue: data.estimatedValue,
    confirmedValue: data.confirmedValue,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }

  return (
    <div className="space-y-8">
      {/* Property Basic Information */}
      <div className="space-y-4">
        <Typography variant="h3">Property Information</Typography>
        {renderNestedObject(mainInfo)}
      </div>

      {/* Address Information */}
      {data.address && (
        <div className="space-y-4">
          <Typography variant="h3">Address</Typography>
          {renderNestedObject(
            Object.fromEntries(
              Object.entries(data.address).filter(
                ([key]) => key !== "addressData"
              )
            )
          )}
        </div>
      )}

      {/* Seller Information */}
      {data.sellers && data.sellers.length > 0 && (
        <div className="space-y-4">
          <Typography variant="h3">Sellers</Typography>
          {renderNestedObject(data.sellers)}
        </div>
      )}

      {/* Review and Recommendations */}
      {data.reviewAndReccommendations &&
        data.reviewAndReccommendations.length > 0 && (
          <div className="space-y-4">
            <Typography variant="h3">Review and Recommendations</Typography>
            {renderNestedObject(data.reviewAndReccommendations)}
          </div>
        )}

      {/* Documents */}
      <div className="space-y-4">
        <Typography variant="h3">Documents</Typography>
        {data.documents && data.documents.length > 0 ? (
          renderNestedObject(data.documents)
        ) : (
          <Typography>No documents attached to this property.</Typography>
        )}
      </div>

      {/* Valuations */}
      <div className="space-y-4">
        <Typography variant="h3">Valuations</Typography>
        {data.valuations && data.valuations.length > 0 ? (
          renderNestedObject(data.valuations)
        ) : (
          <Typography>No valuations available for this property.</Typography>
        )}
      </div>

      {/* Offers */}
      <div className="space-y-4">
        <Typography variant="h3">Offers</Typography>
        {data.offers && data.offers.length > 0 ? (
          renderNestedObject(data.offers)
        ) : (
          <Typography>No offers available for this property.</Typography>
        )}
      </div>

      {/* Render any other fields that might be in the data but not handled above */}
      {Object.entries(data).map(([key, value]) => {
        // Skip fields we've already rendered
        const alreadyRendered = [
          "id",
          "propertyType",
          "bedroomCount",
          "bathroomCount",
          "totalAreaSqM",
          "condition",
          "estimatedValue",
          "confirmedValue",
          "createdAt",
          "updatedAt",
          "address",
          "sellers",
          "reviewAndReccommendations",
          "documents",
          "valuations",
          "offers",
        ]

        if (alreadyRendered.includes(key)) return null

        return (
          <div key={key} className="space-y-4">
            <Typography variant="h3">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </Typography>
            {renderNestedObject(value)}
          </div>
        )
      })}
    </div>
  )
}

// Add a new function to display address data
function formatAddressData(addressData: any) {
  if (!addressData) return "No detailed address data available"

  const sections = [
    {
      title: "Address Details",
      fields: [
        { key: "line_1", label: "Address Line 1" },
        { key: "line_2", label: "Address Line 2" },
        { key: "line_3", label: "Address Line 3" },
        { key: "post_town", label: "Town" },
        { key: "postcode", label: "Postcode" },
        { key: "thoroughfare", label: "Thoroughfare" },
        { key: "building_number", label: "Building Number" },
        { key: "building_name", label: "Building Name" },
      ],
    },
    {
      title: "Geographical Data",
      fields: [
        { key: "country", label: "Country" },
        { key: "county", label: "County" },
        { key: "traditional_county", label: "Traditional County" },
        { key: "district", label: "District" },
        { key: "ward", label: "Ward" },
        { key: "latitude", label: "Latitude" },
        { key: "longitude", label: "Longitude" },
      ],
    },
    {
      title: "Identifiers",
      fields: [
        { key: "uprn", label: "UPRN" },
        { key: "udprn", label: "UDPRN" },
        { key: "id", label: "ID" },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        // Only display sections that have at least one non-empty value
        const hasData = section.fields.some((field) => addressData[field.key])

        if (!hasData) return null

        return (
          <div
            key={section.title}
            className="border-t pt-4 first:border-t-0 first:pt-0"
          >
            <h4 className="mb-2 font-medium text-primary">{section.title}</h4>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {section.fields.map((field) => {
                if (!addressData[field.key]) return null

                return (
                  <div key={field.key} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {field.label}:
                    </span>
                    <span className="font-medium">
                      {addressData[field.key]}
                    </span>
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

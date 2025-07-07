/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react/jsx-max-depth */
/* eslint-disable no-nested-ternary */
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { notFound } from "next/navigation"

import type { SellerProperty } from "../_types"
import type { Metadata } from "next"

import { api } from "@/lib/trpc/server"

export const metadata: Metadata = {
  title: "Property Details",
  description: "View property details",
}

// Disable caching for this page
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PropertyDetailPage({
  params,
}: {
  params: { propertyId: string; lng: string }
}) {
  try {
    // Add the revalidate option to avoid caching
    const propertyData = await api.property.myProperties.getById({
      propertyId: params.propertyId,
    })

    if (!propertyData) {
      return notFound()
    }

    // Safely clone and convert data to avoid rendering objects
    const property = JSON.parse(JSON.stringify(propertyData))

    // Handle the specific address object that's causing issues
    let formattedAddress = "Address not available"
    let postcode = "Postcode not available"

    if (property.address && typeof property.address === "object") {
      // Extract needed fields from address to avoid rendering the object directly
      try {
        const addressObj = property.address
        const addressParts = []

        if (addressObj.streetLine1) addressParts.push(addressObj.streetLine1)
        if (addressObj.streetLine2) addressParts.push(addressObj.streetLine2)
        if (addressObj.city) addressParts.push(addressObj.city)
        if (addressObj.state) addressParts.push(addressObj.state)

        formattedAddress = addressParts.join(", ")
        postcode = addressObj.postalCode || "Postcode not available"

        // Remove the address object to prevent it from being rendered
        delete property.address
        // Add the formatted address as a string
        property.formattedAddress = formattedAddress
        property.postcode = postcode
      } catch (e) {
        console.error("Error formatting address:", e)
      }
    }

    // Format price to locale string
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(price)
    }

    // Ensure all rendered values are strings
    const renderData = {
      title:
        typeof property.title === "string"
          ? property.title
          : "Property Details",
      address:
        typeof property.formattedAddress === "string"
          ? property.formattedAddress
          : formattedAddress,
      postcode:
        typeof property.postcode === "string" ? property.postcode : postcode,
      price: property.price
        ? formatPrice(property.price)
        : property.estimatedValue
          ? formatPrice(property.estimatedValue)
          : "Price not available",
      bedrooms:
        typeof property.bedroomCount === "number"
          ? property.bedroomCount.toString()
          : "Not available",
      bathrooms:
        typeof property.bathroomCount === "number"
          ? property.bathroomCount.toString()
          : "Not available",
      propertyType:
        typeof property.propertyType === "string"
          ? property.propertyType
          : "Not available",
      area:
        typeof property.totalAreaSqM === "number"
          ? `${property.totalAreaSqM} m²`
          : "Not available",
      condition:
        typeof property.condition === "string"
          ? property.condition
          : "Not available",
    }

    const sellerProperties = Array.isArray(property.sellerProperties)
      ? property.sellerProperties
      : []

    return (
      <div className="container px-0">
        <Card>
          <CardHeader>
            <CardTitle>{renderData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">Property Information</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span>{renderData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Postcode:</span>
                    <span>{renderData.postcode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span>{renderData.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bedrooms:</span>
                    <span>{renderData.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bathrooms:</span>
                    <span>{renderData.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Property Type:
                    </span>
                    <span>{renderData.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <span>{renderData.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition:</span>
                    <span>{renderData.condition}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Seller Information</h3>
                <div className="mt-4 space-y-4">
                  {sellerProperties.map((sp: SellerProperty, index: number) => {
                    // Ensure seller properties are strings
                    const firstName = sp?.seller?.firstName || ""
                    const lastName = sp?.seller?.lastName || ""
                    const ownershipPercentage =
                      typeof sp?.ownershipPercentage === "number"
                        ? sp.ownershipPercentage.toString()
                        : "0"

                    return (
                      <div
                        key={sp.id || `seller-${index}`}
                        className="rounded-md border p-3"
                      >
                        <p className="font-medium">
                          {firstName} {lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ownership: {ownershipPercentage}%
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error loading property:", error)
    return notFound()
  }
}

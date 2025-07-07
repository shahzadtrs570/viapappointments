/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@package/db"
import { RateLimiter } from "limiter"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

// Rate limiter: 4 requests per 10 seconds
const limiter = new RateLimiter({
  tokensPerInterval: 4,
  interval: 10000, // 10 seconds
})

// TODO: MOVE TO ENV VARIABLES

const API_KEY = "LSDHBFDJA1"
const BASE_URL = "https://api.propertydata.co.uk"

// Define a type for the address data
type AddressData = {
  postcode?: string
  uprn?: string
  [key: string]: any
}

// Function to get property address data from database
async function getPropertyAddressData(
  propertyId: string | null
): Promise<AddressData | null> {
  if (!propertyId) return null

  try {
    const property = await db.property.findUnique({
      where: { id: propertyId },
      include: { address: true },
    })

    // Check if we have stored address data from the lookup service
    if (property?.address?.addressData) {
      // Use the stored address data
      return property.address.addressData as AddressData
    }

    return null
  } catch (error) {
    console.error("Error fetching property address data:", error)
    return null
  }
}

// List of all available endpoints
const ENDPOINTS = [
  "prices",
  "uprn",
  "valuation-historical",
  "land-registry-documents",
  "freeholds",
  "property-info",
  "valuation-sale",
  "flood-risk",
  "floor-areas",
  "growth",
  "planning",
  "site-plan-documents",
  "aonb",
  "area-type",
  "demand",
  "green-belt",
]

export async function GET(request: NextRequest) {
  // Get the endpoint and parameters from the query
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get("endpoint")
  const propertyId = searchParams.get("propertyId")

  // Validate endpoint
  if (!endpoint || !ENDPOINTS.includes(endpoint)) {
    return NextResponse.json(
      { error: "Invalid or missing endpoint" },
      { status: 400 }
    )
  }

  // Try to take a token from the rate limiter
  const remainingRequests = await limiter.removeTokens(1)

  // If no tokens left, return rate limit error
  if (remainingRequests < 0) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    )
  }

  try {
    // Get property address data from database if property ID is provided
    const propertyAddressData: AddressData | null =
      await getPropertyAddressData(propertyId)

    // Build URL with all query parameters
    let apiUrl = `${BASE_URL}/${endpoint}?key=${API_KEY}`

    // Add all other query parameters except 'endpoint' and 'propertyId'
    searchParams.forEach((value, key) => {
      if (key !== "endpoint" && key !== "propertyId") {
        // If this is a postcode parameter and we have property address data with a postcode, use that instead
        if (
          key === "postcode" &&
          propertyAddressData &&
          propertyAddressData.postcode
        ) {
          apiUrl += `&${key}=${encodeURIComponent(propertyAddressData.postcode)}`
        }
        // If this is a UPRN parameter and we have property address data with a UPRN, use that instead
        else if (
          key === "uprn" &&
          propertyAddressData &&
          propertyAddressData.uprn
        ) {
          apiUrl += `&${key}=${encodeURIComponent(propertyAddressData.uprn)}`
        } else {
          apiUrl += `&${key}=${encodeURIComponent(value)}`
        }
      }
    })

    // If this is the address-to-uprn endpoint and we have property address data, return that instead
    if (endpoint === "address-to-uprn" && propertyAddressData) {
      return NextResponse.json(propertyAddressData)
    }

    // Make the request to PropertyData API
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      // Return a detailed error with status code
      return NextResponse.json({
        status: "error",
        message: `PropertyData API returned error: ${response.status} ${response.statusText}`,
        endpoint,
        statusCode: response.status,
        statusText: response.statusText,
      })
    }

    // Get complete response as JSON
    const data = await response.json()

    // Return the complete response exactly as received from PropertyData
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching property data:", error)
    return NextResponse.json(
      {
        status: "error",
        message: `Error fetching data from ${endpoint}: ${error instanceof Error ? error.message : "Unknown error"}`,
        endpoint,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint, params } = body

    // Validate endpoint
    if (!endpoint || !ENDPOINTS.includes(endpoint)) {
      return NextResponse.json(
        { error: "Invalid or missing endpoint" },
        { status: 400 }
      )
    }

    // Try to take a token from the rate limiter
    const remainingRequests = await limiter.removeTokens(1)

    // If no tokens left, return rate limit error
    if (remainingRequests < 0) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      )
    }

    // Build URL with all parameters
    let apiUrl = `${BASE_URL}/${endpoint}?key=${API_KEY}`

    // Add all parameters from the request body
    if (params && typeof params === "object") {
      Object.entries(params).forEach(([key, value]) => {
        apiUrl += `&${key}=${encodeURIComponent(String(value))}`
      })
    }

    // Make the request to PropertyData API
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      // Return a detailed error with status code
      return NextResponse.json({
        status: "error",
        message: `PropertyData API returned error: ${response.status} ${response.statusText}`,
        endpoint,
        statusCode: response.status,
        statusText: response.statusText,
      })
    }

    // Get complete response as JSON
    const data = await response.json()

    // Return the complete response exactly as received from PropertyData
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      {
        status: "error",
        message: `Error processing request: ${error instanceof Error ? error.message : "Unknown error"}`,
        endpoint: "unknown",
      },
      { status: 500 }
    )
  }
}

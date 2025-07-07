import { getLogger } from "@package/logger"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

const logger = getLogger()
const API_KEY = process.env.PROPERTY_DATA_API_KEY || ""
const API_BASE_URL = "https://api.propertydata.co.uk"

// Rate limiting - 4 requests per 10 seconds
const REQUEST_LIMIT = 4
const TIME_WINDOW = 10000 // 10 seconds in milliseconds
const requestTimestamps: number[] = []

function checkRateLimit(): boolean {
  const now = Date.now()

  // Remove timestamps older than the time window
  while (
    requestTimestamps.length > 0 &&
    requestTimestamps[0] < now - TIME_WINDOW
  ) {
    requestTimestamps.shift()
  }

  // Check if we're under the limit
  if (requestTimestamps.length < REQUEST_LIMIT) {
    requestTimestamps.push(now)
    return true
  }

  return false
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const endpoint = searchParams.get("endpoint")

    // Remove the endpoint parameter and keep the rest for the API call
    searchParams.delete("endpoint")

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing required 'endpoint' parameter" },
        { status: 400 }
      )
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      )
    }

    // Check rate limit
    if (!checkRateLimit()) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      )
    }

    // Add API key to params
    searchParams.set("key", API_KEY)

    // Construct the API URL
    const apiUrl = `${API_BASE_URL}/${endpoint}?${searchParams.toString()}`

    // Call the PropertyData API
    const response = await fetch(apiUrl)
    const data = await response.json()

    // Add metadata about the request
    const result = {
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        endpoint,
        status: response.status,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"

    await logger.error("Error fetching property data", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      { error: "Failed to fetch property data", details: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint, params } = body

    if (!endpoint || !params) {
      return NextResponse.json(
        { error: "Missing required parameters: 'endpoint' and 'params'" },
        { status: 400 }
      )
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      )
    }

    // Check rate limit
    if (!checkRateLimit()) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      )
    }

    // Add API key to params
    const queryParams = new URLSearchParams({ ...params, key: API_KEY })

    // Construct the API URL
    const apiUrl = `${API_BASE_URL}/${endpoint}?${queryParams.toString()}`

    // Call the PropertyData API
    const response = await fetch(apiUrl)
    const data = await response.json()

    // Add metadata about the request
    const result = {
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        endpoint,
        status: response.status,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"

    await logger.error("Error fetching property data", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      { error: "Failed to fetch property data", details: errorMessage },
      { status: 500 }
    )
  }
}

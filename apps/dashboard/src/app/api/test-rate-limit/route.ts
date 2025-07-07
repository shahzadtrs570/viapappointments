import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

import {
  addRateLimitHeaders,
  getUserIdentifier,
  withRateLimit,
} from "@/lib/rate-limit"

// Test API endpoint using central rate limiting configuration only
export async function GET(request: NextRequest) {
  // Use central rate limiting configuration (no hardcoded limits)
  const rateLimitResult = await withRateLimit(request)

  if (!rateLimitResult.success && rateLimitResult.response) {
    console.log("🔴 Test endpoint: Rate limit exceeded")
    return rateLimitResult.response
  }

  console.log(
    "✅ Test endpoint: Request allowed",
    rateLimitResult.rateLimitInfo
  )

  // Create success response
  const response = NextResponse.json({
    message: "Rate limiting is working!",
    timestamp: new Date().toISOString(),
    endpoint: "/api/test-rate-limit",
    method: "GET",
    rateLimitInfo: {
      limit: rateLimitResult.rateLimitInfo?.limit,
      remaining: rateLimitResult.rateLimitInfo?.remaining,
      reset: rateLimitResult.rateLimitInfo?.reset,
    },
    identifier: getUserIdentifier(request),
    ip:
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "::1",
    note: "Rate limits controlled centrally from rate-limit.ts",
  })

  // Add rate limit headers to response
  if (rateLimitResult.rateLimitInfo) {
    return addRateLimitHeaders(response, rateLimitResult.rateLimitInfo)
  }

  return response
}

// Handle POST requests using central rate limiting only
export async function POST(request: NextRequest) {
  // Use central rate limiting configuration (no hardcoded limits)
  const rateLimitResult = await withRateLimit(request)

  if (!rateLimitResult.success && rateLimitResult.response) {
    console.log("🔴 Test POST endpoint: Rate limit exceeded")
    return rateLimitResult.response
  }

  let body
  try {
    body = await request.json()
  } catch (error) {
    body = null
  }

  const response = NextResponse.json({
    message: "POST rate limiting test!",
    timestamp: new Date().toISOString(),
    endpoint: "/api/test-rate-limit",
    method: "POST",
    receivedData: body,
    rateLimitInfo: {
      limit: rateLimitResult.rateLimitInfo?.limit,
      remaining: rateLimitResult.rateLimitInfo?.remaining,
      reset: rateLimitResult.rateLimitInfo?.reset,
    },
    note: "Rate limits controlled centrally from rate-limit.ts",
  })

  // Add rate limit headers to response
  if (rateLimitResult.rateLimitInfo) {
    return addRateLimitHeaders(response, rateLimitResult.rateLimitInfo)
  }

  return response
}

// Handle PUT requests using central rate limiting only
export async function PUT(request: NextRequest) {
  // Use central rate limiting configuration (no hardcoded limits)
  const rateLimitResult = await withRateLimit(request)

  if (!rateLimitResult.success && rateLimitResult.response) {
    console.log("🔴 Test PUT endpoint: Rate limit exceeded")
    return rateLimitResult.response
  }

  const response = NextResponse.json(
    {
      message: "PUT to test endpoint is not supported",
      timestamp: new Date().toISOString(),
      endpoint: "/api/test-rate-limit",
      method: "PUT",
      rateLimitInfo: {
        limit: rateLimitResult.rateLimitInfo?.limit,
        remaining: rateLimitResult.rateLimitInfo?.remaining,
        reset: rateLimitResult.rateLimitInfo?.reset,
      },
      note: "Rate limits controlled centrally from rate-limit.ts",
    },
    { status: 405 }
  )

  // Add rate limit headers to response
  if (rateLimitResult.rateLimitInfo) {
    return addRateLimitHeaders(response, rateLimitResult.rateLimitInfo)
  }

  return response
}

// Handle DELETE requests using central rate limiting only
export async function DELETE(request: NextRequest) {
  // Use central rate limiting configuration (no hardcoded limits)
  const rateLimitResult = await withRateLimit(request)

  if (!rateLimitResult.success && rateLimitResult.response) {
    console.log("🔴 Test DELETE endpoint: Rate limit exceeded")
    return rateLimitResult.response
  }

  const response = NextResponse.json(
    {
      message: "DELETE to test endpoint is not supported",
      timestamp: new Date().toISOString(),
      endpoint: "/api/test-rate-limit",
      method: "DELETE",
      rateLimitInfo: {
        limit: rateLimitResult.rateLimitInfo?.limit,
        remaining: rateLimitResult.rateLimitInfo?.remaining,
        reset: rateLimitResult.rateLimitInfo?.reset,
      },
      note: "Rate limits controlled centrally from rate-limit.ts",
    },
    { status: 405 }
  )

  // Add rate limit headers to response
  if (rateLimitResult.rateLimitInfo) {
    return addRateLimitHeaders(response, rateLimitResult.rateLimitInfo)
  }

  return response
}

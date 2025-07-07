/* eslint-disable  */

import { NextRequest, NextResponse } from "next/server"
import { withRateLimit, createCustomRateLimit } from "./rate-limit"

// Check if rate limiting is enabled via environment variable
const isRateLimitingEnabled =
  process.env.NEXT_PUBLIC_ENABLE_RATE_LIMITING === "true"

// Higher-order function to wrap API handlers with rate limiting
export function withApiRateLimit<T extends any[], R>(
  handler: (request: NextRequest, ...args: T) => Promise<R> | R,
  options: {
    requests?: number
    window?: string
    type?: "api" | "auth" | "public" | "upload" | "write" | "critical"
    skipPaths?: string[]
    prefix?: string
  } = {}
) {
  return async (
    request: NextRequest,
    ...args: T
  ): Promise<R | NextResponse> => {
    // If rate limiting is disabled, skip rate limiting and call handler directly
    if (!isRateLimitingEnabled) {
      console.log("🟡 API Rate limiting disabled via environment variable")
      return handler(request, ...args)
    }

    const { pathname } = request.nextUrl

    // Skip rate limiting for specific paths if configured
    if (options.skipPaths?.some((path) => pathname.includes(path))) {
      return handler(request, ...args)
    }

    // Handle exact /api route case
    if (pathname === "/api" && !options.requests && !options.window) {
      // Use default API root rate limit for /api route
      options.requests = 50
      options.window = "1 m"
      options.prefix = "api-root"
    }

    let rateLimitResult

    // Use custom rate limit if specified
    if (options.requests && options.window) {
      const customRateLimit = createCustomRateLimit(
        options.requests,
        options.window
      )

      rateLimitResult = await withRateLimit(request, {
        customRateLimit,
      })
    } else {
      // Use predefined type
      rateLimitResult = await withRateLimit(request, {
        type: options.type || "api",
      })
    }

    if (!rateLimitResult.success && rateLimitResult.response) {
      return rateLimitResult.response as R
    }

    // Continue with the original handler
    return handler(request, ...args)
  }
}

// Specific rate limit decorators for common patterns
export const withAuthRateLimit = <T extends any[], R>(
  handler: (request: NextRequest, ...args: T) => Promise<R> | R
) => withApiRateLimit(handler, { type: "auth" })

export const withPublicRateLimit = <T extends any[], R>(
  handler: (request: NextRequest, ...args: T) => Promise<R> | R
) => withApiRateLimit(handler, { type: "public" })

export const withUploadRateLimit = <T extends any[], R>(
  handler: (request: NextRequest, ...args: T) => Promise<R> | R
) => withApiRateLimit(handler, { type: "upload" })

export const withWriteRateLimit = <T extends any[], R>(
  handler: (request: NextRequest, ...args: T) => Promise<R> | R
) => withApiRateLimit(handler, { type: "write" })

export const withCriticalRateLimit = <T extends any[], R>(
  handler: (request: NextRequest, ...args: T) => Promise<R> | R
) => withApiRateLimit(handler, { type: "critical" })

// Custom rate limit for specific endpoints
export const withCustomRateLimit = <T extends any[], R>(
  handler: (request: NextRequest, ...args: T) => Promise<R> | R,
  requests: number,
  window: string,
  prefix?: string
) => withApiRateLimit(handler, { requests, window, prefix })

// Rate limit info middleware - adds rate limit headers to responses
export function addRateLimitHeaders(
  response: NextResponse,
  rateLimitInfo: {
    limit: number
    remaining: number
    reset: number
  }
): NextResponse {
  response.headers.set("X-RateLimit-Limit", rateLimitInfo.limit.toString())
  response.headers.set(
    "X-RateLimit-Remaining",
    rateLimitInfo.remaining.toString()
  )
  response.headers.set("X-RateLimit-Reset", rateLimitInfo.reset.toString())

  return response
}

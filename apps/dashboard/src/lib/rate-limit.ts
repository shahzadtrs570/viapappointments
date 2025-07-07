/* eslint-disable  */

import { RateLimiter } from "limiter"
import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Check if rate limiting is enabled via environment variable
const isRateLimitingEnabled =
  process.env.NEXT_PUBLIC_ENABLE_RATE_LIMITING === "true"

// Type definitions for rate limiting
interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// Store for rate limiters using the library
const rateLimiterStore = new Map<string, RateLimiter>()

// Create custom rate limiter configuration
export function createCustomRateLimit(
  requests: number,
  window: string
): { max: number; duration: number } {
  // Convert window string to milliseconds
  const windowMs = window.includes("m")
    ? parseInt(window) * 60 * 1000
    : parseInt(window) * 1000

  return {
    max: requests,
    duration: windowMs,
  }
}

// SINGLE RATE LIMIT CONFIGURATION - Control everything here
export const RATE_LIMIT_CONFIG = {
  // Specific endpoints (highest priority)
  endpoints: {
    "/api/auth/signin": createCustomRateLimit(10, "5m"),
    "/api/auth/callback": createCustomRateLimit(10, "5m"), // Email callbacks
    "/api/auth/providers": createCustomRateLimit(10, "5m"), // Provider info
    "/api/auth/signup": createCustomRateLimit(10, "5m"),
    "/api/auth/warmWelcome": createCustomRateLimit(5, "1m"),
    // '/api/auth/reset-password': createCustomRateLimit(3, '15m'),
    // '/api/auth/verify-email': createCustomRateLimit(10, '5m'),
    // '/api/security': createCustomRateLimit(10, '5m'),
    "/api/propertyData": createCustomRateLimit(20, "1m"),
    "/api/webhooks": createCustomRateLimit(30, "1m"),
    // '/api/test-rate-limit': createCustomRateLimit(2, '1m'),
    "/api/trpc": createCustomRateLimit(50, "1m"), // tRPC endpoints - 10 req/min
  },

  // General types (optional - you can comment out or remove any type)
  types: {
    // api: createCustomRateLimit(2, '1m'),      // 2 req/min for general API (API routes)
    // auth: createCustomRateLimit(10, '1m'),    // 10 req/min for auth (Session)
    public: createCustomRateLimit(30, "1m"), // 30 req/min for public (Public routes)
    upload: createCustomRateLimit(5, "1m"), // 5 req/min for uploads (Upload routes)
    // write: createCustomRateLimit(50, "1m"), // 50 req/min for writes (Write routes)
    // critical: createCustomRateLimit(3, "5m"), // 3 req/5min for critical (Critical routes)
  },
}

// Default fallback rate limit (used when no config is found)
const DEFAULT_RATE_LIMIT = createCustomRateLimit(1000, "1m") // 1000 req/min default

// Get rate limit configuration (endpoints take priority over types)
export function getRateLimitConfig(
  pathname: string,
  type?: string // Made generic string so it works even if types are removed
): { max: number; duration: number } {
  // 1. Check for exact endpoint match first (highest priority)
  if (
    RATE_LIMIT_CONFIG.endpoints[
      pathname as keyof typeof RATE_LIMIT_CONFIG.endpoints
    ]
  ) {
    return RATE_LIMIT_CONFIG.endpoints[
      pathname as keyof typeof RATE_LIMIT_CONFIG.endpoints
    ]
  }

  // 2. Check for prefix matches in endpoints
  for (const [endpoint, config] of Object.entries(
    RATE_LIMIT_CONFIG.endpoints
  )) {
    if (pathname.startsWith(endpoint)) {
      return config
    }
  }

  // 3. Fall back to type-based config (if type exists)
  if (
    type &&
    RATE_LIMIT_CONFIG.types &&
    RATE_LIMIT_CONFIG.types[type as keyof typeof RATE_LIMIT_CONFIG.types]
  ) {
    return RATE_LIMIT_CONFIG.types[type as keyof typeof RATE_LIMIT_CONFIG.types]
  }

  // 4. Try 'api' type as fallback (if it exists)
  // if (RATE_LIMIT_CONFIG.types && RATE_LIMIT_CONFIG.types.api) {
  //   return RATE_LIMIT_CONFIG.types.api;
  // }

  // 5. Final fallback to default (works even if all types are commented out)
  console.log("⚠️ Using default rate limit for:", pathname, "type:", type)
  return DEFAULT_RATE_LIMIT
}

// Use limiter library properly
function checkRateLimitWithLibrary(
  identifier: string,
  config: { max: number; duration: number }
): Promise<RateLimitResult> {
  return new Promise((resolve) => {
    const key = `${identifier}:${config.max}:${config.duration}`

    // Get or create rate limiter for this specific key
    let limiter = rateLimiterStore.get(key)
    if (!limiter) {
      // limiter uses tokens per interval
      limiter = new RateLimiter({
        tokensPerInterval: config.max,
        interval: config.duration,
      })
      rateLimiterStore.set(key, limiter)
    }

    // Try to remove a token
    const tryResult = limiter.tryRemoveTokens(1)

    if (tryResult) {
      // Success - token was removed
      resolve({
        success: true,
        limit: config.max,
        remaining: limiter.getTokensRemaining(),
        reset: Date.now() + config.duration,
      })
    } else {
      // Rate limited
      resolve({
        success: false,
        limit: config.max,
        remaining: 0,
        reset: Date.now() + config.duration,
      })
    }
  })
}

// Get client IP address
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const clientIP = request.headers.get("x-client-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (clientIP) {
    return clientIP
  }

  // Fallback to a default IP for development
  return "127.0.0.1"
}

// Get user identifier (IP + user ID if authenticated)
export function getUserIdentifier(
  request: NextRequest,
  userId?: string
): string {
  const ip = getClientIP(request)
  return userId ? `${ip}:${userId}` : ip
}

// Enhanced rate limit response with better error messages
export function createRateLimitResponse(
  result: RateLimitResult,
  pathname: string,
  type?: string
): Response {
  const resetTime = new Date(result.reset).toISOString()
  const retryAfter = Math.round((result.reset - Date.now()) / 1000)

  // Better user-facing error messages
  let userMessage =
    "You are making requests too quickly. Please wait a moment and try again."

  if (type === "auth" || pathname.includes("/auth/")) {
    userMessage =
      "Too many authentication attempts. Please wait before trying again for security reasons."
  } else if (type === "critical" || pathname.includes("/security/")) {
    userMessage =
      "Too many security-related requests detected. Please wait before trying again."
  } else if (pathname.includes("/trpc/")) {
    userMessage =
      "You are making too many API requests. Please slow down and try again."
  }

  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded",
      message: userMessage,
      retryAfter,
      resetTime,
      limit: result.limit,
      remaining: result.remaining,
      type: type || "api",
      pathname,
      userFriendly: true, // Flag to indicate this is a user-friendly message
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.reset.toString(),
      },
    }
  )
}

// Check rate limit using the library
export async function checkRateLimit(
  identifier: string,
  pathname: string,
  type?: string // Made generic string so it works even if types are removed
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
  pending: Promise<unknown>
}> {
  // If rate limiting is disabled, always allow the request
  if (!isRateLimitingEnabled) {
    console.log("🟡 Rate limiting disabled via environment variable")
    const config = getRateLimitConfig(pathname, type)
    return {
      success: true,
      limit: config.max,
      remaining: config.max,
      reset: Date.now() + config.duration,
      pending: Promise.resolve(),
    }
  }

  try {
    const config = getRateLimitConfig(pathname, type)
    const result = await checkRateLimitWithLibrary(identifier, config)

    console.log("🔵 Rate limit applied:", {
      pathname,
      type,
      config,
      result: result.success ? "ALLOWED" : "BLOCKED",
    })

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      pending: Promise.resolve(),
    }
  } catch (error) {
    console.error("Rate limit check failed:", error)
    // Allow request if rate limiter fails (fail-open)
    const config = getRateLimitConfig(pathname, type)
    return {
      success: true,
      limit: config.max,
      remaining: config.max,
      reset: Date.now() + config.duration,
      pending: Promise.resolve(),
    }
  }
}

// Rate limit middleware for API routes
export async function withRateLimit(
  request: NextRequest,
  options: {
    type?: string // Made generic string so it works even if types are removed
    identifier?: string
    customRateLimit?: { max: number; duration: number }
  } = {}
): Promise<{ success: boolean; response?: Response; rateLimitInfo?: any }> {
  // If rate limiting is disabled, always allow the request
  if (!isRateLimitingEnabled) {
    console.log("🟡 Rate limiting disabled via environment variable")
    return { success: true }
  }

  const { type, identifier, customRateLimit } = options
  const pathname = request.nextUrl.pathname

  // Get identifier (IP + user if available)
  const rateLimitIdentifier = identifier || getUserIdentifier(request)

  let result

  if (customRateLimit) {
    try {
      result = await checkRateLimitWithLibrary(
        rateLimitIdentifier,
        customRateLimit
      )
    } catch (error) {
      console.error("Custom rate limit check failed:", error)
      return { success: true }
    }
  } else {
    result = await checkRateLimit(rateLimitIdentifier, pathname, type)
  }

  if (!result.success) {
    const response = createRateLimitResponse(result, pathname, type)
    return { success: false, response, rateLimitInfo: result }
  }

  return { success: true, rateLimitInfo: result }
}

// Legacy function for backward compatibility (deprecated)
export function getRateLimiterForEndpoint(
  pathname: string
): { max: number; duration: number } | null {
  return getRateLimitConfig(pathname)
}

// Utility to add rate limit headers to any response
export function addRateLimitHeaders(
  response: Response,
  rateLimitInfo: {
    limit: number
    remaining: number
    reset: number
  }
): Response {
  const newHeaders = new Headers(response.headers)
  newHeaders.set("X-RateLimit-Limit", rateLimitInfo.limit.toString())
  newHeaders.set("X-RateLimit-Remaining", rateLimitInfo.remaining.toString())
  newHeaders.set("X-RateLimit-Reset", rateLimitInfo.reset.toString())

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}

// Route-level rate limiting wrapper (for direct use in API routes)
export function withCustomRateLimit(
  handler: (request: NextRequest) => Promise<Response>,
  requests: number,
  window: string,
  prefix: string = "custom"
) {
  return async (request: NextRequest): Promise<Response> => {
    // If rate limiting is disabled, skip rate limiting and call handler directly
    if (!isRateLimitingEnabled) {
      console.log("🟡 Rate limiting disabled via environment variable")
      return handler(request)
    }

    // Create custom config
    const customConfig = createCustomRateLimit(requests, window)

    // Get user info from NextAuth session
    let userId: string | undefined

    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })
      userId = token?.id as string
    } catch (error) {
      // If NextAuth token extraction fails, try other methods
      const userIdFromHeader = request.headers.get("x-user-id")
      if (userIdFromHeader) {
        userId = userIdFromHeader
      }
    }

    const identifier = `${prefix}:${getUserIdentifier(request, userId)}`

    console.log("🔴 Rate Limit Debug:", {
      identifier,
      customConfig,
      requests,
      window,
      prefix,
      userId: userId || "anonymous",
      ip: getClientIP(request),
    })

    // Apply rate limiting using the library
    const result = await checkRateLimitWithLibrary(identifier, customConfig)

    console.log("🔴 Rate Limit Result:", result)

    if (!result.success) {
      return createRateLimitResponse(result, request.nextUrl.pathname, "custom")
    }

    // Call the original handler
    const response = await handler(request)

    // Add rate limit headers
    return addRateLimitHeaders(response, result)
  }
}

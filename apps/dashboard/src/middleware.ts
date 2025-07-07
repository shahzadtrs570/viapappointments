/* eslint-disable */
import { featureFlags } from "@package/utils"
import acceptLanguage from "accept-language"
import { NextResponse } from "next/server"
import { type NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

import { cookieName, fallbackLng, languages } from "@/lib/i18n/settings"
import { withRateLimit, getRateLimitConfig } from "@/lib/rate-limit"

import type { NextRequest } from "next/server"

// Check if rate limiting is enabled via environment variable
const isRateLimitingEnabled =
  process.env.NEXT_PUBLIC_ENABLE_RATE_LIMITING === "true"

// Configure supported languages for the accept-language library
acceptLanguage.languages([...languages])

// Create a function to handle markdown conversion
async function handleMarkdownRequest(request: Request) {
  const url = new URL(request.url)
  const mdPath = url.pathname

  try {
    // Fetch the content through our API route instead of direct file access
    const response = await fetch(`${url.origin}/api/markdown${mdPath}`)

    if (!response.ok) {
      throw new Error("Markdown file not found")
    }

    const content = await response.text()

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (error) {
    console.error("Error serving markdown file:", error)
    return NextResponse.json(
      { error: "Markdown file not found" },
      { status: 404 }
    )
  }
}

// Define the config here, applying to the combined middleware
export const config = {
  /*
   * Match all request paths INCLUDING API routes for rate limiting
   * Include:
   * - All API routes: /api/*
   * - Language-prefixed API routes: /en/api/*, /fr/api/*, /it/api/*
   * - All page routes for auth/i18n
   * - Specifically include NextAuth routes: /api/auth/*
   * Exclude only:
   * - Static assets and Next.js internal files
   */
  matcher: [
    // Include API routes (direct and language-prefixed) + all other routes, exclude only static assets
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|woff|woff2|ico)$).*)",
  ],
}

// For NextAuth routes, apply rate limiting directly
async function handleNextAuthRoute(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log("🔵 Middleware: Processing NextAuth route:", pathname)

  // If rate limiting is disabled, skip rate limiting
  if (!isRateLimitingEnabled) {
    console.log(
      "🟡 Middleware: Rate limiting disabled via environment variable"
    )
    return NextResponse.next()
  }

  // Get token for rate limiting
  let token: any = null
  try {
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
  } catch (error) {
    // Continue without token
  }

  // Apply rate limiting to NextAuth routes
  const rateLimitResult = await withRateLimit(request, {
    type: "auth",
    identifier: token?.id ? `${token.id}` : undefined,
  })

  if (rateLimitResult.success === false && rateLimitResult.response) {
    console.log("🔴 Middleware: NextAuth rate limit exceeded, returning 429")
    return rateLimitResult.response
  }

  console.log("✅ Middleware: NextAuth rate limit check passed")
  return NextResponse.next()
}

// Combined middleware function that handles rate limiting and auth
async function combinedMiddleware(request: NextRequestWithAuth) {
  const { pathname, search, origin } = request.nextUrl
  console.log("🔵 Middleware: Processing request for path:", pathname)

  const token = request.nextauth.token // Get token from augmented request

  // Apply rate limiting to API routes (direct /api/ or language-prefixed /lng/api/)
  const isApiRoute =
    pathname.startsWith("/api/") ||
    pathname === "/api" ||
    pathname.match(/^\/[a-z]{2}\/api(?:\/|$)/)

  if (isApiRoute) {
    console.log("🔵 Middleware: Processing API route:", pathname)

    // If rate limiting is disabled, skip rate limiting for API routes
    if (!isRateLimitingEnabled) {
      console.log(
        "🟡 Middleware: Rate limiting disabled via environment variable"
      )
      return NextResponse.next()
    }

    // Special handling for NextAuth routes
    if (pathname.startsWith("/api/auth/")) {
      console.log("🔵 Middleware: NextAuth route detected:", pathname)
    }

    // Extract API path for rate limiting (strip language prefix if present)
    const apiPath = pathname.replace(/^\/[a-z]{2}(?=\/api)/, "") || pathname

    // Get rate limit config (endpoints take priority over types)
    const rateLimitConfig = getRateLimitConfig(apiPath)

    console.log(
      "🔵 Middleware: Original path:",
      pathname,
      "→ API path for rate limiting:",
      apiPath
    )

    // Determine rate limit type based on the API path (without language prefix)
    let rateLimitType:
      | "api"
      | "auth"
      | "public"
      | "upload"
      | "write"
      | "critical" = "api"

    if (apiPath.startsWith("/api/auth/")) {
      rateLimitType = "auth"
    } else if (apiPath.startsWith("/api/public/")) {
      rateLimitType = "public"
    } else if (apiPath.includes("/upload")) {
      rateLimitType = "upload"
    } else if (apiPath.match(/\/(create|update|delete)/)) {
      rateLimitType = "write"
    } else if (apiPath.startsWith("/api/security/")) {
      rateLimitType = "critical"
    } else if (apiPath === "/api") {
      // Exact /api route - use general API limits
      rateLimitType = "api"
    } else {
      // Default to API if no specific type matches
      rateLimitType = "api"
    }

    console.log("🔵 Middleware: Applying rate limit:", {
      pathname,
      rateLimitType,
      rateLimitConfig,
      hasToken: !!token,
      userId: token?.id,
    })

    // Apply rate limiting (no need to pass custom config since it's handled internally)
    const rateLimitResult = await withRateLimit(request, {
      type: rateLimitType,
      // Include user ID in identifier if authenticated
      identifier: token?.id ? `${token.id}` : undefined,
    })

    console.log("🔵 Middleware: Rate limit result:", rateLimitResult)

    // Only return rate limit response when limit is actually exceeded
    if (rateLimitResult.success === false && rateLimitResult.response) {
      console.log("🔴 Middleware: Rate limit exceeded, returning 429")
      return rateLimitResult.response
    }

    console.log(
      "✅ Middleware: Rate limit check passed, allowing API request to proceed"
    )
    // For API routes, we only do rate limiting - let the request proceed normally
    return NextResponse.next()
  }

  // Define public/auth paths that don't require authentication
  const publicAuthPaths = [
    "/signin",
    "/signup",
    "/auth/error",
    "/banned",
    "/warm-welcome",
    "/verified",
  ]

  // Check if the current path (without language prefix) is a public auth path
  const isOnPublicAuthPath = publicAuthPaths.some((p) => {
    // Remove any language prefix from the pathname for comparison
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "")
    return pathWithoutLang.startsWith(p)
  })
  const isOnOnboardingRelatedPath = pathname
    .replace(/^\/[a-z]{2}(?=\/|$)/, "")
    .startsWith("/onboarding")

  // If no token (unauthenticated) and not on a public/auth/onboarding path, redirect to signin
  if (!token && !isOnPublicAuthPath && !isOnOnboardingRelatedPath) {
    // Get the language from cookie or header for the redirect
    let lng: string | undefined | null
    if (request.cookies.has(cookieName)) {
      lng = acceptLanguage.get(request.cookies.get(cookieName)?.value)
    }
    if (!lng) {
      lng = acceptLanguage.get(request.headers.get("Accept-Language"))
    }
    if (!lng) {
      lng = fallbackLng
    }

    const signInUrl = new URL(`/${lng}/signin`, origin)
    let callbackTargetPath = pathname
    // Strip the leading locale for the callbackUrl if present
    if (pathname.startsWith(`/${lng}/`)) {
      callbackTargetPath = pathname.substring(`/${lng}/`.length)
    } else if (pathname === `/${lng}`) {
      callbackTargetPath = "/"
    }
    // Ensure callbackTargetPath starts with a /
    if (callbackTargetPath && !callbackTargetPath.startsWith("/")) {
      callbackTargetPath = `/${callbackTargetPath}`
    }
    if (!callbackTargetPath) callbackTargetPath = "/"

    signInUrl.searchParams.set(
      "callbackUrl",
      encodeURIComponent(callbackTargetPath + search)
    )
    return NextResponse.redirect(signInUrl)
  }

  // --- i18n Language Detection --- START ---
  let lng: string | undefined | null

  // Try to get language from cookie
  if (request.cookies.has(cookieName)) {
    lng = acceptLanguage.get(request.cookies.get(cookieName)?.value)
  }
  // If no cookie, try from Accept-Language header
  if (!lng) {
    lng = acceptLanguage.get(request.headers.get("Accept-Language"))
  }
  // If still no language, use fallback
  if (!lng) {
    lng = fallbackLng
  }

  // Check if the pathname already starts with a supported language
  const pathnameIsMissingLocale = languages.every(
    (loc) => !pathname.startsWith(`/${loc}/`) && pathname !== `/${loc}`
  )

  // Redirect if locale is missing
  if (pathnameIsMissingLocale) {
    const newPathnameWithLocale = `/${lng}${pathname.startsWith("/") ? "" : "/"}${pathname}`

    // Check if this is a client-side navigation
    const isClientSideNavigation = request.headers
      .get("accept")
      ?.includes("text/html")

    // For client-side navigation, use rewrite to prevent full page reload
    if (isClientSideNavigation) {
      const rewriteUrl = new URL(newPathnameWithLocale + search, origin)
      return NextResponse.rewrite(rewriteUrl)
    }

    // For direct access/server-side navigation, use redirect
    const redirectUrl = new URL(newPathnameWithLocale + search, origin)
    return NextResponse.redirect(redirectUrl)
  }
  // --- i18n Language Detection --- END ---

  // At this point, 'pathname' is the full path, potentially with locale.
  // 'lng' is the determined language.

  const isBanned = token?.isBanned
  const hasOnboarded = featureFlags.onboardingFlow ? token?.hasOnboarded : true

  // Redirect billing route (ensure path check is locale-aware)
  if (pathname === `/${lng}/billing`) {
    const homeUrl = new URL(`/${lng}/`, origin)
    return NextResponse.redirect(homeUrl)
  }

  if (token && isBanned && pathname !== `/${lng}/banned`) {
    const bannedUrl = new URL(`/${lng}/banned`, origin)
    return NextResponse.redirect(bannedUrl)
  }

  // Redirect to onboarding if authenticated, not onboarded, and not already on onboarding or banned pages
  if (
    token &&
    !hasOnboarded &&
    pathname !== `/${lng}/onboarding` && // Not on the main onboarding page
    !pathname.startsWith(`/${lng}/onboarding/`) && // Not on any sub-path of onboarding
    pathname !== `/${lng}/banned` // And not on the banned page
  ) {
    const onboardingUrl = new URL(`/${lng}/onboarding`, origin)
    return NextResponse.redirect(onboardingUrl)
  }

  // Redirect from onboarding if authenticated and already onboarded
  if (token && hasOnboarded && pathname.startsWith(`/${lng}/onboarding`)) {
    const homeUrl = new URL(`/${lng}/`, origin)
    return NextResponse.redirect(homeUrl)
  }

  // --- Authenticated User Logic & Other Checks --- START ---
  // Handle markdown requests
  if (pathname.endsWith(".md")) {
    return handleMarkdownRequest(request)
  }

  // Redirect authenticated users from signin/signup pages
  if (
    token &&
    (pathname === `/${lng}/signin` ||
      pathname === `/${lng}/signup` ||
      pathname === `/${lng}/warm-welcome`)
  ) {
    const homeUrl = new URL(`/${lng}/`, origin)
    return NextResponse.redirect(homeUrl)
  }

  // Prepare response (potentially with i18n cookie)
  const response = NextResponse.next()

  // Set i18n cookie if needed (detected from header, not already set by a previous response)
  if (
    lng && // Ensure lng is determined
    !request.cookies.has(cookieName) &&
    acceptLanguage.get(request.headers.get("Accept-Language")) // Check if header was the source
  ) {
    response.cookies.set(cookieName, lng, { path: "/" })
  }

  return response
}

// Main middleware export
// eslint-disable-next-line import/no-default-export
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle NextAuth routes separately for rate limiting
  if (pathname.startsWith("/api/auth/")) {
    return handleNextAuthRoute(request)
  }

  // For all other routes, use the combined middleware with auth
  const authMiddleware = withAuth(combinedMiddleware, {
    callbacks: {
      authorized: () => true,
    },
    pages: {
      signIn: "/signin",
      signOut: "/",
      error: "/auth/error",
    },
  })

  return authMiddleware(request as NextRequestWithAuth, {} as any)
}

import acceptLanguage from "accept-language"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

import { cookieName, languages } from "@/lib/i18n/settings"

acceptLanguage.languages(languages)

export const config = {
  // Skip api routes and asset files (with extensions)
  matcher: [
    // Exclude all paths that shouldn't be internationalized
    "/((?!api|_next/static|_next/image|images|assets|favicon.ico|contact|docs|features|newsletter|request-info|.*\\..*).*)",
  ],
}

export function middleware(req: NextRequest) {
  // Skip middleware for static assets and build files
  if (
    req.nextUrl.pathname.includes("/_next/") ||
    req.nextUrl.pathname.includes("/api/") ||
    req.nextUrl.pathname.endsWith(".js") ||
    req.nextUrl.pathname.endsWith(".js.map") ||
    req.nextUrl.pathname.endsWith(".json")
  ) {
    return NextResponse.next()
  }

  let path = req.nextUrl.pathname

  // If the path is already prefixed with a language code, let it pass through
  if (languages.some((lng) => path.startsWith(`/${lng}`))) {
    return NextResponse.next()
  }

  // Get preferred language from cookie or request header
  let lng
  const cookie = req.cookies.get(cookieName)
  if (cookie) lng = acceptLanguage.get(cookie.value)
  if (!lng) {
    // Try to get from accept-language header
    const acceptLangHeader = req.headers.get("accept-language")
    lng = acceptLangHeader ? acceptLanguage.get(acceptLangHeader) : undefined
    // If no language detected or not supported, use fallback
    if (!lng || !languages.includes(lng)) lng = languages[0] // Default language
  }

  // Remove any route group parentheses if they somehow got into the URL
  // This is a safeguard as Next.js route groups shouldn't appear in URLs
  path = path.replace(/\/\([^)]+\)/g, "")

  // Redirect to the path with language prefix
  const newPath = `/${lng}${path === "/" ? "" : path}`
  return NextResponse.redirect(new URL(newPath, req.url))
}

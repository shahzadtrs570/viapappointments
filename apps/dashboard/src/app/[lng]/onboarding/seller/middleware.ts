import { NextResponse } from "next/server"

export function middleware() {
  // This is an empty middleware that doesn't require authentication
  // It is used to override the root middleware for the seller onboarding flow
  return NextResponse.next()
}

// Apply this middleware to all routes in the seller onboarding flow
export const config = {
  matcher: ["/onboarding/seller/:path*"],
}

import { NextResponse } from "next/server"

// This is a public route that does not require authentication
export function GET() {
  return NextResponse.json({
    status: "public",
    message: "This is a public route that doesn't require authentication",
  })
}

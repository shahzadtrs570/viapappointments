import { NextResponse } from "next/server"

const N8N_API_BASE = process.env.NEXT_PUBLIC_N8N_API_BASE_URL
const N8N_API_KEY = process.env.NEXT_PUBLIC_N8N_API_KEY

export const dynamic = "force-dynamic" // Disable static caching
export const revalidate = 0 // Disable revalidation caching

export async function GET() {
  try {
    if (!N8N_API_BASE) {
      throw new Error("N8N API base URL is not configured")
    }
    if (!N8N_API_KEY) {
      throw new Error("N8N API key is not configured")
    }

    const response = await fetch(`${N8N_API_BASE}/workflows`, {
      headers: {
        "X-N8N-API-KEY": N8N_API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Disable fetch caching
      next: { revalidate: 0 }, // Disable Next.js caching
    })

    if (!response.ok) {
      throw new Error("Failed to fetch workflows")
    }

    const data = await response.json()

    // Add cache control headers to prevent browser caching
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error fetching workflows:", error)
    return NextResponse.json(
      { error: "Failed to fetch workflows" },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    )
  }
}

import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

const N8N_API_BASE = process.env.NEXT_PUBLIC_N8N_API_BASE_URL

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const webhookPath = params.path.join("/")
    const body = await request.json()

    const response = await fetch(`${N8N_API_BASE}/webhook/${webhookPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error("Webhook execution failed")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error executing webhook:", error)
    return NextResponse.json(
      { error: "Failed to execute webhook" },
      { status: 500 }
    )
  }
}

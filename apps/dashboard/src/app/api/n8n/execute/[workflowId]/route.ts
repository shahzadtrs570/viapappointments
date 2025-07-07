import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

const N8N_API_BASE = process.env.NEXT_PUBLIC_N8N_API_BASE_URL
const N8N_API_KEY = process.env.NEXT_PUBLIC_N8N_API_KEY

export async function POST(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const workflowId = params.workflowId
    const body = await request.json()

    const response = await fetch(
      `${N8N_API_BASE}/workflows/${workflowId}/execute`,
      {
        method: "POST",
        headers: {
          "X-N8N-API-KEY": N8N_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      throw new Error("Workflow execution failed")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error executing workflow:", error)
    return NextResponse.json(
      { error: "Failed to execute workflow" },
      { status: 500 }
    )
  }
}

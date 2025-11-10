import { NextRequest, NextResponse } from "next/server"
import { parseSearchQuery, parseSearchQuerySimple } from "@/lib/ai-search"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Use AI-powered parsing if OpenAI API key is available
    const useAI = !!process.env.OPENAI_API_KEY

    const result = useAI
      ? await parseSearchQuery(query)
      : await parseSearchQuerySimple(query)

    return NextResponse.json(result)
  } catch (error) {
    console.error("AI search API error:", error)
    return NextResponse.json(
      { error: "Failed to process search query" },
      { status: 500 }
    )
  }
}

import { promises as fs } from "fs"
import path from "path"

import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = path.join(process.cwd(), "src/content", ...params.path)
    const content = await fs.readFile(filePath, "utf-8")

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Markdown file not found" },
      { status: 404 }
    )
  }
}

// Opt out of edge runtime for this route
export const runtime = "nodejs"

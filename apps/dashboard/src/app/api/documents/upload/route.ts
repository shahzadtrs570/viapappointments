/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { authOptions } from "@package/auth"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { DetailsService } from "../../../../../../../packages/api/src/routers/property/sub-routers/details/service/details.service"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const propertyId = formData.get("propertyId") as string
    const documentType = formData.get("documentType") as string

    if (!file || !propertyId || !documentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload document using the DetailsService
    const service = new DetailsService()
    const result = await service.uploadDocument(
      {
        propertyId,
        documentType: documentType as any,
        file: {
          filename: file.name,
          contentType: file.type,
          buffer,
        },
      },
      session.user.id
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    )
  }
}

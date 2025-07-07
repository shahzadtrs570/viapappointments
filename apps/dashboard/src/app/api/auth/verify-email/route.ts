import { db } from "@package/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const userId = searchParams.get("userId")

    if (!token || !userId) {
      return NextResponse.redirect(
        new URL("/auth/error?error=Missing token or userId", request.url)
      )
    }

    // Find the verification token in the database
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token,
        identifier: userId,
        expires: {
          gt: new Date(),
        },
      },
    })

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL(
          "/auth/error?error=Invalid or expired verification token",
          request.url
        )
      )
    }

    // Mark the user's email as verified
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerified: new Date(),
      },
    })

    // Delete the verification token
    await db.verificationToken.deleteMany({
      where: {
        token,
        identifier: userId,
      },
    })

    // Redirect to a success page
    return NextResponse.redirect(new URL("/verified?success=true", request.url))
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.redirect(
      new URL("/auth/error?error=Failed to verify email", request.url)
    )
  }
}

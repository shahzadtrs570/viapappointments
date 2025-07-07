/* eslint-disable */

import { createHash, randomBytes } from "crypto"

import { db } from "@package/db"
import { NextResponse } from "next/server"
import { encode } from "next-auth/jwt"
import { withAuthRateLimit } from "@/lib/api-rate-limit"
import config from "../../../../../../../rain.config"

function hashToken(token: string) {
  return createHash("sha256")
    .update(`${token}${process.env.NEXTAUTH_SECRET}`)
    .digest("hex")
}

// Utility function to check if email is a company user
function isCompanyUserEmail(email: string): boolean {
  if (!email) return false

  try {
    // Check if the email exists in the company users array
    const companyUsers = config.company?.users || []

    return companyUsers.some(
      (user: { email: string }) =>
        user.email.toLowerCase() === email.toLowerCase()
    )
  } catch (error) {
    console.error("Error checking company user:", error)
    return false
  }
}
export const POST = withAuthRateLimit(async function POST(request: Request) {
  try {
    const data = await request.json()
    const { firstName, lastName, email, acceptMarketing } = data

    const existingUser = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerified: true,
        name: true,
        role: true,
        hasOnboarded: true,
        isBanned: true,
        SrenovaRole: true,
      },
    })

    let user
    if (existingUser) {
      // return NextResponse.json(
      //   {
      //     error:
      //       "This email is already registered. Please verify your email if you haven't already, or go to /signin to log in to your account.",
      //     code: "EMAIL_EXISTS",
      //   },
      //   { status: 400 }
      // )

      // Check if user should be marked as company user
      const isCompanyUser = isCompanyUserEmail(email)

      // Update existing user's name and marketing preferences
      await db.user.update({
        where: { email },
        data: {
          name: `${firstName} ${lastName}`,
          receiveUpdates: acceptMarketing,
          isCompanyUser,
        },
      })

      try {
        // Create a verification token directly
        const token = randomBytes(32).toString("hex")
        console.log("Generated token:", token)

        // Hash the token the same way NextAuth does

        const hashedToken = hashToken(token)
        console.log("Token hashed for storage")

        await db.verificationToken.create({
          data: {
            identifier: email,
            token: hashedToken,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
        })
        console.log("Verification token created successfully")

        // Verify the token was stored correctly
        const storedToken = await db.verificationToken.findUnique({
          where: {
            identifier_token: {
              identifier: email,
              token: hashedToken,
            },
          },
        })

        console.log(
          "Token verification check:",
          storedToken ? "Found in DB" : "Not found in DB"
        )

        // Get the base URL from request or environment
        const host = request.headers.get("host") || ""
        const protocol = host.includes("localhost") ? "http" : "https"
        const baseUrl = `${protocol}://${host}`

        // Format the callback URL exactly as NextAuth expects it
        const callbackUrl = `${baseUrl}/api/auth/callback/email?callbackUrl=${encodeURIComponent(baseUrl)}&token=${token}&email=${encodeURIComponent(email)}`

        return NextResponse.json(
          {
            success: true,
            directSignInUrl: callbackUrl,
          },
          { status: 200 }
        )
      } catch (tokenError) {
        console.error("Error creating verification token:", tokenError)
        return NextResponse.json(
          { error: "Failed to create verification token" },
          { status: 500 }
        )
      }
      // return NextResponse.json(
      //   {
      //     error:
      //       "This email is already registered. Please verify your email if you haven't already, or go to /signin to log in to your account.",
      //     code: "EMAIL_EXISTS",
      //   },
      //   { status: 400 }
      // )
    } else {
      // Check if user should be marked as company user
      const isCompanyUser = isCompanyUserEmail(email)

      // Create new user
      user = await db.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          receiveUpdates: acceptMarketing,
          isCompanyUser,
          // Keep emailVerified as null - no verification needed
          emailVerified: null,
          hasOnboarded: true,
        },
      })

      try {
        // Create a session token directly
        const sessionToken = randomBytes(32).toString("hex")

        // Get the current date and expiry date
        const now = new Date()
        const expires = new Date(now)
        expires.setDate(expires.getDate() + 30) // 30 days session

        // Store the session in the database
        await db.session.create({
          data: {
            sessionToken,
            userId: user.id,
            expires,
          },
        })

        // Get the base URL from request or environment
        const host = request.headers.get("host") || ""
        const protocol = host.includes("localhost") ? "http" : "https"
        const baseUrl = `${protocol}://${host}`

        // Create JWT token for authentication
        const token = await encode({
          token: {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.image,
            role: user.role,
            hasOnboarded: user.hasOnboarded,
            isBanned: user.isBanned,
            isCompanyUser: user.isCompanyUser,
            SrenovaRole: user.SrenovaRole,
            emailVerified: null,
          },
          secret: process.env.NEXTAUTH_SECRET || "",
        })

        // Determine if we need to add the Secure flag (for HTTPS environments)
        const isSecureEnvironment = !host.includes("localhost")

        // Get cookie name based on environment
        const cookiePrefix = isSecureEnvironment ? "__Secure-" : ""
        const cookieName = `${cookiePrefix}next-auth.session-token`

        // Set cookie options with proper security settings
        const cookieOptions = {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: isSecureEnvironment,
          expires: expires.toUTCString(),
        }

        // Format cookie string
        const cookieString = Object.entries({
          ...cookieOptions,
          // Convert boolean values to strings for the cookie header
          secure: cookieOptions.secure ? "true" : undefined,
        })
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => {
            // Format each option correctly
            if (key === "secure" && value === "true") return "Secure"
            if (key === "httpOnly") return "HttpOnly"
            if (key === "sameSite") return `SameSite=${value}`
            if (key === "expires") return `Expires=${value}`
            return `${key}=${value}`
          })
          .join("; ")

        // Return the session info to the client
        return NextResponse.json(
          {
            success: true,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            token,
            baseUrl,
          },
          {
            status: 200,
            headers: {
              "Set-Cookie": `${cookieName}=${token}; ${cookieString}`,
            },
          }
        )
      } catch (tokenError) {
        console.error("Error creating session:", tokenError)
        return NextResponse.json(
          { error: "Failed to create session" },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    console.error("Warm welcome error:", error)
    return NextResponse.json(
      { error: "Failed to complete warm welcome" },
      { status: 500 }
    )
  }
})

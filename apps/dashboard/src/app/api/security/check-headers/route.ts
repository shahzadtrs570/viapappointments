import fs from "fs"
import path from "path"

import { NextResponse } from "next/server"

export function GET() {
  try {
    const middlewarePath = path.join(process.cwd(), "src/middleware.ts")
    const nextConfigPath = path.join(process.cwd(), "next.config.js")

    let hasSecureHeaders = false
    let implementedHeaders: string[] = []

    // Check middleware for headers
    if (fs.existsSync(middlewarePath)) {
      const middlewareContent = fs.readFileSync(middlewarePath, "utf8")

      const securityHeaders = {
        "X-XSS-Protection": middlewareContent.includes("X-XSS-Protection"),
        "X-Frame-Options": middlewareContent.includes("X-Frame-Options"),
        "X-Content-Type-Options": middlewareContent.includes(
          "X-Content-Type-Options"
        ),
        "Referrer-Policy": middlewareContent.includes("Referrer-Policy"),
        "Content-Security-Policy": middlewareContent.includes(
          "Content-Security-Policy"
        ),
        "Strict-Transport-Security": middlewareContent.includes(
          "Strict-Transport-Security"
        ),
        "Permissions-Policy": middlewareContent.includes("Permissions-Policy"),
      }

      implementedHeaders = Object.entries(securityHeaders)
        .filter(([_, implemented]) => {
          console.log(_)
          return implemented
        })
        .map(([header]) => header)

      hasSecureHeaders = implementedHeaders.length > 0
    }

    // Check next.config.js for headers
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, "utf8")

      if (
        configContent.includes("headers()") ||
        configContent.includes("securityHeaders")
      ) {
        hasSecureHeaders = true
        if (!implementedHeaders.includes("Next.js Headers Config")) {
          implementedHeaders.push("Next.js Headers Config")
        }
      }
    }

    return NextResponse.json({
      implemented: hasSecureHeaders,
      details: {
        implementedHeaders,
        missingHeaders: [
          "X-XSS-Protection",
          "X-Frame-Options",
          "X-Content-Type-Options",
          "Referrer-Policy",
          "Content-Security-Policy",
          "Strict-Transport-Security",
          "Permissions-Policy",
        ].filter((header) => !implementedHeaders.includes(header)),
      },
    })
  } catch (error) {
    console.error("Error checking secure headers:", error)
    return NextResponse.json({
      implemented: false,
      details: {
        implementedHeaders: [],
        missingHeaders: [
          "X-XSS-Protection",
          "X-Frame-Options",
          "X-Content-Type-Options",
          "Referrer-Policy",
          "Content-Security-Policy",
          "Strict-Transport-Security",
          "Permissions-Policy",
        ],
      },
    })
  }
}

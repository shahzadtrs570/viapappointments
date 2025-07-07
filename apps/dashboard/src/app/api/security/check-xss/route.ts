/* eslint-disable */

import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { SecurityIssue, BaseSecurityCheck } from "../types"

interface XssAnalysis extends BaseSecurityCheck {
  details: {
    score: number
    issues: SecurityIssue[]
    recommendations: string[]
    implementation: {
      coverage: number
      location: string[]
    }
    protection: {
      sanitization: boolean
      escaping: boolean
      csp: boolean
      httpHeaders: boolean
      domPurify: boolean
      customProtection: boolean
      frameworkProtection: boolean
      inputValidation: boolean
    }
    configuration: {
      hasDOMPurify: boolean
      hasHelmet: boolean
      hasXssFilters: boolean
      hasCustomSanitizer: boolean
      hasSecurityHeaders: boolean
    }
  }
}

export async function GET() {
  try {
    const analysis: XssAnalysis = {
      implemented: false,
      details: {
        score: 0,
        issues: [],
        recommendations: [],
        implementation: {
          coverage: 0,
          location: [],
        },
        protection: {
          sanitization: false,
          escaping: false,
          csp: false,
          httpHeaders: false,
          domPurify: false,
          customProtection: false,
          frameworkProtection: false,
          inputValidation: false,
        },
        configuration: {
          hasDOMPurify: false,
          hasHelmet: false,
          hasXssFilters: false,
          hasCustomSanitizer: false,
          hasSecurityHeaders: false,
        },
      },
    }

    // Check package.json for XSS protection dependencies
    const packagePath = path.join(process.cwd(), "package.json")
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      }

      if (dependencies["dompurify"]) {
        analysis.details.configuration.hasDOMPurify = true
        analysis.details.protection.domPurify = true
      }

      if (dependencies["helmet"]) {
        analysis.details.configuration.hasHelmet = true
        analysis.details.protection.httpHeaders = true
      }

      if (dependencies["xss-filters"] || dependencies["xss"]) {
        analysis.details.configuration.hasXssFilters = true
        analysis.details.protection.sanitization = true
      }
    }

    // Check for security configuration files
    const configPaths = [
      "next.config.js",
      "src/middleware.ts",
      "src/lib/security.ts",
      "src/utils/sanitize.ts",
      "src/config/headers.ts",
    ]

    for (const configPath of configPaths) {
      const fullPath = path.join(process.cwd(), configPath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf8")
        analysis.details.implementation.location.push(configPath)

        if (content.includes("Content-Security-Policy")) {
          analysis.details.protection.csp = true
        }

        if (
          content.includes("X-XSS-Protection") ||
          content.includes("X-Frame-Options")
        ) {
          analysis.details.configuration.hasSecurityHeaders = true
          analysis.details.protection.httpHeaders = true
        }

        if (content.includes("sanitize") || content.includes("escape")) {
          analysis.details.configuration.hasCustomSanitizer = true
          analysis.details.protection.sanitization = true
        }

        if (content.includes("DOMPurify")) {
          analysis.details.protection.domPurify = true
        }
      }
    }

    // Check for custom XSS protection implementations
    const customPaths = [
      "src/utils",
      "src/lib",
      "src/middleware",
      "src/components",
    ]

    for (const customPath of customPaths) {
      const fullPath = path.join(process.cwd(), customPath)
      if (fs.existsSync(fullPath)) {
        const scanDir = (dir: string) => {
          const files = fs.readdirSync(dir)

          for (const file of files) {
            const filePath = path.join(dir, file)
            const stat = fs.statSync(filePath)

            if (stat.isDirectory()) {
              scanDir(filePath)
            } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
              const content = fs.readFileSync(filePath, "utf8")
              const relativePath = path.relative(process.cwd(), filePath)

              if (
                content.includes("sanitize") ||
                content.includes("escape") ||
                content.includes("purify")
              ) {
                analysis.details.implementation.location.push(relativePath)
                analysis.details.protection.customProtection = true

                if (
                  content.includes("validate") ||
                  content.includes("filter")
                ) {
                  analysis.details.protection.inputValidation = true
                }
              }

              if (content.includes("dangerouslySetInnerHTML")) {
                analysis.details.issues.push({
                  message: `Unsafe innerHTML usage detected in ${relativePath}`,
                  severity: "critical",
                  solution: {
                    description:
                      "Replace dangerouslySetInnerHTML with safe alternatives",
                    steps: [
                      "Use DOMPurify to sanitize HTML",
                      "Consider using markdown or text-only alternatives",
                      "Implement proper content escaping",
                    ],
                    fileReferences: [relativePath],
                    docsUrl: "https://github.com/cure53/DOMPurify",
                  },
                })
              }
            }
          }
        }

        scanDir(fullPath)
      }
    }

    // Check for framework-level protection
    const nextConfigPath = path.join(process.cwd(), "next.config.js")
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, "utf8")
      if (content.includes("headers()")) {
        analysis.details.protection.frameworkProtection = true
      }
    }

    // Calculate coverage and score
    const protectionFeatures = Object.values(
      analysis.details.protection
    ).filter(Boolean).length
    const configFeatures = Object.values(analysis.details.configuration).filter(
      Boolean
    ).length
    const totalFeatures =
      Object.keys(analysis.details.protection).length +
      Object.keys(analysis.details.configuration).length

    analysis.details.implementation.coverage =
      ((protectionFeatures + configFeatures) / totalFeatures) * 100
    analysis.details.score = Math.round(
      analysis.details.implementation.coverage
    )

    // Generate issues based on missing features
    if (!analysis.details.protection.sanitization) {
      analysis.details.issues.push({
        message: "Input sanitization not implemented",
        severity: "critical",
        solution: {
          description: "Implement input sanitization to prevent XSS attacks",
          steps: [
            "Add DOMPurify or similar sanitization library",
            "Create sanitization utility functions",
            "Apply sanitization to user inputs",
            "Implement sanitization middleware",
          ],
          fileReferences: [
            "src/utils/sanitize.ts",
            "src/middleware/security.ts",
          ],
          docsUrl: "https://github.com/cure53/DOMPurify",
        },
      })
    }

    if (!analysis.details.protection.csp) {
      analysis.details.issues.push({
        message: "Content Security Policy not implemented",
        severity: "critical",
        solution: {
          description: "Implement Content Security Policy headers",
          steps: [
            "Configure CSP in next.config.js",
            "Add security headers middleware",
            "Define CSP rules",
            "Test CSP configuration",
          ],
          fileReferences: ["next.config.js", "src/middleware.ts"],
          docsUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP",
        },
      })
    }

    if (!analysis.details.protection.httpHeaders) {
      analysis.details.issues.push({
        message: "Security headers not implemented",
        severity: "critical",
        solution: {
          description:
            "Implement security headers using Helmet or Next.js config",
          steps: [
            "Add Helmet middleware",
            "Configure security headers",
            "Add X-XSS-Protection header",
            "Add other security headers",
          ],
          fileReferences: ["src/middleware.ts", "next.config.js"],
          docsUrl: "https://helmetjs.github.io/",
        },
      })
    }

    if (!analysis.details.protection.inputValidation) {
      analysis.details.issues.push({
        message: "Input validation not implemented",
        severity: "critical",
        solution: {
          description: "Implement input validation for all user inputs",
          steps: [
            "Add validation library",
            "Create validation schemas",
            "Implement validation middleware",
            "Add validation to forms",
          ],
          fileReferences: ["src/lib/validation.ts", "src/components/Form.tsx"],
          docsUrl: "https://zod.dev/",
        },
      })
    }

    // Set implementation status
    analysis.implemented =
      analysis.details.score >= 80 &&
      analysis.details.protection.sanitization &&
      analysis.details.protection.csp &&
      analysis.details.protection.httpHeaders

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error checking XSS protection:", error)
    return NextResponse.json(
      {
        implemented: false,
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          issues: [
            {
              message: "Error checking XSS protection implementation",
              severity: "critical",
              solution: {
                description:
                  "An error occurred while analyzing XSS protection configuration",
                steps: [
                  "Check file permissions",
                  "Verify configuration files exist",
                  "Ensure all config files are valid",
                ],
                fileReferences: ["next.config.js", "src/middleware.ts"],
              },
            },
          ],
          score: 0,
          recommendations: [],
          implementation: {
            coverage: 0,
            location: [],
          },
        },
      },
      { status: 500 }
    )
  }
}

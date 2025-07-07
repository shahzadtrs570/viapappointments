/* eslint-disable */

import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { SecurityIssue, BaseSecurityCheck } from "../types"

interface UploadAnalysis extends BaseSecurityCheck {
  details: {
    score: number
    issues: SecurityIssue[]
    recommendations: string[]
    implementation: {
      coverage: number
      location: string[]
    }
    upload: {
      fileValidation: boolean
      typeValidation: boolean
      sizeValidation: boolean
      malwareScanning: boolean
      secureStorage: boolean
      cdnIntegration: boolean
      accessControl: boolean
      metadataStripping: boolean
    }
    configuration: {
      hasS3: boolean
      hasCloudinary: boolean
      hasR2: boolean
      hasCustomStorage: boolean
    }
  }
}

export async function GET() {
  try {
    const analysis: UploadAnalysis = {
      implemented: false,
      details: {
        score: 0,
        issues: [],
        recommendations: [],
        implementation: {
          coverage: 0,
          location: [],
        },
        upload: {
          fileValidation: false,
          typeValidation: false,
          sizeValidation: false,
          malwareScanning: false,
          secureStorage: false,
          cdnIntegration: false,
          accessControl: false,
          metadataStripping: false,
        },
        configuration: {
          hasS3: false,
          hasCloudinary: false,
          hasR2: false,
          hasCustomStorage: false,
        },
      },
    }

    // Check package.json for upload-related dependencies
    const packagePath = path.join(process.cwd(), "package.json")
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      }

      if (dependencies["@aws-sdk/client-s3"]) {
        analysis.details.configuration.hasS3 = true
      }

      if (dependencies["cloudinary"]) {
        analysis.details.configuration.hasCloudinary = true
      }

      if (dependencies["@cloudflare/workers-types"]) {
        analysis.details.configuration.hasR2 = true
      }
    }

    // Check for upload configuration files
    const configPaths = [
      "src/lib/upload.ts",
      "src/utils/upload.ts",
      "src/config/upload.ts",
      "src/storage.ts",
      "src/uploads",
    ]

    for (const configPath of configPaths) {
      const fullPath = path.join(process.cwd(), configPath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf8")
        analysis.details.implementation.location.push(configPath)

        if (content.includes("validate") || content.includes("check")) {
          analysis.details.upload.fileValidation = true

          if (content.includes("type") || content.includes("mime")) {
            analysis.details.upload.typeValidation = true
          }

          if (content.includes("size") || content.includes("maxSize")) {
            analysis.details.upload.sizeValidation = true
          }
        }

        if (
          content.includes("virus") ||
          content.includes("malware") ||
          content.includes("scan")
        ) {
          analysis.details.upload.malwareScanning = true
        }

        if (
          content.includes("s3") ||
          content.includes("cloudinary") ||
          content.includes("r2")
        ) {
          analysis.details.upload.secureStorage = true
        }

        if (content.includes("cdn") || content.includes("delivery")) {
          analysis.details.upload.cdnIntegration = true
        }

        if (content.includes("permission") || content.includes("access")) {
          analysis.details.upload.accessControl = true
        }

        if (content.includes("metadata") || content.includes("strip")) {
          analysis.details.upload.metadataStripping = true
        }
      }
    }

    // Check for custom upload implementation
    const customImplPaths = [
      "src/lib/storage",
      "src/utils/storage",
      "packages/storage",
      "src/uploads",
    ]

    for (const implPath of customImplPaths) {
      const fullPath = path.join(process.cwd(), implPath)
      if (fs.existsSync(fullPath)) {
        analysis.details.configuration.hasCustomStorage = true
        analysis.details.implementation.location.push(implPath)
        break
      }
    }

    // Check API routes for upload handling
    const apiPath = path.join(process.cwd(), "src/app/api")
    if (fs.existsSync(apiPath)) {
      const scanApiRoutes = (dir: string) => {
        const files = fs.readdirSync(dir)

        for (const file of files) {
          const fullPath = path.join(dir, file)
          const stat = fs.statSync(fullPath)

          if (stat.isDirectory()) {
            scanApiRoutes(fullPath)
          } else if (file === "route.ts" || file === "route.js") {
            const content = fs.readFileSync(fullPath, "utf8")
            const relativePath = path.relative(process.cwd(), fullPath)

            if (
              content.includes("upload") ||
              content.includes("formData") ||
              content.includes("multipart")
            ) {
              analysis.details.implementation.location.push(relativePath)

              if (content.includes("validate") || content.includes("check")) {
                analysis.details.upload.fileValidation = true
              }

              if (
                content.includes("permission") ||
                content.includes("access")
              ) {
                analysis.details.upload.accessControl = true
              }
            }
          }
        }
      }

      scanApiRoutes(apiPath)
    }

    // Calculate coverage and score
    const uploadFeatures = Object.values(analysis.details.upload).filter(
      Boolean
    ).length
    const configFeatures = Object.values(analysis.details.configuration).filter(
      Boolean
    ).length
    const totalFeatures =
      Object.keys(analysis.details.upload).length +
      Object.keys(analysis.details.configuration).length

    analysis.details.implementation.coverage =
      ((uploadFeatures + configFeatures) / totalFeatures) * 100
    analysis.details.score = Math.round(
      analysis.details.implementation.coverage
    )

    // Generate issues based on missing features
    if (!analysis.details.upload.fileValidation) {
      analysis.details.issues.push({
        message: "File validation not implemented",
        severity: "critical",
        solution: {
          description:
            "Implement file validation to prevent malicious file uploads",
          steps: [
            "Add file type validation",
            "Implement size limits",
            "Add file extension checks",
            "Implement content validation",
          ],
          fileReferences: ["src/lib/upload.ts", "src/utils/validation.ts"],
          docsUrl:
            "https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload",
        },
      })
    }

    if (!analysis.details.upload.secureStorage) {
      analysis.details.issues.push({
        message: "Secure storage not configured",
        severity: "critical",
        solution: {
          description: "Configure secure storage for uploaded files",
          steps: [
            "Set up cloud storage (e.g., S3)",
            "Configure access policies",
            "Implement secure URLs",
            "Add file encryption",
          ],
          fileReferences: ["src/lib/storage.ts", "src/config/storage.ts"],
          docsUrl: "https://aws.amazon.com/s3/security/",
        },
      })
    }

    if (!analysis.details.upload.malwareScanning) {
      analysis.details.issues.push({
        message: "Malware scanning not implemented",
        severity: "warning",
        solution: {
          description: "Implement malware scanning for uploaded files",
          steps: [
            "Add virus scanning service",
            "Configure scan triggers",
            "Implement quarantine",
            "Add scan reporting",
          ],
          fileReferences: ["src/lib/upload.ts", "src/utils/scanner.ts"],
          docsUrl:
            "https://cloudinary.com/documentation/upload_images#incoming_transformations",
        },
      })
    }

    if (!analysis.details.upload.accessControl) {
      analysis.details.issues.push({
        message: "Upload access control not implemented",
        severity: "critical",
        solution: {
          description: "Implement access control for file uploads",
          steps: [
            "Add user authentication",
            "Implement upload permissions",
            "Add rate limiting",
            "Configure access policies",
          ],
          fileReferences: ["src/lib/upload.ts", "src/middleware/auth.ts"],
          docsUrl:
            "https://nextjs.org/docs/app/building-your-application/routing/middleware",
        },
      })
    }

    // Set implementation status
    analysis.implemented =
      analysis.details.score >= 80 &&
      analysis.details.upload.fileValidation &&
      analysis.details.upload.secureStorage &&
      analysis.details.upload.accessControl

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error checking upload security implementation:", error)
    return NextResponse.json(
      {
        implemented: false,
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          issues: [
            {
              message: "Error checking upload security implementation",
              severity: "critical",
              solution: {
                description:
                  "An error occurred while analyzing upload security configuration",
                steps: [
                  "Check file permissions",
                  "Verify configuration files exist",
                  "Ensure all config files are valid",
                ],
                fileReferences: ["src/lib/upload.ts", "src/config/upload.ts"],
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

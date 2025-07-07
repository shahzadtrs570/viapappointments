/* eslint-disable */

import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { SecurityIssue, BaseSecurityCheck } from "../types"

interface ValidationAnalysis extends BaseSecurityCheck {
  details: {
    score: number
    issues: SecurityIssue[]
    recommendations: string[]
    implementation: {
      coverage: number
      location: string[]
    }
    validation: {
      inputValidation: boolean
      typeValidation: boolean
      schemaValidation: boolean
      customValidation: boolean
      sanitization: boolean
      errorHandling: boolean
      middlewareValidation: boolean
      contextualValidation: boolean
    }
    configuration: {
      hasZod: boolean
      hasYup: boolean
      hasJoi: boolean
      hasCustomValidation: boolean
    }
  }
}

export async function GET() {
  try {
    const analysis: ValidationAnalysis = {
      implemented: false,
      details: {
        score: 0,
        issues: [],
        recommendations: [],
        implementation: {
          coverage: 0,
          location: [],
        },
        validation: {
          inputValidation: false,
          typeValidation: false,
          schemaValidation: false,
          customValidation: false,
          sanitization: false,
          errorHandling: false,
          middlewareValidation: false,
          contextualValidation: false,
        },
        configuration: {
          hasZod: false,
          hasYup: false,
          hasJoi: false,
          hasCustomValidation: false,
        },
      },
    }

    // Check for workspace root (monorepo structure)
    const workspaceRoot = process.cwd().includes("apps/dashboard")
      ? path.join(process.cwd(), "../../")
      : process.cwd()

    // Check package.json files in monorepo packages
    const packagePaths = [
      path.join(workspaceRoot, "packages/api/package.json"),
      path.join(workspaceRoot, "packages/validations/package.json"),
      path.join(process.cwd(), "package.json"), // Dashboard app
    ]

    for (const packagePath of packagePaths) {
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
        const dependencies = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        }

        if (dependencies["zod"]) {
          analysis.details.configuration.hasZod = true
        }

        if (dependencies["yup"]) {
          analysis.details.configuration.hasYup = true
        }

        if (dependencies["joi"]) {
          analysis.details.configuration.hasJoi = true
        }
      }
    }

    // Check for validation configuration files in monorepo structure
    const configPaths = [
      // Dashboard app paths
      "src/lib/validation.ts",
      "src/utils/validation.ts",
      "src/schemas",
      "src/validations",
      "src/middleware/validation.ts",
      // Monorepo package paths
      path.join(workspaceRoot, "packages/validations/src"),
      path.join(workspaceRoot, "packages/validations/src/schemas"),
      path.join(workspaceRoot, "packages/api/src"),
    ]

    for (const configPath of configPaths) {
      const fullPath = path.isAbsolute(configPath)
        ? configPath
        : path.join(process.cwd(), configPath)
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          // Scan directory for validation files
          const scanDirectory = (dir: string) => {
            const files = fs.readdirSync(dir)
            for (const file of files) {
              const filePath = path.join(dir, file)
              const fileStat = fs.statSync(filePath)

              if (fileStat.isDirectory()) {
                scanDirectory(filePath)
              } else if (file.endsWith(".ts") || file.endsWith(".js")) {
                const content = fs.readFileSync(filePath, "utf8")
                const relativePath = path.relative(workspaceRoot, filePath)

                if (
                  content.includes("z.") ||
                  content.includes("zod") ||
                  content.includes("schema")
                ) {
                  analysis.details.implementation.location.push(relativePath)
                  analysis.details.validation.schemaValidation = true
                  analysis.details.validation.inputValidation = true
                  analysis.details.validation.typeValidation = true
                }
              }
            }
          }
          scanDirectory(fullPath)
        } else {
          const content = fs.readFileSync(fullPath, "utf8")
          const relativePath = path.relative(workspaceRoot, fullPath)
          analysis.details.implementation.location.push(relativePath)

          if (content.includes("validate") || content.includes("schema")) {
            analysis.details.validation.inputValidation = true

            if (content.includes("type") || content.includes("interface")) {
              analysis.details.validation.typeValidation = true
            }

            if (content.includes("schema") || content.includes("object")) {
              analysis.details.validation.schemaValidation = true
            }

            if (content.includes("custom") || content.includes("extend")) {
              analysis.details.validation.customValidation = true
              analysis.details.configuration.hasCustomValidation = true
            }
          }

          if (content.includes("sanitize") || content.includes("escape")) {
            analysis.details.validation.sanitization = true
          }

          if (
            content.includes("try") ||
            content.includes("catch") ||
            content.includes("TRPCError")
          ) {
            analysis.details.validation.errorHandling = true
          }

          if (
            content.includes("middleware") ||
            content.includes("handler") ||
            content.includes("procedure")
          ) {
            analysis.details.validation.middlewareValidation = true
          }

          if (content.includes("context") || content.includes("condition")) {
            analysis.details.validation.contextualValidation = true
          }
        }
      }
    }

    // Check API routes for validation in packages/api
    const apiPaths = [
      path.join(process.cwd(), "src/app/api"), // Dashboard API routes
      path.join(workspaceRoot, "packages/api/src/routers"), // tRPC routers
    ]

    for (const apiPath of apiPaths) {
      if (fs.existsSync(apiPath)) {
        const scanApiRoutes = (dir: string) => {
          const files = fs.readdirSync(dir)

          for (const file of files) {
            const fullPath = path.join(dir, file)
            const stat = fs.statSync(fullPath)

            if (stat.isDirectory()) {
              scanApiRoutes(fullPath)
            } else if (file.endsWith(".ts") || file.endsWith(".js")) {
              const content = fs.readFileSync(fullPath, "utf8")
              const relativePath = path.relative(workspaceRoot, fullPath)

              if (
                content.includes("z.") ||
                content.includes("zod") ||
                content.includes("validate") ||
                content.includes("schema") ||
                content.includes("input(") ||
                content.includes("output(")
              ) {
                analysis.details.implementation.location.push(relativePath)
                analysis.details.validation.inputValidation = true
                analysis.details.validation.schemaValidation = true
                analysis.details.validation.typeValidation = true

                if (
                  content.includes("sanitize") ||
                  content.includes("escape")
                ) {
                  analysis.details.validation.sanitization = true
                }

                if (
                  content.includes("try") ||
                  content.includes("catch") ||
                  content.includes("TRPCError")
                ) {
                  analysis.details.validation.errorHandling = true
                }

                if (
                  content.includes("procedure") ||
                  content.includes("middleware")
                ) {
                  analysis.details.validation.middlewareValidation = true
                }
              }
            }
          }
        }

        scanApiRoutes(apiPath)
      }
    }

    // Calculate coverage and score
    const validationFeatures = Object.values(
      analysis.details.validation
    ).filter(Boolean).length
    const configFeatures = Object.values(analysis.details.configuration).filter(
      Boolean
    ).length
    const totalFeatures =
      Object.keys(analysis.details.validation).length +
      Object.keys(analysis.details.configuration).length

    analysis.details.implementation.coverage =
      ((validationFeatures + configFeatures) / totalFeatures) * 100
    analysis.details.score = Math.round(
      analysis.details.implementation.coverage
    )

    // Generate issues based on missing features
    if (!analysis.details.validation.inputValidation) {
      analysis.details.issues.push({
        message: "Input validation not implemented",
        severity: "critical",
        solution: {
          description:
            "Implement input validation to protect against malicious data",
          steps: [
            "Install validation library (e.g., Zod)",
            "Create validation schemas",
            "Add validation middleware",
            "Implement error handling",
          ],
          fileReferences: ["src/lib/validation.ts", "src/schemas/index.ts"],
          docsUrl: "https://zod.dev/",
        },
      })
    }

    if (!analysis.details.validation.sanitization) {
      analysis.details.issues.push({
        message: "Input sanitization not implemented",
        severity: "critical",
        solution: {
          description:
            "Implement input sanitization to prevent XSS and injection attacks",
          steps: [
            "Add sanitization library",
            "Create sanitization rules",
            "Implement sanitization middleware",
            "Add sanitization checks",
          ],
          fileReferences: [
            "src/lib/validation.ts",
            "src/middleware/validation.ts",
          ],
          docsUrl: "https://github.com/cure53/DOMPurify",
        },
      })
    }

    if (!analysis.details.validation.errorHandling) {
      analysis.details.issues.push({
        message: "Validation error handling not implemented",
        severity: "warning",
        solution: {
          description:
            "Implement proper error handling for validation failures",
          steps: [
            "Create error types",
            "Add error handlers",
            "Implement error responses",
            "Add error logging",
          ],
          fileReferences: ["src/lib/validation.ts", "src/utils/errors.ts"],
          docsUrl:
            "https://nextjs.org/docs/app/building-your-application/routing/error-handling",
        },
      })
    }

    if (!analysis.details.validation.middlewareValidation) {
      analysis.details.issues.push({
        message: "Validation middleware not implemented",
        severity: "warning",
        solution: {
          description:
            "Implement validation middleware for consistent request validation",
          steps: [
            "Create validation middleware",
            "Add schema validation",
            "Implement error handling",
            "Add middleware to routes",
          ],
          fileReferences: ["src/middleware/validation.ts"],
          docsUrl:
            "https://nextjs.org/docs/app/building-your-application/routing/middleware",
        },
      })
    }

    // Set implementation status
    analysis.implemented =
      analysis.details.score >= 80 &&
      analysis.details.validation.inputValidation &&
      analysis.details.validation.sanitization &&
      analysis.details.validation.errorHandling

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error checking server validation implementation:", error)
    return NextResponse.json(
      {
        implemented: false,
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          issues: [
            {
              message: "Error checking server validation implementation",
              severity: "critical",
              solution: {
                description:
                  "An error occurred while analyzing validation configuration",
                steps: [
                  "Check file permissions",
                  "Verify configuration files exist",
                  "Ensure all config files are valid",
                ],
                fileReferences: [
                  "src/lib/validation.ts",
                  "src/schemas/index.ts",
                ],
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

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
      clientValidation: boolean
      serverValidation: boolean
      schemaValidation: boolean
      customValidation: boolean
      sanitization: boolean
      errorHandling: boolean
      formValidation: boolean
      apiValidation: boolean
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
          clientValidation: false,
          serverValidation: false,
          schemaValidation: false,
          customValidation: false,
          sanitization: false,
          errorHandling: false,
          formValidation: false,
          apiValidation: false,
        },
        configuration: {
          hasZod: false,
          hasYup: false,
          hasJoi: false,
          hasCustomValidation: false,
        },
      },
    }

    // Check package.json for validation dependencies
    const packagePath = path.join(process.cwd(), "package.json")
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

    // Check for validation configuration files
    const configPaths = [
      "src/lib/validation.ts",
      "src/utils/validation.ts",
      "src/schemas",
      "src/validations",
      "src/middleware/validation.ts",
    ]

    for (const configPath of configPaths) {
      const fullPath = path.join(process.cwd(), configPath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf8")
        analysis.details.implementation.location.push(configPath)

        if (content.includes("validate") || content.includes("schema")) {
          analysis.details.validation.schemaValidation = true

          if (content.includes("custom") || content.includes("extend")) {
            analysis.details.validation.customValidation = true
            analysis.details.configuration.hasCustomValidation = true
          }
        }

        if (content.includes("sanitize") || content.includes("escape")) {
          analysis.details.validation.sanitization = true
        }

        if (content.includes("try") || content.includes("catch")) {
          analysis.details.validation.errorHandling = true
        }

        if (content.includes("form") || content.includes("input")) {
          analysis.details.validation.formValidation = true
        }

        if (content.includes("api") || content.includes("request")) {
          analysis.details.validation.apiValidation = true
        }
      }
    }

    // Check client-side validation
    const clientPaths = [
      "src/components",
      "src/hooks/useValidation.ts",
      "src/utils/clientValidation.ts",
    ]

    for (const clientPath of clientPaths) {
      const fullPath = path.join(process.cwd(), clientPath)
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
                content.includes("validate") ||
                content.includes("schema") ||
                content.includes("form")
              ) {
                analysis.details.implementation.location.push(relativePath)
                analysis.details.validation.clientValidation = true

                if (content.includes("form") || content.includes("input")) {
                  analysis.details.validation.formValidation = true
                }
              }
            }
          }
        }

        scanDir(fullPath)
      }
    }

    // Check server-side validation
    const serverPaths = [
      "src/app/api",
      "src/server/validation",
      "src/middleware",
    ]

    for (const serverPath of serverPaths) {
      const fullPath = path.join(process.cwd(), serverPath)
      if (fs.existsSync(fullPath)) {
        const scanDir = (dir: string) => {
          const files = fs.readdirSync(dir)

          for (const file of files) {
            const filePath = path.join(dir, file)
            const stat = fs.statSync(filePath)

            if (stat.isDirectory()) {
              scanDir(filePath)
            } else if (file.endsWith(".ts") || file.endsWith(".js")) {
              const content = fs.readFileSync(filePath, "utf8")
              const relativePath = path.relative(process.cwd(), filePath)

              if (
                content.includes("validate") ||
                content.includes("schema") ||
                content.includes("sanitize")
              ) {
                analysis.details.implementation.location.push(relativePath)
                analysis.details.validation.serverValidation = true

                if (content.includes("api") || content.includes("request")) {
                  analysis.details.validation.apiValidation = true
                }
              }
            }
          }
        }

        scanDir(fullPath)
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
    if (!analysis.details.validation.clientValidation) {
      analysis.details.issues.push({
        message: "Client-side validation not implemented",
        severity: "warning",
        solution: {
          description:
            "Implement client-side validation for better user experience",
          steps: [
            "Add form validation library",
            "Create validation schemas",
            "Implement form validation",
            "Add error handling",
          ],
          fileReferences: [
            "src/hooks/useValidation.ts",
            "src/components/Form.tsx",
          ],
          docsUrl: "https://react-hook-form.com/",
        },
      })
    }

    if (!analysis.details.validation.serverValidation) {
      analysis.details.issues.push({
        message: "Server-side validation not implemented",
        severity: "critical",
        solution: {
          description:
            "Implement server-side validation to protect against malicious data",
          steps: [
            "Add validation library",
            "Create validation schemas",
            "Implement request validation",
            "Add error handling",
          ],
          fileReferences: [
            "src/lib/validation.ts",
            "src/middleware/validation.ts",
          ],
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
          fileReferences: ["src/lib/validation.ts", "src/utils/sanitize.ts"],
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

    // Set implementation status
    analysis.implemented =
      analysis.details.score >= 80 &&
      analysis.details.validation.serverValidation &&
      analysis.details.validation.sanitization &&
      analysis.details.validation.errorHandling

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error checking validation implementation:", error)
    return NextResponse.json(
      {
        implemented: false,
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          issues: [
            {
              message: "Error checking validation implementation",
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

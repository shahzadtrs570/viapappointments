/* eslint-disable */

import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { NextResponse } from "next/server"
import { SecurityIssue, BaseSecurityCheck } from "../types"

interface NpmAuditAnalysis extends BaseSecurityCheck {
  details: {
    score: number
    issues: SecurityIssue[]
    recommendations: string[]
    implementation: {
      coverage: number
      location: string[]
    }
    audit: {
      hasAudit: boolean
      hasFixedVulnerabilities: boolean
      hasSecurityPolicy: boolean
      hasAuditWorkflow: boolean
      hasAutomatedFixes: boolean
      hasVulnerabilityAlerts: boolean
      hasLockfileAudit: boolean
      hasDependencyReview: boolean
    }
    configuration: {
      hasNpmrc: boolean
      hasGitHubActions: boolean
      hasDependabot: boolean
      hasSnyk: boolean
    }
    vulnerabilities: {
      critical: number
      high: number
      moderate: number
      low: number
      total: number
      packages: string[]
    }
  }
}

export async function GET() {
  try {
    const analysis: NpmAuditAnalysis = {
      implemented: false,
      details: {
        score: 0,
        issues: [],
        recommendations: [],
        implementation: {
          coverage: 0,
          location: [],
        },
        audit: {
          hasAudit: false,
          hasFixedVulnerabilities: false,
          hasSecurityPolicy: false,
          hasAuditWorkflow: false,
          hasAutomatedFixes: false,
          hasVulnerabilityAlerts: false,
          hasLockfileAudit: false,
          hasDependencyReview: false,
        },
        configuration: {
          hasNpmrc: false,
          hasGitHubActions: false,
          hasDependabot: false,
          hasSnyk: false,
        },
        vulnerabilities: {
          critical: 0,
          high: 0,
          moderate: 0,
          low: 0,
          total: 0,
          packages: [],
        },
      },
    }

    // Check package.json and package-lock.json
    const packagePath = path.join(process.cwd(), "package.json")
    const lockfilePath = path.join(process.cwd(), "package-lock.json")

    if (fs.existsSync(packagePath)) {
      analysis.details.implementation.location.push("package.json")
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      }

      // Check for security-related scripts
      if (packageJson.scripts) {
        const scripts = packageJson.scripts
        if (
          scripts.audit ||
          scripts["audit:fix"] ||
          scripts.security ||
          scripts["security:fix"]
        ) {
          analysis.details.audit.hasAudit = true
          analysis.details.audit.hasAutomatedFixes = true
        }
      }

      // Check for security tools
      if (dependencies["snyk"]) {
        analysis.details.configuration.hasSnyk = true
      }
    }

    // Check for lockfile
    if (fs.existsSync(lockfilePath)) {
      analysis.details.implementation.location.push("package-lock.json")
      analysis.details.audit.hasLockfileAudit = true
    }

    // Check for .npmrc
    const npmrcPath = path.join(process.cwd(), ".npmrc")
    if (fs.existsSync(npmrcPath)) {
      analysis.details.implementation.location.push(".npmrc")
      analysis.details.configuration.hasNpmrc = true

      const npmrcContent = fs.readFileSync(npmrcPath, "utf8")
      if (
        npmrcContent.includes("audit-level") ||
        npmrcContent.includes("audit")
      ) {
        analysis.details.audit.hasAudit = true
      }
    }

    // Check for GitHub security configurations
    const githubPath = path.join(process.cwd(), ".github")
    if (fs.existsSync(githubPath)) {
      // Check for Dependabot
      const dependabotPath = path.join(githubPath, "dependabot.yml")
      if (fs.existsSync(dependabotPath)) {
        analysis.details.implementation.location.push(".github/dependabot.yml")
        analysis.details.configuration.hasDependabot = true
        analysis.details.audit.hasVulnerabilityAlerts = true
      }

      // Check for GitHub Actions
      const workflowsPath = path.join(githubPath, "workflows")
      if (fs.existsSync(workflowsPath)) {
        const files = fs.readdirSync(workflowsPath)
        for (const file of files) {
          if (file.includes("audit") || file.includes("security")) {
            analysis.details.implementation.location.push(
              `.github/workflows/${file}`
            )
            analysis.details.configuration.hasGitHubActions = true
            analysis.details.audit.hasAuditWorkflow = true
            break
          }
        }
      }

      // Check for security policy
      const securityPolicyPath = path.join(githubPath, "SECURITY.md")
      if (fs.existsSync(securityPolicyPath)) {
        analysis.details.implementation.location.push(".github/SECURITY.md")
        analysis.details.audit.hasSecurityPolicy = true
      }
    }

    // Run npm audit if package-lock.json exists
    if (fs.existsSync(lockfilePath)) {
      try {
        const auditOutput = execSync("npm audit --json", { encoding: "utf8" })
        const auditResult = JSON.parse(auditOutput)

        if (auditResult.metadata) {
          analysis.details.vulnerabilities = {
            critical: auditResult.metadata.vulnerabilities?.critical || 0,
            high: auditResult.metadata.vulnerabilities?.high || 0,
            moderate: auditResult.metadata.vulnerabilities?.moderate || 0,
            low: auditResult.metadata.vulnerabilities?.low || 0,
            total: auditResult.metadata.vulnerabilities?.total || 0,
            packages: Object.keys(auditResult.advisories || {}),
          }

          // Check if vulnerabilities have been fixed
          if (auditResult.metadata.totalFixed) {
            analysis.details.audit.hasFixedVulnerabilities = true
          }
        }

        // Generate issues based on vulnerabilities
        if (analysis.details.vulnerabilities.critical > 0) {
          analysis.details.issues.push({
            message: `${analysis.details.vulnerabilities.critical} critical vulnerabilities found`,
            severity: "critical",
            solution: {
              description: "Fix critical vulnerabilities in dependencies",
              steps: [
                "Run npm audit fix",
                "Update vulnerable packages",
                "Review security advisories",
                "Test after updates",
              ],
              fileReferences: ["package.json", "package-lock.json"],
              docsUrl:
                "https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities",
            },
          })
        }

        if (analysis.details.vulnerabilities.high > 0) {
          analysis.details.issues.push({
            message: `${analysis.details.vulnerabilities.high} high severity vulnerabilities found`,
            severity: "critical",
            solution: {
              description: "Address high severity vulnerabilities",
              steps: [
                "Run npm audit fix",
                "Review and update packages",
                "Check for breaking changes",
                "Run tests after updates",
              ],
              fileReferences: ["package.json", "package-lock.json"],
              docsUrl:
                "https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities",
            },
          })
        }
      } catch (error) {
        console.error("Error running npm audit:", error)
      }
    }

    // Generate issues based on missing features
    if (!analysis.details.audit.hasAudit) {
      analysis.details.issues.push({
        message: "No npm audit configuration found",
        severity: "critical",
        solution: {
          description: "Configure npm audit for dependency security checks",
          steps: [
            "Add audit scripts to package.json",
            "Configure audit settings in .npmrc",
            "Set up automated audit workflow",
            "Configure audit reporting",
          ],
          fileReferences: ["package.json", ".npmrc"],
          docsUrl: "https://docs.npmjs.com/cli/v8/commands/npm-audit",
        },
      })
    }

    if (!analysis.details.configuration.hasDependabot) {
      analysis.details.issues.push({
        message: "Dependabot not configured",
        severity: "warning",
        solution: {
          description: "Configure Dependabot for automated dependency updates",
          steps: [
            "Create .github/dependabot.yml",
            "Configure update schedule",
            "Set dependency types to monitor",
            "Configure PR limits",
          ],
          fileReferences: [".github/dependabot.yml"],
          docsUrl:
            "https://docs.github.com/en/code-security/dependabot/dependabot-version-updates",
        },
      })
    }

    if (!analysis.details.audit.hasSecurityPolicy) {
      analysis.details.issues.push({
        message: "Security policy not found",
        severity: "warning",
        solution: {
          description: "Create a security policy for vulnerability reporting",
          steps: [
            "Create SECURITY.md",
            "Define reporting process",
            "Specify supported versions",
            "Document security measures",
          ],
          fileReferences: [".github/SECURITY.md"],
          docsUrl:
            "https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository",
        },
      })
    }

    // Calculate coverage and score
    const auditFeatures = Object.values(analysis.details.audit).filter(
      Boolean
    ).length
    const configFeatures = Object.values(analysis.details.configuration).filter(
      Boolean
    ).length
    const totalFeatures =
      Object.keys(analysis.details.audit).length +
      Object.keys(analysis.details.configuration).length

    analysis.details.implementation.coverage =
      ((auditFeatures + configFeatures) / totalFeatures) * 100

    // Calculate score based on implementation and vulnerabilities
    const baseScore = analysis.details.implementation.coverage
    const vulnerabilityPenalty =
      analysis.details.vulnerabilities.critical * 20 +
      analysis.details.vulnerabilities.high * 10 +
      analysis.details.vulnerabilities.moderate * 5 +
      analysis.details.vulnerabilities.low * 2

    analysis.details.score = Math.max(
      0,
      Math.round(baseScore - vulnerabilityPenalty)
    )

    // Set implementation status
    analysis.implemented =
      analysis.details.score >= 80 &&
      analysis.details.audit.hasAudit &&
      analysis.details.audit.hasLockfileAudit &&
      analysis.details.vulnerabilities.critical === 0

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error checking npm audit implementation:", error)
    return NextResponse.json(
      {
        implemented: false,
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          issues: [
            {
              message: "Error checking npm audit implementation",
              severity: "critical",
              solution: {
                description:
                  "An error occurred while analyzing npm audit configuration",
                steps: [
                  "Check file permissions",
                  "Verify package.json exists",
                  "Ensure npm is installed",
                  "Check npm audit access",
                ],
                fileReferences: ["package.json", "package-lock.json"],
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

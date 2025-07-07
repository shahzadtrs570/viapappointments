/* eslint-disable */

import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { SecurityIssue, BaseSecurityCheck } from "../types"

interface Dependency {
  name: string
  version: string
  isOutdated: boolean
  hasVulnerabilities: boolean
  severity: "low" | "medium" | "high" | "critical" | "none"
  directDependency: boolean
}

interface DependencyAnalysis extends BaseSecurityCheck {
  details: {
    dependencies: Dependency[]
    score: number
    issues: SecurityIssue[]
    recommendations: string[]
    implementation: {
      hasAudit: boolean
      hasLockfile: boolean
      hasPinned: boolean
      location: string[]
      coverage: number
    }
    security: {
      totalDependencies: number
      outdatedDependencies: number
      vulnerableDependencies: number
      criticalVulnerabilities: number
    }
    configuration: {
      hasNpmrc: boolean
      hasGitHubActions: boolean
      hasDependabot: boolean
      hasSnyk: boolean
    }
    vulnerabilities: {
      outdatedPackages: string[]
      vulnerablePackages: string[]
      unpinnedVersions: string[]
    }
  }
}

interface PackageLockDependency {
  requires?: Record<string, string>
  version?: string
}

export async function GET() {
  try {
    const analysis: DependencyAnalysis = {
      implemented: false,
      details: {
        dependencies: [],
        score: 0,
        issues: [],
        recommendations: [],
        implementation: {
          hasAudit: false,
          hasLockfile: false,
          hasPinned: false,
          location: [],
          coverage: 0,
        },
        security: {
          totalDependencies: 0,
          outdatedDependencies: 0,
          vulnerableDependencies: 0,
          criticalVulnerabilities: 0,
        },
        configuration: {
          hasNpmrc: false,
          hasGitHubActions: false,
          hasDependabot: false,
          hasSnyk: false,
        },
        vulnerabilities: {
          outdatedPackages: [],
          vulnerablePackages: [],
          unpinnedVersions: [],
        },
      },
    }

    // Check package.json and package-lock.json
    const packageJsonPath = path.join(process.cwd(), "package.json")
    const packageLockPath = path.join(process.cwd(), "package-lock.json")

    if (!fs.existsSync(packageJsonPath)) {
      analysis.details.issues.push({
        message: "package.json not found",
        severity: "critical",
        solution: {
          description: "Create a package.json file to manage dependencies",
          steps: [
            "Run npm init to create a new package.json",
            "Add required dependencies",
            "Configure scripts and metadata",
          ],
          fileReferences: ["package.json"],
          docsUrl: "https://docs.npmjs.com/cli/v8/commands/npm-init",
        },
      })
    } else {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
      const dependencies = { ...packageJson.dependencies }
      const devDependencies = { ...packageJson.devDependencies }

      analysis.details.security.totalDependencies =
        Object.keys(dependencies).length + Object.keys(devDependencies).length

      // Check for pinned versions
      let allPinned = true

      function checkDependencies(deps: Record<string, string>, isDev: boolean) {
        for (const [name, version] of Object.entries(deps)) {
          const dependency: Dependency = {
            name,
            version,
            isOutdated: false,
            hasVulnerabilities: false,
            severity: "none",
            directDependency: true,
          }

          // Check if version is pinned
          if (version.startsWith("^") || version.startsWith("~")) {
            allPinned = false
            analysis.details.vulnerabilities.unpinnedVersions.push(name)
          }

          analysis.details.dependencies.push(dependency)
        }
      }

      checkDependencies(dependencies, false)
      checkDependencies(devDependencies, true)

      analysis.details.implementation.hasPinned = allPinned

      if (!allPinned) {
        analysis.details.issues.push({
          message: "Unpinned dependency versions found",
          severity: "warning",
          solution: {
            description:
              "Pin dependency versions to specific numbers for better security and reproducibility",
            steps: [
              "Remove ^ and ~ from version numbers in package.json",
              "Update to specific versions",
              "Run npm install to update package-lock.json",
            ],
            codeExample: `{
  "dependencies": {
    "react": "18.2.0",     // ✅ Pinned version
    "next": "^14.0.0"      // ❌ Unpinned version
  }
}`,
            fileReferences: ["package.json", "package-lock.json"],
          },
        })
      }
    }

    // Check for package-lock.json
    if (!fs.existsSync(packageLockPath)) {
      analysis.details.issues.push({
        message: "package-lock.json not found",
        severity: "critical",
        solution: {
          description: "Generate package-lock.json to lock dependency versions",
          steps: [
            "Delete node_modules directory",
            "Delete any existing package-lock.json",
            "Run npm install to generate a new package-lock.json",
          ],
          fileReferences: ["package-lock.json"],
          docsUrl:
            "https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json",
        },
      })
    } else {
      analysis.details.implementation.hasLockfile = true
      analysis.details.implementation.location.push("package-lock.json")

      const packageLock = JSON.parse(fs.readFileSync(packageLockPath, "utf8"))

      // Check for vulnerabilities in dependencies
      function checkVulnerabilities(
        deps: Record<string, PackageLockDependency>
      ) {
        for (const [name, info] of Object.entries(deps)) {
          const dep = analysis.details.dependencies.find((d) => d.name === name)
          if (dep) {
            if (info.requires && Object.keys(info.requires).length > 0) {
              const outdatedDeps = Object.entries(info.requires).filter(
                ([_, version]: [string, any]) =>
                  version.startsWith("^") || version.startsWith("~")
              )
              if (outdatedDeps.length > 0) {
                dep.isOutdated = true
                analysis.details.security.outdatedDependencies++
                analysis.details.vulnerabilities.outdatedPackages.push(name)
              }
            }
          }
        }
      }

      if (packageLock.dependencies) {
        checkVulnerabilities(packageLock.dependencies)
      }
    }

    // Check for .npmrc configuration
    const npmrcPath = path.join(process.cwd(), ".npmrc")
    if (!fs.existsSync(npmrcPath)) {
      analysis.details.issues.push({
        message: "No .npmrc configuration found",
        severity: "info",
        solution: {
          description: "Configure .npmrc for better security settings",
          steps: [
            "Create .npmrc file in project root",
            "Configure audit settings",
            "Set strict-ssl=true",
            "Configure registry settings if needed",
          ],
          codeExample: `audit=true
audit-level=high
strict-ssl=true
save-exact=true`,
          fileReferences: [".npmrc"],
        },
      })
    } else {
      analysis.details.configuration.hasNpmrc = true
      analysis.details.implementation.location.push(".npmrc")
    }

    // Check for GitHub Actions security scanning
    const githubActionsPath = path.join(process.cwd(), ".github/workflows")
    if (fs.existsSync(githubActionsPath)) {
      const files = fs.readdirSync(githubActionsPath)
      for (const file of files) {
        if (file.endsWith(".yml") || file.endsWith(".yaml")) {
          const content = fs.readFileSync(
            path.join(githubActionsPath, file),
            "utf8"
          )
          if (
            content.includes("security") ||
            content.includes("codeql") ||
            content.includes("snyk")
          ) {
            analysis.details.configuration.hasGitHubActions = true
            analysis.details.implementation.location.push(
              `.github/workflows/${file}`
            )
            break
          }
        }
      }
    }

    // Check for Dependabot configuration
    const dependabotPath = path.join(process.cwd(), ".github/dependabot.yml")
    if (fs.existsSync(dependabotPath)) {
      analysis.details.configuration.hasDependabot = true
      analysis.details.implementation.location.push(".github/dependabot.yml")
    }

    // Check for Snyk configuration
    const snykPaths = [".snyk", "snyk.config.json"]
    for (const snykPath of snykPaths) {
      const fullPath = path.join(process.cwd(), snykPath)
      if (fs.existsSync(fullPath)) {
        analysis.details.configuration.hasSnyk = true
        analysis.details.implementation.location.push(snykPath)
        break
      }
    }

    // Check npm audit log if it exists
    const auditLogPath = path.join(process.cwd(), "npm-audit.json")
    if (fs.existsSync(auditLogPath)) {
      analysis.details.implementation.hasAudit = true
      const auditLog = JSON.parse(fs.readFileSync(auditLogPath, "utf8"))

      if (auditLog.vulnerabilities) {
        for (const [name, vuln] of Object.entries(auditLog.vulnerabilities)) {
          const dep = analysis.details.dependencies.find((d) => d.name === name)
          if (dep) {
            dep.hasVulnerabilities = true
            dep.severity = (vuln as any).severity || "low"

            analysis.details.security.vulnerableDependencies++
            analysis.details.vulnerabilities.vulnerablePackages.push(name)

            if (dep.severity === "critical") {
              analysis.details.security.criticalVulnerabilities++
            }
          }
        }
      }
    }

    // Calculate implementation coverage
    analysis.details.implementation.coverage =
      ([
        analysis.details.implementation.hasLockfile,
        analysis.details.implementation.hasPinned,
        analysis.details.configuration.hasNpmrc,
      ].filter(Boolean).length /
        3) *
      100

    // Calculate overall score
    const implementationScore = analysis.details.implementation.coverage
    const securityScore = Math.max(
      0,
      100 -
        analysis.details.security.vulnerableDependencies * 10 -
        analysis.details.security.criticalVulnerabilities * 20
    )

    analysis.details.score = Math.round(
      (implementationScore + securityScore) / 2
    )

    // Set implementation status
    analysis.implemented =
      analysis.details.score >= 80 &&
      analysis.details.implementation.hasLockfile &&
      analysis.details.implementation.hasPinned &&
      analysis.details.security.criticalVulnerabilities === 0

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error checking dependency security:", error)
    return NextResponse.json(
      {
        implemented: false,
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          issues: [
            {
              message: "Error checking dependency security",
              severity: "critical",
              solution: {
                description: "An error occurred while analyzing dependencies",
                steps: [
                  "Check file permissions",
                  "Verify package.json is valid JSON",
                  "Ensure npm is installed and working",
                  "Try running npm install",
                ],
                fileReferences: ["package.json", "package-lock.json"],
              },
            },
          ],
        },
      },
      { status: 500 }
    )
  }
}

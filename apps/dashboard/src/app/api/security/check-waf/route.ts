/* eslint-disable */

import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"

interface WAFRule {
  type: string
  pattern: string
  action: string
  severity: "low" | "medium" | "high"
}

interface WAFProvider {
  name: "cloudflare" | "aws" | "azure" | "custom"
  configured: boolean
  rules: WAFRule[]
}

interface WAFAnalysis {
  implemented: boolean
  details: {
    providers: WAFProvider[]
    score: number
    issues: string[]
    recommendations: string[]
    implementation: {
      type: string
      location: string[]
      coverage: number
    }
    protection: {
      ddos: boolean
      xss: boolean
      injection: boolean
      rateLimit: boolean
      customRules: boolean
    }
    configuration: {
      hasConfig: boolean
      hasRules: boolean
      hasLogging: boolean
      hasAlerts: boolean
    }
    vulnerabilities: {
      unprotectedRoutes: string[]
      missingRules: string[]
      configIssues: string[]
    }
  }
}

export async function GET() {
  try {
    const analysis: WAFAnalysis = {
      implemented: false,
      details: {
        providers: [],
        score: 0,
        issues: [],
        recommendations: [],
        implementation: {
          type: "none",
          location: [],
          coverage: 0,
        },
        protection: {
          ddos: false,
          xss: false,
          injection: false,
          rateLimit: false,
          customRules: false,
        },
        configuration: {
          hasConfig: false,
          hasRules: false,
          hasLogging: false,
          hasAlerts: false,
        },
        vulnerabilities: {
          unprotectedRoutes: [],
          missingRules: [],
          configIssues: [],
        },
      },
    }

    // Check for Cloudflare WAF
    const cloudflareConfig = path.join(process.cwd(), "cloudflare.config.json")
    if (fs.existsSync(cloudflareConfig)) {
      const config = JSON.parse(fs.readFileSync(cloudflareConfig, "utf8"))
      const provider: WAFProvider = {
        name: "cloudflare",
        configured: false,
        rules: [],
      }

      if (config.waf || config.firewall) {
        provider.configured = true
        analysis.details.implementation.type = "cloudflare"
        analysis.details.implementation.location.push("cloudflare.config.json")

        // Check for specific protections
        if (config.ddos || config.ddosProtection) {
          analysis.details.protection.ddos = true
        }
        if (config.xss || config.crossSiteScripting) {
          analysis.details.protection.xss = true
        }
        if (config.injection || config.sqlInjection) {
          analysis.details.protection.injection = true
        }
        if (config.rateLimit || config.rateLimiting) {
          analysis.details.protection.rateLimit = true
        }

        // Extract rules
        const rules = config.rules || config.firewallRules || []
        provider.rules = rules.map((rule: any) => ({
          type: rule.type || "custom",
          pattern: rule.pattern || "",
          action: rule.action || "block",
          severity: rule.severity || "medium",
        }))
      }

      analysis.details.providers.push(provider)
    }

    // Check for AWS WAF
    const awsConfig = path.join(process.cwd(), "aws-waf.json")
    if (fs.existsSync(awsConfig)) {
      const config = JSON.parse(fs.readFileSync(awsConfig, "utf8"))
      const provider: WAFProvider = {
        name: "aws",
        configured: false,
        rules: [],
      }

      if (config.WebACL || config.Rules) {
        provider.configured = true
        analysis.details.implementation.type = "aws"
        analysis.details.implementation.location.push("aws-waf.json")

        // Extract rules from AWS config
        const rules = config.Rules || []
        provider.rules = rules.map((rule: any) => ({
          type: rule.Type || "custom",
          pattern: rule.Pattern || "",
          action: rule.Action || "block",
          severity: rule.Severity || "medium",
        }))
      }

      analysis.details.providers.push(provider)
    }

    // Check for Azure WAF
    const azureConfig = path.join(process.cwd(), "azure-waf.json")
    if (fs.existsSync(azureConfig)) {
      const config = JSON.parse(fs.readFileSync(azureConfig, "utf8"))
      const provider: WAFProvider = {
        name: "azure",
        configured: false,
        rules: [],
      }

      if (config.applicationGateway?.webApplicationFirewall) {
        provider.configured = true
        analysis.details.implementation.type = "azure"
        analysis.details.implementation.location.push("azure-waf.json")

        // Extract rules from Azure config
        const rules =
          config.applicationGateway?.webApplicationFirewall?.rules || []
        provider.rules = rules.map((rule: any) => ({
          type: rule.ruleType || "custom",
          pattern: rule.pattern || "",
          action: rule.action || "block",
          severity: rule.severity || "medium",
        }))
      }

      analysis.details.providers.push(provider)
    }

    // Check for custom WAF implementation
    const middlewarePath = path.join(process.cwd(), "src/middleware.ts")
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, "utf8")
      if (
        content.includes("waf") ||
        content.includes("firewall") ||
        content.includes("security")
      ) {
        const provider: WAFProvider = {
          name: "custom",
          configured: true,
          rules: [],
        }

        analysis.details.implementation.type = "custom"
        analysis.details.implementation.location.push("src/middleware.ts")
        analysis.details.protection.customRules = true

        analysis.details.providers.push(provider)
      }
    }

    // Check for logging configuration
    const loggingPaths = [
      "src/lib/logging.ts",
      "src/utils/logging.ts",
      "src/config/logging.ts",
    ]

    for (const logPath of loggingPaths) {
      const fullPath = path.join(process.cwd(), logPath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf8")
        if (
          content.includes("waf") ||
          content.includes("firewall") ||
          content.includes("security")
        ) {
          analysis.details.configuration.hasLogging = true
          break
        }
      }
    }

    // Check for monitoring/alerts configuration
    const monitoringPaths = [
      "src/lib/monitoring.ts",
      "src/utils/monitoring.ts",
      "src/config/monitoring.ts",
    ]

    for (const monitorPath of monitoringPaths) {
      const fullPath = path.join(process.cwd(), monitorPath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf8")
        if (
          content.includes("alert") ||
          content.includes("notification") ||
          content.includes("monitor")
        ) {
          analysis.details.configuration.hasAlerts = true
          break
        }
      }
    }

    // Calculate configuration status
    analysis.details.configuration.hasConfig = analysis.details.providers.some(
      (p) => p.configured
    )
    analysis.details.configuration.hasRules = analysis.details.providers.some(
      (p) => p.rules.length > 0
    )

    // Calculate coverage
    const configuredProviders = analysis.details.providers.filter(
      (p) => p.configured
    ).length
    analysis.details.implementation.coverage =
      (configuredProviders / Math.max(analysis.details.providers.length, 1)) *
      100

    // Calculate score based on multiple factors
    const baseScore = analysis.details.implementation.coverage
    const protectionScore =
      Object.values(analysis.details.protection).filter(Boolean).length * 20
    const configScore =
      Object.values(analysis.details.configuration).filter(Boolean).length * 25

    analysis.details.score = Math.min(
      100,
      Math.round((baseScore + protectionScore + configScore) / 3)
    )

    // Generate recommendations
    if (!analysis.details.configuration.hasConfig) {
      analysis.details.recommendations.push(
        "Configure a WAF provider (Cloudflare, AWS WAF, or Azure WAF)"
      )
      analysis.details.issues.push("No WAF configuration found")
    }

    if (!analysis.details.protection.ddos) {
      analysis.details.recommendations.push("Enable DDoS protection")
      analysis.details.issues.push("DDoS protection not configured")
    }

    if (!analysis.details.protection.xss) {
      analysis.details.recommendations.push("Enable XSS protection rules")
      analysis.details.issues.push("XSS protection not configured")
    }

    if (!analysis.details.protection.injection) {
      analysis.details.recommendations.push("Enable injection protection rules")
      analysis.details.issues.push("Injection protection not configured")
    }

    if (!analysis.details.configuration.hasLogging) {
      analysis.details.recommendations.push("Configure WAF logging")
      analysis.details.issues.push("WAF logging not configured")
    }

    if (!analysis.details.configuration.hasAlerts) {
      analysis.details.recommendations.push("Set up WAF security alerts")
      analysis.details.issues.push("WAF alerts not configured")
    }

    // Set implementation status
    analysis.implemented =
      analysis.details.score >= 80 &&
      analysis.details.configuration.hasConfig &&
      analysis.details.configuration.hasRules &&
      analysis.details.protection.ddos &&
      analysis.details.protection.xss &&
      analysis.details.protection.injection

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error checking WAF implementation:", error)
    return NextResponse.json(
      {
        implemented: false,
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    )
  }
}

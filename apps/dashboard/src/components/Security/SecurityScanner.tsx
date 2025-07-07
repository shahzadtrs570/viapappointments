/* eslint-disable */

import { useEffect, useState, useMemo } from "react"

import { cn } from "@package/utils"
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Database,
  FileCode,
  Globe,
  Lock,
  Shield,
  XCircle,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Loader,
  ArrowLeft,
  ChevronDown,
  Download,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Button } from "@package/ui/button"
import { Badge } from "@package/ui/badge"
import { Progress } from "@package/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"
import { Alert, AlertDescription } from "@package/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@package/ui/accordion"

import { SecurityCheckDetail } from "./SecurityCheckDetail"

interface SecurityCheck {
  id: string
  name: string
  description: string
  status: "success" | "warning" | "error" | "scanning"
  details: string
  category:
    | "Authentication"
    | "Input Security"
    | "Network Security"
    | "Infrastructure"
    | "Monitoring"
    | "General"
  priority: "high" | "medium" | "low"
  implementationPath?: string
  recommendations?: string[]
  type: string
  endpoint: string
  data?: any // Add data property to store full response
}

async function scanSecurity(): Promise<SecurityCheck[]> {
  const checks: SecurityCheck[] = []

  try {
    // Authentication Checks
    const authResponse = await fetch("/api/security/check-auth")
    const authData = await authResponse.json()
    checks.push({
      id: "auth-implementation",
      name: "Authentication Framework",
      description: "Verify Auth.js/NextAuth implementation",
      category: "Authentication",
      priority: "high",
      status: authData ? "success" : "error",
      details: authData
        ? "Auth.js is properly implemented"
        : "Auth.js implementation is missing or incomplete",
      implementationPath: "packages/auth",
      type: "auth",
      endpoint: "/api/security/check-auth",
    })

    // CAPTCHA Check
    const captchaResponse = await fetch("/api/security/check-captcha")
    const captchaData = await captchaResponse.json()
    checks.push({
      id: "captcha",
      name: "CAPTCHA Protection",
      description: "Check CAPTCHA implementation in auth forms",
      category: "Input Security",
      priority: "high",
      status: captchaData.implemented ? "success" : "error",
      details: captchaData.implemented
        ? "CAPTCHA is properly implemented"
        : "CAPTCHA protection is missing",
      recommendations: !captchaData.implemented
        ? [
            "Implement reCAPTCHA or hCaptcha",
            "Add CAPTCHA to login and registration forms",
          ]
        : undefined,
      type: "captcha",
      endpoint: "/api/security/check-captcha",
    })

    // Rate Limiting Check
    const rateLimitResponse = await fetch("/api/security/check-rate-limit")
    const rateLimitData = await rateLimitResponse.json()
    checks.push({
      id: "rate-limiting",
      name: "Rate Limiting",
      description: "Check API rate limiting implementation",
      category: "Network Security",
      priority: "high",
      status: rateLimitData ? "success" : "error",
      details: rateLimitData
        ? "Rate limiting is properly implemented"
        : "Rate limiting is not implemented",
      recommendations: !rateLimitData
        ? [
            "Implement rate limiting using @upstash/ratelimit",
            "Add rate limiting to sensitive endpoints",
          ]
        : undefined,
      type: "api",
      endpoint: "/api/security/check-rate-limit",
    })

    // Security Headers Check
    const headersResponse = await fetch("/api/security/check-headers")
    const headersData = await headersResponse.json()
    checks.push({
      id: "security-headers",
      name: "Security Headers",
      description: "Verify secure HTTP headers implementation",
      category: "Network Security",
      priority: "high",
      status: headersData.implemented ? "success" : "error",
      details: headersData.implemented
        ? `Implemented headers: ${headersData.details.implementedHeaders.join(", ")}`
        : "Security headers are not properly configured",
      recommendations: headersData.details.missingHeaders.map(
        (header: string) => `Implement ${header} header`
      ),
      type: "headers",
      endpoint: "/api/security/check-headers",
    })

    // Input Validation Check
    const validationResponse = await fetch("/api/security/check-validation")
    const validationData = await validationResponse.json()
    checks.push({
      id: "input-validation",
      name: "Input Validation & Sanitization",
      description: "Check input validation and sanitization",
      category: "Input Security",
      priority: "high",
      status: validationData.implemented ? "success" : "error",
      details: `Validation score: ${validationData.details.score}%`,
      recommendations: validationData.details.recommendations,
      type: "validation",
      endpoint: "/api/security/check-validation",
    })

    // Database Security Check
    const rlsResponse = await fetch("/api/security/check-rls")
    const rlsData = await rlsResponse.json()
    checks.push({
      id: "rls",
      name: "Row-Level Security",
      description: "Verify Row-Level Security implementation",
      category: "Infrastructure",
      priority: "high",
      status: rlsData ? "success" : "error",
      details: rlsData
        ? "Row-Level Security is properly configured"
        : "Row-Level Security is not implemented",
      implementationPath: "packages/db/prisma/schema.prisma",
      type: "data",
      endpoint: "/api/security/check-rls",
    })

    // WAF Protection Check
    const wafResponse = await fetch("/api/security/check-waf")
    const wafData = await wafResponse.json()
    checks.push({
      id: "waf-protection",
      name: "Web Application Firewall",
      description: "Verify WAF protection status",
      category: "Network Security",
      priority: "high",
      status: wafData.implemented ? "success" : "error",
      details: wafData.implemented
        ? "WAF protection is active"
        : "WAF protection is not configured",
      recommendations: !wafData.implemented
        ? [
            "Enable WAF in Vercel Settings → Security",
            "Enable Attack Challenge on all routes",
            "Configure WAF rules for your application",
          ]
        : undefined,
      type: "api",
      endpoint: "/api/security/check-waf",
    })

    // Dependency Security Check
    const depsResponse = await fetch("/api/security/check-dependencies")
    const depsData = await depsResponse.json()
    checks.push({
      id: "dependency-security",
      name: "Dependencies Audit",
      description: "Check for vulnerable or outdated dependencies",
      category: "Infrastructure",
      priority: "high",
      status:
        depsData.status === "clean"
          ? "success"
          : depsData.status === "warnings"
            ? "warning"
            : "error",
      details: `${depsData.total} dependencies analyzed, ${depsData.vulnerable} with known vulnerabilities`,
      recommendations: depsData.recommendations,
      type: "dependencies",
      endpoint: "/api/security/check-dependencies",
    })

    // Secrets Management Check
    const secretsResponse = await fetch("/api/security/check-secrets")
    const secretsData = await secretsResponse.json()
    checks.push({
      id: "secrets-management",
      name: "Secrets Management",
      description: "Verify proper handling of sensitive information",
      category: "Infrastructure",
      priority: "high",
      status: secretsData.exposed ? "error" : "success",
      details: secretsData.exposed
        ? "Potential exposure of sensitive information detected"
        : "No exposed secrets detected",
      recommendations: secretsData.exposed
        ? [
            "Move sensitive information to environment variables",
            "Ensure .env files are in .gitignore",
            "Review client-side code for exposed secrets",
            "Implement secret rotation policy",
          ]
        : undefined,
      type: "dependencies",
      endpoint: "/api/security/check-secrets",
    })

    // Security Monitoring Check
    const monitoringResponse = await fetch("/api/security/check-monitoring")
    const monitoringData = await monitoringResponse.json()
    checks.push({
      id: "security-monitoring",
      name: "Security Monitoring",
      description: "Verify security monitoring and logging implementation",
      category: "Monitoring",
      priority: "high",
      status: monitoringData.implemented ? "success" : "warning",
      details: monitoringData.implemented
        ? `Monitoring configured: ${monitoringData.details.enabledSystems.join(", ")}`
        : "Security monitoring needs improvement",
      recommendations: !monitoringData.implemented
        ? [
            "Implement comprehensive activity logging",
            "Set up alerts for suspicious patterns",
            "Monitor failed login attempts",
            "Track unusual traffic spikes",
            "Enable audit logging for sensitive operations",
          ]
        : undefined,
      type: "monitoring",
      endpoint: "/api/security/check-monitoring",
    })

    // RBAC Check
    const rbacResponse = await fetch("/api/security/check-rbac")
    const rbacData = await rbacResponse.json()
    checks.push({
      id: "rbac",
      name: "Role-Based Access Control",
      description: "Verify RBAC implementation for user permissions",
      category: "Authentication",
      priority: "high",
      status: rbacData.implemented ? "success" : "error",
      details: rbacData.implemented
        ? `RBAC implemented with roles: ${rbacData.details.roles.join(", ")}`
        : "Role-Based Access Control is not implemented",
      recommendations: !rbacData.implemented
        ? [
            "Define clear user roles (admin, user, guest)",
            "Implement role-based middleware",
            "Add role checks to sensitive endpoints",
            "Create role management interface",
            "Document role permissions",
          ]
        : undefined,
      type: "auth",
      endpoint: "/api/security/check-rbac",
    })

    // Server-Side Validation Check
    const serverValidationResponse = await fetch(
      "/api/security/check-server-validation"
    )
    const serverValidationData = await serverValidationResponse.json()
    checks.push({
      id: "server-validation",
      name: "Server-Side Validation",
      description: "Verify comprehensive server-side validation",
      category: "Network Security",
      priority: "high",
      status: serverValidationData.implemented ? "success" : "error",
      details: serverValidationData.implemented
        ? `Validation coverage: ${serverValidationData.details.coverage}%`
        : "Server-side validation needs improvement",
      recommendations: !serverValidationData.implemented
        ? [
            "Implement input validation for all API endpoints",
            "Add payload size limits",
            "Validate file uploads",
            "Sanitize user inputs",
            "Implement type checking and validation",
          ]
        : undefined,
      type: "api",
      endpoint: "/api/security/check-server-validation",
    })

    // Hosting Security Check
    const hostingResponse = await fetch("/api/security/check-hosting")
    const hostingData = await hostingResponse.json()
    checks.push({
      id: "hosting-security",
      name: "Hosting Platform Security",
      description: "Verify hosting platform security features",
      category: "General",
      priority: "high",
      status: hostingData.implemented ? "success" : "warning",
      details: hostingData.implemented
        ? `Platform: ${hostingData.details.platform} with security features enabled`
        : "Hosting security features need configuration",
      recommendations: !hostingData.implemented
        ? [
            "Use managed hosting platform (Vercel/AWS/GCP)",
            "Enable DDoS protection",
            "Configure automatic SSL/TLS",
            "Set up proper CI/CD security",
            "Enable automated backups",
          ]
        : undefined,
      type: "hosting",
      endpoint: "/api/security/check-hosting",
    })

    // File Upload Security Check
    const uploadResponse = await fetch("/api/security/check-upload-security")
    const uploadData = await uploadResponse.json()
    checks.push({
      id: "file-upload-security",
      name: "File Upload Security",
      description: "Verify secure file upload implementation",
      category: "General",
      priority: "high",
      status: uploadData.implemented ? "success" : "error",
      details: uploadData.implemented
        ? "File upload security measures are in place"
        : "File upload security needs improvement",
      recommendations: !uploadData.implemented
        ? [
            "Implement file type validation",
            "Add file size limits",
            "Use secure storage (e.g., S3 with proper permissions)",
            "Scan uploads for malware",
            "Implement proper file access controls",
          ]
        : undefined,
      type: "upload",
      endpoint: "/api/security/check-upload-security",
    })

    // Backup System Check
    const backupResponse = await fetch("/api/security/check-backup")
    const backupData = await backupResponse.json()
    checks.push({
      id: "backup-system",
      name: "Backup Systems",
      description: "Verify data backup and recovery systems",
      category: "Monitoring",
      priority: "high",
      status: backupData.implemented ? "success" : "warning",
      details: backupData.implemented
        ? `Backup system: ${backupData.details.system} with ${backupData.details.frequency} frequency`
        : "Backup system needs configuration",
      recommendations: !backupData.implemented
        ? [
            "Implement automated backups",
            "Set up regular backup testing",
            "Configure offsite backup storage",
            "Document recovery procedures",
            "Implement point-in-time recovery",
          ]
        : undefined,
      type: "backup",
      endpoint: "/api/security/check-backup",
    })

    // Microservices Security Check
    const microservicesResponse = await fetch(
      "/api/security/check-microservices"
    )
    const microservicesData = await microservicesResponse.json()
    checks.push({
      id: "microservices-security",
      name: "Microservices Security",
      description: "Verify security between microservices",
      category: "Network Security",
      priority: "high",
      status: microservicesData.implemented ? "success" : "warning",
      details: microservicesData.implemented
        ? "Microservices security measures are in place"
        : "Microservices security needs improvement",
      recommendations: !microservicesData.implemented
        ? [
            "Implement service-to-service authentication",
            "Set up API gateways",
            "Use secure service mesh",
            "Enable service-level monitoring",
            "Implement circuit breakers",
          ]
        : undefined,
      type: "api",
      endpoint: "/api/security/check-microservices",
    })
  } catch (error) {
    console.error("Error during security scan:", error)
  }

  return checks
}

// Helper functions for security check processing
function getCheckDescription(name: string): string {
  const descriptions: Record<string, string> = {
    "Authentication Framework":
      "Evaluates the implementation of authentication mechanisms",
    "CAPTCHA Protection": "Checks CAPTCHA implementation for form protection",
    "Rate Limiting": "Verifies rate limiting configuration for API endpoints",
    "Security Headers": "Analyzes HTTP security headers configuration",
    "Input Validation": "Reviews input validation and sanitization practices",
    "Row-Level Security": "Assesses database row-level security implementation",
    "Web Application Firewall": "Checks WAF configuration and rules",
    "Dependencies Audit": "Scans for vulnerable dependencies",
    "Secrets Management": "Reviews secrets handling and storage",
    "Security Monitoring": "Evaluates security monitoring and logging",
    "Role-Based Access Control": "Analyzes RBAC implementation",
    "Server-Side Validation": "Checks server-side validation practices",
    "Hosting Security": "Reviews hosting environment security",
    "File Upload Security": "Assesses file upload security measures",
    "Backup Systems": "Evaluates backup and recovery systems",
    "Microservices Security": "Reviews microservices security configuration",
  }
  return descriptions[name] || "Performs security analysis"
}

function getCheckCategory(endpoint: string): string {
  if (endpoint.includes("auth") || endpoint.includes("rbac"))
    return "Authentication"
  if (endpoint.includes("validation") || endpoint.includes("captcha"))
    return "Input Security"
  if (endpoint.includes("headers") || endpoint.includes("waf"))
    return "Network Security"
  if (endpoint.includes("dependencies") || endpoint.includes("secrets"))
    return "Infrastructure"
  if (endpoint.includes("monitoring") || endpoint.includes("backup"))
    return "Monitoring"
  return "General"
}

function getCheckPriority(name: string): "high" | "medium" | "low" {
  const highPriority = [
    "Authentication Framework",
    "Security Headers",
    "Input Validation",
    "Secrets Management",
  ]
  const mediumPriority = [
    "CAPTCHA Protection",
    "Rate Limiting",
    "Dependencies Audit",
    "Role-Based Access Control",
  ]

  if (highPriority.includes(name)) return "high"
  if (mediumPriority.includes(name)) return "medium"
  return "low"
}

function getCheckDetails(data: any): string {
  if (!data) return "No details available"
  if (data.details?.description) return data.details.description
  if (data.message) return data.message
  return "Check completed"
}

export function SecurityScanner() {
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [currentCheck, setCurrentCheck] = useState("")
  const [activeCategory, setActiveCategory] = useState<
    SecurityCheck["category"] | "all"
  >("all")
  const [selectedCheck, setSelectedCheck] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, any>>({})
  const [scanning, setScanning] = useState(false)

  // Define security check endpoints
  const securityEndpoints = [
    { name: "Authentication Framework", endpoint: "/api/security/check-auth" },
    { name: "CAPTCHA Protection", endpoint: "/api/security/check-captcha" },
    { name: "Rate Limiting", endpoint: "/api/security/check-rate-limit" },
    { name: "Security Headers", endpoint: "/api/security/check-headers" },
    { name: "Input Validation", endpoint: "/api/security/check-validation" },
    { name: "Row-Level Security", endpoint: "/api/security/check-rls" },
    { name: "Web Application Firewall", endpoint: "/api/security/check-waf" },
    {
      name: "Dependencies Audit",
      endpoint: "/api/security/check-dependencies",
    },
    { name: "Secrets Management", endpoint: "/api/security/check-secrets" },
    { name: "Security Monitoring", endpoint: "/api/security/check-monitoring" },
    { name: "Role-Based Access Control", endpoint: "/api/security/check-rbac" },
    {
      name: "Server-Side Validation",
      endpoint: "/api/security/check-server-validation",
    },
    { name: "Hosting Security", endpoint: "/api/security/check-hosting" },
    {
      name: "File Upload Security",
      endpoint: "/api/security/check-upload-security",
    },
    { name: "Backup Systems", endpoint: "/api/security/check-backup" },
    {
      name: "Microservices Security",
      endpoint: "/api/security/check-microservices",
    },
  ]

  const runSecurityScan = async () => {
    setIsScanning(true)
    setScanProgress(0)
    setCurrentCheck("Initializing security scan...")
    const checks: SecurityCheck[] = []

    try {
      // Run security checks sequentially to show progress
      for (let i = 0; i < securityEndpoints.length; i++) {
        const { name, endpoint } = securityEndpoints[i]

        // Update current check being performed
        setCurrentCheck(`Checking ${name}...`)
        setScanProgress((i / securityEndpoints.length) * 100)

        try {
          console.log(`🔍 Calling API: ${endpoint}`)
          const response = await fetch(endpoint)
          const data = await response.json()

          // Process the check result and add to checks array
          const check: SecurityCheck = {
            id: endpoint.split("/").pop() || "",
            name,
            description: getCheckDescription(name),
            status: data.implemented
              ? ("success" as const)
              : data.details?.score >= 50
                ? ("warning" as const)
                : ("error" as const),
            details: getCheckDetails(data),
            category: getCheckCategory(endpoint) as SecurityCheck["category"],
            priority: getCheckPriority(name) as SecurityCheck["priority"],
            type: endpoint.split("/").pop() || "",
            endpoint,
            recommendations:
              data.details?.recommendations || data.recommendations || [],
            implementationPath:
              data.details?.implementationPath || data.implementationPath,
            data, // Store full response data
          }

          // Store full response data in results
          setResults((prev) => ({
            ...prev,
            [check.type]: {
              ...data,
              details: {
                ...data.details,
                issues: data.details?.issues || data.issues || [],
                recommendations:
                  data.details?.recommendations || data.recommendations || [],
              },
            },
          }))

          checks.push(check)

          // Show completion status
          setCurrentCheck(`✅ Completed ${name}`)

          // Small delay to show the completion status
          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          console.error(`❌ Error checking ${name}:`, error)

          const errorCheck: SecurityCheck = {
            id: endpoint.split("/").pop() || "",
            name,
            description: getCheckDescription(name),
            status: "error" as const,
            details: "Failed to perform security check",
            category: getCheckCategory(endpoint) as SecurityCheck["category"],
            priority: getCheckPriority(name) as SecurityCheck["priority"],
            type: endpoint.split("/").pop() || "",
            endpoint,
          }

          checks.push(errorCheck)
          setCurrentCheck(`❌ Failed ${name}`)

          // Small delay to show the error status
          await new Promise((resolve) => setTimeout(resolve, 200))
        }

        // Update progress after each check
        setScanProgress(((i + 1) / securityEndpoints.length) * 100)
      }

      setSecurityChecks(checks)
      setCurrentCheck("🎉 Security scan completed!")

      // Clear the completion message after a moment
      setTimeout(() => {
        setCurrentCheck("")
      }, 2000)
    } catch (error) {
      console.error("Error during security scan:", error)
      setCurrentCheck("❌ Security scan failed")
    } finally {
      setIsScanning(false)
    }
  }

  const categories = [
    { value: "all" as const, label: "All Checks", icon: AlertCircle },
    { value: "Authentication" as const, label: "Authentication", icon: Lock },
    {
      value: "Input Security" as const,
      label: "Input Security",
      icon: AlertCircle,
    },
    {
      value: "Network Security" as const,
      label: "Network Security",
      icon: Globe,
    },
    {
      value: "Infrastructure" as const,
      label: "Infrastructure",
      icon: Database,
    },
    { value: "Monitoring" as const, label: "Monitoring", icon: Bell },
  ]

  const filteredChecks = useMemo(() => {
    return securityChecks.filter(
      (check) => activeCategory === "all" || check.category === activeCategory
    )
  }, [securityChecks, activeCategory])

  const getStatusIcon = (status: SecurityCheck["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="size-5 text-green-500" />
      case "warning":
        return <AlertCircle className="size-5 text-yellow-500" />
      case "error":
        return <XCircle className="size-5 text-red-500" />
      case "scanning":
        return (
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )
    }
  }

  const stats = {
    total: securityChecks.length,
    implemented: securityChecks.filter((check) => check.status === "success")
      .length,
    warnings: securityChecks.filter((check) => check.status === "warning")
      .length,
    critical: securityChecks.filter(
      (check) => check.status === "error" && check.priority === "high"
    ).length,
  }

  const handleViewDetails = async (checkType: string) => {
    // Find the check that matches this type
    const check = securityChecks.find((c) => c.type === checkType)
    if (check) {
      setScanning(true)
      try {
        const response = await fetch(check.endpoint)
        const data = await response.json()
        setResults((prev) => ({
          ...prev,
          [check.type]: data,
        }))
      } catch (error) {
        console.error(`Error running ${check.name} check:`, error)
        setResults((prev) => ({
          ...prev,
          [check.type]: { implemented: false, error: "Failed to run check" },
        }))
      } finally {
        setScanning(false)
      }
    }
    setSelectedCheck(checkType)
  }

  const getOverallScore = () => {
    const implementedChecks = Object.values(results).filter(
      (r) => r?.implemented
    ).length
    return Math.round((implementedChecks / securityChecks.length) * 100)
  }

  // Add export functionality
  const exportSecurityReport = (format: "json" | "csv") => {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: stats.total,
        implemented: stats.implemented,
        warnings: stats.warnings,
        critical: stats.critical,
        overallScore: getOverallScore(),
      },
      checks: securityChecks.map((check) => ({
        name: check.name,
        category: check.category,
        priority: check.priority,
        status: check.status,
        details: check.details,
        recommendations: check.recommendations || [],
        implementationPath: check.implementationPath || "",
        score: results[check.type]?.details?.score || 0,
        issues: results[check.type]?.details?.issues?.length || 0,
        criticalIssues:
          results[check.type]?.details?.issues?.filter(
            (i: any) => i.severity === "critical"
          ).length || 0,
      })),
    }

    if (format === "json") {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `security-report-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (format === "csv") {
      const csvHeaders = [
        "Name",
        "Category",
        "Priority",
        "Status",
        "Score",
        "Issues",
        "Critical Issues",
        "Details",
      ]

      const csvRows = reportData.checks.map((check) => [
        check.name,
        check.category,
        check.priority,
        check.status,
        check.score,
        check.issues,
        check.criticalIssues,
        `"${check.details.replace(/"/g, '""')}"`, // Escape quotes in CSV
      ])

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `security-report-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Security Scanner
          </h2>
          <p className="text-muted-foreground">
            Comprehensive security analysis of your application
          </p>
        </div>
        <div className="flex items-center gap-2">
          {securityChecks.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => exportSecurityReport("json")}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => exportSecurityReport("csv")}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          )}
          <Button
            onClick={runSecurityScan}
            disabled={isScanning}
            className="flex items-center gap-2"
          >
            {isScanning ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>Run Security Scan</>
            )}
          </Button>
        </div>
      </div>

      {/* Add summary stats card if scans have been run */}
      {securityChecks.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Score
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getOverallScore()}%</div>
              <p className="text-xs text-muted-foreground">
                Security implementation
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Checks
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Security measures evaluated
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Implemented</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {stats.implemented}
              </div>
              <p className="text-xs text-muted-foreground">
                Properly configured
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Issues
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {stats.critical}
              </div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {isScanning && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{currentCheck}</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
        </div>
      )}

      <div className="flex items-center space-x-4">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={activeCategory === category.value ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setActiveCategory(category.value)}
          >
            <category.icon className="h-4 w-4" />
            {category.label}
          </Button>
        ))}
      </div>

      {selectedCheck && results[selectedCheck] ? (
        <div className="space-y-4">
          <SecurityCheckDetail
            checkType={selectedCheck}
            checkData={results[selectedCheck]}
            onBack={() => setSelectedCheck(null)}
          />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1">
          {filteredChecks.map((check) => (
            <Card key={check.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {check.status === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {check.status === "warning" && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    {check.status === "error" && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    <CardTitle className="flex items-center gap-2">
                      <span>{check.name}</span>
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {check.priority === "high" && (
                      <Badge variant="destructive">Critical</Badge>
                    )}
                    <Badge
                      variant={
                        check.status === "success"
                          ? "success"
                          : check.status === "warning"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {check.status === "success"
                        ? "Implemented"
                        : check.status === "warning"
                          ? "Needs Improvement"
                          : "Not Implemented"}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{check.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {check.details}
                    </p>
                  </div>

                  {/* Implementation Path */}
                  {check.implementationPath && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">
                        Implementation Path
                      </h4>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {check.implementationPath}
                      </code>
                    </div>
                  )}

                  {/* Security Score if available */}
                  {results[check.type]?.details?.score !== undefined && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Security Score</h4>
                      <div className="space-y-1">
                        <Progress
                          value={results[check.type].details.score}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {results[check.type].details.score}% implemented
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Critical Issues Preview */}
                  {results[check.type]?.details?.issues?.filter(
                    (i: any) => i.severity === "critical"
                  ).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Critical Issues</h4>
                      <div className="space-y-1">
                        {results[check.type].details.issues
                          .filter((issue: any) => issue.severity === "critical")
                          .slice(0, 2) // Show only first 2 critical issues in preview
                          .map((issue: any, index: number) => (
                            <Alert key={index} variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                {issue.message}
                              </AlertDescription>
                            </Alert>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Expandable Details Section */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="details">
                      <AccordionTrigger className="text-sm font-medium">
                        View Full Details
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4 space-y-6">
                          {/* Recommendations */}
                          {check.recommendations &&
                            check.recommendations.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">
                                  Recommendations
                                </h4>
                                <div className="space-y-1">
                                  {check.recommendations.map((rec, index) => (
                                    <Alert key={index}>
                                      <CheckCircle className="h-4 w-4" />
                                      <AlertDescription className="text-sm">
                                        {rec}
                                      </AlertDescription>
                                    </Alert>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Full Security Details */}
                          {results[check.type] && (
                            <div className="">
                              <SecurityCheckDetail
                                checkType={check.type}
                                checkData={results[check.type]}
                              />
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

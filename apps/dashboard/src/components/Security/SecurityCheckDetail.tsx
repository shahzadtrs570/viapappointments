/* eslint-disable */

import { useEffect, useState } from "react"
import {
  BarChart,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Clock,
  Shield,
  Activity,
  FileText,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Button } from "@package/ui/button"
import { Progress } from "@package/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Badge } from "@package/ui/badge"
import { ScrollArea } from "@package/ui/scroll-area"
import { Alert, AlertDescription } from "@package/ui/alert"
import { SecurityIssue } from "@/app/api/security/types"

interface SecurityMetric {
  label: string
  value: number
  target: number
  status: "success" | "warning" | "error"
}

interface SecurityEvent {
  timestamp: string
  type: "success" | "warning" | "error"
  message: string
}

interface ConfigItem {
  name: string
  status: "enabled" | "disabled" | "partial"
  description: string
}

interface SecurityCheckDetailProps {
  checkId?: string
  checkType?: string
  checkData?: any
  onBack?: () => void
}

export function SecurityCheckDetail({
  checkId,
  checkType,
  checkData: propData,
  onBack,
}: SecurityCheckDetailProps) {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<SecurityMetric[]>([])
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [configs, setConfigs] = useState<ConfigItem[]>([])
  const [implementationScore, setImplementationScore] = useState(0)
  const [checkData, setCheckData] = useState<any>(propData)

  useEffect(() => {
    async function fetchDetailedData() {
      try {
        // If data is provided via props, use it
        if (propData) {
          setCheckData(propData)
          setImplementationScore(propData.details?.score || 0)
          setLoading(false)
          return
        }

        // Otherwise fetch from API
        if (checkId) {
          const response = await fetch(`/api/security/details/${checkId}`)
          const data = await response.json()

          setMetrics(data.metrics || [])
          setEvents(data.events || [])
          setConfigs(data.configs || [])
          setImplementationScore(
            data.implementationScore || data.details?.score || 0
          )
          setCheckData(data)
        } else if (checkType) {
          const response = await fetch(
            `/api/security/details?type=${checkType}`
          )
          const data = await response.json()
          setCheckData(data)
          setImplementationScore(data.details?.score || 0)
        }
      } catch (error) {
        console.error("Error fetching security check details:", error)
      } finally {
        setLoading(false)
      }
    }

    void fetchDetailedData()
  }, [checkId, checkType, propData])

  const getTitle = () => {
    if (checkData?.details?.check?.name) return checkData.details.check.name
    if (!checkType) return "Security Check Details"

    switch (checkType) {
      case "auth":
        return "Authentication Security Check"
      case "captcha":
        return "CAPTCHA Security Check"
      case "hosting":
        return "Hosting Security Check"
      case "backup":
        return "Backup Security Check"
      case "dependencies":
        return "Dependencies Security Check"
      case "headers":
        return "Security Headers Check"
      case "upload-security":
        return "Upload Security Check"
      case "validation":
        return "Input Validation Check"
      default:
        return "Security Check Details"
    }
  }

  const getImplementationSteps = (checkType?: string): string[] => {
    switch (checkType) {
      case "auth":
        return [
          "Install and configure Auth.js/NextAuth",
          "Set up environment variables (NEXTAUTH_SECRET, providers)",
          "Create auth configuration file",
          "Implement middleware for route protection",
          "Add authentication providers (OAuth, credentials)",
          "Configure session and JWT settings",
          "Test authentication flows",
        ]
      case "captcha":
        return [
          "Choose CAPTCHA provider (reCAPTCHA, hCaptcha)",
          "Register application and get API keys",
          "Install CAPTCHA library",
          "Add CAPTCHA to login/register forms",
          "Implement server-side verification",
          "Test CAPTCHA integration",
          "Monitor CAPTCHA effectiveness",
        ]
      case "headers":
        return [
          "Configure security headers in next.config.js",
          "Set Content Security Policy (CSP)",
          "Enable HSTS, X-Frame-Options, X-Content-Type-Options",
          "Configure CORS policies",
          "Test headers with security tools",
          "Monitor and update policies",
        ]
      case "hosting":
        return [
          "Choose secure hosting platform (Vercel, AWS, GCP)",
          "Enable HTTPS/SSL certificates",
          "Configure DDoS protection",
          "Set up automated backups",
          "Enable security monitoring",
          "Configure environment isolation",
          "Test deployment security",
        ]
      case "backup":
        return [
          "Choose backup storage solution",
          "Configure automated backup schedules",
          "Implement database backup scripts",
          "Set up offsite backup storage",
          "Test backup restoration process",
          "Document recovery procedures",
          "Monitor backup integrity",
        ]
      case "dependencies":
        return [
          "Run npm audit to identify vulnerabilities",
          "Update vulnerable packages to secure versions",
          "Remove unused dependencies",
          "Set up automated security scanning",
          "Configure Dependabot or similar tools",
          "Review and approve dependency updates",
          "Monitor security advisories",
        ]
      case "validation":
        return [
          "Install validation library (Zod, Joi, Yup)",
          "Create validation schemas for all inputs",
          "Implement server-side validation",
          "Add input sanitization",
          "Configure error handling",
          "Test with malicious inputs",
          "Monitor validation failures",
        ]
      case "secrets":
        return [
          "Move secrets to environment variables",
          "Use secure secret management service",
          "Implement secret rotation policies",
          "Audit code for exposed secrets",
          "Configure secret scanning tools",
          "Set up access controls",
          "Monitor secret usage",
        ]
      case "rate-limit":
        return [
          "Choose rate limiting solution (Upstash, Redis)",
          "Configure rate limits per endpoint",
          "Implement rate limiting middleware",
          "Set up monitoring and alerting",
          "Test rate limiting effectiveness",
          "Configure IP whitelisting if needed",
          "Monitor for abuse patterns",
        ]
      case "monitoring":
        return [
          "Set up logging infrastructure",
          "Configure security event monitoring",
          "Implement alerting for suspicious activities",
          "Set up log aggregation and analysis",
          "Configure dashboards and metrics",
          "Test incident response procedures",
          "Regular security log reviews",
        ]
      case "rbac":
        return [
          "Define user roles and permissions",
          "Implement role-based middleware",
          "Add role checks to API endpoints",
          "Create role management interface",
          "Configure default user roles",
          "Test permission enforcement",
          "Document role hierarchies",
        ]
      case "rls":
        return [
          "Enable Row-Level Security in database",
          "Create RLS policies for data access",
          "Configure user context in queries",
          "Test data isolation between users",
          "Implement policy management",
          "Monitor policy effectiveness",
          "Regular policy audits",
        ]
      case "upload-security":
        return [
          "Implement file type validation",
          "Configure file size limits",
          "Set up secure file storage (S3, Cloudinary)",
          "Add malware scanning",
          "Implement access controls",
          "Configure metadata stripping",
          "Test with malicious files",
        ]
      case "waf":
        return [
          "Enable Web Application Firewall",
          "Configure WAF rules and policies",
          "Set up attack pattern detection",
          "Enable logging and monitoring",
          "Test WAF effectiveness",
          "Configure rate limiting rules",
          "Regular rule updates",
        ]
      case "microservices":
        return [
          "Implement service-to-service authentication",
          "Set up API gateway security",
          "Configure service mesh security",
          "Implement circuit breaker patterns",
          "Add distributed monitoring",
          "Test service isolation",
          "Document security boundaries",
        ]
      default:
        return [
          "Review current implementation",
          "Address critical security issues",
          "Implement recommended changes",
          "Test and verify improvements",
          "Monitor and maintain security measures",
        ]
    }
  }

  const getStatusColor = (status: "success" | "warning" | "error") => {
    switch (status) {
      case "success":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
    }
  }

  const getStatusIcon = (status: "success" | "warning" | "error") => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="size-4" />
      case "warning":
        return <AlertCircle className="size-4" />
      case "error":
        return <XCircle className="size-4" />
    }
  }

  const renderIssues = (issues: SecurityIssue[]) => {
    if (!issues || issues.length === 0) return null

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Issues Found</h3>
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div key={index} className="space-y-2">
              <Alert
                variant={
                  issue.severity === "critical" ? "destructive" : "default"
                }
              >
                <div className="flex items-start gap-2">
                  {issue.severity === "critical" && (
                    <AlertTriangle className="h-4 w-4 mt-1" />
                  )}
                  {issue.severity === "warning" && (
                    <AlertTriangle className="h-4 w-4 mt-1" />
                  )}
                  {issue.severity === "info" && (
                    <Info className="h-4 w-4 mt-1" />
                  )}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <AlertDescription className="text-sm font-medium">
                        {issue.message}
                      </AlertDescription>
                      <Badge
                        variant={
                          issue.severity === "critical"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {issue.severity}
                      </Badge>
                    </div>
                    {issue.solution && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {issue.solution.description}
                        </p>
                        {issue.solution.steps.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Steps to Resolve:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {issue.solution.steps.map((step, stepIndex) => (
                                <li
                                  key={stepIndex}
                                  className="text-sm text-muted-foreground"
                                >
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {issue.solution.codeExample && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Example Implementation:
                            </p>
                            <pre className="text-sm bg-muted p-2 rounded-md overflow-x-auto">
                              <code>{issue.solution.codeExample}</code>
                            </pre>
                          </div>
                        )}
                        {issue.solution.fileReferences.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Relevant Files:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {issue.solution.fileReferences.map(
                                (file, fileIndex) => (
                                  <li
                                    key={fileIndex}
                                    className="text-sm font-mono text-muted-foreground"
                                  >
                                    {file}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                        {issue.solution.docsUrl && (
                          <a
                            href={issue.solution.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            View Documentation
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle>{getTitle()}</CardTitle>
              <Badge
                variant={checkData?.implemented ? "success" : "destructive"}
              >
                {checkData?.implemented ? "Implemented" : "Not Implemented"}
              </Badge>
            </div>
            <CardDescription>
              Security Score: {checkData?.details?.score || implementationScore}
              %
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[600px] pr-4">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="size-4" />
                Overview
              </TabsTrigger>
              {(checkData?.details?.issues?.length > 0 ||
                metrics.length > 0) && (
                <TabsTrigger value="issues" className="flex items-center gap-2">
                  <AlertTriangle className="size-4" />
                  Issues
                </TabsTrigger>
              )}
              {events.length > 0 && (
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Event History
                </TabsTrigger>
              )}
              {configs.length > 0 && (
                <TabsTrigger value="config" className="flex items-center gap-2">
                  <Settings className="size-4" />
                  Configuration
                </TabsTrigger>
              )}
              <TabsTrigger value="docs" className="flex items-center gap-2">
                <FileText className="size-4" />
                Documentation
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent
              value="overview"
              className="space-y-4 overflow-y-auto max-h-96"
            >
              {/* Implementation Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Score</CardTitle>
                  <CardDescription>
                    Overall security measure effectiveness
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {implementationScore || checkData?.details?.score || 0}%
                        Implemented
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Target: 100%
                      </span>
                    </div>
                    <Progress
                      value={
                        implementationScore || checkData?.details?.score || 0
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {checkData?.details && (
                <div className="grid gap-4 md:grid-cols-2">
                  {checkData.details.issues?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Security Issues
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                          {checkData.details.issues.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Critical:{" "}
                          {
                            checkData.details.issues.filter(
                              (i: any) => i.severity === "critical"
                            ).length
                          }
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  {checkData.details.recommendations?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-500">
                          {checkData.details.recommendations.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Improvement suggestions
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Issues Tab */}
            <TabsContent value="issues" className="overflow-y-auto max-h-96">
              {renderIssues(checkData?.details?.issues || [])}
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="overflow-y-auto max-h-96">
              <Card>
                <CardHeader>
                  <CardTitle>Security Events</CardTitle>
                  <CardDescription>
                    Recent security-related activities and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <div className={getStatusColor(event.type)}>
                          {getStatusIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{event.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuration Tab */}
            <TabsContent value="config" className="overflow-y-auto max-h-96">
              <Card>
                <CardHeader>
                  <CardTitle>Security Configurations</CardTitle>
                  <CardDescription>
                    Current security measure configurations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {configs.map((config, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <div
                          className={
                            config.status === "enabled"
                              ? "text-green-500"
                              : config.status === "partial"
                                ? "text-yellow-500"
                                : "text-red-500"
                          }
                        >
                          <Shield className="size-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{config.name}</p>
                            <span
                              className={`text-xs font-medium ${
                                config.status === "enabled"
                                  ? "text-green-500"
                                  : config.status === "partial"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                              }`}
                            >
                              {config.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {config.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="docs" className="overflow-y-auto max-h-96">
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Guide</CardTitle>
                  <CardDescription>
                    Step-by-step guide to implement and improve security
                    measures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="space-y-4">
                      <section>
                        <h3>Overview</h3>
                        <p>
                          {checkData?.details?.check?.description ||
                            "Detailed implementation guidelines and best practices for this security measure."}
                        </p>
                      </section>

                      {checkData?.details?.recommendations?.length > 0 && (
                        <section>
                          <h3>Recommendations</h3>
                          <ul>
                            {checkData.details.recommendations.map(
                              (rec: string, index: number) => (
                                <li key={index}>{rec}</li>
                              )
                            )}
                          </ul>
                        </section>
                      )}

                      <section>
                        <h3>Implementation Steps</h3>
                        <ol>
                          {getImplementationSteps(checkType).map(
                            (step, index) => (
                              <li key={index}>{step}</li>
                            )
                          )}
                        </ol>
                      </section>

                      <section>
                        <h3>Best Practices</h3>
                        <ul>
                          <li>Regular security audits</li>
                          <li>Continuous monitoring</li>
                          <li>Keep dependencies updated</li>
                          <li>Follow security guidelines</li>
                        </ul>
                      </section>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

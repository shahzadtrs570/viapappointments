import { useState } from "react"

import { cn } from "@package/utils"
import { AlertCircle, CheckCircle2, Circle, Info } from "lucide-react"

interface SecurityCheckItem {
  id: string
  title: string
  description: string
  category: "authentication" | "api" | "data" | "development" | "monitoring"
  priority: "critical" | "high" | "medium"
  implementationGuide?: string
}

const securityChecklist: SecurityCheckItem[] = [
  // Authentication & Authorization
  {
    id: "auth-library",
    title: "Using Trusted Auth Library",
    description:
      "Verify that authentication is handled by a trusted library like Auth.js/NextAuth.",
    category: "authentication",
    priority: "critical",
    implementationGuide:
      "Check auth implementation in packages/auth directory.",
  },
  {
    id: "protected-endpoints",
    title: "Protected API Endpoints",
    description: "Ensure all sensitive endpoints verify user identity.",
    category: "authentication",
    priority: "critical",
    implementationGuide: "Use middleware.ts for route protection.",
  },
  {
    id: "rbac",
    title: "Role-Based Access Control",
    description:
      "Implement role-based access control for different user types.",
    category: "authentication",
    priority: "high",
  },
  {
    id: "rls",
    title: "Row-Level Security",
    description:
      "Enable Row-Level Security in database to restrict data access.",
    category: "data",
    priority: "critical",
  },
  {
    id: "captcha",
    title: "CAPTCHA Implementation",
    description: "Add CAPTCHA to authentication forms to prevent bot attacks.",
    category: "authentication",
    priority: "high",
  },

  // API & Data Protection
  {
    id: "api-keys",
    title: "API Key Protection",
    description:
      "Ensure no sensitive information is exposed in client-side code.",
    category: "api",
    priority: "critical",
  },
  {
    id: "rate-limiting",
    title: "Rate Limiting",
    description: "Implement rate limiting on API endpoints.",
    category: "api",
    priority: "high",
  },
  {
    id: "middleware-auth",
    title: "Middleware Authentication",
    description: "Validate user permissions in middleware.",
    category: "api",
    priority: "high",
  },
  {
    id: "waf",
    title: "WAF Protection",
    description: "Enable Web Application Firewall protection.",
    category: "api",
    priority: "medium",
  },

  // Data Validation & Storage
  {
    id: "orm",
    title: "ORM Usage",
    description: "Use ORM/Query Builder to prevent SQL injection.",
    category: "data",
    priority: "critical",
  },
  {
    id: "server-validation",
    title: "Server-side Validation",
    description: "Implement comprehensive server-side validation.",
    category: "data",
    priority: "critical",
  },
  {
    id: "error-sanitization",
    title: "Error Message Sanitization",
    description: "Sanitize error messages sent to clients.",
    category: "data",
    priority: "medium",
  },

  // Development Practices
  {
    id: "gitignore",
    title: "Sensitive Files Protection",
    description: "Exclude sensitive files from version control.",
    category: "development",
    priority: "critical",
  },
  {
    id: "dependencies",
    title: "Dependencies Audit",
    description: "Regular audit and cleanup of dependencies.",
    category: "development",
    priority: "high",
  },

  // Monitoring
  {
    id: "activity-monitoring",
    title: "Activity Monitoring",
    description: "Implement logging and monitoring for suspicious activities.",
    category: "monitoring",
    priority: "high",
  },
]

interface SecurityChecklistProps {
  className?: string
}

export function SecurityChecklist({ className }: SecurityChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState<
    SecurityCheckItem["category"] | "all"
  >("all")

  const toggleItem = (id: string) => {
    const newCheckedItems = new Set(checkedItems)
    if (checkedItems.has(id)) {
      newCheckedItems.delete(id)
    } else {
      newCheckedItems.add(id)
    }
    setCheckedItems(newCheckedItems)
  }

  const categories = [
    { value: "all", label: "All" },
    { value: "authentication", label: "Authentication" },
    { value: "api", label: "API Protection" },
    { value: "data", label: "Data Security" },
    { value: "development", label: "Development" },
    { value: "monitoring", label: "Monitoring" },
  ]

  const filteredItems = securityChecklist.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  )

  const progress = Math.round(
    (checkedItems.size / securityChecklist.length) * 100
  )

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Security Checklist
        </h2>
        <p className="text-muted-foreground">
          Track and implement essential security measures for your application.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              activeCategory === category.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            )}
            onClick={() =>
              setActiveCategory(
                category.value as SecurityCheckItem["category"] | "all"
              )
            }
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-4 rounded-lg border transition-colors",
              checkedItems.has(item.id)
                ? "bg-secondary/50"
                : "bg-background hover:bg-secondary/20"
            )}
          >
            <div className="flex items-start gap-3">
              <button
                className="mt-0.5 text-primary transition-colors hover:text-primary/80"
                onClick={() => toggleItem(item.id)}
              >
                {checkedItems.has(item.id) ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <Circle className="size-5" />
                )}
              </button>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium leading-none">{item.title}</h3>
                  {item.priority === "critical" && (
                    <span className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="size-3" />
                      Critical
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                {item.implementationGuide && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                    <Info className="size-3" />
                    <span>{item.implementationGuide}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

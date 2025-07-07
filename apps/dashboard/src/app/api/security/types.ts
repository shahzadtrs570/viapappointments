export interface SecuritySolution {
  description: string
  steps: string[]
  codeExample?: string
  fileReferences: string[]
  docsUrl?: string
}

export interface SecurityIssue {
  message: string
  severity: "critical" | "warning" | "info"
  solution: SecuritySolution
}

export interface BaseSecurityCheck {
  implemented: boolean
  details: {
    score: number
    issues: SecurityIssue[]
    recommendations: string[]
    implementation: {
      coverage: number
      location: string[]
    }
  }
}

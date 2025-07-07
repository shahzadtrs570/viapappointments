import type { UserSession } from "@package/auth/types"
import type { Lead, LeadStatus } from "@package/db"

export interface SubmitLeadArgs {
  input: {
    name: string
    email: string
    phone?: string
    company?: string
    message?: string
    leadType: string
    source?: string
    turnstileToken: string
    metadata?: Record<string, unknown>
  }
  ctx?: {
    headers: Headers
  }
}

export interface GetLeadsArgs {
  input: {
    status?: LeadStatus
    leadType?: string
    assignedTo?: string
    search?: string
    cursor?: string
    limit: number
  }
  session: UserSession
}

export interface GetLeadByIdArgs {
  input: {
    leadId: string
  }
  session: UserSession
}

export interface UpdateLeadStatusArgs {
  input: {
    leadId: string
    status: LeadStatus
    assignedTo?: string
  }
  session: UserSession
}

export interface DeleteLeadArgs {
  input: {
    leadId: string
  }
  session: UserSession
}

export interface ExportLeadsArgs {
  input: {
    status?: LeadStatus
    leadType?: string
    format: "csv" | "json"
  }
  session: UserSession
}

export interface LeadTypeStats {
  type: string
  count: number
}

export interface LeadStatusStats {
  status: string
  count: number
}

export interface LeadSourceStats {
  source: string
  count: number
}

export interface LeadStatistics {
  totalLeads: number
  leadsByType: LeadTypeStats[]
  leadsByStatus: LeadStatusStats[]
  leadsBySource: LeadSourceStats[]
  recentLeads: Lead[]
  conversionRate: number
}

export interface GetLeadStatisticsArgs {
  session: UserSession
}

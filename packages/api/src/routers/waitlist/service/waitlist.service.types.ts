import type { UserSession } from "@package/auth/types"
import type { WaitlistEntry } from "@package/db"

export interface CreateWaitlistEntryArgs {
  input: {
    email: string
    name: string
    waitlistType: string
    source?: string
    referralCode?: string
    turnstileToken: string
    website?: string
    metadata?: Record<string, string | null>
  }
  ctx?: {
    headers: Headers
  }
}

export interface GetWaitlistEntriesArgs {
  input: {
    waitlistType?: string
    status?: string
    page: number
    limit: number
    query?: string
  }
  session: UserSession
}

export interface ExportWaitlistEntriesArgs {
  input: {
    waitlistType?: string
    status?: string
    format: "csv" | "json"
  }
  session: UserSession
}

export interface UpdateWaitlistEntryArgs {
  input: {
    id: string
    data: {
      status?: string
      notes?: string
    }
  }
  session: UserSession
}

export interface DeleteWaitlistEntryArgs {
  input: {
    id: string
  }
  session: UserSession
}

export interface GetWaitlistStatisticsArgs {
  session: UserSession
}

export interface WaitlistTypeStats {
  type: string
  count: number
}

export interface WaitlistStatusStats {
  status: string
  count: number
}

export interface WaitlistStatistics {
  totalEntries: number
  entriesByType: WaitlistTypeStats[]
  entriesByStatus: WaitlistStatusStats[]
  recentSignups: WaitlistEntry[]
  conversionRate: number
}

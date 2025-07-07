// Input types for newsletter procedures
export interface SubscribeToNewsletterInput {
  email: string
  name?: string
  source?: string
  metadata?: Record<string, unknown>
  tags?: string[]
  turnstileToken: string
}

export interface UnsubscribeFromNewsletterInput {
  token: string
}

export interface GetSubscribersInput {
  isActive?: boolean
  search?: string
  source?: string
  cursor?: string
  limit: number
}

export interface DeleteSubscriberInput {
  subscriberId: string
}

export interface ExportSubscribersInput {
  isActive?: boolean
  source?: string
  format: "csv" | "json"
}

export interface UpdateSubscriberInput {
  subscriberId: string
  isActive: boolean
}

// Context types
export interface RequestContext {
  headers: Record<string, string | string[] | undefined>
}

// Service method argument types
export interface SubscribeToNewsletterArgs {
  input: SubscribeToNewsletterInput
  ctx: RequestContext
}

export interface UnsubscribeFromNewsletterArgs {
  input: UnsubscribeFromNewsletterInput
}

export interface GetSubscribersArgs {
  input: GetSubscribersInput
  session: User
}

export interface DeleteSubscriberArgs {
  input: DeleteSubscriberInput
  session: User
}

export interface ExportSubscribersArgs {
  input: ExportSubscribersInput
  session: User
}

export interface UpdateSubscriberArgs {
  input: UpdateSubscriberInput
  session: User
}

export interface GetNewsletterStatisticsArgs {
  session: {
    id: string
    email: string
    role: string
  }
}

// Response types
export interface SubscribeResponse {
  success: boolean
  message: string
  subscriberId: string
}

export interface UnsubscribeResponse {
  success: boolean
  message: string
}

export interface SubscriberData {
  id: string
  email: string
  name?: string
  isActive: boolean
  source?: string
  subscribedAt: Date
  updatedAt: Date
  unsubscribeToken?: string
  tags: string[]
  metadata?: Record<string, unknown>
}

export interface GetSubscribersResponse {
  subscribers: SubscriberData[]
  nextCursor?: string
  totalCount: number
}

export interface DeleteSubscriberResponse {
  success: boolean
  message: string
}

export interface ExportSubscribersResponse {
  success: boolean
  message: string
  data: string
}

export interface UpdateSubscriberResponse {
  success: boolean
  message: string
  subscriberId: string
  isActive: boolean
}

// Statistics types
export interface MonthlyGrowthData {
  month: string
  count: number
}

export interface SourceStat {
  source: string
  count: number
}

export interface NewsletterStatistics {
  totalSubscribers: number
  activeSubscribers: number
  monthlyGrowth: MonthlyGrowthData[]
  sourceStats: SourceStat[]
}

export interface TagStatistics {
  tag: string
  count: number
}

// Define User type here to avoid external dependency issues
export interface User {
  id: string
  role: string
}

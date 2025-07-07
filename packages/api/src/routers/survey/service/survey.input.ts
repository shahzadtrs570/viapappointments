/**
 * SURVEY INPUT TYPES
 *
 * LINTING & CODE QUALITY NOTES:
 * -----------------------------
 * 1. Import Order (maintain blank lines between groups):
 *    - External packages (zod)
 *    - Package imports (@package/*)
 *    - App imports (@/*)
 *    - Relative imports (./*)
 *
 * 2. Type Safety:
 *    - Export explicit types derived from zod schemas
 *    - Use clear, descriptive interface names
 *    - Use explicit type imports: import type { Something } from "..."
 *
 * 3. Common Issues:
 *    - Keep validation consistent across related schemas
 *    - Export both the schema and the derived type
 *    - Use proper zod validation for all fields
 */

// Input types for survey procedures
export interface CreateSurveyInput {
  title: string
  description?: string
  surveyJson: Record<string, unknown>
  isPublic?: boolean
  redirectUrl?: string | null
  thankYouMessage?: string
  primaryColor?: string
}

export interface UpdateSurveyInput {
  title?: string
  description?: string
  surveyJson?: Record<string, unknown>
  isPublic?: boolean
  redirectUrl?: string | null
  thankYouMessage?: string
  primaryColor?: string
  status?: "DRAFT" | "PUBLISHED" | "CLOSED"
}

export interface GetSurveyInput {
  id: string
}

export interface DeleteSurveyInput {
  id: string
}

export interface ArchiveSurveyInput {
  id: string
}

export interface UpdateSurveyStatusInput {
  id: string
  status: "DRAFT" | "PUBLISHED" | "CLOSED"
}

export interface GetSurveysInput {
  search?: string
  cursor?: string
  limit?: number
  includePublic?: boolean
  includeArchived?: boolean
  status?: "DRAFT" | "PUBLISHED" | "CLOSED"
}

// Survey response input types
export interface CreateSurveyResponseInput {
  surveyId: string
  responseJson: Record<string, unknown>
  leadId?: string
  ipAddress?: string
  userAgent?: string
  isCompleted?: boolean
}

// Service method argument types
export interface CreateSurveyArgs {
  input: CreateSurveyInput
  session?: User
}

export interface GetSurveyArgs {
  input: GetSurveyInput
  session?: User
}

export interface GetSurveysArgs {
  input: GetSurveysInput
  session?: User
}

export interface UpdateSurveyArgs {
  input: {
    id: string
    data: UpdateSurveyInput
  }
  session?: User
}

export interface DeleteSurveyArgs {
  input: DeleteSurveyInput
  session: User
}

export interface ArchiveSurveyArgs {
  input: ArchiveSurveyInput
  session: User
}

export interface UpdateSurveyStatusArgs {
  input: UpdateSurveyStatusInput
  session: User
}

export interface GetAllSurveysArgs {
  session: User
}

export interface GetPublicSurveysArgs {
  input: GetSurveysInput
}

export interface CreateSurveyResponseArgs {
  input: CreateSurveyResponseInput
  session?: User
}

export interface GetSurveyResponsesArgs {
  input: { surveyId: string }
  session: User
}

// Response types
export interface SurveyData {
  id: string
  title: string
  description?: string
  status: "DRAFT" | "PUBLISHED" | "CLOSED"
  surveyJson: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  isArchived: boolean
  redirectUrl?: string | null
  thankYouMessage?: string
  primaryColor?: string
  isPublic: boolean
}

export interface SurveyResponseData {
  id: string
  surveyId: string
  responseJson: Record<string, unknown>
  startedAt: Date
  completedAt?: Date
  isCompleted: boolean
  userId?: string
  leadId?: string
  ipAddress?: string
  userAgent?: string
}

export interface CreateSurveyResponse {
  id: string
  title: string
  description?: string
  status: "DRAFT" | "PUBLISHED" | "CLOSED"
  surveyJson: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface GetSurveysResponse {
  surveys: SurveyData[]
  nextCursor?: string
  totalCount: number
}

export interface DeleteSurveyResponse {
  success: boolean
  message: string
}

export interface ArchiveSurveyResponse {
  success: boolean
  message: string
}

export interface UpdateSurveyStatusResponse {
  id: string
  status: "DRAFT" | "PUBLISHED" | "CLOSED"
}

export interface CreateSurveyResponseResponse {
  id: string
  surveyId: string
  isCompleted: boolean
  surveyConfig: {
    redirectUrl?: string | null
    thankYouMessage: string
  }
}

export interface GetSurveyResponsesResponse {
  responses: SurveyResponseData[]
}

// Define User type here to avoid external dependency issues
export interface User {
  id: string
  role: string
}

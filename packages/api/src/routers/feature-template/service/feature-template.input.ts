/**
 * FEATURE TEMPLATE INPUT TYPES
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

// Input types for feature template procedures
export interface CreateFeatureTemplateInput {
  name: string
  description?: string
}

export interface UpdateFeatureTemplateInput {
  name?: string
  description?: string
}

export interface GetFeatureTemplateInput {
  id: string
}

export interface DeleteFeatureTemplateInput {
  id: string
}

export interface GetFeatureTemplatesInput {
  search?: string
  cursor?: string
  limit?: number
  includePublic?: boolean
}

// Service method argument types
export interface CreateFeatureTemplateArgs {
  input: CreateFeatureTemplateInput
  session?: User // Optional for public submissions
}

export interface GetFeatureTemplateArgs {
  input: GetFeatureTemplateInput
  session?: User // Optional for public access
}

export interface GetFeatureTemplatesArgs {
  input: GetFeatureTemplatesInput
  session?: User // Optional for public access
}

export interface UpdateFeatureTemplateArgs {
  input: {
    id: string
    data: UpdateFeatureTemplateInput
  }
  session?: User // Optional for public access
}

export interface DeleteFeatureTemplateArgs {
  input: DeleteFeatureTemplateInput
  session?: User // Optional for public access
}

export interface GetAllFeatureTemplatesArgs {
  session: User
}

export interface GetPublicFeatureTemplatesArgs {
  input: GetFeatureTemplatesInput
}

// Response types
export interface FeatureTemplateData {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  userId?: string // Now optional
}

export interface CreateFeatureTemplateResponse {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface GetFeatureTemplatesResponse {
  featureTemplates: FeatureTemplateData[]
  nextCursor?: string
  totalCount: number
}

export interface DeleteFeatureTemplateResponse {
  success: boolean
  message: string
}

// Define User type here to avoid external dependency issues
export interface User {
  id: string
  role: string
}

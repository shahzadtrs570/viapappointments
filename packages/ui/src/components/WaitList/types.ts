import { z } from "zod"

export type WaitlistFieldType =
  | "text"
  | "email"
  | "select"
  | "checkbox"
  | "textarea"
  | "hidden"

export type WaitlistSchemaField =
  | "name"
  | "email"
  | "source"
  | "referralCode"
  | "waitlistType"
  | "status"
  | "marketingConsent"
  | "turnstileToken"

export interface WaitlistField {
  name: string
  label?: string
  type: WaitlistFieldType
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
  validation?: (value: string | boolean | number) => string | undefined
  defaultValue?: string | boolean | number
  storeInMetadata?: boolean
  columnSpan?: 1 | 2
}

export interface WaitlistFormConfig {
  fields: WaitlistField[]
  submitButtonText?: string
  successMessage?: {
    title?: string
    description?: React.ReactNode
  }
  customStyles?: {
    formWrapper?: string
    card?: string
    submitButton?: string
  }
  metadata?: Record<string, string | undefined>
}

export const waitlistEntrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  waitlistType: z.string().min(1, "Please select your interest"),
  source: z.string().optional(),
  referralCode: z.string().optional(),
  turnstileToken: z.string().min(1, "Security verification is required"),
  website: z.string().max(0, "This field should be empty").optional(),
  metadata: z.record(z.string().or(z.null())).optional(),
  marketingConsent: z.boolean().optional(),
})

export type WaitlistEntryInput = z.infer<typeof waitlistEntrySchema>

export type WaitlistFormData = {
  [K in WaitlistSchemaField]?: K extends "marketingConsent" ? boolean : string
} & {
  metadata?: Record<string, string | null>
}

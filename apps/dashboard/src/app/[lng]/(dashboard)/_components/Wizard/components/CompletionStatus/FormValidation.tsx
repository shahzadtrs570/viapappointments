/*eslint-disable*/

import { z } from "zod"

// Define the types that were previously imported
export interface SolicitorDetails {
  name: string
  firmName: string
  email: string
  phone: string
  address: string
}

export interface FinalStatus {
  choice: string
  solicitor: SolicitorDetails
  propertyId: string
  sellerId: string
  coSellerIds?: string[]
}

// Dashboard status types
export interface KeyContact {
  name: string
  email: string
  phone: string
  company: string
  contactId: string
}

export interface KeyContacts {
  owner1: KeyContact
  owner2?: KeyContact
  solicitor: KeyContact
  srenovaadvisor: KeyContact
}

export interface Task {
  name: string
  status: string
  dateCompleted: string | null
  expectedCompletion: string
}

export interface Stage {
  date: string | null
  name: string
  status: string
}

export interface NextActionRequired {
  message: string
  actionButton: string
}

export interface ProcessStatus {
  tasks: Task[]
  stages: Stage[]
  currentStage: string
  nextActionRequired: NextActionRequired
}

export interface Document {
  date: string | null
  action: string | null
  status: string
  documentId: string
  documentLink: string | null
  documentName: string
  reviewStatus: string
}

export interface CompletionStatusProps {
  onClose: () => void
  defaultValues?: FinalStatus & { id?: string }
  onUpdate: (data: FinalStatus) => void
  onDelete?: () => void
  propertyId?: string
}

// Updated interface definition
export interface SolicitorFormData {
  name: string
  firmName: string
  email: string
  phone: string
  address: string
}

export const solicitorSchema = z.object({
  name: z
    .string()
    .min(1, "Solicitor name is required")
    .max(100, "Solicitor name cannot exceed 100 characters")
    .regex(
      /^[A-Za-z\s.\-']+$/,
      "Solicitor name can only contain letters, spaces, hyphens, apostrophes and periods"
    ),

  firmName: z
    .string()
    .min(1, "Firm name is required")
    .max(150, "Firm name cannot exceed 150 characters"),

  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .max(255, "Email address cannot exceed 255 characters"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\d\s+()-]{10,20}$/,
      "Please enter a valid phone number (10-20 digits, can include spaces, +, (), and -)"
    ),

  address: z
    .string()
    .min(1, "Address is required")
    .max(500, "Address cannot exceed 500 characters"),
})

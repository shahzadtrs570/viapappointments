import type {
  ApplicationReview,
  Property,
  PropertyAddress,
  SellerProfile,
} from "@prisma/client"

export type WizardStep =
  | "Seller Information"
  | "Property Information"
  | "Review & Recommendations"
  | "Contemplation"
  | "Offer & Next Steps"
  | "Completion Status"

// Define a minimal property details type for when no property exists
export type MinimalPropertyDetails = {
  currentStep: WizardStep
}

// Define the full property details type
export type FullPropertyDetails = {
  id: string
  propertyType: string
  propertyStatus: "freehold" | "leasehold"
  leaseLength?: string
  bedroomCount: number
  bathroomCount: number
  totalAreaSqM: number
  yearBuilt?: string
  features?: string[]
  condition: string
  conditionNotes?: string
  estimatedValue: number
  confirmedValue: number | null
  address?: {
    streetLine1?: string
    streetLine2?: string
    postalCode?: string
    city?: string
    state?: string
  }
  sellers: Array<{
    id: string
    userId: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    email: string | null
    ownershipPercentage: number
  }>
  review: {
    id: string
    status: "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED"
    checklist: Record<string, boolean>
    considerations: Record<string, boolean>
    seller: {
      id: string
      firstName: string
      lastName: string
    }
  } | null
  documents?: Array<{
    id: string
    documentType: string
    filename: string
    fileUrl: string
    verified: boolean
    createdAt: string
    updatedAt: string
  }>
}

export interface PropertyValidationResult {
  hasExistingProperty: boolean
  currentStep: WizardStep
  propertyDetails?: FullPropertyDetails
  sellers?: Array<{
    id: string
    userId: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    email: string | null
    ownershipPercentage: number
  }>
}

export type PropertyApiResponse = Property & {
  address: PropertyAddress | null
  sellers: Array<{
    id: string
    userId: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    email: string | null
    ownershipPercentage: number
  }>
  review:
    | (ApplicationReview & {
        seller: SellerProfile
      })
    | null
  documents: Array<{
    id: string
    documentType: string
    filename: string
    fileUrl: string
    verified: boolean
    createdAt: Date
    updatedAt: Date
  }>
}

export type PropertyValidationError = {
  code: string
  message: string
}

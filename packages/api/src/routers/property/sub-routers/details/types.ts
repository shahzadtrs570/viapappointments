/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PropertyDetails {
  propertyType: "house" | "flat" | "bungalow" | "other" | "apartment"
  propertyStatus: "freehold" | "leasehold"
  leaseLength?: string
  bedrooms: string
  bathrooms: string
  yearBuilt: string
  propertySize: string
  features?: string[]
  address: string
  postcode: string
  town: string
  county: string
  condition: "excellent" | "good" | "fair" | "needs_renovation"
  conditionNotes?: string
  estimatedValue: string
  confirmedValue?: string
  ownerIds?: string[]
  userId: string
  fullAddressData?: Record<string, any>
  showDocumentUpload?: boolean
}

export type PropertyDocumentType = {
  DEED: string
  FLOOR_PLAN: string
  ENERGY_CERTIFICATE: string
  SURVEY: string
  PROPERTY_TAX: string
  INSURANCE: string
  PHOTO: string
  OTHER: string
}

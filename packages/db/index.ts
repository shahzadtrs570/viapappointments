export * from "@prisma/client"
export * from "./db"

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[]

export type PropertyAddress = {
  id: string
  propertyId: string
  streetLine1: string
  streetLine2: string | null
  city: string
  state: string | null
  postalCode: string
  country: string
  createdAt: Date
  updatedAt: Date
  addressData?: JsonValue
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

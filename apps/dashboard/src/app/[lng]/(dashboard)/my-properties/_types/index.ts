/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PropertySeller {
  id: string
  firstName: string
  lastName: string
  userId: string
}

export interface SellerProperty {
  id: string
  propertyId: string
  sellerId: string
  ownershipPercentage: number
  seller: PropertySeller
}

export interface PropertyDocument {
  id: string
  documentType: string
  filename?: string
  fileSize?: number
}

export interface Valuation {
  id: string
  amount: number
  createdAt: string
}

export interface Offer {
  id: string
  amount: number
  status: string
  createdAt: string
}

export interface PropertyAddress {
  id?: string
  propertyId?: string
  streetLine1?: string
  streetLine2?: string | null
  city?: string
  state?: string | null
  postalCode?: string
  country?: string
  createdAt?: string
  updatedAt?: string
  addressData?: Record<string, any> | null
}

export type PropertyStatus = "ACCEPTED" | "PENDING" | "PROCESSING" | "REJECTED"

export interface Property {
  id: string
  title?: string
  formattedAddress?: string
  address?: string | PropertyAddress
  postcode?: string
  price?: number
  estimatedValue: number
  confirmedValue?: number
  propertyType: string
  bedroomCount: number
  bathroomCount: number
  totalAreaSqM: number
  condition: string
  sellerProperties: SellerProperty[]
  propertyDocuments?: PropertyDocument[]
  valuations?: Valuation[]
  offers?: Offer[]
  createdAt: string
  updatedAt: string
  status: PropertyStatus
  lastStatusUpdate?: string
}

export interface PaginatedProperties {
  data: Property[]
  meta: {
    totalCount: number
    page: number
    limit: number
    pageCount: number
  }
}

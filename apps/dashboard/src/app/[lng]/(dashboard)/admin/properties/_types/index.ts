/* eslint-disable  @typescript-eslint/no-explicit-any */

import type { Prisma } from "@package/db"

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
  addressData?: Record<string, any> | null
}

export type SellerProfileUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

export type SellerProfile = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  generalHealth: string
  financialPriority: string
  willStayInProperty: boolean
  createdAt: Date
  updatedAt: Date
  user: SellerProfileUser
}

export type SellerProperty = {
  id: string
  sellerId: string
  propertyId: string
  ownershipPercentage: number
  createdAt: Date
  updatedAt: Date
  seller: SellerProfile
}

export type PropertyDocument = {
  id: string
  propertyId: string
  documentType: string
  filename: string
  fileUrl: string
  verified: boolean
  uploadedById: string
  createdAt: Date
  updatedAt: Date
  uploadedBy: {
    id: string
    name: string | null
    email: string | null
  }
}

export type ValuerProfile = {
  id: string
  firmName: string
  licenseNumber: string
  userId: string
}

export type Valuation = {
  id: string
  propertyId: string
  valuerId: string
  marketValue: number
  occupiedValue: number
  status: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
  valuer: ValuerProfile
}

export type Offer = {
  id: string
  propertyId: string
  sellerProfileId: string
  referenceNumber: string | null
  initialPaymentAmount: number
  monthlyPaymentAmount: number
  indexationRate: number
  status: string
  agreementType: string
  offerData: any | null
  coSellerIds: string[]
  createdAt: Date
  updatedAt: Date
  expirationDate: Date | null
  isProvisional: boolean
  responseId: string | null
  sellerProfile: SellerProfile
}

// Add Seller type to match our new API response
export type Seller = {
  id: string
  userId: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  generalHealth: string
  financialPriority: string
  willStayInProperty: boolean
  ownershipPercentage: number
  createdAt: Date
  updatedAt: Date
}

// Property with full details - support both old and new formats
export type FullProperty = {
  id: string
  propertyType: string
  bedroomCount: number
  bathroomCount: number
  totalAreaSqM: number
  condition: string
  estimatedValue: number
  confirmedValue: number | null
  createdAt: Date
  updatedAt: Date
  address: PropertyAddress | null
  sellerProperties?: Array<{
    id: string
    sellerId: string
    propertyId: string
    ownershipPercentage: number
    createdAt: Date
    updatedAt: Date
    seller: SellerProfile
  }>
  sellers: Array<{
    id: string
    userId: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    generalHealth: string
    financialPriority: string
    willStayInProperty: boolean
    ownershipPercentage: number
    createdAt: Date
    updatedAt: Date
  }>
  documents: Array<{
    id: string
    documentType: string
    filename: string
    fileUrl: string
    verified: boolean
    uploadedById: string
    createdAt: Date
    updatedAt: Date
  }>
  reviewAndReccommendations?: Array<{
    checklist: {
      carePlans: boolean
      financialAdvisor: boolean
      existingMortgages: boolean
      financialSituation: boolean
    }
    considerations: {
      benefits: boolean
      mortgage: boolean
      ownership: boolean
    }
  }>
  valuations: Array<{
    id: string
    marketValue: number
    occupiedValue: number
    status: string
    notes: string | null
    valuerId: string
    createdAt: Date
    updatedAt: Date
  }>
  offers: Array<{
    id: string
    amount: number
    status: string
    sellerProfileId: string
    createdAt: Date
    updatedAt: Date
  }>
}

// Paginated properties response
export type PaginatedPropertiesResponse = {
  properties: Prisma.PropertyGetPayload<{
    include: {
      address: true
    }
  }>[]
  pagination: {
    totalPages: number
    hasMore: boolean
    currentPage: number
    limit: number
  }
}

// DashboardStatus type
export type DashboardStatus = {
  id: string
  propertyId: string
  sellerId: string
  coSellerIds: string[]
  referenceNumber: string
  currentStage: string
  stageProgress: number
  statusData: any
  createdAt: Date
  updatedAt: Date
}

export type PaginatedProperties = {
  properties: FullProperty[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    hasMore: boolean
  }
}

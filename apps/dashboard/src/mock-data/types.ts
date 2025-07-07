/**
 * Mock Data Types for Srenova
 *
 * These types mirror the database schema but are simplified for mock data purposes.
 */

// Enums
export enum UserRole {
  SELLER = "SELLER",
  FAMILY_SUPPORTER = "FAMILY_SUPPORTER",
  FUND_BUYER = "FUND_BUYER",
  CONVEYANCER = "CONVEYANCER",
  VALUER = "VALUER",
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum PropertyType {
  HOUSE = "HOUSE",
  APARTMENT = "APARTMENT",
  BUNGALOW = "BUNGALOW",
  COTTAGE = "COTTAGE",
  VILLA = "VILLA",
  OTHER = "OTHER",
}

export enum HealthCondition {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
}

export enum FinancialPriority {
  LUMP_SUM = "LUMP_SUM",
  MONTHLY_INCOME = "MONTHLY_INCOME",
  MIXED = "MIXED",
  UNDECIDED = "UNDECIDED",
}

export enum PropertyCondition {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  NEEDS_RENOVATION = "NEEDS_RENOVATION",
}

export enum OfferStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  WITHDRAWN = "WITHDRAWN",
}

export enum ContractStatus {
  DRAFT = "DRAFT",
  PENDING_SIGNATURE = "PENDING_SIGNATURE",
  PARTIALLY_SIGNED = "PARTIALLY_SIGNED",
  SIGNED = "SIGNED",
  COMPLETED = "COMPLETED",
  TERMINATED = "TERMINATED",
  DISPUTED = "DISPUTED",
}

export enum ValuationStatus {
  REQUESTED = "REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum AgreementType {
  STANDARD = "STANDARD",
  CUSTOM = "CUSTOM",
}

export enum OccupancyRight {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
  NONE = "NONE",
}

export enum BuyBoxStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  PENDING_OFFER = "PENDING_OFFER",
  SOLD = "SOLD",
  ARCHIVED = "ARCHIVED",
}

export enum PropertyDocumentType {
  DEED = "DEED",
  FLOOR_PLAN = "FLOOR_PLAN",
  ENERGY_CERTIFICATE = "ENERGY_CERTIFICATE",
  SURVEY = "SURVEY",
  PROPERTY_TAX = "PROPERTY_TAX",
  INSURANCE = "INSURANCE",
  PHOTO = "PHOTO",
  OTHER = "OTHER",
}

// Interfaces
export interface MockUser {
  id: string
  name: string
  email: string
  emailVerified: string | null
  image: string | null
  hasOnboarded: boolean
  createdAt: string
  updatedAt: string
  role: UserRole
  preferredLanguage: string
}

export interface MockAddress {
  id: string
  streetLine1: string
  streetLine2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}

export interface MockSellerProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  dateOfBirth: string
  generalHealth: HealthCondition
  financialPriority: FinancialPriority
  willStayInProperty: boolean
  createdAt: string
  updatedAt: string
}

export interface MockFamilySupporterProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  relationshipToSeller: string
  createdAt: string
  updatedAt: string
}

export interface MockFundBuyerProfile {
  id: string
  userId: string
  companyName: string
  registrationNumber: string
  createdAt: string
  updatedAt: string
}

export interface MockConveyancerProfile {
  id: string
  userId: string
  firmName: string
  licenseNumber: string
  createdAt: string
  updatedAt: string
}

export interface MockValuerProfile {
  id: string
  userId: string
  firmName: string
  licenseNumber: string
  createdAt: string
  updatedAt: string
}

export interface MockAdminProfile {
  id: string
  userId: string
  adminLevel: string
  createdAt: string
  updatedAt: string
}

export interface MockProperty {
  id: string
  propertyType: PropertyType
  bedroomCount: number
  bathroomCount: number
  totalAreaSqM: number
  condition: PropertyCondition
  estimatedValue: number
  confirmedValue?: number
  createdAt: string
  updatedAt: string
  address: MockAddress
}

export interface MockSellerProperty {
  id: string
  sellerId: string
  propertyId: string
  ownershipPercentage: number
  createdAt: string
  updatedAt: string
}

export interface MockOffer {
  id: string
  propertyId: string
  sellerProfileId: string
  initialPaymentAmount: number
  monthlyPaymentAmount: number
  indexationRate: number
  status: OfferStatus
  agreementType: AgreementType
  occupancyRight: OccupancyRight
  createdAt: string
  updatedAt: string
}

export interface MockContract {
  id: string
  offerId: string
  buyBoxName: string
  contractNumber: string
  status: "PENDING" | "COMPLETED" | "EXPIRED"
  createdAt: string
  updatedAt: string
  totalAmount: number
  propertyAddresses: string[]
  buyerName: string
  sellerNames: string[]
  signedByBuyer: boolean
  signedBySellers: boolean
  buyerSignedAt?: string
  sellersSignedAt?: string
  termsAndConditions: string
}

export interface MockDocument {
  id: string
  userId: string
  documentType: string
  filename: string
  fileUrl: string
  fileSize: number
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface MockPropertyDocument {
  id: string
  propertyId: string
  documentType: string
  filename: string
  fileUrl: string
  verified: boolean
  uploadedById: string
  createdAt: string
  updatedAt: string
}

export interface MockValuation {
  id: string
  propertyId: string
  valuerId: string
  marketValue: number
  occupiedValue: number
  status: ValuationStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface MockBuyBox {
  id: string
  name: string
  description: string
  isAdminCreated: boolean
  creatorId: string
  status: BuyBoxStatus
  totalValue: number
  initialInvestmentAmount: number
  estimatedMonthlyIncome: number
  averageIndexationRate: number
  createdAt: string
  updatedAt: string
}

export interface MockBuyBoxProperty {
  id: string
  buyBoxId: string
  propertyId: string
  createdAt: string
  updatedAt: string
}

export interface MockBuyBoxOffer {
  id: string
  buyBoxId: string
  buyerId: string
  initialPaymentAmount: number
  totalMonthlyPaymentAmount: number
  averageIndexationRate: number
  status: OfferStatus
  agreementType: AgreementType
  createdAt: string
  updatedAt: string
}

export interface MockBuyBoxContract {
  id: string
  buyBoxOfferId: string
  contractNumber: string
  status: ContractStatus
  signedByBuyer: boolean
  signedBySellers: boolean
  createdAt: string
  updatedAt: string
}

export interface Property {
  id: string
  propertyType: "HOUSE" | "APARTMENT" | "BUNGALOW"
  address: {
    streetLine1: string
    streetLine2: string
    city: string
    postcode: string
    country: string
  }
  bedroomCount: number
  bathroomCount: number
  totalAreaSqM: number
  estimatedValue: number
  description: string
}

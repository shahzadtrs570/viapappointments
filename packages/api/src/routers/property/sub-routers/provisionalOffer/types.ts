import type { OfferStatus } from "@package/db"

export interface PropertyInfo {
  address: string
  owners: string[]
  titleNumber: string
  propertyId: string
  tenure: string
  type: string
}

export interface Valuation {
  marketValue: number
  purchasePrice: number
  initialLumpSum: number
  remainingBalance: number
  monthlyPayment: number
  annuityTerm: string
}

export interface ProvisionalOffer {
  referenceNumber: string
  dateOfIssue: string
  sellerId: string
  coSellerIds?: string[]
  property: PropertyInfo
  valuation: Valuation
  status: OfferStatus
  declineReason?: string
  declineDetails?: string
}

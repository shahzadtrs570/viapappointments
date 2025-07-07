export interface Checklist {
  financialAdvisor: boolean
  financialSituation: boolean
  carePlans: boolean
  existingMortgages: boolean
}

export interface Considerations {
  ownership: boolean
  benefits: boolean
  mortgage: boolean
}

export interface ApplicationReview {
  checklist: Checklist
  considerations: Considerations
  propertyId: string
  sellerId: string
  userId: string
  coSellerIds?: string[]
  status: string
}

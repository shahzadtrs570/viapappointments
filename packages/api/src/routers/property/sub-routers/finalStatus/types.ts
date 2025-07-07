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

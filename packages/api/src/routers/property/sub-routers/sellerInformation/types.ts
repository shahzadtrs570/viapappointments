export interface Owner {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  phone?: string
  address?: string
  postcode?: string
  town?: string
  county?: string
  useExistingAddress?: boolean
}

export interface SellerInformation {
  ownerType: "single" | "couple" | "multiple"
  numberOfOwners?: number
  owners: Owner[]
}

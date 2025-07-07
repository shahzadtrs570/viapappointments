export interface PropertyListItem {
  id: string
  title: string
  address: string
  postcode: string
  price: number
  bedrooms: number
  bathrooms: number
  propertyType: string
  createdAt: Date
  updatedAt: Date
}

export interface PropertySeller {
  id: string
  firstName: string
  lastName: string
  userId: string
  ownershipPercentage: number
}

export interface PropertyDetail extends PropertyListItem {
  description: string
  mainImage: string | null
  images: string[]
  features: string[]
  sellers: PropertySeller[]
}

export interface PaginatedPropertiesResponse {
  data: PropertyListItem[]
  meta: {
    totalCount: number
    page: number
    limit: number
    pageCount: number
  }
}

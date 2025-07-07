export interface ResearchJsonContent {
  address: {
    street: string
    city: string
    postcode: string
  }
  searchDate: string
  googleResearchData: {
    localAreaInfo: {
      demographics: Record<string, unknown>
      amenities: string[]
      transportLinks: string[]
      schoolsNearby: {
        name: string
        rating: string
        distance: string
      }[]
    }
    propertyHistory: {
      previousUses: string[]
      planningHistory: {
        date: string
        type: string
        description: string
        status: string
      }[]
    }
  }
  zooplaData: {
    propertyDetails: {
      currentValue: number
      areaStats: {
        averagePrice: number
        priceChanges: {
          lastMonth: number
          lastYear: number
          fiveYears: number
        }
      }
      priceHistory: Array<{
        date: string
        price: number
        changePercentage?: number
      }>
      similarProperties: {
        address: string
        price: number
        soldDate: string
        keyFeatures: string[]
      }[]
    }
  }
}

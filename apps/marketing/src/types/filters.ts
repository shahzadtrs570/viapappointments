// Filter types matching your existing filter structure
export interface VehicleFilters {
  // Basic vehicle info
  make: string[]
  model: string
  yearRange: [number, number]
  trim: string[]
  bodyStyle: string
  condition: string
  status: string

  // Pricing
  priceRange: [number, number]
  priceCurrency: string
  msrpAmount: number

  // Vehicle specifications
  mileageRange: [number, number]
  fuelType: string[]
  transmission: string[]
  drivetrain: string[]
  engineSize: number
  engineCylinders: number
  horsepower: number
  mpgCity: number
  mpgHighway: number
  mpgCombined: number

  // Colors
  exteriorColor: string[]
  interiorColor: string[]

  // Features and options
  features: string[]
  specifications: string[]

  // Vehicle history and condition
  hideWithoutPhotos: boolean
  singleOwner: boolean

  // Search and sorting
  search: string
  sortBy: string
  carType: "used" | "new"

  // Additional filters
  priceDrops: boolean
  onlineFinancing: boolean
  isActive: boolean
  isFeatured: boolean

  // Financing options
  financingOptions: string[]

  // Days on market range
  daysOnMarketRange: [number, number]

  // Seller type
  sellerType: string[]
}

// Default filter values
export const defaultFilters: VehicleFilters = {
  make: [],
  model: "",
  yearRange: [0, 9999],
  trim: [],
  bodyStyle: "",
  condition: "",
  status: "",
  priceRange: [0, 999999],
  priceCurrency: "USD",
  msrpAmount: 0,
  mileageRange: [0, 999999],
  fuelType: [],
  transmission: [],
  drivetrain: [],
  engineSize: 0,
  engineCylinders: 0,
  horsepower: 0,
  mpgCity: 0,
  mpgHighway: 0,
  mpgCombined: 0,
  exteriorColor: [],
  interiorColor: [],
  features: [],
  specifications: [],
  hideWithoutPhotos: false,
  singleOwner: false,
  search: "",
  sortBy: "relevance",
  carType: "used",
  priceDrops: false,
  onlineFinancing: false,
  isActive: true,
  isFeatured: false,
  financingOptions: [],
  daysOnMarketRange: [0, 1000],
  sellerType: [],
}

// AI Response type
export interface AISearchResponse {
  filters: Partial<VehicleFilters>
  confidence: number
  originalQuery: string
  interpretation: string
}

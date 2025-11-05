/* eslint-disable */
// Use the actual session type from tRPC context
type SessionUser = {
  id: string
  role: string
  email?: string | null
  name?: string | null
}
import type { Inventory, Dealership } from "@package/db"

export interface GetInventoryArgs {
  input: {
    // Filtering options
    make?: string[]
    model?: string
    year?: number
    minYear?: number
    maxYear?: number
    minPrice?: number
    maxPrice?: number
    minMileage?: number
    maxMileage?: number
    condition?: string
    fuelType?: string[]
    transmission?: string[]
    drivetrain?: string[]
    bodyStyle?: string
    dealershipId?: string

    // Additional filters
    trim?: string[]
    exteriorColor?: string[]
    interiorColor?: string[]
    features?: string[]

    // Engine and MPG filters
    minEngineSize?: number
    minHorsepower?: number
    minMpgCity?: number
    minMpgHighway?: number
    minMpgCombined?: number

    // Boolean filters
    hideWithoutPhotos?: boolean
    singleOwner?: boolean
    priceDrops?: boolean
    onlineFinancing?: boolean

    // Financing options
    financingOptions?: string[]

    // Days on market
    minDaysOnMarket?: number
    maxDaysOnMarket?: number

    // Seller type
    sellerType?: string[]

    // Search and pagination
    search?: string
    cursor?: string
    skip?: number
    limit: number

    // Sorting
    sortBy?:
      | "price_asc"
      | "price_desc"
      | "year_asc"
      | "year_desc"
      | "mileage_asc"
      | "mileage_desc"
      | "created_desc"

    // Status filters
    status?: string
    isActive?: boolean
    isFeatured?: boolean
  }
}

export interface GetInventoryByIdArgs {
  input: {
    id: string
  }
}

export interface GetInventoryBySlugArgs {
  input: {
    slug: string
  }
}

export interface CreateInventoryArgs {
  input: {
    dealershipId: string
    sourceUrl?: string
    vin?: string
    stockNumber?: string

    // Vehicle information
    make?: string
    model?: string
    year?: number
    trim?: string

    // Pricing
    priceAmount?: number
    priceCurrency?: string
    msrpAmount?: number

    // Specifications
    mileage?: number
    condition?: string
    fuelType?: string
    transmission?: string
    drivetrain?: string
    bodyStyle?: string

    // Engine details
    engineSize?: number
    engineCylinders?: number
    horsepower?: number

    // Fuel economy
    mpgCity?: number
    mpgHighway?: number
    mpgCombined?: number

    // Colors
    exteriorColor?: string
    interiorColor?: string

    // Status
    status?: string
    isActive?: boolean
    isFeatured?: boolean

    // Data
    rawData?: any
    processedData?: any
    features?: any
    specifications?: any
    images?: any

    // SEO
    title?: string
    description?: string
    slug?: string
  }
  session: SessionUser
}

export interface UpdateInventoryArgs {
  input: {
    id: string
    // All the same fields as CreateInventoryArgs but optional
    dealershipId?: string
    sourceUrl?: string
    vin?: string
    stockNumber?: string
    make?: string
    model?: string
    year?: number
    trim?: string
    priceAmount?: number
    priceCurrency?: string
    msrpAmount?: number
    mileage?: number
    condition?: string
    fuelType?: string
    transmission?: string
    drivetrain?: string
    bodyStyle?: string
    engineSize?: number
    engineCylinders?: number
    horsepower?: number
    mpgCity?: number
    mpgHighway?: number
    mpgCombined?: number
    exteriorColor?: string
    interiorColor?: string
    status?: string
    isActive?: boolean
    isFeatured?: boolean
    rawData?: any
    processedData?: any
    features?: any
    specifications?: any
    images?: any
    title?: string
    description?: string
    slug?: string
  }
  session: SessionUser
}

export interface DeleteInventoryArgs {
  input: {
    id: string
  }
  session: SessionUser
}

export interface GetDealershipsArgs {
  input: {
    search?: string
    isActive?: boolean
    limit?: number
  }
}

export interface GetInventoryFiltersArgs {
  input: {
    dealershipId?: string
  }
}

export interface InventoryFilters {
  makes: Array<{ value: string; count: number }>
  models: Array<{ value: string; count: number }>
  years: Array<{ value: number; count: number }>
  conditions: Array<{ value: string; count: number }>
  fuelTypes: Array<{ value: string; count: number }>
  transmissions: Array<{ value: string; count: number }>
  drivetrains: Array<{ value: string; count: number }>
  bodyStyles: Array<{ value: string; count: number }>
  priceRange: { min: number; max: number }
  yearRange: { min: number; max: number }
  mileageRange: { min: number; max: number }
}

export interface InventoryStats {
  totalInventory: number
  activeInventory: number
  featuredInventory: number
  inventoryByMake: Array<{ make: string; count: number }>
  inventoryByCondition: Array<{ condition: string; count: number }>
  inventoryByDealership: Array<{ dealershipName: string; count: number }>
  averagePrice: number
  priceRange: { min: number; max: number }
  recentInventory: Inventory[]
}

export interface GetInventoryStatsArgs {
  input: {
    dealershipId?: string
  }
  session: SessionUser
}

export interface BulkCreateInventoryArgs {
  input: {
    items: Array<{
      dealershipId: string
      sourceUrl?: string
      vin?: string
      stockNumber?: string
      make?: string
      model?: string
      year?: number
      trim?: string
      priceAmount?: number
      priceCurrency?: string
      msrpAmount?: number
      mileage?: number
      condition?: string
      fuelType?: string
      transmission?: string
      drivetrain?: string
      bodyStyle?: string
      engineSize?: number
      engineCylinders?: number
      horsepower?: number
      mpgCity?: number
      mpgHighway?: number
      mpgCombined?: number
      exteriorColor?: string
      interiorColor?: string
      status?: string
      isActive?: boolean
      isFeatured?: boolean
      rawData?: any
      processedData?: any
      features?: any
      specifications?: any
      images?: any
      title?: string
      description?: string
      slug?: string
    }>
  }
  session: SessionUser
}

export interface SearchInventoryArgs {
  input: {
    query: string
    filters?: {
      make?: string
      model?: string
      minPrice?: number
      maxPrice?: number
      minYear?: number
      maxYear?: number
      condition?: string
      fuelType?: string
      dealershipId?: string
    }
    limit?: number
    cursor?: string
  }
}

// Extended inventory type with dealership info
export interface InventoryWithDealership extends Inventory {
  dealership: Dealership
}

export interface PaginatedInventoryResult {
  items: InventoryWithDealership[]
  nextCursor?: string
  hasMore: boolean
  total: number
}

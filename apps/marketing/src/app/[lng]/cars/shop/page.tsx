/* eslint-disable */
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import FiltersSidebar from "./components/FiltersSidebar"
import CarListings from "./components/CarListings"
import ActiveFilters from "./components/ActiveFilters"

interface CarShopPageProps {
  params: {
    lng: string
  }
}

// Helper function to extract MPG values from fuel economy string
function extractMPG(fuelEconomy: string | null, type: "city" | "highway" | "combined"): number {
  if (!fuelEconomy) return 0
  
  // Handle formats like "17/20 MPG City/Hwy" or "26/38 MPG City/HwyDetails"
  const match = fuelEconomy.match(/(\d+)\/(\d+)/)
  if (match) {
    const city = parseInt(match[1])
    const highway = parseInt(match[2])
    
    if (type === "city") return city
    if (type === "highway") return highway
    if (type === "combined") return Math.round((city + highway) / 2) // Average for combined
  }
  
  return 0
}

// Helper function to determine if a car has a price drop
function hasPriceDrop(car: any): boolean {
  // Since we don't have actual price history data, we'll simulate price drops
  // based on certain criteria that typically indicate good deals:
  
  // 1. Cars that are 3+ years old (older cars often have price reductions)
  const currentYear = new Date().getFullYear()
  const carYear = parseInt(car.year) || currentYear
  const carAge = currentYear - carYear
  
  // 2. Cars with higher mileage (often have reduced prices)
  const mileage = parseInt(car.basicInfo?.Mileage?.replace(/[^0-9]/g, "") || "0")
  
  // 3. Used cars (typically have price drops compared to MSRP)
  const isUsed = car.basicInfo?.condition?.toLowerCase().includes('used') || 
                 car.year < currentYear ||
                 mileage > 1000
  
  // Consider it a "price drop" if:
  // - Car is 3+ years old, OR
  // - Car has high mileage (50k+), OR  
  // - Car is used with significant mileage
  return carAge >= 3 || mileage >= 50000 || (isUsed && mileage >= 10000)
}

// Vehicle history simulation function
function simulateSingleOwner(car: any): boolean {
  const currentYear = new Date().getFullYear()
  const carYear = parseInt(car.year) || currentYear
  const carAge = currentYear - carYear
  const mileage = parseInt(car.basicInfo?.Mileage?.replace(/[^0-9]/g, "") || "0")
  
  // Newer cars and lower mileage more likely to be single owner
  const singleOwnerProbability = Math.max(0.6 - (carAge * 0.05) - (mileage / 100000 * 0.1), 0.2)
  return Math.random() < singleOwnerProbability
}

// Helper function to extract make from car data
function extractMake(car: any): string {
  // Handle edge case where make might be combined like "ChevroletSilverado"
  if (car.make && car.make !== "null" && car.make !== null && car.make !== "") {
    if (car.make.includes("Chevrolet")) return "Chevrolet"
    if (car.make.includes("Toyota")) return "Toyota"
    if (car.make.includes("Honda")) return "Honda"
    if (car.make.includes("Ford")) return "Ford"
    if (car.make.includes("BMW")) return "BMW"
    if (car.make.includes("Mercedes")) return "Mercedes"
    if (car.make.includes("Audi")) return "Audi"
    if (car.make.includes("Nissan")) return "Nissan"
    if (car.make.includes("Hyundai")) return "Hyundai"
    if (car.make.includes("Kia")) return "Kia"
    if (car.make.includes("Mazda")) return "Mazda"
    if (car.make.includes("Subaru")) return "Subaru"
    if (car.make.includes("Volkswagen")) return "Volkswagen"
    if (car.make.includes("Lexus")) return "Lexus"
    if (car.make.includes("Acura")) return "Acura"
    if (car.make.includes("Infiniti")) return "Infiniti"
    if (car.make.includes("Cadillac")) return "Cadillac"
    if (car.make.includes("Buick")) return "Buick"
    if (car.make.includes("GMC")) return "GMC"
    if (car.make.includes("Ram")) return "Ram"
    if (car.make.includes("Dodge")) return "Dodge"
    if (car.make.includes("Chrysler")) return "Chrysler"
    if (car.make.includes("Jeep")) return "Jeep"
    return car.make
  }
  
  // Fallback: extract from title or URL
  const title = car.title || ""
  const url = car.url || ""
  
  // Check URL first
  if (url.includes("/Chevrolet/")) return "Chevrolet"
  if (url.includes("/Toyota/")) return "Toyota"
  if (url.includes("/Honda/")) return "Honda"
  if (url.includes("/Ford/")) return "Ford"
  if (url.includes("/BMW/")) return "BMW"
  if (url.includes("/Mercedes/")) return "Mercedes"
  if (url.includes("/Audi/")) return "Audi"
  if (url.includes("/Nissan/")) return "Nissan"
  if (url.includes("/Hyundai/")) return "Hyundai"
  if (url.includes("/Kia/")) return "Kia"
  if (url.includes("/Mazda/")) return "Mazda"
  if (url.includes("/Subaru/")) return "Subaru"
  if (url.includes("/Volkswagen/")) return "Volkswagen"
  if (url.includes("/Lexus/")) return "Lexus"
  if (url.includes("/Acura/")) return "Acura"
  if (url.includes("/Infiniti/")) return "Infiniti"
  if (url.includes("/Cadillac/")) return "Cadillac"
  if (url.includes("/Buick/")) return "Buick"
  if (url.includes("/GMC/")) return "GMC"
  if (url.includes("/Ram/")) return "Ram"
  if (url.includes("/Dodge/")) return "Dodge"
  if (url.includes("/Chrysler/")) return "Chrysler"
  if (url.includes("/Jeep/")) return "Jeep"
  
  return "Unknown"
}

// Helper function to extract model from car data
function extractModel(car: any): string {
  // Skip invalid model data
  if (car.model && car.model !== "null" && car.model !== null && car.model !== "" && 
      !car.model.includes("New 2025") && !car.model.includes("Chevrolet") && car.model.length > 2) {
    return car.model
  }
  
  // Fallback: extract from title
  const title = car.title || ""
  if (title) {
    // Extract model from title patterns like "2025 Chevrolet Silverado 1500 Custom"
    const titleParts = title.split(" ")
    if (titleParts.length >= 4) {
      // Find make index and get model after it
      const makeIndex = titleParts.findIndex(part => 
        part.toLowerCase().includes("chevrolet") || 
        part.toLowerCase().includes("toyota") ||
        part.toLowerCase().includes("honda") ||
        part.toLowerCase().includes("ford") ||
        part.toLowerCase().includes("bmw") ||
        part.toLowerCase().includes("mercedes") ||
        part.toLowerCase().includes("audi") ||
        part.toLowerCase().includes("nissan") ||
        part.toLowerCase().includes("hyundai") ||
        part.toLowerCase().includes("kia") ||
        part.toLowerCase().includes("mazda") ||
        part.toLowerCase().includes("subaru") ||
        part.toLowerCase().includes("volkswagen") ||
        part.toLowerCase().includes("lexus") ||
        part.toLowerCase().includes("acura") ||
        part.toLowerCase().includes("infiniti") ||
        part.toLowerCase().includes("cadillac") ||
        part.toLowerCase().includes("buick") ||
        part.toLowerCase().includes("gmc") ||
        part.toLowerCase().includes("ram") ||
        part.toLowerCase().includes("dodge") ||
        part.toLowerCase().includes("chrysler") ||
        part.toLowerCase().includes("jeep")
      )
      
      if (makeIndex !== -1 && makeIndex + 1 < titleParts.length) {
        const modelParts = titleParts.slice(makeIndex + 1)
        return modelParts.join(" ")
      }
    }
  }
  
  return "Unknown"
}

// Helper function to determine car condition based on available data
function getCarCondition(car: any): string {
  const currentYear = new Date().getFullYear()
  const carYear = parseInt(car.year) || currentYear
  const title = car.title?.toLowerCase() || ""
  const url = car.url?.toLowerCase() || ""
  
  // Check URL first for condition indicators (most reliable)
  if (url.includes("/new/")) {
    return "New"
  }
  if (url.includes("/used/")) {
    return "Used"
  }
  if (url.includes("/certified/") || url.includes("/cpo/")) {
    return "Certified Pre-Owned"
  }
  
  // Check title for condition indicators
  if (title.includes("new")) {
    return "New"
  }
  if (title.includes("certified") || title.includes("cpo")) {
    return "Certified Pre-Owned"
  }
  
  // Check if it's a current year model (likely new)
  if (carYear >= currentYear) {
    return "New"
  }
  
  // Default to Used for older cars
  return "Used"
}

// Helper function to classify seller type based on dealer name
function getSellerType(dealerName: string | null): string {
  if (!dealerName || dealerName === "Unknown Dealer") {
    return "Private Seller"
  }
  
  // Check if it's a franchise dealership (contains brand names)
  const brandNames = [
    "Chevrolet", "Chevy", "Toyota", "Ford", "Honda", "Nissan", "BMW", "Mercedes", 
    "Audi", "Volkswagen", "Mazda", "Subaru", "Hyundai", "Kia", "Lexus", "Acura",
    "Infiniti", "Cadillac", "Buick", "GMC", "Ram", "Dodge", "Chrysler", "Jeep"
  ]
  
  const dealerNameLower = dealerName.toLowerCase()
  const hasBrandName = brandNames.some(brand => dealerNameLower.includes(brand.toLowerCase()))
  
  if (hasBrandName || dealerNameLower.includes("dealer") || dealerNameLower.includes("motors")) {
    return "Authorized Dealer"
  }
  
  return "Independent Dealer"
}

function CarShopPageContent({ lng }: { lng: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filters from URL parameters or use empty defaults (only once)
  const getInitialFilters = () => {
    return {
      // Basic vehicle info - Empty by default
      make: searchParams.get("make") ? [searchParams.get("make")!] : [],
      model: searchParams.get("model") || "",
      yearRange: [
        parseInt(searchParams.get("yearMin") || "0"),
        parseInt(searchParams.get("yearMax") || "9999")
      ] as [number, number],
      trim: searchParams.get("trim")?.split(",").filter(Boolean) || [],
      bodyStyle: searchParams.get("bodyStyle") || "",
      condition: searchParams.get("condition") || searchParams.get("carType") || "", // Map carType to condition
      status: searchParams.get("status") || "", // No default status

      // Pricing - No price restrictions by default
      priceRange: [
        parseInt(searchParams.get("priceMin") || "0"),
        parseInt(searchParams.get("priceMax") || "999999")
      ] as [number, number],
      priceCurrency: "USD",
      msrpAmount: 0,

      // Vehicle specifications - No mileage restrictions by default
      mileageRange: [
        parseInt(searchParams.get("mileageMin") || "0"),
        parseInt(searchParams.get("mileageMax") || "999999")
      ] as [number, number],
      fuelType: searchParams.get("fuelType")?.split(",").filter(Boolean) || [],
      transmission: searchParams.get("transmission")?.split(",").filter(Boolean) || [],
      drivetrain: searchParams.get("drivetrain")?.split(",").filter(Boolean) || [],
      engineSize: 0,
      engineCylinders: 0,
      horsepower: 0,
      mpgCity: 0,
      mpgHighway: 0,
      mpgCombined: 0,

      // Colors
      exteriorColor: searchParams.get("exteriorColor")?.split(",").filter(Boolean) || [],
      interiorColor: searchParams.get("interiorColor")?.split(",").filter(Boolean) || [],

      // Features and options
      features: [] as string[],
      specifications: [] as string[],

      // Vehicle history and condition - No quality filters by default
      hideWithoutPhotos: searchParams.get("hideWithoutPhotos") === "true" || false,
      singleOwner: searchParams.get("singleOwner") === "true" || false,

      // Search and sorting
      search: searchParams.get("search") || "",
      sortBy: (searchParams.get("sortBy") as any) || "created_desc",
      carType: (searchParams.get("carType") as "used" | "new") || "used",

      // Additional filters
      priceDrops: searchParams.get("priceDrops") === "true" || false,
      onlineFinancing: searchParams.get("onlineFinancing") === "true" || false,
      isActive: true,
      isFeatured: searchParams.get("isFeatured") === "true" || false,

      // Financing options
      financingOptions: searchParams.get("financingOptions")?.split(",").filter(Boolean) || [],

      // Days on market range
      daysOnMarketRange: [
        parseInt(searchParams.get("daysOnMarketMin") || "0"),
        parseInt(searchParams.get("daysOnMarketMax") || "1000")
      ] as [number, number],


      // Seller type
      sellerType: searchParams.get("sellerType")?.split(",").filter(Boolean) || [],
    }
  }

  const [filters, setFilters] = useState(getInitialFilters)
  const filtersRef = useRef(filters)
  
  // Keep the ref in sync with the state
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  // Update filters when URL parameters change
  useEffect(() => {
    console.log("=== URL PARAMETERS DEBUG ===")
    console.log("Raw URL params:", Object.fromEntries(searchParams.entries()))
    console.log("URL params count:", searchParams.size)
    console.log("All URL params:", Array.from(searchParams.entries()))
    
    const newFilters = getInitialFilters()
    console.log("Parsed filters:", {
      make: newFilters.make,
      model: newFilters.model,
      condition: newFilters.condition,
      carType: searchParams.get("carType"),
      makeParam: searchParams.get("make"),
      modelParam: searchParams.get("model")
    })
    console.log("============================")
    setFilters(newFilters)
  }, [searchParams])

  // Clear all filters function that resets to empty defaults
  const clearAllFilters = () => {
    setFilters({
      // Basic vehicle info - Reset to empty defaults
      make: [] as string[],
      model: "",
      yearRange: [0, 9999] as [number, number],
      trim: [] as string[],
      bodyStyle: "",
      condition: "", // No default condition
      status: "", // No default status

      // Pricing - Reset to no restrictions
      priceRange: [0, 999999] as [number, number],
      priceCurrency: "USD",
      msrpAmount: 0,

      // Vehicle specifications - Reset to no restrictions
      mileageRange: [0, 999999] as [number, number],
      fuelType: [] as string[],
      transmission: [] as string[],
      drivetrain: [] as string[],
      engineSize: 0,
      engineCylinders: 0,
      horsepower: 0,
      mpgCity: 0,
      mpgHighway: 0,
      mpgCombined: 0,

      // Colors
      exteriorColor: [] as string[],
      interiorColor: [] as string[],

      // Features and options
      features: [] as string[],
      specifications: [] as string[],

      // Vehicle history and condition - No quality filters by default
      hideWithoutPhotos: false,
      singleOwner: false,

      // Search and sorting
      search: "",
      sortBy: "created_desc" as const,
      carType: "used" as "used" | "new",

      // Additional filters
      priceDrops: false,
      onlineFinancing: false,
      isActive: true,
      isFeatured: false,

      // Financing options
      financingOptions: [] as string[],

      // Days on market range
      daysOnMarketRange: [0, 1000] as [number, number],


      // Seller type
      sellerType: [] as string[],
    })
  }

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const itemsPerPage = 15

  // Load local JSON data instead of TRPC
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [allCars, setAllCars] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load all cars data once on component mount
  useEffect(() => {
    const loadAllCarsData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load all JSON data files
        const dataFiles = [
          "alderman_auto_data_2025-09-11T21-25-05.json",
          "continental_auto_sales_data_2025-09-09T19-25-57.json",
          "Kiefer_Mazda_data_2025-09-15T18-01-31.json",
          "Kiefer_Mazda_data_2025-09-15T18-09-37.json",
          "kirkbrothers_buick_gmc_data_2025-09-04T10-14-14 (1).json",
          "kirkbrothers_chevrolet_data_2025-09-01T21-08-46.json",
          "kirkbrothers_ford_data_2025-09-03T20-29-41 (1).json",
          "pilson_ford_data_2025-09-08T20-05-43.json",
          "sam_leman_ford_data_2025-09-07T19-39-48.json",
          "sam_leman_ford_data_2025-09-07T19-44-16.json",
          "sam_leman_toyota_data_2025-09-07T19-10-19.json",
          "toyota_pekin_data_2025-09-14T20-04-34.json",
          "toyota_pekin_data_2025-09-14T20-10-29.json",
        ]

        const allCarsData: any[] = []
        console.log("Loading car data from", dataFiles.length, "files...")

        for (const file of dataFiles) {
          try {
            const response = await fetch(`/data/${file}`)
            if (response.ok) {
              const data = await response.json()
              if (Array.isArray(data)) {
                // console.log(`Loaded ${data.length} cars from ${file}`)
                // Transform the data to match expected format
                const transformedData = data.map((car: any, index: number) => ({
                  id: `${file}-${index}`,
                  make: extractMake(car),
                  model: extractModel(car),
                  year: parseInt(car.year) || 2020,
                  priceAmount: parseFloat(
                    car.price?.replace(/[^0-9.]/g, "") || "0"
                  ),
                  priceCurrency: "USD",
                  mileage: parseInt(
                    car.basicInfo?.Mileage?.replace(/[^0-9]/g, "") || "0"
                  ),
                  condition: getCarCondition(car),
                  trim: car.trim || "",
                  fuelType: car.basicInfo?.Engine || "Unknown",
                  transmission: car.basicInfo?.Transmission || "Unknown",
                  drivetrain: car.basicInfo?.Drivetrain || "Unknown",
                  engine: car.engine || "Unknown",
                  horsepower: parseInt(car.horsepower?.replace(/[^0-9]/g, "") || "0"),
                  mpgCity: extractMPG(car.fuelEconomy, "city"),
                  mpgHighway: extractMPG(car.fuelEconomy, "highway"),
                  mpgCombined: extractMPG(car.fuelEconomy, "combined"),
                  bodyStyle: car.basicInfo?.bodyStyle || "Unknown",
                  exteriorColor: car.basicInfo?.Exterior || "Unknown",
                  interiorColor: car.basicInfo?.Interior || "Unknown",
                  title: car.title || `${car.year} ${car.model}`,
                  description: car.description || "",
                  images: car.images || [],
                  dealership: car.dealerName || "Unknown Dealer",
                  sellerType: getSellerType(car.dealerName),
                  location: car.location || "Unknown Location",
                  hasPriceDrop: hasPriceDrop(car),
                  
                  // Vehicle history fields (simulated based on realistic patterns)
                  isSingleOwner: simulateSingleOwner(car),
                  
                  isActive: true,
                  createdAt: new Date(car.scrapedAt || Date.now()),
                  rawData: car,
                }))
                allCarsData.push(...transformedData)
              }
            }
          } catch (fileError) {
            console.error(`Failed to load ${file}:`, fileError)
          }
        }

        console.log(`Loaded ${allCarsData.length} cars total`)
        
        // Debug: Show sample of extracted data
        const sampleCars = allCarsData.slice(0, 5)
        console.log("Sample extracted data:", sampleCars.map(car => ({
          make: car.make,
          model: car.model,
          condition: car.condition,
          year: car.year,
          originalMake: car.rawData?.make,
          originalModel: car.rawData?.model,
          url: car.rawData?.url
        })))
        
        setAllCars(allCarsData)
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading inventory data:", err)
        setError("Failed to load car inventory. Please try again later.")
        setIsLoading(false)
      }
    }

    loadAllCarsData()
  }, []) // Only run once on mount

  // Process and paginate data when filters or page changes
  useEffect(() => {
    if (allCars.length === 0) return

    console.log(
      "Processing data - Current page:",
      currentPage,
      "Items per page:",
      itemsPerPage
    )

    // Apply filters to all cars
    let filteredCount = 0
    let filteredCars = allCars.filter((car, index) => {
      // Basic vehicle info filters
      // Log first few cars for debugging
      if (index < 3 && (filters.make?.length > 0 || filters.model?.length > 0 || filters.condition)) {
        console.log(`Car ${index}:`, { make: car.make, model: car.model, condition: car.condition })
      }
      
      if (
        filters.make &&
        filters.make.length > 0 &&
        !filters.make.some(make => car.make?.toLowerCase() === make.toLowerCase())
      ) {
        if (index < 3) console.log(`  ❌ Filtered out by make`)
        return false
      }
      if (
        filters.model &&
        filters.model.length > 0 &&
        !car.model?.toLowerCase().includes(filters.model.toLowerCase())
      ) {
        if (index < 3) console.log(`  ❌ Filtered out by model`)
        return false
      }
      if (
        filters.trim &&
        filters.trim.length > 0 &&
        !filters.trim.some(trim => car.trim?.toLowerCase().includes(trim.toLowerCase()))
      )
        return false
      if (filters.bodyStyle && car.bodyStyle !== filters.bodyStyle) return false
      if (filters.condition && filters.condition.length > 0 && car.condition !== filters.condition) {
        if (index < 3) console.log(`  ❌ Filtered out by condition`)
        return false
      }
      
      if (index < 3) console.log(`  ✅ Car passed all filters!`)
      filteredCount++
      if (filters.status && car.status !== filters.status) return false

      // Year range filter
      if (filters.yearRange[0] && car.year < filters.yearRange[0]) return false
      if (filters.yearRange[1] && car.year > filters.yearRange[1]) return false

      // Price range filter
      if (filters.priceRange[0] && car.priceAmount < filters.priceRange[0])
        return false
      if (filters.priceRange[1] && car.priceAmount > filters.priceRange[1])
        return false

      // MSRP filter
      if (
        filters.msrpAmount &&
        car.msrpAmount &&
        car.msrpAmount < filters.msrpAmount
      )
        return false

      // Mileage range filter
      if (car.mileage !== undefined && car.mileage !== null) {
        if (
          car.mileage < filters.mileageRange[0] ||
          car.mileage > filters.mileageRange[1]
        )
          return false
      }

      // Fuel type filter (array)
      if (filters.fuelType && filters.fuelType.length > 0) {
        if (!filters.fuelType.includes(car.fuelType)) return false
      }

      // Transmission filter (array)
      if (filters.transmission.length > 0 && car.transmission) {
        if (!filters.transmission.includes(car.transmission)) return false
      }

      // Drivetrain filter (array)
      if (filters.drivetrain.length > 0 && car.drivetrain) {
        if (!filters.drivetrain.includes(car.drivetrain)) return false
      }

      // Engine specifications
      if (
        filters.engineSize &&
        car.engineSize &&
        car.engineSize < filters.engineSize
      )
        return false
      if (
        filters.engineCylinders &&
        car.engineCylinders &&
        car.engineCylinders < filters.engineCylinders
      )
        return false
      if (
        filters.horsepower &&
        car.horsepower &&
        car.horsepower < filters.horsepower
      )
        return false

      // MPG filters
      if (filters.mpgCity && car.mpgCity && car.mpgCity < filters.mpgCity)
        return false
      if (
        filters.mpgHighway &&
        car.mpgHighway &&
        car.mpgHighway < filters.mpgHighway
      )
        return false
      if (
        filters.mpgCombined &&
        car.mpgCombined &&
        car.mpgCombined < filters.mpgCombined
      )
        return false

      // Color filters
      if (filters.exteriorColor.length > 0 && car.exteriorColor) {
        if (!filters.exteriorColor.includes(car.exteriorColor)) return false
      }
      if (filters.interiorColor.length > 0 && car.interiorColor) {
        if (!filters.interiorColor.includes(car.interiorColor)) return false
      }

      // Features filter
      if (filters.features.length > 0 && car.features) {
        const carFeatures = Array.isArray(car.features)
          ? car.features
          : [car.features]
        const hasMatchingFeature = filters.features.some((feature) =>
          carFeatures.some((carFeature: string) =>
            carFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
        if (!hasMatchingFeature) return false
      }

      // Specifications filter
      if (filters.specifications.length > 0 && car.specifications) {
        const carSpecs = Array.isArray(car.specifications)
          ? car.specifications
          : [car.specifications]
        const hasMatchingSpec = filters.specifications.some((spec) =>
          carSpecs.some((carSpec: string) =>
            carSpec.toLowerCase().includes(spec.toLowerCase())
          )
        )
        if (!hasMatchingSpec) return false
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableFields = [
          car.title,
          car.make,
          car.model,
          car.trim,
          car.description,
          car.stockNumber,
          car.vin,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        if (!searchableFields.includes(searchTerm)) return false
      }

      // Boolean filters
      if (filters.hideWithoutPhotos && (!car.images || car.images.length === 0))
        return false
      if (filters.singleOwner && !car.isSingleOwner) return false
      if (filters.priceDrops && !car.hasPriceDrop) return false
      if (filters.onlineFinancing && !car.hasOnlineFinancing) return false

      // Active and featured filters
      if (filters.isActive !== undefined && car.isActive !== filters.isActive)
        return false
      if (filters.isFeatured && !car.isFeatured) return false

      // Financing options filter
      if (filters.financingOptions && filters.financingOptions.length > 0) {
        // Check if car has any of the selected financing options
        // This would need to be implemented based on how financing data is stored
        // For now, we'll check if the car has online financing capability
        const hasFinancingOption = filters.financingOptions.some(option => {
          if (option === "Online Financing") {
            return car.hasOnlineFinancing || false
          }
          // Add other financing option checks here as needed
          return false
        })
        if (!hasFinancingOption) return false
      }

      // Days on market range filter
      if (filters.daysOnMarketRange[0] > 0 || filters.daysOnMarketRange[1] < 1000) {
        const daysOnMarket = Math.floor((Date.now() - new Date(car.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        if (daysOnMarket < filters.daysOnMarketRange[0] || daysOnMarket > filters.daysOnMarketRange[1]) {
          return false
        }
      }


      // Seller type filter
      if (filters.sellerType && filters.sellerType.length > 0) {
        // Check if car's seller type matches any selected seller type
        if (!car.sellerType || !filters.sellerType.includes(car.sellerType)) {
          return false
        }
      }

      // Engine specifications filter
      if (filters.engineSize && filters.engineSize > 0) {
        // Extract engine size from engine string (e.g., "V6, 3.5L" -> 3.5)
        const engineSizeMatch = car.engine?.match(/(\d+\.?\d*)\s*L/i)
        if (engineSizeMatch) {
          const carEngineSize = parseFloat(engineSizeMatch[1])
          if (carEngineSize < filters.engineSize) {
            return false
          }
        }
      }

      if (filters.horsepower && filters.horsepower > 0) {
        if (!car.horsepower || car.horsepower < filters.horsepower) {
          return false
        }
      }

      // MPG specifications filter
      if (filters.mpgCity && filters.mpgCity > 0) {
        if (!car.mpgCity || car.mpgCity < filters.mpgCity) {
          return false
        }
      }

      if (filters.mpgHighway && filters.mpgHighway > 0) {
        if (!car.mpgHighway || car.mpgHighway < filters.mpgHighway) {
          return false
        }
      }

      if (filters.mpgCombined && filters.mpgCombined > 0) {
        if (!car.mpgCombined || car.mpgCombined < filters.mpgCombined) {
          return false
        }
      }

      return true
    })

    console.log("=== FILTERING RESULT ===")
    console.log("Filters applied:", { 
      make: filters.make, 
      model: filters.model, 
      condition: filters.condition,
      hasFilters: !!(filters.make?.length > 0 || filters.model?.length > 0 || filters.condition?.length > 0)
    })
    console.log(`Result: ${filteredCars.length} cars from ${allCars.length} total`)
    
    // Show sample of filtered results
    if (filteredCars.length > 0 && filteredCars.length < allCars.length) {
      console.log("Sample filtered cars:", filteredCars.slice(0, 3).map(car => ({
        make: car.make,
        model: car.model,
        condition: car.condition
      })))
    }
    console.log("=======================")

    // Apply sorting
    filteredCars.sort((a, b) => {
      switch (filters.sortBy) {
        case "price_asc":
          return a.priceAmount - b.priceAmount
        case "price_desc":
          return b.priceAmount - a.priceAmount
        case "year_asc":
          return a.year - b.year
        case "year_desc":
          return b.year - a.year
        case "mileage_asc":
          return a.mileage - b.mileage
        case "mileage_desc":
          return b.mileage - a.mileage
        case "created_desc":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      }
    })

    // Apply pagination
    const total = filteredCars.length
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedCars = filteredCars.slice(startIndex, endIndex)
    
    // console.log("Pagination:", { filteredCars: filteredCars.length, totalPages, currentPage, paginatedCars: paginatedCars.length })

    // console.log("Pagination details:", { total, startIndex, endIndex, paginatedCars: paginatedCars.length })

    setInventoryData({
      items: paginatedCars,
      total: total,
      hasMore: endIndex < total,
    })
  }, [allCars, filters, currentPage, itemsPerPage])

  // Calculate filtered cars for dynamic filter counts
  const getFilteredCarsForCounts = () => {
    // Apply all filters except the one we're counting for
    return allCars.filter((car) => {
      // Basic vehicle info filters
      if (filters.make && filters.make.length > 0 && !filters.make.some(make => car.make?.toLowerCase().includes(make.toLowerCase()) || make.toLowerCase().includes(car.make?.toLowerCase() || ""))) return false
      if (filters.model && !car.model?.toLowerCase().includes(filters.model.toLowerCase())) return false
      if (filters.trim && filters.trim.length > 0 && !filters.trim.some(trim => car.trim?.toLowerCase().includes(trim.toLowerCase()))) return false
      if (filters.bodyStyle && car.bodyStyle !== filters.bodyStyle) return false
      if (filters.condition && car.condition !== filters.condition) return false
      if (filters.status && car.status !== filters.status) return false

      // Year range filter
      if (filters.yearRange[0] && car.year < filters.yearRange[0]) return false
      if (filters.yearRange[1] && car.year > filters.yearRange[1]) return false

      // Price range filter
      if (filters.priceRange[0] && car.priceAmount < filters.priceRange[0]) return false
      if (filters.priceRange[1] && car.priceAmount > filters.priceRange[1]) return false

      // Mileage range filter
      if (car.mileage !== undefined && car.mileage !== null) {
        if (car.mileage < filters.mileageRange[0] || car.mileage > filters.mileageRange[1]) return false
      }

      // Fuel type filter (array)
      if (filters.fuelType && filters.fuelType.length > 0) {
        if (!filters.fuelType.includes(car.fuelType)) return false
      }

      // Transmission filter (array)
      if (filters.transmission.length > 0 && car.transmission) {
        if (!filters.transmission.includes(car.transmission)) return false
      }

      // Drivetrain filter (array)
      if (filters.drivetrain.length > 0 && car.drivetrain) {
        if (!filters.drivetrain.includes(car.drivetrain)) return false
      }

      // Color filters
      if (filters.exteriorColor.length > 0 && car.exteriorColor) {
        if (!filters.exteriorColor.includes(car.exteriorColor)) return false
      }
      if (filters.interiorColor.length > 0 && car.interiorColor) {
        if (!filters.interiorColor.includes(car.interiorColor)) return false
      }

      // Features filter
      if (filters.features.length > 0 && car.features) {
        const carFeatures = Array.isArray(car.features) ? car.features : [car.features]
        const hasMatchingFeature = filters.features.some((feature) =>
          carFeatures.some((carFeature: string) =>
            carFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
        if (!hasMatchingFeature) return false
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableFields = [car.title, car.make, car.model, car.trim, car.description, car.stockNumber, car.vin]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        if (!searchableFields.includes(searchTerm)) return false
      }

      // Boolean filters
      if (filters.hideWithoutPhotos && (!car.images || car.images.length === 0)) return false
      if (filters.singleOwner && !car.isSingleOwner) return false
      if (filters.priceDrops && !car.hasPriceDrop) return false
      if (filters.onlineFinancing && !car.hasOnlineFinancing) return false

      // Active and featured filters
      if (filters.isActive !== undefined && car.isActive !== filters.isActive) return false
      if (filters.isFeatured && !car.isFeatured) return false

      return true
    })
  }

  // Generate filter options with dynamic counts based on current filters
  const filteredCarsForCounts = getFilteredCarsForCounts()
  const filterOptions = {
    // Basic vehicle info
    makes: Array.from(new Set(allCars.map((car: any) => car.make) || []))
      .filter(Boolean)
      .sort()
      .map((make) => ({
        value: make,
        count: filteredCarsForCounts.filter((car) => car.make === make).length,
      })),
    models: Array.from(new Set(allCars.map((car: any) => car.model) || []))
      .filter(Boolean)
      .sort()
      .map((model) => ({
        value: model,
        count: filteredCarsForCounts.filter((car) => car.model === model).length,
      })),
    trims: Array.from(new Set(allCars.map((car: any) => car.trim) || []))
      .filter(Boolean)
      .sort()
      .map((trim) => ({
        value: trim,
        count: filteredCarsForCounts.filter((car) => car.trim === trim).length,
      })),
    bodyStyles: Array.from(
      new Set(allCars.map((car: any) => car.bodyStyle) || [])
    )
      .filter(Boolean)
      .sort()
      .map((style) => ({
        value: style,
        count: filteredCarsForCounts.filter((car) => car.bodyStyle === style).length,
      })),
    conditions: Array.from(
      new Set(allCars.map((car: any) => car.condition) || [])
    )
      .filter(Boolean)
      .sort()
      .map((condition) => ({
        value: condition,
        count: filteredCarsForCounts.filter((car) => car.condition === condition).length,
      })),
    statuses: Array.from(new Set(allCars.map((car: any) => car.status) || []))
      .filter(Boolean)
      .sort()
      .map((status) => ({
        value: status,
        count: filteredCarsForCounts.filter((car) => car.status === status).length,
      })),
    sellerTypes: [
      { value: "Authorized Dealer", count: filteredCarsForCounts.filter((car) => car.sellerType === "Authorized Dealer").length },
      { value: "Independent Dealer", count: filteredCarsForCounts.filter((car) => car.sellerType === "Independent Dealer").length },
      { value: "Private Seller", count: filteredCarsForCounts.filter((car) => car.sellerType === "Private Seller").length },
    ],

    // Fuel and transmission
    fuelTypes: Array.from(
      new Set(allCars.map((car: any) => car.fuelType) || [])
    )
      .filter(Boolean)
      .sort()
      .map((fuel) => ({
        value: fuel,
        count: filteredCarsForCounts.filter((car) => car.fuelType === fuel).length,
      })),
    transmissions: Array.from(
      new Set(allCars.map((car: any) => car.transmission) || [])
    )
      .filter(Boolean)
      .sort()
      .map((transmission) => ({
        value: transmission,
        count: filteredCarsForCounts.filter((car) => car.transmission === transmission).length,
      })),
    drivetrains: Array.from(
      new Set(allCars.map((car: any) => car.drivetrain) || [])
    )
      .filter(Boolean)
      .sort()
      .map((drivetrain) => ({
        value: drivetrain,
        count: filteredCarsForCounts.filter((car) => car.drivetrain === drivetrain).length,
      })),

    // Colors
    exteriorColors: Array.from(
      new Set(allCars.map((car: any) => car.exteriorColor) || [])
    )
      .filter(Boolean)
      .sort()
      .map((color) => ({
        value: color,
        count: filteredCarsForCounts.filter((car) => car.exteriorColor === color).length,
      })),
    interiorColors: Array.from(
      new Set(allCars.map((car: any) => car.interiorColor) || [])
    )
      .filter(Boolean)
      .sort()
      .map((color) => ({
        value: color,
        count: filteredCarsForCounts.filter((car) => car.interiorColor === color).length,
      })),

    // Years
    years: Array.from(new Set(allCars.map((car: any) => car.year) || []))
      .filter(Boolean)
      .sort((a: number, b: number) => b - a)
      .map((year) => ({
        value: year.toString(),
        count: allCars.filter((car) => car.year === year).length,
      })),

    // Ranges
    priceRange: {
      min: Math.min(...allCars.map((car) => car.priceAmount || 0)),
      max: Math.max(...allCars.map((car) => car.priceAmount || 0)),
    },
    yearRange: {
      min: Math.min(...allCars.map((car) => car.year || 2020)),
      max: Math.max(...allCars.map((car) => car.year || 2024)),
    },
    mileageRange: {
      min: Math.min(...allCars.map((car) => car.mileage || 0)),
      max: Math.max(...allCars.map((car) => car.mileage || 0)),
    },
    engineSizeRange: {
      min: Math.min(...allCars.map((car) => {
        const engineSizeMatch = car.engine?.match(/(\d+\.?\d*)\s*L/i)
        return engineSizeMatch ? parseFloat(engineSizeMatch[1]) : 0
      })),
      max: Math.max(...allCars.map((car) => {
        const engineSizeMatch = car.engine?.match(/(\d+\.?\d*)\s*L/i)
        return engineSizeMatch ? parseFloat(engineSizeMatch[1]) : 0
      })),
    },
    horsepowerRange: {
      min: Math.min(...allCars.map((car) => car.horsepower || 0)),
      max: Math.max(...allCars.map((car) => car.horsepower || 0)),
    },
    mpgCityRange: {
      min: Math.min(...allCars.map((car) => car.mpgCity || 0)),
      max: Math.max(...allCars.map((car) => car.mpgCity || 0)),
    },
    mpgHighwayRange: {
      min: Math.min(...allCars.map((car) => car.mpgHighway || 0)),
      max: Math.max(...allCars.map((car) => car.mpgHighway || 0)),
    },
    mpgCombinedRange: {
      min: Math.min(...allCars.map((car) => car.mpgCombined || 0)),
      max: Math.max(...allCars.map((car) => car.mpgCombined || 0)),
    },
    
    // Counts
    priceDropsCount: filteredCarsForCounts.filter((car) => car.hasPriceDrop).length,
    vehiclesWithPhotosCount: filteredCarsForCounts.filter((car) => car.images && car.images.length > 0).length,
    
    // Vehicle history counts
    singleOwnerVehiclesCount: filteredCarsForCounts.filter((car) => car.isSingleOwner).length,
  }

  // Calculate pagination info
  const totalItems = inventoryData?.total || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const cars = inventoryData?.items || []

  const handleFilterChange = useCallback((newFilters: any) => {
    console.log("Filter change requested:", newFilters)
    setFilters(prevFilters => {
      console.log("Previous filters:", prevFilters)
      return newFilters
    })

    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("page")
      const queryString = params.toString()
      const newUrl = queryString
        ? `/${lng}/cars/shop?${queryString}`
        : `/${lng}/cars/shop`
      router.push(newUrl)
    }
  }, [currentPage, searchParams, lng, router])

  const handleClearAllFilters = () => {
    clearAllFilters()
  }

  const handlePageChange = (page: number) => {
    console.log("Page change requested:", page, "Current page:", currentPage)

    const params = new URLSearchParams(searchParams.toString())

    if (page === 1) {
      params.delete("page") // Clean URL for page 1
    } else {
      params.set("page", page.toString())
    }

    const queryString = params.toString()
    const newUrl = queryString
      ? `/${lng}/cars/shop?${queryString}`
      : `/${lng}/cars/shop`

    console.log("Navigating to:", newUrl)
    router.push(newUrl)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Cars
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-6 mt-4">
          <div className="text-sm text-blue-700">
            <strong>Debug Info:</strong> Total cars loaded: {allCars.length} |
            Filtered cars: {inventoryData?.total || 0} | Current page:{" "}
            {currentPage} | Total pages: {totalPages} | Items per page:{" "}
            {itemsPerPage}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-12 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FiltersSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              filterOptions={filterOptions}
              isLoading={isLoading}
            />
          </div>

          {/* Car Listings */}
          <div className="lg:col-span-3">

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAllFilters}
              filterOptions={filterOptions}
              filtersRef={filtersRef}
            />

            <CarListings
              cars={cars}
              lng={lng}
              carType={filters.carType}
              isLoading={isLoading}
              total={totalItems}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CarShopPage({ params: { lng } }: CarShopPageProps) {
  return <CarShopPageContent lng={lng} />
}

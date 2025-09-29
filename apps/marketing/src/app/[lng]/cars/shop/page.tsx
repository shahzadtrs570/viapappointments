/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import FiltersSidebar from "./components/FiltersSidebar"
import CarListings from "./components/CarListings"
import ActiveFilters from "./components/ActiveFilters"

interface CarShopPageProps {
  params: {
    lng: string
  }
}

function CarShopPageContent({ lng }: { lng: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    // Basic vehicle info
    make: "",
    model: "",
    yearRange: [2020, 2024] as [number, number],
    trim: "",
    bodyStyle: "",
    condition: "",
    status: "",

    // Pricing
    priceRange: [0, 200000] as [number, number],
    priceCurrency: "USD",
    msrpAmount: 0,

    // Vehicle specifications
    mileageRange: [0, 200000] as [number, number],
    fuelType: "",
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

    // Vehicle history and condition
    hideWithoutPhotos: false,
    hideWithAccidents: false,
    hideWithFrameDamage: false,
    hideWithTheftHistory: false,
    hideFleet: false,
    hideWithLemonHistory: false,
    hideWithSalvageHistory: false,
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
  })

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

        for (const file of dataFiles) {
          try {
            const response = await fetch(`/data/${file}`)
            if (response.ok) {
              const data = await response.json()
              if (Array.isArray(data)) {
                // Transform the data to match expected format
                const transformedData = data.map((car: any, index: number) => ({
                  id: `${file}-${index}`,
                  make: car.model?.split(" ")[0] || "Unknown",
                  model: car.model || "Unknown",
                  year: parseInt(car.year) || 2020,
                  priceAmount: parseFloat(
                    car.price?.replace(/[^0-9.]/g, "") || "0"
                  ),
                  priceCurrency: "USD",
                  mileage: parseInt(
                    car.basicInfo?.Mileage?.replace(/[^0-9]/g, "") || "0"
                  ),
                  condition: car.basicInfo?.condition || "Used",
                  fuelType: car.basicInfo?.Engine || "Unknown",
                  transmission: car.basicInfo?.Transmission || "Unknown",
                  drivetrain: car.basicInfo?.Drivetrain || "Unknown",
                  bodyStyle: car.basicInfo?.bodyStyle || "Unknown",
                  exteriorColor: car.basicInfo?.Exterior || "Unknown",
                  interiorColor: car.basicInfo?.Interior || "Unknown",
                  title: car.title || `${car.year} ${car.model}`,
                  description: car.description || "",
                  images: car.images || [],
                  dealership: car.dealership || "Unknown Dealer",
                  location: car.location || "Unknown Location",
                  isActive: true,
                  createdAt: new Date(car.scrapedAt || Date.now()),
                  rawData: car,
                }))
                allCarsData.push(...transformedData)
              }
            }
          } catch (fileError) {
            console.warn(`Failed to load ${file}:`, fileError)
          }
        }

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
    let filteredCars = allCars.filter((car) => {
      // Basic vehicle info filters
      if (
        filters.make &&
        !car.make?.toLowerCase().includes(filters.make.toLowerCase())
      )
        return false
      if (
        filters.model &&
        !car.model?.toLowerCase().includes(filters.model.toLowerCase())
      )
        return false
      if (
        filters.trim &&
        !car.trim?.toLowerCase().includes(filters.trim.toLowerCase())
      )
        return false
      if (filters.bodyStyle && car.bodyStyle !== filters.bodyStyle) return false
      if (filters.condition && car.condition !== filters.condition) return false
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

      // Fuel type filter
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false

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
      if (filters.hideWithAccidents && car.hasAccidents) return false
      if (filters.hideWithFrameDamage && car.hasFrameDamage) return false
      if (filters.hideWithTheftHistory && car.hasTheftHistory) return false
      if (filters.hideFleet && car.isFleet) return false
      if (filters.hideWithLemonHistory && car.hasLemonHistory) return false
      if (filters.hideWithSalvageHistory && car.hasSalvageHistory) return false
      if (filters.singleOwner && !car.isSingleOwner) return false
      if (filters.priceDrops && !car.hasPriceDrop) return false
      if (filters.onlineFinancing && !car.hasOnlineFinancing) return false

      // Active and featured filters
      if (filters.isActive !== undefined && car.isActive !== filters.isActive)
        return false
      if (filters.isFeatured && !car.isFeatured) return false

      return true
    })

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

    console.log(
      "Pagination - Total:",
      total,
      "Start:",
      startIndex,
      "End:",
      endIndex,
      "Items:",
      paginatedCars.length
    )

    setInventoryData({
      items: paginatedCars,
      total: total,
      hasMore: endIndex < total,
    })
  }, [allCars, filters, currentPage, itemsPerPage])

  // Generate filter options from all cars data (not just current page)
  const filterOptions = {
    // Basic vehicle info
    makes: Array.from(new Set(allCars.map((car: any) => car.make) || []))
      .filter(Boolean)
      .sort()
      .map((make) => ({
        value: make,
        count: allCars.filter((car) => car.make === make).length,
      })),
    models: Array.from(new Set(allCars.map((car: any) => car.model) || []))
      .filter(Boolean)
      .sort()
      .map((model) => ({
        value: model,
        count: allCars.filter((car) => car.model === model).length,
      })),
    trims: Array.from(new Set(allCars.map((car: any) => car.trim) || []))
      .filter(Boolean)
      .sort()
      .map((trim) => ({
        value: trim,
        count: allCars.filter((car) => car.trim === trim).length,
      })),
    bodyStyles: Array.from(
      new Set(allCars.map((car: any) => car.bodyStyle) || [])
    )
      .filter(Boolean)
      .sort()
      .map((style) => ({
        value: style,
        count: allCars.filter((car) => car.bodyStyle === style).length,
      })),
    conditions: Array.from(
      new Set(allCars.map((car: any) => car.condition) || [])
    )
      .filter(Boolean)
      .sort()
      .map((condition) => ({
        value: condition,
        count: allCars.filter((car) => car.condition === condition).length,
      })),
    statuses: Array.from(new Set(allCars.map((car: any) => car.status) || []))
      .filter(Boolean)
      .sort()
      .map((status) => ({
        value: status,
        count: allCars.filter((car) => car.status === status).length,
      })),

    // Fuel and transmission
    fuelTypes: Array.from(
      new Set(allCars.map((car: any) => car.fuelType) || [])
    )
      .filter(Boolean)
      .sort()
      .map((fuel) => ({
        value: fuel,
        count: allCars.filter((car) => car.fuelType === fuel).length,
      })),
    transmissions: Array.from(
      new Set(allCars.map((car: any) => car.transmission) || [])
    )
      .filter(Boolean)
      .sort()
      .map((transmission) => ({
        value: transmission,
        count: allCars.filter((car) => car.transmission === transmission)
          .length,
      })),
    drivetrains: Array.from(
      new Set(allCars.map((car: any) => car.drivetrain) || [])
    )
      .filter(Boolean)
      .sort()
      .map((drivetrain) => ({
        value: drivetrain,
        count: allCars.filter((car) => car.drivetrain === drivetrain).length,
      })),

    // Colors
    exteriorColors: Array.from(
      new Set(allCars.map((car: any) => car.exteriorColor) || [])
    )
      .filter(Boolean)
      .sort()
      .map((color) => ({
        value: color,
        count: allCars.filter((car) => car.exteriorColor === color).length,
      })),
    interiorColors: Array.from(
      new Set(allCars.map((car: any) => car.interiorColor) || [])
    )
      .filter(Boolean)
      .sort()
      .map((color) => ({
        value: color,
        count: allCars.filter((car) => car.interiorColor === color).length,
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
      min: Math.min(...allCars.map((car) => car.engineSize || 0)),
      max: Math.max(...allCars.map((car) => car.engineSize || 0)),
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
  }

  // Calculate pagination info
  const totalItems = inventoryData?.total || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const cars = inventoryData?.items || []

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)

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
  }

  const handleClearAllFilters = () => {
    setFilters({
      // Basic vehicle info
      make: "",
      model: "",
      yearRange: [2020, 2024] as [number, number],
      trim: "",
      bodyStyle: "",
      condition: "",
      status: "",

      // Pricing
      priceRange: [0, 200000] as [number, number],
      priceCurrency: "USD",
      msrpAmount: 0,

      // Vehicle specifications
      mileageRange: [0, 200000] as [number, number],
      fuelType: "",
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

      // Vehicle history and condition
      hideWithoutPhotos: false,
      hideWithAccidents: false,
      hideWithFrameDamage: false,
      hideWithTheftHistory: false,
      hideFleet: false,
      hideWithLemonHistory: false,
      hideWithSalvageHistory: false,
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
    })
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

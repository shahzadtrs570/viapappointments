/* eslint-disable */
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/trpc/react"
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

  // Initialize filters from URL parameters or use empty defaults
  const getInitialFilters = () => {
    return {
      // Basic vehicle info
      make: searchParams.get("make") ? [searchParams.get("make")!] : [],
      model: searchParams.get("model") || "",
      yearRange: [
        parseInt(searchParams.get("yearMin") || "0"),
        parseInt(searchParams.get("yearMax") || "9999"),
      ] as [number, number],
      trim: searchParams.get("trim")?.split(",").filter(Boolean) || [],
      bodyStyle: searchParams.get("bodyStyle") || "",
      condition: searchParams.get("condition") || "",
      status: searchParams.get("status") || "",

      // Pricing
      priceRange: [
        parseInt(searchParams.get("priceMin") || "0"),
        parseInt(searchParams.get("priceMax") || "999999"),
      ] as [number, number],
      priceCurrency: "USD",
      msrpAmount: 0,

      // Vehicle specifications
      mileageRange: [
        parseInt(searchParams.get("mileageMin") || "0"),
        parseInt(searchParams.get("mileageMax") || "999999"),
      ] as [number, number],
      fuelType: searchParams.get("fuelType")?.split(",").filter(Boolean) || [],
      transmission:
        searchParams.get("transmission")?.split(",").filter(Boolean) || [],
      drivetrain:
        searchParams.get("drivetrain")?.split(",").filter(Boolean) || [],
      engineSize: 0,
      engineCylinders: 0,
      horsepower: 0,
      mpgCity: 0,
      mpgHighway: 0,
      mpgCombined: 0,

      // Colors
      exteriorColor:
        searchParams.get("exteriorColor")?.split(",").filter(Boolean) || [],
      interiorColor:
        searchParams.get("interiorColor")?.split(",").filter(Boolean) || [],

      // Features and options
      features: [] as string[],
      specifications: [] as string[],

      // Vehicle history and condition
      hideWithoutPhotos:
        searchParams.get("hideWithoutPhotos") === "true" || false,
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
      financingOptions:
        searchParams.get("financingOptions")?.split(",").filter(Boolean) || [],

      // Days on market range
      daysOnMarketRange: [
        parseInt(searchParams.get("daysOnMarketMin") || "0"),
        parseInt(searchParams.get("daysOnMarketMax") || "1000"),
      ] as [number, number],

      // Seller type
      sellerType:
        searchParams.get("sellerType")?.split(",").filter(Boolean) || [],
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
    const newFilters = getInitialFilters()
    setFilters(newFilters)
  }, [searchParams])

  // Clear all filters function
  const clearAllFilters = () => {
    setFilters({
      make: [] as string[],
      model: "",
      yearRange: [0, 9999] as [number, number],
      trim: [] as string[],
      bodyStyle: "",
      condition: "",
      status: "",
      priceRange: [0, 999999] as [number, number],
      priceCurrency: "USD",
      msrpAmount: 0,
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
      exteriorColor: [] as string[],
      interiorColor: [] as string[],
      features: [] as string[],
      specifications: [] as string[],
      hideWithoutPhotos: false,
      singleOwner: false,
      search: "",
      sortBy: "created_desc" as const,
      carType: "used" as "used" | "new",
      priceDrops: false,
      onlineFinancing: false,
      isActive: true,
      isFeatured: false,
      financingOptions: [] as string[],
      daysOnMarketRange: [0, 1000] as [number, number],
      sellerType: [] as string[],
    })
  }

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const itemsPerPage = 15

  // Prepare filter input for tRPC query
  const getFilterInput = () => ({
    make: filters.make && filters.make.length > 0 ? filters.make : undefined,
    model: filters.model || undefined,
    minYear: filters.yearRange[0] > 0 ? filters.yearRange[0] : undefined,
    maxYear: filters.yearRange[1] < 9999 ? filters.yearRange[1] : undefined,
    minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    maxPrice:
      filters.priceRange[1] < 999999 ? filters.priceRange[1] : undefined,
    minMileage:
      filters.mileageRange[0] > 0 ? filters.mileageRange[0] : undefined,
    maxMileage:
      filters.mileageRange[1] < 999999 ? filters.mileageRange[1] : undefined,
    condition: filters.condition || undefined,
    fuelType:
      filters.fuelType && filters.fuelType.length > 0
        ? filters.fuelType
        : undefined,
    transmission:
      filters.transmission && filters.transmission.length > 0
        ? filters.transmission
        : undefined,
    drivetrain:
      filters.drivetrain && filters.drivetrain.length > 0
        ? filters.drivetrain
        : undefined,
    bodyStyle: filters.bodyStyle || undefined,
    trim: filters.trim && filters.trim.length > 0 ? filters.trim : undefined,
    exteriorColor:
      filters.exteriorColor && filters.exteriorColor.length > 0
        ? filters.exteriorColor
        : undefined,
    interiorColor:
      filters.interiorColor && filters.interiorColor.length > 0
        ? filters.interiorColor
        : undefined,
    features:
      filters.features && filters.features.length > 0
        ? filters.features
        : undefined,
    minEngineSize: filters.engineSize > 0 ? filters.engineSize : undefined,
    minHorsepower: filters.horsepower > 0 ? filters.horsepower : undefined,
    minMpgCity: filters.mpgCity > 0 ? filters.mpgCity : undefined,
    minMpgHighway: filters.mpgHighway > 0 ? filters.mpgHighway : undefined,
    minMpgCombined: filters.mpgCombined > 0 ? filters.mpgCombined : undefined,
    hideWithoutPhotos: filters.hideWithoutPhotos || undefined,
    search: filters.search || undefined,
    skip: (currentPage - 1) * itemsPerPage,
    limit: itemsPerPage,
    sortBy: filters.sortBy,
    status: filters.status || undefined,
    isActive: filters.isActive,
    isFeatured: filters.isFeatured || undefined,
  })

  // Use tRPC query to fetch inventory
  const inventoryQuery = api.inventory.getInventory.useQuery(getFilterInput())

  // Use tRPC query to fetch filter options
  const filtersQuery = api.inventory.getFilters.useQuery({})

  const isLoading = inventoryQuery.isLoading || filtersQuery.isLoading
  const error = inventoryQuery.error || filtersQuery.error

  // Get data from API
  const cars = inventoryQuery.data?.items || []
  const totalItems = inventoryQuery.data?.total || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Generate filter options from API data
  const filterOptions = filtersQuery.data
    ? {
        makes: filtersQuery.data.makes || [],
        models: filtersQuery.data.models || [],
        trims: [], // Will be populated if needed
        bodyStyles: filtersQuery.data.bodyStyles || [],
        conditions: filtersQuery.data.conditions || [],
        statuses: [], // Will be populated if needed
        sellerTypes: [
          { value: "Authorized Dealer", count: 0 },
          { value: "Independent Dealer", count: 0 },
          { value: "Private Seller", count: 0 },
        ],
        fuelTypes: filtersQuery.data.fuelTypes || [],
        transmissions: filtersQuery.data.transmissions || [],
        drivetrains: filtersQuery.data.drivetrains || [],
        exteriorColors: [], // Will be populated if needed
        interiorColors: [], // Will be populated if needed
        years:
          filtersQuery.data.years?.map((y) => ({
            value: y.value.toString(),
            count: y.count,
          })) || [],
        priceRange: filtersQuery.data.priceRange || { min: 0, max: 200000 },
        yearRange: filtersQuery.data.yearRange || {
          min: 2000,
          max: new Date().getFullYear() + 1,
        },
        mileageRange: filtersQuery.data.mileageRange || { min: 0, max: 200000 },
        engineSizeRange: { min: 0, max: 8 },
        horsepowerRange: { min: 0, max: 1000 },
        mpgCityRange: { min: 0, max: 100 },
        mpgHighwayRange: { min: 0, max: 100 },
        mpgCombinedRange: { min: 0, max: 100 },
        priceDropsCount: 0,
        vehiclesWithPhotosCount: totalItems,
        singleOwnerVehiclesCount: 0,
      }
    : {
        makes: [],
        models: [],
        trims: [],
        bodyStyles: [],
        conditions: [],
        statuses: [],
        sellerTypes: [],
        fuelTypes: [],
        transmissions: [],
        drivetrains: [],
        exteriorColors: [],
        interiorColors: [],
        years: [],
        priceRange: { min: 0, max: 200000 },
        yearRange: { min: 2000, max: new Date().getFullYear() + 1 },
        mileageRange: { min: 0, max: 200000 },
        engineSizeRange: { min: 0, max: 8 },
        horsepowerRange: { min: 0, max: 1000 },
        mpgCityRange: { min: 0, max: 100 },
        mpgHighwayRange: { min: 0, max: 100 },
        mpgCombinedRange: { min: 0, max: 100 },
        priceDropsCount: 0,
        vehiclesWithPhotosCount: 0,
        singleOwnerVehiclesCount: 0,
      }

  const handleFilterChange = useCallback(
    (newFilters: any) => {
      console.log("Filter change requested:", newFilters)
      setFilters((prevFilters) => {
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
    },
    [currentPage, searchParams, lng, router]
  )

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

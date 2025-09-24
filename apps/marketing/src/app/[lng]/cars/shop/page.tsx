/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/trpc/client"
import FiltersSidebar from "./components/FiltersSidebar"
import CarListings from "./components/CarListings"

interface CarShopPageProps {
  params: {
    lng: string
  }
}

function CarShopPageContent({ lng }: { lng: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    make: "",
    bodyStyle: "",
    priceRange: [0, 200000] as [number, number],
    yearRange: [2020, 2024] as [number, number],
    fuelType: "",
    carType: "used" as "used" | "new",
    search: "",
    sortBy: "created_desc" as const,
  })

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const itemsPerPage = 15

  // Fetch inventory data with filters and pagination
  const {
    data: inventoryData,
    isLoading,
    error,
  } = api.inventory.getInventory.useQuery({
    make: filters.make || undefined,
    bodyStyle: filters.bodyStyle || undefined,
    minPrice: filters.priceRange[0] || undefined,
    maxPrice: filters.priceRange[1] || undefined,
    minYear: filters.yearRange[0] || undefined,
    maxYear: filters.yearRange[1] || undefined,
    fuelType: filters.fuelType || undefined,
    search: filters.search || undefined,
    sortBy: filters.sortBy,
    limit: itemsPerPage,
    skip: (currentPage - 1) * itemsPerPage,
    isActive: true,
  })

  // Fetch filter options
  const { data: filterOptions } = api.inventory.getFilters.useQuery({})

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("page")
      const queryString = params.toString()
      const newUrl = queryString
        ? `/${lng}/cars/shop?${queryString}`
        : `/${lng}/cars/shop`
      router.push(newUrl)
    }
  }, [filters, lng, router, searchParams, currentPage])

  // Calculate pagination info
  const totalItems = inventoryData?.total || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const cars = inventoryData?.items || []

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
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

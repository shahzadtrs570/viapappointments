/* eslint-disable */
"use client"

import { useState } from "react"
import { Skeleton } from "@package/ui/skeleton"
import CarCard from "./CarCard"

interface CarListingsProps {
  cars: any[]
  lng: string
  carType: "used" | "new"
  isLoading?: boolean
  total?: number
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export default function CarListings({
  cars,
  lng,
  carType,
  isLoading,
  total,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: CarListingsProps) {
  const [sortBy, setSortBy] = useState("bestMatch")

  const sortedCars = [...cars].sort((a, b) => {
    switch (sortBy) {
      case "priceLow":
        return (a.priceAmount || 0) - (b.priceAmount || 0)
      case "priceHigh":
        return (b.priceAmount || 0) - (a.priceAmount || 0)
      case "yearNew":
        return (b.year || 0) - (a.year || 0)
      case "yearOld":
        return (a.year || 0) - (b.year || 0)
      case "makeAZ":
        return (a.make || "").localeCompare(b.make || "")
      case "makeZA":
        return (b.make || "").localeCompare(a.make || "")
      default:
        return 0
    }
  })

  // Remove this old loading state - we'll use skeleton cards instead

  // Only show "no cars found" if not loading and no cars
  if (cars.length === 0 && !isLoading) {
    return (
      <div className="space-y-6">
        {/* Sort Controls - Always show */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Used Cars for Sale
                </h1>
                <div className="text-sm font-medium text-gray-900">
                  0 cars found
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* No cars message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🚗</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No cars found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters to see more results.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Used Cars for Sale
              </h1>
              <div className="text-sm font-medium text-gray-900">
                {total || cars.length} car
                {(total || cars.length) !== 1 ? "s" : ""} found
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bestMatch">Best Match</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="yearNew">Year: Newest First</option>
              <option value="yearOld">Year: Oldest First</option>
              <option value="makeAZ">Make: A to Z</option>
              <option value="makeZA">Make: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Car Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading && cars.length === 0
          ? // Show skeleton cards with exact same structure as real cards
            Array.from({ length: 15 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Image Section Skeleton */}
                <div className="relative">
                  <div className="aspect-[4/3] bg-gray-100">
                    <Skeleton className="w-full h-full" />
                  </div>
                  {/* Heart Icon Skeleton */}
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-sm">
                    <Skeleton className="w-5 h-5 rounded-full" />
                  </div>
                </div>

                {/* Content Section Skeleton */}
                <div className="p-4">
                  {/* New car badge skeleton */}
                  <div className="mb-2">
                    <Skeleton className="h-4 w-16" />
                  </div>

                  {/* Car Title skeleton */}
                  <div className="mb-2">
                    <Skeleton className="h-6 w-3/4" />
                  </div>

                  {/* Engine Info skeleton */}
                  <div className="mb-6">
                    <Skeleton className="h-4 w-1/2" />
                  </div>

                  {/* Price skeleton */}
                  <div className="mb-6">
                    <Skeleton className="h-8 w-1/3" />
                  </div>

                  {/* Phone and Request Info skeleton */}
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>

                  {/* Location and Menu skeleton */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          : // Show actual cars
            sortedCars.map((car, index) => {
              return (
                <CarCard
                  key={car.id || `car-${index}`}
                  car={car}
                  index={index}
                  lng={lng}
                />
              )
            })}
      </div>

      {/* Pagination - Always show when onPageChange is available */}
      {onPageChange && (
        <div className="flex items-center justify-center space-x-2 pt-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* Professional Pagination with Dots - Always show structure */}
          <div className="flex items-center space-x-1">
            {/* First Page */}
            {(totalPages > 0 || isLoading) && (
              <button
                onClick={() => onPageChange(1)}
                disabled={isLoading}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                } ${isLoading ? "opacity-50" : ""}`}
              >
                1
              </button>
            )}

            {/* Left Dots */}
            {!isLoading && currentPage > 4 && totalPages > 7 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}

            {/* Middle Pages - Hide during loading but keep space */}
            {!isLoading &&
              Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((pageNum) => {
                  if (totalPages <= 7) {
                    return pageNum > 1 && pageNum < totalPages
                  }
                  if (currentPage <= 4) {
                    return pageNum > 1 && pageNum <= 5
                  }
                  if (currentPage >= totalPages - 3) {
                    return pageNum >= totalPages - 4 && pageNum < totalPages
                  }
                  return (
                    pageNum >= currentPage - 1 && pageNum <= currentPage + 1
                  )
                })
                .map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    disabled={isLoading}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    } ${isLoading ? "opacity-50" : ""}`}
                  >
                    {pageNum}
                  </button>
                ))}

            {/* Right Dots */}
            {!isLoading && currentPage < totalPages - 3 && totalPages > 7 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}

            {/* Last Page */}
            {!isLoading && totalPages > 1 && (
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={isLoading}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                } ${isLoading ? "opacity-50" : ""}`}
              >
                {totalPages}
              </button>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

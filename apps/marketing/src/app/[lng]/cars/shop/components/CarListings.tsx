/* eslint-disable */
"use client"

import { useState } from "react"
import CarCard from "./CarCard"

interface CarListingsProps {
  cars: any[]
  lng: string
  carType: "used" | "new"
}

export default function CarListings({ cars, lng, carType }: CarListingsProps) {
  const [sortBy, setSortBy] = useState("bestMatch")

  const sortedCars = [...cars].sort((a, b) => {
    switch (sortBy) {
      case "priceLow":
        return a.salePrice - b.salePrice
      case "priceHigh":
        return b.salePrice - a.salePrice
      case "yearNew":
        return parseInt(b.year) - parseInt(a.year)
      case "yearOld":
        return parseInt(a.year) - parseInt(b.year)
      case "makeAZ":
        return a.make.localeCompare(b.make)
      case "makeZA":
        return b.make.localeCompare(a.make)
      default:
        return 0
    }
  })

  if (cars.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">🚗</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No cars found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters to see more results.
        </p>
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
                {cars.length} car{cars.length !== 1 ? "s" : ""} found
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
        {sortedCars.map((car, index) => {
          const originalIndex = cars.findIndex(
            (originalCar) => originalCar.vin === car.vin
          )
          return (
            <CarCard
              key={`${car.vin}-${index}`}
              car={car}
              index={originalIndex}
              lng={lng}
            />
          )
        })}
      </div>

      {/* Load More Button (for future pagination) */}
      {cars.length > 12 && (
        <div className="text-center pt-8">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
            Load More Cars
          </button>
        </div>
      )}
    </div>
  )
}

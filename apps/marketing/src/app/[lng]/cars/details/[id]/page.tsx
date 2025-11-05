/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@package/ui/skeleton"
import CarDetailsHeader from "../../shop/[id]/components/CarDetailsHeader"
import CarImageGallery from "../../shop/[id]/components/CarImageGallery"
import RequestInfoSidebar from "../../shop/[id]/components/RequestInfoSidebar"
import CarSpecifications from "../../shop/[id]/components/CarSpecifications"
import PricingSection from "../../shop/[id]/components/PricingSection"
import DealerInfo from "../../shop/[id]/components/DealerInfo"

interface CarDetailsPageProps {
  params: {
    lng: string
    id: string
  }
}

export default function CarDetailsPage({
  params: { lng, id },
}: CarDetailsPageProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [car, setCar] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allCars, setAllCars] = useState<any[]>([])

  // Load car data from database API
  useEffect(() => {
    const loadCarData = async () => {
      try {
        console.log("Starting to load car data for ID:", id)
        setIsLoading(true)
        setError(null)

        // Try to fetch from database API first
        try {
          const response = await fetch(`/api/cars/${id}`)
          if (response.ok) {
            const carData = await response.json()
            console.log("Car found in database:", carData.title)
            setCar(carData)
            setIsLoading(false)
            return
          }
        } catch (apiError) {
          console.warn(
            "Database API failed, falling back to JSON files:",
            apiError
          )
        }

        // Fallback to JSON files if database API fails
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
            console.log(`Loading file: ${file}`)
            const response = await fetch(`/data/${file}`)
            if (response.ok) {
              const data = await response.json()
              console.log(`Loaded ${data.length} items from ${file}`)
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
                console.log(`Added ${transformedData.length} cars from ${file}`)
              }
            } else {
              console.warn(`Failed to load ${file}: ${response.status}`)
            }
          } catch (fileError) {
            console.warn(`Failed to load ${file}:`, fileError)
          }
        }

        setAllCars(allCarsData)

        // Find the specific car by ID - handle both old format and new format
        console.log("Looking for car with ID:", id)
        console.log("Total cars loaded:", allCarsData.length)

        let foundCar = allCarsData.find((car) => car.id === id)

        // If not found with exact ID, try to find by numeric ID (for new format)
        if (!foundCar) {
          const numericId = parseInt(id)
          if (!isNaN(numericId) && numericId < allCarsData.length) {
            foundCar = allCarsData[numericId]
            console.log("Found car by numeric index:", foundCar?.title)
          }
        }

        if (foundCar) {
          console.log("Car found:", foundCar.title)
          setCar(foundCar)
        } else {
          console.log(
            "Car not found. Available IDs:",
            allCarsData.slice(0, 5).map((c) => c.id)
          )
          setError("Car not found")
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error loading car data:", err)
        setError("Failed to load car data")
        setIsLoading(false)
      }
    }

    loadCarData()
  }, [id])

  // Find current car's position in the list for navigation
  const currentCarIndex = allCars.findIndex((item) => item.id === id)
  const totalInventoryCount = allCars.length

  // Get next and previous car IDs for navigation
  const nextCarId =
    currentCarIndex >= 0 && currentCarIndex < allCars.length - 1
      ? allCars[currentCarIndex + 1]?.id
      : allCars[0]?.id

  const prevCarId =
    currentCarIndex > 0
      ? allCars[currentCarIndex - 1]?.id
      : allCars[allCars.length - 1]?.id

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Navigation Skeleton */}
            <div className="flex items-center justify-between py-4">
              <Skeleton className="h-6 w-24" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </div>

            {/* Car Info Skeleton */}
            <div className="pb-6">
              <div className="lg:flex lg:items-start lg:justify-between">
                <div className="lg:flex-1">
                  <Skeleton className="h-9 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2 mb-4" />

                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>

                <div className="mt-6 lg:mt-0 lg:ml-8">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="w-5 h-5 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery Skeleton */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4">
                  <div className="flex space-x-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="w-16 h-12 rounded" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Features Skeleton */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Skeleton className="h-6 w-24 mb-6" />
                <div className="grid grid-cols-2 gap-6">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications Skeleton */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Skeleton */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Dealer Info Skeleton */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <div className="flex space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="w-10 h-10 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Car Not Found
          </h1>
          <p className="text-gray-600">
            The requested vehicle could not be found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CarDetailsHeader
        car={car}
        currentIndex={currentCarIndex >= 0 ? currentCarIndex : 0}
        totalCars={totalInventoryCount}
        lng={lng}
        nextCarId={nextCarId}
        prevCarId={prevCarId}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            <CarImageGallery car={car} />

            {/* Features Icons */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Features</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Mileage</div>
                    <div className="text-sm text-gray-500">
                      {car.mileage?.toLocaleString() || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Drivetrain</div>
                    <div className="text-sm text-gray-500">
                      {car.drivetrain || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CarSpecifications
              car={car}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <PricingSection car={car} />
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <RequestInfoSidebar car={car} />
          </div>
        </div>

        <DealerInfo car={car} />
      </div>
    </div>
  )
}

/* eslint-disable */
"use client"

import { useState } from "react"

interface FiltersSidebarProps {
  filters: {
    make: string
    bodyStyle: string
    priceRange: [number, number]
    yearRange: [number, number]
    fuelType: string
    carType: "used" | "new"
  }
  onFilterChange: (filters: any) => void
  cars: any[]
}

export default function FiltersSidebar({
  filters,
  onFilterChange,
  cars,
}: FiltersSidebarProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [activeTab, setActiveTab] = useState("car")
  const [expandedSections, setExpandedSections] = useState({
    location: false,
    pricePayment: true,
    mileage: false,
    years: false,
    onlineOptions: false,
    exteriorColor: false,
    interiorColor: false,
    drivetrain: false,
    transmission: false,
    makeFilter: false,
    fuelTypeFilter: false,
    engine: false,
    hybridElectric: false,
    newUsedCPO: false,
    features: false,
    numberOfSeats: false,
    numberOfDoors: false,
    dealRating: false,
    photos: false,
    vehicleHistory: false,
    financing: false,
    daysOnMarket: false,
    gasMileage: false,
    safetyRating: false,
    priceDrops: false,
    dealerRating: false,
    sellerType: false,
  })

  // Get unique values from cars data
  const makes = [...new Set(cars.map((car) => car.make))].sort()
  const bodyStyles = [...new Set(cars.map((car) => car.bodyStyle))].sort()
  const fuelTypes = [...new Set(cars.map((car) => car.fuelType))].sort()

  const handleFilterUpdate = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const TabContent = () => {
    switch (activeTab) {
      case "car":
        return (
          <div className="space-y-4">
            {/* Make */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Make
              </label>
              <select
                value={localFilters.make}
                onChange={(e) => handleFilterUpdate("make", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              >
                <option value="">All makes</option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Model
              </label>
              <select
                disabled
                className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-500 font-medium"
              >
                <option>All models</option>
              </select>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Zip code
              </label>
              <input
                type="text"
                placeholder="Zip code"
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Search Button */}
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-bold text-sm hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        )

      case "bodyStyle":
        return (
          <div className="space-y-4">
            {/* Body Style Dropdown */}
            <div>
              <select
                value={localFilters.bodyStyle}
                onChange={(e) =>
                  handleFilterUpdate("bodyStyle", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              >
                <option value="">All Body Styles</option>
                {bodyStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Zip code
              </label>
              <input
                type="text"
                placeholder="Zip code"
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Search Button */}
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-bold text-sm hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        )

      case "price":
        return (
          <div className="space-y-4">
            {/* Min Price */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Min price
              </label>
              <input
                type="number"
                placeholder="Min price"
                value={localFilters.priceRange[0] || ""}
                onChange={(e) =>
                  handleFilterUpdate("priceRange", [
                    parseInt(e.target.value) || 0,
                    localFilters.priceRange[1],
                  ])
                }
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Max price
              </label>
              <input
                type="number"
                placeholder="Max price"
                value={localFilters.priceRange[1] || ""}
                onChange={(e) =>
                  handleFilterUpdate("priceRange", [
                    localFilters.priceRange[0],
                    parseInt(e.target.value) || 200000,
                  ])
                }
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Zip code
              </label>
              <input
                type="text"
                placeholder="Zip code"
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Search Button */}
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-bold text-sm hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Used/New Toggle - Made Dynamic */}
      <div className="p-4 pb-2">
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => handleFilterUpdate("carType", "used")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-colors ${
              localFilters.carType === "used"
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Used
          </button>
          <button
            onClick={() => handleFilterUpdate("carType", "new")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-colors ${
              localFilters.carType === "new"
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            New
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4">
        <div className="flex border-b border-gray-200">
          {[
            { key: "car", label: "Car" },
            { key: "bodyStyle", label: "Body style" },
            { key: "price", label: "Price" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <TabContent />
      </div>

      {/* Collapsible Sections - Same for both Used and New */}
      <div className="border-t border-gray-200">
        {/* Location & Delivery */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("location")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Location & delivery
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.location ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.location && (
            <div className="px-4 pb-4 space-y-4">
              <div className="flex items-center text-sm">
                <svg
                  className="w-4 h-4 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 mr-2">My location</span>
                <button className="text-blue-600 font-medium hover:underline">
                  Add location
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Include delivery?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      value="yes"
                      className="text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-900">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      value="no"
                      className="text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-900">No</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price & Payment */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("pricePayment")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Price & payment
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.pricePayment ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.pricePayment && (
            <div className="px-4 pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">
                  Vehicle price
                </span>
                <button className="text-blue-600 text-sm font-medium hover:underline">
                  See finance &gt;
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Min
                    </label>
                    <input
                      type="text"
                      value={`$${localFilters.priceRange[0].toLocaleString()}`}
                      onChange={(e) => {
                        const value =
                          parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0
                        handleFilterUpdate("priceRange", [
                          value,
                          localFilters.priceRange[1],
                        ])
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Max
                    </label>
                    <input
                      type="text"
                      value={`$${localFilters.priceRange[1].toLocaleString()}`}
                      onChange={(e) => {
                        const value =
                          parseInt(e.target.value.replace(/[^0-9]/g, "")) ||
                          200000
                        handleFilterUpdate("priceRange", [
                          localFilters.priceRange[0],
                          value,
                        ])
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={localFilters.priceRange[1]}
                    onChange={(e) =>
                      handleFilterUpdate("priceRange", [
                        localFilters.priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    Estimated max payment*
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    $2,000+<span className="text-sm font-normal">/mo</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-bold text-sm hover:bg-blue-700 transition-colors">
                  Get personalized rates
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mileage */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("mileage")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Mileage</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.mileage ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.mileage && (
            <div className="px-4 pb-4 space-y-4">
              <div className="text-sm font-medium text-gray-900">Any</div>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  defaultValue="200000"
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(to right, #3b82f6 0%, #3b82f6 100%, #e5e7eb 100%, #e5e7eb 100%)",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Years */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("years")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Years</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.years ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.years && (
            <div className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Min
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded text-sm font-medium">
                    <option>1956</option>
                    <option>2020</option>
                    <option>2021</option>
                    <option>2022</option>
                    <option>2023</option>
                    <option>2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Max
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded text-sm font-medium">
                    <option>2026</option>
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                    <option>2021</option>
                    <option>2020</option>
                  </select>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">to</div>
            </div>
          )}
        </div>

        {/* Online Shopping Options */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("onlineOptions")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Online shopping options
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.onlineOptions ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.onlineOptions && (
            <div className="px-4 pb-4">
              <label className="flex items-start space-x-3">
                <input type="checkbox" className="mt-1 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Start your purchase online (4,084)
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Show listings with financing, trade-in valuation &
                    dealership appointments available
                  </div>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Exterior Color */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("exteriorColor")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Exterior color
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.exteriorColor ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.exteriorColor && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "Black", count: 1899, color: "#000000" },
                { name: "Blue", count: 950, color: "#2563eb" },
                { name: "Brown", count: 79, color: "#8b4513" },
                { name: "Gold", count: 74, color: "#ffd700" },
                { name: "Gray", count: 1806, color: "#6b7280" },
                { name: "Green", count: 66, color: "#10b981" },
                { name: "Orange", count: 30, color: "#f97316" },
                { name: "Pink", count: 1, color: "#ec4899" },
                { name: "Purple", count: 11, color: "#8b5cf6" },
                { name: "Red", count: 706, color: "#ef4444" },
                { name: "Silver", count: 1140, color: "#c0c0c0" },
                { name: "Teal", count: 8, color: "#14b8a6" },
                { name: "White", count: 1690, color: "#ffffff" },
              ].map((color) => (
                <label key={color.name} className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600" />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.color }}
                  />
                  <span className="text-sm text-gray-900">
                    {color.name} ({color.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Interior Color */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("interiorColor")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Interior color
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.interiorColor ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.interiorColor && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "Black", count: 2156, color: "#000000" },
                { name: "Beige", count: 845, color: "#f5f5dc" },
                { name: "Brown", count: 234, color: "#8b4513" },
                { name: "Gray", count: 1523, color: "#6b7280" },
                { name: "Red", count: 89, color: "#ef4444" },
                { name: "White", count: 445, color: "#ffffff" },
              ].map((color) => (
                <label key={color.name} className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600" />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.color }}
                  />
                  <span className="text-sm text-gray-900">
                    {color.name} ({color.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Drivetrain */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("drivetrain")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Drivetrain</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.drivetrain ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.drivetrain && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "All-Wheel Drive", count: 1717 },
                { name: "Front-Wheel Drive", count: 6375 },
                { name: "Rear-Wheel Drive", count: 1295 },
              ].map((option) => (
                <label
                  key={option.name}
                  className="flex items-center space-x-3"
                >
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-900">
                    {option.name} ({option.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Transmission */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("transmission")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Transmission
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.transmission ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.transmission && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "Automatic", count: 9163 },
                { name: "Manual", count: 230 },
              ].map((option) => (
                <label
                  key={option.name}
                  className="flex items-center space-x-3"
                >
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-900">
                    {option.name} ({option.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Make */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("makeFilter")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Make</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.makeFilter ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.makeFilter && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "Acura", count: 149 },
                { name: "Alfa Romeo", count: 23 },
                { name: "Audi", count: 326 },
                { name: "Bentley", count: 5 },
                { name: "BMW", count: 540 },
                { name: "Buick", count: 86 },
                { name: "Cadillac", count: 153 },
                { name: "Chevrolet", count: 782 },
              ].map((make) => (
                <label key={make.name} className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-900">
                    {make.name} ({make.count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Fuel Type */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("fuelTypeFilter")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Fuel type</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.fuelTypeFilter ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.fuelTypeFilter && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "Compressed Natural Gas", count: 1 },
                { name: "Diesel", count: 34 },
                { name: "Electric", count: 294 },
                { name: "Flex Fuel Vehicle", count: 195 },
                { name: "Fuel Cell", count: 2 },
                { name: "Gasoline", count: 8439 },
                { name: "Hybrid", count: 506 },
              ].map((fuel) => (
                <label key={fuel.name} className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-900">
                    {fuel.name} ({fuel.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Engine */}
        <div>
          <button
            onClick={() => toggleSection("engine")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Engine</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.engine ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.engine && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "H4", count: 214 },
                { name: "H6", count: 4 },
                { name: "I3", count: 16 },
                { name: "I4", count: 6828 },
                { name: "I5", count: 54 },
                { name: "I6", count: 234 },
                { name: "V6", count: 1876 },
                { name: "V8", count: 456 },
              ].map((engine) => (
                <label
                  key={engine.name}
                  className="flex items-center space-x-3"
                >
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-900">
                    {engine.name} ({engine.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Hybrid & Electric */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("hybridElectric")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Hybrid & electric
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.hybridElectric ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.hybridElectric && (
            <div className="px-4 pb-4 space-y-6">
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">
                  EV battery range
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  14 miles - 469 miles
                </div>
                <input
                  type="range"
                  min="14"
                  max="469"
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">
                  EV battery charging time
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  2 hours - 16 hours
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* New / Used / CPO */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("newUsedCPO")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              New / Used / CPO
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.newUsedCPO ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.newUsedCPO && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "Manufacturer Certified", count: 709 },
                { name: "Third-Party Certified", count: 38 },
                { name: "Used", count: 9552 },
              ].map((option) => (
                <label
                  key={option.name}
                  className="flex items-center space-x-3"
                >
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-900">
                    {option.name} ({option.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("features")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Features</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.features ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.features && (
            <div className="px-4 pb-4 space-y-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
              <div className="space-y-3">
                {[
                  { name: "Backup Camera", count: 7662 },
                  { name: "Alloy Wheels", count: 7762 },
                  { name: "Bluetooth", count: 8479 },
                  { name: "Heated Seats", count: 4792 },
                  { name: "CarPlay", count: 4187 },
                  { name: "Navigation System", count: 3499 },
                  { name: "Android Auto", count: 3707 },
                  { name: "Remote Start", count: 3585 },
                  { name: "Sunroof/Moonroof", count: 4107 },
                  { name: "Blind Spot Monitoring", count: 4018 },
                ].map((feature) => (
                  <label
                    key={feature.name}
                    className="flex items-center space-x-3"
                  >
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm text-gray-900">
                      {feature.name} ({feature.count.toLocaleString()})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Number of seats */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("numberOfSeats")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Number of seats
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.numberOfSeats ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.numberOfSeats && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "3", count: 1 },
                { name: "4", count: 53 },
                { name: "5", count: 9207 },
                { name: "6", count: 43 },
              ].map((seats) => (
                <label key={seats.name} className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-900">
                    {seats.name} ({seats.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Number of doors */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("numberOfDoors")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Number of doors
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.numberOfDoors ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.numberOfDoors && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "2", count: 6 },
                { name: "4", count: 9381 },
              ].map((doors) => (
                <label key={doors.name} className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-900">
                    {doors.name} ({doors.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Deal Rating */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("dealRating")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Deal Rating</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.dealRating ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.dealRating && (
            <div className="px-4 pb-4 space-y-3">
              {[
                {
                  name: "Great Deal",
                  count: 654,
                  icon: "🟢",
                  color: "text-green-600",
                },
                {
                  name: "Good Deal",
                  count: 2011,
                  icon: "🟢",
                  color: "text-green-600",
                },
                {
                  name: "Fair Deal",
                  count: 3403,
                  icon: "🟡",
                  color: "text-yellow-600",
                },
                {
                  name: "High Priced",
                  count: 1330,
                  icon: "🟠",
                  color: "text-orange-600",
                },
                {
                  name: "Overpriced",
                  count: 579,
                  icon: "🔴",
                  color: "text-red-600",
                },
                {
                  name: "Uncertain",
                  count: 97,
                  icon: "❓",
                  color: "text-gray-600",
                },
                {
                  name: "No Rating",
                  count: 1478,
                  icon: "⚫",
                  color: "text-gray-600",
                },
              ].map((rating) => (
                <label
                  key={rating.name}
                  className="flex items-center space-x-3"
                >
                  <input type="checkbox" className="text-blue-600" />
                  <span className={`text-sm ${rating.color}`}>
                    {rating.icon}
                  </span>
                  <span className="text-sm text-gray-900">
                    {rating.name} ({rating.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Photos */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("photos")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Photos</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.photos ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.photos && (
            <div className="px-4 pb-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="text-blue-600" />
                <span className="text-sm text-gray-900">
                  Hide vehicles without photos (730)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Vehicle History */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("vehicleHistory")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Vehicle history
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.vehicleHistory ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.vehicleHistory && (
            <div className="px-4 pb-4 space-y-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="text-blue-600" />
                <span className="text-sm text-gray-900">
                  Single Owner (4,496)
                </span>
              </label>
              <div>
                <div className="text-sm font-bold text-gray-900 mb-3">
                  Hide vehicles with:
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Accidents Reported", count: 2972 },
                    { name: "Frame Damage", count: 347 },
                    { name: "Theft History Reported", count: 104 },
                    { name: "Fleet (e.g. rental or corporate)", count: 2137 },
                    { name: "Lemon History Reported", count: 35 },
                    { name: "Salvage History Reported", count: 214 },
                  ].map((item) => (
                    <label
                      key={item.name}
                      className="flex items-center space-x-3"
                    >
                      <input type="checkbox" className="text-blue-600" />
                      <span className="text-sm text-gray-900">
                        {item.name} ({item.count.toLocaleString()})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Financing */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("financing")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Financing</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.financing ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.financing && (
            <div className="px-4 pb-4 space-y-4">
              <div className="space-y-3">
                {[
                  { name: "Online Financing", count: 5886 },
                  { name: "Capital One", count: 4643 },
                  { name: "Chase", count: 1924 },
                  { name: "GLS", count: 3123 },
                  { name: "Westlake", count: 3247 },
                ].map((option) => (
                  <label
                    key={option.name}
                    className="flex items-center space-x-3"
                  >
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm text-gray-900">
                      {option.name} ({option.count.toLocaleString()})
                    </span>
                  </label>
                ))}
              </div>
              <a href="#" className="text-blue-600 text-sm hover:underline">
                Learn more about online financing
              </a>
            </div>
          )}
        </div>

        {/* Days on Market */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("daysOnMarket")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Days on market
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.daysOnMarket ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.daysOnMarket && (
            <div className="px-4 pb-4 space-y-4">
              <div className="text-sm text-gray-600">1 days - 1,000+ days</div>
              <input
                type="range"
                min="1"
                max="1000"
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Gas Mileage */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("gasMileage")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Gas mileage</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.gasMileage ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.gasMileage && (
            <div className="px-4 pb-4 space-y-4">
              <div className="text-sm text-gray-600">13 MPG - 143 MPG</div>
              <input
                type="range"
                min="13"
                max="143"
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* NHTSA Overall Safety Rating */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("safetyRating")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              NHTSA overall safety rating
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.safetyRating ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.safetyRating && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "⭐⭐⭐⭐⭐ 5 stars", count: 3853 },
                { name: "⭐⭐⭐⭐ 4+ stars", count: 4834 },
                { name: "⭐⭐⭐ 3+ stars", count: 4866 },
                { name: "No rating", count: 4686 },
              ].map((rating) => (
                <label
                  key={rating.name}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="radio"
                    name="safetyRating"
                    className="text-blue-600"
                  />
                  <span className="text-sm text-blue-600">
                    {rating.name} ({rating.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Drops */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("priceDrops")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Price drops</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.priceDrops ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.priceDrops && (
            <div className="px-4 pb-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="text-blue-600" />
                <span className="text-sm text-gray-900">
                  Only show recent price drops (965)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Dealer Rating */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("dealerRating")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Dealer rating
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.dealerRating ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.dealerRating && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "⭐⭐⭐⭐⭐ 5 stars", count: 1847 },
                { name: "⭐⭐⭐⭐ 4+ stars", count: 5776 },
                { name: "⭐⭐⭐ 3+ stars", count: 7835 },
                { name: "⭐⭐ 2+ stars", count: 8159 },
                { name: "⭐ 1+ stars", count: 8318 },
              ].map((rating) => (
                <label
                  key={rating.name}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="radio"
                    name="dealerRating"
                    className="text-blue-600"
                  />
                  <span className="text-sm text-blue-600">
                    {rating.name} ({rating.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Seller Type */}
        <div>
          <button
            onClick={() => toggleSection("sellerType")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Seller type</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.sellerType ? "rotate-180" : ""
              }`}
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
          </button>
          {expandedSections.sellerType && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { name: "Authorized Dealer", count: 1970 },
                { name: "CarGurus Partners", count: 8809 },
              ].map((type) => (
                <label key={type.name} className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-900">
                    {type.name} ({type.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

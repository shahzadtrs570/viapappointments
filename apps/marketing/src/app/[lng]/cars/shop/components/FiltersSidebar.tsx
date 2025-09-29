/* eslint-disable */
"use client"

import { useState } from "react"

interface FiltersSidebarProps {
  filters: {
    // Basic vehicle info
    make: string
    model: string
    yearRange: [number, number]
    trim: string
    bodyStyle: string
    condition: string
    status: string

    // Pricing
    priceRange: [number, number]
    priceCurrency: string
    msrpAmount: number

    // Vehicle specifications
    mileageRange: [number, number]
    fuelType: string
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
    hideWithAccidents: boolean
    hideWithFrameDamage: boolean
    hideWithTheftHistory: boolean
    hideFleet: boolean
    hideWithLemonHistory: boolean
    hideWithSalvageHistory: boolean
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
    [key: string]: any // Allow dynamic property access
  }
  onFilterChange: (filters: any) => void
  filterOptions?: {
    // Basic vehicle info
    makes: Array<{ value: string; count: number }>
    models: Array<{ value: string; count: number }>
    trims: Array<{ value: string; count: number }>
    bodyStyles: Array<{ value: string; count: number }>
    conditions: Array<{ value: string; count: number }>
    statuses: Array<{ value: string; count: number }>

    // Fuel and transmission
    fuelTypes: Array<{ value: string; count: number }>
    transmissions: Array<{ value: string; count: number }>
    drivetrains: Array<{ value: string; count: number }>

    // Colors
    exteriorColors: Array<{ value: string; count: number }>
    interiorColors: Array<{ value: string; count: number }>

    // Years
    years: Array<{ value: string; count: number }>

    // Ranges
    priceRange: { min: number; max: number }
    yearRange: { min: number; max: number }
    mileageRange: { min: number; max: number }
    engineSizeRange: { min: number; max: number }
    horsepowerRange: { min: number; max: number }
    mpgCityRange: { min: number; max: number }
    mpgHighwayRange: { min: number; max: number }
    mpgCombinedRange: { min: number; max: number }
  }
  isLoading?: boolean
}

export default function FiltersSidebar({
  filters,
  onFilterChange,
  filterOptions,
  isLoading,
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
    trim: false,
    condition: false,
    status: false,
    engineSpecs: false,
    mpgSpecs: false,
  })

  // Get filter options from API or fallback to empty arrays
  const makes = filterOptions?.makes?.map((item) => item.value) || []

  // Filter models based on selected make
  const filteredModels = localFilters.make
    ? filterOptions?.models?.filter((item) => {
        // This would need to be implemented based on your data structure
        // For now, we'll show all models
        return true
      }) || []
    : filterOptions?.models || []

  const models = filteredModels.map((item) =>
    typeof item === "string" ? item : item.value
  )
  const trims = filterOptions?.trims?.map((item) => item.value) || []
  const bodyStyles = filterOptions?.bodyStyles?.map((item) => item.value) || []
  const conditions = filterOptions?.conditions?.map((item) => item.value) || []
  const statuses = filterOptions?.statuses?.map((item) => item.value) || []
  const fuelTypes = filterOptions?.fuelTypes?.map((item) => item.value) || []
  const transmissions =
    filterOptions?.transmissions?.map((item) => item.value) || []
  const drivetrains =
    filterOptions?.drivetrains?.map((item) => item.value) || []

  const handleFilterUpdate = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value }

    // Clear model when make changes
    if (key === "make") {
      newFilters.model = ""
    }

    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleArrayFilterUpdate = (
    key: string,
    value: string,
    checked: boolean
  ) => {
    const currentArray = localFilters[key] || []
    let newArray
    if (checked) {
      newArray = [...currentArray, value]
    } else {
      newArray = currentArray.filter((item: string) => item !== value)
    }
    const newFilters = { ...localFilters, [key]: newArray }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleBooleanFilterUpdate = (key: string, value: boolean) => {
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
                disabled={isLoading}
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
                value={localFilters.model}
                onChange={(e) => handleFilterUpdate("model", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                disabled={isLoading}
              >
                <option value="">All models</option>
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
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
                disabled={isLoading}
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
                      disabled={isLoading}
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
                          filterOptions?.priceRange?.max ||
                          200000
                        handleFilterUpdate("priceRange", [
                          localFilters.priceRange[0],
                          value,
                        ])
                      }}
                      className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="px-2">
                  <input
                    type="range"
                    min={filterOptions?.priceRange?.min || 0}
                    max={filterOptions?.priceRange?.max || 200000}
                    step="1000"
                    value={localFilters.priceRange[1]}
                    onChange={(e) =>
                      handleFilterUpdate("priceRange", [
                        localFilters.priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isLoading}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Min Mileage
                  </label>
                  <input
                    type="number"
                    value={localFilters.mileageRange[0]}
                    onChange={(e) =>
                      handleFilterUpdate("mileageRange", [
                        parseInt(e.target.value) || 0,
                        localFilters.mileageRange[1],
                      ])
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Max Mileage
                  </label>
                  <input
                    type="number"
                    value={localFilters.mileageRange[1]}
                    onChange={(e) =>
                      handleFilterUpdate("mileageRange", [
                        localFilters.mileageRange[0],
                        parseInt(e.target.value) || 200000,
                      ])
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={localFilters.mileageRange[1]}
                  onChange={(e) =>
                    handleFilterUpdate("mileageRange", [
                      localFilters.mileageRange[0],
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isLoading}
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
                  <select
                    className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                    value={localFilters.yearRange[0]}
                    onChange={(e) =>
                      handleFilterUpdate("yearRange", [
                        parseInt(e.target.value),
                        localFilters.yearRange[1],
                      ])
                    }
                    disabled={isLoading}
                  >
                    <option value="1956">1956</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Max
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                    value={localFilters.yearRange[1]}
                    onChange={(e) =>
                      handleFilterUpdate("yearRange", [
                        localFilters.yearRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    disabled={isLoading}
                  >
                    <option value="2026">2026</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </div>
              </div>
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
                <input
                  type="checkbox"
                  className="mt-1 text-blue-600"
                  checked={localFilters.onlineFinancing || false}
                  onChange={(e) =>
                    handleBooleanFilterUpdate(
                      "onlineFinancing",
                      e.target.checked
                    )
                  }
                />
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
              {(filterOptions?.exteriorColors || []).map((color) => {
                // Color mapping for common colors
                const colorMap: { [key: string]: string } = {
                  Black: "#000000",
                  Blue: "#2563eb",
                  Brown: "#8b4513",
                  Gold: "#ffd700",
                  Gray: "#6b7280",
                  Green: "#10b981",
                  Orange: "#f97316",
                  Pink: "#ec4899",
                  Purple: "#8b5cf6",
                  Red: "#ef4444",
                  Silver: "#c0c0c0",
                  Teal: "#14b8a6",
                  White: "#ffffff",
                }
                return (
                  <label
                    key={color.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      className="text-blue-600"
                      checked={
                        localFilters.exteriorColor?.includes(color.value) ||
                        false
                      }
                      onChange={(e) =>
                        handleArrayFilterUpdate(
                          "exteriorColor",
                          color.value,
                          e.target.checked
                        )
                      }
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: colorMap[color.value] || "#cccccc",
                      }}
                    />
                    <span className="text-sm text-gray-900">
                      {color.value} ({color.count.toLocaleString()})
                    </span>
                  </label>
                )
              })}
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
              {(filterOptions?.interiorColors || []).map((color) => {
                // Color mapping for common colors
                const colorMap: { [key: string]: string } = {
                  Black: "#000000",
                  Beige: "#f5f5dc",
                  Brown: "#8b4513",
                  Gray: "#6b7280",
                  Red: "#ef4444",
                  White: "#ffffff",
                }
                return (
                  <label
                    key={color.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      className="text-blue-600"
                      checked={
                        localFilters.interiorColor?.includes(color.value) ||
                        false
                      }
                      onChange={(e) =>
                        handleArrayFilterUpdate(
                          "interiorColor",
                          color.value,
                          e.target.checked
                        )
                      }
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: colorMap[color.value] || "#cccccc",
                      }}
                    />
                    <span className="text-sm text-gray-900">
                      {color.value} ({color.count.toLocaleString()})
                    </span>
                  </label>
                )
              })}
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
              {(filterOptions?.drivetrains || []).map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    className="text-blue-600"
                    checked={
                      localFilters.drivetrain?.includes(option.value) || false
                    }
                    onChange={(e) =>
                      handleArrayFilterUpdate(
                        "drivetrain",
                        option.value,
                        e.target.checked
                      )
                    }
                  />
                  <span className="text-sm text-gray-900">
                    {option.value} ({option.count.toLocaleString()})
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
              {(filterOptions?.transmissions || []).map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    className="text-blue-600"
                    checked={
                      localFilters.transmission?.includes(option.value) || false
                    }
                    onChange={(e) =>
                      handleArrayFilterUpdate(
                        "transmission",
                        option.value,
                        e.target.checked
                      )
                    }
                  />
                  <span className="text-sm text-gray-900">
                    {option.value} ({option.count.toLocaleString()})
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

        {/* Engine - Disabled as data not available */}
        <div className="opacity-50">
          <button
            disabled
            className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
          >
            <span className="text-sm font-bold text-gray-900">Engine</span>
            <span className="text-xs text-gray-500">(Data not available)</span>
          </button>
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

        {/* Features - Disabled as data not available */}
        <div className="border-b border-gray-200 opacity-50">
          <button
            disabled
            className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
          >
            <span className="text-sm font-bold text-gray-900">Features</span>
            <span className="text-xs text-gray-500">(Data not available)</span>
          </button>
        </div>

        {/* Number of seats - Disabled as data not available */}
        <div className="border-b border-gray-200 opacity-50">
          <button
            disabled
            className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
          >
            <span className="text-sm font-bold text-gray-900">
              Number of seats
            </span>
            <span className="text-xs text-gray-500">(Data not available)</span>
          </button>
        </div>

        {/* Number of doors - Disabled as data not available */}
        <div className="border-b border-gray-200 opacity-50">
          <button
            disabled
            className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
          >
            <span className="text-sm font-bold text-gray-900">
              Number of doors
            </span>
            <span className="text-xs text-gray-500">(Data not available)</span>
          </button>
        </div>

        {/* Deal Rating - Disabled as data not available */}
        <div className="border-b border-gray-200 opacity-50">
          <button
            disabled
            className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
          >
            <span className="text-sm font-bold text-gray-900">Deal Rating</span>
            <span className="text-xs text-gray-500">(Data not available)</span>
          </button>
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
                <input
                  type="checkbox"
                  className="text-blue-600"
                  checked={localFilters.hideWithoutPhotos || false}
                  onChange={(e) =>
                    handleBooleanFilterUpdate(
                      "hideWithoutPhotos",
                      e.target.checked
                    )
                  }
                />
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
                <input
                  type="checkbox"
                  className="text-blue-600"
                  checked={localFilters.singleOwner || false}
                  onChange={(e) =>
                    handleBooleanFilterUpdate("singleOwner", e.target.checked)
                  }
                />
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
                    {
                      name: "Accidents Reported",
                      count: 2972,
                      key: "hideWithAccidents",
                    },
                    {
                      name: "Frame Damage",
                      count: 347,
                      key: "hideWithFrameDamage",
                    },
                    {
                      name: "Theft History Reported",
                      count: 104,
                      key: "hideWithTheftHistory",
                    },
                    {
                      name: "Fleet (e.g. rental or corporate)",
                      count: 2137,
                      key: "hideFleet",
                    },
                    {
                      name: "Lemon History Reported",
                      count: 35,
                      key: "hideWithLemonHistory",
                    },
                    {
                      name: "Salvage History Reported",
                      count: 214,
                      key: "hideWithSalvageHistory",
                    },
                  ].map((item) => (
                    <label
                      key={item.name}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        className="text-blue-600"
                        checked={localFilters[item.key] || false}
                        onChange={(e) =>
                          handleBooleanFilterUpdate(item.key, e.target.checked)
                        }
                      />
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
                <input
                  type="checkbox"
                  className="text-blue-600"
                  checked={localFilters.priceDrops || false}
                  onChange={(e) =>
                    handleBooleanFilterUpdate("priceDrops", e.target.checked)
                  }
                />
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

        {/* Trim */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("trim")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Trim</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.trim ? "rotate-180" : ""
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
          {expandedSections.trim && (
            <div className="px-4 pb-4 space-y-3">
              {(filterOptions?.trims || []).map((trim) => (
                <label key={trim.value} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="text-blue-600"
                    checked={localFilters.trim === trim.value}
                    onChange={(e) =>
                      handleFilterUpdate(
                        "trim",
                        e.target.checked ? trim.value : ""
                      )
                    }
                  />
                  <span className="text-sm text-gray-900">
                    {trim.value} ({trim.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Condition */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("condition")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Condition</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.condition ? "rotate-180" : ""
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
          {expandedSections.condition && (
            <div className="px-4 pb-4 space-y-3">
              {(filterOptions?.conditions || []).map((condition) => (
                <label
                  key={condition.value}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    className="text-blue-600"
                    checked={localFilters.condition === condition.value}
                    onChange={(e) =>
                      handleFilterUpdate(
                        "condition",
                        e.target.checked ? condition.value : ""
                      )
                    }
                  />
                  <span className="text-sm text-gray-900">
                    {condition.value} ({condition.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("status")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">Status</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.status ? "rotate-180" : ""
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
          {expandedSections.status && (
            <div className="px-4 pb-4 space-y-3">
              {(filterOptions?.statuses || []).map((status) => (
                <label
                  key={status.value}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    className="text-blue-600"
                    checked={localFilters.status === status.value}
                    onChange={(e) =>
                      handleFilterUpdate(
                        "status",
                        e.target.checked ? status.value : ""
                      )
                    }
                  />
                  <span className="text-sm text-gray-900">
                    {status.value} ({status.count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Engine Specifications */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("engineSpecs")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              Engine Specifications
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.engineSpecs ? "rotate-180" : ""
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
          {expandedSections.engineSpecs && (
            <div className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Min Engine Size (L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={localFilters.engineSize || ""}
                    onChange={(e) =>
                      handleFilterUpdate(
                        "engineSize",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Min Horsepower
                  </label>
                  <input
                    type="number"
                    value={localFilters.horsepower || ""}
                    onChange={(e) =>
                      handleFilterUpdate(
                        "horsepower",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MPG Specifications */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("mpgSpecs")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900">
              MPG Specifications
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.mpgSpecs ? "rotate-180" : ""
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
          {expandedSections.mpgSpecs && (
            <div className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Min City MPG
                  </label>
                  <input
                    type="number"
                    value={localFilters.mpgCity || ""}
                    onChange={(e) =>
                      handleFilterUpdate(
                        "mpgCity",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Min Highway MPG
                  </label>
                  <input
                    type="number"
                    value={localFilters.mpgHighway || ""}
                    onChange={(e) =>
                      handleFilterUpdate(
                        "mpgHighway",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Min Combined MPG
                </label>
                <input
                  type="number"
                  value={localFilters.mpgCombined || ""}
                  onChange={(e) =>
                    handleFilterUpdate(
                      "mpgCombined",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
                  disabled={isLoading}
                />
              </div>
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
                  <input
                    type="checkbox"
                    className="text-blue-600"
                    checked={
                      localFilters.sellerType?.includes(type.name) || false
                    }
                    onChange={(e) =>
                      handleArrayFilterUpdate(
                        "sellerType",
                        type.name,
                        e.target.checked
                      )
                    }
                  />
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

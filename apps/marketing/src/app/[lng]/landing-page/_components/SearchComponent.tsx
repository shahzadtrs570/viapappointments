/* eslint-disable */

"use client"

import { Container } from "@package/ui/container"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import carDataRaw from "../Car-MakeModel-Database-1950-to-present.json"

// Types
interface CarEntry {
  Year: number
  Make: string
  Model: string
}

// Type assertion for the imported JSON data
const carData = carDataRaw as CarEntry[]

export function SearchComponent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")
  const [searchData, setSearchData] = useState({
    // Buy tab data
    condition: "Used",
    make: "",
    model: "",
    // Sell tab data
    licensePlate: "",
    state: "State",
  })

  // Process car data to get unique makes and models per make
  const { makes, modelsByMake } = useMemo(() => {
    const makeSet = new Set<string>()
    const modelMap = new Map<string, Set<string>>()

    carData.forEach(({ Make, Model }: CarEntry) => {
      makeSet.add(Make)

      if (!modelMap.has(Make)) {
        modelMap.set(Make, new Set<string>())
      }
      modelMap.get(Make)?.add(Model)
    })

    // Convert to sorted arrays
    const sortedMakes = Array.from(makeSet).sort()
    const sortedModelsByMake: Record<string, string[]> = {}

    sortedMakes.forEach((make: string) => {
      const models = Array.from(modelMap.get(make) || new Set<string>()).sort()
      sortedModelsByMake[make] = models
    })

    return {
      makes: sortedMakes,
      modelsByMake: sortedModelsByMake,
    }
  }, [])

  const conditionOptions = ["New", "Used", "Certified Pre-Owned"]

  const stateOptions = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ]

  const handleInputChange = (field: string, value: string) => {
    setSearchData((prev) => {
      const newData = { ...prev, [field]: value }

      // If make changes, reset model to first available model for that make
      if (field === "make") {
        const availableModels = modelsByMake[value] || []
        newData.model = availableModels.length > 0 ? availableModels[0] : ""
      }

      return newData
    })
  }

  // Get available models for the selected make
  const availableModels = searchData.make
    ? modelsByMake[searchData.make] || []
    : []

  // Handle search navigation
  const handleSearch = () => {
    if (activeTab === "buy") {
      // Build search parameters
      const params = new URLSearchParams()
      
      // Always send condition (defaults to "Used")
      params.set("carType", searchData.condition || "Used")
      
      if (searchData.make && searchData.make !== "") {
        params.set("make", searchData.make)
      }
      
      if (searchData.model && searchData.model !== "") {
        params.set("model", searchData.model)
      }
      
      // Debug logging
      console.log("=== MAIN PAGE SEARCH DEBUG ===")
      console.log("searchData:", searchData)
      console.log("URL params:", params.toString())
      console.log("Full URL:", `/cars/shop?${params.toString()}`)
      console.log("==============================")
      
      // Navigate to cars shop page with search parameters
      router.push(`/cars/shop?${params.toString()}`)
    } else {
      // Handle sell/trade functionality (placeholder)
      console.log("Sell/Trade functionality not implemented yet")
    }
  }

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
      }}
    >
      <Container className="max-w-6xl text-center">
        {/* Hero Title */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            {activeTab === "buy"
              ? "Car shopping your way"
              : "Car selling your way"}
          </h1>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
          {/* Tab Switcher */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-50 rounded-full p-1 border border-gray-200">
              <button
                onClick={() => setActiveTab("buy")}
                className={`px-8 py-3 rounded-full text-lg font-bold transition-all duration-200 ${
                  activeTab === "buy"
                    ? "bg-gray-900 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveTab("sell")}
                className={`px-8 py-3 rounded-full text-lg font-bold transition-all duration-200 ${
                  activeTab === "sell"
                    ? "bg-gray-900 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Sell/Trade
              </button>
            </div>
          </div>

          {/* Buy Tab Content */}
          {activeTab === "buy" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Condition Dropdown */}
              <select
                value={searchData.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-lg text-gray-700 border-0 outline-none transition-all duration-200"
              >
                {conditionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Make Dropdown */}
              <select
                value={searchData.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-lg text-gray-700 border-0 outline-none transition-all duration-200"
              >
                <option value="" disabled>
                  Select Make
                </option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>

              {/* Model Dropdown */}
              <select
                value={searchData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                disabled={!searchData.make}
                className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-lg text-gray-700 border-0 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {searchData.make ? "Select Model" : "Select Make First"}
                </option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Search
              </button>
            </div>
          )}

          {/* Sell/Trade Tab Content */}
          {activeTab === "sell" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* License Plate Input */}
              <input
                type="text"
                value={searchData.licensePlate}
                onChange={(e) =>
                  handleInputChange("licensePlate", e.target.value)
                }
                placeholder="(EX.) C4R 6URU"
                className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-lg text-gray-700 placeholder-gray-500 border-0 outline-none transition-all duration-200"
              />

              {/* State Dropdown */}
              <select
                value={searchData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-lg text-gray-700 border-0 outline-none transition-all duration-200"
              >
                <option value="State" disabled>
                  State
                </option>
                {stateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Get Offers Button */}
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                Get your offers
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

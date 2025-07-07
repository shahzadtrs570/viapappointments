/* eslint-disable */

"use client"

import { Container } from "@package/ui/container"
import { useState } from "react"

export function SearchComponent() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")
  const [searchData, setSearchData] = useState({
    // Buy tab data
    condition: "Used",
    make: "Bentley",
    model: "All models",
    zipCode: "",
    // Sell tab data
    licensePlate: "",
    state: "State",
  })

  const conditionOptions = ["New", "Used", "Certified Pre-Owned"]
  const makeOptions = [
    "Audi",
    "BMW",
    "Bentley",
    "Honda",
    "Toyota",
    "Mercedes",
    "Ford",
    "Volkswagen",
    "Lexus",
    "Nissan",
    "Porsche",
    "Subaru",
    "Chevrolet",
    "Hyundai",
  ]
  const modelOptions = [
    "All models",
    "Continental",
    "Bentayga",
    "Flying Spur",
    "Mulsanne",
  ]
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
  ]

  const handleInputChange = (field: string, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }))
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
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
                {makeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Model Dropdown */}
              <select
                value={searchData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-lg text-gray-700 border-0 outline-none transition-all duration-200"
              >
                {modelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* ZIP Code Input */}
              <input
                type="text"
                value={searchData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                placeholder="ZIP code"
                className="w-full px-4 py-4 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-lg text-gray-700 placeholder-gray-500 border-0 outline-none transition-all duration-200"
              />

              {/* Search Button */}
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
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

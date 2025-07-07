/* eslint-disable */
"use client"

import { Container } from "@package/ui/container"
import { useState } from "react"

const carTypes = {
  "SUV/Crossovers": [
    "Acura MDX", "Audi Q5", "Audi Q7", "BMW X3", "BMW X5", "Cadillac Escalade",
    "Chevrolet Equinox", "Chevrolet Suburban", "Chevrolet Tahoe", "Chevrolet Traverse",
    "Dodge Durango", "Ford Escape", "Ford Expedition", "Ford Explorer", "GMC Acadia",
    "GMC Yukon", "Honda CR-V", "Honda HR-V", "Honda Pilot", "Hyundai Santa Fe",
    "Jeep Grand Cherokee", "Jeep Wrangler", "Kia Sorento", "Land Rover Range Rover",
    "Land Rover Range Rover Sport", "Lexus GX", "Lexus RX", "Mazda CX-5",
    "Mercedes-Benz GLC", "Mercedes-Benz GLE", "Nissan Pathfinder", "Nissan Rogue",
    "Subaru Outback", "Toyota 4Runner", "Toyota Highlander", "Toyota RAV4",
    "Volkswagen Atlas", "Volkswagen Tiguan", "Volvo XC60", "Volvo XC90"
  ],
  "Sedans": [
    "Audi A4", "BMW 3 Series", "BMW 5 Series", "Chevrolet Cruze", "Chevrolet Impala",
    "Chevrolet Malibu", "Chrysler 300", "Dodge Charger", "Ford Fusion", "Honda Accord",
    "Honda Civic", "Hyundai Elantra", "INFINITI Q50", "Lexus ES", "Mazda MAZDA3",
    "Mercedes-Benz C-Class", "Mercedes-Benz E-Class", "Mercedes-Benz S-Class",
    "Nissan Altima", "Nissan Maxima", "Tesla Model 3", "Toyota Camry", "Toyota Corolla",
    "Volkswagen Jetta"
  ],
  "Pickup trucks": [
    "Chevrolet Colorado", "Chevrolet Silverado 1500", "Chevrolet Silverado 2500HD",
    "Chevrolet Silverado 3500", "Dodge RAM 1500", "Dodge RAM 2500", "Dodge RAM 3500",
    "Ford F-150", "Ford F-250 Super Duty", "Ford F-350 Super Duty", "Ford Ranger",
    "GMC Sierra 1500", "GMC Sierra 2500HD", "Honda Ridgeline", "Jeep Gladiator",
    "Nissan Frontier", "RAM 1500", "RAM 2500", "RAM 3500", "Toyota Tacoma", "Toyota Tundra"
  ],
  "Hatchbacks": [
    "MINI Cooper", "Toyota Prius", "Subaru Forester", "Subaru Impreza"
  ],
  "Vans/Minivans": [
    "Ford Transit Cargo", "RAM ProMaster", "Honda Odyssey", "Toyota Sienna"
  ],
  "Coupes": [
    "BMW 4 Series", "Chevrolet Camaro", "Chevrolet Corvette", "Dodge Challenger",
    "Ford Mustang", "Porsche 911"
  ]
}

export function ExploreCarTypes() {
  const [activeTab, setActiveTab] = useState("SUV/Crossovers")
  
  const tabKeys = Object.keys(carTypes)
  
  return (
    <section className="bg-white py-16 dark:bg-background">
      <Container className="max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            By type
          </h2>
          <button className="group relative text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            <span className="relative">
              View All {activeTab}
              <span className="absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 w-full group-hover:w-0"></span>
              <span className="absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 delay-300 w-0 group-hover:w-full"></span>
            </span>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex gap-6" aria-label="Tabs">
              {tabKeys.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`whitespace-nowrap border-b-2 py-2 text-sm font-medium transition-colors ${
                    activeTab === type
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Car Models Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {carTypes[activeTab as keyof typeof carTypes].map((model, index) => (
            <div
              key={`${activeTab}-${model}-${index}`}
              className="rounded-lg p-3"
            >
              <span className="group relative inline-block cursor-pointer text-sm font-medium text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                {model}
                <span className="absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 w-0 group-hover:w-full"></span>
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
} 
/* eslint-disable */
"use client"

import { Container } from "@package/ui/container"
import logoData from "../All_US_Car_Brand_Logos_Links.json"

// Types
interface LogoEntry {
  Manufacturer: string
  "Logo URL": string
}

// Type assertion for the imported JSON data
const logos = logoData as LogoEntry[]

// Filter to popular makes and create the carMakes array
const popularMakes = [
  "Audi",
  "BMW",
  "Honda",
  "Toyota",
  "Bentley",
  "Mercedes-Benz",
  "Ford",
  "Volkswagen",
  "Lexus",
  "Nissan",
  "Porsche",
  "Subaru",
]

const carMakes = popularMakes
  .map((makeName) => {
    // Find the logo data for this make
    const logoEntry = logos.find(
      (logo) =>
        logo.Manufacturer === makeName ||
        logo.Manufacturer === makeName.replace("-", "-") ||
        (makeName === "Mercedes" && logo.Manufacturer === "Mercedes-Benz")
    )

    return {
      name: makeName,
      logoUrl: logoEntry?.["Logo URL"] || "",
      manufacturer: logoEntry?.Manufacturer || makeName,
    }
  })
  .filter((make) => make.logoUrl) // Only include makes with valid logo URLs

export function ExploreCarMakes() {
  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <Container className="max-w-6xl">
        <div className="mb-12">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Explore popular cars
          </h2>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              By make
            </h3>
            <button className="group relative text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              <span className="relative">
                View All Makes
                <span className="absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 w-full group-hover:w-0"></span>
                <span className="absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 delay-300 w-0 group-hover:w-full"></span>
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {carMakes.map((make) => (
            <div
              key={make.name}
              className="group flex cursor-pointer flex-col items-center rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 dark:bg-gray-800"
            >
              <div className="mb-4 flex h-20 w-full items-center justify-center">
                <img
                  src={make.logoUrl}
                  alt={`${make.name} logo`}
                  className="h-16 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to a generic car icon if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    target.nextElementSibling?.classList.remove("hidden")
                  }}
                />
                <div className="hidden h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3a1 1 0 00-1 1v1.4L7.2 7H5a1 1 0 00-1 1v2a1 1 0 001 1h.6l1.6 4.8a1 1 0 00.95.7h5.7a1 1 0 00.95-.7L16.4 11H17a1 1 0 001-1V8a1 1 0 00-1-1h-2.2L13 5.4V4a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-center text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {make.name}
              </h4>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

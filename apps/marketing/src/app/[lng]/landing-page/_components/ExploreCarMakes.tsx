/* eslint-disable */
"use client"

import { Container } from "@package/ui/container"

const carMakes = [
  {
    name: "Audi",
    logo: (
      <svg viewBox="0 0 256 162" className="h-16 w-auto">
        <g fill="#BB0A30">
          <circle cx="59.5" cy="81" r="58.5"/>
          <circle cx="135.5" cy="81" r="58.5" fillOpacity="0.8"/>
          <circle cx="196.5" cy="81" r="58.5" fillOpacity="0.6"/>
          <circle cx="118" cy="81" r="58.5" fillOpacity="0.4"/>
        </g>
      </svg>
    )
  },
  {
    name: "BMW",
    logo: (
      <svg viewBox="0 0 256 256" className="h-16 w-auto">
        <circle cx="128" cy="128" r="120" fill="#0066B2" stroke="#000" strokeWidth="8"/>
        <path d="M128 8 A120 120 0 0 1 128 248 A120 120 0 0 1 128 8 Z M128 20 A108 108 0 0 0 128 236 A108 108 0 0 0 128 20 Z" fill="#fff"/>
        <path d="M128 20 L128 128 L20 128 A108 108 0 0 1 128 20 Z" fill="#0066B2"/>
        <path d="M128 128 L236 128 L128 236 A108 108 0 0 1 128 128 Z" fill="#0066B2"/>
        <path d="M128 20 L236 128 L128 128 A108 108 0 0 1 128 20 Z" fill="#fff"/>
        <path d="M20 128 L128 236 L128 128 A108 108 0 0 1 20 128 Z" fill="#fff"/>
      </svg>
    )
  },
  {
    name: "Honda",
    logo: (
      <svg viewBox="0 0 256 256" className="h-16 w-auto">
        <rect width="256" height="256" fill="#C8102E"/>
        <path d="M64 64 L64 192 L80 192 L80 136 L176 136 L176 192 L192 192 L192 64 L176 64 L176 120 L80 120 L80 64 Z" fill="white"/>
      </svg>
    )
  },
  {
    name: "Toyota",
    logo: (
      <svg viewBox="0 0 256 80" className="h-16 w-auto">
        <rect width="256" height="80" fill="#E60012"/>
        <ellipse cx="80" cy="40" rx="30" ry="25" fill="white"/>
        <ellipse cx="40" cy="40" rx="25" ry="30" fill="white"/>
        <ellipse cx="65" cy="40" rx="20" ry="20" fill="#E60012"/>
        <text x="140" y="50" fill="white" fontSize="32" fontWeight="bold">TOYOTA</text>
      </svg>
    )
  },
  {
    name: "Bentley",
    logo: (
      <svg viewBox="0 0 256 160" className="h-16 w-auto">
        <ellipse cx="128" cy="80" rx="120" ry="72" fill="#003366"/>
        <path d="M128 20 L158 80 L128 140 L98 80 Z" fill="white"/>
        <circle cx="128" cy="50" r="8" fill="#003366"/>
        <path d="M118 70 L138 70 L138 90 L118 90 Z" fill="#003366"/>
        <text x="128" y="110" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">B</text>
      </svg>
    )
  },
  {
    name: "Mercedes",
    logo: (
      <svg viewBox="0 0 256 256" className="h-16 w-auto">
        <circle cx="128" cy="128" r="120" fill="#00ADEF"/>
        <circle cx="128" cy="128" r="100" fill="white"/>
        <path d="M128 40 L128 128 L40 190 A100 100 0 0 1 128 40 Z" fill="#00ADEF"/>
        <path d="M128 128 L216 190 A100 100 0 0 1 40 190 L128 128 Z" fill="#00ADEF"/>
        <path d="M128 40 L216 190 A100 100 0 0 1 128 128 L128 40 Z" fill="#00ADEF"/>
        <circle cx="128" cy="128" r="12" fill="white"/>
      </svg>
    )
  },
  {
    name: "Ford",
    logo: (
      <svg viewBox="0 0 256 100" className="h-16 w-auto">
        <ellipse cx="128" cy="50" rx="120" ry="40" fill="#003478"/>
        <text x="128" y="60" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold" fontStyle="italic">Ford</text>
      </svg>
    )
  },
  {
    name: "Volkswagen",
    logo: (
      <svg viewBox="0 0 256 256" className="h-16 w-auto">
        <circle cx="128" cy="128" r="120" fill="#1E3A8A"/>
        <circle cx="128" cy="128" r="100" fill="white"/>
        <path d="M90 80 L128 150 L166 80 L128 90 Z" fill="#1E3A8A"/>
        <circle cx="128" cy="110" r="20" fill="#1E3A8A"/>
        <text x="128" y="190" textAnchor="middle" fill="#1E3A8A" fontSize="24" fontWeight="bold">VW</text>
      </svg>
    )
  },
  {
    name: "Lexus",
    logo: (
      <svg viewBox="0 0 256 160" className="h-16 w-auto">
        <ellipse cx="128" cy="80" rx="120" ry="72" fill="#000"/>
        <ellipse cx="128" cy="80" rx="100" ry="60" fill="white"/>
        <text x="128" y="90" textAnchor="middle" fill="black" fontSize="32" fontWeight="bold">L</text>
      </svg>
    )
  },
  {
    name: "Nissan",
    logo: (
      <svg viewBox="0 0 256 80" className="h-16 w-auto">
        <rect width="256" height="80" fill="#C3002F"/>
        <circle cx="128" cy="40" r="30" fill="white"/>
        <text x="128" y="50" textAnchor="middle" fill="#C3002F" fontSize="16" fontWeight="bold">NISSAN</text>
      </svg>
    )
  },
  {
    name: "Porsche",
    logo: (
      <svg viewBox="0 0 256 256" className="h-16 w-auto">
        <rect width="256" height="256" fill="#000"/>
        <rect x="32" y="32" width="192" height="192" fill="#D4AF37"/>
        <circle cx="128" cy="128" r="60" fill="#000"/>
        <text x="128" y="140" textAnchor="middle" fill="#D4AF37" fontSize="24" fontWeight="bold">PORSCHE</text>
      </svg>
    )
  },
  {
    name: "Subaru",
    logo: (
      <svg viewBox="0 0 256 160" className="h-16 w-auto">
        <ellipse cx="128" cy="80" rx="120" ry="72" fill="#003478"/>
        <circle cx="100" cy="60" r="12" fill="white"/>
        <circle cx="156" cy="60" r="12" fill="white"/>
        <circle cx="128" cy="45" r="16" fill="white"/>
        <circle cx="80" cy="100" r="10" fill="white"/>
        <circle cx="176" cy="100" r="10" fill="white"/>
        <circle cx="128" cy="115" r="14" fill="white"/>
      </svg>
    )
  }
]

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
                {make.logo}
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
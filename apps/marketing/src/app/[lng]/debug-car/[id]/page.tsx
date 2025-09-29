"use client"

import { useEffect, useState } from "react"

interface DebugInfo {
  requestedId: string
  sampleIds: Array<{
    id: string
    title: string
    model: string
    year: string | number
    price: string
  }>
  totalItems: number
  foundCar?: {
    id: string
    title: string
    model: string
    year: string | number
    price: string
  }
  allIds: string[]
}

export default function DebugCarPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDebugInfo = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load just one file to test
        const response = await fetch(
          "/data/alderman_auto_data_2025-09-11T21-25-05.json"
        )

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          )
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error("Data is not an array")
        }

        // Show first 5 items with their IDs
        const sampleData = data
          .slice(0, 5)
          .map((car: unknown, index: number) => {
            const carData = car as Record<string, unknown>
            return {
              id: `alderman_auto_data_2025-09-11T21-25-05.json-${index}`,
              title: (carData.title as string) || "No title",
              model: (carData.model as string) || "No model",
              year: (carData.year as string | number) || "No year",
              price: (carData.price as string) || "No price",
            }
          })

        const foundCar = sampleData.find((car) => car.id === id)

        setDebugInfo({
          requestedId: id,
          sampleIds: sampleData,
          totalItems: data.length,
          foundCar: foundCar,
          allIds: data
            .slice(0, 10)
            .map(
              (car: unknown, index: number) =>
                `alderman_auto_data_2025-09-11T21-25-05.json-${index}`
            ),
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    void loadDebugInfo()
  }, [id])

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-b-2 border-blue-600" />
          <span className="ml-2">Loading debug info...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Debug Car Page - Error
        </h1>
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <strong>Error:</strong> {error}
        </div>
        <div className="mt-4">
          <strong>Requested ID:</strong> {id}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Debug Car Page</h1>

      {/* Status indicators */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          className={`rounded-lg border p-4 ${
            debugInfo?.foundCar
              ? "border-green-400 bg-green-100"
              : "border-yellow-400 bg-yellow-100"
          }`}
        >
          <div className="font-semibold">Car Status</div>
          <div
            className={
              debugInfo?.foundCar ? "text-green-700" : "text-yellow-700"
            }
          >
            {debugInfo?.foundCar ? "✅ Found" : "⚠️ Not Found"}
          </div>
        </div>

        <div className="rounded-lg border border-blue-400 bg-blue-100 p-4">
          <div className="font-semibold">Data Status</div>
          <div className="text-blue-700">
            {debugInfo?.totalItems || 0} items loaded
          </div>
        </div>

        <div className="rounded-lg border border-gray-400 bg-gray-100 p-4">
          <div className="font-semibold">Requested ID</div>
          <div className="font-mono text-sm text-gray-700">
            {debugInfo?.requestedId}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <strong>Requested ID:</strong>{" "}
              <code className="rounded bg-gray-100 px-2 py-1">
                {debugInfo?.requestedId}
              </code>
            </div>
            <div>
              <strong>Total items in file:</strong> {debugInfo?.totalItems}
            </div>
          </div>
        </div>

        {/* Sample IDs */}
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Sample IDs (First 5)</h2>
          <ul className="space-y-2">
            {debugInfo?.sampleIds.map((item) => (
              <li
                key={item.id}
                className={`rounded p-2 ${
                  item.id === debugInfo.requestedId
                    ? "border border-green-400 bg-green-100"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <code className="font-mono text-sm">{item.id}</code>
                    {item.id === debugInfo.requestedId && (
                      <span className="ml-2 font-semibold text-green-600">
                        ← MATCH
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{item.title}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* All Available IDs */}
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">
            All Available IDs (First 10)
          </h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {debugInfo?.allIds.map((id: string) => (
              <div
                key={id}
                className={`rounded p-2 font-mono text-sm ${
                  id === debugInfo.requestedId
                    ? "border border-green-400 bg-green-100"
                    : "bg-gray-50"
                }`}
              >
                {id}
                {id === debugInfo.requestedId && (
                  <span className="ml-2 font-semibold text-green-600">
                    ← MATCH
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Found Car Details */}
        {debugInfo?.foundCar && (
          <div className="rounded-lg border border-green-400 bg-green-50 p-4">
            <h2 className="mb-3 text-lg font-semibold text-green-800">
              Found Car Details
            </h2>
            <div className="rounded border bg-white p-4">
              <pre className="overflow-x-auto text-sm">
                {JSON.stringify(debugInfo.foundCar, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Test Links */}
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Test Links</h2>
          <div className="space-y-2">
            {debugInfo?.sampleIds.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded bg-gray-50 p-2"
              >
                <span className="text-sm">{item.title}</span>
                <a
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  href={`/en/cars/shop/${item.id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View Details →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

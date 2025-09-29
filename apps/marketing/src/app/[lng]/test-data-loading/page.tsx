"use client"

import { useState, useEffect } from "react"

export default function TestDataLoadingPage() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Test loading one file
        const response = await fetch(
          "/data/alderman_auto_data_2025-09-11T21-25-05.json"
        )
        if (response.ok) {
          const jsonData = await response.json()

          // Show first 3 items with their generated IDs
          const sampleData = jsonData
            .slice(0, 3)
            .map((car: any, index: number) => ({
              id: `alderman_auto_data_2025-09-11T21-25-05.json-${index}`,
              title: car.title,
              model: car.model,
              year: car.year,
              price: car.price,
            }))

          setData({
            totalItems: jsonData.length,
            sampleItems: sampleData,
            firstItemId: sampleData[0]?.id,
          })
        } else {
          setData({ error: `Failed to load: ${response.status}` })
        }

        setIsLoading(false)
      } catch (err) {
        setData({ error: err.message })
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) return <div className="p-8">Loading test data...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Loading Test</h1>
      {data?.error ? (
        <div className="text-red-600">Error: {data.error}</div>
      ) : (
        <div className="space-y-4">
          <div>
            <strong>Total items:</strong> {data?.totalItems}
          </div>
          <div>
            <strong>First item ID:</strong> {data?.firstItemId}
          </div>
          <div>
            <strong>Sample items:</strong>
            <ul className="ml-4">
              {data?.sampleItems?.map((item: any) => (
                <li key={item.id} className="text-sm">
                  <strong>ID:</strong> {item.id}
                  <br />
                  <strong>Title:</strong> {item.title}
                  <br />
                  <strong>Model:</strong> {item.model}
                  <br />
                  <strong>Year:</strong> {item.year}
                  <br />
                  <strong>Price:</strong> {item.price}
                  <br />
                  <hr className="my-2" />
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <strong>Test links:</strong>
            <ul className="ml-4">
              {data?.sampleItems?.map((item: any) => (
                <li key={item.id}>
                  <a
                    href={`/en/cars/shop/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

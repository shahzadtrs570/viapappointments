"use client"

import { useState, useEffect } from "react"

export default function TestDataPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          "/data/alderman_auto_data_2025-09-11T21-25-05.json"
        )
        if (response.ok) {
          const jsonData = await response.json()
          setData(jsonData.slice(0, 5)) // Show first 5 items
        } else {
          setError("Failed to load data")
        }
      } catch (err) {
        setError("Error loading data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return <div>No data</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Data Loading</h1>
      <p className="mb-4">Loaded {data.length} cars from JSON file</p>
      <div className="space-y-4">
        {data.map((car: any, index: number) => (
          <div key={index} className="border p-4 rounded">
            <h3 className="font-bold">{car.title}</h3>
            <p>Price: {car.price}</p>
            <p>Year: {car.year}</p>
            <p>Model: {car.model}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function PaginationTestPage() {
  const searchParams = useSearchParams()
  const [testData, setTestData] = useState<any[]>([])

  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const itemsPerPage = 15

  useEffect(() => {
    // Create test data
    const data = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      page: Math.ceil((i + 1) / itemsPerPage),
    }))
    setTestData(data)
  }, [])

  const totalPages = Math.ceil(testData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = testData.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete("page")
    } else {
      params.set("page", page.toString())
    }
    const queryString = params.toString()
    const newUrl = queryString
      ? `/en/pagination-test?${queryString}`
      : `/en/pagination-test`
    window.location.href = newUrl
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pagination Test</h1>
      <div className="mb-4">
        <p>Current Page: {currentPage}</p>
        <p>Total Pages: {totalPages}</p>
        <p>Items per Page: {itemsPerPage}</p>
        <p>Total Items: {testData.length}</p>
        <p>
          Showing items {startIndex + 1} to{" "}
          {Math.min(endIndex, testData.length)}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Current Page Items:</h2>
        <div className="grid grid-cols-5 gap-2">
          {currentItems.map((item) => (
            <div key={item.id} className="p-2 bg-gray-100 rounded text-sm">
              {item.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-2 rounded ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

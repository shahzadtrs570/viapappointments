"use client"

import { useEffect } from "react"

import { useSearchParams } from "next/navigation"

// eslint-disable-next-line no-console
export function useEligibilityData() {
  const searchParams = useSearchParams()

  useEffect(() => {
    try {
      const eligibilityParam = searchParams.get("eligibility")

      if (eligibilityParam) {
        // Parse and store the eligibility data from URL parameter
        const parsedData = JSON.parse(decodeURIComponent(eligibilityParam))
        localStorage.setItem("eligibility", JSON.stringify(parsedData))
      } else {
        // Check if we already have eligibility data in localStorage
        const existingData = localStorage.getItem("eligibility")

        // Only initialize with empty object if no data exists
        if (!existingData) {
          localStorage.setItem("eligibility", JSON.stringify({}))
        }
      }
    } catch (err) {
      console.error("Error processing eligibility data:", err)

      // Keep existing data on error, or initialize with empty if none exists
      const existingData = localStorage.getItem("eligibility")
      if (!existingData) {
        localStorage.setItem("eligibility", JSON.stringify({}))
      }
    }
  }, [searchParams])
}

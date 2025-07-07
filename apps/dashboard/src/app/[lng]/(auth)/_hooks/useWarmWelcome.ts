// eslint-disable-next-line no-console
"use client"

import { useEffect, useState } from "react"

import { useSearchParams } from "next/navigation"

export interface WarmWelcomeData {
  firstName: string
  lastName: string
  email: string
  acceptTerms: boolean
  acceptMarketing: boolean
  eligibilityData?: Record<string, string>
}

export function useWarmWelcome() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [eligibilityData, setEligibilityData] = useState<
    Record<string, string>
  >({})
  const searchParams = useSearchParams()

  // Process eligibility data from URL or localStorage on component mount
  useEffect(() => {
    const processEligibilityData = () => {
      const eligibilityParam = searchParams.get("eligibility")

      if (eligibilityParam) {
        try {
          // Ensure we properly decode and parse the eligibility data
          const decodedData = decodeURIComponent(eligibilityParam)

          const parsedData = JSON.parse(decodedData)

          // Store eligibility data in localStorage
          localStorage.setItem("eligibility", JSON.stringify(parsedData))
          setEligibilityData(parsedData)
        } catch (e) {
          console.error("Error parsing eligibility data from URL:", e)
        }
      } else {
        // Try to get eligibility data from localStorage if not in URL
        try {
          const storedEligibility = localStorage.getItem("eligibility")
          if (storedEligibility) {
            const parsedData = JSON.parse(storedEligibility)
            setEligibilityData(parsedData)
          }
        } catch (e) {
          console.error(
            "Error retrieving eligibility data from localStorage:",
            e
          )
        }
      }
    }

    processEligibilityData()
  }, [searchParams])

  const warmWelcome = async (data: WarmWelcomeData) => {
    try {
      setIsLoading(true)
      setError(null)
      setErrorCode(null)

      // Include stored eligibility data in the request
      const response = await fetch("/api/auth/warmWelcome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          eligibilityData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMessage = result.error || "Failed to complete warm welcome"
        setError(errorMessage)
        // Set error code if it exists
        if (result.code) {
          setErrorCode(result.code)
        }
        throw new Error(errorMessage)
      }

      // If we have a direct sign-in URL, redirect to it
      if (result.success && result.directSignInUrl) {
        window.location.href = result.directSignInUrl
      } else if (result.success && result.baseUrl) {
        // Fallback for new user creation flow
        window.location.href = result.baseUrl
      }
    } catch (err) {
      console.error("Warm welcome error:", err)
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    warmWelcome,
    isLoading,
    error,
    errorCode,
  }
}

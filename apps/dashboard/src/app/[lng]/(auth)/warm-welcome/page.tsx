// eslint-disable-next-line no-console
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
"use client"

import { useEffect, useState } from "react"

import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"

import type { ReadonlyURLSearchParams } from "next/navigation"

import { WarmWelcomeForm } from "../_components/Auth/warmWelcomeForm"
import { useEligibilityData } from "../_hooks/useEligibilityData"

interface EligibilityData {
  [key: string]: string
}

export default function WarmWelcomePage() {
  const [isEligibilityChecked, setIsEligibilityChecked] =
    useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false)
  const searchParams: ReadonlyURLSearchParams = useSearchParams()
  const session = useSession()
  // Use the hook to save eligibility data to localStorage
  useEligibilityData()

  useEffect(() => {
    const checkEligibility = async (): Promise<void> => {
      try {
        setIsLoading(true)

        // First check URL parameters for eligibility data
        const rawEligibilityParam: string | null =
          searchParams.get("eligibility")

        let eligibilityData: EligibilityData | null = null

        // Try to parse eligibility data from URL parameters
        if (rawEligibilityParam) {
          try {
            eligibilityData = JSON.parse(
              decodeURIComponent(rawEligibilityParam)
            )
          } catch (e) {
            console.error("Error parsing eligibility data from URL:", e)
            // We'll continue and try localStorage as fallback
          }
        }

        // If no valid data from URL parameters, check localStorage as fallbacks
        if (!eligibilityData && typeof window !== "undefined") {
          try {
            const storedEligibility = localStorage.getItem("eligibility")
            if (storedEligibility) {
              eligibilityData = JSON.parse(storedEligibility)
            }
          } catch (e) {
            console.error(
              "Error parsing eligibility data from localStorage:",
              e
            )
          }
        }

        // If we still don't have valid eligibility data after checking both sources
        if (!eligibilityData) {
          console.error("No eligibility data found in URL or localStorage")
          await redirectToEligibilityCheck(
            "No eligibility data found. Please complete the eligibility check."
          )
          return
        }

        // Now validate the eligibility data (regardless of source)
        if (typeof eligibilityData !== "object") {
          console.error("Invalid eligibility data format")
          await redirectToEligibilityCheck(
            "Invalid eligibility data. Please complete the eligibility check again."
          )
          return
        }

        // Check if essential fields exist and are not empty
        const requiredFields: string[] = [
          "country",
          "property-ownership",
          "age",
        ]
        const hasRequiredFields: boolean = requiredFields.every(
          (field) =>
            eligibilityData &&
            eligibilityData[field] &&
            eligibilityData[field].trim() !== ""
        )

        if (!hasRequiredFields) {
          console.error("Missing required eligibility fields")
          await redirectToEligibilityCheck(
            "Incomplete eligibility data. Please answer all required questions."
          )
          return
        }

        // Check if enough questions were answered (at least 3)
        if (Object.keys(eligibilityData).length < 3) {
          console.error("Not enough eligibility fields")
          await redirectToEligibilityCheck(
            "Please complete all eligibility questions."
          )
          return
        }

        // Check if any eligibility-failing answers were provided
        if (
          eligibilityData.country === "other" ||
          eligibilityData["property-ownership"] === "no" ||
          eligibilityData.age === "under-55"
        ) {
          console.error("User gave ineligible answers")
          await redirectToEligibilityCheck(
            "Based on your answers, you may not be eligible for our services."
          )
          return
        }

        // All checks passed, mark as eligible
        setIsEligibilityChecked(true)
      } catch (e) {
        console.error("Unexpected error checking eligibility:", e)
        await redirectToEligibilityCheck(
          "Error processing eligibility data. Please try again."
        )
      } finally {
        setIsLoading(false)
      }
    }

    const redirectToEligibilityCheck = async (
      errorMessage: string
    ): Promise<void> => {
      const marketingUrl: string = process.env.NEXT_PUBLIC_MARKETING_URL || ""
      const encodedError: string = encodeURIComponent(errorMessage)
      window.location.href = `${marketingUrl}/eligibility?error=${encodedError}`
    }

    // Only check eligibility if user is authenticated or still loading auth status
    if (session.status === "authenticated" || session.status === "loading") {
      checkEligibility()
    }
  }, [searchParams, session])

  useEffect(() => {
    if (session.status === "authenticated" && isEligibilityChecked) {
      setIsRedirecting(true)
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/`
    }
  }, [session, isEligibilityChecked])

  // Show loading or redirecting state
  if (isLoading || isRedirecting || session.status === "loading") {
    const getLoadingMessage = () => {
      if (isRedirecting) return "Redirecting to dashboard..."
      if (session.status === "loading") return "Checking authentication..."
      return "Verifying eligibility..."
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">{getLoadingMessage()}</p>
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  // Don't render the form until we've verified eligibility
  if (!isEligibilityChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">
            Redirecting to eligibility Page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-[600px] p-4 md:px-0">
        <WarmWelcomeForm />
      </div>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect } from "react"

import { PreProductionBanner } from "@/components/PreProductionBanner"
import { api } from "@/lib/trpc/react"

import { PaymentSuccessDialog } from "./_components/PaymentSuccessDialog/PaymentSuccessDialog"
import { Wizard } from "./_components/Wizard/Wizard"

// Metadata is moved to a separate file metadata.ts

type DashboardPageProps = {
  searchParams?: {
    billing: string
  }
  params: {
    lng: string
  }
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const saveEligibility = api.property.eligibility.saveEligibility.useMutation(
    {}
  )

  // Sync eligibility data to database when user is logged in
  useEffect(() => {
    // Only sync if we have eligibility data in localStorage
    // and there's no conflict with existing data from database
    const syncEligibilityData = () => {
      try {
        const eligibilityData = localStorage.getItem("eligibility")
        if (eligibilityData) {
          const parsedData = JSON.parse(eligibilityData)
          if (Object.keys(parsedData).length > 0) {
            // Call the API to save eligibility data
            saveEligibility.mutate(parsedData)
          }
        }
      } catch (error) {
        console.error("Error syncing eligibility data:", error)
      }
    }

    // Run once on component mount
    syncEligibilityData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <PreProductionBanner />
      <Wizard />
      <PaymentSuccessDialog billing={searchParams?.billing} />
    </div>
  )
}

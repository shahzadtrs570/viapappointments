/*eslint-disable import/order*/
"use client"

import { useEffect, useState } from "react"
import { useToast } from "@package/ui/toast"
import {
  baseWaitlistConfig,
  WaitlistForm,
  type WaitlistFormData,
} from "@package/ui/waitlist"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { api } from "@/lib/trpc/react"

export function WaitlistContent() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const waitlistMutation = api.waitlist.create.useMutation()
  const [isClient, setIsClient] = useState(false)

  // Fix hydration mismatch by only running client-side code after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  const getTrackingData = () => {
    if (!isClient) return {}

    const utmParams = {
      utm_source: searchParams.get("utm_source"),
      utm_medium: searchParams.get("utm_medium"),
      utm_campaign: searchParams.get("utm_campaign"),
      utm_term: searchParams.get("utm_term"),
      utm_content: searchParams.get("utm_content"),
    }

    const trackingData = Object.fromEntries(
      Object.entries(utmParams).filter(([, value]) => value !== null)
    )

    return {
      ...trackingData,
      landing_page: window.location.pathname || null,
      timestamp: new Date().toISOString(),
    }
  }

  const handleSubmit = async (data: WaitlistFormData) => {
    const {
      name,
      email,
      waitlistType,
      source,
      referralCode,
      turnstileToken,
      metadata = {},
    } = data

    if (!name || !email || !waitlistType) {
      throw new Error("Required fields are missing")
    }

    if (!turnstileToken) {
      throw new Error("Security verification is required")
    }

    // Prepare metadata by combining form metadata with tracking data
    const trackingData = getTrackingData()

    await waitlistMutation.mutateAsync({
      name,
      email,
      waitlistType,
      source,
      referralCode,
      turnstileToken,
      metadata: {
        ...metadata,
        ...trackingData,
      },
    })
  }

  return (
    <>
      <WaitlistForm
        config={baseWaitlistConfig}
        getTrackingData={getTrackingData}
        isLoading={isLoading}
        isSuccess={isSuccess}
        setIsLoading={setIsLoading}
        setIsSuccess={setIsSuccess}
        toast={toast}
        onSubmit={handleSubmit}
      />

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 space-y-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="mb-4 text-lg font-medium text-muted-foreground">
          Join for Exclusive Benefits
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <motion.div
            className="flex items-center space-x-3 rounded-full bg-primary/5 px-6 py-3 transition-colors hover:bg-primary/10"
            transition={{ type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.05 }}
          >
            <svg
              className="size-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-sm font-medium">Early Access</span>
          </motion.div>
          <motion.div
            className="flex items-center space-x-3 rounded-full bg-primary/5 px-6 py-3 transition-colors hover:bg-primary/10"
            transition={{ type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.05 }}
          >
            <svg
              className="size-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-sm font-medium">Priority Updates</span>
          </motion.div>
          <motion.div
            className="flex items-center space-x-3 rounded-full bg-primary/5 px-6 py-3 transition-colors hover:bg-primary/10"
            transition={{ type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.05 }}
          >
            <svg
              className="size-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-sm font-medium">Special Offers</span>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

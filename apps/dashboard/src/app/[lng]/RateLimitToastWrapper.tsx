/* eslint-disable  */
"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { useToast } from "@package/ui/toast"

interface RateLimitToastWrapperProps {
  children: React.ReactNode
}

export function RateLimitToastWrapper({
  children,
}: RateLimitToastWrapperProps) {
  const { toast } = useToast()
  const { t } = useTranslation()

  // Track if a rate limit toast is currently active
  const activeToastRef = React.useRef<boolean>(false)

  React.useEffect(() => {
    // Setup global fetch interceptor for rate limiting
    if (typeof window === "undefined") return

    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)

        // Check if response is rate limited (429)
        if (response.status === 429) {
          try {
            const rateLimitData = await response.clone().json()

            // Show appropriate toast based on rate limit type
            let title = t("common:toast.rate_limit.title")
            let description = t("common:toast.rate_limit.description")

            const { type, pathname, retryAfter } = rateLimitData

            if (type === "auth" || pathname?.includes("/auth/")) {
              title = t("common:toast.rate_limit.auth_title")
              description = t("common:toast.rate_limit.auth_description")
            } else if (
              type === "critical" ||
              pathname?.includes("/security/")
            ) {
              title = t("common:toast.rate_limit.critical_title")
              description = t("common:toast.rate_limit.critical_description")
            } else if (type === "api" || pathname?.includes("/api/")) {
              title = t("common:toast.rate_limit.api_title")
              description = t("common:toast.rate_limit.api_description")
            }

            // Add retry time to description
            if (retryAfter && retryAfter > 0) {
              const minutes = Math.ceil(retryAfter / 60)
              const timeUnit =
                minutes > 1 ? `${minutes} minutes` : `${retryAfter} seconds`
              description += ` Please wait ${timeUnit}.`
            }

            // Only show toast if no rate limit toast is currently active
            if (!activeToastRef.current) {
              activeToastRef.current = true

              toast({
                title,
                description,
                variant: "destructive",
                duration: 5000,
              })

              // Reset the active flag after toast duration + small buffer
              setTimeout(() => {
                activeToastRef.current = false
              }, 5500) // 5000ms duration + 500ms buffer
            }
          } catch (e) {
            // Fallback toast if response parsing fails
            if (!activeToastRef.current) {
              activeToastRef.current = true

              toast({
                title: t("common:toast.rate_limit.title"),
                description: t("common:toast.rate_limit.description"),
                variant: "destructive",
                duration: 5000,
              })

              // Reset the active flag after toast duration + small buffer
              setTimeout(() => {
                activeToastRef.current = false
              }, 5500) // 5000ms duration + 500ms buffer
            }
          }
        }

        return response
      } catch (error) {
        throw error
      }
    }

    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch
    }
  }, [toast, t])

  return <>{children}</>
}

"use client"

import { useEffect, useRef } from "react"

import { nanoid } from "nanoid"

interface TurnstileProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: (error: Error) => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact"
}

export function Turnstile({
  onVerify,
  onExpire,
  onError,
  theme = "auto",
  size = "normal",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const uniqueId = useRef(`turnstile-${nanoid(6)}`)

  useEffect(() => {
    // Load Turnstile script if not already loaded
    if (!window.turnstile) {
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    // Initialize widget when Turnstile is loaded
    const interval = setInterval(() => {
      if (window.turnstile && containerRef.current) {
        clearInterval(interval)
        // Remove any existing widget
        if (widgetId.current) {
          window.turnstile.remove(widgetId.current)
        }

        // Render new widget
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
          callback: onVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
          theme: theme,
          size: size,
        })
      }
    }, 100)

    return () => {
      clearInterval(interval)
      // Clean up widget on unmount
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current)
        widgetId.current = null
      }
    }
  }, [onVerify, onExpire, onError, theme, size])

  return <div ref={containerRef} id={uniqueId.current} />
}

// Add Turnstile types
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: (error: Error) => void
          theme?: "light" | "dark" | "auto"
          size?: "normal" | "compact"
        }
      ) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
  }
}

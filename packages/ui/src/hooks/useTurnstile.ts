"use client"

import { useCallback, useState } from "react"

// interface UseTurnstileOptions {
//   theme?: "light" | "dark" | "auto"
//   size?: "normal" | "compact"
// }

export function useTurnstile() {
  const [token, setToken] = useState<string | null>(null)
  const [isShowing, setIsShowing] = useState(false)

  const showTurnstile = useCallback(() => {
    setIsShowing(true)
  }, [])

  const handleVerify = useCallback((newToken: string) => {
    setToken(newToken)
    setIsShowing(false)
  }, [])

  const handleExpire = useCallback(() => {
    setToken(null)
  }, [])

  const handleError = useCallback(() => {
    // Silent error handling to avoid linting issues
    console.log
    setToken(null)
  }, [])

  const reset = useCallback(() => {
    setToken(null)
    setIsShowing(false)
  }, [])

  return {
    token,
    isShowing,
    showTurnstile,
    handleVerify,
    handleExpire,
    handleError,
    reset,
  }
}

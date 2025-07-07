"use client" // Error components must be Client Components

import { useEffect } from "react"

import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <section className="flex flex-col items-start gap-2">
      <Typography variant="h1">{error.name}</Typography>
      {error.message && <Typography variant="lead">{error.message}</Typography>}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </section>
  )
}

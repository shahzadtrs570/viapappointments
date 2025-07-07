"use client"

import { useEffect } from "react"

import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { useRouter, useSearchParams } from "next/navigation"

export default function EmailVerifiedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get("success")

  // Redirect to dashboard after 5 seconds
  useEffect(() => {
    if (success === "true") {
      const timer = setTimeout(() => {
        router.push("/")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {success === "true" ? "Email Verified!" : "Verification Error"}
          </CardTitle>
          <CardDescription className="text-center">
            {success === "true"
              ? "Your email has been successfully verified."
              : "There was an error verifying your email."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {success === "true" ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="size-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                You will be redirected to the dashboard in a few seconds...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-red-100 p-3">
                <svg
                  className="size-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                Please try again or contact support if the problem persists.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push("/")}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

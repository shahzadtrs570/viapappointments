"use client"

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

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error")
  // Decode the URL-encoded error parameter
  const errorType = errorParam ? decodeURIComponent(errorParam) : null

  // Determine error message based on error type
  const getErrorMessage = () => {
    switch (errorType) {
      case "Invalid or expired verification token":
        return "Your verification link has expired or is invalid."
      default:
        return "There was an error processing your request."
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Verification Error
          </CardTitle>
          <CardDescription className="text-center">
            {getErrorMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <svg
                className="size-8 text-red-600 dark:text-red-400"
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
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {errorType === "Invalid or expired verification token" ? (
                <>
                  Please request a new verification email from your account
                  settings.
                  <br />
                </>
              ) : (
                "Please try again or contact support if the problem persists."
              )}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            className="w-full"
            variant="default"
            onClick={() => router.push("/")}
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

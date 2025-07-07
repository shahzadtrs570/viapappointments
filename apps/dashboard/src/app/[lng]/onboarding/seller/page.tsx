/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/no-explicit-any*/

"use client"

import { useCallback } from "react"
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@package/ui/card"
import { WelcomeSelector } from "./components/WelcomeSelector"
import { GuidedTour } from "./components/GuidedTour"
import { ProgressSaver } from "./components/ProgressSaver"
import { useLocalStorage } from "./hooks/useLocalStorage"

// Define onboarding stages
export type OnboardingStage =
  | "welcome"
  | "guided_tour"
  | "email_collection"
  | "property_details"
  | "personal_details"

export default function SellerOnboardingPage() {
  const [currentStage, setCurrentStage] = useLocalStorage<OnboardingStage>(
    "estate-flex-onboarding-stage",
    "welcome"
  )
  const [onboardingData, setOnboardingData] = useLocalStorage<
    Record<string, any>
  >("estate-flex-onboarding-data", {})

  const handleRoleSelected = useCallback(
    (role: string) => {
      // For now, we'll only implement the property owner flow
      if (role === "property-owner") {
        setOnboardingData((prevData) => ({
          ...prevData,
          role: "property-owner",
        }))
        setCurrentStage("guided_tour")
      } else {
        // In the future, we'd handle other roles here
        alert(`The ${role} journey is coming soon!`)
      }
    },
    [setOnboardingData, setCurrentStage]
  )

  const handleGuidedTourComplete = useCallback(
    (tourData: Record<string, any>) => {
      setOnboardingData((prevData) => ({
        ...prevData,
        guidedTour: tourData,
      }))
      setCurrentStage("email_collection")
    },
    [setOnboardingData, setCurrentStage]
  )

  const handleEmailSaved = useCallback(
    (email: string, name?: string) => {
      setOnboardingData((prevData) => ({
        ...prevData,
        email,
        name,
      }))

      // In a real implementation, we would:
      // 1. Send a magic link to the email address
      // 2. Show a "check your inbox" message
      // 3. When they click the link, they'd be authenticated and redirected to the property details stage

      // For demo purposes, we'll just proceed to the next stage
      setCurrentStage("property_details")
    },
    [setOnboardingData, setCurrentStage]
  )

  const handleSkipEmailCollection = useCallback(() => {
    // Allow users to continue without providing an email
    setCurrentStage("property_details")
  }, [setCurrentStage])

  const handleReturnToStart = useCallback(() => {
    setCurrentStage("welcome")
  }, [setCurrentStage])

  // Render the appropriate stage
  const renderStage = () => {
    switch (currentStage) {
      case "welcome":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Srenova</CardTitle>
              <CardDescription>
                {`Srenova helps property owners unlock the value of their homes
                  through viager arrangements. Let's get started with a few simple
                  questions.`}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <WelcomeSelector onRoleSelected={handleRoleSelected} />
            </CardContent>
          </>
        )

      case "guided_tour":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Your Property Journey</CardTitle>
              <CardDescription>
                {`Let's understand your situation to provide the best viager
                arrangement options. No personal information is required at this
                stage.`}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <GuidedTour
                onComplete={handleGuidedTourComplete}
                initialData={onboardingData.guidedTour}
              />
            </CardContent>
          </>
        )

      case "email_collection":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Save Your Progress</CardTitle>
              <CardDescription>
                Would you like to save your progress? Provide your email to
                receive a magic link that allows you to continue later. This is
                optional.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ProgressSaver
                onSave={handleEmailSaved}
                onSkip={handleSkipEmailCollection}
                initialEmail={onboardingData.email}
                initialName={onboardingData.name}
              />
            </CardContent>
          </>
        )

      case "property_details":
      case "personal_details":
      default:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Coming Soon</CardTitle>
              <CardDescription>
                This part of the onboarding flow is under development.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="py-8 text-center">
                <p>In a full implementation, this would collect:</p>
                <ul className="mx-auto mt-4 max-w-md list-inside list-disc text-left">
                  {currentStage === "property_details" ? (
                    <>
                      <li>Detailed property information</li>
                      <li>Property photos and documents</li>
                      <li>Energy performance details</li>
                    </>
                  ) : (
                    <>
                      <li>Full contact information</li>
                      <li>Communication preferences</li>
                      <li>Financial goals in detail</li>
                    </>
                  )}
                </ul>
                <button
                  onClick={handleReturnToStart}
                  className="mt-8 text-primary underline"
                >
                  Return to Start
                </button>
              </div>
            </CardContent>
          </>
        )
    }
  }

  return <div>{renderStage()}</div>
}

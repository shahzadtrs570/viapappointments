/*eslint-disable import/order*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/no-explicit-any*/

"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@package/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { MortgageStatus, MortgageData } from "./MortgageStatus"
import { PropertyAssets, PropertyAssetsData } from "./PropertyAssets"
import { LifeGoals, LifeGoalsData } from "./LifeGoals"
import { Summary } from "./Summary"

export type GuidedTourStep = "mortgage" | "assets" | "goals" | "summary"

// Configuration for each step
const steps: Array<{
  id: GuidedTourStep
  title: string
  description: string
}> = [
  {
    id: "mortgage",
    title: "Mortgage Information",
    description: "Let's understand your property's current mortgage situation",
  },
  {
    id: "assets",
    title: "Property Features",
    description:
      "Tell us about the special features and assets of your property",
  },
  {
    id: "goals",
    title: "Your Goals",
    description:
      "Help us understand what you want to achieve with this arrangement",
  },
  {
    id: "summary",
    title: "Summary",
    description: "Review the information you've provided before proceeding",
  },
]

interface GuidedTourProps {
  initialData?: Record<string, any>
  onComplete: (data: Record<string, any>) => void
}

export function GuidedTour({ initialData = {}, onComplete }: GuidedTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [tourData, setTourData] = useState<Record<string, any>>(initialData)
  const [progress, setProgress] = useState(0)

  const currentStep = steps[currentStepIndex]

  // Separate useEffect for progress calculation
  useEffect(() => {
    // Calculate progress percentage
    setProgress(((currentStepIndex + 1) / steps.length) * 100)
  }, [currentStepIndex])

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prevIndex) => prevIndex + 1)
    } else {
      onComplete(tourData)
    }
  }, [currentStepIndex, steps.length, onComplete, tourData])

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prevIndex) => prevIndex - 1)
    }
  }, [currentStepIndex])

  // Memoize data change handlers to prevent unnecessary re-renders
  const handleMortgageDataChange = useCallback((data: MortgageData) => {
    setTourData((prev) => ({
      ...prev,
      mortgage: data,
    }))
  }, [])

  const handlePropertyAssetsChange = useCallback((data: PropertyAssetsData) => {
    setTourData((prev) => ({
      ...prev,
      assets: data,
    }))
  }, [])

  const handleLifeGoalsChange = useCallback((data: LifeGoalsData) => {
    setTourData((prev) => ({
      ...prev,
      goals: data,
    }))
  }, [])

  const renderStep = () => {
    switch (currentStep.id) {
      case "mortgage":
        return (
          <MortgageStatus
            data={tourData.mortgage}
            onDataChange={handleMortgageDataChange}
          />
        )
      case "assets":
        return (
          <PropertyAssets
            data={tourData.assets}
            onDataChange={handlePropertyAssetsChange}
          />
        )
      case "goals":
        return (
          <LifeGoals
            data={tourData.goals}
            onDataChange={handleLifeGoalsChange}
          />
        )
      case "summary":
        return <Summary data={tourData} />
      default:
        return <div>Step not found</div>
    }
  }

  const isLastStep = currentStepIndex === steps.length - 1

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-accent">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{currentStep.title}</h3>
          <p className="text-sm text-muted-foreground">
            {currentStep.description}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
      </div>

      {/* Step content */}
      <div className="py-4">{renderStep()}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="mr-2 size-4" />
          Previous
        </Button>

        <Button onClick={handleNext}>
          {isLastStep ? (
            <>
              Complete <Check className="ml-2 size-4" />
            </>
          ) : (
            <>
              Next <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

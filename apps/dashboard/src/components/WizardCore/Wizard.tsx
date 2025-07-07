"use client"

import { useEffect, useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import type { WizardData, WizardProps } from "./types"

export function Wizard<T extends WizardData>({
  steps,
  initialStep,
  storageKey = "wizard_data",
  initialData = {},
  onComplete,
  renderStep,
}: WizardProps<T>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize current step - from URL, prop, or first step
  const [currentStepId, setCurrentStepId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stepFromUrl = searchParams.get("step")
      if (stepFromUrl && steps.some((step) => step.id === stepFromUrl)) {
        return stepFromUrl
      }
    }
    return initialStep || steps[0]?.id || ""
  })

  // Get current step object
  const currentStep =
    steps.find((step) => step.id === currentStepId) || steps[0]

  // Initialize wizard data from localStorage if available
  const [wizardData, setWizardData] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          return { ...initialData, ...JSON.parse(saved) } as T
        } catch (e) {
          console.error("Error parsing saved wizard data:", e)
          return initialData as T
        }
      }
    }
    return initialData as T
  })

  // Save wizard data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(wizardData).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(wizardData))
    }
  }, [wizardData, storageKey])

  // Update URL when step changes
  useEffect(() => {
    if (typeof window !== "undefined" && currentStepId) {
      const params = new URLSearchParams(window.location.search)
      params.set("step", currentStepId)
      router.push(`?${params.toString()}`, { scroll: false })
    }
  }, [currentStepId, router])

  // Methods for step navigation
  const updateWizardData = (stepData: Partial<T>) => {
    setWizardData((prev) => ({ ...prev, ...stepData }))
  }

  const goToStep = (stepId: string) => {
    const targetStep = steps.find((step) => step.id === stepId)
    if (targetStep) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      setCurrentStepId(stepId)
    }
  }

  const goToNextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId)
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      window.scrollTo({ top: 0, behavior: "smooth" })
      setCurrentStepId(nextStep.id)
    } else if (onComplete) {
      // If this is the last step and we have an onComplete handler
      onComplete(wizardData)
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId)
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1]
      window.scrollTo({ top: 0, behavior: "smooth" })
      setCurrentStepId(prevStep.id)
    }
  }

  // Check if current step is first or last
  const isFirstStep = steps[0]?.id === currentStepId
  const isLastStep = steps[steps.length - 1]?.id === currentStepId

  // Render the current step
  return renderStep({
    currentStep,
    wizardData,
    updateWizardData,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
  })
}

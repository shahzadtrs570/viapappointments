/* eslint-disable */
import { useEffect, useRef, useState } from "react"

import { Card } from "@package/ui/card"
import { useToast } from "@package/ui/toast"
import { useParams, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"

import type { RootState } from "@/app/store"

import { updateWithApiResponse } from "@/app/store/property/review/slice"
import { api } from "@/lib/trpc/react"

// Import all components and types from centralized index
import {
  type ContemplationProps,
  type SuggestedQuestion,
  ApplicationHeader,
  WhatHappensNextSection,
  AboutSrenovaSection,
  NavigationButtons,
  ApplicationStatusCard,
  ChatBotSection,
  HelpfulResourcesCard,
} from "../components/Contemplation"

export function Contemplation({
  onBack,
  onComplete,
  checkVerification,
  updateWizardData,
  propertyId,
  isContinueAgainMode,
}: ContemplationProps) {
  const params = useParams()
  const searchParams = useSearchParams()
  const lng = (params?.lng as string) || "en"

  const mode = searchParams.get("mode")
  const isContinueAgain: boolean = !!(mode === "continue-again" && propertyId)

  const { t } = useTranslation("wizard_contemplation")
  const { toast } = useToast()
  const [isChecking, setIsChecking] = useState(false)
  const dispatch = useDispatch()

  // Add a ref to track if we've already updated wizard data for this application data
  const previousApplicationIdRef = useRef<string | null>(null)

  // Get review data from Redux store only if not in continue-again mode
  const reviewData = useSelector(
    (state: RootState) => state.property.review.data
  )
  // Use the TRPC query hook to fetch application review data by property ID
  const {
    data: applicationReviewData,
    isLoading: isLoadingReview,
    refetch,
  } = api.property.applicationReview.getByPropertyId.useQuery(
    {
      propertyId: (isContinueAgain ? propertyId : reviewData?.propertyId) || "",
    },
    {
      enabled: isContinueAgain ? !!propertyId : !!reviewData?.propertyId,
      refetchOnWindowFocus: false,
    }
  )

  // Refetch on mount to get fresh data
  useEffect(() => {
    void refetch()
  }, [refetch])

  // Update wizard data whenever we get new data from backend
  useEffect(() => {
    if (applicationReviewData && applicationReviewData.id) {
      // Only update if we have new data with a different ID than before
      if (previousApplicationIdRef.current !== applicationReviewData.id) {
        previousApplicationIdRef.current = applicationReviewData.id

        // In continue-again mode, only use backend data
        if (isContinueAgain) {
          updateWizardData({
            contemplationData: {
              applicationId: applicationReviewData.id || "",
              submittedAt: applicationReviewData.createdAt || "",
              isVerified: applicationReviewData.status === "ACCEPTED",
            },
          })
        } else {
          // Normal mode - update both Redux and wizard data
          // dispatch(updateWithApiResponse(applicationReviewData))
          updateWizardData({
            contemplationData: {
              applicationId: applicationReviewData.id || "",
              submittedAt: applicationReviewData.createdAt || "",
              isVerified: applicationReviewData.status === "ACCEPTED",
            },
          })
        }
      }
    }
  }, [applicationReviewData, dispatch, updateWizardData, isContinueAgain])

  // Calculate progress based on status
  const getProgressPercentage = () => {
    const status = applicationReviewData?.status
    if (!status) return 25

    switch (status) {
      case "PENDING":
        return 25
      case "PROCESSING":
        return 65
      case "ACCEPTED":
        return 100
      case "REJECTED":
        return 100
      default:
        return 25
    }
  }

  // Update the getFormattedDate function to handle both Date and string types
  const getFormattedDate = (date?: Date | string) => {
    if (!date) return new Date().toLocaleDateString()

    // If it's already a Date object, format it directly
    if (date instanceof Date) {
      return date.toLocaleDateString()
    }

    // If it's a string, parse it to Date first
    return new Date(date).toLocaleDateString()
  }

  // Add a function to determine progress bar color class based on status
  const getProgressBarColorClass = () => {
    if (!applicationReviewData || !applicationReviewData.status)
      return "bg-primary"

    switch (applicationReviewData.status) {
      case "REJECTED":
        return "bg-destructive" // Red color
      case "ACCEPTED":
        return "bg-green-500" // Green color
      case "PROCESSING":
        return "bg-primary" // Amber/yellow color
      default:
        return "bg-amber-500" // Default color
    }
  }

  // Define suggested questions using translations
  const suggestedQuestions: SuggestedQuestion[] = [
    {
      id: "process-time",
      text: t("chatbot.suggestedQuestions.processTime"),
      category: "process",
      followUp: ["next-steps", "verification-process", "pause-process"],
    },
    {
      id: "next-steps",
      text: t("chatbot.suggestedQuestions.nextSteps"),
      category: "process",
      followUp: ["process-time", "verification-process", "changes-allowed"],
    },
    {
      id: "verification-process",
      text: t("chatbot.suggestedQuestions.verificationProcess"),
      category: "process",
      followUp: ["required-documents", "next-steps", "process-time"],
    },
    {
      id: "change-mind",
      text: t("chatbot.suggestedQuestions.changeMind"),
      category: "legal",
      followUp: ["pause-process", "changes-allowed", "legal-protections"],
    },
    {
      id: "family-involvement",
      text: t("chatbot.suggestedQuestions.familyInvolvement"),
      category: "family",
      followUp: ["multiple-contacts", "legal-protections", "next-steps"],
    },
  ]

  const handleCheckStatus = async () => {
    setIsChecking(true)
    try {
      // Directly use the status from Redux
      const isVerified = applicationReviewData?.status === "ACCEPTED"

      if (isVerified) {
        toast({
          title: t("toast.verification_complete.title"),
          description: t("toast.verification_complete.description"),
          variant: "default",
        })

        // Update wizard data with complete and accurate data
        updateWizardData({
          reviewData: applicationReviewData,
          contemplationData: {
            applicationId: applicationReviewData.id || "",
            submittedAt: applicationReviewData.createdAt || "",
            isVerified: true,
          },
        })

        onComplete()
      } else {
        // Use specific toast titles and variants based on status
        let toastTitle = ""
        let toastDescription = ""
        let toastVariant: "default" | "destructive" = "default"

        switch (applicationReviewData?.status) {
          case "PROCESSING":
            toastTitle = t("toast.processing.title")
            toastDescription = t("toast.processing.description")
            break
          case "REJECTED":
            toastTitle = t("toast.rejected.title")
            toastDescription = t("toast.rejected.description")
            toastVariant = "destructive"
            break
          case "PENDING":
          default:
            toastTitle = t("toast.still_review.title")
            toastDescription = t("toast.still_review.description")
            break
        }

        toast({
          title: toastTitle,
          description: toastDescription,
          variant: toastVariant,
        })
      }
    } catch (error) {
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.description"),
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:flex-row">
      {/* Main Content */}
      <div className="w-full lg:w-2/3">
        <Card className="mb-4 overflow-hidden border border-border bg-card shadow-lg sm:mb-6 md:mb-8">
          {/* Application Header */}
          <ApplicationHeader
            applicationReviewData={applicationReviewData}
            getFormattedDate={getFormattedDate}
            t={t}
          />

          <div className="p-4 sm:p-6 md:p-8">
            {/* What Happens Next Section */}
            <WhatHappensNextSection t={t} />

            {/* About Srenova & Viager Section */}
            <AboutSrenovaSection t={t} />

            {/* Navigation Buttons */}
            <NavigationButtons
              isContinueAgain={isContinueAgain}
              isChecking={isChecking}
              onBack={onBack}
              onCheckStatus={handleCheckStatus}
              t={t}
            />
          </div>
        </Card>
      </div>

      {/* Right Column - Enhanced */}
      <div className="w-full space-y-4 sm:space-y-6 lg:w-1/3">
        {/* Application Status Card */}
        <ApplicationStatusCard
          applicationReviewData={applicationReviewData}
          isLoadingReview={isLoadingReview}
          getProgressPercentage={getProgressPercentage}
          getProgressBarColorClass={getProgressBarColorClass}
          getFormattedDate={getFormattedDate}
          t={t}
        />

        {/* Chatbot */}
        <ChatBotSection suggestedQuestions={suggestedQuestions} t={t} />

        {/* Helpful Resources */}
        <HelpfulResourcesCard t={t} />
      </div>

      {/* Add style tag inside the return statement */}
      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}

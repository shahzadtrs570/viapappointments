/* eslint-disable */

import { useEffect, useState } from "react"

import { useToast } from "@package/ui/toast"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"

import type { RootState } from "@/app/store"

import { resetForm } from "@/app/store/property/propertyDetails/slice"
import {
  initializeReviewIfNeeded,
  updateChecklist,
  updateConsiderations,
  updateWithApiResponse,
} from "@/app/store/property/review/slice"
import { clearSellerInformation } from "@/app/store/property/sellerInformation/slice"
import { api } from "@/lib/trpc/react"

// Import all components, types, and helpers from centralized index
import {
  // Types and interfaces
  type ReviewAndRecommendationsProps,
  type ChecklistData,
  type ConsiderationsData,
  type SuggestedQuestion,
  // Components
  ApplicationPreview,
  SrenovaRecommendationsChecklist,
  EmailVerificationAlert,
  NavigationButtons,
  ChatBotSection,
  KeyConsiderationsSection,
  ContemplationPhaseCard,
  NextStepsCard,
} from "../components/ReviewAndRecommendations"

export function ReviewAndRecommendations({
  onBack,
  onEdit,
  onSubmit,
  defaultValues,
  readOnly = false,
  updateWizardData,
}: ReviewAndRecommendationsProps) {
  const { toast } = useToast()
  const dispatch = useDispatch()
  const { t } = useTranslation("wizard_review_recommendations")

  const [isMounted, setIsMounted] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(true) // Default to true to avoid blocking in case verification system isn't available
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [isVerificationLoading, setIsVerificationLoading] = useState(false)

  // Define suggested questions using translations
  const suggestedQuestions: SuggestedQuestion[] = [
    {
      id: "financial-advisor",
      text: t("chatbot.suggestedQuestions.financialAdvisor"),
      category: "advice",
      followUp: ["tax-implications", "legal-protections", "inheritance"],
    },
    {
      id: "inheritance",
      text: t("chatbot.suggestedQuestions.inheritance"),
      category: "family",
      followUp: ["family-involvement", "legal-protections", "tax-implications"],
    },
    {
      id: "family-involvement",
      text: t("chatbot.suggestedQuestions.familyInvolvement"),
      category: "family",
      followUp: ["inheritance", "legal-protections", "financial-advisor"],
    },
    {
      id: "legal-protections",
      text: t("chatbot.suggestedQuestions.legalProtections"),
      category: "legal",
      followUp: ["tax-implications", "inheritance", "family-involvement"],
    },
    {
      id: "tax-implications",
      text: t("chatbot.suggestedQuestions.taxImplications"),
      category: "legal",
      followUp: ["financial-advisor", "legal-protections", "inheritance"],
    },
  ]

  // Access Redux state directly
  const ownersInformation = useSelector(
    (state: RootState) => state.property.sellerInformation.data
  )

  const propertyDetails = useSelector(
    (state: RootState) => state.property.propertyDetails.apiData
  )

  // Get review data from Redux
  const reviewData = useSelector(
    (state: RootState) => state.property.review.data
  )

  // Create local state that mirrors Redux state
  const [localChecklist, setLocalChecklist] = useState<ChecklistData>({
    financialAdvisor: false,
    financialSituation: false,
    carePlans: false,
    existingMortgages: false,
  })

  const [localConsiderations, setLocalConsiderations] =
    useState<ConsiderationsData>({
      ownership: false,
      benefits: false,
      mortgage: false,
    })

  // Update local state when Redux state changes
  useEffect(() => {
    if (reviewData) {
      setLocalChecklist(reviewData.checklist)
    }
    if (reviewData) {
      setLocalConsiderations(reviewData.considerations)
    }
  }, [reviewData])

  // API mutations
  const createReview = api.property.applicationReview.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: t("toasts.success"),
        description: t("toasts.savedSuccess"),
      })
      // Store the complete API response in Redux
      dispatch(updateWithApiResponse(data))

      // After successful submission, clear all slices and localStorage
      localStorage.removeItem("estateFlex_wizardData")
      dispatch(clearSellerInformation())
      dispatch(resetForm())
      // dispatch(clearReview())
      localStorage.removeItem("estate_flex_stored_owners")

      // Clear edit mode
      updateWizardData({ editMode: undefined })

      onSubmit({
        checklist: localChecklist,
        considerations: localConsiderations,
      })
    },
    onError: (error) => {
      toast({
        title: t("toasts.error"),
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateReview = api.property.applicationReview.update.useMutation({
    onSuccess: (data) => {
      toast({
        title: t("toasts.success"),
        description: t("toasts.updatedSuccess"),
      })
      // Store the complete API response in Redux
      dispatch(updateWithApiResponse(data))

      // After successful submission, clear all slices and localStorage
      localStorage.removeItem("estateFlex_wizardData")
      dispatch(clearSellerInformation())
      dispatch(resetForm())
      // dispatch(clearReview())
      localStorage.removeItem("estate_flex_stored_owners")

      // Clear edit mode
      updateWizardData({ editMode: undefined })

      onSubmit({
        checklist: localChecklist,
        considerations: localConsiderations,
      })
    },
    onError: (error) => {
      toast({
        title: t("toasts.error"),
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Email verification mutation
  const sendVerificationEmailMutation =
    api.user.sendVerificationEmail.useMutation({
      onSuccess: () => {
        setIsVerificationSent(true)
        toast({
          title: t("toasts.success"),
          description: t("toasts.verificationEmailSent"),
        })
      },
      onError: (error) => {
        toast({
          title: t("toasts.error"),
          description: error.message || t("toasts.verificationEmailFailed"),
          variant: "destructive",
        })
      },
      onSettled: () => {
        setIsVerificationLoading(false)
      },
    })

  // Check if primary owner has email
  const primaryOwnerEmail = ownersInformation?.owners[0]?.email

  // Email verification query
  const emailVerificationQuery = api.user.checkEmailVerification.useQuery(
    undefined,
    {
      // Only fetch when needed
      enabled: !!primaryOwnerEmail && !readOnly,
      // Poll every 10 seconds if email is not verified and verification was sent
      refetchInterval: !isEmailVerified && isVerificationSent ? 10000 : false,
    }
  )

  // Update email verification status when query data changes
  useEffect(() => {
    if (emailVerificationQuery.data) {
      setIsEmailVerified(emailVerificationQuery.data.isVerified)
    }
    if (emailVerificationQuery.error) {
      console.error(
        "Error checking email verification:",
        emailVerificationQuery.error
      )
    }
  }, [emailVerificationQuery.data, emailVerificationQuery.error])

  // Function to send verification email
  const handleSendVerificationEmail = () => {
    if (!primaryOwnerEmail) {
      toast({
        title: t("toasts.error"),
        description: t("toasts.noEmailFound"),
        variant: "destructive",
      })
      return
    }

    setIsVerificationLoading(true)
    // If resending, we'll rely on the backend to handle invalidation
    sendVerificationEmailMutation.mutate()
  }

  // Initialize on mount to ensure we capture any existing data or reload state
  useEffect(() => {
    setIsMounted(true)

    const propertyId = propertyDetails?.id || ""
    const sellerId = ownersInformation?.owners[0]?.id || ""

    // Check if email verification is needed
    if (primaryOwnerEmail && !readOnly) {
      // In a real implementation, you would check with your backend if the email is verified
      // For now, we'll assume it's not verified if there's an email address
      setIsEmailVerified(false)
    }

    if (propertyId && sellerId) {
      // Initialize with default Redux state first
      dispatch(initializeReviewIfNeeded({ propertyId, sellerId }))

      // Then, if there are default values provided, use those (e.g. from an API call)
      if (defaultValues?.checklist) {
        dispatch(updateChecklist(defaultValues.checklist))
      }

      if (defaultValues?.considerations) {
        dispatch(updateConsiderations(defaultValues.considerations))
      }
    }
  }, [
    dispatch,
    propertyDetails,
    ownersInformation,
    defaultValues,
    primaryOwnerEmail,
    readOnly,
  ])

  const handleSubmit = () => {
    try {
      // Check if email is verified before proceeding
      if (!isEmailVerified && !readOnly && primaryOwnerEmail) {
        toast({
          title: t("emailVerification.title"),
          description: t("emailVerification.description"),
          variant: "destructive",
        })
        return
      }

      // In readonly mode, just pass the data to onSubmit without API calls
      if (readOnly) {
        onSubmit({
          checklist: localChecklist,
          considerations: localConsiderations,
        })
        return
      }

      // Use actual IDs from the Redux store
      const propertyId = propertyDetails?.id
      const sellerId = ownersInformation?.owners[0]?.id

      // Get additional seller IDs (co-owners)
      const coSellerIds = ownersInformation?.owners
        ? ownersInformation.owners
            .slice(1)
            .map((owner) => owner.id)
            .filter((id): id is string => id !== undefined)
        : []

      if (!propertyId || !sellerId) {
        throw new Error(t("toasts.missingInfoError"))
      }

      // Prepare the review data with actual IDs
      const submitData = {
        propertyId,
        sellerId,
        coSellerIds,
        checklist: localChecklist,
        considerations: localConsiderations,
        status: "PENDING" as const,
      }

      if (defaultValues?.id) {
        // Update existing review
        updateReview.mutate({
          id: defaultValues.id,
          data: submitData,
        })
      } else {
        // Create new review
        createReview.mutate(submitData)
      }

      // Note: Cleanup is now handled in the onSuccess callbacks
    } catch (error) {
      toast({
        title: t("toasts.error"),
        description:
          error instanceof Error ? error.message : t("toasts.saveFailedError"),
        variant: "destructive",
      })
    }
  }

  const handleChecklistChange = (field: string, value: boolean) => {
    // Update local state immediately for better UX
    setLocalChecklist((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Initialize if needed AND update in one go
    const propertyId = propertyDetails?.id || ""
    const sellerId = ownersInformation?.owners[0]?.id || ""

    if (propertyId && sellerId) {
      // Make sure we have a review record first
      dispatch(initializeReviewIfNeeded({ propertyId, sellerId }))

      // Then simply update the checklist with the new value
      dispatch(updateChecklist({ [field]: value }))
    }
  }

  const handleConsiderationsChange = (field: string, value: boolean) => {
    // Update local state immediately for better UX
    setLocalConsiderations((prev) => ({
      ...prev,
      [field]: value,
    }))

    const propertyId = propertyDetails?.id || ""
    const sellerId = ownersInformation?.owners[0]?.id || ""

    if (propertyId && sellerId) {
      // Make sure we have a review record first
      dispatch(initializeReviewIfNeeded({ propertyId, sellerId }))

      // Then simply update the considerations with the new value
      dispatch(updateConsiderations({ [field]: value }))
    }
  }

  // Add this function before the return statement, after all other functions
  const renderVerificationButtonContent = () => {
    if (isVerificationLoading) {
      return (
        <>
          <svg
            className="mr-1 size-3 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
          {t("emailVerification.button.sending")}
        </>
      )
    }

    if (isVerificationSent) {
      return t("emailVerification.button.resend")
    }

    return t("emailVerification.button.send")
  }

  // Don't render until we're mounted to avoid hydration issues
  if (!isMounted) {
    return null
  }

  return (
    <div className="bg-background">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          <div className="space-y-4 rounded-lg border border-border bg-card p-3 shadow-lg sm:space-y-6 sm:p-4 md:p-6">
            {/* Application Preview */}
            <ApplicationPreview
              propertyDetails={propertyDetails}
              ownersInformation={ownersInformation}
              readOnly={readOnly}
              onEdit={onEdit}
              t={t}
            />

            {/* Srenova Recommended Checklist */}
            <SrenovaRecommendationsChecklist
              localChecklist={localChecklist}
              readOnly={readOnly}
              onChecklistChange={handleChecklistChange}
              t={t}
            />

            {/* Email Verification Alert */}
            <EmailVerificationAlert
              isEmailVerified={isEmailVerified}
              readOnly={readOnly}
              primaryOwnerEmail={primaryOwnerEmail}
              isVerificationSent={isVerificationSent}
              isVerificationLoading={isVerificationLoading}
              onSendVerificationEmail={handleSendVerificationEmail}
              renderVerificationButtonContent={renderVerificationButtonContent}
              t={t}
            />

            {/* Navigation */}
            <NavigationButtons
              readOnly={readOnly}
              onBack={onBack}
              onSubmit={handleSubmit}
              createReviewPending={createReview.isPending}
              updateReviewPending={updateReview.isPending}
              t={t}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3">
          {/* ChatBot */}
          <ChatBotSection suggestedQuestions={suggestedQuestions} t={t} />

          {/* Contemplation Phase */}
          <ContemplationPhaseCard t={t} />

          {/* Key Considerations */}
          <KeyConsiderationsSection
            localConsiderations={localConsiderations}
            readOnly={readOnly}
            onConsiderationsChange={handleConsiderationsChange}
            t={t}
          />

          {/* Next Steps */}
          <NextStepsCard t={t} />
        </div>
      </div>
    </div>
  )
}

/* eslint-disable */

import { useEffect, useState } from "react"
import { Skeleton } from "@package/ui/skeleton"
import { useSearchParams } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { Button } from "@package/ui/button"
import { ChatBot } from "@package/ui/chatbot"
import { toast } from "@package/ui/toast"
import { Typography } from "@package/ui/typography"
import { useDispatch, useSelector } from "react-redux"

import type { RootState } from "@/app/store"
import type { TRPCClientError } from "@trpc/client"

import {
  logDecision,
  setOffer,
  updateOffer,
} from "@/app/store/property/offer/slice"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import { api } from "@/lib/trpc/react"
import { useAuth } from "@/hooks/useAuth"
import { useSession } from "next-auth/react"

// Import all components and types from centralized index
import {
  // Types
  type OfferData,
  type ProvisionalOfferState,
  type ProvisionalOfferProps,
  type ShareOptions,
  type DocumentPreview,
  calculateOfferValues,
  // Components
  ShareModal,
  DocumentPreviewModal,
  PaymentCalculatorSection,
  DocumentsSection,
  AgreementSection,
  NextStepsSection,
  ImportantRecommendationSection,
  OfferResponseSection,
} from "../components/ProvisionalOffer"

export function ProvisionalOffer({
  data,
  onSubmit,
  onBack,
  defaultValues,
  isContinueAgainMode = false,
  propertyId,
}: ProvisionalOfferProps) {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { data: session, update: updateSession } = useSession()

  // State management
  const [isLoadingOfferDocument, setIsLoadingOfferDocument] = useState(false)
  const [offerDocumentError, setOfferDocumentError] = useState<string | null>(
    null
  )
  const [offerDocument, setOfferDocument] = useState<Record<
    string,
    any
  > | null>(null)
  const [dashbordStatusDocument, setDashbordStatusDocument] = useState<Record<
    string,
    any
  > | null>(null)
  const [backendData, setBackendData] = useState<any>(null)
  const [existingOfferId, setExistingOfferId] = useState<string | null>(null)
  const [marketValue, setMarketValue] = useState(1000000)
  const [lumpSum, setLumpSum] = useState(300000)
  const [sliderPercent, setSliderPercent] = useState(50)
  const [advisorChoice, setAdvisorChoice] = useState<
    "shared" | "proceed" | null
  >(null)
  const [decisionStatus, setDecisionStatus] = useState<any>("none")
  const [fullName, setFullName] = useState("")
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [shareData, setShareData] = useState<ShareOptions>({
    title: "Srenova Provisional Offer",
    text: "",
    url: "",
  })
  const [showShareModal, setShowShareModal] = useState(false)
  const [showDeclineForm, setShowDeclineForm] = useState(
    defaultValues?.showDeclineForm || false
  )
  const [showSpeakHumanForm, setShowSpeakHumanForm] = useState(
    defaultValues?.showSpeakHumanForm || false
  )
  const [showAcceptanceConfirmation, setShowAcceptanceConfirmation] = useState(
    defaultValues?.showAcceptanceConfirmation || false
  )
  const [declineReason, setDeclineReason] = useState(
    defaultValues?.declineReason || ""
  )
  const [declineDetails, setDeclineDetails] = useState(
    defaultValues?.declineDetails || ""
  )
  const [documentPreview, setDocumentPreview] = useState<DocumentPreview>({
    url: "",
    name: "",
    isOpen: false,
  })

  // Redux selectors
  const currentOffer = useSelector(
    (state: RootState) => state.property.offer.data
  )
  const ownersInformation = useSelector(
    (state: RootState) => state.property.sellerInformation.data
  )
  const propertyDetails = useSelector(
    (state: RootState) => state.property.propertyDetails.apiData
  )

  // Get translation function
  const { t } = useClientTranslation([
    "wizard_provisional_offer",
    "wizard_common",
  ])

  // API queries and mutations
  const dashboardStatusQuery =
    api.property.provisionalOffer.getDashboardStatusWithOfferDocument.useQuery(
      { propertyId: propertyId || "" },
      { enabled: true }
    )

  const createOffer = api.property.provisionalOffer.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Provisional offer created successfully",
      })
      onSubmit({
        declineReason,
        declineDetails,
        showDeclineForm,
        showSpeakHumanForm,
        showAcceptanceConfirmation,
      })
    },
  })

  const updateOfferMutation = api.property.provisionalOffer.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Offer updated successfully",
      })
      onSubmit({
        declineReason,
        declineDetails,
        showDeclineForm,
        showSpeakHumanForm,
        showAcceptanceConfirmation,
        decisionStatus,
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const declineOffer = api.property.provisionalOffer.decline.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Offer declined successfully",
      })
      onSubmit({
        declineReason,
        declineDetails,
        showDeclineForm: false,
        showSpeakHumanForm: false,
        showAcceptanceConfirmation: false,
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Load dashboard status and offer document
  useEffect(() => {
    if (dashboardStatusQuery.isLoading) {
      setIsLoadingOfferDocument(true)
    }

    if (dashboardStatusQuery.isSuccess) {
      setIsLoadingOfferDocument(false)
      const result = dashboardStatusQuery.data
      if (result) {
        setDashbordStatusDocument(result?.dashboardStatus)

        if (result.dashboardStatus) {
          const statusData = result.dashboardStatus.statusData as {
            sellers?: any[]
          }
          setBackendData({
            sellers: statusData?.sellers || [],
            existingOffer: result.offerDocument
              ? { id: result.offerDocument.id }
              : undefined,
          })
        }

        if (result && result.offerDocument) {
          setOfferDocument(result.offerDocument)
          const marketVal = parseFloat(
            result.offerDocument.confirmedValue?.replace(/[^0-9.]/g, "") ||
              "1000000"
          )
          setMarketValue(marketVal)
        } else {
          setOfferDocumentError(
            "No offer document available for this property."
          )
        }
      }
    }

    if (dashboardStatusQuery.isError && dashboardStatusQuery.error) {
      setIsLoadingOfferDocument(false)
      const error = dashboardStatusQuery.error as TRPCClientError<any>
      setOfferDocumentError(`Error loading offer document: ${error.message}`)
    }
  }, [
    dashboardStatusQuery.status,
    dashboardStatusQuery.data,
    dashboardStatusQuery.error,
  ])

  // Initialize state from Redux
  useEffect(() => {
    if (currentOffer) {
      setAdvisorChoice(
        (currentOffer.advisorConfirmation?.advisorChoice as
          | "shared"
          | "proceed") || null
      )
      setDecisionStatus(currentOffer.decisionStatus || "none")
      setFullName(currentOffer.agreementInPrinciple?.fullName || "")
      setAgreementChecked(currentOffer.agreementInPrinciple?.checked || false)
    }
  }, [currentOffer])

  // Calculate offer values
  const MARKET_VALUATION = offerDocument
    ? parseFloat(
        offerDocument.confirmedValue?.replace(/[^0-9.]/g, "") || "1000000"
      )
    : 1000000
  const PURCHASE_PRICE = offerDocument
    ? parseFloat(offerDocument.offerValue?.replace(/[^0-9.]/g, "") || "800000")
    : 800000
  const MIN_LUMP_SUM = offerDocument
    ? parseFloat(
        offerDocument.mininitialPaymentAmount?.replace(/[^0-9.]/g, "") ||
          "300000"
      )
    : 300000
  const MAX_LUMP_SUM = offerDocument
    ? parseFloat(
        offerDocument.maxinitialPaymentAmount?.replace(/[^0-9.]/g, "") ||
          "500000"
      )
    : 500000
  const CONTRACT_DURATION = offerDocument
    ? parseInt(offerDocument.contractDuration || "20")
    : 20

  const offerPrice = marketValue * 0.8
  const monthlyTotal = offerPrice - lumpSum
  const monthly = monthlyTotal / (CONTRACT_DURATION * 12)
  const roundedLumpSum = Math.round(lumpSum / 1000) * 1000
  const roundedMonthly = Math.round(monthly / 50) * 50
  const totalMonthlyPayments = roundedMonthly * 12 * CONTRACT_DURATION
  const totalBenefit = roundedLumpSum + totalMonthlyPayments
  const netBenefitPercentage = (totalBenefit / marketValue) * 100

  // Event handlers
  const handleBalanceChange = (value: number) => {
    const newSliderPercent = value
    setSliderPercent(newSliderPercent)
    const newLumpSum =
      MIN_LUMP_SUM + (MAX_LUMP_SUM - MIN_LUMP_SUM) * (newSliderPercent / 100)
    setLumpSum(newLumpSum)

    dispatch(
      logDecision({
        action: "BALANCE_ADJUSTMENT",
        details: {
          sliderPercent: newSliderPercent,
          marketValue,
          lumpSum: newLumpSum,
          contractDuration: CONTRACT_DURATION,
        },
      })
    )
  }

  const handleAdvisorChoiceChange = (value: string) => {
    if (value === "shared" || value === "proceed") {
      setAdvisorChoice(value as "shared" | "proceed")

      if (currentOffer) {
        const updatedOffer = JSON.parse(JSON.stringify(currentOffer))
        updatedOffer.advisorConfirmation =
          updatedOffer.advisorConfirmation || {}
        updatedOffer.advisorConfirmation.hasSharedOrAcknowledged = true
        updatedOffer.advisorConfirmation.advisorChoice = value
        updatedOffer.advisorConfirmation.confirmationTimestamp =
          new Date().toISOString()
        updatedOffer.isOfferValid = true
        updatedOffer.disableButtons = false
        dispatch(setOffer(updatedOffer))
      }

      dispatch(
        logDecision({
          action: "ADVISOR_CHOICE_CHANGED",
          details: {
            previousChoice: advisorChoice,
            newChoice: value,
            timestamp: new Date().toISOString(),
          },
        })
      )
    }
  }

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFullName(value)

    if (currentOffer) {
      dispatch(
        updateOffer({
          agreementInPrinciple: {
            ...(currentOffer.agreementInPrinciple || {}),
            fullName: value,
            checked: agreementChecked,
          },
        })
      )
    }
  }

  const handleAgreementCheckedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked
    setAgreementChecked(checked)

    if (currentOffer) {
      dispatch(
        updateOffer({
          agreementInPrinciple: {
            ...(currentOffer.agreementInPrinciple || {}),
            fullName: fullName,
            checked,
          },
        })
      )
    }
  }

  const handleAcceptOffer = () => {
    if (!data.referenceNumber) {
      toast({
        title: t("toasts.errorTitle"),
        description: t("toasts.noReferenceError"),
        variant: "destructive",
      })
      return
    }

    try {
      if (!currentOffer && data) {
        const initialOffer = {
          referenceNumber: data.referenceNumber,
          dateOfIssue: data.dateOfIssue,
          property: {
            ...data.property,
            propertyId: data.property.propertyId || propertyId || "",
          },
          valuation: data.valuation,
          status: "ACCEPTED" as const,
          advisorConfirmation: {
            hasSharedOrAcknowledged: true,
            advisorChoice: advisorChoice,
            confirmationTimestamp: new Date().toISOString(),
          },
          decisionLog: [
            {
              timestamp: new Date().toISOString(),
              action: "OFFER_ACCEPTED",
              details: { referenceNumber: data.referenceNumber },
            },
          ],
          isOfferValid: true,
          disableButtons: false,
          decisionStatus: "accepted" as const,
        }
        dispatch(setOffer(initialOffer))
      } else if (currentOffer) {
        const updatedOffer = JSON.parse(JSON.stringify(currentOffer))
        updatedOffer.status = "ACCEPTED"
        updatedOffer.decisionStatus = "accepted"
        dispatch(setOffer(updatedOffer))
      }

      setDecisionStatus("accepted")
      setShowDeclineForm(false)
      setShowSpeakHumanForm(false)
      setShowAcceptanceConfirmation(true)
    } catch (error) {
      console.error("Error accepting offer:", error)
      toast({
        title: t("toasts.errorTitle"),
        description: t("toasts.acceptProblemError"),
        variant: "destructive",
      })
    }
  }

  const handleSpeakHuman = () => {
    dispatch(
      logDecision({
        action: "REQUESTED_HUMAN_ASSISTANCE",
        details: {
          previousState: { showDeclineForm, showAcceptanceConfirmation },
        },
      })
    )

    if (currentOffer) {
      const updatedOffer = JSON.parse(JSON.stringify(currentOffer))
      updatedOffer.decisionStatus = "advisor_requested"
      dispatch(setOffer(updatedOffer))
    }

    setDecisionStatus("advisor_requested")
    setShowDeclineForm(false)
    setShowAcceptanceConfirmation(false)
    setShowSpeakHumanForm(true)
  }

  const handleDeclineOffer = () => {
    dispatch(
      logDecision({
        action: "INITIATED_DECLINE_PROCESS",
        details: {
          previousState: { showSpeakHumanForm, showAcceptanceConfirmation },
        },
      })
    )

    if (currentOffer) {
      const updatedOffer = JSON.parse(JSON.stringify(currentOffer))
      updatedOffer.decisionStatus = "declined"
      dispatch(setOffer(updatedOffer))
    }

    setDecisionStatus("declined")
    setShowSpeakHumanForm(false)
    setShowAcceptanceConfirmation(false)
    setShowDeclineForm(true)
  }

  const handleSubmitDecline = async () => {
    if (!declineReason) {
      toast({
        title: t("toasts.errorTitle"),
        description: t("toasts.declineReasonError"),
        variant: "destructive",
      })
      return
    }

    try {
      dispatch(
        logDecision({
          action: "OFFER_DECLINED",
          details: {
            referenceNumber: data.referenceNumber,
            reason: declineReason,
            details: declineDetails || "No details provided",
            timestamp: new Date().toISOString(),
          },
        })
      )

      setDecisionStatus("declined")

      if (currentOffer) {
        const updatedOffer = JSON.parse(JSON.stringify(currentOffer))
        updatedOffer.status = "REJECTED"
        updatedOffer.decisionStatus = "declined"
        updatedOffer.declineDetails = {
          reason: declineReason,
          details: declineDetails || "",
          timestamp: new Date().toISOString(),
        }
        dispatch(setOffer(updatedOffer))
      }

      await declineOffer.mutateAsync({
        id: data.referenceNumber,
        reason: declineReason,
        details: declineDetails || "",
      })

      toast({
        title: "Offer Declined",
        description:
          "Thank you for your feedback. Your offer has been declined.",
      })

      onSubmit({
        declineReason,
        declineDetails,
        showDeclineForm: false,
        showSpeakHumanForm: false,
        showAcceptanceConfirmation: false,
        decisionStatus: "declined",
      })
    } catch (error) {
      console.error("Error declining offer:", error)
      toast({
        title: "Error",
        description:
          "There was an error declining the offer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const newShareData: ShareOptions = {
      title: t("defaultShareTitle"),
      text: `Provisional offer details for ${data.property.address}\nPurchase Price: £${data.valuation.purchasePrice.toLocaleString()}\nInitial Lump Sum: £${roundedLumpSum.toLocaleString()}\nMonthly Payment: £${roundedMonthly.toLocaleString()}`,
      url: window.location.href,
    }

    setShareData(newShareData)

    dispatch(
      logDecision({
        action: "SHARE_ATTEMPT",
        details: { shareMethod: "BUTTON_CLICK", shareData: newShareData },
      })
    )

    try {
      if (navigator.share) {
        await navigator.share(newShareData)
        dispatch(
          logDecision({
            action: "SHARE_COMPLETED",
            details: { shareMethod: "NATIVE_SHARE_API", success: true },
          })
        )
      } else {
        setShowShareModal(true)
        dispatch(
          logDecision({
            action: "SHARE_MODAL_OPENED",
            details: { shareMethod: "CUSTOM_MODAL", shareData: newShareData },
          })
        )
      }
    } catch (err) {
      console.error("Error sharing:", err)
      dispatch(
        logDecision({
          action: "SHARE_FAILED",
          details: { error: String(err), shareData: newShareData },
        })
      )
    }
  }

  const handleSubmit = async () => {
    try {
      if (!data.property.titleNumber) {
        toast({
          title: t("toasts.errorTitle"),
          description: t("toasts.propertyIdRequiredError"),
          variant: "destructive",
        })
        return
      }

      if (decisionStatus === "none") {
        toast({
          title: "Action Required",
          description:
            "Please accept, decline, or request advisor assistance before proceeding",
          variant: "destructive",
        })
        return
      }

      const localPropertyId = propertyDetails?.id || ""
      const sellerId = ownersInformation?.owners?.[0]?.id || ""
      const coSellerIds =
        isContinueAgainMode && backendData?.sellers
          ? backendData.sellers.slice(1).map((seller: any) => seller.id)
          : ownersInformation?.owners
            ? ownersInformation.owners
                .slice(1)
                .map((owner: any) => owner.id)
                .filter((id: any) => id !== undefined)
            : []

      dispatch(
        logDecision({
          action: "FINAL_SUBMISSION",
          details: {
            referenceNumber: data.referenceNumber,
            balance: {
              lumpSum: roundedLumpSum,
              monthly: roundedMonthly,
              remainingBalance: monthlyTotal,
              totalMonthlyPayments: totalMonthlyPayments,
              totalBenefit: totalBenefit,
              netBenefitPercentage: netBenefitPercentage,
            },
            advisorConfirmation: {
              hasSharedOrAcknowledged: true,
              advisorChoice,
            },
            agreementInPrinciple: { fullName, checked: agreementChecked },
            showAcceptanceConfirmation,
            decisionStatus,
            timestamp: new Date().toISOString(),
          },
        })
      )

      const offerData = {
        referenceNumber: data.referenceNumber,
        dateOfIssue: data.dateOfIssue,
        sellerId:
          isContinueAgainMode && backendData?.sellers?.[0]?.id
            ? backendData.sellers[0].id
            : sellerId,
        coSellerIds,
        property: {
          propertyId: propertyId || localPropertyId,
          address: data.property.address,
          owners: data.property.owners,
          titleNumber: data.property.titleNumber,
          tenure: data.property.tenure,
          type: data.property.type,
        },
        valuation: {
          marketValue: data.valuation.marketValue,
          purchasePrice: data.valuation.purchasePrice,
          initialLumpSum: roundedLumpSum,
          remainingBalance: monthlyTotal,
          monthlyPayment: roundedMonthly,
          annuityTerm: data.valuation.annuityTerm,
        },
        status: "DRAFT" as const,
        advisorConfirmation: {
          hasSharedOrAcknowledged: true,
          advisorChoice,
          confirmationTimestamp: true ? new Date().toISOString() : null,
        },
        agreementInPrinciple: { fullName, checked: agreementChecked },
        decisionStatus,
      }

      if (isContinueAgainMode && backendData?.existingOffer?.id) {
        await updateOfferMutation.mutateAsync({
          id: backendData.existingOffer.id,
          data: offerData,
        })
      } else {
        await createOffer.mutateAsync(offerData)
      }
    } catch (error) {
      console.error("Error submitting offer:", error)
      toast({
        title: "Error",
        description:
          "There was a problem submitting your offer. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Define suggested questions for chatbot
  const suggestedQuestions = [
    {
      id: "payment-structure",
      text: t(
        "wizard_provisional_offer:chatbot.suggestedQuestions.paymentStructure"
      ),
      category: "financial",
      followUp: ["offer-calculation", "lump-sum-use", "payment-adjustment"],
    },
    {
      id: "offer-calculation",
      text: t(
        "wizard_provisional_offer:chatbot.suggestedQuestions.offerCalculation"
      ),
      category: "financial",
      followUp: ["property-value", "payment-structure", "tax-implications"],
    },
    {
      id: "payment-adjustment",
      text: t(
        "wizard_provisional_offer:chatbot.suggestedQuestions.paymentAdjustment"
      ),
      category: "financial",
      followUp: ["lump-sum-use", "payment-structure", "live-longer"],
    },
    {
      id: "tax-implications",
      text: t(
        "wizard_provisional_offer:chatbot.suggestedQuestions.taxImplications"
      ),
      category: "legal",
      followUp: ["benefits", "legal-protections", "payment-structure"],
    },
    {
      id: "live-longer",
      text: t("wizard_provisional_offer:chatbot.suggestedQuestions.liveLonger"),
      category: "financial",
      followUp: ["die-shortly", "payment-structure", "inheritance"],
    },
  ]

  // Loading state
  if (isLoadingOfferDocument) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
          <h2 className="text-xl font-semibold">
            Loading Your Offer Details...
          </h2>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <p className="text-sm text-muted-foreground">
          Please wait while we retrieve your offer details...
        </p>
      </div>
    )
  }

  // Error state
  if (offerDocumentError && isContinueAgainMode) {
    return (
      <div className="p-4">
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Unable to Generate Offer</AlertTitle>
          <AlertDescription>{offerDocumentError}</AlertDescription>
        </Alert>
        <p className="mb-6 text-sm text-muted-foreground">
          To proceed with receiving an offer, you may need to complete previous
          steps or contact customer support for assistance.
        </p>
        <Button variant="outline" onClick={onBack}>
          {t("wizard_common:buttons.back")}
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="bg-background">
        <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <div className="space-y-4 rounded-lg border border-border bg-card p-3 shadow-lg sm:space-y-6 sm:p-4 md:p-6">
              <Typography
                className="mb-2 text-xl font-bold text-card-foreground sm:mb-4 sm:text-2xl"
                variant="h2"
              >
                {t("wizard_provisional_offer:pageTitle")}
              </Typography>

              {/* Expiration notice */}
              <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 sm:mb-4 sm:p-4">
                <div className="flex items-start">
                  <div className="shrink-0 pt-0.5">
                    <svg
                      className="size-4 text-amber-600 sm:size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <Typography
                      className="text-xs font-medium sm:text-sm"
                      variant="body"
                    >
                      {(t as any)(
                        "wizard_provisional_offer:expirationNotice.message",
                        {
                          date:
                            offerDocument?.expirationDate ||
                            "the date shown in your documents",
                        }
                      )}
                    </Typography>
                  </div>
                </div>
              </div>

              <Typography
                className="mb-3 text-sm text-muted-foreground sm:mb-6 sm:text-base"
                variant="body"
              >
                {t("wizard_provisional_offer:pageDescription")}
              </Typography>

              {/* Payment Calculator Section */}
              <PaymentCalculatorSection
                offerDocument={offerDocument}
                sliderPercent={sliderPercent}
                minLumpSum={MIN_LUMP_SUM}
                maxLumpSum={MAX_LUMP_SUM}
                roundedLumpSum={roundedLumpSum}
                roundedMonthly={roundedMonthly}
                PURCHASE_PRICE={PURCHASE_PRICE}
                onSliderChange={handleBalanceChange}
                onDispatchLogDecision={(action: any) =>
                  dispatch(logDecision(action))
                }
                marketValue={marketValue}
                CONTRACT_DURATION={CONTRACT_DURATION}
              />

              {/* Documents Section */}
              <DocumentsSection
                isLoadingOfferDocument={isLoadingOfferDocument}
                offerDocumentError={offerDocumentError}
                offerDocument={offerDocument}
                onSetDocumentPreview={(preview: DocumentPreview) =>
                  setDocumentPreview(preview)
                }
              />

              {/* Agreement Section */}
              <AgreementSection
                offerDocument={offerDocument}
                offerPrice={offerPrice}
                marketValue={marketValue}
                roundedLumpSum={roundedLumpSum}
                monthlyTotal={monthlyTotal}
                roundedMonthly={roundedMonthly}
                contractDuration={CONTRACT_DURATION}
                totalMonthlyPayments={totalMonthlyPayments}
                totalBenefit={totalBenefit}
                netBenefitPercentage={netBenefitPercentage}
                fullName={fullName}
                agreementChecked={agreementChecked}
                onFullNameChange={handleFullNameChange}
                onAgreementCheckedChange={handleAgreementCheckedChange}
              />

              {/* Next Steps Section */}
              <NextStepsSection />

              {/* Important Recommendation Section */}
              <ImportantRecommendationSection
                advisorChoice={advisorChoice}
                onAdvisorChoiceChange={handleAdvisorChoiceChange}
                onShare={handleShare}
              />

              {/* Offer Response Section */}
              <OfferResponseSection
                advisorChoice={advisorChoice}
                decisionStatus={decisionStatus}
                showDeclineForm={showDeclineForm}
                showSpeakHumanForm={showSpeakHumanForm}
                showAcceptanceConfirmation={showAcceptanceConfirmation}
                declineReason={declineReason}
                declineDetails={declineDetails}
                onAcceptOffer={handleAcceptOffer}
                onSpeakHuman={handleSpeakHuman}
                onDeclineOffer={handleDeclineOffer}
                onSubmitDecline={handleSubmitDecline}
                onDeclineReasonChange={setDeclineReason}
                onDeclineDetailsChange={setDeclineDetails}
                data={data}
              />

              {/* Navigation buttons */}
              <div className="flex flex-col justify-between gap-3 pt-3 sm:flex-row sm:gap-0 sm:pt-6">
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={onBack}
                >
                  {t("wizard_common:buttons.back")}
                </Button>
                {showAcceptanceConfirmation && (
                  <Button
                    className="w-full text-xs sm:w-[300px] sm:text-sm"
                    disabled={
                      createOffer.isPending || updateOfferMutation.isPending
                    }
                    onClick={handleSubmit}
                  >
                    {createOffer.isPending || updateOfferMutation.isPending ? (
                      <>
                        <svg
                          className="mr-1 size-3 animate-spin sm:mr-2 sm:size-4"
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
                        {t(
                          "wizard_provisional_offer:acceptanceConfirmation.continueButton"
                        )}
                      </>
                    ) : (
                      t(
                        "wizard_provisional_offer:acceptanceConfirmation.continueButton"
                      )
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full space-y-4 sm:space-y-6 lg:w-1/3">
            {/* ChatBot */}
            <ChatBot
              suggestedQuestions={suggestedQuestions}
              title={t("wizard_provisional_offer:chatbot.title")}
              initialMessage={t(
                "wizard_provisional_offer:chatbot.initialMessage"
              )}
            />

            {/* Important Information */}
            <div className="rounded-lg border border-border bg-card p-3 shadow-lg sm:p-6">
              <Typography
                className="mb-3 text-base text-primary sm:mb-4 sm:text-lg"
                variant="h3"
              >
                {t("importantInfo.title")}
              </Typography>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <div className="ml-2 sm:ml-3">
                    <Typography
                      className="text-sm font-medium text-card-foreground sm:text-base"
                      variant="h4"
                    >
                      {t("guideBot.suggestedQuestions.priceCalc")}
                    </Typography>
                    <Typography
                      className="text-xs text-muted-foreground sm:text-sm"
                      variant="body"
                    >
                      {t("guideBot.responses.purchase_price_calc")}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="ml-2 sm:ml-3">
                    <Typography
                      className="text-sm font-medium text-card-foreground sm:text-base"
                      variant="h4"
                    >
                      {t("guideBot.suggestedQuestions.earlyPassing")}
                    </Typography>
                    <Typography
                      className="text-xs text-muted-foreground sm:text-sm"
                      variant="body"
                    >
                      {t("guideBot.responses.early_passing")}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="ml-2 sm:ml-3">
                    <Typography
                      className="text-sm font-medium text-card-foreground sm:text-base"
                      variant="h4"
                    >
                      {t("guideBot.suggestedQuestions.sellLater")}
                    </Typography>
                    <Typography
                      className="text-xs text-muted-foreground sm:text-sm"
                      variant="body"
                    >
                      {t("guideBot.responses.sell_later")}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-lg border border-border bg-card p-3 shadow-lg sm:p-6">
              <Typography
                className="mb-3 text-base text-primary sm:mb-4 sm:text-lg"
                variant="h3"
              >
                {t("timeline.title")}
              </Typography>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
                    1
                  </div>
                  <Typography
                    className="ml-2 text-xs text-card-foreground sm:ml-3 sm:text-sm"
                    variant="body"
                  >
                    {t("timeline.itemPriceCalc")}
                  </Typography>
                </div>

                <div className="flex items-center">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
                    2
                  </div>
                  <Typography
                    className="ml-2 text-xs text-card-foreground sm:ml-3 sm:text-sm"
                    variant="body"
                  >
                    {t("timeline.itemEarlyPassing")}
                  </Typography>
                </div>

                <div className="flex items-center">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
                    3
                  </div>
                  <Typography
                    className="ml-2 text-xs text-card-foreground sm:ml-3 sm:text-sm"
                    variant="body"
                  >
                    {t("timeline.itemSellLater")}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showShareModal && (
        <ShareModal
          shareData={shareData}
          onClose={() => {
            setShowShareModal(false)
            dispatch(
              logDecision({
                action: "SHARE_MODAL_CLOSED",
                details: {
                  completed: false,
                  timestamp: new Date().toISOString(),
                },
              })
            )
          }}
        />
      )}

      {documentPreview.isOpen && (
        <DocumentPreviewModal
          documentUrl={documentPreview.url}
          documentName={documentPreview.name}
          onClose={() =>
            setDocumentPreview({ url: "", name: "", isOpen: false })
          }
        />
      )}
    </>
  )
}

/*eslint-disable react/jsx-max-depth*/
/*eslint-disable jsx-a11y/anchor-is-valid*/
/*eslint-disable react/no-unescaped-entities*/
/*eslint-disable max-lines*/
/*eslint-disable  @typescript-eslint/no-unused-vars*/
/*eslint-disable  jsx-a11y/click-events-have-key-events*/
/*eslint-disable  @typescript-eslint/no-unnecessary-condition*/
/*eslint-disable  react/jsx-max-depth*/
/*eslint-disable  @typescript-eslint/no-explicit-any*/
/*eslint-disable  no-nested-ternary*/
/*eslint-disable  import/order*/
"use client"

import { useEffect, useState } from "react"

import { Spinner } from "@package/ui/spinner"
import { toast } from "@package/ui/toast"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useSession } from "next-auth/react"

import type {
  FullPropertyDetails,
  WizardStep,
} from "../../../../../../../../packages/api/src/routers/property/sub-routers/propertyValidation/types"
import type { RootState } from "@/app/store"

// Import all types
import type {
  PropertyDetailsApiData,
  PropertyDetailsForm,
  PropertyFeatureInput,
} from "@/app/store/property/propertyDetails/slice"
import type { Review } from "@/app/store/property/review/slice"
import type { SellerInformationState } from "@/app/store/property/sellerInformation/slice"

// Import action creators
import { setSellerInformation } from "@/app/store/property/sellerInformation/slice"
import {
  initializeForm,
  setApiData,
} from "@/app/store/property/propertyDetails/slice"
import { setReview } from "@/app/store/property/review/slice"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import { api } from "@/lib/trpc/react"

import { CompletionStatus } from "./Steps/CompletionStatus"
import { Contemplation } from "./Steps/Contemplation"
import { PropertyInformation } from "./Steps/PropertyInformation"
import { ProvisionalOffer } from "./Steps/ProvisionalOffer"
import { ReviewAndRecommendations } from "./Steps/ReviewAndRecommendations"
import { SellerInformation } from "./Steps/SellerInformation"
import { WizardLayout } from "./WizardLayout"

interface SellerInformationData {
  ownerType: "single" | "couple" | "multiple"
  numberOfOwners?: number
  owners: Array<{
    id?: string
    firstName: string
    lastName: string
    email: string
    dateOfBirth: string
    phone?: string
    useExistingAddress: boolean
    address?: string
    postcode?: string
    town?: string
    county?: string
  }>
}

interface PropertyInformationData {
  id?: string
  propertyType: "house" | "flat" | "bungalow" | "other" | "apartment"
  propertyStatus: "freehold" | "leasehold"
  leaseLength?: string
  bedrooms: "1" | "2" | "3" | "4" | "5+"
  bathrooms: "1" | "2" | "3+"
  yearBuilt: string
  propertySize: string
  features?: string[]
  address: string
  postcode: string
  town: string
  county: string
  condition: "excellent" | "good" | "fair" | "needs_renovation"
  conditionNotes?: string
  estimatedValue: string
  documents?: Array<{
    id: string
    documentType: string
    filename: string
    fileUrl: string
    verified: boolean
    isTemp: boolean
  }>
}

interface ReviewData {
  checklist: {
    financialAdvisor: boolean
    financialSituation: boolean
    carePlans: boolean
    existingMortgages: boolean
  }
  considerations: {
    ownership: boolean
    benefits: boolean
    mortgage: boolean
  }
}

interface WizardData {
  sellerInformation?: SellerInformationData
  propertyInformation?: PropertyInformationData
  reviewData?: ReviewData
  provisionalOffer?: {
    declineReason: string
    declineDetails: string
    showDeclineForm: boolean
    showSpeakHumanForm: boolean
    showAcceptanceConfirmation: boolean
  }
  contemplationData?: {
    applicationId: string
    submittedAt: string
    isVerified: boolean
  }
  solicitorData?: {
    id?: string
    choice: string
    solicitor: {
      name: string
      firmName: string
      email: string
      phone: string
      address: string
    }
    propertyId: string
    sellerId: string
  }
  editMode?: "create" | "edit"
}

// Add type for property data from API
interface PropertyApiResponse {
  id: string
  propertyType: string
  propertyStatus: "freehold" | "leasehold"
  leaseLength?: string
  bedroomCount: number
  bathroomCount: number
  totalAreaSqM: number
  yearBuilt?: string
  features?: string[]
  condition: string
  conditionNotes?: string
  estimatedValue: number
  confirmedValue: number | null
  address?: {
    streetLine1?: string
    streetLine2?: string
    postalCode?: string
    city?: string
    state?: string
  }
  sellers: Array<{
    id: string
    userId: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    email: string | null
    ownershipPercentage: number
  }>
  review: {
    checklist: Record<string, boolean>
    considerations: Record<string, boolean>
    seller: {
      id: string
      firstName: string
      lastName: string
    }
  } | null
  propertyDocuments?: Array<{
    id: string
    documentType: string
    filename: string
    fileUrl: string
    verified: boolean
    createdAt: string
    updatedAt: string
  }>
}

// Constants
const STORAGE_KEY = "estateFlex_wizardData"
const STEP_STORAGE_KEY = "estateFlex_currentStep"
const STORED_OWNERS_KEY = "estate_flex_stored_owners"

// Function to check if stored wizard data email differs from login email and clear if needed
const checkAndClearWizardData = (loginEmail: string) => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY)
    const storedOwners = localStorage.getItem(STORED_OWNERS_KEY)
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      if (
        parsedData?.sellerInformation?.owners?.[0]?.email &&
        parsedData.sellerInformation.owners[0].email !== loginEmail
      ) {
        // Clear all localStorage
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(STEP_STORAGE_KEY)
        localStorage.removeItem(STORED_OWNERS_KEY)
        return true
      }
    }
    if (storedOwners) {
      const parsedOwners = JSON.parse(storedOwners)

      if (parsedOwners[0].email !== loginEmail) {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(STEP_STORAGE_KEY)
        localStorage.removeItem(STORED_OWNERS_KEY)
        return true
      }
    }
    return false
  } catch (error) {
    console.error("Error checking wizard data:", error)
    return false
  }
}

const stepOrder: WizardStep[] = [
  "Seller Information",
  "Property Information",
  "Review & Recommendations",
  "Contemplation",
  "Offer & Next Steps",
  "Completion Status",
]

// Add type guard
const isFullPropertyDetails = (
  details: any
): details is FullPropertyDetails => {
  return "id" in details && "review" in details
}

export function Wizard() {
  // 1. Next.js hooks
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()

  // 2. Translation hook
  const { t } = useClientTranslation(["wizard_common"])

  // 3. Redux hooks
  const dispatch = useDispatch()

  // 4. Local state hooks
  const [wizardData, setWizardData] = useState<WizardData>({})
  const [currentStep, setCurrentStep] =
    useState<WizardStep>("Seller Information")
  const [isPropertyDataLoaded, setIsPropertyDataLoaded] = useState(false)
  const [isContinueAgainMode, setIsContinueAgainMode] = useState(false)
  const [currentPropertyId, setCurrentPropertyId] = useState<
    string | undefined
  >()

  // 5. API query hook - only use validation query
  const propertyValidationQuery =
    api.property.validation.getExistingProperty.useQuery(undefined, {
      enabled: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    })

  // Add selectors at component level
  const sellerData = useSelector(
    (state: RootState) => state.property.sellerInformation.data
  )
  const propertyData = useSelector(
    (state: RootState) => state.property.propertyDetails.apiData
  )
  const reviewData = useSelector(
    (state: RootState) => state.property.review.data
  )

  // All useEffect hooks moved to the top
  // Initialize step from localStorage
  useEffect(() => {
    const storedStep = localStorage.getItem(STEP_STORAGE_KEY)
    const defaultStep = "Seller Information"

    if (storedStep && stepOrder.includes(storedStep as WizardStep)) {
      setCurrentStep(storedStep as WizardStep)
    } else if (!currentStep || currentStep !== defaultStep) {
      setCurrentStep(defaultStep)
      localStorage.setItem(STEP_STORAGE_KEY, defaultStep)
    }
  }, [])

  // Check if wizard data email matches login email and clear if different
  useEffect(() => {
    if (session?.user?.email) {
      const wasCleared = checkAndClearWizardData(session.user.email)
      if (wasCleared) {
        setWizardData({})
        setCurrentStep("Seller Information")
      } else {
        // Only load stored data if it wasn't cleared
        try {
          const storedWizardData = localStorage.getItem(STORAGE_KEY)
          if (storedWizardData) {
            setWizardData(JSON.parse(storedWizardData))
          }
        } catch (error) {
          console.error("Error loading wizard data from localStorage:", error)
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
  }, [session?.user?.email])

  // Update localStorage when currentStep changes
  useEffect(() => {
    localStorage.setItem(STEP_STORAGE_KEY, currentStep)
  }, [currentStep])

  // Save wizard data to localStorage
  useEffect(() => {
    if (Object.keys(wizardData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wizardData))
    }
  }, [wizardData])

  // Clear localStorage on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem(STEP_STORAGE_KEY)
    }
  }, [])

  // Handle property validation errors
  useEffect(() => {
    if (propertyValidationQuery.error) {
      toast({
        title: "Error",
        description: "Failed to check property details. Please try again.",
        variant: "destructive",
      })
      // router.push(`/${params.lng}/my-properties`)
    }
  }, [propertyValidationQuery.error, router, params.lng])

  // Effect to handle property validation and mode switching
  // TODO: MOVE TO TRANSLATION FILES
  useEffect(() => {
    if (!propertyValidationQuery.data) return

    const { hasExistingProperty, currentStep, propertyDetails, sellers } =
      propertyValidationQuery.data

    if (
      hasExistingProperty &&
      propertyDetails &&
      isFullPropertyDetails(propertyDetails)
    ) {
      // Show toast based on review status
      const reviewStatus = propertyDetails.review?.status || ""
      if (!reviewStatus) {
        toast({
          title: "Existing Property Found",
          description: "Please continue with your existing application.",
          duration: 5000,
        })
      } else {
        const statusMessage = {
          PENDING: "Your property application is pending review.",
          PROCESSING: "Your property application is being processed.",
          ACCEPTED:
            "Your property application has been accepted. Please review your provisional offer.",
          REJECTED: "Your property application has been rejected.",
        }[reviewStatus as "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED"]

        toast({
          title: "Existing Property Found",
          description: statusMessage,
          duration: 5000,
        })
      }

      // Set property ID in state
      setCurrentPropertyId(propertyDetails.id)

      // Update URL without step parameter
      const newParams = new URLSearchParams(window.location.search)
      newParams.delete("step")
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${newParams.toString()}`
      )

      // Set the current step in localStorage
      localStorage.setItem(STEP_STORAGE_KEY, currentStep)
      setCurrentStep(currentStep)

      // Process the property data
      processPropertyData(propertyDetails)
    } else if (!hasExistingProperty && sellers && sellers.length > 0) {
      // Handle case where sellers exist but no property exists
      // Process seller data and set appropriate step
      processSellersData(sellers)
      setCurrentStep(currentStep)
      localStorage.setItem(STEP_STORAGE_KEY, currentStep)
    } else {
      // Reset property ID
      setCurrentPropertyId(undefined)
      setCurrentStep(currentStep)
      localStorage.setItem(STEP_STORAGE_KEY, currentStep)
    }
  }, [propertyValidationQuery.data, toast])

  // Effect to process property data
  useEffect(() => {
    if (propertyValidationQuery.data?.propertyDetails) {
      processPropertyData(propertyValidationQuery.data.propertyDetails)
    }
  }, [propertyValidationQuery.data, dispatch])

  // Modify the loading state logic
  const isLoading = !isPropertyDataLoaded && propertyValidationQuery.isLoading

  // Extract the sellers data processing logic into a separate function
  const processSellersData = (sellersData: any[]) => {
    console.log("Processing sellers data:", sellersData)

    // Format seller information
    const sellerInfo: SellerInformationData = {
      ownerType:
        sellersData.length === 1
          ? "single"
          : sellersData.length === 2
            ? "couple"
            : "multiple",
      numberOfOwners: sellersData.length,
      owners: sellersData.map((seller: any) => ({
        id: seller.id,
        firstName: seller.firstName,
        lastName: seller.lastName,
        email: seller.email || "",
        dateOfBirth: seller.dateOfBirth.toISOString().split("T")[0],
        useExistingAddress: true,
        // No address data available yet since no property exists
        address: "",
        postcode: "",
        town: "",
        county: "",
      })),
    }

    // Sync with Redux state
    dispatch(
      setSellerInformation({
        ...sellerInfo,
        numberOfOwners: sellersData.length || 1,
        sellerIds: sellersData.map((seller: any) => seller.id),
      } as SellerInformationState)
    )

    // Update wizard data with seller information
    setWizardData({
      sellerInformation: sellerInfo,
    })

    console.log("Redux state synchronized with sellers:", sellerInfo)
    setIsPropertyDataLoaded(true)
  }

  // Extract the property data processing logic into a separate function
  const processPropertyData = (propertyData: any) => {
    // Format seller information
    const sellerInfo: SellerInformationData = {
      ownerType:
        propertyData.sellers.length === 1
          ? "single"
          : propertyData.sellers.length === 2
            ? "couple"
            : "multiple",
      numberOfOwners: propertyData.sellers.length,
      owners: propertyData.sellers.map((seller: any) => ({
        id: seller.id,
        firstName: seller.firstName,
        lastName: seller.lastName,
        email: seller.email || "",
        dateOfBirth: seller.dateOfBirth.toISOString().split("T")[0],
        useExistingAddress: true,
        address: propertyData.address?.streetLine1,
        postcode: propertyData.address?.postalCode,
        town: propertyData.address?.city,
        county: propertyData.address?.state,
      })),
    }

    // Format property information
    const propertyInfo: PropertyInformationData = {
      id: propertyData.id,
      propertyType: propertyData.propertyType.toLowerCase() as
        | "house"
        | "flat"
        | "bungalow"
        | "other"
        | "apartment",
      propertyStatus: propertyData.leaseLength ? "leasehold" : "freehold",
      leaseLength: propertyData.leaseLength || "",
      bedrooms: (propertyData.bedroomCount <= 4
        ? String(propertyData.bedroomCount)
        : "5+") as "1" | "2" | "3" | "4" | "5+",
      bathrooms: (propertyData.bathroomCount <= 2
        ? String(propertyData.bathroomCount)
        : "3+") as "1" | "2" | "3+",
      yearBuilt: propertyData.yearBuilt || "",
      propertySize: String(propertyData.totalAreaSqM || ""),
      features: propertyData.features || [],
      address: propertyData.address?.streetLine1 || "",
      postcode: propertyData.address?.postalCode || "",
      town: propertyData.address?.city || "",
      county: propertyData.address?.state || "",
      condition: propertyData.condition?.toLowerCase() as
        | "excellent"
        | "good"
        | "fair"
        | "needs_renovation",
      conditionNotes: propertyData.conditionNotes || "",
      estimatedValue: String(propertyData.estimatedValue || ""),
      documents:
        propertyData.documents?.map((doc: any) => ({
          id: doc.id,
          documentType: doc.documentType,
          filename: doc.filename,
          fileUrl: doc.fileUrl,
          verified: doc.verified,
          isTemp: false,
        })) || [],
    }

    // Format review data if available
    const reviewData = propertyData.review
      ? {
          checklist: {
            financialAdvisor:
              propertyData.review.checklist.financialAdvisor ?? false,
            financialSituation:
              propertyData.review.checklist.financialSituation ?? false,
            carePlans: propertyData.review.checklist.carePlans ?? false,
            existingMortgages:
              propertyData.review.checklist.existingMortgages ?? false,
          },
          considerations: {
            ownership: propertyData.review.considerations.ownership ?? false,
            benefits: propertyData.review.considerations.benefits ?? false,
            mortgage: propertyData.review.considerations.mortgage ?? false,
          },
        }
      : undefined

    // Sync with Redux state
    // 1. Seller Information
    dispatch(
      setSellerInformation({
        ...sellerInfo,
        numberOfOwners: propertyData.sellers.length || 1,
        sellerIds: propertyData.sellers.map((seller: any) => seller.id),
      } as SellerInformationState)
    )

    // 2. Property Information
    // First set the API data
    dispatch(
      setApiData({
        id: propertyData.id,
        propertyType: propertyData.propertyType,
        bedroomCount: propertyData.bedroomCount,
        bathroomCount: propertyData.bathroomCount,
        totalAreaSqM: propertyData.totalAreaSqM,
        condition: propertyData.condition,
        estimatedValue: propertyData.estimatedValue,
        address: {
          streetLine1: propertyData.address?.streetLine1,
          city: propertyData.address?.city,
          postalCode: propertyData.address?.postalCode,
          state: propertyData.address?.state,
        },
        sellerProperties: propertyData.sellers.map((seller: any) => ({
          id: `${propertyData.id}_${seller.id}`,
          sellerId: seller.id,
          propertyId: propertyData.id,
          ownershipPercentage: 100 / propertyData.sellers.length,
          seller: {
            id: seller.id,
            firstName: seller.firstName,
            lastName: seller.lastName,
            email: seller.email || undefined,
          },
        })),
      } as PropertyDetailsApiData)
    )

    // Then initialize the form data
    dispatch(
      initializeForm({
        ...propertyInfo,
        photos: [], // Initialize with empty photos array
        features: (propertyInfo.features || []).filter(
          (feature): feature is PropertyFeatureInput =>
            [
              "Garden",
              "Garage",
              "Parking",
              "Central Heating",
              "Double Glazing",
              "Conservatory",
            ].includes(feature)
        ),
        // Add documents from the API response
        documents:
          propertyData.documents?.map((doc: any) => ({
            id: doc.id,
            documentType: doc.documentType,
            filename: doc.filename,
            fileUrl: doc.fileUrl,
            verified: doc.verified,
            isTemp: false,
          })) || [],
      } as PropertyDetailsForm)
    )

    // 3. Review Data
    if (reviewData && propertyData.review) {
      const reviewPayload: Review = {
        propertyId: propertyData.id,
        sellerId: propertyData.sellers[0]?.id || "",
        checklist: reviewData.checklist,
        considerations: reviewData.considerations,
        coSellerIds: propertyData.sellers
          .slice(1)
          .map((seller: any) => seller.id),
        status: "in_progress",
      }
      dispatch(setReview(reviewPayload))
    }

    // Update wizard data with all fetched information
    setWizardData({
      sellerInformation: sellerInfo,
      propertyInformation: {
        ...propertyInfo,
        documents:
          propertyData.documents?.map((doc: any) => ({
            ...doc,
            isTemp: false,
          })) || [],
      },
      reviewData: reviewData,
    })

    setIsPropertyDataLoaded(true)
  }

  // Show loading state while checking for existing property
  if (isLoading) {
    return (
      <WizardLayout
        botResponses={{}}
        currentStep={currentStep}
        guideMessage="Loading..."
        suggestedQuestions={[]}
      >
        <div className="flex h-[60vh] items-center justify-center">
          <Spinner />
          <p className="ml-4 text-lg text-muted-foreground">Loading...</p>
        </div>
      </WizardLayout>
    )
  }

  // Show error state if property validation fails
  if (propertyValidationQuery.error) {
    console.error(
      "Error checking existing property:",
      propertyValidationQuery.error
    )
    toast({
      title: "Error",
      description:
        "Failed to check for existing property applications. Please try again.",
      variant: "destructive",
    })
  }

  // Show error state if property data failed to load
  if (!isPropertyDataLoaded && propertyValidationQuery.error) {
    return (
      <WizardLayout
        botResponses={{}}
        currentStep={currentStep}
        guideMessage="Error loading property details"
        suggestedQuestions={[]}
      >
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <p className="mb-4 text-lg text-destructive">
            Failed to load property details
          </p>
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push(`/${params.lng}/my-properties`)}
          >
            Go to My Properties
          </button>
        </div>
      </WizardLayout>
    )
  }

  const updateWizardData = (stepData: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...stepData }))
  }

  const clearWizardData = () => {
    setWizardData({})
    localStorage.clear()
  }

  // Modify the step update function to remove URL params
  const updateUrlWithStep = () => {
    // Remove step from URL if it exists
    const newParams = new URLSearchParams(searchParams?.toString() || "")
    newParams.delete("step")
    router.push(`?${newParams.toString()}`, { scroll: false })
  }

  const handleNext = () => {
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1]

      // Update state immediately
      setCurrentStep(nextStep)

      // Remove step from URL
      const newParams = new URLSearchParams(window.location.search)
      newParams.delete("step")
      window.history.pushState({}, "", `?${newParams.toString()}`)

      // Also update through router for Next.js state management
      router.replace(`?${newParams.toString()}`, { scroll: false })

      // Smooth scroll after state updates
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
    }
  }

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      const prevStep = stepOrder[currentIndex - 1]

      // Update state immediately
      setCurrentStep(prevStep)

      // Only enable edit mode if we have data for the previous step
      if (
        [
          "Seller Information",
          "Property Information",
          "Review & Recommendations",
        ].includes(currentStep)
      ) {
        const shouldEnableEdit =
          (prevStep === "Seller Information" && sellerData) ||
          (prevStep === "Property Information" && propertyData) ||
          (prevStep === "Review & Recommendations" && reviewData)

        if (shouldEnableEdit) {
          updateWizardData({ editMode: "edit" })
        } else {
          updateWizardData({ editMode: undefined })
        }
      }

      // Remove step from URL
      const newParams = new URLSearchParams(window.location.search)
      newParams.delete("step")
      window.history.pushState({}, "", `?${newParams.toString()}`)

      // Also update through router for Next.js state management
      router.replace(`?${newParams.toString()}`, { scroll: false })

      // Smooth scroll after state updates
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
    }
  }

  const handleStepChange = (step: WizardStep) => {
    if (propertyValidationQuery.data?.currentStep) {
      // If we have a currentStep from validation, only allow moving to that step or earlier steps
      const validationStep = propertyValidationQuery.data.currentStep
      const currentStepIndex = stepOrder.indexOf(validationStep)
      const targetStepIndex = stepOrder.indexOf(step)

      if (targetStepIndex > currentStepIndex) {
        toast({
          title: "Cannot Skip Steps",
          description: "Please complete the current step before proceeding.",
          variant: "default",
          duration: 3000,
        })
        return
      }
    }
    setCurrentStep(step)
    updateUrlWithStep()
  }

  // Add a simulated verification check function
  const checkVerificationStatus = async (): Promise<boolean> => {
    // Simulate an API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would be an actual API call
        // For demo purposes, randomly return true ~25% of the time
        const isVerified = Math.random() < 0.25
        resolve(isVerified)
      }, 1500)
    })
  }

  const handleEdit = (
    section: "property" | "owner",
    options?: { mode: string }
  ) => {
    // Always set edit mode for both sections
    updateWizardData({ editMode: "edit" })

    // Navigate to the appropriate starting step based on which section is being edited
    if (section === "owner") {
      // If editing owner, start at seller information since it's the first step
      setCurrentStep("Seller Information")
    } else {
      // If editing property, start at property information
      setCurrentStep("Property Information")
    }
  }

  const getCurrentStepContent = () => {
    // If we don't have property data yet, show loading
    if (!isPropertyDataLoaded && propertyValidationQuery.isLoading) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
          <Spinner />
          <p className="ml-4 text-lg text-muted-foreground">
            Loading property details...
          </p>
        </div>
      )
    }

    // If property data failed to load
    if (!isPropertyDataLoaded && propertyValidationQuery.error) {
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <p className="mb-4 text-lg text-destructive">
            Failed to load property details
          </p>
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push(`/${params.lng}/my-properties`)}
          >
            Go to My Properties
          </button>
        </div>
      )
    }

    switch (currentStep) {
      case "Seller Information":
        return (
          <SellerInformation
            defaultValues={wizardData.sellerInformation}
            mode={wizardData.editMode || "create"}
            readOnly={isContinueAgainMode}
            previousStepAddress={
              wizardData.propertyInformation
                ? {
                    address: wizardData.propertyInformation.address,
                    postcode: wizardData.propertyInformation.postcode,
                    town: wizardData.propertyInformation.town,
                    county: wizardData.propertyInformation.county,
                  }
                : undefined
            }
            onBack={handleBack}
            onSubmit={(data) => {
              updateWizardData({
                sellerInformation: data,
                editMode: wizardData.editMode,
              })
              handleNext()
            }}
          />
        )
      case "Property Information":
        return (
          <PropertyInformation
            mode={wizardData.editMode || "create"}
            onBack={handleBack}
            onSubmit={(data) => {
              updateWizardData({
                propertyInformation: data,
                editMode: wizardData.editMode,
              })
              handleNext()
            }}
            {...({ defaultValues: wizardData.propertyInformation } as any)}
            propertyId={currentPropertyId}
            readOnly={isContinueAgainMode}
          />
        )
      case "Review & Recommendations":
        return (
          <ReviewAndRecommendations
            defaultValues={wizardData.reviewData}
            propertyId={currentPropertyId}
            readOnly={isContinueAgainMode}
            updateWizardData={updateWizardData}
            data={{
              propertyDetails: {
                id:
                  currentPropertyId || wizardData.propertyInformation?.id || "",
                propertyType:
                  wizardData.propertyInformation?.propertyType || "",
                status: wizardData.propertyInformation?.propertyStatus || "",
                bedrooms: wizardData.propertyInformation?.bedrooms || "",
                bathrooms: wizardData.propertyInformation?.bathrooms || "",
                estimatedValue:
                  wizardData.propertyInformation?.estimatedValue || "",
              },
              ownerInformation: {
                id: wizardData.sellerInformation?.owners[0]?.id || "",
                numberOfOwners:
                  wizardData.sellerInformation?.numberOfOwners || 1,
                primaryContact: `${wizardData.sellerInformation?.owners[0]?.firstName || ""} ${wizardData.sellerInformation?.owners[0]?.lastName || ""}`,
                email: wizardData.sellerInformation?.owners[0]?.email || "",
                phone: wizardData.sellerInformation?.owners[0]?.phone || "",
              },
            }}
            onBack={handleBack}
            onEdit={(section, options) => handleEdit(section, options)}
            onSubmit={(data) => {
              updateWizardData({
                reviewData: data,
                editMode: undefined,
              })
              handleNext()
            }}
          />
        )
      case "Contemplation":
        return (
          <Contemplation
            checkVerification={checkVerificationStatus}
            isContinueAgainMode={isContinueAgainMode}
            propertyId={currentPropertyId}
            updateWizardData={(data) => {
              // Set continue-again mode when entering contemplation
              setIsContinueAgainMode(true)
              updateWizardData(data)
            }}
            onBack={handleBack}
            onComplete={handleNext}
          />
        )
      case "Offer & Next Steps":
        return wizardData.propertyInformation &&
          wizardData.sellerInformation ? (
          <ProvisionalOffer
            defaultValues={wizardData.provisionalOffer}
            isContinueAgainMode={isContinueAgainMode}
            propertyId={currentPropertyId}
            data={{
              referenceNumber:
                wizardData.contemplationData?.applicationId ||
                `SR${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              dateOfIssue: new Date().toLocaleDateString(),
              property: {
                propertyId:
                  currentPropertyId || wizardData.propertyInformation.id || "",
                address: `${wizardData.propertyInformation.address}, ${wizardData.propertyInformation.town}, ${wizardData.propertyInformation.postcode}`,
                owners: wizardData.sellerInformation.owners.map(
                  (owner) => `${owner.firstName} ${owner.lastName}`
                ),
                titleNumber: "A1234567",
                tenure: wizardData.propertyInformation.propertyStatus,
                type: wizardData.propertyInformation.propertyType,
              },
              valuation: {
                marketValue: parseInt(
                  wizardData.propertyInformation.estimatedValue.replace(
                    /[^0-9]/g,
                    ""
                  ) || "0"
                ),
                purchasePrice:
                  parseInt(
                    wizardData.propertyInformation.estimatedValue.replace(
                      /[^0-9]/g,
                      ""
                    ) || "0"
                  ) * 0.8,
                initialLumpSum:
                  parseInt(
                    wizardData.propertyInformation.estimatedValue.replace(
                      /[^0-9]/g,
                      ""
                    ) || "0"
                  ) * 0.24,
                remainingBalance:
                  parseInt(
                    wizardData.propertyInformation.estimatedValue.replace(
                      /[^0-9]/g,
                      ""
                    ) || "0"
                  ) * 0.56,
                monthlyPayment: 500,
                annuityTerm: "Lifetime (minimum 10 years)",
              },
            }}
            onBack={handleBack}
            onSubmit={(state) => {
              updateWizardData({ provisionalOffer: state })
              handleNext()
            }}
          />
        ) : null
      case "Completion Status":
        return (
          <CompletionStatus
            propertyId={currentPropertyId}
            defaultValues={
              wizardData.solicitorData || {
                choice: "recommend-solicitor",
                solicitor: {
                  name: "",
                  firmName: "",
                  email: "",
                  phone: "",
                  address: "",
                },
                propertyId:
                  currentPropertyId || wizardData.propertyInformation?.id || "",
                sellerId: wizardData.sellerInformation?.owners?.[0]?.id || "",
              }
            }
            onClose={() => {
              setCurrentStep("Seller Information")
              clearWizardData()
              setIsContinueAgainMode(false)
              setCurrentPropertyId(undefined)
            }}
            onDelete={() => {
              updateWizardData({ solicitorData: undefined })
            }}
            onUpdate={(data) => {
              updateWizardData({ solicitorData: data })
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <WizardLayout
      currentStep={currentStep}
      guideMessage="Welcome to the Estate Flex application process. I'll guide you through each step."
      botResponses={{
        process:
          "The application process consists of several steps including property information, seller details, and financial assessment. Each step is designed to be straightforward and user-friendly.",
        documents:
          "You'll need property ownership documents, identification, and financial records. We'll guide you through the specific requirements at each stage.",
        timeline:
          "The initial application typically takes 30-45 minutes. Once submitted, we aim to provide a provisional offer within 48 hours.",
      }}
      suggestedQuestions={[
        {
          id: "process",
          text: "What is the application process?",
          category: "general",
        },
        {
          id: "documents",
          text: "What documents do I need?",
          category: "preparation",
        },
        {
          id: "timeline",
          text: "How long does it take?",
          category: "timeline",
        },
      ]}
    >
      {getCurrentStepContent()}
    </WizardLayout>
  )
}

/* eslint-disable import/order */
/* eslint-disable max-lines */
"use client"
import { useEffect, useState } from "react"

import { BarChart2, ChevronDown, ChevronUp, Info, ZapIcon } from "lucide-react"

import type { WizardStep } from "@/components/WizardCore"
import type { BuyBoxCreationWizardData } from "../_components/BuyBoxCreation/types"

import { Stepper, WizardLayout } from "@/components/WizardCore"

// Import all step components
import { CapitalDeploymentStep } from "../_components/BuyBoxCreation/Steps/CapitalDeploymentStep"
import { ComplianceLegalStep } from "../_components/BuyBoxCreation/Steps/ComplianceLegalStep"
import { ContinuousManagementStep } from "../_components/BuyBoxCreation/Steps/ContinuousManagementStep"
import { FinalConfigurationStep } from "../_components/BuyBoxCreation/Steps/FinalConfigurationStep"
import { FinancialModelingStep } from "../_components/BuyBoxCreation/Steps/FinancialModelingStep"
import { InvestorEngagementStep } from "../_components/BuyBoxCreation/Steps/InvestorEngagementStep"
import { PlatformListingStep } from "../_components/BuyBoxCreation/Steps/PlatformListingStep"
import { PropertyAggregationStep } from "../_components/BuyBoxCreation/Steps/PropertyAggregationStep"
import { ThemeConceptualizationStep } from "../_components/BuyBoxCreation/Steps/ThemeConceptualizationStep"
import { BUYBOX_CREATION_STEPS } from "../_components/BuyBoxCreation/types"

// Default values for auto-fill functionality
const DEFAULT_VALUES: BuyBoxCreationWizardData = {
  buyBoxTheme: {
    name: "London Luxury Residence Collection",
    description:
      "A curated selection of premium properties in London's most prestigious neighborhoods, offering investors access to high-yield assets with strong appreciation potential.",
    themeType: "location",
    location: {
      city: "London",
      region: "Greater London",
      postalCode: ["SW1", "SW3", "SW7", "W1", "W8"],
      country: "United Kingdom",
    },
    propertyType: ["luxury", "residential"],
    demographicProfile: {
      minAge: 68,
      maxAge: 85,
      occupancyStatus: "owner-occupied",
    },
    additionalCriteria:
      "Focus on properties with historical significance, architectural merit, or unique character features.",
    targetInvestors: [
      "Pension funds",
      "Family offices",
      "High net-worth individuals",
    ],
  },
  selectedProperties: [
    {
      id: "prop-001",
      address: "15 Kensington Gardens, London SW7 1BA",
      propertyType: "luxury",
      ownershipStatus: "freehold",
      condition: "excellent",
      bedrooms: 4,
      bathrooms: 3,
      squareMeters: 210,
      yearBuilt: 1935,
      estimatedValue: 2100000,
      sellerDemographics: {
        age: 72,
        lifeExpectancy: 86,
      },
      dueDiligence: {
        appraisalCompleted: true,
        appraisalValue: 2150000,
        titleReportReviewed: true,
        legalReportReviewed: true,
        encumbrances: false,
      },
    },
    {
      id: "prop-003",
      address: "7 Belgravia Road, London SW1W 1JA",
      propertyType: "luxury",
      ownershipStatus: "freehold",
      condition: "excellent",
      bedrooms: 5,
      bathrooms: 4,
      squareMeters: 315,
      yearBuilt: 1890,
      estimatedValue: 3500000,
      sellerDemographics: {
        age: 79,
        lifeExpectancy: 89,
      },
      dueDiligence: {
        appraisalCompleted: true,
        appraisalValue: 3550000,
        titleReportReviewed: true,
        legalReportReviewed: true,
        encumbrances: false,
      },
    },
  ],
  financialModel: {
    totalBouquet: 7500000,
    totalMonthlyAnnuity: 45000,
    guaranteedTerms: {
      minYears: 5,
      details:
        "Minimum 5-year investment term with option to extend or exit after initial period",
    },
    expectedReturns: {
      conservativeYield: 6.2,
      targetYield: 7.5,
      optimisticYield: 8.8,
    },
    riskAnalysis: {
      longevityRisk: "medium",
      marketRisk: "low",
      defaultRisk: "low",
      notes:
        "London luxury market has shown resilience during economic downturns",
      riskRating: 3,
    },
    pricing: {
      totalInvestmentPrice: 25000000,
      bouquetPercentage: 30,
      annuityPercentage: 70,
      managementFees: 1.5,
      otherFees: 0.5,
    },
  },
  complianceInfo: {
    regulatoryCompliance: {
      fcaCompliant: true,
      mifidCompliant: true,
      otherRegulations: ["UK Property Regulations", "Anti-Money Laundering"],
    },
    legalChecks: {
      propertyLiensCleared: true,
      sellerRightsReviewed: true,
      contractObligationsReviewed: true,
    },
    documents: [
      {
        id: "doc-001",
        name: "Regulatory Compliance Report",
        type: "compliance",
        url: "/documents/compliance-report.pdf",
      },
      {
        id: "doc-002",
        name: "Legal Due Diligence Summary",
        type: "legal",
        url: "/documents/legal-summary.pdf",
      },
    ],
    internalApproval: {
      approvedBy: "Compliance Department",
      approvalDate: new Date().toISOString().split("T")[0],
      approvalNotes: "All regulatory requirements satisfied",
    },
  },
  platformListing: {
    buyBoxName: "London Luxury Residence Collection",
    shortDescription:
      "Premium properties in London's most prestigious neighborhoods",
    longDescription:
      "A carefully curated portfolio of luxury properties in central London offering strong yields and appreciation potential, with a focus on historical significance and architectural merit.",
    highlightFeatures: [
      "Prime Central London locations",
      "Historical properties with unique character",
      "Strong rental demand",
      "Potential for significant capital appreciation",
    ],
    investmentHighlights: [
      "7.5% target annual yield",
      "Minimum 5-year investment term",
      "Professional property management included",
      "Quarterly distribution of returns",
    ],
    riskDisclosures: [
      "Property values can fluctuate",
      "Returns not guaranteed",
      "Limited liquidity during investment term",
    ],
    documents: [
      {
        id: "pub-001",
        name: "Investment Prospectus",
        type: "prospectus",
        url: "/documents/prospectus.pdf",
        isPublic: true,
      },
      {
        id: "pub-002",
        name: "Financial Projections",
        type: "financial",
        url: "/documents/projections.pdf",
        isPublic: true,
      },
    ],
    publishStatus: "pending_review",
  },
  investorEngagement: {
    accessControls: {
      restrictedAccess: true,
      allowedInvestorGroups: [
        "Qualified Investors",
        "Premium Clients",
        "Institutional Investors",
      ],
      customInvitations: true,
    },
    investorCommunication: {
      initialAnnouncementSent: false,
      notifyMethod: "both",
      customMessage:
        "We're pleased to present an exclusive investment opportunity in London's luxury property market.",
    },
    subscriptionManagement: {
      minInvestmentAmount: 250000,
      maxTotalSubscription: 25000000,
      subscriptionDeadline: new Date(
        new Date().setMonth(new Date().getMonth() + 2)
      )
        .toISOString()
        .split("T")[0],
      earlyAccessPeriod: {
        enabled: true,
        startDate: new Date(new Date().setDate(new Date().getDate() + 7))
          .toISOString()
          .split("T")[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 21))
          .toISOString()
          .split("T")[0],
        groups: ["Premium Clients", "Institutional Investors"],
      },
    },
    qAndASettings: {
      enableLiveQAndA: true,
      automatedResponses: true,
      designatedResponders: ["Investment Team", "Property Specialists"],
    },
  },
  capitalDeployment: {
    fundsManagement: {
      escrowDetails: "Central Escrow Account #ESC-9876543",
      accountingContact: "Finance Department",
      fundsReceived: false,
      totalReceived: 0,
    },
    contractExecution: {
      scheduledExecutionDate: new Date(
        new Date().setDate(new Date().getDate() + 45)
      )
        .toISOString()
        .split("T")[0],
      legalRepresentative: "Legal Department",
      executionStatus: "pending",
      notes: "Contracts ready for execution upon funding completion",
    },
    propertyTransfers: {
      transferSchedule: new Date(new Date().setDate(new Date().getDate() + 60))
        .toISOString()
        .split("T")[0],
      registrationStatus: "not_started",
      lienRegistration: true,
    },
    sellerPayments: {
      bouquetPaymentDate: new Date(
        new Date().setDate(new Date().getDate() + 47)
      )
        .toISOString()
        .split("T")[0],
      bouquetPaymentStatus: "pending",
      firstAnnuityDate: new Date(new Date().setDate(new Date().getDate() + 75))
        .toISOString()
        .split("T")[0],
      paymentProcessingSystem: "Finance Platform",
    },
  },
  continuousManagement: {
    reportingSchedule: {
      frequency: "quarterly",
      nextReportDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
        .toISOString()
        .split("T")[0],
      includedMetrics: [
        "Yield",
        "Occupancy Rate",
        "Capital Appreciation",
        "Market Comparison",
      ],
      automatedDistribution: true,
    },
    performanceTracking: {
      trackingMetrics: [
        "Cash Flow",
        "Property Value",
        "Market Trends",
        "Maintenance Costs",
      ],
      benchmarks: ["UK Property Index", "London Luxury Market Index"],
      alertThresholds: {
        yieldAlert: 5.5,
        occupancyAlert: 85,
        otherAlerts: ["Major market movement", "Significant property damage"],
      },
    },
    investorRelations: {
      primaryContact: "Investor Relations Team",
      communicationFrequency: "Monthly",
      feedbackMechanism: "Online portal and direct email",
      escalationProcedure: "Tiered response system with 24h acknowledgment",
    },
    complianceReporting: {
      regulatoryReports: [
        "Quarterly FCA Compliance",
        "Annual Investment Review",
      ],
      internalAudits: true,
      auditFrequency: "Semi-annual",
      complianceOfficer: "Head of Compliance",
    },
  },
}

// Convert the step IDs to proper WizardStep objects
const wizardSteps: WizardStep[] = BUYBOX_CREATION_STEPS.map((step) => ({
  id: step.id,
  label: step.label,
}))

export default function BuyBoxCreationPage() {
  const [wizardData, setWizardData] = useState<BuyBoxCreationWizardData>({})
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [guideMessage, setGuideMessage] = useState(
    "Welcome to Buy Box Creation. Follow the steps to create a new investment opportunity. You can save your progress at any time and return later."
  )
  const [showStepper, setShowStepper] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [autoFillEnabled, setAutoFillEnabled] = useState(false)

  // Update wizardData when autoFillEnabled changes
  useEffect(() => {
    if (autoFillEnabled) {
      // Use the default values when auto-fill is enabled
      setWizardData(DEFAULT_VALUES)
    } else {
      // Set empty object when auto-fill is disabled
      setWizardData({})
    }
  }, [autoFillEnabled])

  // Navigation functions
  const goToNextStep = () => {
    if (currentStepIndex < wizardSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      handleComplete()
    }
  }

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  //   const goToStep = (stepIndex: number) => {
  //     if (stepIndex >= 0 && stepIndex < wizardSteps.length) {
  //       setCurrentStepIndex(stepIndex)
  //     }
  //   }

  // Update wizard data
  const updateWizardData = (newData: Partial<BuyBoxCreationWizardData>) => {
    setWizardData((prev) => ({ ...prev, ...newData }))
  }

  // Handle wizard completion
  const handleComplete = () => {
    alert(
      "Congratulations! Your Buy Box has been successfully created and submitted for approval. The administrative team will review it shortly."
    )
  }

  // Function to handle toggling auto-fill
  const handleAutoFillToggle = (enabled: boolean) => {
    setAutoFillEnabled(enabled)
  }

  // Render current step content
  const renderStepContent = () => {
    const currentStep = wizardSteps[currentStepIndex]
    const commonProps = {
      wizardData: autoFillEnabled ? DEFAULT_VALUES : wizardData,
      updateWizardData,
      onNext: goToNextStep,
      onBack: goToPreviousStep,
      setGuideMessage,
    }

    switch (currentStep.id) {
      case "theme-conceptualization":
        return (
          <ThemeConceptualizationStep
            key={autoFillEnabled ? "autofilled" : "empty"}
            {...commonProps}
          />
        )
      case "property-aggregation":
        return (
          <PropertyAggregationStep
            key={autoFillEnabled ? "autofilled" : "empty"}
            {...commonProps}
          />
        )
      case "financial-modeling":
        return (
          <FinancialModelingStep
            key={autoFillEnabled ? "autofilled" : "empty"}
            {...commonProps}
          />
        )
      case "compliance-legal":
        return (
          <ComplianceLegalStep
            key={autoFillEnabled ? "autofilled" : "empty"}
            {...commonProps}
          />
        )
      case "platform-listing":
        return (
          <PlatformListingStep
            key={autoFillEnabled ? "autofilled" : "empty"}
            {...commonProps}
          />
        )
      case "investor-engagement":
        return (
          <InvestorEngagementStep
            key={autoFillEnabled ? "autofilled" : "empty"}
            {...commonProps}
          />
        )
      case "capital-deployment":
        return (
          <CapitalDeploymentStep
            key={autoFillEnabled ? "autofilled" : "empty"}
            {...commonProps}
          />
        )
      case "continuous-management":
        return (
          <ContinuousManagementStep
            key={autoFillEnabled ? "autofilled" : "empty"}
            setGuideMessage={setGuideMessage}
            updateWizardData={updateWizardData}
            wizardData={autoFillEnabled ? DEFAULT_VALUES : wizardData}
            onBack={goToPreviousStep}
            onComplete={() => setCurrentStepIndex(currentStepIndex + 1)}
          />
        )
      case "final-configuration":
        return (
          <FinalConfigurationStep
            key={autoFillEnabled ? "autofilled" : "empty"}
            {...commonProps}
          />
        )
      default:
        return <div>Unknown step</div>
    }
  }

  // Calculate progress percentage
  const progressPercentage = ((currentStepIndex + 1) / wizardSteps.length) * 100

  return (
    <div className="container mx-auto mb-12 px-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Buy Box Creation</h1>
          <div className="flex space-x-2">
            <div className="flex items-center rounded-md border border-amber-200 bg-amber-50 px-3 py-1 hover:bg-amber-100 hover:text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:hover:bg-amber-900/30">
              <input
                checked={autoFillEnabled}
                className="mr-2 size-4 rounded border-amber-400 text-amber-600"
                id="auto-fill-toggle"
                type="checkbox"
                onChange={(e) => handleAutoFillToggle(e.target.checked)}
              />
              <label
                className="flex cursor-pointer items-center text-xs font-medium text-amber-800 dark:text-amber-400"
                htmlFor="auto-fill-toggle"
              >
                <ZapIcon className="mr-1 size-3" />
                Autofill
              </label>
            </div>
            <button
              className="flex items-center rounded-md border border-border bg-card px-3 py-1 text-xs font-medium hover:bg-muted/50"
              onClick={() => setShowProgress(!showProgress)}
            >
              {showProgress ? (
                <>
                  <ChevronUp className="mr-1 size-3" />
                  Hide Progress
                </>
              ) : (
                <>
                  <BarChart2 className="mr-1 size-3" />
                  View Progress ({Math.round(progressPercentage)}%)
                </>
              )}
            </button>
            <button
              className="flex items-center rounded-md border border-border bg-card px-3 py-1 text-xs font-medium hover:bg-muted/50"
              onClick={() => setShowStepper(!showStepper)}
            >
              {showStepper ? (
                <>
                  <ChevronUp className="mr-1 size-3" />
                  Hide Steps
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 size-3" />
                  View Steps ({currentStepIndex + 1}/{wizardSteps.length})
                </>
              )}
            </button>
            <button
              className="flex items-center rounded-md border border-border bg-card px-3 py-1 text-xs font-medium hover:bg-muted/50"
              onClick={() => setShowGuide(!showGuide)}
            >
              {showGuide ? (
                <>
                  <ChevronUp className="mr-1 size-3" />
                  Hide Guide
                </>
              ) : (
                <>
                  <Info className="mr-1 size-3" />
                  View Guide
                </>
              )}
            </button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Create a new Buy Box investment opportunity for your platform
        </p>
        {/* {autoFillEnabled && (
          <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-400">
            <p className="flex items-center">
              <span className="mr-2 inline-block">
                <ZapIcon className="size-4" />
              </span>
              Auto-Fill mode active - form fields will be automatically filled
              with sample data for quick navigation
            </p>
          </div>
        )} */}
      </div>

      <div className="mt-2">
        {/* Collapsible Progress bar - now independent from stepper */}
        {showProgress && (
          <div className="mb-4 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="font-medium text-muted-foreground">Progress:</div>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="font-semibold text-primary">
                {Math.round(progressPercentage)}%
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Step {currentStepIndex + 1} of {wizardSteps.length}:{" "}
              <span className="font-medium">
                {wizardSteps[currentStepIndex].label}
              </span>
            </div>
          </div>
        )}

        <WizardLayout>
          {/* Collapsible stepper */}
          {showStepper && (
            <div className="mb-4">
              <Stepper
                currentStepId={wizardSteps[currentStepIndex].id}
                steps={wizardSteps}
              />
            </div>
          )}

          <div className="mx-auto">
            {/* Collapsible guide message */}
            {showGuide && (
              <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
                <p>{guideMessage}</p>
              </div>
            )}

            {renderStepContent()}
          </div>
        </WizardLayout>
      </div>
    </div>
  )
}

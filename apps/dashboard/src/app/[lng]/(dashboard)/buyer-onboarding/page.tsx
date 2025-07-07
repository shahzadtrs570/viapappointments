/* eslint-disable max-lines */
"use client"

import { useEffect, useState } from "react"

import { BarChart2, ChevronDown, ChevronUp, Info, ZapIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"

import type { BuyerOnboardingData } from "./_components/types"
import type { WizardStepComponentProps } from "@/components/WizardCore/types"

import { Stepper, Wizard, WizardLayout } from "@/components/WizardCore"

import { BUYER_ONBOARDING_STEPS } from "./_components/constants"
import {
  BuyBoxAllocationAndInvestmentCommencementStep,
  DueDiligenceAndLegalComplianceStep,
  InitialInquiryAndPlatformIntroductionStep,
  InvestorProfileAndPreferencesSetupStep,
  MonitoringReportingAndInvestorRelationsStep,
  PlatformTrainingAndTechnicalOnboardingStep,
  QualificationAndKYCAMLProceduresStep,
  SecondaryMarketAndExitOpportunitiesStep,
  TransactionExecutionStep,
} from "./_components/Steps"

// Default values for the wizard steps for auto-fill functionality
const DEFAULT_VALUES: BuyerOnboardingData = {
  initialInquiry: {
    organisationName: "Demo Investment Partners",
    contactName: "John Smith",
    contactPosition: "Investment Director",
    contactEmail: "john.smith@example.com",
    contactPhone: "+44 20 1234 5678",
    referralSource: "Industry Event",
    initialInterestLevel: "high",
    preferredContactMethod: "email",
    introductoryCallScheduled: true,
    introductoryCallDate: new Date().toISOString().split("T")[0],
    platformOverviewProvided: true,
    initialQuestionsNotes:
      "Interested in luxury property investments in London.",
  },
  qualificationKYCAML: {
    investorType: "family_office",
    aum: 500000000,
    regulatoryStatus: {
      fcaRegulated: true,
      fcaReferenceNumber: "123456",
      otherRegulators: ["SEC"],
    },
    kycDocuments: {
      corporateDocuments: true,
      articlesOfIncorporation: true,
      directorsShareholders: true,
      regulatoryLicenses: true,
    },
    amlChecks: {
      uboVerification: true,
      sanctionsScreening: true,
      sourceFundsVerified: true,
      enhancedDueDiligence: true,
    },
    qualificationStatus: "qualified",
  },
  dueDiligenceLegal: {
    legalDocuments: {
      ddqCompleted: true,
      ddqSubmissionDate: new Date().toISOString().split("T")[0],
      legalReviewCompleted: true,
      complianceChecksCompleted: true,
    },
    platformAgreements: {
      masterInvestmentAgreementSigned: true,
      signatureDate: new Date().toISOString().split("T")[0],
      confidentialityAgreementSigned: true,
      ndaSigned: true,
    },
    liabilityFramework: {
      rolesResponsibilitiesAcknowledged: true,
      limitationsAcknowledged: true,
      disputeResolutionAcknowledged: true,
    },
    dueDiligenceNotes: "All due diligence completed successfully.",
  },
  investorProfile: {
    investmentPreferences: {
      geographicalPreferences: ["london", "southeast"],
      propertyTypes: ["luxury", "residential"],
      riskAppetite: "balanced",
      targetedReturns: 8,
      minimumInvestmentSize: 1000000,
      maximumInvestmentSize: 10000000,
      investmentHorizon: 5,
    },
    buyBoxPreferences: {
      locationFocus: ["london", "southeast"],
      propertyCategories: ["luxury", "residential"],
      sellerDemographicsImportance: "medium",
      minimumPropertyValue: 500000,
    },
    allocationStrategy: {
      minimumBuyBoxAllocation: 500000,
      maximumBuyBoxAllocation: 5000000,
      diversificationRequirements: "Balanced portfolio across property types",
      concentrationLimits: "No more than 30% in any single property type",
    },
    performanceExpectations: {
      annualYieldTarget: 6,
      totalReturnTarget: 8,
      volatilityTolerance: "Medium",
      benchmarks: ["UK Property Index"],
    },
    additionalRequirements: "Focus on ESG-friendly properties",
  },
  platformTraining: {
    userAccounts: {
      primaryAdminCreated: true,
      additionalUsersCreated: true,
      numberOfUsers: 3,
      rolesAssigned: true,
      twoFactorEnabled: true,
    },
    accessPermissions: {
      dataRoomAccess: true,
      reportingAccess: true,
      transactionAccess: true,
      adminRights: true,
      customPermissions: ["API Access"],
    },
    trainingCompleted: {
      platformOverview: true,
      portfolioManagement: true,
      reportingDashboards: true,
      complianceTools: true,
      dataRoomUsage: true,
      analyticTools: true,
    },
    technicalContact: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+44 20 8765 4321",
    },
    onboardingNotes: "All users successfully trained",
  },
  buyBoxAllocation: {
    presentedBuyBoxes: [
      {
        id: "bb-001",
        name: "London Luxury Residences",
        presentationDate: new Date().toISOString().split("T")[0],
        investorInterest: "high",
        followUpRequired: false,
      },
      {
        id: "bb-002",
        name: "Southeast Heritage Portfolio",
        presentationDate: new Date().toISOString().split("T")[0],
        investorInterest: "medium",
        followUpRequired: true,
      },
    ],
    selectedBuyBoxes: [
      {
        id: "bb-001",
        name: "London Luxury Residences",
        allocationAmount: 3000000,
        selectionDate: new Date().toISOString().split("T")[0],
        dueDiligenceStatus: "completed",
      },
    ],
    dueDiligenceRequests: {
      legalReviewRequested: true,
      financialAnalysisRequested: true,
      riskAssessmentRequested: true,
      additionalInformationRequested: false,
    },
    investmentCommitment: {
      agreementsSigned: true,
      signatureDate: new Date().toISOString().split("T")[0],
      capitalCommitted: 3000000,
      fundingScheduleAgreed: true,
      initialFundingDate: new Date().toISOString().split("T")[0],
    },
  },
  transactionExecution: {
    fundingArrangements: {
      escrowAccountEstablished: true,
      escrowDetails: "Account #12345 at Barclays Bank",
      initialFundsReceived: true,
      amountReceived: 3000000,
      fundingCompleted: true,
    },
    capitalDeployment: {
      deploymentSchedule: "immediate",
      contractsExecuted: true,
      executionDate: new Date().toISOString().split("T")[0],
      deploymentProgress: 100,
    },
    viagerPurchases: {
      completedPurchases: 5,
      bouquetPaymentsMade: 5,
      annuitySetupCompleted: true,
    },
    legalSecurities: {
      legalChargesRegistered: true,
      securityDocumentation: true,
      lienRegistrationStatus: "completed",
    },
  },
  monitoringReporting: {
    reportingSetup: {
      reportingFrequency: "quarterly",
      automaticReportingEnabled: true,
      customReportingRequirements: ["ESG Metrics", "Occupancy Rates"],
      nextReportDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
        .toISOString()
        .split("T")[0],
    },
    portfolioMonitoring: {
      realTimeAccessEnabled: true,
      alertsConfigured: true,
      performanceMetricsTracked: [
        "occupancy",
        "yield",
        "capital-appreciation",
        "cash-flow",
      ],
      benchmarkingSetup: true,
    },
    investorCommunication: {
      regularCallsScheduled: true,
      callFrequency: "Monthly",
      relationshipManagerAssigned: true,
      relationshipManagerName: "Emma Thompson",
      feedbackMechanismEstablished: true,
    },
    continuousSupport: {
      complianceAssistanceAvailable: true,
      strategyAdjustmentProcess: true,
      escalationProcedure: true,
    },
    monitoringNotes: "All monitoring systems set up successfully",
  },
  secondaryMarket: {
    secondaryMarketAccess: {
      accessEnabled: true,
      liquidityOptionsReviewed: true,
      secondaryMarketTermsAcknowledged: true,
    },
    exitPlanning: {
      initialInvestmentTerm: 5,
      autoRenewalOption: true,
      exitStrategyDiscussed: true,
      plannedExitDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 5)
      )
        .toISOString()
        .split("T")[0],
    },
    valuationFramework: {
      regularValuationSchedule: true,
      valuationMethodologyAgreed: true,
      independentValuationsRequired: true,
      lastValuationDate: new Date().toISOString().split("T")[0],
    },
    exitNotes: "Planning for five-year investment term with potential renewal",
  },
}

export default function BuyerOnboardingPage() {
  // const router = useRouter()
  const searchParams = useSearchParams()

  // State for the guide bot messages
  const [guideBotMessage, setGuideBotMessage] = useState(
    "Welcome to Srenova's Institutional Buyer Onboarding. I'll guide you through each step of becoming an investment partner on our platform."
  )
  const [showStepper, setShowStepper] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [autoFillEnabled, setAutoFillEnabled] = useState(false)
  const [wizardData, setWizardData] = useState<BuyerOnboardingData>({})

  // Get initial step from URL query parameter
  const stepParam = searchParams.get("step")
  const initialStep = stepParam || "initial-inquiry"

  // Function to handle toggling auto-fill
  const handleAutoFillToggle = (enabled: boolean) => {
    setAutoFillEnabled(enabled)
  }

  // Update wizardData when autoFillEnabled changes
  useEffect(() => {
    if (autoFillEnabled) {
      setWizardData(DEFAULT_VALUES)
    } else {
      setWizardData({})
    }
  }, [autoFillEnabled])

  // Function to update URL query param when step changes
  // const updateStepInURL = (stepId: string) => {
  //   const newParams = new URLSearchParams(searchParams.toString())
  //   newParams.set("step", stepId)
  //   router.push(`?${newParams.toString()}`)
  // }

  return (
    <div className="container mx-auto mb-12 px-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Buyer Onboarding</h1>
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
                  View Progress
                </>
              )}
            </button>
            <button
              className="flex items-center rounded-md border border-border bg-card px-3 py-1 text-xs font-medium hover:bg-muted/50"
              onClick={() => setShowStepper(!showStepper)}
            >
              {showStepper ? (
                <>
                  <ChevronUp className="mr-1 size-3" />({currentStepIdx + 1}/
                  {BUYER_ONBOARDING_STEPS.length}) Hide Steps
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 size-3" />({currentStepIdx + 1}/
                  {BUYER_ONBOARDING_STEPS.length}) View Steps
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
          Complete your onboarding process to become a qualified investor on our
          platform
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

      <Wizard<BuyerOnboardingData>
        initialData={wizardData}
        initialStep={initialStep}
        steps={BUYER_ONBOARDING_STEPS}
        storageKey="srenova_buyer_onboarding"
        renderStep={(props: WizardStepComponentProps<BuyerOnboardingData>) => {
          // Calculate progress percentage
          const currentStepIndex = BUYER_ONBOARDING_STEPS.findIndex(
            (step) => step.id === props.currentStep.id
          )
          const progressPercentage =
            ((currentStepIndex + 1) / BUYER_ONBOARDING_STEPS.length) * 100

          // Update the current step index for the top buttons
          setCurrentStepIdx(currentStepIndex)

          // Update the URL query parameter when step changes
          // useEffect(() => {
          //   updateStepInURL(props.currentStep.id)
          // }, [props.currentStep.id])

          // Create a fillDemoData function that will trigger auto-fill
          const fillDemoData = () => {
            setWizardData(DEFAULT_VALUES)
            handleAutoFillToggle(true)
          }

          return (
            <div className="mt-2">
              {/* Collapsible Progress bar */}
              {showProgress && (
                <div className="mb-4 rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="font-medium text-muted-foreground">
                      Progress:
                    </div>
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
                    Step {currentStepIndex + 1} of{" "}
                    {BUYER_ONBOARDING_STEPS.length}:{" "}
                    <span className="font-medium">
                      {props.currentStep.label}
                    </span>
                  </div>
                </div>
              )}

              <WizardLayout>
                {/* Collapsible stepper */}
                {showStepper && (
                  <div className="mb-4">
                    <Stepper
                      currentStepId={props.currentStep.id}
                      steps={BUYER_ONBOARDING_STEPS}
                    />
                  </div>
                )}

                <div className="mx-auto">
                  {/* Collapsible guide message */}
                  {showGuide && (
                    <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
                      <p>{guideBotMessage}</p>
                    </div>
                  )}

                  {/* Render the appropriate step component based on currentStep */}
                  {props.currentStep.id === "initial-inquiry" && (
                    <InitialInquiryAndPlatformIntroductionStep
                      fillDemoData={fillDemoData}
                      setGuideMessage={setGuideBotMessage}
                      updateWizardData={props.updateWizardData}
                      wizardData={
                        autoFillEnabled ? DEFAULT_VALUES : props.wizardData
                      }
                      onBack={props.goToPreviousStep}
                      onNext={props.goToNextStep}
                    />
                  )}

                  {props.currentStep.id === "qualification" && (
                    <QualificationAndKYCAMLProceduresStep
                      fillDemoData={fillDemoData}
                      setGuideMessage={setGuideBotMessage}
                      updateWizardData={props.updateWizardData}
                      wizardData={
                        autoFillEnabled ? DEFAULT_VALUES : props.wizardData
                      }
                      onBack={props.goToPreviousStep}
                      onNext={props.goToNextStep}
                    />
                  )}

                  {props.currentStep.id === "due-diligence" && (
                    <DueDiligenceAndLegalComplianceStep
                      fillDemoData={fillDemoData}
                      setGuideMessage={setGuideBotMessage}
                      updateWizardData={props.updateWizardData}
                      wizardData={
                        autoFillEnabled ? DEFAULT_VALUES : props.wizardData
                      }
                      onBack={props.goToPreviousStep}
                      onNext={props.goToNextStep}
                    />
                  )}

                  {props.currentStep.id === "investor-profile" && (
                    <InvestorProfileAndPreferencesSetupStep
                      fillDemoData={fillDemoData}
                      setGuideMessage={setGuideBotMessage}
                      updateWizardData={props.updateWizardData}
                      wizardData={
                        autoFillEnabled ? DEFAULT_VALUES : props.wizardData
                      }
                      onBack={props.goToPreviousStep}
                      onNext={props.goToNextStep}
                    />
                  )}

                  {props.currentStep.id === "platform-training" && (
                    <PlatformTrainingAndTechnicalOnboardingStep
                      fillDemoData={fillDemoData}
                      setGuideMessage={setGuideBotMessage}
                      updateWizardData={props.updateWizardData}
                      wizardData={
                        autoFillEnabled ? DEFAULT_VALUES : props.wizardData
                      }
                      onBack={props.goToPreviousStep}
                      onNext={props.goToNextStep}
                    />
                  )}

                  {props.currentStep.id === "buy-box-allocation" && (
                    <BuyBoxAllocationAndInvestmentCommencementStep
                      fillDemoData={fillDemoData}
                      setGuideMessage={setGuideBotMessage}
                      updateWizardData={props.updateWizardData}
                      wizardData={autoFillEnabled ? DEFAULT_VALUES : wizardData}
                      onBack={props.goToPreviousStep}
                      onNext={props.goToNextStep}
                    />
                  )}

                  {props.currentStep.id === "transaction-execution" && (
                    <TransactionExecutionStep
                      fillDemoData={fillDemoData}
                      setGuideMessage={setGuideBotMessage}
                      updateWizardData={props.updateWizardData}
                      wizardData={
                        autoFillEnabled ? DEFAULT_VALUES : props.wizardData
                      }
                      onBack={props.goToPreviousStep}
                      onNext={props.goToNextStep}
                    />
                  )}

                  {props.currentStep.id === "monitoring-reporting" && (
                    <MonitoringReportingAndInvestorRelationsStep
                      fillDemoData={fillDemoData}
                      setGuideMessage={setGuideBotMessage}
                      updateWizardData={props.updateWizardData}
                      wizardData={
                        autoFillEnabled ? DEFAULT_VALUES : props.wizardData
                      }
                      onBack={props.goToPreviousStep}
                      onNext={props.goToNextStep}
                    />
                  )}

                  {props.currentStep.id === "secondary-market" && (
                    <SecondaryMarketAndExitOpportunitiesStep
                      fillDemoData={fillDemoData}
                      setGuideMessage={setGuideBotMessage}
                      updateWizardData={props.updateWizardData}
                      wizardData={
                        autoFillEnabled ? DEFAULT_VALUES : props.wizardData
                      }
                      onBack={props.goToPreviousStep}
                      onComplete={() => {
                        // Handle completion of the wizard
                        alert(
                          "Buyer onboarding completed successfully! You can now access Buy-Box investments."
                        )
                        // In a real implementation, this would redirect to the dashboard
                      }}
                    />
                  )}
                </div>
              </WizardLayout>
            </div>
          )
        }}
      />
    </div>
  )
}

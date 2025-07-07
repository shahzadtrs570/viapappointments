/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable react/function-component-definition */
/*eslint-disable import/no-default-export */
/*eslint-disable @typescript-eslint/no-unnecessary-condition */
import type React from "react"
import { useEffect, useState } from "react"

import type { BuyerOnboardingData } from "./types"

import { BUYER_ONBOARDING_STEPS } from "./constants"
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
} from "./Steps"

interface BuyerOnboardingWizardProps {
  initialData?: BuyerOnboardingData
  onAutoFillToggle?: (enabled: boolean) => void
  showGuide?: boolean
  showProgress?: boolean
  showStepper?: boolean
  guideBotMessage?: string
  setGuideBotMessage?: (message: string) => void
}

const BuyerOnboardingWizard: React.FC<BuyerOnboardingWizardProps> = ({
  initialData = {},
  setGuideBotMessage = () => {},
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<Record<string, any>>(
    initialData || {}
  )

  // Update wizard data when initialData changes (for auto-fill)
  useEffect(() => {
    setWizardData(initialData || {})
  }, [initialData])

  const updateWizardData = (data: any) => {
    setWizardData((prevData) => ({
      ...prevData,
      ...data,
    }))
  }

  const goToNextStep = () => {
    if (currentStep < Object.keys(BUYER_ONBOARDING_STEPS).length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Show completion alert as in original page.tsx
    alert(
      "Buyer onboarding completed successfully! You can now access Buy Box investments."
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <InitialInquiryAndPlatformIntroductionStep
            setGuideMessage={setGuideBotMessage}
            updateWizardData={updateWizardData}
            wizardData={wizardData}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      case 2:
        return (
          <QualificationAndKYCAMLProceduresStep
            setGuideMessage={setGuideBotMessage}
            updateWizardData={updateWizardData}
            wizardData={wizardData}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      case 3:
        return (
          <DueDiligenceAndLegalComplianceStep
            setGuideMessage={setGuideBotMessage}
            updateWizardData={updateWizardData}
            wizardData={wizardData}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      case 4:
        return (
          <InvestorProfileAndPreferencesSetupStep
            setGuideMessage={setGuideBotMessage}
            updateWizardData={updateWizardData}
            wizardData={wizardData}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      case 5:
        return (
          <PlatformTrainingAndTechnicalOnboardingStep
            setGuideMessage={setGuideBotMessage}
            updateWizardData={updateWizardData}
            wizardData={wizardData}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      case 6:
        return (
          <BuyBoxAllocationAndInvestmentCommencementStep
            setGuideMessage={setGuideBotMessage}
            updateWizardData={updateWizardData}
            wizardData={wizardData}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      case 7:
        return (
          <TransactionExecutionStep
            setGuideMessage={setGuideBotMessage}
            updateWizardData={updateWizardData}
            wizardData={wizardData}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      case 8:
        return (
          <MonitoringReportingAndInvestorRelationsStep
            setGuideMessage={setGuideBotMessage}
            updateWizardData={updateWizardData}
            wizardData={wizardData}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      case 9:
        return (
          <SecondaryMarketAndExitOpportunitiesStep
            setGuideMessage={setGuideBotMessage}
            updateWizardData={updateWizardData}
            wizardData={wizardData}
            onBack={goToPreviousStep}
            onComplete={handleComplete}
          />
        )
      default:
        return null
    }
  }

  // Just return the current step component directly without the extra UI elements
  return renderCurrentStep()
}
export default BuyerOnboardingWizard

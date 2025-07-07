import type { BuyerOnboardingData } from "./types"

// Base props interface for all step components
export interface BaseStepProps {
  wizardData: BuyerOnboardingData
  updateWizardData: (data: Partial<BuyerOnboardingData>) => void
  onNext: () => void
  onBack: () => void
  setGuideMessage: (message: string) => void
  fillDemoData?: () => void // Optional function to fill all steps with demo data
}

// Extended props for the final step with onComplete handler
export interface FinalStepProps extends Omit<BaseStepProps, "onNext"> {
  onComplete: () => void
}

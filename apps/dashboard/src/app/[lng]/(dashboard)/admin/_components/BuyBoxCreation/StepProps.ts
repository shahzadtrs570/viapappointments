import type { BuyBoxCreationWizardData } from "./types"

// Base props interface for all step components
export interface BaseStepProps {
  wizardData: BuyBoxCreationWizardData
  updateWizardData: (data: Partial<BuyBoxCreationWizardData>) => void
  onNext: () => void
  onBack: () => void
  setGuideMessage: (message: string) => void
}

// Extended props for the final step with onComplete handler
export interface FinalStepProps extends Omit<BaseStepProps, "onNext"> {
  onComplete: () => void
}

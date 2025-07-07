/*eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react"

// Defining a step in the wizard
export interface WizardStep {
  id: string
  label: string
}

// Generic wizard data that can be extended by specific implementations
export interface WizardData {
  [key: string]: any
}

// Props for the Wizard component
export interface WizardProps<T extends WizardData> {
  steps: WizardStep[]
  initialStep?: string
  storageKey?: string
  initialData?: Partial<T>
  onComplete?: (data: T) => void
  renderStep: (props: WizardStepComponentProps<T>) => ReactNode
}

// Props passed to each step component
export interface WizardStepComponentProps<T extends WizardData> {
  currentStep: WizardStep
  wizardData: T
  updateWizardData: (stepData: Partial<T>) => void
  goToStep: (stepId: string) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

// Props for the wizard stepper component
export interface WizardStepperProps {
  steps: WizardStep[]
  currentStepId: string
  className?: string
}

// Props for the wizard layout component
export interface WizardLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  stepper?: ReactNode
  sidebar?: ReactNode
}

// Bot integration for guide assistance
export interface BotQuestion {
  id: string
  text: string
  category: string
  followUp?: string[]
}

export interface BotConfig {
  initialMessage?: string
  title?: string
  botResponses?: Record<string, string>
  suggestedQuestions?: BotQuestion[]
}

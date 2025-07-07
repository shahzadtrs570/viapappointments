/*eslint-disable react/jsx-max-depth*/
/*eslint-disable jsx-a11y/anchor-is-valid*/
/*eslint-disable react/no-unescaped-entities*/
/*eslint-disable max-lines*/
/*eslint-disable  @typescript-eslint/no-unused-vars*/
/*eslint-disable  jsx-a11y/click-events-have-key-events*/
/*eslint-disable  no-nested-ternary*/
import { Container } from "@package/ui/container"
import { GuideBot } from "@package/ui/guidebot"
import { Typography } from "@package/ui/typography"

import { Stepper, type WizardStep } from "./Stepper"

interface QuestionSuggestion {
  id: string
  text: string
  category: string
  followUp?: string[]
}

interface WizardLayoutProps {
  children: React.ReactNode
  currentStep: WizardStep
  guideMessage?: string
  suggestedQuestions?: QuestionSuggestion[]
  botResponses?: Record<string, string>
}

export function WizardLayout({
  children,
  currentStep,
  guideMessage,
  suggestedQuestions,
  botResponses,
}: WizardLayoutProps) {
  return (
    <div className="relative py-0 pb-8 md:py-1">
      {/* Make stepper sticky and always visible */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <Stepper currentStep={currentStep} />
      </div>

      <div className="mt-4 flex flex-col gap-8 lg:flex-row">
        {/* Main wizard content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}

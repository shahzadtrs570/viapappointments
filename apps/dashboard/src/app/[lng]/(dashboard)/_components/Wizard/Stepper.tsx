import { cn } from "@package/utils"
import { Check } from "lucide-react"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

export const WIZARD_STEPS = [
  // "Initial Entry",
  "Eligibility Assessment",
  "Sign Up & Verification",
  "Seller Information",
  "Property Information",
  "Review & Recommendations",
  "Contemplation",
  "Offer & Next Steps",
  "Completion Status",
] as const

export type WizardStep = (typeof WIZARD_STEPS)[number]

interface StepperProps {
  currentStep: WizardStep
  className?: string
}

// Helper function to map step display string to translation key
const stepToKey = (stepString: WizardStep): string => {
  switch (stepString) {
    // case "Initial Entry":
    //   return "initialEntry"
    case "Eligibility Assessment":
      return "eligibilityAssessment"
    case "Sign Up & Verification":
      return "signUpVerification"
    case "Seller Information":
      return "sellerInformation"
    case "Property Information":
      return "propertyInformation"
    case "Review & Recommendations":
      return "reviewAndRecommendations"
    case "Contemplation":
      return "contemplation"
    case "Offer & Next Steps":
      return "offerAndNextSteps"
    case "Completion Status":
      return "completionStatus"
    default:
      return "" // Should not happen ideally, add logging if necessary
  }
}

export function Stepper({ currentStep, className }: StepperProps) {
  const { t } = useClientTranslation("wizard_common")
  const currentStepIndex = WIZARD_STEPS.indexOf(currentStep)

  // Helper function to calculate mobile progress width
  const getMobileProgressWidth = (index: number, total: number) => {
    if (index === 0) return "0%"
    if (index === total - 1) return "100%"
    return "50%"
  }

  return (
    <div className={cn("relative w-full space-y-8", className)}>
      {/* Progress bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/30">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{
            width: `calc(${(100 / (WIZARD_STEPS.length - 1)) * currentStepIndex}% + ${currentStepIndex > 0 ? "50px" : "0px"})`,
          }}
        />
      </div>

      {/* Mobile view */}
      <div className="sm:hidden">
        <div className="relative flex items-center justify-between gap-4">
          {/* Mobile connector lines */}
          <div className="absolute inset-x-0 top-4 h-[2px] bg-muted/30" />
          <div
            className="absolute left-0 top-4 h-[2px] bg-primary transition-all duration-500 ease-in-out"
            style={{
              width: getMobileProgressWidth(
                currentStepIndex,
                WIZARD_STEPS.length
              ),
            }}
          />

          {/* Previous step */}
          {currentStepIndex > 0 && (
            <div className="flex flex-1 flex-col items-center">
              <div className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-primary text-primary-foreground">
                <Check className="size-4" />
              </div>
              <div className="mt-2 flex h-8 items-start justify-center">
                <span className="text-center text-xs text-primary">
                  {t(`steps.${stepToKey(WIZARD_STEPS[currentStepIndex - 1])}`)}
                </span>
              </div>
            </div>
          )}

          {/* Current step */}
          <div className="flex flex-1 flex-col items-center">
            <div className="relative z-10 flex size-10 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-medium text-primary">
              {currentStepIndex + 1}
            </div>
            <div className="mt-2 flex h-8 items-start justify-center">
              <span className="text-center text-xs font-medium text-primary">
                {t(`steps.${stepToKey(currentStep)}`)}
              </span>
            </div>
          </div>

          {/* Next step */}
          {currentStepIndex < WIZARD_STEPS.length - 1 && (
            <div className="flex flex-1 flex-col items-center">
              <div className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-muted bg-background text-sm font-medium text-muted-foreground">
                {currentStepIndex + 2}
              </div>
              <div className="mt-2 flex h-8 items-start justify-center">
                <span className="text-center text-xs text-muted-foreground">
                  {t(`steps.${stepToKey(WIZARD_STEPS[currentStepIndex + 1])}`)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Step counter */}
        <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
          <span className="font-medium text-primary">
            {currentStepIndex + 1}
          </span>
          <span className="mx-1">/</span>
          <span>{WIZARD_STEPS.length}</span>
        </div>
      </div>

      {/* Desktop view */}
      <div className="relative hidden w-full items-start justify-between px-2 sm:flex">
        {/* Background connector line */}
        <div className="absolute inset-x-0 top-4 h-[2px] bg-muted/30" />

        {/* Active connector line */}
        <div
          className="absolute left-0 top-4 h-[2px] bg-primary transition-all duration-500 ease-in-out"
          style={{
            width: `calc(${(100 / (WIZARD_STEPS.length - 1)) * currentStepIndex}% + ${currentStepIndex > 0 ? "50px" : "0px"})`,
          }}
        />

        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isActive = step === currentStep

          return (
            <div
              key={step}
              className={cn(
                "group relative flex min-w-[100px] flex-col items-center px-2",
                index === 0 && "ml-0",
                index === WIZARD_STEPS.length - 1 && "mr-0"
              )}
            >
              {/* Step circle */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background text-sm font-medium transition-all duration-200",
                  isActive && "border-primary text-primary",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  !isActive &&
                    !isCompleted &&
                    "border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-4" /> : index + 1}
              </div>

              {/* Step label */}
              <span
                className={cn(
                  "mt-2 text-center text-xs font-medium md:max-w-[120px] lg:text-sm",
                  isActive && "text-primary",
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {t(`steps.${stepToKey(step)}`)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

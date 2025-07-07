import { cn } from "@package/utils"

import type { WizardStepperProps } from "./types"

export function Stepper({
  steps,
  currentStepId,
  className,
}: WizardStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId)

  return (
    <div className={cn("mb-6 flex flex-wrap gap-2", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex
        const isActive = step.id === currentStepId

        return (
          <span
            key={step.id}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              isActive && "bg-primary text-primary-foreground",
              isCompleted && "bg-primary/10 text-primary",
              !isActive && !isCompleted && "bg-muted text-muted-foreground"
            )}
          >
            {step.label}
          </span>
        )
      })}
    </div>
  )
}

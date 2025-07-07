/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { Button } from "@package/ui/button"
import { Spinner } from "@package/ui/spinner"
import { useWizard } from "react-use-wizard"

type StepLayoutProps = {
  children: React.ReactNode
  handleSubmit: (callback?: any) => void
  handleBackClick?: (callback?: any) => void
  enableSkip?: boolean
  isLoading?: boolean
  submitButtonText?: string
}
export function StepLayout({
  children,
  handleSubmit,
  handleBackClick,
  enableSkip,
  isLoading,
  submitButtonText,
}: StepLayoutProps) {
  const { isLastStep, isFirstStep, previousStep, nextStep } = useWizard()

  function buttonStates() {
    if (isLoading) return <Spinner />

    if (isLastStep) return submitButtonText ?? "Submit"

    return submitButtonText ?? "Next"
  }

  return (
    <section className="flex flex-col items-center justify-center">
      <section className="flex size-full min-h-[calc(100dvh-100px)] max-w-[660px] flex-col justify-between gap-3 sm:min-h-[650px]">
        {children}
        <section className="mt-10 flex w-full justify-between space-x-5">
          {!isFirstStep && (
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={handleBackClick || previousStep}
            >
              Back
            </Button>
          )}
          <section className="ml-auto space-x-5">
            {!isLastStep && enableSkip && (
              <Button disabled={isLoading} variant="ghost" onClick={nextStep}>
                Skip
              </Button>
            )}
            <Button
              className="mb-6 min-w-[90px]"
              disabled={isLoading}
              type="submit"
              onClick={handleSubmit}
            >
              {buttonStates()}
            </Button>
          </section>
        </section>
      </section>
    </section>
  )
}

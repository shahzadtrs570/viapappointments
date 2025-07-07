import type { MutableRefObject } from "react"
import { useEffect } from "react"

import { useWizard } from "react-use-wizard"

export function useAnimatedStep(previousStepIndex: MutableRefObject<number>) {
  const { activeStep } = useWizard()

  useEffect(
    () => () => {
      previousStepIndex.current = activeStep
    },
    [activeStep, previousStepIndex]
  )

  return { activeStep }
}

import { useEffect } from "react"

import { useWizard } from "react-use-wizard"

export function useStepStatus() {
  const { activeStep, stepCount } = useWizard()

  useEffect(() => {
    window.scrollTo(0, 0)
  })

  return { activeStep, stepCount }
}

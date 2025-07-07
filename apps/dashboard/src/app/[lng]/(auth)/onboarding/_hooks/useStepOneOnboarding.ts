import { useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { nameSchema } from "@package/validations"
import { useForm } from "react-hook-form"
import { useWizard } from "react-use-wizard"

import type { Name } from "@package/validations"

import { useOnboardingContext } from "../_contexts/onboardingContext"

export function useStepOneOnboarding() {
  const {
    onboardingState: { name },
    dispatchOnboarding,
  } = useOnboardingContext()
  const { previousStep, nextStep } = useWizard()

  const form = useForm<Name>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name,
    },
  })

  const onSubmit = useCallback(
    (values: Name, back: boolean = false) => {
      const { name } = values

      dispatchOnboarding({
        type: "CHANGE_NAME",
        payload: { name },
      })

      if (back) {
        return previousStep()
      }
      return nextStep()
    },
    [dispatchOnboarding, nextStep, previousStep]
  )

  return { form, onSubmit }
}

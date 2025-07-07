"use client"

import { useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { SUBSCRIPTION_PLANS } from "@package/utils"
import { planAndIntervalSchema } from "@package/validations"
import { useForm } from "react-hook-form"
import { useWizard } from "react-use-wizard"

import type { OnboardingData, PlanAndInterval } from "@package/validations"

import { useFinishOnboarding } from "./useFinishOnboarding"
import { useOnboardingContext } from "../_contexts/onboardingContext"

export function useStepTwoOnboarding() {
  const {
    dispatchOnboarding,
    onboardingState: { plan, interval, name },
  } = useOnboardingContext()
  const { previousStep } = useWizard()
  const onboardingMutation = useFinishOnboarding()

  const form = useForm<PlanAndInterval>({
    resolver: zodResolver(planAndIntervalSchema),
    defaultValues: {
      plan: plan,
      interval: interval,
    },
  })

  const onSubmit = useCallback(
    async (values: PlanAndInterval, back: boolean = false) => {
      const { plan, interval } = values

      dispatchOnboarding({
        type: "CHANGE_PLAN_AND_INTERVAL",
        payload: { plan, interval },
      })

      if (back) {
        return previousStep()
      }

      const lookupKey = SUBSCRIPTION_PLANS.find((p) => p.name === plan)
        ?.lookupKeys[interval]

      if (lookupKey) {
        const data: OnboardingData = {
          lookupKey,
          name,
        }

        await onboardingMutation.mutateAsync(data)
      }
    },
    [dispatchOnboarding, name, onboardingMutation, previousStep]
  )

  return { form, onSubmit }
}

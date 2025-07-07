"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Typography } from "@package/ui/typography"
import { SUBSCRIPTION_PLANS } from "@package/utils"
import { planAndIntervalSchema } from "@package/validations"
import { useForm } from "react-hook-form"

import type { PlanAndInterval } from "@package/validations"

// import { PricingForm } from "@/app/(auth)/onboarding/_components/PricingForm/PricingForm"
// import { useOnboardingContext } from "@/app/(auth)/onboarding/_contexts/onboardingContext"
// import { usePricingInfo } from "@/app/(auth)/onboarding/_hooks/usePricingInfo"

import { PricingForm } from "@/app/[lng]/(auth)/onboarding/_components/PricingForm/PricingForm"
import { useOnboardingContext } from "@/app/[lng]/(auth)/onboarding/_contexts/onboardingContext"
import { usePricingInfo } from "@/app/[lng]/(auth)/onboarding/_hooks/usePricingInfo"
import { useAuth } from "@/hooks/useAuth"

import { UpgradePlanButton } from "../UpgradePlanButton/UpgradePlanButton"

export function UpgradePlanSection() {
  const { isSubscribed, user } = useAuth()
  const {
    onboardingState: { plan, interval },
  } = useOnboardingContext()

  const form = useForm<PlanAndInterval>({
    resolver: zodResolver(planAndIntervalSchema),
    defaultValues: {
      plan: plan,
      interval: interval,
    },
  })

  const { planName, billingInterval } = usePricingInfo({ plan, interval })

  const lookupKey = SUBSCRIPTION_PLANS.find((p) => p.name === plan)?.lookupKeys[
    interval
  ]

  return (
    <section className="flex w-full flex-col gap-4">
      <Typography variant="h3">
        {isSubscribed && user?.subscription?.status !== "trialing"
          ? "Upgrade"
          : "Subscribe"}
      </Typography>
      <section className="w-full">
        <PricingForm showUpgradesOnly form={form}>
          <UpgradePlanButton lookupKey={lookupKey ?? ""}>
            {isSubscribed && user?.subscription?.status !== "trialing"
              ? "Upgrade"
              : "Subscribe"}{" "}
            to {planName} {billingInterval}
          </UpgradePlanButton>
        </PricingForm>
      </section>
    </section>
  )
}

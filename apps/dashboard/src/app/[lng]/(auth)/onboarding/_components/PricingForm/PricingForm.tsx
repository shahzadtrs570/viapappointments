"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import {
  cn,
  getSubscriptionPlanFromLookupKey,
  SUBSCRIPTION_PLANS,
} from "@package/utils"

import type { SubscriptionPlan } from "@package/utils"
import type { Interval, Plan } from "@package/validations"
import type { UseFormReturn } from "react-hook-form"

import { useAuth } from "@/hooks/useAuth"

import { useOnboardingContext } from "../../_contexts/onboardingContext"
import { PricingInfo } from "../PricingInfo/PricingInfo"

type FormValues = {
  plan: "BASIC" | "PRO" | "PREMIUM"
  interval: "monthly" | "yearly"
}

type PricingFormProps = {
  form: UseFormReturn<FormValues>
  showUpgradesOnly?: boolean
  children?: React.ReactNode
}

export function PricingForm({
  form,
  showUpgradesOnly = false,
  children,
}: PricingFormProps) {
  const { user, isSubscribed } = useAuth()
  const {
    dispatchOnboarding,
    onboardingState: { plan, interval },
  } = useOnboardingContext()

  function filterPlans(plan: SubscriptionPlan) {
    if (
      !showUpgradesOnly ||
      user?.subscription?.status === "trialing" ||
      !user?.subscription?.lookupKey
    ) {
      return true
    }

    const currentSubscriptionPlan = isSubscribed
      ? getSubscriptionPlanFromLookupKey(user.subscription.lookupKey)
      : null

    const currentPlanIndex = SUBSCRIPTION_PLANS.findIndex(
      (p) => p.name === currentSubscriptionPlan?.name
    )

    if (currentPlanIndex === -1) {
      return true
    }

    const planIndex = SUBSCRIPTION_PLANS.findIndex((p) => p.name === plan.name)

    return planIndex > currentPlanIndex
  }

  return (
    <Form {...form}>
      <form
        className="size-full space-y-2 rounded-lg bg-card p-3 xs:p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <section className="grid grid-cols-2 items-center gap-3">
          <FormField<FormValues>
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Plan</FormLabel>
                <Select
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                  onValueChange={(value) => {
                    field.onChange(value)
                    dispatchOnboarding({
                      type: "CHANGE_PLAN",
                      payload: {
                        plan: value as Plan["plan"],
                      },
                    })
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUBSCRIPTION_PLANS.filter(filterPlans).map((plan) => (
                      <SelectItem key={plan.name} value={plan.name}>
                        <section className="flex items-center gap-2">
                          <div
                            className={cn("size-2 rounded-full", plan.color)}
                          />
                          <p>
                            {plan.name.substring(0, 1) +
                              plan.name.substring(1).toLowerCase()}
                          </p>
                        </section>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Billing</FormLabel>
                <Select
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                  onValueChange={(value) => {
                    field.onChange(value)
                    dispatchOnboarding({
                      type: "CHANGE_INTERVAL",
                      payload: {
                        interval: value as Interval["interval"],
                      },
                    })
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <PricingInfo interval={interval} plan={plan} />
        {children}
      </form>
    </Form>
  )
}

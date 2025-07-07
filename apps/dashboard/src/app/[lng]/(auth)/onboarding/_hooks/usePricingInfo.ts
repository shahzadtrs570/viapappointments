import { SUBSCRIPTION_PLANS } from "@package/utils"

import type { Interval, Plan } from "@package/validations"

type PricingInfo = {
  plan: Plan["plan"]
  interval: Interval["interval"]
}

export function usePricingInfo({ plan, interval }: PricingInfo) {
  const planName = plan.substring(0, 1) + plan.substring(1).toLowerCase()
  const billingInterval =
    interval.substring(0, 1).toUpperCase() + interval.substring(1)

  const price = SUBSCRIPTION_PLANS.find((p) => p.name === plan)?.price[interval]

  const priceText = `$${price}/mo, billed ${interval}`

  const features = SUBSCRIPTION_PLANS.find((p) => p.name === plan)?.features

  return { planName, billingInterval, priceText, features }
}

import type { Stripe } from "@package/payments"

export type UpdateStripeCustomerIdByUserIdData = {
  userId: string
  stripeCustomerId: string
}

export type UpdateUserAfterOnboardingData = {
  userId: string
  lookupKey: string
  subscription: Stripe.Response<Stripe.Subscription>
}

export type UpdateSubscriptionByUserIdData = {
  subscription: Stripe.Subscription
  lookupKey: string | null
  userId: string
}

export type UpdateSubscriptionAndPlanBySubscriptionIdData = {
  subscription: Stripe.Subscription
  lookupKey: string | null
}

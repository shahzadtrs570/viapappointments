import type { Stripe } from "@package/payments"

export type GetOrCreateStripeCustomerIdForUserArgs = {
  userId: string
}

export type StripeEventArgs = {
  event: Stripe.Event
  stripe: Stripe
}

export type SendInvoicePaymentFailedEmailArgs = {
  customerId: string
  stripe: Stripe
}

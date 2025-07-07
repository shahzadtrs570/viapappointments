export interface IPaymentService {
  createCheckoutSession(
    args: CreateCheckoutSessionArgs
  ): Promise<{ url: string }>
  createBillingPortalSession(
    args: CreateBillingPortalSessionArgs
  ): Promise<{ url: string }>
  upgradeSubscriptionPlan(
    args: UpgradeSubscriptionPlanArgs
  ): Promise<{ url: string }>
  giveFreeTrial(args: GiveFreeTrialArgs): Promise<void>
}

export type CreateCheckoutSessionArgs = {
  lookupKey: string
  userId: string
}

export type CreateBillingPortalSessionArgs = {
  userId: string
}

export type UpgradeSubscriptionPlanArgs = {
  lookupKey: string
  userId: string
}

export type GiveFreeTrialArgs = {
  lookupKey: string
  userId: string
}

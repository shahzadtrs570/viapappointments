import { featureFlags, PaymentProviderType } from "@package/utils"

import type {
  CreateBillingPortalSessionArgs,
  CreateCheckoutsessionArgs,
  GiveFreeTrialArgs,
  UpgradeSubscriptionPlanArgs,
} from "./payments.service.types"
import type { IPaymentService } from "../adapters/IPaymentService.types"

import { lemonSqueezyService } from "../adapters/lemonSqueezy/service/lemonSqueezy.service"
import { stripeService } from "../adapters/stripe/service/stripe.service"

class PaymentsService {
  private paymentProvider

  constructor(paymentProvider: IPaymentService) {
    this.paymentProvider = paymentProvider
  }

  public async createCheckoutSession(args: CreateCheckoutsessionArgs) {
    const { session, input } = args

    return this.paymentProvider.createCheckoutSession({
      lookupKey: input.lookupKey,
      userId: session.id,
    })
  }

  public async createBillingPortalSession(
    args: CreateBillingPortalSessionArgs
  ) {
    return this.paymentProvider.createBillingPortalSession({
      userId: args.session.id,
    })
  }

  public async upgradeSubscriptionPlan(args: UpgradeSubscriptionPlanArgs) {
    return this.paymentProvider.upgradeSubscriptionPlan({
      lookupKey: args.input.lookupKey,
      userId: args.session.id,
    })
  }

  public async giveFreeTrial(args: GiveFreeTrialArgs) {
    return this.paymentProvider.giveFreeTrial({
      lookupKey: args.input.lookupKey,
      userId: args.session.id,
    })
  }
}

function getPaymentProvider(type: PaymentProviderType) {
  switch (type) {
    case PaymentProviderType.Stripe:
      return stripeService
    case PaymentProviderType.LemonSqueezy:
      return lemonSqueezyService
  }
}

export const paymentsService = new PaymentsService(
  getPaymentProvider(featureFlags.payments)
)

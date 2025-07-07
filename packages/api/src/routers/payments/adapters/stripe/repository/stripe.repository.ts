import { db } from "@package/db"

import type {
  UpdateStripeCustomerIdByUserIdData,
  UpdateSubscriptionAndPlanBySubscriptionIdData,
  UpdateSubscriptionByUserIdData,
  UpdateUserAfterOnboardingData,
} from "./stripe.repository.types"
import type { Stripe } from "@package/payments"

class StripeRepository {
  public updateStripeCustomerIdByUserId(
    data: UpdateStripeCustomerIdByUserIdData
  ) {
    return db.subscription.upsert({
      where: {
        userId: data.userId,
      },
      create: {
        customerId: data.stripeCustomerId,
        userId: data.userId,
      },
      update: {
        customerId: data.stripeCustomerId,
      },
    })
  }

  public updateStripeUserAfterOnboarding(data: UpdateUserAfterOnboardingData) {
    return db.subscription.update({
      where: { userId: data.userId },
      data: {
        subscriptionId: data.subscription.id,
        customerId: data.subscription.customer as string,
        lookupKey: data.lookupKey,
        currentPeriodStart: new Date(
          data.subscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(data.subscription.current_period_end * 1000),
        status: data.subscription.status,
        isCanceledAtPeriodEnd: data.subscription.cancel_at_period_end,
        userId: data.userId,
        billingInterval:
          data.subscription.items.data[0]?.price.recurring?.interval,
      },
    })
  }

  public updateSubscriptionByUserId(data: UpdateSubscriptionByUserIdData) {
    const { subscription, userId, lookupKey } = data

    return db.subscription.update({
      where: {
        userId,
      },
      data: {
        subscriptionId: subscription.id,
        lookupKey,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        status: subscription.status,
        isCanceledAtPeriodEnd: subscription.cancel_at_period_end,
        billingInterval: subscription.items.data[0]?.price.recurring?.interval,
      },
    })
  }

  public updateSubscriptionAndPlanBySubscriptionId(
    data: UpdateSubscriptionAndPlanBySubscriptionIdData
  ) {
    const { subscription, lookupKey } = data

    return db.subscription.update({
      where: {
        subscriptionId: subscription.id,
      },
      data: {
        subscriptionId: subscription.id,
        lookupKey,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        status: subscription.status,
        isCanceledAtPeriodEnd: subscription.cancel_at_period_end,
        billingInterval: subscription.items.data[0]?.price.recurring?.interval,
      },
    })
  }

  public updateSubscriptionBySubscriptionId(subscription: Stripe.Subscription) {
    return db.subscription.update({
      where: {
        subscriptionId: subscription.id,
      },
      data: {
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        status: subscription.status,
        isCanceledAtPeriodEnd: subscription.cancel_at_period_end,
        billingInterval: subscription.items.data[0]?.price.recurring?.interval,
      },
    })
  }

  public clearSubscriptionBySubscriptionId(subscription: Stripe.Subscription) {
    return db.subscription.update({
      where: {
        subscriptionId: subscription.id,
      },
      data: {
        subscriptionId: null,
        lookupKey: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        status: subscription.status,
        isCanceledAtPeriodEnd: subscription.cancel_at_period_end,
        billingInterval: null,
      },
    })
  }
}

export const stripeRepository = new StripeRepository()

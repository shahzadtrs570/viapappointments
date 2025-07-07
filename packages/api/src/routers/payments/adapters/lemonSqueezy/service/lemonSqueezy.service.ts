import { BillingInterval, SubscriptionStatus } from "@package/db"
import { configureLemonSqueezy, lemonSqueezy } from "@package/payments"
import { absoluteUrl, getSubscriptionPlanFromLookupKey } from "@package/utils"
import { TRPCError } from "@trpc/server"

import type { MetaType } from "./lemonSqueezy.service.typeguards"
import type {
  CreateBillingPortalSessionArgs,
  CreateCheckoutSessionArgs,
  GiveFreeTrialArgs,
  IPaymentService,
  UpgradeSubscriptionPlanArgs,
} from "../../IPaymentService.types"
import type { SubscriptionWithOptionalStatus } from "../repository/lemonSqueezy.repository.types"
import type { LemonSqueezy } from "@package/payments"

import { webhookHasData } from "./lemonSqueezy.service.typeguards"
import { userRepository } from "../../../../user/repository/user.repository"
import { lemonSqueezyRepository } from "../repository/lemonSqueezy.repository"

class LemonSqueezyService implements IPaymentService {
  private lemonSqueezy: LemonSqueezy

  constructor() {
    configureLemonSqueezy()
    this.lemonSqueezy = lemonSqueezy
  }

  /**
   * Convert Lemon Squeezy subscription status to our own subscription status.
   */
  private convertStatus(status: string) {
    return {
      on_trial: SubscriptionStatus.trialing,
      active: SubscriptionStatus.active,
      paused: SubscriptionStatus.paused,
      past_due: SubscriptionStatus.past_due,
      unpaid: SubscriptionStatus.unpaid,
      expired: SubscriptionStatus.expired,
    }[status]
  }

  /**
   * Convert Lemon Squeezy billing interval to our own billing interval.
   */
  private convertBillingInterval(
    interval:
      | lemonSqueezy.Price["data"]["attributes"]["renewal_interval_unit"]
      | undefined
  ) {
    if (!interval) {
      return null
    }

    return {
      day: BillingInterval.day,
      week: BillingInterval.week,
      month: BillingInterval.month,
      year: BillingInterval.year,
    }[interval]
  }

  /**
   * Get the redirect URLs to our billing page and the page to redirect to after the payment is completed.
   */
  private getReturnUrls() {
    const returnUrl = absoluteUrl("/billing")
    const afterCompletionReturnUrl = absoluteUrl("/?billing=success")

    return { returnUrl, afterCompletionReturnUrl }
  }

  /**
   * Process webhook events in the database.
   */
  public async processWebhookEvent(event: MetaType) {
    if (webhookHasData(event)) {
      if (event.meta.event_name.startsWith("subscription_")) {
        // Save subscription events; obj is a Subscription
        const attributes = event.data.attributes

        const priceId = attributes.first_subscription_item?.price_id

        if (!priceId) {
          throw new Error("Price id not found.")
        }

        // Get the price data from Lemon Squeezy.
        const priceData = await this.lemonSqueezy.getPrice(priceId)

        const billingInterval = this.convertBillingInterval(
          priceData.data?.data.attributes.renewal_interval_unit
        )

        const userId = event.meta.custom_data.user_id

        const updateData: SubscriptionWithOptionalStatus = {
          customerId: attributes.customer_id.toString(),
          subscriptionId:
            attributes.first_subscription_item?.subscription_id.toString() ??
            null,
          // In Lemon Squeezy, the variant ID is equivalent to the price ID in Stripe
          lookupKey: attributes.variant_id.toString(),
          currentPeriodStart: new Date(attributes.created_at),
          currentPeriodEnd: new Date(attributes.renews_at),
          isCanceledAtPeriodEnd: attributes.cancelled,
          billingInterval,
          userId,
        }

        if (attributes.status !== "cancelled") {
          updateData.status = this.convertStatus(attributes.status)
        }

        try {
          // Create/update subscription in the database.
          await lemonSqueezyRepository.updateSubscriptionByUserId({
            userId,
            updateData,
          })
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        }
      }
    }
  }

  /**
   * Create a checkout session for the user to pay for a subscription.
   */
  public async createCheckoutSession(
    args: CreateCheckoutSessionArgs
  ): Promise<{ url: string }> {
    const user = await userRepository.getUserById(args.userId)

    if (!user) {
      throw new TRPCError({ message: "User not found", code: "NOT_FOUND" })
    }

    const { afterCompletionReturnUrl } = this.getReturnUrls()

    const checkout = await this.lemonSqueezy.createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!,
      args.lookupKey,
      {
        checkoutData: {
          email: user.email ?? undefined,
          custom: {
            userId: user.id,
          },
        },
        productOptions: {
          redirectUrl: afterCompletionReturnUrl,
          receiptButtonText: "Go to Dashboard",
          receiptThankYouNote: "Thank you for subscribing!",
        },
      }
    )

    const url = checkout.data?.data.attributes.url

    if (!url) {
      throw new Error("Failed to create checkout session")
    }

    return { url }
  }

  /**
   * Create a billing portal session for the user to manage their subscription.
   */
  public async createBillingPortalSession(
    args: CreateBillingPortalSessionArgs
  ) {
    const user = await userRepository.getUserById(args.userId)

    if (!user?.subscription?.customerId) {
      throw new TRPCError({
        message: "User is not a lemon squeezy customer.",
        code: "NOT_FOUND",
      })
    }
    const customer = await this.lemonSqueezy.getCustomer(
      user.subscription.customerId
    )

    const url = customer.data?.data.attributes.urls.customer_portal

    if (!url) {
      throw new TRPCError({
        message: "Failed to create billing portal session",
        code: "INTERNAL_SERVER_ERROR",
      })
    }

    return { url }
  }

  /**
   * Upgrade the user's subscription plan.
   */
  public async upgradeSubscriptionPlan(
    args: UpgradeSubscriptionPlanArgs
  ): Promise<{ url: string }> {
    return await this.createCheckoutSession(args)
  }

  // Lemon Squeezy API will not let use create a free trial without entering payment information.
  // Therefore we are manually creating a free trial without using Lemon Squeezy's API
  /**
   * Give the user a free trial.
   */
  public async giveFreeTrial(args: GiveFreeTrialArgs) {
    const { userId, lookupKey } = args

    if (!process.env.LEMONSQUEEZY_STORE_ID) {
      throw new Error("Missing required LEMONSQUEEZY_STORE_ID env variable")
    }

    const plan = getSubscriptionPlanFromLookupKey(lookupKey)

    if (!plan) {
      throw new TRPCError({
        message: "Subscription plan not found",
        code: "NOT_FOUND",
      })
    }

    const variant = await this.lemonSqueezy.getVariant(lookupKey)
    const attributes = variant.data?.data.attributes

    if (!attributes) {
      throw new TRPCError({
        message: "Variant not found",
        code: "NOT_FOUND",
      })
    }

    const trialDays = 14
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + trialDays)

    const billingInterval = this.convertBillingInterval(attributes.interval)

    const updateData = {
      customerId: "trialing-lemon-squeezy",
      subscriptionId: null,
      lookupKey,
      currentPeriodStart: new Date(),
      currentPeriodEnd: trialEnd,
      status: SubscriptionStatus.trialing,
      isCanceledAtPeriodEnd: false,
      billingInterval,
      userId,
    }

    await lemonSqueezyRepository.updateSubscriptionByUserId({
      userId,
      updateData,
    })
  }
}

export const lemonSqueezyService = new LemonSqueezyService()

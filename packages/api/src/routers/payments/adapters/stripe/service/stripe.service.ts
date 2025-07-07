import {
  InvoicePaymentFailed,
  sendEmail,
  TrialEndingSoon,
} from "@package/email"
import { stripe } from "@package/payments"
import { absoluteUrl } from "@package/utils"
import { TRPCError } from "@trpc/server"

import type {
  GetOrCreateStripeCustomerIdForUserArgs,
  SendInvoicePaymentFailedEmailArgs,
  StripeEventArgs,
} from "./stripe.service.types"
import type {
  CreateBillingPortalSessionArgs,
  CreateCheckoutSessionArgs,
  GiveFreeTrialArgs,
  IPaymentService,
  UpgradeSubscriptionPlanArgs,
} from "../../IPaymentService.types"
import type { Stripe } from "@package/payments"

import { userRepository } from "../../../../user/repository/user.repository"
import { stripeRepository } from "../repository/stripe.repository"

class StripeService implements IPaymentService {
  private stripe: Stripe

  constructor() {
    this.stripe = stripe
  }

  private async sendInvoicePaymentFailedEmail({
    customerId,
    stripe,
  }: SendInvoicePaymentFailedEmailArgs) {
    const customer = (await stripe.customers.retrieve(
      customerId
    )) as Stripe.Customer

    const stripePortalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: process.env.NEXT_PUBLIC_APP_URL + "/profile",
    })

    await sendEmail({
      email: [customer.email as string],
      subject: "Payment failed on your subscription",
      react: InvoicePaymentFailed({
        email: customer.email as string,
        portalUrl: stripePortalSession.url,
      }),
    })
  }

  // retrieves a Stripe customer id for a given user if it exists or creates a new one
  private async getOrCreateStripeCustomerIdForUser(
    args: GetOrCreateStripeCustomerIdForUserArgs
  ) {
    const user = await userRepository.getUserById(args.userId)

    if (!user) {
      throw new TRPCError({ message: "User not found", code: "NOT_FOUND" })
    }

    if (user.subscription?.customerId) {
      return user.subscription.customerId
    }

    // create a new customer
    const customer = await this.stripe.customers.create({
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      // use metadata to link this Stripe customer to internal user id
      metadata: {
        userId: args.userId,
      },
    })

    // update with new customer id
    const updatedUser = await stripeRepository.updateStripeCustomerIdByUserId({
      userId: args.userId,
      stripeCustomerId: customer.id,
    })

    return updatedUser.customerId
  }

  private async getStripePriceId(lookupKey: string) {
    const stripePriceIds = await this.stripe.prices.list({
      lookup_keys: [lookupKey],
    })

    if (stripePriceIds.data.length === 0) {
      throw new TRPCError({
        message: "Failed to find price for lookup key",
        code: "NOT_FOUND",
      })
    }

    return stripePriceIds.data[0].id
  }

  private getReturnUrls() {
    const returnUrl = absoluteUrl("/billing")
    const afterCompletionReturnUrl = absoluteUrl("/?billing=success")

    return { returnUrl, afterCompletionReturnUrl }
  }

  private getSubscriptionBySubscriptionId(subscriptionId: string) {
    return this.stripe.subscriptions.retrieve(subscriptionId)
  }

  public async createCheckoutSession(args: CreateCheckoutSessionArgs) {
    const customerId = await this.getOrCreateStripeCustomerIdForUser({
      userId: args.userId,
    })
    const stripePriceId = await this.getStripePriceId(args.lookupKey)
    const { returnUrl, afterCompletionReturnUrl } = this.getReturnUrls()

    const checkoutSession = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: args.userId,
      },
      success_url: afterCompletionReturnUrl,
      cancel_url: returnUrl,
    })

    if (!checkoutSession.url) {
      throw new TRPCError({
        message: "Failed to create checkout session",
        code: "INTERNAL_SERVER_ERROR",
      })
    }

    return { url: checkoutSession.url }
  }

  public async createBillingPortalSession(
    args: CreateBillingPortalSessionArgs
  ) {
    const customerId = await this.getOrCreateStripeCustomerIdForUser({
      userId: args.userId,
    })
    const { returnUrl } = this.getReturnUrls()

    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: stripeSession.url }
  }

  public async upgradeSubscriptionPlan(args: UpgradeSubscriptionPlanArgs) {
    const customerId = await this.getOrCreateStripeCustomerIdForUser({
      userId: args.userId,
    })
    const stripePriceId = await this.getStripePriceId(args.lookupKey)
    const { returnUrl, afterCompletionReturnUrl } = this.getReturnUrls()

    const user = await userRepository.getUserById(args.userId)

    const subscriptionId = user?.subscription?.subscriptionId

    if (!subscriptionId) {
      throw new TRPCError({
        message: "User does not have an active subscription",
        code: "NOT_FOUND",
      })
    }

    const subscription =
      await this.getSubscriptionBySubscriptionId(subscriptionId)

    const subscriptionItemId = subscription.items.data[0].id

    const billingPortalSession =
      await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
        flow_data: {
          type: "subscription_update_confirm",
          subscription_update_confirm: {
            subscription: subscriptionId,
            items: [
              {
                id: subscriptionItemId,
                quantity: 1,
                price: stripePriceId,
              },
            ],
          },
          after_completion: {
            type: "redirect",
            redirect: {
              return_url: afterCompletionReturnUrl,
            },
          },
        },
      })

    if (!billingPortalSession.url) {
      throw new TRPCError({
        message:
          "Failed to create billing portal session for subscription update",
        code: "INTERNAL_SERVER_ERROR",
      })
    }

    return { url: billingPortalSession.url }
  }

  public async giveFreeTrial(args: GiveFreeTrialArgs) {
    const { lookupKey, userId } = args

    const customerId = await this.getOrCreateStripeCustomerIdForUser({
      userId: userId,
    })
    const stripePriceId = await this.getStripePriceId(lookupKey)

    const trialPeriodDays = 14

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: stripePriceId,
        },
      ],
      trial_period_days: trialPeriodDays,
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      trial_settings: {
        end_behavior: {
          missing_payment_method: "cancel",
        },
      },
      metadata: {
        userId: userId,
      },
    })

    await stripeRepository.updateStripeUserAfterOnboarding({
      userId: userId,
      lookupKey,
      subscription,
    })
  }

  // Webhook handlers
  public async handleWebhookCheckoutSessionCompleted({
    event,
    stripe,
  }: StripeEventArgs) {
    const session = event.data.object as Stripe.Checkout.Session

    // Ensure the user ID is present in the metadata. We sent this when creating the checkout session.
    if (!session.metadata?.userId) {
      throw new Error("User ID is required.")
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    const lookupKey = subscription.items.data[0].price.lookup_key

    await stripeRepository.updateSubscriptionByUserId({
      userId: session.metadata.userId,
      lookupKey,
      subscription,
    })
  }

  public async handleWebhookInvoiceChange({ event, stripe }: StripeEventArgs) {
    const invoice = event.data.object as Stripe.Invoice
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    )

    await stripeRepository.updateSubscriptionBySubscriptionId(subscription)
  }

  public async handleWebhookInvoicePaymentFailed({
    event,
    stripe,
  }: StripeEventArgs) {
    const invoice = event.data.object as Stripe.Invoice
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    )
    const customerId = subscription.customer as string

    await this.sendInvoicePaymentFailedEmail({ customerId, stripe })
    return await this.handleWebhookInvoiceChange({ event, stripe })
  }

  public async handleWebhookSubscriptionUpdated({
    event,
  }: Omit<StripeEventArgs, "stripe">) {
    const subscription = event.data.object as Stripe.Subscription
    const lookupKey = subscription.items.data[0].price.lookup_key

    await stripeRepository.updateSubscriptionAndPlanBySubscriptionId({
      subscription,
      lookupKey,
    })
  }

  public async handleWebhookSubscriptionDeleted({
    event,
  }: Omit<StripeEventArgs, "stripe">) {
    const subscription = event.data.object as Stripe.Subscription
    await stripeRepository.clearSubscriptionBySubscriptionId(subscription)
  }

  public async handleWebhookSubscriptionTrialWillEnd({
    event,
    stripe,
  }: StripeEventArgs) {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string
    const customer = (await stripe.customers.retrieve(
      customerId
    )) as Stripe.Customer
    const customerEmail = customer.email as string

    const stripePortalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.customer as string,
      return_url: process.env.NEXT_PUBLIC_APP_URL + "/profile",
    })

    await sendEmail({
      email: [customerEmail],
      subject: "Your trial is ending soon!",
      react: TrialEndingSoon({
        email: customerEmail,
        portalUrl: stripePortalSession.url,
      }),
    })
  }
}

export const stripeService = new StripeService()

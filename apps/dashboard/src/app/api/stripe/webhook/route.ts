import { stripeService } from "@package/api"
import { stripe } from "@package/payments"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import type { Stripe } from "@package/payments"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature") ?? ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET!
    )
  } catch (error) {
    return NextResponse.json(
      `Webhook Error: ${error instanceof Error ? error.message : "Failed to verify stripe webhook signature"}`,
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        // Payment is successful and the subscription is created.
        // Provision the subscription and save the customer ID to your database.
        await stripeService.handleWebhookCheckoutSessionCompleted({
          event,
          stripe,
        })
        break
      case "invoice.paid":
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        await stripeService.handleWebhookInvoiceChange({ event, stripe })
        break
      case "invoice.payment_failed":
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        await stripeService.handleWebhookInvoicePaymentFailed({ event, stripe })
        break
      case "customer.subscription.updated":
        // Occurs whenever a subscription changes (e.g., switching from one plan to another,
        // changing the status from trial to active, or user decides to cancel subscription).
        await stripeService.handleWebhookSubscriptionUpdated({ event })
        break
      case "customer.subscription.deleted":
        // Occurs whenever a customer’s subscription ends.
        await stripeService.handleWebhookSubscriptionDeleted({ event })
        break
      case "customer.subscription.trial_will_end":
        // Sent three days before the trial period ends. If the trial is less than 3 days, this event is triggered.
        await stripeService.handleWebhookSubscriptionTrialWillEnd({
          event,
          stripe,
        })
        break
      default:
        return new NextResponse(`Unhandled event type: ${event.type}`, {
          status: 400,
        })
    }
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse(
      `Failed to handle stripe webhook event. ${error instanceof Error ? error.message : error}`,
      {
        status: 500,
      }
    )
  }
}

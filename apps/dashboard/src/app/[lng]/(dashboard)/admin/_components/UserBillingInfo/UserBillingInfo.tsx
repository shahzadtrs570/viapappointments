import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Typography } from "@package/ui/typography"
import {
  formatDateToMonthDayYear,
  getSubscriptionPlanFromLookupKey,
} from "@package/utils"
import { CheckCircle2, XCircle } from "lucide-react"

import type { Subscription } from "@package/db"

type UserBillingInfoProps = {
  subscription: Subscription
}

export function UserBillingInfo({ subscription }: UserBillingInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 md:flex-row md:gap-32 xl:gap-52">
        <section className="flex flex-col gap-4">
          <section className="flex flex-col">
            <Typography className="font-bold">
              Subscription Customer ID
            </Typography>
            <Typography>{subscription.customerId}</Typography>
          </section>
          <section className="flex flex-col">
            <Typography className="font-bold">Subscription ID</Typography>
            <Typography>{subscription.subscriptionId}</Typography>
          </section>
          <section className="flex flex-col">
            <Typography className="font-bold">Lookup Key</Typography>
            <Typography>{subscription.lookupKey}</Typography>
          </section>
        </section>

        <section className="flex flex-col gap-4">
          <section className="flex flex-col">
            <Typography className="font-bold">Billing Interval</Typography>
            <Typography>{subscription.billingInterval}</Typography>
          </section>
          {subscription.currentPeriodStart && subscription.currentPeriodEnd && (
            <section className="flex flex-col">
              <Typography className="font-bold">
                Current Billing Cycle
              </Typography>
              <Typography>
                {formatDateToMonthDayYear(subscription.currentPeriodStart)} -{" "}
                {formatDateToMonthDayYear(subscription.currentPeriodEnd)}
              </Typography>
            </section>
          )}
          <section className="flex flex-col">
            <Typography className="font-bold">Subscription Plan</Typography>
            <Typography>
              {getSubscriptionPlanFromLookupKey(subscription.lookupKey ?? "")
                ?.name ?? "No plan found"}
            </Typography>
          </section>
        </section>

        <section className="flex flex-col gap-4">
          <section className="flex flex-col">
            <Typography className="font-bold">Subscription Status</Typography>
            <Typography>{subscription.status}</Typography>
          </section>
          <section className="flex flex-col">
            <Typography className="mb-1 font-bold">
              Subscription will cancel at the end of the billing cycle
            </Typography>
            <Typography className="flex items-center gap-1">
              {subscription.isCanceledAtPeriodEnd ? (
                <>
                  <XCircle className="size-5 text-destructive" /> Yes
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-5 text-success" /> No
                </>
              )}
            </Typography>
          </section>
        </section>
      </CardContent>
    </Card>
  )
}

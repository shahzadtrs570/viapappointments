"use client"

import { Spinner } from "@package/ui/spinner"
import { Typography } from "@package/ui/typography"
import {
  formatDateToMonthDayYear,
  getSubscriptionPlanFromLookupKey,
} from "@package/utils"

import { useAuth } from "@/hooks/useAuth"

export function CurrentPlan() {
  const { userQuery, isSubscribed } = useAuth()
  const subscriptionData = userQuery.data?.subscription

  return (
    <section className="flex flex-col gap-2">
      <Typography variant="h2">Plans & Usage</Typography>
      {userQuery.isPending && <Spinner />}
      {!isSubscribed && (
        <Typography variant="body">
          You are not subscribed to any plan.
        </Typography>
      )}
      {isSubscribed && subscriptionData && (
        <section className="flex flex-col gap-2">
          {subscriptionData.currentPeriodStart &&
            subscriptionData.currentPeriodEnd && (
              <Typography variant="body">
                You are currently on the{" "}
                <span className="inline-flex items-center rounded-full border bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  {getSubscriptionPlanFromLookupKey(
                    subscriptionData.lookupKey ?? ""
                  )?.name ?? "No plan found"}
                </span>{" "}
                {userQuery.data?.subscription?.status === "trialing" &&
                  "free trial "}{" "}
                plan. Current billing cycle:{" "}
                <span className="font-bold">
                  {formatDateToMonthDayYear(
                    subscriptionData.currentPeriodStart
                  )}
                </span>{" "}
                -{" "}
                <span className="font-bold">
                  {formatDateToMonthDayYear(subscriptionData.currentPeriodEnd)}
                </span>
                .
              </Typography>
            )}
          {subscriptionData.isCanceledAtPeriodEnd &&
            subscriptionData.currentPeriodEnd && (
              <Typography variant="body">
                Your subscription will be canceled on{" "}
                <span className="font-bold">
                  {formatDateToMonthDayYear(subscriptionData.currentPeriodEnd)}
                </span>
                .
              </Typography>
            )}
        </section>
      )}
    </section>
  )
}

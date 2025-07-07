import type { Statistics } from "../_types"
import type { RouterOutputs } from "@package/api"

import { api } from "@/lib/trpc/react"

type UseSubscriptionsStatisticsProps = {
  initialSubscriptionStatistics: Statistics["subscriptions"]
}

type SubscriptionStatistics =
  RouterOutputs["admin"]["statistics"]["subscriptions"]["subscriptionStatistics"]

const barColors: Record<keyof Omit<SubscriptionStatistics[0], "name">, string> =
  {
    active: "#8884d8",
    trialing: "#82ca9d",
    canceled: "#ff7300",
    unpaid: "#ff0000",
    past_due: "#F9D171",
    incomplete: "#F9EE02",
    incomplete_expired: "#9CDA15",
    paused: "#0CB5F5",
    expired: "#A9A9A9",
  }

export function useSubscriptionsStatistics({
  initialSubscriptionStatistics,
}: UseSubscriptionsStatisticsProps) {
  const subscriptionsQuery = api.admin.statistics.subscriptions.useQuery(
    undefined,
    {
      initialData: initialSubscriptionStatistics,
    }
  )

  return {
    subscriptionsQuery,
    barColors,
  }
}

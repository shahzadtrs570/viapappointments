"use client"

import { CircleDollarSign, Handshake, User } from "lucide-react"

import type { Statistics } from "../../_types"

import { useSubscriptionsStatistics } from "../../_hooks/useSubscriptionsStatistics"
import { useUsersStatistics } from "../../_hooks/useUsersStatistics"
import { ActiveSubsBarChart } from "../ActiveSubsBarChart/ActiveSubsBarChart"
import { Hero } from "../Hero/Hero"
import { NewUsersChart } from "../NewUsersChart/NewUsersChart"
import { StatsCard } from "../StatsCard/StatsCard"
import { TotalUsersChart } from "../TotalUsersChart/TotalUsersChart"

type AdminContent = {
  initialData: {
    userStatistics: Statistics["users"]
    subscriptionStatistics: Statistics["subscriptions"]
  }
}

export function AdminContent({ initialData }: AdminContent) {
  const { lineColors, userStatisticsQuery } = useUsersStatistics({
    initialUserStatistics: initialData.userStatistics,
  })
  const { barColors, subscriptionsQuery } = useSubscriptionsStatistics({
    initialSubscriptionStatistics: initialData.subscriptionStatistics,
  })

  const isLoading = userStatisticsQuery.isFetching

  async function handleGenerate() {
    await userStatisticsQuery.refetch()
  }

  return (
    <section className="flex flex-col gap-4">
      <Hero isLoading={isLoading} onGenerateClick={handleGenerate} />

      <section className="flex flex-wrap items-center justify-between gap-4">
        <StatsCard
          icon={<User className="size-4 text-muted-foreground" />}
          number={subscriptionsQuery.data.subscriptionCounts.totalSubscriptions}
          title="Subscriptions"
        />
        <StatsCard
          icon={<CircleDollarSign className="size-4 text-muted-foreground" />}
          number={subscriptionsQuery.data.subscriptionCounts.totalActive}
          title="Paying Subscriptions"
        />
        <StatsCard
          icon={<Handshake className="size-4 text-muted-foreground" />}
          number={subscriptionsQuery.data.subscriptionCounts.totalTrials}
          title="Trials"
        />
      </section>
      <section className="flex h-full flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <TotalUsersChart
          chartData={userStatisticsQuery.data.totalUserStatistics}
          lineColors={lineColors}
        />
        <NewUsersChart
          chartData={userStatisticsQuery.data.newUserStatistics}
          lineColors={lineColors}
        />
      </section>
      <section className="flex flex-col gap-8">
        <ActiveSubsBarChart
          chartData={subscriptionsQuery.data.subscriptionStatistics}
          lineColors={barColors}
        />
      </section>
    </section>
  )
}

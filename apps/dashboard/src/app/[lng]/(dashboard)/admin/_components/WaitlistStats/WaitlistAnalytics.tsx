"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Spinner } from "@package/ui/spinner"

import { api } from "@/lib/trpc/react"

import { RecentSignupsTable } from "./RecentSignupsTable"
import { WaitlistStatsCards } from "./WaitlistStatsCards"
import { WaitlistTypeChart } from "./WaitlistTypeChart"

interface WaitlistStatusStats {
  status: string
  count: number
}

export function WaitlistAnalytics() {
  const { data: stats, isLoading } = api.waitlist.getStatistics.useQuery()

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load waitlist statistics</p>
        </CardContent>
      </Card>
    )
  }

  const activeEntries =
    stats.entriesByStatus.find(
      (s: WaitlistStatusStats) => s.status === "active"
    )?.count || 0
  const convertedEntries =
    stats.entriesByStatus.find(
      (s: WaitlistStatusStats) => s.status === "converted"
    )?.count || 0

  return (
    <div className="space-y-8">
      <WaitlistStatsCards
        activeEntries={activeEntries}
        convertedEntries={convertedEntries}
        recentSignups={stats.recentSignups.length}
        totalEntries={stats.totalEntries}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <WaitlistTypeChart data={stats.entriesByType} />
        <RecentSignupsTable signups={stats.recentSignups} />
      </div>
    </div>
  )
}

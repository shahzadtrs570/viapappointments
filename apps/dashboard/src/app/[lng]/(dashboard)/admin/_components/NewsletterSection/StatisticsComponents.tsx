import { Button } from "@package/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"

interface SourceStat {
  source: string | null
  count: number
}

interface MonthlyGrowth {
  month: string
  count: number
}

export interface NewsletterStatistics {
  totalSubscribers: number
  activeSubscribers: number
  sourceStats: SourceStat[]
  monthlyGrowth: MonthlyGrowth[]
}

// Stat card for consistent display of statistics
export function StatCard({
  title,
  value,
  description,
}: {
  title: string
  value: number | string
  description: string | React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

// Generic stats card with title and custom content
export function StatsCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">{children}</div>
      </CardContent>
    </Card>
  )
}

// Extracted component for source statistics
export function SourceStatItem({
  stat,
  totalSubscribers,
}: {
  stat: SourceStat
  totalSubscribers: number
}) {
  return (
    <div
      key={stat.source || "unknown"}
      className="flex items-center justify-between"
    >
      <div className="w-48 truncate">{stat.source || "Website"}</div>
      <div className="flex flex-1 items-center gap-2">
        <div
          className="h-3 rounded"
          style={{
            width: `${(stat.count / totalSubscribers) * 100}%`,
            backgroundColor: "hsl(var(--primary))",
          }}
        />
        <div className="w-12 text-right">{stat.count}</div>
      </div>
    </div>
  )
}

// Extracted component for monthly growth
export function MonthlyGrowthItem({
  item,
  maxCount,
}: {
  item: MonthlyGrowth
  maxCount: number
}) {
  return (
    <div key={item.month} className="flex items-center justify-between">
      <div className="w-48 truncate">{item.month}</div>
      <div className="flex flex-1 items-center gap-2">
        <div
          className="h-3 rounded"
          style={{
            width: `${(item.count / maxCount) * 100}%`,
            backgroundColor: "hsl(var(--primary))",
          }}
        />
        <div className="w-12 text-right">{item.count}</div>
      </div>
    </div>
  )
}

// Component for statistics content
export function StatisticsContent({
  statsLoading,
  statsError,
  statistics,
  refetchStats,
}: {
  statsLoading: boolean
  statsError: boolean
  statistics: NewsletterStatistics | null
  refetchStats: () => void
}) {
  if (statsLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load statistics</h3>
          <p className="text-muted-foreground">
            There was an error loading the newsletter statistics.
          </p>
        </div>
        <Button onClick={() => refetchStats()}>Try Again</Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          description="Active and inactive"
          title="Total Subscribers"
          value={statistics?.totalSubscribers || 0}
        />
        <StatCard
          description="Currently receiving newsletters"
          title="Active Subscribers"
          value={statistics?.activeSubscribers || 0}
        />
        <StatCard
          description="Subscription rate"
          title="Active Rate"
          value={`${
            statistics?.totalSubscribers
              ? Math.round(
                  (statistics.activeSubscribers / statistics.totalSubscribers) *
                    100
                )
              : 0
          }%`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatsCard title="Subscribers by Source">
          {statistics?.sourceStats && statistics.sourceStats.length > 0 ? (
            statistics.sourceStats.map((stat: SourceStat) => (
              <SourceStatItem
                key={stat.source || "unknown"}
                stat={stat}
                totalSubscribers={statistics.totalSubscribers}
              />
            ))
          ) : (
            <p className="py-4 text-center text-muted-foreground">
              No source data available
            </p>
          )}
        </StatsCard>
        <StatsCard title="Monthly Growth (Last 6 Months)">
          {statistics?.monthlyGrowth && statistics.monthlyGrowth.length > 0 ? (
            statistics.monthlyGrowth.map((item: MonthlyGrowth) => (
              <MonthlyGrowthItem
                key={item.month}
                item={item}
                maxCount={Math.max(
                  ...statistics.monthlyGrowth.map((i: MonthlyGrowth) => i.count)
                )}
              />
            ))
          ) : (
            <p className="py-4 text-center text-muted-foreground">
              No growth data available
            </p>
          )}
        </StatsCard>
      </div>
    </>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"

// Stat card for consistent display of statistics
export function StatCard({
  title,
  value,
  description,
}: {
  title: string
  value: number | string
  description: string
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

// Component for displaying leads by source
export function LeadsBySourceCard({
  title,
  sources,
  totalLeads,
}: {
  title: string
  sources: { source: string; count: number }[]
  totalLeads: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sources.map((source) => (
            <div
              key={source.source}
              className="flex items-center justify-between"
            >
              <div className="w-48 truncate">{source.source || "Website"}</div>
              <div className="flex flex-1 items-center gap-2">
                <div
                  className="h-3 rounded"
                  style={{
                    width: `${(source.count / totalLeads) * 100}%`,
                    backgroundColor: "hsl(var(--primary))",
                  }}
                />
                <div className="w-12 text-right">{source.count}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Component for displaying leads by status
export function LeadsByStatusCard({
  title,
  statuses,
  totalLeads,
}: {
  title: string
  statuses: { status: string; count: number }[]
  totalLeads: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {statuses.map((status) => (
            <div
              key={status.status}
              className="flex items-center justify-between"
            >
              <div className="w-48 truncate">{status.status}</div>
              <div className="flex flex-1 items-center gap-2">
                <div
                  className="h-3 rounded"
                  style={{
                    width: `${(status.count / totalLeads) * 100}%`,
                    backgroundColor: "hsl(var(--primary))",
                  }}
                />
                <div className="w-12 text-right">{status.count}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

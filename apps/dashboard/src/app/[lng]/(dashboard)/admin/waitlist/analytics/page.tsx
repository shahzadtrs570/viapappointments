import { WaitlistAnalytics } from "../../_components/WaitlistStats/WaitlistAnalytics"

export default function WaitlistAnalyticsPage() {
  return (
    <div className="container space-y-8 py-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Waitlist Analytics
        </h2>
        <p className="text-muted-foreground">
          View detailed analytics and insights about your waitlist.
        </p>
      </div>

      <WaitlistAnalytics />
    </div>
  )
}

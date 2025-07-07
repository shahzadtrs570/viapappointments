"use client"

import { Card } from "@package/ui/card"
import { CheckCircle2, Clock, UserPlus, Users } from "lucide-react"

interface WaitlistStatsCardsProps {
  totalEntries: number
  activeEntries: number
  convertedEntries: number
  recentSignups: number
}

export function WaitlistStatsCards({
  totalEntries,
  activeEntries,
  convertedEntries,
  recentSignups,
}: WaitlistStatsCardsProps) {
  const stats = [
    {
      title: "Total Entries",
      value: totalEntries,
      icon: Users,
      description: "Total waitlist signups",
    },
    {
      title: "Active",
      value: activeEntries,
      icon: Clock,
      description: "Active waitlist entries",
    },
    {
      title: "Converted",
      value: convertedEntries,
      icon: CheckCircle2,
      description: "Converted to customers",
    },
    {
      title: "Recent Signups",
      value: recentSignups,
      icon: UserPlus,
      description: "New signups in last 7 days",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center gap-4">
            <stat.icon className="size-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {stat.description}
          </p>
        </Card>
      ))}
    </div>
  )
}

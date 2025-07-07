import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"

type StatsCardProps = {
  title: string
  number: number
  icon?: React.ReactNode
}

export function StatsCard({ number, title, icon }: StatsCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="flex min-w-[220px] flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{number}</div>
      </CardContent>
    </Card>
  )
}

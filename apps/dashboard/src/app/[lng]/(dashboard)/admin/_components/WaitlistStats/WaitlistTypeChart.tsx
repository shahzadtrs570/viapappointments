"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface WaitlistTypeEntry {
  type: string
  count: number
}

interface WaitlistTypeChartProps {
  data: WaitlistTypeEntry[]
}

interface PieLabelRenderProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]
const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      dominantBaseline="central"
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      x={x}
      y={y}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function WaitlistTypeChart({ data }: WaitlistTypeChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.count, 0)

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Waitlist Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey="count"
                fill="#8884d8"
                label={renderCustomizedLabel}
                labelLine={false}
                nameKey="type"
                outerRadius={120}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `${value} (${((value / total) * 100).toFixed(1)}%)`
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

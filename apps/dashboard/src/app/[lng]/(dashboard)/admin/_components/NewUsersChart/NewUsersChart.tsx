"use client"

import { BaseLineChart } from "@package/ui/charts"

import type { ChartProps } from "../../_types"

export function NewUsersChart({ chartData, lineColors }: ChartProps) {
  const newUsersToday = chartData[chartData.length - 1]?.users ?? 0

  return (
    <section className="h-full flex-1">
      <BaseLineChart
        data={chartData}
        lineColors={lineColors}
        subTitle={newUsersToday.toString()}
        title="New Users"
        tooltipInfo="The number of new users created each day."
      />
    </section>
  )
}

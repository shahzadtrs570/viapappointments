"use client"

import { BaseLineChart } from "@package/ui/charts"

import type { ChartProps } from "../../_types"

export function TotalUsersChart({ chartData, lineColors }: ChartProps) {
  const totalUsers = chartData[chartData.length - 1]?.users ?? 0

  return (
    <section className="h-full flex-1">
      <BaseLineChart
        data={chartData}
        lineColors={lineColors}
        subTitle={totalUsers.toString()}
        title="Total Users"
        tooltipInfo="The number of total users for a given day."
      />
    </section>
  )
}

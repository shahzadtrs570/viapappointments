"use client"

import { BaseBarChart } from "@package/ui/charts"

import type { ChartProps } from "../../_types"

export function ActiveSubsBarChart({ chartData, lineColors }: ChartProps) {
  return (
    <section className="h-full flex-1">
      <BaseBarChart
        data={chartData}
        lineColors={lineColors}
        title="Subscriptions"
        tooltipInfo="Number of current subscriptions per plan and their statuses."
      />
    </section>
  )
}

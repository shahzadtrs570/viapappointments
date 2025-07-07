import { useMemo } from "react"

import { formatDateToMonthDayYear } from "@package/utils"
import { HelpCircle } from "lucide-react"
import { useTheme } from "next-themes"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ChartData } from "../types"

import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@package/ui/popover"

import { Typography } from "../../Typography/Typography"

type BaseLineChart = {
  title: string
  subTitle?: string
  data: ChartData
  lineColors: Record<string, string>
  tooltipInfo: string
}

export function BaseLineChart({
  title,
  subTitle,
  data,
  lineColors,
  tooltipInfo,
}: BaseLineChart) {
  const { resolvedTheme } = useTheme()
  const dataEntryNames = useMemo(() => {
    if (data.length === 0) return []
    return Object.keys(data[0]).filter((key) => key !== "name")
  }, [data])

  return (
    <Card className="h-full">
      <CardHeader>
        <section className="flex flex-row justify-between">
          <CardTitle>{title}</CardTitle>
          <Popover>
            <PopoverTrigger>
              <HelpCircle className="hover:opacity-50" />
            </PopoverTrigger>
            <PopoverContent>{tooltipInfo}</PopoverContent>
          </Popover>
        </section>
        {subTitle && (
          <Typography className="text-4xl" variant="large">
            {subTitle}
          </Typography>
        )}
      </CardHeader>
      <CardContent className="h-[500px] w-full">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              angle={-45}
              className="text-xs"
              dataKey="name"
              height={100}
              tick={{ textAnchor: "end" }}
              tickFormatter={formatDateToMonthDayYear}
              tickMargin={12}
              ticks={[
                data[0]?.name,
                data[Math.floor(data.length / 4)]?.name,
                data[Math.floor(data.length / 2)]?.name,
                data[Math.floor((3 * data.length) / 4)]?.name,
                data[data.length - 1]?.name,
              ]}
            />
            <YAxis
              allowDecimals={false}
              className="text-xs"
              domain={[0, "dataMax + 1"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor:
                  resolvedTheme === "dark" ? "#070D16" : "#ffffff",
                borderRadius: "8px",
                border:
                  resolvedTheme === "dark"
                    ? "1px solid #101b2c"
                    : "1px solid #dbdbdb",
              }}
            />
            {dataEntryNames.map((entryName) => (
              <Line
                key={entryName}
                dataKey={entryName}
                dot={false}
                stroke={lineColors[entryName]}
                strokeWidth={3}
                type={"monotone"}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

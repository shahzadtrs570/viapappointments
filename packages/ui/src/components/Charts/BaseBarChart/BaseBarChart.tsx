import { useMemo } from "react"

import { HelpCircle } from "lucide-react"
import { useTheme } from "next-themes"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ChartData } from "../types"

import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@package/ui/popover"

import { Typography } from "../../Typography/Typography"

type BaseBarChart = {
  title: string
  subTitle?: string
  data: ChartData
  lineColors: Record<string, string>
  tooltipInfo: string
}

export function BaseBarChart({
  title,
  subTitle,
  data,
  lineColors,
  tooltipInfo,
}: BaseBarChart) {
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
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickMargin={12} />
            <YAxis allowDecimals={false} />
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
              cursor={{
                fill: resolvedTheme === "dark" ? "#0f1a2b" : "#ece8e8",
              }}
            />
            {dataEntryNames.map((entryName) => (
              <Bar
                key={entryName}
                dataKey={entryName}
                fill={lineColors[entryName]}
                stackId="a"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

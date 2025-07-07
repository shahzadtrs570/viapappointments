"use client"

import { Button } from "@package/ui/button"
import { DatePickerWithRange } from "@package/ui/date-range-picker"
import { Typography } from "@package/ui/typography"

import { useAdminContext } from "../../_contexts/adminContext"

type HeroProps = {
  onGenerateClick: () => void
  isLoading: boolean
}

export function Hero({ onGenerateClick, isLoading }: HeroProps) {
  const { dateRange, setDateRange } = useAdminContext()

  return (
    <section className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <Typography className="mb-4" variant="h1">
        Overview
      </Typography>
      <section className="flex flex-wrap gap-2 md:items-center">
        <DatePickerWithRange
          calendarProps={{ toDate: new Date() }}
          date={dateRange}
          setDate={setDateRange}
        />
        <Button
          disabled={isLoading}
          isLoading={isLoading}
          onClick={onGenerateClick}
        >
          Generate
        </Button>
      </section>
    </section>
  )
}

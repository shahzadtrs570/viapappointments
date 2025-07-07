/* eslint-disable no-nested-ternary */
"use client"

import type * as React from "react"

import { cn } from "@package/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import type { DateRange, DayPickerRangeProps } from "react-day-picker"

import { Button } from "../Button/Button"
import { Calendar } from "../Calendar/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../Popover/Popover"

type DatePickerWithRangeProps = React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  calendarProps?: Omit<DayPickerRangeProps, "mode">
}

export function DatePickerWithRange({
  date,
  setDate,
  calendarProps,
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[254px] xs:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            initialFocus
            defaultMonth={date?.from}
            mode="range"
            numberOfMonths={2}
            selected={date}
            onSelect={(newRange) => {
              if (newRange?.to) {
                const adjustedToDate = new Date(newRange.to)
                adjustedToDate.setHours(23, 59, 59, 999)
                setDate({ ...newRange, to: adjustedToDate })
              } else {
                // Handle the case when newRange.to is undefined
                // For example, keep the existing toDate or set it to a default value
                setDate(newRange)
              }
            }}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

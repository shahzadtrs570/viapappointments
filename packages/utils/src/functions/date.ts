import {
  eachDayOfInterval,
  endOfDay,
  format,
  formatDistanceToNowStrict,
  startOfDay,
  subDays,
} from "date-fns"

export type DateRange = {
  from: Date | undefined
  to?: Date | undefined
}

export function formatDateToMonthDayYear(date: Date) {
  return format(date, "MMM do, yyyy")
}

export function convertDateToFullYear(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export function timeFromNow(date: Date) {
  return formatDistanceToNowStrict(date, { addSuffix: true })
}

export function subtractDays(amountDaysToSubtract: number) {
  return subDays(new Date(), amountDaysToSubtract)
}

export function getAllDaysBetweenTwoDates(fromDate: Date, toDate: Date) {
  return eachDayOfInterval({
    start: startOfDay(fromDate),
    end: endOfDay(toDate),
  })
}

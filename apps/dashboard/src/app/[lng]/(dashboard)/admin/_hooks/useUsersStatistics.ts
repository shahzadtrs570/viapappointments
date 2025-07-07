import { keepPreviousData } from "@tanstack/react-query"

import type { Statistics } from "../_types"

import { api } from "@/lib/trpc/react"

import { useAdminContext } from "../_contexts/adminContext"

type UseUsersStatisticsProps = {
  initialUserStatistics: Statistics["users"]
}

const lineColors = {
  users: "#8884d8",
}

export function useUsersStatistics({
  initialUserStatistics,
}: UseUsersStatisticsProps) {
  const { dateRange } = useAdminContext()

  const userStatisticsQuery = api.admin.statistics.users.useQuery(
    {
      from: dateRange?.from ?? new Date(),
      to: dateRange?.to ?? new Date(),
    },
    {
      initialData: initialUserStatistics,
      enabled: false,
      placeholderData: keepPreviousData,
    }
  )

  return {
    userStatisticsQuery,
    lineColors,
  }
}

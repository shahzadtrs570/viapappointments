import { keepPreviousData } from "@tanstack/react-query"

import type { PaginatedUsers } from "../_types"
import type { PaginationState } from "@tanstack/react-table"

import { api } from "@/lib/trpc/react"

type UseUserProps = {
  pagination: PaginationState
  initialData: PaginatedUsers
}

export function useUsers({ pagination, initialData }: UseUserProps) {
  return api.admin.users.list.useQuery(
    { page: pagination.pageIndex + 1, limit: pagination.pageSize },
    {
      placeholderData: keepPreviousData,
      initialData:
        pagination.pageIndex === 0 && pagination.pageSize === 10
          ? initialData
          : undefined,
    }
  )
}

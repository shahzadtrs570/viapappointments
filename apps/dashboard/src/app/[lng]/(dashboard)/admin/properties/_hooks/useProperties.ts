// import type { PaginatedProperties } from "../_types"
import type { PaginatedPropertiesResponse } from "../_types"
import type { PaginationState } from "@tanstack/react-table"

import { api } from "@/lib/trpc/react"

type UsePropertiesProps = {
  pagination: PaginationState
  initialData: PaginatedPropertiesResponse
}

export function useProperties({ pagination, initialData }: UsePropertiesProps) {
  return api.admin.properties.list.useQuery(
    { page: pagination.pageIndex + 1, limit: pagination.pageSize },
    {
      initialData:
        pagination.pageIndex === 0 && pagination.pageSize === 10
          ? {
              ...initialData,
              properties: initialData.properties.map((p) => ({
                ...p,
                sellerProperties: [],
              })),
            }
          : undefined,
      refetchOnMount: "always",
      staleTime: 0,
      refetchOnWindowFocus: true,
    }
  )
}

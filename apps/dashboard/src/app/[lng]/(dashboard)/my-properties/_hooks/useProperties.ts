import { useCallback } from "react"

import { api } from "@/lib/trpc/react"

interface UsePropertiesParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export const useProperties = ({
  page = 1,
  limit = 10,
  search,
  sortBy,
  sortOrder,
}: UsePropertiesParams = {}) => {
  const { data, isLoading, error, refetch } =
    api.property.myProperties.list.useQuery(
      {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      },
      {
        refetchOnWindowFocus: false,
        staleTime: 30000,
      }
    )

  const refetchProperties = useCallback(() => {
    void refetch()
  }, [refetch])

  return {
    properties: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
    refetchProperties,
  }
}

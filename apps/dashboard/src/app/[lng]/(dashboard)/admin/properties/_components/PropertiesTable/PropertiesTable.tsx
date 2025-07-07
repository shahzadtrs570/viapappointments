/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef } from "react"

import { DataTable } from "@package/ui/data-table"
import { Spinner } from "@package/ui/spinner"

// import type { PaginatedProperties } from "../../_types"

import type { PaginatedPropertiesResponse } from "../../_types"

import { propertyColumns } from "./propertyColumns"
import { useAdminContext } from "../../../_contexts/adminContext"
import { useProperties } from "../../_hooks/useProperties"

type PropertiesTableProps = {
  initialPaginatedPropertiesData: PaginatedPropertiesResponse
}

export function PropertiesTable({
  initialPaginatedPropertiesData,
}: PropertiesTableProps) {
  const { pagination, setPagination } = useAdminContext()
  const hasInitialFetchRef = useRef(false)

  const propertiesQuery = useProperties({
    pagination,
    initialData: initialPaginatedPropertiesData,
  })

  useEffect(() => {
    if (!hasInitialFetchRef.current) {
      void propertiesQuery.refetch()
      hasInitialFetchRef.current = true
    }
  }, [propertiesQuery])

  // Display full page loading spinner only on initial load
  if (propertiesQuery.isLoading && !propertiesQuery.isFetching) {
    return <Spinner />
  }

  // Use isFetching for UI loading indicators
  // const isLoading = propertiesQuery.isFetching
  const properties = propertiesQuery.data?.properties ?? []

  return (
    <section className="flex flex-col gap-24">
      <div className="relative">
        <DataTable
          columnToggle
          showPagination
          columns={propertyColumns}
          data={properties as any}
          customPagination={{
            pagination,
            setPagination,
            hasMore: propertiesQuery.data?.pagination.hasMore || false,
            totalPages: propertiesQuery.data?.pagination.totalPages || 0,
          }}
          initialState={{
            columnVisibility: {
              id: false,
              propertyType: true,
              bedroomCount: true,
              bathroomCount: true,
              totalAreaSqM: true,
              condition: true,
              estimatedValue: true,
              addressDetails: true,
              "Created At": true,
              "Updated At": false,
              "Confirmed Value": false,
            },
          }}
        />
        {propertiesQuery.isFetching && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80">
            <Spinner />
          </div>
        )}
      </div>
    </section>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useCallback, useEffect, useState } from "react"

import { DataTable } from "@package/ui/data-table"
import { Spinner } from "@package/ui/spinner"

import type { Property } from "../../_types"

import { propertyColumns } from "./propertyColumns"

interface PropertiesTableProps {
  properties: Property[]
  meta:
    | {
        totalCount: number
        page: number
        limit: number
        pageCount: number
      }
    | undefined
  isLoading: boolean
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
  onSortChange?: (column: string, direction: "asc" | "desc") => void
  refetch?: () => void
  currentLimit?: number
}

export function PropertiesTable({
  properties,
  meta,
  isLoading,
  onPageChange = () => {},
  onLimitChange = () => {},
  refetch = () => {},
  currentLimit,
}: PropertiesTableProps) {
  // Internal state to track the current page size
  const [pageSize, setPageSize] = useState(currentLimit || meta?.limit || 10)

  // Update internal state when props change
  useEffect(() => {
    if (currentLimit && currentLimit !== pageSize) {
      setPageSize(currentLimit)
    }
  }, [currentLimit, pageSize])

  // Handle pagination changes from DataTable
  const handlePaginationChange = useCallback(
    (
      updater:
        | { pageIndex?: number; pageSize?: number }
        | ((state: { pageIndex: number; pageSize: number }) => {
            pageIndex: number
            pageSize: number
          })
    ) => {
      // If changing page size
      if (
        typeof updater === "object" &&
        "pageSize" in updater &&
        updater.pageSize
      ) {
        const newLimit = updater.pageSize

        // Update internal state
        setPageSize(newLimit)

        // Tell parent component
        onLimitChange(newLimit)

        return
      }

      // If changing page number
      const currentState = {
        pageIndex: meta?.page ? meta.page - 1 : 0,
        pageSize,
      }

      const newState =
        typeof updater === "function"
          ? updater(currentState)
          : { ...currentState, ...updater }

      const newPage = newState.pageIndex + 1

      onPageChange(newPage)
    },
    [meta?.page, onLimitChange, onPageChange, pageSize]
  )

  // Handle API refetch when page size changes directly from DataTable
  const handleDirectPageSizeChange = useCallback(
    (newSize: number) => {
      // Only update if changed
      if (newSize !== pageSize) {
        setPageSize(newSize)
        onLimitChange(newSize)

        // Force refetch after a small delay to ensure state updates
        setTimeout(() => {
          refetch()
        }, 50)
      }
    },
    [pageSize, onLimitChange, refetch]
  )

  // Early return for loading state
  if (isLoading && !properties.length) {
    return <Spinner />
  }

  return (
    <div className="relative w-full">
      <section className="flex flex-col gap-8">
        <div className="relative">
          <DataTable
            columnToggle
            showPagination
            columns={propertyColumns}
            data={properties}
            customPagination={
              meta
                ? {
                    pagination: {
                      pageIndex: meta.page - 1,
                      pageSize,
                    },
                    setPagination: handlePaginationChange,
                    hasMore: meta.page < meta.pageCount,
                    totalPages: meta.pageCount,
                  }
                : undefined
            }
            initialState={{
              columnVisibility: {
                id: false,
                propertyType: true,
                price: true,
                address: true,
                postcode: true,
                createdAt: true,
                status: true,
              },
              pagination: {
                pageSize,
              },
            }}
            onPageSizeChange={handleDirectPageSizeChange}
          />
        </div>
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
            <Spinner />
          </div>
        )}
      </section>
    </div>
  )
}

import { useEffect, useMemo, useState } from "react"

import _ from "lodash"
import {
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
} from "lucide-react"

import type { Table } from "@tanstack/react-table"

import { Button } from "../Button/Button"
import { Input } from "../Input/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Select/Select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  hasMore?: boolean
  totalPages?: number
  onPageSizeChange?: (newPageSize: number) => void
}

export function DataTablePagination<TData>({
  table,
  hasMore,
  totalPages,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  // Local state just for UI display
  const [displayPageSize, setDisplayPageSize] = useState(
    table.getState().pagination.pageSize
  )

  const debouncedSetPageIndex = useMemo(
    () =>
      _.debounce((pageIndex: number) => {
        table.setPageIndex(pageIndex)
      }, 600),
    [table]
  )

  useEffect(
    () => () => {
      debouncedSetPageIndex.cancel()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className="mt-2 flex flex-col items-end space-x-6 space-y-1 sm:flex-row sm:items-center sm:justify-between lg:space-x-8">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${displayPageSize}`}
          onValueChange={(value) => {
            const newSize = Number(value)
            // Update local state for immediate UI feedback
            setDisplayPageSize(newSize)
            // Then update table state
            table.setPageSize(newSize)
            // Reset to page 1
            table.setPageIndex(0)
            // Call external handler to trigger API update
            if (onPageSizeChange) {
              onPageSizeChange(newSize)
            }
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={displayPageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
        <div className="flex w-[100px] items-center justify-end text-sm font-medium sm:justify-center">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {totalPages ?? table.getPageCount()}
        </div>
        <Input
          className="w-[115px]"
          max={totalPages ?? table.getPageCount()}
          min={1}
          placeholder="Go to page"
          type="number"
          onChange={(e) => {
            const pageNumber = Number(e.target.value)
            const maxPageNumber = totalPages ?? table.getPageCount()
            if (pageNumber <= maxPageNumber) {
              if (totalPages) {
                debouncedSetPageIndex(pageNumber - 1)
              } else {
                table.setPageIndex(pageNumber - 1)
              }
            }
          }}
        />
        <div className="mt-2 flex items-center space-x-2 sm:mt-0">
          <Button
            className="size-8 p-0 lg:flex"
            disabled={!table.getCanPreviousPage()}
            variant="outline"
            onClick={() => table.setPageIndex(0)}
          >
            <span className="sr-only">Go to first page</span>
            <ArrowLeftToLine className="size-4" />
          </Button>
          <Button
            className="size-8 p-0"
            disabled={!table.getCanPreviousPage()}
            variant="outline"
            onClick={() => table.previousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ArrowLeft className="size-4" />
          </Button>
          <Button
            className="size-8 p-0"
            disabled={!hasMore && !table.getCanNextPage()}
            variant="outline"
            onClick={() => table.nextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ArrowRight className="size-4" />
          </Button>
          <Button
            className="size-8 p-0 lg:flex"
            variant="outline"
            disabled={
              totalPages
                ? table.getState().pagination.pageIndex + 1 === totalPages
                : !table.getCanNextPage()
            }
            onClick={() =>
              table.setPageIndex(
                totalPages ? totalPages - 1 : table.getPageCount() - 1
              )
            }
          >
            <span className="sr-only">Go to last page</span>
            <ArrowRightToLine className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

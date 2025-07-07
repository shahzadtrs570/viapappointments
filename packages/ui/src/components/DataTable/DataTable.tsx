"use client"

import { useState } from "react"

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import type {
  ColumnDef,
  InitialTableState,
  PaginationState,
  SortingState,
  TableOptions,
  TableState,
} from "@tanstack/react-table"

import { DataTablePagination } from "./DataTablePagination"
import { DataTableViewOptions } from "./DataTableViewOptions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Table/Table"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  showPagination?: boolean
  columnToggle?: boolean
  initialState?: InitialTableState
  customPagination?: {
    pagination: PaginationState
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
    hasMore: boolean
    totalPages: number
  }
  onPageSizeChange?: (newPageSize: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showPagination,
  columnToggle,
  initialState,
  customPagination,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const tableState: Partial<TableState> = {
    sorting,
  }

  const tableOptions: TableOptions<TData> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: tableState,
    initialState,
    manualPagination: !!customPagination,
    autoResetPageIndex: false,
  }

  // customPagination props if you are managing your own pagination state
  // Otherwise, let the DataTable component manage the pagination state and pass the showPagination prop only
  if (customPagination) {
    const { pagination, setPagination } = customPagination
    tableState.pagination = pagination
    tableOptions.onPaginationChange = setPagination
  }

  const table = useReactTable(tableOptions)

  return (
    <section className="space-y-2">
      <section>
        {columnToggle && <DataTableViewOptions table={table} />}
      </section>
      <section className="border-input-field h-[529.5px] overflow-auto rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell> */}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
      {showPagination && (
        <DataTablePagination
          hasMore={customPagination?.hasMore}
          table={table}
          totalPages={customPagination?.totalPages}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </section>
  )
}

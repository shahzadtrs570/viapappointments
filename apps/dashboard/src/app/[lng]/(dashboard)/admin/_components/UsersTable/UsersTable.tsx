"use client"

import { DataTable } from "@package/ui/data-table"
import { Spinner } from "@package/ui/spinner"

import type { PaginatedUsers } from "../../_types"

import { userColumns } from "./usersTableColumns"
import { useAdminContext } from "../../_contexts/adminContext"
import { useUsers } from "../../_hooks/useUsers"

type UsersTableProps = {
  initialPaginatedUsersData: PaginatedUsers
}

export function UsersTable({ initialPaginatedUsersData }: UsersTableProps) {
  const { pagination, setPagination } = useAdminContext()
  const usersQuery = useUsers({
    pagination,
    initialData: initialPaginatedUsersData,
  })

  if (usersQuery.isLoading) {
    return <Spinner />
  }

  return (
    <section className="flex flex-col gap-24">
      <DataTable
        columnToggle
        showPagination
        columns={userColumns}
        data={usersQuery.data?.users ?? []}
        customPagination={{
          pagination,
          setPagination,
          hasMore: usersQuery.data?.pagination.hasMore || false,
          totalPages: usersQuery.data?.pagination.totalPages || 0,
        }}
        initialState={{
          columnVisibility: {
            id: false,
            name: true,
            email: true,
            role: true,
            banned: true,
            "Subscription Plan": true,
            "Created At": true,
            "Plan Canceled": false,
            "Subscription Id": false,
            "Billing Start": false,
            "Customer Id": false,
            "Billing Interval": false,
            "Billing End": false,
          },
        }}
      />
    </section>
  )
}

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/rules-of-hooks */

import { DataTableColumnHeader } from "@package/ui/data-table"
import { getSubscriptionPlanFromLookupKey } from "@package/utils"

import type { FullUser } from "@package/auth/types"
import type { ColumnDef } from "@tanstack/react-table"

import { useUsersTableActions } from "../../_hooks/useUsersTableActions"
import { BanUserDialog } from "../BanUserDialog/BanUserDialog"
import { DeleteUserDialog } from "../DeleteUserDialog/DeleteUserDialog"
import { UnbanUserDialog } from "../UnbanUserDialog/UnbanUserDialog"
import { UserTableActions } from "../UserTableActions/UserTableActions"

export const userColumns: ColumnDef<FullUser>[] = [
  {
    accessorKey: "id",
    id: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "name",
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    id: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    id: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },
  {
    accessorKey: "isBanned",
    id: "banned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banned" />
    ),
  },
  {
    accessorKey: "createdAt",
    id: "Created At",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const user = row.original
      return new Date(user.createdAt).toLocaleDateString()
    },
  },
  {
    accessorKey: "subscription.subscriptionPlan",
    id: "Subscription Plan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription Plan" />
    ),
    cell: ({ row }) => {
      const lookupKey = row.original.subscription?.lookupKey
      const plan = getSubscriptionPlanFromLookupKey(lookupKey ?? "")
      return plan?.name ?? "Unknown"
    },
  },
  {
    accessorKey: "subscription.customerId",
    id: "Customer Id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Id" />
    ),
  },
  {
    accessorKey: "subscription.subscriptionId",
    id: "Subscription Id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription Id" />
    ),
  },
  {
    accessorKey: "subscription.billingInterval",
    id: "Billing Interval",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Billing Interval" />
    ),
  },
  {
    accessorKey: "subscription.status",
    id: "Status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "subscription.currentPeriodStart",
    id: "Billing Start",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Billing Start" />
    ),
    cell: ({ row }) => {
      const user = row.original
      if (!user.subscription?.currentPeriodStart) return null
      return new Date(user.subscription.currentPeriodStart).toLocaleDateString()
    },
  },
  {
    accessorKey: "subscription.currentPeriodEnd",
    id: "Billing End",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Billing End" />
    ),
    cell: ({ row }) => {
      const user = row.original
      if (!user.subscription?.currentPeriodEnd) return null
      return new Date(user.subscription.currentPeriodEnd).toLocaleDateString()
    },
  },
  {
    accessorKey: "subscription.isCanceledAtPeriodEnd",
    id: "Plan Canceled",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan Canceled" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const {
        form,
        isBanDialogOpen,
        isUnbanDialogOpen,
        isDeleteDialogOpen,
        setIsBanDialogOpen,
        setIsUnbanDialogOpen,
        setIsDeleteDialogOpen,
        handleBanStatusDialog,
      } = useUsersTableActions({ userIsBanned: user.isBanned })

      return (
        <section>
          <UserTableActions
            user={user}
            onBanUserActionClick={handleBanStatusDialog}
            onDeleteUserActionClick={() => setIsDeleteDialogOpen(true)}
          />
          <BanUserDialog
            form={form}
            isDialogOpen={isBanDialogOpen}
            setIsDialogOpen={setIsBanDialogOpen}
            userEmail={user.email!}
            userId={user.id}
          />
          <UnbanUserDialog
            form={form}
            isDialogOpen={isUnbanDialogOpen}
            setIsDialogOpen={setIsUnbanDialogOpen}
            userEmail={user.email!}
            userId={user.id}
          />
          <DeleteUserDialog
            isDialogOpen={isDeleteDialogOpen}
            setIsDialogOpen={setIsDeleteDialogOpen}
            userEmail={user.email!}
            userId={user.id}
          />
        </section>
      )
    },
  },
]

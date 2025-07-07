import { DataTableColumnHeader } from "@package/ui/data-table"

import type { PerformedBans } from "../../_types"
import type { ColumnDef } from "@tanstack/react-table"

export const userPerformedBanColumns: ColumnDef<PerformedBans>[] = [
  {
    accessorKey: "createdAt",
    id: "Banned At",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banned At" />
    ),
    cell: ({ row }) => {
      const ban = row.original
      return new Date(ban.createdAt).toLocaleString()
    },
  },
  {
    accessorKey: "banReason",
    id: "Ban Reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ban Reason" />
    ),
  },
  {
    accessorKey: "user",
    id: "Banned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banned" />
    ),
    cell: ({ row }) => {
      const ban = row.original
      return ban.user.email
    },
  },
  {
    accessorKey: "unbannedAt",
    id: "Unbanned Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unbanned Date" />
    ),
    cell: ({ row }) => {
      const ban = row.original
      return ban.unbannedAt ? new Date(ban.unbannedAt).toLocaleString() : null
    },
  },
  {
    accessorKey: "unbanReason",
    id: "Unban Reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unban Reason" />
    ),
  },
  {
    accessorKey: "unbannedBy",
    id: "Unbanned By",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unbanned By" />
    ),
    cell: ({ row }) => {
      const ban = row.original
      return ban.unbannedBy?.email
    },
  },
]

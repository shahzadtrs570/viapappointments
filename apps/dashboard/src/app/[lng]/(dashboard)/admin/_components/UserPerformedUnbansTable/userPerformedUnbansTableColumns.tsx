import { DataTableColumnHeader } from "@package/ui/data-table"

import type { PerformedUnBans } from "../../_types"
import type { ColumnDef } from "@tanstack/react-table"

export const userPerformedUnbanColumns: ColumnDef<PerformedUnBans>[] = [
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
    id: "Unbanned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unbanned" />
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
    accessorKey: "bannedBy",
    id: "Banned By",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banned By" />
    ),
    cell: ({ row }) => {
      const ban = row.original
      return ban.bannedBy?.email
    },
  },
]

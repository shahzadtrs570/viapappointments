import { useState } from "react"

import { Button } from "@package/ui/button"
import { DataTableColumnHeader } from "@package/ui/data-table"
import { FileEdit, RefreshCw } from "lucide-react"

import type { WaitlistEntry } from "@package/db"
import type { ColumnDef } from "@tanstack/react-table"

import { ChangeStatusDialog } from "./ChangeStatusDialog"
import { EditNotesDialog } from "./EditNotesDialog"

export const waitlistColumns: ColumnDef<WaitlistEntry>[] = [
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
    accessorKey: "waitlistType",
    id: "waitlistType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
  },
  {
    accessorKey: "status",
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "source",
    id: "source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
  },
  {
    accessorKey: "referralCode",
    id: "referralCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referral Code" />
    ),
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const entry = row.original
      return new Date(entry.createdAt).toLocaleDateString()
    },
  },
  {
    accessorKey: "notes",
    id: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => {
      const entry = row.original
      return entry.notes || "-"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const entry = row.original
      return <ActionCell entry={entry} />
    },
  },
]

function ActionCell({ entry }: { entry: WaitlistEntry }) {
  const [isEditNotesOpen, setIsEditNotesOpen] = useState(false)
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditNotesOpen(true)}
        >
          <FileEdit className="size-4" />
          <span className="sr-only">Edit notes</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsChangeStatusOpen(true)}
        >
          <RefreshCw className="size-4" />
          <span className="sr-only">Change status</span>
        </Button>
      </div>

      <EditNotesDialog
        currentNotes={entry.notes}
        entryId={entry.id}
        isOpen={isEditNotesOpen}
        onClose={() => setIsEditNotesOpen(false)}
      />

      <ChangeStatusDialog
        currentStatus={entry.status}
        entryId={entry.id}
        isOpen={isChangeStatusOpen}
        onClose={() => setIsChangeStatusOpen(false)}
      />
    </>
  )
}

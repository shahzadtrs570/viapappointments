import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { ArrowUpIcon } from "lucide-react"

import type { Lead } from "./types"

import { ClickableCell } from "./ClickableCell"

// Status badge styling for table
export const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "CONTACTED":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "QUALIFIED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "CONVERTED":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "DISQUALIFIED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  }
}

export const createColumns = (handleRowClick: (row: Lead) => void) => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({
      row,
    }: {
      row: { getValue: (key: string) => string | null; original: Lead }
    }) => {
      const name = row.getValue("name") || "N/A"
      return (
        <div
          aria-label={`View details for ${name}`}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => handleRowClick(row.original)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleRowClick(row.original)
            }
          }}
        >
          {name}
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({
      row,
    }: {
      row: { getValue: (key: string) => string; original: Lead }
    }) => {
      const email = row.getValue("email")
      return (
        <div
          aria-label={`View details for ${email}`}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => handleRowClick(row.original)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleRowClick(row.original)
            }
          }}
        >
          {email}
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({
      row,
    }: {
      row: {
        getValue: (key: string) => string | null | undefined
        original: Lead
      }
    }) => {
      const phone = row.getValue("phone")
      return (
        <ClickableCell onClick={() => handleRowClick(row.original)}>
          {phone || "-"}
        </ClickableCell>
      )
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({
      row,
    }: {
      row: {
        getValue: (key: string) => string | null | undefined
        original: Lead
      }
    }) => {
      const company = row.getValue("company")
      return (
        <ClickableCell onClick={() => handleRowClick(row.original)}>
          {company || "-"}
        </ClickableCell>
      )
    },
  },
  {
    accessorKey: "leadType",
    header: "Type",
    cell: ({
      row,
    }: {
      row: { getValue: (key: string) => string; original: Lead }
    }) => {
      const leadType = row.getValue("leadType")
      return (
        <ClickableCell onClick={() => handleRowClick(row.original)}>
          <Badge variant="outline">{leadType}</Badge>
        </ClickableCell>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({
      row,
    }: {
      row: { getValue: (key: string) => string; original: Lead }
    }) => {
      const status = row.getValue("status")
      return (
        <ClickableCell onClick={() => handleRowClick(row.original)}>
          <Badge className={getStatusColor(status)} variant="outline">
            {status}
          </Badge>
        </ClickableCell>
      )
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({
      row,
    }: {
      row: {
        getValue: (key: string) => string | null | undefined
        original: Lead
      }
    }) => {
      const source = row.getValue("source")
      return (
        <ClickableCell onClick={() => handleRowClick(row.original)}>
          {source || "-"}
        </ClickableCell>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({
      row,
    }: {
      row: { getValue: (key: string) => string | Date; original: Lead }
    }) => {
      const date = new Date(row.getValue("createdAt"))
      return (
        <ClickableCell onClick={() => handleRowClick(row.original)}>
          {date.toLocaleDateString()}
        </ClickableCell>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }: { row: { original: Lead } }) => {
      const lead = row.original
      return (
        <Button asChild className="size-8 p-0" size="sm" variant="ghost">
          <a href={`/admin/leads/${lead.id}`}>
            <span className="sr-only">View details</span>
            <ArrowUpIcon className="size-4" />
          </a>
        </Button>
      )
    },
  },
]

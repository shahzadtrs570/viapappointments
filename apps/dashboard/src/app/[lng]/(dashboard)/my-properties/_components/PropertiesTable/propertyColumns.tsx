/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

// This file re-exports the columns from propertiesTableColumns to fix naming issues

import { DataTableColumnHeader } from "@package/ui/data-table"
import { useToast } from "@package/ui/toast"
import { cn } from "@package/utils"
import { useRouter } from "next/navigation"

import type { Property } from "../../_types"
import type { ColumnDef } from "@tanstack/react-table"

import { PropertyTableActions } from "../PropertyTableActions/PropertyTableActions"

const getStatusConfig = (status: string) => {
  const configs = {
    ACCEPTED: {
      label: "Accepted",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    PENDING: {
      label: "Pending",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    PROCESSING: {
      label: "Processing",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  }
  return configs[status as keyof typeof configs] || configs.PENDING
}

const handlePropertyClick = (
  propertyId: string,
  router: any,
  showToast: (props: any) => void
) => {
  try {
    router.push(
      `/?mode=continue-again&propertyId=${propertyId}&step=Contemplation`
    )
  } catch (error) {
    console.error("Error navigating to property:", error)
    showToast({
      title: "Error",
      description: "Failed to load property details",
      variant: "destructive",
    })
  }
}

export const propertyColumns: ColumnDef<Property>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const { toast } = useToast()
      const address =
        row.original.formattedAddress ||
        (typeof row.original.address === "string"
          ? row.original.address
          : "Not available")

      return (
        <div
          className="max-w-[250px] cursor-pointer truncate"
          title={address}
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("button")) {
              handlePropertyClick(row.original.id, router, toast)
            }
          }}
        >
          {address}
        </div>
      )
    },
  },
  {
    accessorKey: "postcode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Postcode" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const { toast } = useToast()
      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("button")) {
              handlePropertyClick(row.original.id, router, toast)
            }
          }}
        >
          {row.original.postcode || "Not available"}
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const { toast } = useToast()
      const price = row.original.price || 0

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("button")) {
              handlePropertyClick(row.original.id, router, toast)
            }
          }}
        >
          {price
            ? new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(price)
            : "Not available"}
        </div>
      )
    },
  },
  {
    accessorKey: "propertyType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property Type" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const { toast } = useToast()
      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("button")) {
              handlePropertyClick(row.original.id, router, toast)
            }
          }}
        >
          {row.original.propertyType
            ? row.original.propertyType.charAt(0).toUpperCase() +
              row.original.propertyType.slice(1).toLowerCase()
            : "Not available"}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const { toast } = useToast()
      const status = row.original.status || "PENDING"
      const statusConfig = getStatusConfig(status)

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("button")) {
              handlePropertyClick(row.original.id, router, toast)
            }
          }}
        >
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
              statusConfig.className
            )}
          >
            {statusConfig.label}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const { toast } = useToast()
      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("button")) {
              handlePropertyClick(row.original.id, router, toast)
            }
          }}
        >
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <PropertyTableActions property={row.original} />,
  },
]

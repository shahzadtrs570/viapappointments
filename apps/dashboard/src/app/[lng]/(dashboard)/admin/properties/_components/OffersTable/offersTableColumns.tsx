/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/rules-of-hooks */

import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { DataTableColumnHeader } from "@package/ui/data-table"
import Link from "next/link"

import type { Prisma } from "@package/db"
import type { ColumnDef } from "@tanstack/react-table"

type OfferWithSeller = Prisma.OfferGetPayload<{
  include: {
    sellerProfile: true
    contract: true
  }
}>

export const offersColumns: ColumnDef<OfferWithSeller>[] = [
  {
    accessorKey: "id",
    id: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "sellerProfile.firstName",
    id: "sellerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seller" />
    ),
    cell: ({ row }) => {
      const offer = row.original
      return `${offer.sellerProfile.firstName} ${offer.sellerProfile.lastName}`
    },
  },
  {
    accessorKey: "initialPaymentAmount",
    id: "initialPaymentAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Initial Payment" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.original.initialPaymentAmount) || 0
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    },
  },
  {
    accessorKey: "monthlyPaymentAmount",
    id: "monthlyPaymentAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monthly Payment" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.original.monthlyPaymentAmount) || 0
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    },
  },
  {
    accessorKey: "indexationRate",
    id: "indexationRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Indexation Rate" />
    ),
    cell: ({ row }) => {
      const rate = parseFloat(row.original.indexationRate) || 0
      return `${rate}%`
    },
  },
  {
    accessorKey: "status",
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status

      // Using standard badge variants
      let variant: "default" | "destructive" | "outline" | "secondary" =
        "default"

      switch (status) {
        case "DRAFT":
          variant = "outline"
          break
        case "PENDING":
          variant = "secondary"
          break
        case "ACCEPTED":
          variant = "default"
          break
        case "REJECTED":
          variant = "destructive"
          break
        case "EXPIRED":
          variant = "outline"
          break
        case "WITHDRAWN":
          variant = "secondary"
          break
      }

      return (
        <Badge variant={variant}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </Badge>
      )
    },
  },
  {
    id: "contract",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contract" />
    ),
    cell: ({ row }) => {
      const offer = row.original

      if (
        !offer.contract ||
        !Array.isArray(offer.contract) ||
        offer.contract.length === 0
      ) {
        return <Badge variant="outline">No contract</Badge>
      }

      const contract = offer.contract
      let variant: "default" | "destructive" | "outline" | "secondary" =
        "default"
      let label = ""

      // Safely access the contract status with null checks
      const contractStatus = contract[0]?.status || "UNKNOWN"

      switch (contractStatus) {
        case "DRAFT":
          variant = "outline"
          label = "Draft"
          break
        case "PENDING_SIGNATURE":
          variant = "secondary"
          label = "Pending Signature"
          break
        case "PARTIALLY_SIGNED":
          variant = "secondary"
          label = "Partially Signed"
          break
        case "SIGNED":
          variant = "default"
          label = "Signed"
          break
        case "COMPLETED":
          variant = "default"
          label = "Completed"
          break
        case "TERMINATED":
          variant = "destructive"
          label = "Terminated"
          break
        case "DISPUTED":
          variant = "destructive"
          label = "Disputed"
          break
        default:
          variant = "outline"
          label = contractStatus
      }

      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const offer = row.original

      return (
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/admin/offers/${offer.id}`}>View</Link>
          </Button>
        </div>
      )
    },
  },
]

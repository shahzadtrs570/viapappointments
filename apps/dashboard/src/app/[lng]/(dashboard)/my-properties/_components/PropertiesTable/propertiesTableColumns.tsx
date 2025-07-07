/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { DataTableColumnHeader } from "@package/ui/data-table"
import { useToast } from "@package/ui/toast"
import { useRouter } from "next/navigation"

import type { Property, PropertyAddress } from "../../_types"
import type { ColumnDef } from "@tanstack/react-table"

import { PropertyTableActions } from "../PropertyTableActions/PropertyTableActions"

const handlePropertyClick = (
  propertyId: string,
  router: any,
  showToast: (props: any) => void
) => {
  try {
    // Navigate to the wizard with continue-again mode
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

export const propertiesTableColumns: ColumnDef<Property>[] = [
  {
    accessorKey: "id",
    id: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "address",
    id: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const { toast } = useToast()
      const address = row.original.address

      // Format address properly
      let formattedAddress = "Not available"

      if (address) {
        if (typeof address === "string") {
          formattedAddress = address
        } else if (typeof address === "object") {
          const addressObj = address as PropertyAddress
          const addressParts = []

          if (addressObj.streetLine1) addressParts.push(addressObj.streetLine1)
          if (addressObj.streetLine2) addressParts.push(addressObj.streetLine2)
          if (addressObj.city) addressParts.push(addressObj.city)
          if (addressObj.state) addressParts.push(addressObj.state)

          formattedAddress = addressParts.join(", ") || "Not available"
        }
      }

      return (
        <div
          className="max-w-[250px] cursor-pointer truncate"
          title={formattedAddress}
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("button")) {
              handlePropertyClick(row.original.id, router, toast)
            }
          }}
        >
          {formattedAddress}
        </div>
      )
    },
  },
  {
    accessorKey: "postcode",
    id: "postcode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Postcode" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const { toast } = useToast()

      const postcode =
        typeof row.original.address === "object" && row.original.address
          ? row.original.address.postalCode
          : "Not available"

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              handlePropertyClick(row.original.id, router, toast)
            }
          }}
        >
          {postcode || "Not available"}
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    id: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const { toast } = useToast()

      const price = row.original.price
        ? row.original.price
        : row.original.estimatedValue || 0

      const formattedPrice = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              handlePropertyClick(row.original.id, router, toast)
            }
          }}
        >
          {price ? formattedPrice : "Not available"}
        </div>
      )
    },
  },
  {
    accessorKey: "propertyType",
    id: "propertyType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property Type" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const { toast } = useToast()
      const propertyType = row.original.propertyType

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              handlePropertyClick(row.original.id, router, toast)
            }
          }}
        >
          {propertyType
            ? propertyType.charAt(0).toUpperCase() +
              propertyType.slice(1).toLowerCase()
            : "Not available"}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
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
            // Don't navigate if clicked on action buttons
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
    cell: ({ row }) => {
      const property = row.original

      return <PropertyTableActions property={property} />
    },
  },
]

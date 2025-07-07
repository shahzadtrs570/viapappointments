/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DataTableColumnHeader } from "@package/ui/data-table"
import { useRouter } from "next/navigation"

import type { Property, PropertyCondition, PropertyType } from "@package/db"
import type { ColumnDef } from "@tanstack/react-table"

import { usePropertiesTableActions } from "../../_hooks/usePropertiesTableActions"
import { DeletePropertyDialog } from "../DeletePropertyDialog/DeletePropertyDialog"
import { PropertyTableActions } from "../PropertyTableActions/PropertyTableActions"

export const propertyColumns: ColumnDef<
  Property & {
    address?: {
      city: string
      addressData?: Record<string, any> | null
    } | null
  }
>[] = [
  {
    accessorKey: "id",
    id: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "propertyType",
    id: "propertyType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property Type" />
    ),
    cell: ({ row }) => {
      const propertyType = row.original.propertyType as PropertyType
      const router = useRouter()

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {propertyType.charAt(0) + propertyType.slice(1).toLowerCase()}
        </div>
      )
    },
  },
  {
    accessorKey: "bedroomCount",
    id: "bedroomCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bedrooms" />
    ),
    cell: ({ row }) => {
      const router = useRouter()

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {row.original.bedroomCount}
        </div>
      )
    },
  },
  {
    accessorKey: "bathroomCount",
    id: "bathroomCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bathrooms" />
    ),
    cell: ({ row }) => {
      const router = useRouter()

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {row.original.bathroomCount}
        </div>
      )
    },
  },
  {
    accessorKey: "totalAreaSqM",
    id: "totalAreaSqM",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Area (sqm)" />
    ),
    cell: ({ row }) => {
      const router = useRouter()

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {`${parseFloat(row.original.totalAreaSqM).toFixed(2)} m²`}
        </div>
      )
    },
  },
  {
    accessorKey: "condition",
    id: "condition",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Condition" />
    ),
    cell: ({ row }) => {
      const condition = row.original.condition as PropertyCondition
      const router = useRouter()

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {condition.charAt(0) +
            condition.slice(1).toLowerCase().replace("_", " ")}
        </div>
      )
    },
  },
  {
    accessorKey: "estimatedValue",
    id: "estimatedValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estimated Value" />
    ),
    cell: ({ row }) => {
      const router = useRouter()

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(parseFloat(row.original.estimatedValue) || 0)}
        </div>
      )
    },
  },
  {
    accessorKey: "confirmedValue",
    id: "Confirmed Value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Confirmed Value" />
    ),
    cell: ({ row }) => {
      const router = useRouter()

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {!row.original.confirmedValue
            ? "Not confirmed"
            : new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(parseFloat(row.original.confirmedValue) || 0)}
        </div>
      )
    },
  },
  {
    accessorKey: "address.addressData",
    id: "addressDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const addressData = row.original.address?.addressData as Record<
        string,
        any
      > | null

      // Format address according to new structure
      let formattedAddress = ""

      if (addressData) {
        // Check if we have lookup data first
        if (addressData.lookup) {
          // Use lookup data if available
          formattedAddress = [
            addressData.lookup.line_1,
            addressData.lookup.line_2,
            addressData.lookup.line_3,
            addressData.lookup.post_town,
            addressData.lookup.postcode,
          ]
            .filter(Boolean)
            .join(", ")
        }
        // Fall back to manual data if lookup is not available
        else if (addressData.manual) {
          formattedAddress = addressData.manual.address || ""
        }
        // Legacy format for backward compatibility
        else {
          formattedAddress = [
            addressData.line_1,
            addressData.line_2,
            addressData.line_3,
          ]
            .filter(Boolean)
            .join(", ")
        }
      }

      return (
        <div
          className="max-w-[250px] cursor-pointer truncate"
          title={formattedAddress}
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {formattedAddress || "No address details"}
        </div>
      )
    },
  },
  {
    accessorKey: "address.city",
    id: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const addressData = row.original.address?.addressData as Record<
        string,
        any
      > | null

      // Get city from new address structure
      let city = row.original.address?.city || ""

      if (addressData) {
        if (addressData.lookup) {
          // Prefer post_town from lookup data
          city = addressData.lookup.post_town || city
        } else if (addressData.manual) {
          // Fall back to town from manual data
          city = addressData.manual.town || city
        }
      }

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {city || "Not specified"}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    id: "Created At",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const router = useRouter()

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    id: "Updated At",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const router = useRouter()

      return (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Don't navigate if clicked on action buttons
            if (!(e.target as HTMLElement).closest("button")) {
              router.push(`/admin/properties/${row.original.id}`)
            }
          }}
        >
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original
      const { isDeleteDialogOpen, setIsDeleteDialogOpen } =
        usePropertiesTableActions()

      return (
        <section>
          <PropertyTableActions
            property={property}
            onDeletePropertyActionClick={() => setIsDeleteDialogOpen(true)}
          />
          <DeletePropertyDialog
            isDialogOpen={isDeleteDialogOpen}
            propertyId={property.id}
            setIsDialogOpen={setIsDeleteDialogOpen}
          />
        </section>
      )
    },
  },
]

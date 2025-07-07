"use client"

import { useEffect } from "react"

import { DataTable } from "@package/ui/data-table"
import { Spinner } from "@package/ui/spinner"
import { Typography } from "@package/ui/typography"

import { api } from "@/lib/trpc/react"

import { offersColumns } from "./offersTableColumns"

type OffersTableProps = {
  propertyId: string
}

export function OffersTable({ propertyId }: OffersTableProps) {
  const offersQuery = api.admin.offers.getByPropertyId.useQuery({ propertyId })

  useEffect(() => {
    // Refetch on initial load or property id change
    void offersQuery.refetch()
  }, [propertyId, offersQuery])

  if (offersQuery.isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="mr-2" />
        <Typography>Loading offers for this property...</Typography>
      </div>
    )
  }

  if (offersQuery.isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <Typography className="text-red-700">
          We encountered an issue while loading the offers. Please try again
          later.
        </Typography>
      </div>
    )
  }

  const offers = offersQuery.data ?? []

  if (offers.length === 0) {
    return (
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-8 text-center">
        <Typography className="mb-2 font-medium text-blue-700">
          No offers available yet
        </Typography>
        <Typography className="text-sm text-blue-600">
          This property is awaiting offers from our back office team. Once an
          offer has been created, it will appear here for review.
        </Typography>
      </div>
    )
  }

  return (
    <div>
      <DataTable
        columns={offersColumns}
        data={offers}
        initialState={{
          columnVisibility: {
            id: false,
          },
        }}
      />
    </div>
  )
}

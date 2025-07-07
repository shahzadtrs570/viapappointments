/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import { useCallback, useState } from "react"

import { Autocomplete } from "@package/ui/autocomplete"
import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"
import Link from "next/link"

import type { Property } from "../../_types"

import { useProperties } from "../../_hooks/useProperties"
import { useSearchProperties } from "../../_hooks/useSearchProperties"
import { PropertiesTable } from "../PropertiesTable/PropertiesTable"

interface PropertiesContentProps {
  initialPaginatedPropertiesData: {
    data: any[]
    meta: {
      totalCount: number
      page: number
      limit: number
      pageCount: number
    }
  }
}

export function PropertiesContent({
  initialPaginatedPropertiesData,
}: PropertiesContentProps) {
  // Pagination state
  const [page, setPage] = useState(initialPaginatedPropertiesData.meta.page)
  const [limit, setLimit] = useState(initialPaginatedPropertiesData.meta.limit)
  const [searchTerm, setSearchTerm] = useState("")

  // Use the properties hook directly for better control
  const { properties, meta, isLoading, refetchProperties } = useProperties({
    page,
    limit,
    search: searchTerm.length > 2 ? searchTerm : undefined,
  })

  // Options for autocomplete search
  const {
    selectedOption,
    setSelectedOption,
    setInputValue,
    propertyOptions,
    searchPropertiesQuery,
  } = useSearchProperties(
    // Pass whichever data is available
    properties && meta
      ? { data: properties, meta }
      : initialPaginatedPropertiesData
  )

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage !== page) {
        setPage(newPage)
      }
    },
    [page]
  )

  // Handle rows per page change
  const handleLimitChange = useCallback(
    (newLimit: number) => {
      if (newLimit !== limit) {
        setLimit(newLimit)
        setPage(1) // Reset to first page when changing limit
      }
    },
    [limit]
  )

  // Handle search input
  const handleSearchInput = useCallback(
    (searchQuery: string) => {
      setInputValue(searchQuery)

      if (
        (searchQuery.length > 2 && searchQuery !== searchTerm) ||
        (searchTerm.length > 0 && searchQuery.length === 0)
      ) {
        setSearchTerm(searchQuery)
        setPage(1) // Reset to first page when searching
      }
    },
    [searchTerm, setInputValue]
  )

  return (
    <section className="flex flex-col gap-8">
      <Typography variant="h1">My Properties</Typography>
      <section className="flex flex-col gap-2">
        <Typography className="text-muted-foreground" variant="small">
          Search by address, city, property type, bedrooms, bathrooms, area,
          condition, or value
        </Typography>
        <div className="flex items-center gap-2">
          <div className="flex w-full max-w-xl gap-2">
            <Autocomplete
              emptyCommandMessage="No properties found. Try different search terms."
              inputPlaceholder="Search properties by any field..."
              isLoading={searchPropertiesQuery.isFetching || isLoading}
              options={propertyOptions}
              searchPlaceholder="Type to search properties..."
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onInputChange={handleSearchInput}
            />
          </div>
          <Button asChild disabled={!selectedOption.value}>
            <Link href={`/my-properties/${selectedOption.value}`}>
              View property
            </Link>
          </Button>
        </div>
      </section>
      <PropertiesTable
        currentLimit={limit}
        isLoading={isLoading}
        meta={meta || initialPaginatedPropertiesData.meta}
        refetch={refetchProperties}
        properties={
          properties && properties.length > 0
            ? (properties as unknown as Property[])
            : (initialPaginatedPropertiesData.data as unknown as Property[])
        }
        onLimitChange={handleLimitChange}
        onPageChange={handlePageChange}
      />
    </section>
  )
}

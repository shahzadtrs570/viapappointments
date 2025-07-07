"use client"

import { Autocomplete } from "@package/ui/autocomplete"
import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"
import Link from "next/link"

// import type { PaginatedProperties } from "../../_types"

import type { PaginatedPropertiesResponse } from "../../_types"

import { useSearchProperties } from "../../_hooks/useSearchProperties"
import { PropertiesTable } from "../PropertiesTable/PropertiesTable"

type PropertiesContentProps = {
  initialPaginatedPropertiesData: PaginatedPropertiesResponse
}

export function PropertiesContent({
  initialPaginatedPropertiesData,
}: PropertiesContentProps) {
  const {
    selectedOption,
    setSelectedOption,
    setInputValue,
    debouncedChangeHandler,
    propertyOptions,
    searchPropertiesQuery,
  } = useSearchProperties()

  return (
    <section className="flex flex-col gap-8">
      <Typography variant="h1">Property Management</Typography>
      <section className="flex flex-col gap-2">
        <Typography className="text-muted-foreground" variant="small">
          Search by address, city, property type, bedrooms, bathrooms, area,
          condition, or value
        </Typography>
        <div className="flex items-center gap-2">
          <div className="flex w-full max-w-xl gap-2">
            {/* <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /> */}
            <Autocomplete
              emptyCommandMessage="No properties found. Try different search terms or add a new property."
              inputPlaceholder="Search properties by any field..."
              isLoading={searchPropertiesQuery.isFetching}
              options={propertyOptions}
              searchPlaceholder="Type to search properties..."
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onInputChange={async (searchQuery) => {
                setInputValue(searchQuery)
                if (searchQuery.length > 0) {
                  await debouncedChangeHandler()
                }
              }}
            />
          </div>
          <Button asChild disabled={!selectedOption.value}>
            <Link href={`/admin/properties/${selectedOption.value}`}>
              View property
            </Link>
          </Button>
        </div>
      </section>
      <PropertiesTable
        initialPaginatedPropertiesData={initialPaginatedPropertiesData}
      />
    </section>
  )
}

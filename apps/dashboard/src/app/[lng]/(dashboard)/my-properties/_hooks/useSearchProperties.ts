/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useCallback, useEffect, useMemo, useState } from "react"

import _ from "lodash"

import type { Option } from "@package/ui/autocomplete"

import { api } from "@/lib/trpc/react"

export function useSearchProperties(paginatedPropertiesData: {
  data: any[]
  meta: { totalCount: number; page: number; limit: number; pageCount: number }
}) {
  const [selectedOption, setSelectedOption] = useState<Option>({
    label: "",
    value: "",
  })
  const [inputValue, setInputValue] = useState<string>("")
  const [searchResults, setSearchResults] = useState<any[]>(
    paginatedPropertiesData.data || []
  )

  // Get properties for search functionality without pagination limits
  const searchQuery = api.property.myProperties.list.useQuery(
    {
      page: 1,
      limit: 100, // Get a larger number for autocomplete search
      search: inputValue.length > 2 ? inputValue : undefined,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: inputValue.length > 2, // Only fetch when search term is meaningful
    }
  )

  // Local search function to filter properties based on input
  const filterProperties = useCallback(
    (properties: any[], searchTerm: string) => {
      if (!searchTerm || searchTerm.trim() === "") return properties

      const normalizedSearch = searchTerm.toLowerCase().trim()

      return properties.filter((property) => {
        // Format property for searching
        const title = property.title?.toLowerCase() || ""
        const propertyType = property.propertyType?.toLowerCase() || ""
        const formattedAddress = property.formattedAddress?.toLowerCase() || ""
        const postcode = property.postcode?.toLowerCase() || ""
        const price = property.price?.toString() || ""
        const estimatedValue = property.estimatedValue?.toString() || ""
        const bedroomCount = property.bedroomCount?.toString() || ""
        const bathroomCount = property.bathroomCount?.toString() || ""
        const totalAreaSqM = property.totalAreaSqM?.toString() || ""
        const condition = property.condition?.toLowerCase() || ""

        // If address is an object, extract searchable fields
        let addressString = ""
        if (property.address && typeof property.address === "object") {
          const address = property.address
          const addressParts = [
            address.streetLine1,
            address.streetLine2,
            address.city,
            address.state,
            address.postalCode,
            address.country,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
          addressString = addressParts
        } else if (typeof property.address === "string") {
          addressString = property.address.toLowerCase()
        }

        // Check if any field contains the search term
        return (
          title.includes(normalizedSearch) ||
          propertyType.includes(normalizedSearch) ||
          formattedAddress.includes(normalizedSearch) ||
          postcode.includes(normalizedSearch) ||
          price.includes(normalizedSearch) ||
          estimatedValue.includes(normalizedSearch) ||
          bedroomCount.includes(normalizedSearch) ||
          bathroomCount.includes(normalizedSearch) ||
          totalAreaSqM.includes(normalizedSearch) ||
          condition.includes(normalizedSearch) ||
          addressString.includes(normalizedSearch)
        )
      })
    },
    []
  )

  // Update search results when input changes
  useEffect(() => {
    const term = inputValue.trim()
    if (term.length > 0) {
      if (searchQuery.data?.data && searchQuery.data.data.length > 0) {
        // Use search results from API if available
        setSearchResults(searchQuery.data.data as any[])
      } else {
        // Otherwise use client-side filtering as fallback
        const filteredResults = filterProperties(
          paginatedPropertiesData.data,
          term
        )
        setSearchResults(filteredResults)
      }
    } else {
      setSearchResults(paginatedPropertiesData.data)
    }
  }, [
    inputValue,
    paginatedPropertiesData.data,
    searchQuery.data,
    filterProperties,
  ])

  // Generate options for autocomplete dropdown
  const propertyOptions = useMemo(() => {
    const properties = searchResults || paginatedPropertiesData.data || []

    return properties.map((property: any) => {
      // Create meaningful labels for better search results
      const propertyType = property.propertyType
        ? property.propertyType.charAt(0).toUpperCase() +
          property.propertyType.slice(1).toLowerCase()
        : "Property"

      const bedBath = `${property.bedroomCount || 0} bed, ${property.bathroomCount || 0} bath`
      const area = `${(property.totalAreaSqM || 0).toFixed(2)} m²`

      // Format price
      const price = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(property.price || property.estimatedValue || 0)

      return {
        value: property.id,
        label: property.address.streetLine1,
        description: `${propertyType} · ${bedBath} · ${area} · ${price}`,
      }
    })
  }, [searchResults, paginatedPropertiesData.data])

  // Avoid calling refetch too frequently
  const debouncedChangeHandler = useMemo(
    () => _.debounce(searchQuery.refetch, 400),
    [searchQuery.refetch]
  )

  useEffect(
    () => () => {
      debouncedChangeHandler.cancel()
    },
    [debouncedChangeHandler]
  )

  return {
    propertyOptions,
    setInputValue,
    debouncedChangeHandler,
    searchPropertiesQuery: searchQuery,
    selectedOption,
    setSelectedOption,
  }
}

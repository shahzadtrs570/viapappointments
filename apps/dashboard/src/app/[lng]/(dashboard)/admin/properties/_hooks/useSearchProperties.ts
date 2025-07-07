import { useEffect, useMemo, useState } from "react"

import _ from "lodash"

import type { PropertyCondition, PropertyType } from "@package/db"
import type { Option } from "@package/ui/autocomplete"

import { api } from "@/lib/trpc/react"

// Define a more comprehensive property type to match the search results
type SearchProperty = {
  id: string
  propertyType: PropertyType
  bedroomCount: number
  bathroomCount: number
  totalAreaSqM: number
  condition: PropertyCondition
  estimatedValue: number
  address?: {
    streetLine1: string
    streetLine2?: string | null
    city: string
    state?: string | null
    postalCode: string
    country: string
  } | null
}

export function useSearchProperties() {
  const [selectedOption, setSelectedOption] = useState<Option>({
    label: "",
    value: "",
  })
  const [inputValue, setInputValue] = useState<string>("")

  const searchPropertiesQuery = api.admin.properties.searchProperties.useQuery(
    { query: inputValue },
    { enabled: false, initialData: [] }
  )

  const propertyOptions = useMemo(
    () =>
      searchPropertiesQuery.data.map((property: SearchProperty) => {
        // Create a meaningful label that includes multiple properties for better search results
        const propertyType =
          property.propertyType.charAt(0) +
          property.propertyType.slice(1).toLowerCase()
        const bedBath = `${property.bedroomCount} bed, ${property.bathroomCount} bath`
        const area = `${property.totalAreaSqM.toFixed(2)} m²`

        let addressText = `Property ${property.id.slice(0, 8)}`

        if (property.address) {
          const { streetLine1, streetLine2, city, state, postalCode, country } =
            property.address
          const addressParts = [streetLine1]

          if (streetLine2) addressParts.push(streetLine2)

          const locationParts = []
          if (city) locationParts.push(city)
          if (state) locationParts.push(state)
          if (postalCode) locationParts.push(postalCode)

          addressText = `${addressParts.join(", ")}, ${locationParts.join(", ")}, ${country || ""}`
        }

        const price = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(property.estimatedValue)

        return {
          value: property.id,
          label: addressText,
          description: `${propertyType} · ${bedBath} · ${area} · ${price}`,
        }
      }),
    [searchPropertiesQuery.data]
  )

  const debouncedChangeHandler = useMemo(
    () => _.debounce(searchPropertiesQuery.refetch, 400),
    [searchPropertiesQuery.refetch]
  )

  useEffect(
    () => () => {
      debouncedChangeHandler.cancel()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return {
    propertyOptions,
    setInputValue,
    debouncedChangeHandler,
    searchPropertiesQuery,
    selectedOption,
    setSelectedOption,
  }
}

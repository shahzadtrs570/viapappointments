"use client"

import type { ChangeEvent } from "react"
import { useEffect, useRef, useState } from "react"

import { Input } from "@package/ui/input"
import _ from "lodash"
import { Search } from "lucide-react"
import { useTranslation } from "react-i18next"

interface PropertySearchBarProps {
  onSearch: (value: string) => void
  initialValue: string
  isDisabled?: boolean
}

export function PropertySearchBar({
  onSearch,
  initialValue = "",
  isDisabled = false,
}: PropertySearchBarProps) {
  const { t } = useTranslation(["my_properties", "common"])
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const initialRender = useRef(true)

  // Create a debounced search function
  const debouncedSearch = useRef(
    _.debounce((value: string) => {
      onSearch(value)
    }, 500)
  ).current

  // Handle input change
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setSearchTerm(value)
    debouncedSearch(value)
  }

  // Set initial value on mount
  useEffect(() => {
    if (initialRender.current) {
      setSearchTerm(initialValue)
      initialRender.current = false
    }
  }, [initialValue])

  // Clean up debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input
        className="pl-8"
        disabled={isDisabled}
        placeholder={t("search_properties", { ns: "my_properties" })}
        type="search"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  )
}

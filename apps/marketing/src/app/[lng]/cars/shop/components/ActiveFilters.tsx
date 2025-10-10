"use client"

import { X } from "lucide-react"

interface ActiveFiltersProps {
  filters: {
    make: string
    bodyStyle: string
    priceRange: [number, number]
    yearRange: [number, number]
    fuelType: string
    carType: "used" | "new"
    search: string
    sortBy: string
    // Additional filters
    exteriorColor?: string[]
    interiorColor?: string[]
    drivetrain?: string[]
    transmission?: string[]
    engine?: string[]
    features?: string[]
    numberOfSeats?: string[]
    numberOfDoors?: string[]
    dealRating?: string[]
    safetyRating?: string[]
    dealerRating?: string[]
    sellerType?: string[]
    mileageRange?: [number, number]
    gasMileageRange?: [number, number]
    daysOnMarketRange?: [number, number]
    hideWithoutPhotos?: boolean
    hideWithAccidents?: boolean
    hideWithFrameDamage?: boolean
    hideWithTheftHistory?: boolean
    hideFleet?: boolean
    hideWithLemonHistory?: boolean
    hideWithSalvageHistory?: boolean
    singleOwner?: boolean
    priceDrops?: boolean
    onlineFinancing?: boolean
  }
  onFilterChange: (filters: any) => void
  onClearAll: () => void
  filterOptions?: {
    makes: Array<{ value: string; count: number }>
    bodyStyles: Array<{ value: string; count: number }>
    fuelTypes: Array<{ value: string; count: number }>
    priceRange: { min: number; max: number }
    yearRange: { min: number; max: number }
  }
  filtersRef?: React.MutableRefObject<any>
}

export default function ActiveFilters({
  filters,
  onFilterChange,
  onClearAll,
  filterOptions,
  filtersRef,
}: ActiveFiltersProps) {
  const getActiveFilters = () => {
    const activeFilters: Array<{
      key: string
      label: string
      value: string
      onRemove: () => void
    }> = []

    // Make filter
    if (filters.make) {
      activeFilters.push({
        key: "make",
        label: "Make",
        value: filters.make,
        onRemove: () => {
          const currentFilters = filtersRef?.current || filters
          console.log("Removing make filter, current filters:", currentFilters)
          const updatedFilters = { ...currentFilters, make: "" }
          console.log("Updated filters after removing make:", updatedFilters)
          onFilterChange(updatedFilters)
        },
      })
    }

    // Model filter - MISSING FROM ACTIVE FILTERS
    if (filters.model) {
      activeFilters.push({
        key: "model",
        label: "Model",
        value: filters.model,
        onRemove: () => {
          const currentFilters = filtersRef?.current || filters
          console.log("Removing model filter, current filters:", currentFilters)
          const updatedFilters = { ...currentFilters, model: "" }
          console.log("Updated filters after removing model:", updatedFilters)
          onFilterChange(updatedFilters)
        },
      })
    }

    // Trim filter - MISSING FROM ACTIVE FILTERS
    if (filters.trim) {
      activeFilters.push({
        key: "trim",
        label: "Trim",
        value: filters.trim,
        onRemove: () => {
          const currentFilters = filtersRef?.current || filters
          console.log("Removing trim filter, current filters:", currentFilters)
          const updatedFilters = { ...currentFilters, trim: "" }
          console.log("Updated filters after removing trim:", updatedFilters)
          onFilterChange(updatedFilters)
        },
      })
    }

    // Condition filter (only show when manually selected)
    if (filters.condition && filters.condition !== "") {
      activeFilters.push({
        key: "condition",
        label: "Condition",
        value: filters.condition,
        onRemove: () => {
          const currentFilters = filtersRef?.current || filters
          console.log("Removing condition filter, current filters:", currentFilters)
          const updatedFilters = { ...currentFilters, condition: "" }
          console.log("Updated filters after removing condition:", updatedFilters)
          onFilterChange(updatedFilters)
        },
      })
    }

    // Status filter (only show when manually selected)
    if (filters.status && filters.status !== "") {
      activeFilters.push({
        key: "status",
        label: "Status",
        value: filters.status,
        onRemove: () => {
          const currentFilters = filtersRef?.current || filters
          console.log("Removing status filter, current filters:", currentFilters)
          const updatedFilters = { ...currentFilters, status: "" }
          console.log("Updated filters after removing status:", updatedFilters)
          onFilterChange(updatedFilters)
        },
      })
    }

    // Body Style filter
    if (filters.bodyStyle) {
      activeFilters.push({
        key: "bodyStyle",
        label: "Body Style",
        value: filters.bodyStyle,
        onRemove: () => onFilterChange({ ...filters, bodyStyle: "" }),
      })
    }

    // Price Range filter - Use empty defaults (no restrictions)
    const defaultPriceRange = {
      min: 0,
      max: 999999,
    }
    if (
      filters.priceRange[0] !== defaultPriceRange.min ||
      filters.priceRange[1] !== defaultPriceRange.max
    ) {
      activeFilters.push({
        key: "priceRange",
        label: "Price",
        value: `$${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`,
        onRemove: () =>
          onFilterChange({
            ...filters,
            priceRange: [defaultPriceRange.min, defaultPriceRange.max],
          }),
      })
    }

    // Year Range filter - Use empty defaults (no restrictions)
    const defaultYearRange = {
      min: 0,
      max: 9999,
    }
    if (
      filters.yearRange[0] !== defaultYearRange.min ||
      filters.yearRange[1] !== defaultYearRange.max
    ) {
      activeFilters.push({
        key: "yearRange",
        label: "Year",
        value: `${filters.yearRange[0]} - ${filters.yearRange[1]}`,
        onRemove: () =>
          onFilterChange({
            ...filters,
            yearRange: [defaultYearRange.min, defaultYearRange.max],
          }),
      })
    }

    // Fuel Type filter
    if (filters.fuelType) {
      activeFilters.push({
        key: "fuelType",
        label: "Fuel Type",
        value: filters.fuelType,
        onRemove: () => onFilterChange({ ...filters, fuelType: "" }),
      })
    }

    // Search filter
    if (filters.search) {
      activeFilters.push({
        key: "search",
        label: "Search",
        value: filters.search,
        onRemove: () => onFilterChange({ ...filters, search: "" }),
      })
    }

    // Additional filters
    if (filters.exteriorColor && filters.exteriorColor.length > 0) {
      activeFilters.push({
        key: "exteriorColor",
        label: "Exterior Color",
        value: filters.exteriorColor.join(", "),
        onRemove: () => onFilterChange({ ...filters, exteriorColor: [] }),
      })
    }

    if (filters.interiorColor && filters.interiorColor.length > 0) {
      activeFilters.push({
        key: "interiorColor",
        label: "Interior Color",
        value: filters.interiorColor.join(", "),
        onRemove: () => onFilterChange({ ...filters, interiorColor: [] }),
      })
    }

    if (filters.drivetrain && filters.drivetrain.length > 0) {
      activeFilters.push({
        key: "drivetrain",
        label: "Drivetrain",
        value: filters.drivetrain.join(", "),
        onRemove: () => onFilterChange({ ...filters, drivetrain: [] }),
      })
    }

    if (filters.transmission && filters.transmission.length > 0) {
      activeFilters.push({
        key: "transmission",
        label: "Transmission",
        value: filters.transmission.join(", "),
        onRemove: () => onFilterChange({ ...filters, transmission: [] }),
      })
    }

    // Features filter - HAS BACKEND IMPLEMENTATION
    if (filters.features && filters.features.length > 0) {
      activeFilters.push({
        key: "features",
        label: "Features",
        value: filters.features.join(", "),
        onRemove: () => {
          const currentFilters = filtersRef?.current || filters
          const updatedFilters = { ...currentFilters, features: [] }
          onFilterChange(updatedFilters)
        },
      })
    }

    // Note: Removed filters without backend implementation:
    // - engine (no backend filtering)
    // - numberOfSeats (no backend filtering)  
    // - numberOfDoors (no backend filtering)
    // - dealRating (no backend filtering)
    // - safetyRating (no backend filtering)
    // - dealerRating (no backend filtering)
    // - sellerType (no backend filtering)

    // Mileage Range filter - Use empty defaults (no restrictions)
    const defaultMileageRange = {
      min: 0,
      max: 999999,
    }
    if (
      filters.mileageRange &&
      (filters.mileageRange[0] !== defaultMileageRange.min || 
       filters.mileageRange[1] !== defaultMileageRange.max)
    ) {
      activeFilters.push({
        key: "mileageRange",
        label: "Mileage",
        value: `${filters.mileageRange[0].toLocaleString()} - ${filters.mileageRange[1].toLocaleString()} miles`,
        onRemove: () =>
          onFilterChange({ ...filters, mileageRange: [defaultMileageRange.min, defaultMileageRange.max] }),
      })
    }

    // Gas Mileage Range filter
    if (
      filters.gasMileageRange &&
      (filters.gasMileageRange[0] > 13 || filters.gasMileageRange[1] < 143)
    ) {
      activeFilters.push({
        key: "gasMileageRange",
        label: "Gas Mileage",
        value: `${filters.gasMileageRange[0]} - ${filters.gasMileageRange[1]} MPG`,
        onRemove: () =>
          onFilterChange({ ...filters, gasMileageRange: [13, 143] }),
      })
    }

    // Days on Market Range filter
    if (
      filters.daysOnMarketRange &&
      (filters.daysOnMarketRange[0] > 1 || filters.daysOnMarketRange[1] < 1000)
    ) {
      activeFilters.push({
        key: "daysOnMarketRange",
        label: "Days on Market",
        value: `${filters.daysOnMarketRange[0]} - ${filters.daysOnMarketRange[1]} days`,
        onRemove: () =>
          onFilterChange({ ...filters, daysOnMarketRange: [1, 1000] }),
      })
    }

    // Quality filters - Always show when enabled (these are our quality standards)
    if (filters.hideWithoutPhotos) {
      activeFilters.push({
        key: "hideWithoutPhotos",
        label: "Quality: Photos Required",
        value: "✓",
        onRemove: () =>
          onFilterChange({ ...filters, hideWithoutPhotos: false }),
      })
    }

    if (filters.hideWithAccidents) {
      activeFilters.push({
        key: "hideWithAccidents",
        label: "Quality: No Accidents",
        value: "✓",
        onRemove: () =>
          onFilterChange({ ...filters, hideWithAccidents: false }),
      })
    }

    if (filters.hideWithFrameDamage) {
      activeFilters.push({
        key: "hideWithFrameDamage",
        label: "Quality: No Frame Damage",
        value: "✓",
        onRemove: () =>
          onFilterChange({ ...filters, hideWithFrameDamage: false }),
      })
    }

    if (filters.hideWithTheftHistory) {
      activeFilters.push({
        key: "hideWithTheftHistory",
        label: "Quality: No Theft History",
        value: "✓",
        onRemove: () =>
          onFilterChange({ ...filters, hideWithTheftHistory: false }),
      })
    }

    if (filters.hideFleet) {
      activeFilters.push({
        key: "hideFleet",
        label: "Hide fleet vehicles",
        value: "Yes",
        onRemove: () => onFilterChange({ ...filters, hideFleet: false }),
      })
    }

    if (filters.hideWithLemonHistory) {
      activeFilters.push({
        key: "hideWithLemonHistory",
        label: "Quality: No Lemon History",
        value: "✓",
        onRemove: () =>
          onFilterChange({ ...filters, hideWithLemonHistory: false }),
      })
    }

    if (filters.hideWithSalvageHistory) {
      activeFilters.push({
        key: "hideWithSalvageHistory",
        label: "Quality: No Salvage History",
        value: "✓",
        onRemove: () =>
          onFilterChange({ ...filters, hideWithSalvageHistory: false }),
      })
    }

    if (filters.singleOwner) {
      activeFilters.push({
        key: "singleOwner",
        label: "Single owner",
        value: "Yes",
        onRemove: () => onFilterChange({ ...filters, singleOwner: false }),
      })
    }

    if (filters.priceDrops) {
      activeFilters.push({
        key: "priceDrops",
        label: "Price drops",
        value: "Yes",
        onRemove: () => onFilterChange({ ...filters, priceDrops: false }),
      })
    }

    if (filters.onlineFinancing) {
      activeFilters.push({
        key: "onlineFinancing",
        label: "Online financing",
        value: "Yes",
        onRemove: () => onFilterChange({ ...filters, onlineFinancing: false }),
      })
    }

    return activeFilters
  }

  const activeFilters = getActiveFilters()

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Active Filters ({activeFilters.length})
        </h3>
        <button
          onClick={onClearAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <div
            key={filter.key}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 text-sm"
          >
            <span className="text-blue-800 font-medium">
              {filter.label}: {filter.value}
            </span>
            <button
              onClick={filter.onRemove}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

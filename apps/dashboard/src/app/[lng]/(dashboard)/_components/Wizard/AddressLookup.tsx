/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"

import { AddressFinder } from "@ideal-postcodes/address-finder"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { useDispatch, useSelector } from "react-redux"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface Address {
  line_1: string
  line_2?: string
  line_3?: string
  post_town?: string
  postcode?: string
  postcode_outward?: string
  country?: string
  county?: string
  uprn?: string
  organisation_name?: string
  [key: string]: any
}

interface AddressLookupProps {
  apiKey?: string
  onAddressSelected?: (address: Address) => void
  className?: string
  setAddress?: (address: string) => void
  onGoButtonClick?: () => void
  readOnly?: boolean
  onRightmoveData?: (data: any) => void
}

// Helper function to clean up AddressFinder
const cleanupAddressFinder = () => {
  try {
    // Check if AddressFinder has a cleanup method
    if (AddressFinder.controllers && AddressFinder.controllers.length) {
      // Clear all controllers
      AddressFinder.controllers = []
    }
  } catch (error) {
    console.error("Error cleaning up AddressFinder:", error)
  }
}

// Add CSS for dropdown styling
const addDropdownStyles = () => {
  // Check if the styles are already added to avoid duplicates
  if (!document.getElementById("ideal-postcodes-styles")) {
    const style = document.createElement("style")
    style.id = "ideal-postcodes-styles"
    style.innerHTML = `
      .idpc_ul {
        background-color: white;
        border: 1px solid hsl(var(--border));
        border-radius: 0.375rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        max-height: 300px;
        overflow-y: auto;
        width: 100%;
        z-index: 50;
        margin-top: 4px;
      }
      .idpc_ul li {
        padding: 8px 12px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .idpc_ul li:hover, .idpc_ul li.idpc_selected {
        background-color: hsl(var(--primary) / 0.1);
        color: hsl(var(--primary));
      }
      .address-loading-indicator {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        border: 2px solid hsl(var(--primary) / 0.3);
        border-top-color: hsl(var(--primary));
        border-radius: 50%;
        animation: address-spinner 0.8s linear infinite;
      }
      @keyframes address-spinner {
        to {
          transform: translateY(-50%) rotate(360deg);
        }
      }
    `
    document.head.appendChild(style)
  }
}

// TODO: MOVE KEY TO ENV VARS

export default function AddressLookup({
  apiKey = process.env.NEXT_PUBLIC_IDEAL_POSTCODES_LOOKUP_KEY || "",
  onAddressSelected,
  className = "",
  setAddress,
  onGoButtonClick,
  readOnly = false,
  onRightmoveData,
}: AddressLookupProps) {
  const { t } = useClientTranslation(["wizard_address_lookup"])

  const dispatch = useDispatch()
  const formData = useSelector((state: any) => state.wizard)

  const [addressSearch, setAddressSearch] = useState("")
  const [completeAddress, setCompleteAddress] = useState<Address | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAddressFinderInitialized, setIsAddressFinderInitialized] =
    useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isRightmoveLoading, setIsRightmoveLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const shouldRender = useRef(true)

  useEffect(() => {
    if (!addressSearch) {
      setIsSearching(false)
    }
  }, [addressSearch])

  // Log when the component mounts/unmounts
  useEffect(() => {
    // Add custom styles for dropdown
    addDropdownStyles()

    return () => {
      cleanupAddressFinder()
    }
  }, [])

  useEffect(() => {
    if (!shouldRender.current) {
      return
    }

    if (!inputRef.current) {
      return
    }

    if (!apiKey) {
      console.error(
        "Skipping AddressFinder initialization: No API key provided"
      )
      setError(t("wizard_address_lookup:errors.serviceUnavailable"))
      return
    }

    shouldRender.current = false

    cleanupAddressFinder()

    try {
      AddressFinder.setup({
        inputField: inputRef.current,
        apiKey,
        detectCountry: false,
        defaultCountry: "GBR",
        restrictCountries: ["GBR"],
        // @ts-ignore - Property not in type definition but exists in library
        minChars: 1, // Start searching from the first character
        autocomplete: "off", // Disable browser autocomplete
        queryOptions: {
          country: "England",
          excludeFields: "false",
          outputFields: [
            "line_1",
            "line_2",
            "line_3",
            "post_town",
            "postcode",
            "postcode_inward",
            "postcode_outward",
            "county",
            "traditional_county",
            "administrative_county",
            "postal_county",
            "country",
            "uprn",
            "dependant_locality",
            "thoroughfare",
            "building_number",
            "building_name",
            "sub_building_name",
            "organisation_name",
            "department_name",
            "premise",
            "longitude",
            "latitude",
            "eastings",
            "northings",
            "district",
            "ward",
            "udprn",
            "umprn",
          ].join(","),
        },
        onLoaded: () => {
          setIsAddressFinderInitialized(true)
        },
        onAddressRetrieved: (address: any) => {
          setIsSearching(false)

          // Format the complete address string
          const { line_1, line_2, line_3, post_town, postcode } = address
          const formattedAddress = [line_1, line_2, line_3, post_town, postcode]
            .filter(Boolean)
            .join(", ")

          // Just store the address data locally
          setAddressSearch(formattedAddress)
          setCompleteAddress(address)
        },
        onInput: () => {
          // When user types, make sure we respond to input
          if (inputRef.current) {
            // Update addressSearch from the input value to ensure it's synced
            setAddressSearch(inputRef.current.value)

            if (inputRef.current.value.length > 0) {
              setIsSearching(true)
            } else {
              setIsSearching(false)
            }
          }
        },
        onSuggestionsRetrieved: () => {
          // When suggestions start loading
          setIsSearching(true)
        },
        onFailedCheck: (error: any) => {
          console.error("Address lookup failed:", error)
          setIsSearching(false)
          setError(t("wizard_address_lookup:errors.serviceUnavailable"))
        },
        onSearchError: (error: any) => {
          console.error("Address search error:", error)
          setIsSearching(false)
          setError(t("wizard_address_lookup:errors.searchError"))
        },
        inputStyle: {
          background: "inherit",
          border: "inherit",
          color: "inherit",
          width: "100%",
        },
      })

      setIsAddressFinderInitialized(true)
    } catch (error) {
      console.error("Error setting up AddressFinder:", error)
      setError(t("wizard_address_lookup:errors.initializationError"))
    }

    return () => {
      cleanupAddressFinder()
    }
  }, [apiKey, dispatch, onAddressSelected, setAddress])

  // Ensure the input field value is always synchronized with the React state
  useEffect(() => {
    if (inputRef.current && addressSearch !== inputRef.current.value) {
      inputRef.current.value = addressSearch
    }
  }, [addressSearch])

  // Add function to fetch Rightmove data
  const fetchRightmoveData = async (address: Address) => {
    if (!address.line_1 || !address.postcode) return

    setIsRightmoveLoading(true)
    try {
      const response = await fetch("/api/propertyData/rightmove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          houseIdentifier: address.line_1,
          postcode: address.postcode,
          postcode_inward: address.postcode?.split(" ")[1] || "",
          postcode_outward: address.postcode?.split(" ")[0] || "",
          post_town: address.post_town || "",
          dependant_locality: address.dependant_locality || "",
          thoroughfare: address.thoroughfare || address.line_1 || "",
          dependant_thoroughfare: address.dependant_thoroughfare || "",
          building_number: address.building_number || "",
          building_name: address.building_name || "",
          sub_building_name: address.sub_building_name || "",
          po_box: address.po_box || "",
          department_name: address.department_name || "",
          organisation_name: address.organisation_name || "",
          county: address.county || "",
          country: address.country || "GBR",
          uprn: address.uprn || "",
          longitude: address.longitude || "",
          latitude: address.latitude || "",
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        // Pass null to indicate error
        if (onRightmoveData) {
          onRightmoveData(null)
        }
        throw new Error(data.details || "Failed to fetch Rightmove data")
      }

      if (onRightmoveData) {
        onRightmoveData(data)
      }
    } catch (error) {
      console.error("Error fetching Rightmove data:", error)
      // Pass null to indicate error
      if (onRightmoveData) {
        onRightmoveData(null)
      }
    } finally {
      setIsRightmoveLoading(false)
    }
  }

  // Modify handleGoButtonClick to include Rightmove fetch
  const handleGoButtonClick = async () => {
    if (!addressSearch.trim()) return

    // If we have complete address data, use it
    if (completeAddress) {
      if (onAddressSelected) {
        onAddressSelected(completeAddress)
      }
      // Fetch Rightmove data
      await fetchRightmoveData(completeAddress)
    }
    // Otherwise just use the text input
    else if (setAddress) {
      setAddress(addressSearch)
    }

    // Finally trigger the mode switch
    if (onGoButtonClick) {
      onGoButtonClick()
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <label
        className="mb-2 block text-sm font-medium text-card-foreground"
        htmlFor="property-address"
      >
        {t("wizard_address_lookup:title")}
      </label>
      <div className="flex w-full gap-2">
        <div className="relative grow">
          <Input
            ref={inputRef}
            id="property-address"
            placeholder={t("wizard_address_lookup:placeholder")}
            readOnly={readOnly}
            style={{ minHeight: "40px", padding: "0.5rem 0.75rem" }}
            type="text"
            value={addressSearch}
            className={`w-full border-border bg-card/50 shadow-sm transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 ${
              readOnly
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : ""
            }`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              // Directly update addressSearch with the exact current value
              setAddressSearch(e.target.value)

              // Immediately set isSearching state based on input
              if (!e.target.value) {
                setIsSearching(false)
              } else {
                setIsSearching(true)
              }

              // Manually update the input field directly to ensure the value is preserved
              if (inputRef.current) {
                inputRef.current.value = e.target.value
              }
            }}
          />
          {isSearching && (
            <div aria-hidden="true" className="address-loading-indicator" />
          )}
          {/* This empty div ensures dropdown positioning works properly */}
          <div className="absolute inset-x-0 top-full z-50" />
        </div>
        <Button
          className="w-[80px] bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
          type="button"
          disabled={
            !addressSearch.trim() ||
            isSearching ||
            readOnly ||
            isRightmoveLoading
          }
          onClick={handleGoButtonClick}
        >
          {isRightmoveLoading ? (
            <div className="flex items-center gap-2">
              <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Go
            </div>
          ) : (
            "Go"
          )}
        </Button>
      </div>
      {isAddressFinderInitialized ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {t("wizard_address_lookup:helperText.initialized")}
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          {t("wizard_address_lookup:helperText.notInitialized")}
        </p>
      )}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {!formData?.address && !addressSearch.trim() && (
        <p className="mt-2 text-sm text-destructive">
          {t("wizard_address_lookup:errors.required")}
        </p>
      )}
    </div>
  )
}

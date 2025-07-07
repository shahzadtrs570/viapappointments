/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  no-nested-ternary */
/* eslint-disable  react/no-unescaped-entities */
/* eslint-disable  max-lines */
/* eslint-disable  react/jsx-max-depth */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-floating-promises */

"use client"

import { useCallback, useEffect, useState } from "react"

import { Button } from "@package/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"
import { Input } from "@package/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Textarea } from "@package/ui/textarea"
import { useToast } from "@package/ui/toast"
import { Typography } from "@package/ui/typography"
import {
  ArrowLeft,
  Check,
  Clock,
  Code,
  Copy,
  DollarSign,
  FileText,
  Home,
  LineChart,
  Loader,
  MapPin,
  SendHorizontal,
  Users,
} from "lucide-react"
import Link from "next/link"

import type { FullProperty } from "../../_types"

import { api } from "@/lib/trpc/react"

import { OffersTable } from "../OffersTable/OffersTable"
// import { PropertyAttributes } from "../PropertyAttributes/PropertyAttributes"
import { PropertyAttributes } from "../PropertyAttributes/PropertyAttributes"
import { PropertyInfoCard } from "../PropertyInfoCard/PropertyInfoCard"
import { SellerInfoCard } from "../SellerInfoCard/SellerInfoCard"

// Extend FullProperty type to include propertyIdentifiers for this file
interface ExtendedProperty extends FullProperty {
  propertyIdentifiers?: Array<{
    type: string
    value: string
  }>
}

type PropertyDetailContentProps = {
  propertyData: ExtendedProperty
}

// Define Property Data API endpoints with parameters and categories
const PROPERTY_DATA_ENDPOINTS = [
  // Front Office (Customer-facing) endpoints
  {
    id: "address-to-uprn",
    name: "Address to UPRN",
    description: "Convert address to UPRN identifier",
    category: "front-end",
    params: { postcode: "" },
  },
  {
    id: "uprn",
    name: "UPRN Data",
    description: "Property data from UPRN",
    category: "front-end",
    params: { uprn: "" },
  },
  {
    id: "prices",
    name: "Local Prices",
    description: "Property prices in the local area",
    category: "front-end",
    params: { postcode: "", bedrooms: "" },
  },
  {
    id: "valuation-historical",
    name: "Historical Valuation",
    description: "Historical property valuation",
    category: "front-end",
    params: {
      postcode: "",
      current_price: "",
      historic_value_year: "2000",
      historic_value_month: "January",
    },
  },
  {
    id: "land-registry-documents",
    name: "Land Registry Documents",
    description: "Land registry documents for title",
    category: "front-end",
    params: {
      title: "ND66318",
      documents: "both",
      extract_proprietor_data: "true",
    },
  },
  {
    id: "freeholds",
    name: "Freeholds",
    description: "Freehold information for postcode",
    category: "front-end",
    params: { postcode: "", results: "10" },
  },
  {
    id: "property-info",
    name: "Property Info",
    description: "Detailed property information",
    category: "front-end",
    params: { property_id: "" },
  },

  // Back Office endpoints
  {
    id: "valuation-sale",
    name: "Valuation Sale",
    description: "Property valuation for sale",
    category: "back-office",
    params: {
      postcode: "",
      internal_area: "",
      property_type: "",
      construction_date: "pre_1914",
      bedrooms: "",
      bathrooms: "",
      finish_quality: "below_average",
      outdoor_space: "garden",
      off_street_parking: "0",
    },
  },
  {
    id: "flood-risk",
    name: "Flood Risk",
    description: "Flood risk assessment",
    category: "back-office",
    params: { w3w: "pretty.needed.chill" },
  },
  {
    id: "floor-areas",
    name: "Floor Areas",
    description: "Property floor areas",
    category: "back-office",
    params: { postcode: "" },
  },
  {
    id: "growth",
    name: "Property Growth",
    description: "Property value growth",
    category: "back-office",
    params: { postcode: "" },
  },
  {
    id: "planning",
    name: "Planning",
    description: "Planning applications",
    category: "back-office",
    params: {
      postcode: "",
      decision_rating: "positive",
      category: "EXTENSION,LOFT CONVERSION",
      max_age_update: "120",
      results: "20",
    },
  },
  {
    id: "site-plan-documents",
    name: "Site Plan Documents",
    description: "Site plan documents",
    category: "back-office",
    params: { title: "ON176985", scale: "500", paper_format: "A4" },
  },
  {
    id: "aonb",
    name: "AONB Status",
    description: "Area of Outstanding Natural Beauty status",
    category: "back-office",
    params: { postcode: "" },
  },
  {
    id: "area-type",
    name: "Area Type",
    description: "Type of area classification",
    category: "back-office",
    params: { postcode: "" },
  },
  {
    id: "demand",
    name: "Demand Data",
    description: "Property demand in area",
    category: "back-office",
    params: { postcode: "" },
  },
  {
    id: "green-belt",
    name: "Green Belt",
    description: "Green belt status",
    category: "back-office",
    params: { postcode: "" },
  },
]

function PropertyDataTab({ propertyData }: { propertyData: ExtendedProperty }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [endpointData, setEndpointData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const getPostcodeFromProperty = useCallback(() => {
    // Check if we have address data
    if (
      propertyData.address?.addressData &&
      typeof (propertyData.address.addressData as any) === "object"
    ) {
      const addressData = propertyData.address.addressData as any

      // Check lookup data first
      if (addressData.lookup && addressData.lookup.postcode) {
        return addressData.lookup.postcode
      }

      // Then check manual data
      if (addressData.manual && addressData.manual.postcode) {
        return addressData.manual.postcode
      }

      // Legacy format
      if (addressData.postcode) {
        return addressData.postcode
      }
    }

    // Fallback to postalCode from address
    return propertyData.address?.postalCode || ""
  }, [propertyData.address?.addressData, propertyData.address?.postalCode])

  // Get UPRN from property
  const getUprnFromProperty = useCallback(() => {
    try {
      // Try to get data from addressData first
      if (
        propertyData.address?.addressData &&
        typeof (propertyData.address.addressData as any) === "object"
      ) {
        const addressData = propertyData.address.addressData as any

        // Check lookup data first for UPRN
        if (addressData.lookup && addressData.lookup.uprn) {
          return addressData.lookup.uprn
        }

        // Legacy format
        if (addressData.uprn) {
          return addressData.uprn
        }
      }

      // Use type assertion to avoid typescript errors
      const propertyWithIdentifiers = propertyData as any
      if (
        propertyWithIdentifiers.propertyIdentifiers &&
        Array.isArray(propertyWithIdentifiers.propertyIdentifiers)
      ) {
        const uprnIdentifier = propertyWithIdentifiers.propertyIdentifiers.find(
          (id: any) => id && id.type === "UPRN"
        )

        if (uprnIdentifier && uprnIdentifier.value) {
          return uprnIdentifier.value
        }
      }
    } catch (e) {
      console.error("Error getting UPRN from property:", e)
    }

    return "" // Return empty string if no UPRN is found
  }, [propertyData])

  const fetchPropertyData = useCallback(
    async (endpointId: string) => {
      if (!endpointId) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Find the endpoint configuration
        const endpoint = PROPERTY_DATA_ENDPOINTS.find(
          (e) => e.id === endpointId
        )
        if (!endpoint) {
          throw new Error("Invalid endpoint selected")
        }

        // Prepare parameters with a fresh copy
        const params = { ...endpoint.params }

        // Get addressData if available
        let addressData: any = null
        if (
          propertyData.address?.addressData &&
          typeof (propertyData.address.addressData as any) === "object"
        ) {
          addressData = propertyData.address.addressData as any
        }

        // Helper function to get property data, checking lookup first, then manual
        const getAddressValue = (key: string, fallback: string = "") => {
          if (addressData) {
            // Check lookup data first
            if (addressData.lookup && addressData.lookup[key] !== undefined) {
              return addressData.lookup[key]
            }

            // Then check manual data
            if (addressData.manual && addressData.manual[key] !== undefined) {
              return addressData.manual[key]
            }

            // Legacy format
            if (addressData[key] !== undefined) {
              return addressData[key]
            }
          }
          return fallback
        }

        // Replace with property data if available, prioritizing addressData
        if ("postcode" in params) {
          // Ensure postcode parameter is never empty
          params.postcode = getAddressValue(
            "postcode",
            getPostcodeFromProperty() || "SW1A 1AA"
          )
        }

        if ("uprn" in params && params.uprn === "") {
          params.uprn = getAddressValue("uprn", getUprnFromProperty())
        }

        if ("udprn" in params && params.udprn === "") {
          params.udprn = getAddressValue("udprn", "")
        }

        // Use addressData fields when available, fallback to property data
        if ("bedrooms" in params) {
          // Ensure bedrooms parameter is never empty
          params.bedrooms = getAddressValue(
            "bedrooms",
            String(propertyData.bedroomCount) || "2"
          )
        }

        if ("bathrooms" in params) {
          // Ensure bathrooms parameter is never empty
          params.bathrooms = getAddressValue(
            "bathrooms",
            String(propertyData.bathroomCount) || "1"
          )
        }

        if ("internal_area" in params) {
          // Ensure internal_area parameter is never empty
          params.internal_area = getAddressValue(
            "property_size",
            propertyData.totalAreaSqM
              ? String(Math.round(propertyData.totalAreaSqM))
              : "100"
          )
        }

        if ("property_type" in params) {
          const manualPropertyType = addressData?.manual?.propertyType || ""
          // Ensure property_type parameter is never empty
          let propertyTypeValue = getAddressValue("property_type", "")

          if (!propertyTypeValue && manualPropertyType) {
            propertyTypeValue = manualPropertyType
          } else if (!propertyTypeValue) {
            // Convert HOUSE to house, APARTMENT to flat, etc.
            let type = propertyData.propertyType.toLowerCase()
            if (type === "apartment") type = "flat"
            propertyTypeValue = type || "house" // Default to house if no value available
          }

          params.property_type = propertyTypeValue
        }

        if ("current_price" in params && params.current_price === "") {
          params.current_price = getAddressValue(
            "estimated_value",
            String(Math.round(propertyData.estimatedValue))
          )
        }

        if ("property_id" in params && params.property_id === "") {
          params.property_id = getAddressValue("id", propertyData.id)
        }

        // Additional parameters that might be in addressData
        if ("latitude" in params && params.latitude === "") {
          params.latitude = getAddressValue("latitude", "")
        }

        if ("longitude" in params && params.longitude === "") {
          params.longitude = getAddressValue("longitude", "")
        }

        if ("county" in params && params.county === "") {
          params.county = getAddressValue("county", "")
        }

        if ("thoroughfare" in params && params.thoroughfare === "") {
          params.thoroughfare = getAddressValue("thoroughfare", "")
        }

        if ("building_number" in params && params.building_number === "") {
          params.building_number = getAddressValue("building_number", "")
        }

        if ("post_town" in params && params.post_town === "") {
          params.post_town = getAddressValue("post_town", "")
        }

        if ("ward" in params && params.ward === "") {
          params.ward = getAddressValue("ward", "")
        }

        if ("district" in params && params.district === "") {
          params.district = getAddressValue("district", "")
        }

        if ("construction_date" in params && params.construction_date === "") {
          // Get year built from either lookup or manual
          const yearBuilt = getAddressValue(
            "year_built",
            addressData?.manual?.yearBuilt || ""
          )

          // If year_built is available, map it to construction_date categories
          if (yearBuilt) {
            const year = parseInt(yearBuilt)
            if (year < 1914) params.construction_date = "pre_1914"
            else if (year < 1945) params.construction_date = "1914_1945"
            else if (year < 1980) params.construction_date = "1946_1979"
            else if (year < 2000) params.construction_date = "1980_2000"
            else params.construction_date = "2000_present"
          }
        }

        if ("finish_quality" in params && params.finish_quality === "") {
          // Get condition from either lookup or manual
          const condition = getAddressValue(
            "condition",
            propertyData.condition || ""
          ).toLowerCase()

          // Map condition to finish_quality
          if (condition === "excellent") params.finish_quality = "excellent"
          else if (condition === "good") params.finish_quality = "average"
          else if (condition === "fair") params.finish_quality = "below_average"
          else if (condition === "poor" || condition === "needs_renovation")
            params.finish_quality = "poor"
        }

        // Call our API wrapper
        const response = await fetch(
          `/api/webhooks/getDataFromThirdParty?endpoint=${endpointId}${Object.entries(
            params
          )
            .map(
              ([key, value]) => `&${key}=${encodeURIComponent(String(value))}`
            )
            .join("")}&propertyId=${propertyData.id}`
        )

        if (!response.ok) {
          throw new Error(`API returned error: ${response.status}`)
        }

        const data = await response.json()
        setEndpointData(data)

        toast({
          title: "Data Loaded",
          description: `Successfully loaded data for ${
            PROPERTY_DATA_ENDPOINTS.find((e) => e.id === endpointId)?.name ||
            endpointId
          }`,
          duration: 3000,
        })
      } catch (error) {
        console.error(`Error fetching ${endpointId} data:`, error)
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        )
        toast({
          title: "Error",
          description: `Failed to fetch ${endpointId} data. ${error instanceof Error ? error.message : ""}`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [getPostcodeFromProperty, getUprnFromProperty, toast, propertyData.id]
  )

  // Format and display the data - now always showing JSON responses
  const renderEndpointData = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader className="mr-2 size-6 animate-spin" />
          <Typography>Loading property data...</Typography>
        </div>
      )
    }

    if (error) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <Typography className="text-red-800">Error: {error}</Typography>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => fetchPropertyData(selectedEndpoint)}
          >
            Try Again
          </Button>
        </div>
      )
    }

    if (!endpointData) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <Typography>
            Please select a data type from the dropdown and click "Fetch Data"
            to view property information.
          </Typography>
          <Typography className="text-muted-foreground" variant="small">
            Note: API calls to PropertyData.co.uk may incur costs. Each request
            will only be made when explicitly requested.
          </Typography>
        </div>
      )
    }

    // Check if the data has an error status from our API
    if (endpointData.status === "error") {
      return (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <Typography className="text-yellow-800">
            {endpointData.message || "This endpoint returned an error."}
          </Typography>
        </div>
      )
    }

    // Always show the JSON response for any endpoint
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="h4">
            {PROPERTY_DATA_ENDPOINTS.find((e) => e.id === selectedEndpoint)
              ?.name || selectedEndpoint}{" "}
            API Response
          </Typography>
          <Button
            className="flex items-center gap-2"
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(
                JSON.stringify(endpointData, null, 2)
              )
              toast({
                title: "Copied",
                description: "JSON data copied to clipboard",
                duration: 2000,
              })
            }}
          >
            <Copy className="size-4" />
            Copy JSON
          </Button>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <pre className="max-h-[600px] overflow-auto text-xs">
            {JSON.stringify(endpointData, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  // Handle endpoint change
  const handleEndpointChange = (value: string) => {
    setSelectedEndpoint(value)
    // We don't fetch data automatically - just set the selection
    setEndpointData(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Typography variant="h3">Property Data</Typography>
          <Typography className="text-muted-foreground">
            Data from PropertyData.co.uk API
          </Typography>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedEndpoint} onValueChange={handleEndpointChange}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled value="_placeholder">
                <span className="text-muted-foreground">
                  Select an endpoint...
                </span>
              </SelectItem>

              {/* Front-end category */}
              <div className="px-2 py-1.5 text-xs font-medium text-primary">
                Front End APIs
              </div>
              {PROPERTY_DATA_ENDPOINTS.filter(
                (endpoint) => endpoint.category === "front-end"
              ).map((endpoint) => (
                <SelectItem key={endpoint.id} value={endpoint.id}>
                  <div className="flex flex-col">
                    <span>{endpoint.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {endpoint.description}
                    </span>
                  </div>
                </SelectItem>
              ))}

              {/* Back-office category */}
              <div className="mt-2 px-2 py-1.5 text-xs font-medium text-primary">
                Back Office APIs
              </div>
              {PROPERTY_DATA_ENDPOINTS.filter(
                (endpoint) => endpoint.category === "back-office"
              ).map((endpoint) => (
                <SelectItem key={endpoint.id} value={endpoint.id}>
                  <div className="flex flex-col">
                    <span>{endpoint.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {endpoint.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="flex items-center gap-2"
            disabled={loading || !selectedEndpoint}
            variant="default"
            onClick={() => fetchPropertyData(selectedEndpoint)}
          >
            {loading ? (
              <>
                <Loader className="size-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <LineChart className="size-4" />
                Fetch Data
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-4 md:p-6">{renderEndpointData()}</div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <Typography className="flex items-center font-medium text-yellow-800">
          <Clock className="mr-2 size-4" /> API Usage Notes
        </Typography>
        <Typography className="mt-1 text-sm text-yellow-700">
          PropertyData.co.uk API is limited to 4 requests per 10 seconds. API
          calls are only made when you explicitly click "Fetch Data" to avoid
          unnecessary costs.
        </Typography>
        {selectedEndpoint && (
          <div className="mt-2">
            <Typography className="text-sm font-medium text-yellow-800">
              Current API Endpoint:
            </Typography>
            <code className="mt-1 block rounded bg-yellow-100 p-2 text-xs text-yellow-900">
              https://api.propertydata.co.uk/{selectedEndpoint}?key=API_KEY
              {PROPERTY_DATA_ENDPOINTS.find((e) => e.id === selectedEndpoint)
                ?.params &&
                Object.entries(
                  PROPERTY_DATA_ENDPOINTS.find((e) => e.id === selectedEndpoint)
                    ?.params || {}
                )
                  .map(
                    ([key, value]) =>
                      `&${key}=${value === "" ? (key === "postcode" ? getPostcodeFromProperty() : key === "uprn" ? getUprnFromProperty() : value) : value}`
                  )
                  .join("")}
            </code>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusHistoryTab({ propertyId }: { propertyId: string }) {
  const [statuses, setStatuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch status history separately
  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        // Make a direct fetch to the dashboard statuses
        const response = await fetch(
          `/api/properties/${propertyId}/dashboard-status`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch status history")
        }
        const data = await response.json()
        setStatuses(data)
      } catch (error) {
        console.error("Error fetching status history:", error)
      } finally {
        setLoading(false)
      }
    }

    void fetchStatusHistory()
  }, [propertyId, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="mr-2 size-6 animate-spin" />
        <Typography>Loading status history...</Typography>
      </div>
    )
  }

  if (!statuses || statuses.length === 0) {
    return (
      <div className="py-4">
        <Typography>No status updates available for this property.</Typography>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Typography variant="h3">Status History</Typography>

      <div className="space-y-6">
        {statuses.map((status) => (
          <div key={status.id} className="rounded-lg border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-col">
                <Typography className="font-medium" variant="h4">
                  {status.currentStage}
                </Typography>
                <Typography className="text-muted-foreground" variant="small">
                  Reference: {status.referenceNumber}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <Typography className="text-muted-foreground" variant="small">
                    Updated
                  </Typography>
                  <Typography>
                    {new Date(status.updatedAt).toLocaleString()}
                  </Typography>
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white">
                  {Math.round(status.stageProgress)}%
                </div>
              </div>
            </div>

            {status.statusData && (
              <div className="space-y-3">
                <div className="grid gap-2">
                  <Typography className="font-medium" variant="small">
                    Status Message
                  </Typography>
                  <Typography className="text-sm">
                    {status.statusData.statusMessage || "No message provided"}
                  </Typography>
                </div>

                {status.statusData.requiredActions &&
                  status.statusData.requiredActions.length > 0 && (
                    <div className="grid gap-2">
                      <Typography className="font-medium" variant="small">
                        Required Actions
                      </Typography>
                      <ul className="list-inside list-disc space-y-1">
                        {status.statusData.requiredActions.map(
                          (action: any) => (
                            <li key={action.actionId} className="text-sm">
                              {action.description}
                              {action.urgency === "HIGH" && (
                                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                  Urgent
                                </span>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function PropertyDetailContent({
  propertyData,
}: PropertyDetailContentProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [jsonData, setJsonData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [isRequestingOffer, setIsRequestingOffer] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [statusStage, setStatusStage] = useState("VALUATION")
  const [applicationStatus, setApplicationStatus] = useState("PENDING")
  const [referenceNumber, setReferenceNumber] = useState(`REF-${Date.now()}`)
  const [statusDataJson, setStatusDataJson] = useState("")
  const { toast } = useToast()

  // Get property JSON data query
  const { isLoading, refetch } =
    api.admin.properties.getPropertyJsonData.useQuery(
      { propertyId: propertyData.id },
      { enabled: false }
    )

  // Request provisional offer mutation
  const requestOfferMutation =
    api.admin.properties.requestProvisionalOffer.useMutation({
      onSuccess: (data) => {
        toast({
          title: "Offer Request Initiated",
          description:
            data.message || "Your request has been submitted successfully.",
          duration: 5000,
        })
        setIsRequestingOffer(false)
      },
      onError: (error) => {
        toast({
          title: "Request Failed",
          description:
            error.message ||
            "Failed to request provisional offer. Please try again.",
          variant: "destructive",
          duration: 5000,
        })
        setIsRequestingOffer(false)
      },
    })

  const handleGenerateJson = async () => {
    setIsGenerating(true)
    setActiveTab("json")

    try {
      const result = await refetch()
      setJsonData(result.data)
    } catch (error) {
      console.error("Failed to generate JSON:", error)
      toast({
        title: "Error",
        description: "Failed to generate JSON data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyToClipboard = async () => {
    if (!jsonData) return

    setIsCopying(true)
    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
      toast({
        title: "Copied to clipboard",
        description: "JSON data has been copied to your clipboard",
        duration: 3000,
      })
    } catch (error) {
      console.error("Failed to copy:", error)
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      })
    } finally {
      setIsCopying(false)
      // Reset the button state after 1.5 seconds
      setTimeout(() => {
        setIsCopying(false)
      }, 1500)
    }
  }

  const handleRequestOffer = () => {
    setIsRequestingOffer(true)
    requestOfferMutation.mutate({ propertyId: propertyData.id })
  }

  const handleStatusUpdateClick = useCallback(() => {
    if (!propertyData.sellerProperties?.[0]?.sellerId) {
      toast({
        title: "Missing Seller",
        description: "This property needs at least one seller to update status",
        variant: "destructive",
      })
      return
    }

    // Generate a new reference number
    setReferenceNumber(`REF-${Date.now()}`)

    // Set an initial JSON value as a template
    setStatusDataJson(
      JSON.stringify(
        {
          statusMessage: "Status update for property review",
          reviewData: {
            notes: "Application review notes here",
            reviewerId: "system",
            reviewDate: new Date().toISOString(),
          },
          requiredActions: [
            {
              actionId: "action-1",
              actionType: "DOCUMENT_UPLOAD",
              description: "Please submit additional documentation",
              dueDate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              urgency: "MEDIUM",
            },
          ],
        },
        null,
        2
      )
    )

    setIsStatusModalOpen(true)
  }, [propertyData.sellerProperties, toast])

  const handleStatusUpdate = useCallback(async () => {
    if (!propertyData.sellerProperties?.[0]?.sellerId) return

    setIsUpdatingStatus(true)
    setIsStatusModalOpen(false)

    try {
      // Validate JSON input
      let statusData
      try {
        statusData = JSON.parse(statusDataJson)
      } catch (e) {
        throw new Error("Invalid JSON format. Please check your input.")
      }

      // Create payload with minimal required fields and custom JSON data
      const payload = {
        statusUpdateId: `status-${Date.now()}`,
        propertyId: propertyData.id,
        referenceNumber: referenceNumber,
        sellerId: propertyData.sellerProperties[0].sellerId,
        currentStage: statusStage,
        stageProgress: 100, // Always 100% for simplicity
        statusCode: applicationStatus,
        statusMessage: "Application review status update",
        statusData: statusData,
        metadata: {
          timestamp: new Date().toISOString(),
          updateType: "APPLICATION_REVIEW_UPDATE",
          applicationStatus: applicationStatus,
        },
      }

      // Call the webhook endpoint directly
      const response = await fetch(`/api/webhooks/backoffice/status-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Test": "true",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Status Updated",
          description: `Application status updated to "${applicationStatus}" - Stage: ${statusStage}`,
          duration: 5000,
        })
      } else {
        throw new Error(data.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update property status",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }, [
    propertyData.id,
    propertyData.sellerProperties,
    referenceNumber,
    statusStage,
    applicationStatus,
    statusDataJson,
    toast,
  ])

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild size="icon" variant="outline">
            <Link href="/admin/properties">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Typography variant="h1">Property Details</Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="flex items-center gap-2"
            disabled={isUpdatingStatus}
            variant="outline"
            onClick={handleStatusUpdateClick}
          >
            {isUpdatingStatus ? (
              <>
                <Loader className="size-4 animate-spin" />
                Updating Status...
              </>
            ) : (
              <>
                <FileText className="size-4" />
                Test Status Update
              </>
            )}
          </Button>
          <Button
            className="flex items-center gap-2"
            disabled={isRequestingOffer}
            variant="default"
            onClick={handleRequestOffer}
          >
            {isRequestingOffer ? (
              <>
                <Loader className="size-4 animate-spin" />
                Requesting...
              </>
            ) : (
              <>
                <SendHorizontal className="size-4" />
                Request Offer
              </>
            )}
          </Button>
          <Button disabled={isGenerating} onClick={handleGenerateJson}>
            {isGenerating ? (
              <>
                <Loader className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate JSON"
            )}
          </Button>
        </div>
      </div>

      {propertyData.address && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" />
          <Typography>
            {(() => {
              // Get addressData if available
              const addressData = propertyData.address.addressData as any

              // If we have the new structure with lookup/manual
              if (addressData && (addressData.lookup || addressData.manual)) {
                // Try lookup first
                if (addressData.lookup) {
                  const lookup = addressData.lookup
                  return [
                    lookup.line_1,
                    lookup.line_2,
                    lookup.line_3,
                    lookup.post_town,
                    lookup.county,
                    lookup.postcode,
                  ]
                    .filter(Boolean)
                    .join(", ")
                }

                // Then try manual data
                if (addressData.manual) {
                  const manual = addressData.manual
                  return [
                    manual.address,
                    manual.town,
                    manual.county,
                    manual.postcode,
                  ]
                    .filter(Boolean)
                    .join(", ")
                }
              }

              // Fall back to legacy format
              return `${propertyData.address.streetLine1}${
                propertyData.address.streetLine2
                  ? `, ${propertyData.address.streetLine2}`
                  : ""
              }, ${propertyData.address.city}, ${propertyData.address.state || ""} ${
                propertyData.address.postalCode
              }, ${propertyData.address.country}`
            })()}
          </Typography>
        </div>
      )}

      <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger className="flex items-center gap-2" value="overview">
            <Home className="size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="sellers">
            <Users className="size-4" />
            Sellers
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="offers">
            <FileText className="size-4" />
            Offers
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="financials">
            <DollarSign className="size-4" />
            Financials
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="status">
            <Clock className="size-4" />
            Status
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="attributes">
            <FileText className="size-4" />
            Attributes
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="json">
            <Code className="size-4" />
            JSON
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center gap-2"
            value="property-data"
          >
            <LineChart className="size-4" />
            Property Data
          </TabsTrigger>
        </TabsList>

        <TabsContent className="pt-6" value="overview">
          <PropertyInfoCard property={propertyData} />
        </TabsContent>

        <TabsContent className="pt-6" value="sellers">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {propertyData.sellers ? (
              propertyData.sellers.map((seller) => (
                <SellerInfoCard key={seller.id} seller={seller} />
              ))
            ) : propertyData.sellerProperties ? (
              propertyData.sellerProperties.map((sellerProperty) => (
                <SellerInfoCard
                  key={sellerProperty.id}
                  sellerProperty={sellerProperty}
                />
              ))
            ) : (
              <div className="col-span-full">
                <Typography>
                  No sellers associated with this property.
                </Typography>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent className="pt-6" value="offers">
          <OffersTable propertyId={propertyData.id} />
        </TabsContent>

        <TabsContent className="pt-6" value="financials">
          <div className="rounded-lg border p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <Typography variant="h4">Estimated Value</Typography>
                <Typography variant="h4">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(propertyData.estimatedValue)}
                </Typography>
              </div>

              <div className="flex justify-between">
                <Typography variant="h4">Confirmed Value</Typography>
                <Typography variant="h4">
                  {propertyData.confirmedValue
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(propertyData.confirmedValue)
                    : "Not confirmed"}
                </Typography>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent className="pt-6" value="status">
          <StatusHistoryTab propertyId={propertyData.id} />
        </TabsContent>

        <TabsContent className="pt-6" value="attributes">
          {jsonData ? (
            <PropertyAttributes data={jsonData} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-6">
              <Typography>
                Click "Generate JSON" to view all property attributes
              </Typography>
              <Button onClick={handleGenerateJson}>Generate Now</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent className="pt-6" value="property-data">
          <PropertyDataTab propertyData={propertyData} />
        </TabsContent>

        <TabsContent className="pt-6" value="json">
          <div className="rounded-lg border bg-muted p-6">
            {isLoading || isGenerating ? (
              <div className="flex items-center justify-center p-6">
                <Loader className="mr-2 size-6 animate-spin" />
                <Typography>Generating JSON data...</Typography>
              </div>
            ) : jsonData ? (
              <div className="relative">
                <div className="sticky right-0 top-0 z-10 flex justify-end border-b bg-muted p-2">
                  <Button
                    className="flex items-center gap-2"
                    disabled={isCopying}
                    size="sm"
                    variant="outline"
                    onClick={handleCopyToClipboard}
                  >
                    {isCopying ? (
                      <>
                        <Check className="size-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        Copy code
                      </>
                    )}
                  </Button>
                </div>
                <pre className="max-h-[600px] overflow-auto p-4 text-sm">
                  {JSON.stringify(jsonData, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 p-6">
                <Typography>
                  Click "Generate JSON" to view property data
                </Typography>
                <Button onClick={handleGenerateJson}>Generate Now</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Send a status update for this property application.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-md bg-muted p-3 text-center">
              <Typography className="text-sm font-medium text-muted-foreground">
                Property ID
              </Typography>
              <Typography className="break-all text-base font-bold">
                {propertyData.id}
              </Typography>
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="referenceNumber">
                Reference Number
              </label>
              <Input
                className="mt-1"
                id="referenceNumber"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="statusStage">
                Status Stage
              </label>
              <Select value={statusStage} onValueChange={setStatusStage}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INITIAL_INQUIRY">
                    Initial Inquiry
                  </SelectItem>
                  <SelectItem value="VALUATION">Valuation</SelectItem>
                  <SelectItem value="ELIGIBILITY">Eligibility</SelectItem>
                  <SelectItem value="APPROVAL">Approval</SelectItem>
                  <SelectItem value="OFFER_GENERATED">
                    Offer Generated
                  </SelectItem>
                  <SelectItem value="OFFER_SENT">Offer Sent</SelectItem>
                  <SelectItem value="OFFER_ACCEPTED">Offer Accepted</SelectItem>
                  <SelectItem value="LEGAL_REVIEW">Legal Review</SelectItem>
                  <SelectItem value="CONTRACTS">Contracts</SelectItem>
                  <SelectItem value="COMPLETION">Completion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                className="text-sm font-medium"
                htmlFor="applicationStatus"
              >
                Application Status
              </label>
              <Select
                value={applicationStatus}
                onValueChange={setApplicationStatus}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="statusDataJson">
                Status Data JSON
              </label>
              <Textarea
                className="mt-1 font-mono text-sm"
                id="statusDataJson"
                rows={10}
                value={statusDataJson}
                onChange={(e) => setStatusDataJson(e.target.value)}
              />
              <Typography className="mt-1 text-xs text-muted-foreground">
                Enter the JSON data to be stored directly in the statusData
                field
              </Typography>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

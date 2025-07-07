/*eslint-disable react/jsx-max-depth */
/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable @typescript-eslint/no-unnecessary-condition */
/*eslint-disable no-nested-ternary */
import { useEffect, useState } from "react"

import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Checkbox } from "@package/ui/checkbox"
import { Label } from "@package/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@package/ui/table"
import { Textarea } from "@package/ui/textarea"
import { Loader2 } from "lucide-react"

import type { BaseStepProps } from "../StepProps"

import { api } from "@/lib/trpc/react"

// Update the PropertyInfo type to match our repository data
interface PropertyInfo {
  id: string
  address:
    | {
        streetLine1: string
        streetLine2?: string
        city: string
        state?: string
        postalCode: string
        country: string
      }
    | "N/A"
  propertyType: string
  bedroomCount: number
  bathroomCount: number
  totalAreaSqM: number
  applicationStatus: string
  propertyValue: number
  user: {
    id: string
    name: string
    email: string
  } | null
  sellerDemographics?: {
    age: number
  }
}

// Helper function to format address
const formatAddress = (address: PropertyInfo["address"]): string => {
  if (address === "N/A") return "N/A"
  return `${address.streetLine1}, ${address.city}, ${address.postalCode}`
}

// Helper to robustly parse property value
function parsePropertyValue(value: any, fallback: any) {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    // Remove currency symbols and commas
    const num = Number(value.replace(/[^0-9.]/g, ""))
    if (!isNaN(num)) return num
  }
  if (typeof fallback === "number") return fallback
  return 0
}

// Helper to normalize status
function normalizeStatus(
  status: string | undefined
): "ACCEPTED" | "REJECTED" | "PROCESSING" | "PENDING" {
  if (
    status === "ACCEPTED" ||
    status === "REJECTED" ||
    status === "PROCESSING" ||
    status === "PENDING"
  ) {
    return status
  }
  if (status === "IN_PROGRESS") return "PROCESSING"
  if (status === "WAITING") return "PENDING"
  return "PENDING"
}

// Helper to calculate seller age from dateOfBirth (returns number or undefined)
function getSellerAge(property: any): number | undefined {
  const seller = property.sellerProperties?.[0]?.seller
  if (seller?.dateOfBirth) {
    const dob = new Date(seller.dateOfBirth)
    const ageDifMs = Date.now() - dob.getTime()
    const ageDate = new Date(ageDifMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }
  return undefined
}

// Helper function to map backend property to PropertyInfo
const mapBackendPropertyToPropertyInfo = (property: any): PropertyInfo => ({
  id: property.id,
  address: property.address,
  propertyType: property.propertyType,
  bedroomCount: property.bedroomCount,
  bathroomCount: property.bathroomCount,
  totalAreaSqM: property.totalAreaSqM,
  applicationStatus: normalizeStatus(property.applicationStatus),
  propertyValue: parsePropertyValue(
    property.propertyValue,
    property.estimatedValue
  ),
  user: property.user,
  sellerDemographics: {
    age: getSellerAge(property) || 0,
  },
})

export function PropertyAggregationStep({
  wizardData,
  // updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Select properties that align with your Buy Box theme. Focus on properties with complete due diligence and that match your investment criteria. A well-curated portfolio will be more attractive to investors."
    )
  }, [setGuideMessage])

  // Local state for selected properties - initialize as empty array
  const [selectedProperties, setSelectedProperties] = useState<PropertyInfo[]>(
    []
  )

  // Local state for loading
  const [isLoading, setIsLoading] = useState(false)

  // Fetch properties from backend with filters based on Buy Box theme
  const {
    data,
    error,
    isLoading: trpcLoading,
  } = api.admin.buyBoxCreation.getAvailableProperties.useQuery(
    {
      page: 1,
      limit: 20,
      themeType: wizardData.buyBoxTheme?.themeType,
      location: wizardData.buyBoxTheme?.location
        ? {
            city: wizardData.buyBoxTheme.location.city,
            region: wizardData.buyBoxTheme.location.region,
            postalCodes: wizardData.buyBoxTheme.location.postalCode,
          }
        : undefined,
      propertyTypes: wizardData.buyBoxTheme?.propertyType,
    },
    {
      refetchOnMount: true,
      staleTime: 0,
    }
  )

  // Map backend properties to PropertyInfo type
  const availableProperties: PropertyInfo[] = (data?.properties || []).map(
    mapBackendPropertyToPropertyInfo
  )

  // Property selection handler
  const handlePropertySelection = (
    property: PropertyInfo,
    isSelected: boolean
  ) => {
    if (isSelected) {
      setSelectedProperties((prev) => [...prev, property])
    } else {
      setSelectedProperties((prev) => prev.filter((p) => p.id !== property.id))
    }
  }

  // Check if a property is already selected
  const isPropertySelected = (propertyId: string) => {
    return selectedProperties.some((p) => p.id === propertyId)
  }

  // Calculate total value of selected properties
  const calculateTotalValue = () => {
    return selectedProperties.reduce(
      (sum, property) => sum + (property.propertyValue || 0),
      0
    )
  }

  // Format currency with proper handling of NaN
  const formatCurrency = (value: number) => {
    if (isNaN(value) || value === 0) return "£0.00"
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value)
  }

  // API mutation
  const addPropertiesMutation =
    api.admin.buyBoxCreation.addProperties.useMutation()

  // Handle form submission
  const handleContinue = () => {
    setIsLoading(true)
    // Validation
    // if (selectedProperties.length === 0) {
    //   setIsLoading(false)
    //   alert("Please select at least one property for the Buy Box")
    //   return
    // }
    // Save data and move to next step
    // TODO: UNCOMMENT THIS LATER
    // updateWizardData({ selectedProperties: selectedProperties.map(property => ({
    //   ...property,
    //   ownershipStatus: property.ownershipStatus || '',
    //   condition: property.condition || '',
    //   bedrooms: property.bedrooms || 0,
    //   bathrooms: property.bathrooms || 0,
    //   squareFootage: property.squareFootage || 0,
    //   yearBuilt: property.yearBuilt || 0,
    //   listPrice: property.listPrice || 0,
    // }))})

    // Call API to add properties
    addPropertiesMutation.mutate(
      {
        buyBoxId: localStorage.getItem("buyBoxId") || "", // TODO: make dynamic
        properties: selectedProperties,
      },
      {
        onSuccess: () => {
          setIsLoading(false)
          onNext()
        },
        onError: (error) => {
          console.error("Error adding properties:", error)
          setIsLoading(false)
          onNext()
          // alert("Error adding properties. Please try again.")
        },
      }
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Property Aggregation & Due Diligence
        </CardTitle>
        <CardDescription>
          Select properties that align with your Buy Box theme and review their
          due diligence status
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Selected Theme Summary */}
        {wizardData.buyBoxTheme && (
          <div className="rounded-md border border-border bg-muted/20 p-4">
            <h3 className="mb-2 text-lg font-medium">Selected Buy Box Theme</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {wizardData.buyBoxTheme.name}
              </div>
              <div>
                <span className="font-medium">Type:</span>{" "}
                {wizardData.buyBoxTheme.themeType.replace("-", " ")}
              </div>
              {wizardData.buyBoxTheme.location?.city && (
                <div>
                  <span className="font-medium">Location:</span>{" "}
                  {wizardData.buyBoxTheme.location.city}
                </div>
              )}
              {wizardData.buyBoxTheme.propertyType &&
                wizardData.buyBoxTheme.propertyType.length > 0 && (
                  <div>
                    <span className="font-medium">Property Types:</span>{" "}
                    {wizardData.buyBoxTheme.propertyType.join(", ")}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Available Properties */}
        <div>
          <h3 className="mb-3 text-lg font-medium">Available Properties</h3>
          <div className="max-h-[500px] overflow-auto rounded-md border border-border">
            <Table>
              <TableHeader className="sticky top-0 bg-card shadow-sm">
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Seller Age</TableHead>
                  <TableHead className="text-right">Seller Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trpcLoading ? (
                  <TableRow>
                    <TableCell className="h-32" colSpan={7}>
                      <div className="flex h-full items-center justify-center">
                        <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">
                          Loading properties...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell className="h-32" colSpan={7}>
                      <div className="flex h-full items-center justify-center text-destructive">
                        Error loading properties: {error.message}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : availableProperties.length === 0 ? (
                  <TableRow>
                    <TableCell className="h-32" colSpan={7}>
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        No properties found matching your criteria
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  availableProperties.map((property) => (
                    <TableRow
                      key={property.id}
                      className={
                        isPropertySelected(property.id) ? "bg-primary/5" : ""
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={isPropertySelected(property.id)}
                          disabled={trpcLoading}
                          onCheckedChange={(checked) =>
                            handlePropertySelection(property, checked === true)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatAddress(property.address)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {property.bedroomCount} bed, {property.bathroomCount}{" "}
                          bath, {property.totalAreaSqM}m²
                        </div>
                      </TableCell>
                      <TableCell>{property.propertyType}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            property.applicationStatus === "ACCEPTED"
                              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                              : property.applicationStatus === "REJECTED"
                                ? "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
                          }
                        >
                          {property.applicationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(property.propertyValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {property.sellerDemographics?.age !== undefined
                          ? `${property.sellerDemographics.age} years`
                          : "Not provided"}
                      </TableCell>
                      <TableCell className="text-right">
                        {property.user ? property.user.email : "Not provided"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-md border border-border bg-muted/20 p-3">
            <div>
              <span className="font-medium">Selected Properties:</span>{" "}
              {selectedProperties.length}
            </div>
            <div>
              <span className="font-medium">Total Estimated Value:</span>{" "}
              {formatCurrency(calculateTotalValue())}
            </div>
          </div>
        </div>

        {/* Notes and Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Notes & Additional Information
          </h3>
          <div className="space-y-2">
            <Label htmlFor="property-notes">
              Additional Notes on Selected Properties
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="property-notes"
              placeholder="Enter any additional notes about the selected properties, their alignment with your theme, or due diligence considerations..."
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={isLoading} variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="w-[300px]"
          disabled={trpcLoading}
          onClick={handleContinue}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Continue To Financial Modellings"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

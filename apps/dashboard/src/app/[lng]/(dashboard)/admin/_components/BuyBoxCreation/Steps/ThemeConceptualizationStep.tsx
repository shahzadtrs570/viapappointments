/*eslint-disable react/jsx-max-depth */
/*eslint-disable max-lines */
import { useEffect, useState } from "react"

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
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Textarea } from "@package/ui/textarea"

import type { BaseStepProps } from "../StepProps"
import type { BuyBoxTheme, BuyBoxThemeType, PropertyType } from "../types"

import { api } from "@/lib/trpc/react"

export function ThemeConceptualizationStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // API mutations
  const createThemeMutation = api.admin.buyBoxCreation.createTheme.useMutation()
  const updateThemeMutation = api.admin.buyBoxCreation.updateTheme.useMutation()

  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Define your Buy Box theme and criteria. A well-defined theme helps target the right investors and aggregates complementary properties. Consider location, property type, and demographic factors."
    )
  }, [setGuideMessage])

  // Local state for the form
  const [theme, setTheme] = useState<BuyBoxTheme>(() => {
    // Initialize with existing data or defaults

    return (
      wizardData.buyBoxTheme || {
        name: "",
        description: "",
        themeType: "location" as BuyBoxThemeType,
        location: {
          city: "",
          region: "",
          postalCode: [],
          country: "United Kingdom",
        },
        propertyType: [],
        demographicProfile: {
          minAge: 65,
          maxAge: 100,
          occupancyStatus: "owner-occupied",
        },
        additionalCriteria: "",
        targetInvestors: [],
      }
    )
  })

  const [isLoading, setIsLoading] = useState(false)

  // Handle location fields changes
  const handleLocationChange = (field: string, value: string) => {
    setTheme((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }))
  }

  // Handle postal code input
  const handlePostalCodeInput = (value: string) => {
    const codes = value
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean)
    setTheme((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        postalCode: codes,
      },
    }))
  }

  // Handle demographic profile changes
  const handleDemographicChange = (field: string, value: string | number) => {
    setTheme((prev) => ({
      ...prev,
      demographicProfile: {
        ...prev.demographicProfile,
        [field]: value,
      },
    }))
  }

  // Handle property type selection
  const handlePropertyTypeSelection = (
    type: PropertyType,
    checked: boolean
  ) => {
    setTheme((prev) => {
      let updatedTypes = [...(prev.propertyType || [])]

      if (checked) {
        updatedTypes.push(type)
      } else {
        updatedTypes = updatedTypes.filter((t) => t !== type)
      }

      return {
        ...prev,
        propertyType: updatedTypes,
      }
    })
  }

  // Handle theme type change
  const handleThemeTypeChange = (value: BuyBoxThemeType) => {
    setTheme((prev) => ({
      ...prev,
      themeType: value,
    }))
  }

  // Handle target investors input
  const handleTargetInvestorsInput = (value: string) => {
    const investors = value
      .split(",")
      .map((inv) => inv.trim())
      .filter(Boolean)
    setTheme((prev) => ({
      ...prev,
      targetInvestors: investors,
    }))
  }

  // Handle form submission
  const handleContinue = () => {
    // Validation
    if (!theme.name) {
      alert("Please provide a name for your Buy Box")
      return
    }

    if (!theme.description) {
      alert("Please provide a description for your Buy Box")
      return
    }

    // Depending on theme type, validate required fields
    if (
      theme.themeType === "location" &&
      !theme.location?.city &&
      !theme.location?.region &&
      theme.location?.postalCode?.length === 0
    ) {
      alert(
        "Please provide at least one location criterion (city, region, or postal codes)"
      )
      return
    }

    if (
      theme.themeType === "property-type" &&
      (!theme.propertyType || theme.propertyType.length === 0)
    ) {
      alert("Please select at least one property type")
      return
    }

    // Save data and move to next step
    updateWizardData({ buyBoxTheme: theme })

    // Set loading state before API calls
    setIsLoading(true)

    // Either create a new theme or update an existing one
    if (wizardData.buyBoxId) {
      // Update existing theme
      updateThemeMutation.mutate(
        {
          buyBoxId: localStorage.getItem("buyBoxId") || "", // TODO: make dynamic
          data: theme,
        },
        {
          onSuccess: () => {
            setIsLoading(false)
            onNext()
          },
          onError: (error) => {
            console.error("Error updating theme:", error)
            setIsLoading(false)
            alert("Error updating theme. Please try again.")
          },
        }
      )
    } else {
      // Create new theme
      createThemeMutation.mutate(theme, {
        onSuccess: (data) => {
          // Store the buyBoxId for future steps
          updateWizardData({ buyBoxId: data.id })
          localStorage.setItem("buyBoxId", data.id)
          setIsLoading(false)
          onNext()
        },
        onError: (error) => {
          console.error("Error creating theme:", error)
          setIsLoading(false)
          alert("Error creating theme. Please try again.")
        },
      })
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Buy Box Identification & Conceptualisation
        </CardTitle>
        <CardDescription>
          Define the theme and criteria for your Buy Box to target the right
          investors and properties
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Buy Box Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="buy-box-name">Buy Box Name</Label>
              <Input
                id="buy-box-name"
                placeholder="e.g., London Luxury Residential Portfolio"
                value={theme.name}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme-type">Theme Type</Label>
              <Select
                value={theme.themeType}
                onValueChange={(value) =>
                  handleThemeTypeChange(value as BuyBoxThemeType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="location">Location-based</SelectItem>
                  <SelectItem value="property-type">Property Type</SelectItem>
                  <SelectItem value="demographic">
                    Demographic Profile
                  </SelectItem>
                  <SelectItem value="longevity-profile">
                    Longevity Profile
                  </SelectItem>
                  <SelectItem value="custom">Custom/Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="min-h-[100px]"
              id="description"
              placeholder="Describe the investment theme and unique selling points of this Buy Box..."
              value={theme.description}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Location Criteria - Show if location-based or custom */}
        {(theme.themeType === "location" || theme.themeType === "custom") && (
          <div className="space-y-4 rounded-md border border-border bg-muted/30 p-4">
            <h3 className="text-lg font-medium">Location Criteria</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City/Town</Label>
                <Input
                  id="city"
                  placeholder="e.g., London, Manchester"
                  value={theme.location?.city || ""}
                  onChange={(e) => handleLocationChange("city", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region/County</Label>
                <Input
                  id="region"
                  placeholder="e.g., Greater London, West Midlands"
                  value={theme.location?.region || ""}
                  onChange={(e) =>
                    handleLocationChange("region", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal-codes">
                Postal Codes (comma-separated)
              </Label>
              <Input
                id="postal-codes"
                placeholder="e.g., SW1A 1AA, NW1 6XE"
                value={theme.location?.postalCode?.join(", ") || ""}
                onChange={(e) => handlePostalCodeInput(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Property Type Criteria - Show if property-type or custom */}
        {(theme.themeType === "property-type" ||
          theme.themeType === "custom") && (
          <div className="space-y-4 rounded-md border border-border bg-muted/30 p-4">
            <h3 className="text-lg font-medium">Property Type Criteria</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={theme.propertyType?.includes("residential")}
                  id="residential"
                  onCheckedChange={(checked) =>
                    handlePropertyTypeSelection("residential", checked === true)
                  }
                />
                <Label htmlFor="residential">Residential</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={theme.propertyType?.includes("commercial")}
                  id="commercial"
                  onCheckedChange={(checked) =>
                    handlePropertyTypeSelection("commercial", checked === true)
                  }
                />
                <Label htmlFor="commercial">Commercial</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={theme.propertyType?.includes("luxury")}
                  id="luxury"
                  onCheckedChange={(checked) =>
                    handlePropertyTypeSelection("luxury", checked === true)
                  }
                />
                <Label htmlFor="luxury">Luxury</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={theme.propertyType?.includes("retirement-friendly")}
                  id="retirement-friendly"
                  onCheckedChange={(checked) =>
                    handlePropertyTypeSelection(
                      "retirement-friendly",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="retirement-friendly">Retirement-Friendly</Label>
              </div>
            </div>
          </div>
        )}

        {/* Demographic Criteria - Show if demographic, longevity, or custom */}
        {(theme.themeType === "demographic" ||
          theme.themeType === "longevity-profile" ||
          theme.themeType === "custom") && (
          <div className="space-y-4 rounded-md border border-border bg-muted/30 p-4">
            <h3 className="text-lg font-medium">
              Demographic Profile Criteria
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min-age">Minimum Seller Age</Label>
                <Input
                  id="min-age"
                  max={100}
                  min={18}
                  type="number"
                  value={theme.demographicProfile?.minAge || 65}
                  onChange={(e) =>
                    handleDemographicChange("minAge", parseInt(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-age">Maximum Seller Age</Label>
                <Input
                  id="max-age"
                  max={120}
                  min={18}
                  type="number"
                  value={theme.demographicProfile?.maxAge || 100}
                  onChange={(e) =>
                    handleDemographicChange("maxAge", parseInt(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupancy">Occupancy Status</Label>
              <Select
                value={
                  theme.demographicProfile?.occupancyStatus || "owner-occupied"
                }
                onValueChange={(value) =>
                  handleDemographicChange("occupancyStatus", value)
                }
              >
                <SelectTrigger id="occupancy">
                  <SelectValue placeholder="Select occupancy status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner-occupied">Owner Occupied</SelectItem>
                  <SelectItem value="tenant-occupied">
                    Tenant Occupied
                  </SelectItem>
                  <SelectItem value="mixed">Mixed Occupancy</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Additional Criteria */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>

          <div className="space-y-2">
            <Label htmlFor="additional-criteria">
              Additional Criteria or Notes
            </Label>
            <Textarea
              className="min-h-[80px]"
              id="additional-criteria"
              placeholder="Any additional selection criteria or important notes..."
              value={theme.additionalCriteria || ""}
              onChange={(e) =>
                setTheme((prev) => ({
                  ...prev,
                  additionalCriteria: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-investors">
              Target Investors (comma-separated)
            </Label>
            <Input
              id="target-investors"
              placeholder="e.g., Pension funds, Family offices, Insurance companies"
              value={theme.targetInvestors?.join(", ") || ""}
              onChange={(e) => handleTargetInvestorsInput(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Identify the specific investor types this Buy Box will target
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={true} variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Property Selection"}
        </Button>
      </CardFooter>
    </Card>
  )
}

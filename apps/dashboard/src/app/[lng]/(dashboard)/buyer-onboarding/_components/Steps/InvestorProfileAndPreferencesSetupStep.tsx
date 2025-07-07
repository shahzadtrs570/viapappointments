/*eslint-disable react/no-unescaped-entities */
/*eslint-disable max-lines */
/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable react/jsx-max-depth */
/*eslint-disable  @typescript-eslint/no-unnecessary-condition */

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
import { Slider } from "@package/ui/slider"
import { Textarea } from "@package/ui/textarea"
import { useToast } from "@package/ui/toast"

import type { BaseStepProps } from "../StepProps"
import type {
  GeographicalPreference,
  InvestorProfileAndPreferences,
  PropertyType,
  RiskAppetite,
} from "../types"

import { api } from "@/lib/trpc/react"

export function InvestorProfileAndPreferencesSetupStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Understanding your investment preferences and profile helps us match you with the right Buy Boxes. Please provide details about your geographical preferences, property types of interest, risk appetite, and investment thresholds."
    )
  }, [setGuideMessage])

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Query to get existing data for this step
  const stepDataQuery = api.buyer.getStepData.useQuery(
    { step: "investorProfile" as const },
    { enabled: true }
  ) as any // Type assertion to bypass TypeScript error

  // Handle successful data fetch
  useEffect(() => {
    if (stepDataQuery.data && !wizardData.investorProfile) {
      const queryData = stepDataQuery.data as InvestorProfileAndPreferences
      if (typeof queryData === "object") {
        updateWizardData({ investorProfile: queryData })
        setProfileData(queryData)
      }
    }
  }, [stepDataQuery.data, updateWizardData, wizardData.investorProfile])

  // Handle query errors
  useEffect(() => {
    if (stepDataQuery.error) {
      console.error(
        "Error fetching investor profile data:",
        stepDataQuery.error
      )
      toast({
        title: "Error loading data",
        description: "Could not load your saved investor profile.",
        variant: "destructive",
      })
    }
  }, [stepDataQuery.error, toast])

  // Mutation to save data
  const saveInvestorProfile = api.buyer.submitInvestorProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Profile saved",
        description: "Your investor profile and preferences have been saved.",
      })
      onNext()
    },
    onError: (error) => {
      toast({
        title: "Error saving data",
        description:
          error.message || "Could not save investor profile. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Initialize local state with existing data or defaults
  const [profileData, setProfileData] = useState<InvestorProfileAndPreferences>(
    () =>
      wizardData.investorProfile || {
        investmentPreferences: {
          geographicalPreferences: ["london"],
          propertyTypes: ["luxury"],
          riskAppetite: "balanced",
          targetedReturns: 7, // 7% default expected return
          minimumInvestmentSize: 1000000, // £1M min investment
          maximumInvestmentSize: 10000000, // £10M max investment
          investmentHorizon: 5, // 5 years default
        },
        buyBoxPreferences: {
          locationFocus: [],
          propertyCategories: ["luxury"],
          sellerDemographicsImportance: "medium",
          minimumPropertyValue: 500000, // £500K minimum property value
        },
        allocationStrategy: {
          minimumBuyBoxAllocation: 500000, // £500K min allocation
          maximumBuyBoxAllocation: 5000000, // £5M max allocation
          diversificationRequirements: "",
          concentrationLimits: "",
        },
        performanceExpectations: {
          annualYieldTarget: 6, // 6% annual yield
          totalReturnTarget: 8, // 8% total return including appreciation
          volatilityTolerance: "",
          benchmarks: [],
        },
        additionalRequirements: "",
      }
  )

  // Update local state when wizardData changes
  useEffect(() => {
    if (wizardData.investorProfile) {
      setProfileData(wizardData.investorProfile)
    }
  }, [wizardData.investorProfile])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Handle geographical preferences changes
  const handleGeoPreferenceChange = (
    preference: GeographicalPreference,
    isSelected: boolean
  ) => {
    setProfileData((prev) => {
      const currentPreferences = [
        ...prev.investmentPreferences.geographicalPreferences,
      ]
      if (isSelected) {
        // Add preference if not already included
        if (!currentPreferences.includes(preference)) {
          currentPreferences.push(preference)
        }
      } else {
        // Remove preference
        const index = currentPreferences.indexOf(preference)
        if (index !== -1) {
          currentPreferences.splice(index, 1)
        }
      }
      return {
        ...prev,
        investmentPreferences: {
          ...prev.investmentPreferences,
          geographicalPreferences: currentPreferences,
        },
      }
    })
  }

  // Handle property types changes
  const handlePropertyTypeChange = (typeId: string, isSelected: boolean) => {
    setProfileData((prev) => {
      const currentTypes = [...prev.investmentPreferences.propertyTypes]

      // Make sure the typeId is one of our valid PropertyType values
      if (
        [
          "luxury",
          "urban",
          "suburban",
          "retirement",
          "commercial",
          "mixed_use",
          "residential",
          "other",
        ].includes(typeId)
      ) {
        if (isSelected) {
          // Add type if not already included
          if (!currentTypes.includes(typeId as PropertyType)) {
            currentTypes.push(typeId as PropertyType)
          }
        } else {
          // Remove type
          const index = currentTypes.indexOf(typeId as PropertyType)
          if (index !== -1) {
            currentTypes.splice(index, 1)
          }
        }
      }

      return {
        ...prev,
        investmentPreferences: {
          ...prev.investmentPreferences,
          propertyTypes: currentTypes,
        },
      }
    })
  }

  // Handle Buy Box property categories changes
  const handleBuyBoxCategoryChange = (
    categoryId: string,
    isSelected: boolean
  ) => {
    setProfileData((prev) => {
      const currentCategories = [...prev.buyBoxPreferences.propertyCategories]

      // Make sure the categoryId is one of our valid PropertyType values
      if (
        [
          "luxury",
          "urban",
          "suburban",
          "retirement",
          "commercial",
          "mixed_use",
          "residential",
          "other",
        ].includes(categoryId)
      ) {
        if (isSelected) {
          // Add category if not already included
          if (!currentCategories.includes(categoryId as PropertyType)) {
            currentCategories.push(categoryId as PropertyType)
          }
        } else {
          // Remove category
          const index = currentCategories.indexOf(categoryId as PropertyType)
          if (index !== -1) {
            currentCategories.splice(index, 1)
          }
        }
      }

      return {
        ...prev,
        buyBoxPreferences: {
          ...prev.buyBoxPreferences,
          propertyCategories: currentCategories,
        },
      }
    })
  }

  // Handle location focus input
  const handleLocationFocusInput = (value: string) => {
    const locations = value
      .split(",")
      .map((location) => location.trim())
      .filter(Boolean)

    setProfileData((prev) => ({
      ...prev,
      buyBoxPreferences: {
        ...prev.buyBoxPreferences,
        locationFocus: locations,
      },
    }))
  }

  // Handle benchmarks input
  const handleBenchmarksInput = (value: string) => {
    const benchmarks = value
      .split(",")
      .map((benchmark) => benchmark.trim())
      .filter(Boolean)

    setProfileData((prev) => ({
      ...prev,
      performanceExpectations: {
        ...prev.performanceExpectations,
        benchmarks: benchmarks,
      },
    }))
  }

  // Handle investment preferences changes
  const handleInvestmentPrefChange = (
    field: string,
    value: string | number | RiskAppetite
  ) => {
    setProfileData((prev) => ({
      ...prev,
      investmentPreferences: {
        ...prev.investmentPreferences,
        [field]: value,
      },
    }))
  }

  // Handle Buy Box preferences changes
  const handleBuyBoxPrefChange = (field: string, value: string | number) => {
    setProfileData((prev) => ({
      ...prev,
      buyBoxPreferences: {
        ...prev.buyBoxPreferences,
        [field]: value,
      },
    }))
  }

  // Handle allocation strategy changes
  const handleAllocationChange = (field: string, value: string | number) => {
    setProfileData((prev) => ({
      ...prev,
      allocationStrategy: {
        ...prev.allocationStrategy,
        [field]: value,
      },
    }))
  }

  // Handle performance expectations changes
  const handlePerformanceChange = (field: string, value: string | number) => {
    setProfileData((prev) => ({
      ...prev,
      performanceExpectations: {
        ...prev.performanceExpectations,
        [field]: value,
      },
    }))
  }

  // Handle form submission - updated to use API
  const handleContinue = () => {
    // Validation
    if (
      profileData.investmentPreferences.geographicalPreferences.length === 0
    ) {
      toast({
        title: "Selection required",
        description: "Please select at least one geographical preference",
        variant: "destructive",
      })
      return
    }

    if (profileData.investmentPreferences.propertyTypes.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one property type",
        variant: "destructive",
      })
      return
    }

    if (
      profileData.investmentPreferences.minimumInvestmentSize >=
      profileData.investmentPreferences.maximumInvestmentSize
    ) {
      toast({
        title: "Invalid range",
        description:
          "Minimum investment size must be less than maximum investment size",
        variant: "destructive",
      })
      return
    }

    // Save data locally in the wizard
    updateWizardData({ investorProfile: profileData })

    // Map to the API expected format
    const apiData = {
      investmentStrategy: "mixed" as const, // Default to mixed
      riskTolerance: ((): "conservative" | "moderate" | "aggressive" => {
        if (profileData.investmentPreferences.riskAppetite === "conservative")
          return "conservative"
        if (
          profileData.investmentPreferences.riskAppetite === "aggressive" ||
          profileData.investmentPreferences.riskAppetite === "growth"
        )
          return "aggressive"
        return "moderate"
      })(),
      investmentHorizon: ((): "short_term" | "medium_term" | "long_term" => {
        const years = profileData.investmentPreferences.investmentHorizon
        if (years <= 3) return "short_term"
        if (years <= 7) return "medium_term"
        return "long_term"
      })(),
      preferredPropertyTypes: profileData.investmentPreferences.propertyTypes,
      preferredLocations:
        profileData.investmentPreferences.geographicalPreferences,
      minimumInvestment:
        profileData.investmentPreferences.minimumInvestmentSize,
      maximumInvestment:
        profileData.investmentPreferences.maximumInvestmentSize,
      targetYield: profileData.performanceExpectations.annualYieldTarget,
      diversificationRequirements:
        profileData.allocationStrategy.diversificationRequirements || "",
      specialRequirements: profileData.additionalRequirements || "",
    }

    // Save data via API
    setIsLoading(true)
    saveInvestorProfile.mutate(apiData, {
      onSettled: () => setIsLoading(false),
    })
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Investor Profile & Preferences Setup
        </CardTitle>
        <CardDescription>
          Define your investment criteria and preferences
        </CardDescription>
        {stepDataQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Loading your data...</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Investment Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Investment Preferences</h3>

          <div className="rounded-md border border-border p-4">
            {/* Geographical Preferences */}
            <div className="mb-6 space-y-2">
              <Label className="text-base font-medium">
                Geographical Preferences
              </Label>
              <p className="text-sm text-muted-foreground">
                Select regions you're interested in investing
              </p>

              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {[
                  { id: "london", label: "London" },
                  { id: "southeast", label: "Southeast England" },
                  { id: "southwest", label: "Southwest England" },
                  { id: "midlands", label: "Midlands" },
                  { id: "north", label: "Northern England" },
                  { id: "scotland", label: "Scotland" },
                  { id: "wales", label: "Wales" },
                  { id: "northern_ireland", label: "Northern Ireland" },
                  { id: "international", label: "International" },
                ].map((region) => (
                  <div key={region.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`geo-${region.id}`}
                      checked={profileData.investmentPreferences.geographicalPreferences.includes(
                        region.id as GeographicalPreference
                      )}
                      onCheckedChange={(checked) =>
                        handleGeoPreferenceChange(
                          region.id as GeographicalPreference,
                          checked === true
                        )
                      }
                    />
                    <Label htmlFor={`geo-${region.id}`}>{region.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Types */}
            <div className="mb-6 space-y-2">
              <Label className="text-base font-medium">Property Types</Label>
              <p className="text-sm text-muted-foreground">
                Select types of properties you're interested in
              </p>

              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {[
                  { id: "luxury", label: "Luxury" },
                  { id: "residential", label: "Residential" },
                  { id: "urban", label: "Urban" },
                  { id: "suburban", label: "Suburban" },
                  { id: "commercial", label: "Commercial" },
                  { id: "mixed_use", label: "Mixed Use" },
                  { id: "retirement", label: "Retirement" },
                ].map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type.id}`}
                      checked={profileData.investmentPreferences.propertyTypes.includes(
                        type.id as any
                      )}
                      onCheckedChange={(checked) =>
                        handlePropertyTypeChange(type.id, checked === true)
                      }
                    />
                    <Label htmlFor={`type-${type.id}`}>{type.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Appetite */}
            <div className="mb-6 space-y-2">
              <Label className="text-base font-medium" htmlFor="risk-appetite">
                Risk Appetite
              </Label>
              <Select
                value={profileData.investmentPreferences.riskAppetite}
                onValueChange={(value) =>
                  handleInvestmentPrefChange(
                    "riskAppetite",
                    value as RiskAppetite
                  )
                }
              >
                <SelectTrigger id="risk-appetite">
                  <SelectValue placeholder="Select risk appetite" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">
                    Conservative (Lower returns, lower risk)
                  </SelectItem>
                  <SelectItem value="moderate">
                    Moderate (Balanced risk-return)
                  </SelectItem>
                  <SelectItem value="balanced">
                    Balanced (Medium risk-return)
                  </SelectItem>
                  <SelectItem value="growth">
                    Growth (Higher returns, higher risk)
                  </SelectItem>
                  <SelectItem value="aggressive">
                    Aggressive (Highest returns, highest risk)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              {/* Targeted Returns */}
              <div className="space-y-2">
                <Label
                  className="text-base font-medium"
                  htmlFor="targeted-returns"
                >
                  Targeted Annual Returns (%)
                </Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    className="flex-1"
                    id="targeted-returns"
                    max={15}
                    min={3}
                    step={0.5}
                    value={[profileData.investmentPreferences.targetedReturns]}
                    onValueChange={(value) =>
                      handleInvestmentPrefChange("targetedReturns", value[0])
                    }
                  />
                  <span className="w-12 text-center font-medium">
                    {profileData.investmentPreferences.targetedReturns.toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
              </div>

              {/* Investment Horizon */}
              <div className="space-y-2">
                <Label
                  className="text-base font-medium"
                  htmlFor="investment-horizon"
                >
                  Investment Horizon (Years)
                </Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    className="flex-1"
                    id="investment-horizon"
                    max={20}
                    min={1}
                    step={1}
                    value={[
                      profileData.investmentPreferences.investmentHorizon,
                    ]}
                    onValueChange={(value) =>
                      handleInvestmentPrefChange("investmentHorizon", value[0])
                    }
                  />
                  <span className="w-12 text-center font-medium">
                    {profileData.investmentPreferences.investmentHorizon} yrs
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Minimum Investment Size */}
              <div className="space-y-2">
                <Label
                  className="text-base font-medium"
                  htmlFor="min-investment"
                >
                  Minimum Investment Size (£)
                </Label>
                <Input
                  id="min-investment"
                  min={100000}
                  step={100000}
                  type="number"
                  value={
                    profileData.investmentPreferences.minimumInvestmentSize
                  }
                  onChange={(e) =>
                    handleInvestmentPrefChange(
                      "minimumInvestmentSize",
                      parseInt(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(
                    profileData.investmentPreferences.minimumInvestmentSize
                  )}
                </p>
              </div>

              {/* Maximum Investment Size */}
              <div className="space-y-2">
                <Label
                  className="text-base font-medium"
                  htmlFor="max-investment"
                >
                  Maximum Investment Size (£)
                </Label>
                <Input
                  id="max-investment"
                  min={100000}
                  step={1000000}
                  type="number"
                  value={
                    profileData.investmentPreferences.maximumInvestmentSize
                  }
                  onChange={(e) =>
                    handleInvestmentPrefChange(
                      "maximumInvestmentSize",
                      parseInt(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(
                    profileData.investmentPreferences.maximumInvestmentSize
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Box Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Buy Box Preferences</h3>

          <div className="rounded-md border border-border p-4">
            {/* Location Focus */}
            <div className="mb-6 space-y-2">
              <Label className="text-base font-medium" htmlFor="location-focus">
                Specific Location Focus (comma-separated)
              </Label>
              <Input
                id="location-focus"
                placeholder="e.g., Kensington, Chelsea, Mayfair, Oxford"
                value={profileData.buyBoxPreferences.locationFocus.join(", ")}
                onChange={(e) => handleLocationFocusInput(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter specific neighborhoods, cities, or areas of interest
              </p>
            </div>

            {/* Property Categories */}
            <div className="mb-6 space-y-2">
              <Label className="text-base font-medium">
                Buy Box Property Categories
              </Label>
              <p className="text-sm text-muted-foreground">
                Select categories of properties for Buy Box packages
              </p>

              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {[
                  { id: "luxury", label: "Luxury" },
                  { id: "residential", label: "Residential" },
                  { id: "urban", label: "Urban" },
                  { id: "suburban", label: "Suburban" },
                  { id: "commercial", label: "Commercial" },
                  { id: "mixed_use", label: "Mixed Use" },
                  { id: "retirement", label: "Retirement" },
                ].map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={profileData.buyBoxPreferences.propertyCategories.includes(
                        category.id as any
                      )}
                      onCheckedChange={(checked) =>
                        handleBuyBoxCategoryChange(
                          category.id,
                          checked === true
                        )
                      }
                    />
                    <Label htmlFor={`category-${category.id}`}>
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              {/* Seller Demographics Importance */}
              <div className="space-y-2">
                <Label
                  className="text-base font-medium"
                  htmlFor="demographics-importance"
                >
                  Seller Demographics Importance
                </Label>
                <Select
                  value={
                    profileData.buyBoxPreferences.sellerDemographicsImportance
                  }
                  onValueChange={(value) =>
                    handleBuyBoxPrefChange(
                      "sellerDemographicsImportance",
                      value as "low" | "medium" | "high"
                    )
                  }
                >
                  <SelectTrigger id="demographics-importance">
                    <SelectValue placeholder="Select importance level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Importance</SelectItem>
                    <SelectItem value="medium">Medium Importance</SelectItem>
                    <SelectItem value="high">High Importance</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  How important are seller demographics in your investment
                  decisions
                </p>
              </div>

              {/* Minimum Property Value */}
              <div className="space-y-2">
                <Label
                  className="text-base font-medium"
                  htmlFor="min-property-value"
                >
                  Minimum Property Value (£)
                </Label>
                <Input
                  id="min-property-value"
                  min={100000}
                  step={50000}
                  type="number"
                  value={
                    profileData.buyBoxPreferences.minimumPropertyValue || 0
                  }
                  onChange={(e) =>
                    handleBuyBoxPrefChange(
                      "minimumPropertyValue",
                      parseInt(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(
                    profileData.buyBoxPreferences.minimumPropertyValue || 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Allocation Strategy */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Allocation Strategy</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              {/* Minimum Buy Box Allocation */}
              <div className="space-y-2">
                <Label
                  className="text-base font-medium"
                  htmlFor="min-allocation"
                >
                  Minimum Buy Box Allocation (£)
                </Label>
                <Input
                  id="min-allocation"
                  min={100000}
                  step={100000}
                  type="number"
                  value={profileData.allocationStrategy.minimumBuyBoxAllocation}
                  onChange={(e) =>
                    handleAllocationChange(
                      "minimumBuyBoxAllocation",
                      parseInt(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(
                    profileData.allocationStrategy.minimumBuyBoxAllocation
                  )}
                </p>
              </div>

              {/* Maximum Buy Box Allocation */}
              <div className="space-y-2">
                <Label
                  className="text-base font-medium"
                  htmlFor="max-allocation"
                >
                  Maximum Buy Box Allocation (£)
                </Label>
                <Input
                  id="max-allocation"
                  min={100000}
                  step={500000}
                  type="number"
                  value={profileData.allocationStrategy.maximumBuyBoxAllocation}
                  onChange={(e) =>
                    handleAllocationChange(
                      "maximumBuyBoxAllocation",
                      parseInt(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(
                    profileData.allocationStrategy.maximumBuyBoxAllocation
                  )}
                </p>
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <Label
                className="text-base font-medium"
                htmlFor="diversification"
              >
                Diversification Requirements
              </Label>
              <Textarea
                id="diversification"
                placeholder="e.g., No more than 25% in any single Buy Box, maximum 40% exposure to any single region"
                value={
                  profileData.allocationStrategy.diversificationRequirements ||
                  ""
                }
                onChange={(e) =>
                  handleAllocationChange(
                    "diversificationRequirements",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium" htmlFor="concentration">
                Concentration Limits
              </Label>
              <Textarea
                id="concentration"
                placeholder="e.g., Maximum 30% concentration in luxury properties, no more than 20% in properties over £2 million"
                value={profileData.allocationStrategy.concentrationLimits || ""}
                onChange={(e) =>
                  handleAllocationChange("concentrationLimits", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Performance Expectations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Performance Expectations</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              {/* Annual Yield Target */}
              <div className="space-y-2">
                <Label className="text-base font-medium" htmlFor="annual-yield">
                  Annual Yield Target (%)
                </Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    className="flex-1"
                    id="annual-yield"
                    max={12}
                    min={2}
                    step={0.5}
                    value={[
                      profileData.performanceExpectations.annualYieldTarget,
                    ]}
                    onValueChange={(value) =>
                      handlePerformanceChange("annualYieldTarget", value[0])
                    }
                  />
                  <span className="w-12 text-center font-medium">
                    {profileData.performanceExpectations.annualYieldTarget.toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
              </div>

              {/* Total Return Target */}
              <div className="space-y-2">
                <Label className="text-base font-medium" htmlFor="total-return">
                  Total Return Target (%)
                </Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    className="flex-1"
                    id="total-return"
                    max={15}
                    min={3}
                    step={0.5}
                    value={[
                      profileData.performanceExpectations.totalReturnTarget,
                    ]}
                    onValueChange={(value) =>
                      handlePerformanceChange("totalReturnTarget", value[0])
                    }
                  />
                  <span className="w-12 text-center font-medium">
                    {profileData.performanceExpectations.totalReturnTarget.toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <Label className="text-base font-medium" htmlFor="volatility">
                Volatility Tolerance
              </Label>
              <Textarea
                id="volatility"
                placeholder="e.g., Can tolerate up to 10% fluctuation in annual returns, prefer stable income over capital appreciation"
                value={
                  profileData.performanceExpectations.volatilityTolerance || ""
                }
                onChange={(e) =>
                  handlePerformanceChange("volatilityTolerance", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium" htmlFor="benchmarks">
                Performance Benchmarks (comma-separated)
              </Label>
              <Input
                id="benchmarks"
                placeholder="e.g., UK REIT Index, FTSE 100, UK 10-year gilt +4%"
                value={
                  profileData.performanceExpectations.benchmarks?.join(", ") ||
                  ""
                }
                onChange={(e) => handleBenchmarksInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Requirements</h3>

          <div className="space-y-2">
            <Label htmlFor="additional-requirements">
              Any special requirements or preferences
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="additional-requirements"
              placeholder="Enter any additional investment requirements, preferences, or constraints that should be considered..."
              value={profileData.additionalRequirements || ""}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  additionalRequirements: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={isLoading} variant="outline" onClick={onBack}>
          Back to Due Diligence & Legal
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Platform Training"}
        </Button>
      </CardFooter>
    </Card>
  )
}

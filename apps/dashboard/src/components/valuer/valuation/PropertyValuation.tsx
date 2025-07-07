/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
/*eslint-disable max-lines*/
/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable no-nested-ternary */

"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { Textarea } from "@package/ui/textarea"
import { Checkbox } from "@package/ui/checkbox"
import { Label } from "@package/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { Badge } from "@package/ui/badge"
import { Slider } from "@package/ui/slider"
import {
  CheckCircle,
  AlertCircle,
  Building,
  Map,
  Home,
  PoundSterling,
} from "lucide-react"

interface PropertyDetails {
  id: string
  address: string
  postcode: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  yearBuilt: number
  tenure: string
  status: "pending" | "in_progress" | "completed"
}

interface PropertyValuationProps {
  property: PropertyDetails
  onSave: (data: any) => void
}

export function PropertyValuation({
  property,
  onSave,
}: PropertyValuationProps) {
  const [activeTab, setActiveTab] = useState("property_details")
  const [valuationStatus, setValuationStatus] = useState<
    "pending" | "in_progress" | "completed"
  >(property.status)

  // Form states
  const [propertyCondition, setPropertyCondition] = useState({
    exteriorCondition: 3,
    interiorCondition: 3,
    roofCondition: 3,
    foundationCondition: 3,
    plumbingCondition: 3,
    electricalCondition: 3,
  })

  const [propertyFeatures, setPropertyFeatures] = useState({
    garden: false,
    garage: false,
    offStreetParking: false,
    conservatory: false,
    outbuilding: false,
    modernKitchen: false,
    modernBathroom: false,
    openPlanLiving: false,
    periodFeatures: false,
    renovation: false,
  })

  const [locationFactors, setLocationFactors] = useState({
    transport: 3,
    schools: 3,
    amenities: 3,
    crime: 3,
    noiseLevel: 3,
  })

  const [valuationDetails, setValuationDetails] = useState({
    estimatedValue: "",
    valueRange: [0, 0],
    notes: "",
    comparableProperties: "",
    marketTrends: "",
    potentialIssues: "",
  })

  const handlePropertyConditionChange = (
    key: keyof typeof propertyCondition,
    value: number
  ) => {
    setPropertyCondition({
      ...propertyCondition,
      [key]: value,
    })
  }

  const handleFeatureChange = (id: keyof typeof propertyFeatures) => {
    setPropertyFeatures({
      ...propertyFeatures,
      [id]: !propertyFeatures[id],
    })
  }

  const handleLocationFactorChange = (
    key: keyof typeof locationFactors,
    value: number
  ) => {
    setLocationFactors({
      ...locationFactors,
      [key]: value,
    })
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters except commas and dots
    const value = e.target.value.replace(/[^0-9,.]/g, "")
    setValuationDetails({
      ...valuationDetails,
      estimatedValue: value,
    })
  }

  const handleValueRangeChange = (value: number[]) => {
    setValuationDetails({
      ...valuationDetails,
      valueRange: value as [number, number],
    })
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValuationDetails({
      ...valuationDetails,
      notes: e.target.value,
    })
  }

  const handleComparablesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValuationDetails({
      ...valuationDetails,
      comparableProperties: e.target.value,
    })
  }

  const handleMarketTrendsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValuationDetails({
      ...valuationDetails,
      marketTrends: e.target.value,
    })
  }

  const handleIssuesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValuationDetails({
      ...valuationDetails,
      potentialIssues: e.target.value,
    })
  }

  const handleSubmit = () => {
    // Create valuation data
    const valuationData = {
      propertyId: property.id,
      propertyCondition,
      propertyFeatures,
      locationFactors,
      valuationDetails,
      status: valuationStatus,
      completedAt: new Date().toISOString(),
    }

    onSave(valuationData)
  }

  const getConditionLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Poor"
      case 2:
        return "Fair"
      case 3:
        return "Average"
      case 4:
        return "Good"
      case 5:
        return "Excellent"
      default:
        return "Average"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Property Valuation</CardTitle>
            <CardDescription>
              Complete valuation for {property.address}
            </CardDescription>
          </div>
          <Badge
            className={`
              ${valuationStatus === "pending" ? "bg-amber-500" : ""}
              ${valuationStatus === "in_progress" ? "bg-blue-500" : ""}
              ${valuationStatus === "completed" ? "bg-green-500" : ""}
            `}
          >
            {valuationStatus === "pending"
              ? "Pending"
              : valuationStatus === "in_progress"
                ? "In Progress"
                : "Completed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="property_details"
              className="flex items-center gap-2"
            >
              <Building className="size-4" />
              <span>Property Details</span>
            </TabsTrigger>
            <TabsTrigger
              value="property_condition"
              className="flex items-center gap-2"
            >
              <Home className="size-4" />
              <span>Condition</span>
            </TabsTrigger>
            <TabsTrigger
              value="location_analysis"
              className="flex items-center gap-2"
            >
              <Map className="size-4" />
              <span>Location</span>
            </TabsTrigger>
            <TabsTrigger value="valuation" className="flex items-center gap-2">
              <PoundSterling className="size-4" />
              <span>Valuation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="property_details" className="mt-4 space-y-4">
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={property.address} readOnly />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input id="postcode" value={property.postcode} readOnly />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Input
                  id="propertyType"
                  value={property.propertyType}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="tenure">Tenure</Label>
                <Input id="tenure" value={property.tenure} readOnly />
              </div>
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  value={property.bedrooms.toString()}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  value={property.bathrooms.toString()}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  value={property.yearBuilt.toString()}
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Property Features</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="garden"
                    checked={propertyFeatures.garden}
                    onCheckedChange={() => handleFeatureChange("garden")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="garden" className="font-medium">
                      Garden
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Property has a garden
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="garage"
                    checked={propertyFeatures.garage}
                    onCheckedChange={() => handleFeatureChange("garage")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="garage" className="font-medium">
                      Garage
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Property has a garage
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="offStreetParking"
                    checked={propertyFeatures.offStreetParking}
                    onCheckedChange={() =>
                      handleFeatureChange("offStreetParking")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="offStreetParking" className="font-medium">
                      Off-street Parking
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Property has off-street parking
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="conservatory"
                    checked={propertyFeatures.conservatory}
                    onCheckedChange={() => handleFeatureChange("conservatory")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="conservatory" className="font-medium">
                      Conservatory
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Property has a conservatory
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="outbuilding"
                    checked={propertyFeatures.outbuilding}
                    onCheckedChange={() => handleFeatureChange("outbuilding")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="outbuilding" className="font-medium">
                      Outbuilding
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Property has an outbuilding
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="modernKitchen"
                    checked={propertyFeatures.modernKitchen}
                    onCheckedChange={() => handleFeatureChange("modernKitchen")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="modernKitchen" className="font-medium">
                      Modern Kitchen
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Property has a modern kitchen
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="modernBathroom"
                    checked={propertyFeatures.modernBathroom}
                    onCheckedChange={() =>
                      handleFeatureChange("modernBathroom")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="modernBathroom" className="font-medium">
                      Modern Bathroom
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Property has a modern bathroom
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="openPlanLiving"
                    checked={propertyFeatures.openPlanLiving}
                    onCheckedChange={() =>
                      handleFeatureChange("openPlanLiving")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="openPlanLiving" className="font-medium">
                      Open Plan Living
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Property has open plan living space
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="periodFeatures"
                    checked={propertyFeatures.periodFeatures}
                    onCheckedChange={() =>
                      handleFeatureChange("periodFeatures")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="periodFeatures" className="font-medium">
                      Period Features
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Property has period features
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="renovation"
                    checked={propertyFeatures.renovation}
                    onCheckedChange={() => handleFeatureChange("renovation")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="renovation" className="font-medium">
                      Recently Renovated
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Property has been recently renovated
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="property_condition" className="mt-4 space-y-6">
            <div>
              <div className="mb-2 flex justify-between">
                <Label
                  htmlFor="exteriorCondition"
                  className="text-base font-medium"
                >
                  Exterior Condition
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(propertyCondition.exteriorCondition)}
                </span>
              </div>
              <Slider
                id="exteriorCondition"
                max={5}
                min={1}
                step={1}
                value={[propertyCondition.exteriorCondition]}
                onValueChange={(value) =>
                  handlePropertyConditionChange("exteriorCondition", value[0])
                }
                className="mb-6"
              />

              <div className="mb-2 flex justify-between">
                <Label
                  htmlFor="interiorCondition"
                  className="text-base font-medium"
                >
                  Interior Condition
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(propertyCondition.interiorCondition)}
                </span>
              </div>
              <Slider
                id="interiorCondition"
                max={5}
                min={1}
                step={1}
                value={[propertyCondition.interiorCondition]}
                onValueChange={(value) =>
                  handlePropertyConditionChange("interiorCondition", value[0])
                }
                className="mb-6"
              />

              <div className="mb-2 flex justify-between">
                <Label
                  htmlFor="roofCondition"
                  className="text-base font-medium"
                >
                  Roof Condition
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(propertyCondition.roofCondition)}
                </span>
              </div>
              <Slider
                id="roofCondition"
                max={5}
                min={1}
                step={1}
                value={[propertyCondition.roofCondition]}
                onValueChange={(value) =>
                  handlePropertyConditionChange("roofCondition", value[0])
                }
                className="mb-6"
              />

              <div className="mb-2 flex justify-between">
                <Label
                  htmlFor="foundationCondition"
                  className="text-base font-medium"
                >
                  Foundation Condition
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(propertyCondition.foundationCondition)}
                </span>
              </div>
              <Slider
                id="foundationCondition"
                max={5}
                min={1}
                step={1}
                value={[propertyCondition.foundationCondition]}
                onValueChange={(value) =>
                  handlePropertyConditionChange("foundationCondition", value[0])
                }
                className="mb-6"
              />

              <div className="mb-2 flex justify-between">
                <Label
                  htmlFor="plumbingCondition"
                  className="text-base font-medium"
                >
                  Plumbing Condition
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(propertyCondition.plumbingCondition)}
                </span>
              </div>
              <Slider
                id="plumbingCondition"
                max={5}
                min={1}
                step={1}
                value={[propertyCondition.plumbingCondition]}
                onValueChange={(value) =>
                  handlePropertyConditionChange("plumbingCondition", value[0])
                }
                className="mb-6"
              />

              <div className="mb-2 flex justify-between">
                <Label
                  htmlFor="electricalCondition"
                  className="text-base font-medium"
                >
                  Electrical Condition
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(propertyCondition.electricalCondition)}
                </span>
              </div>
              <Slider
                id="electricalCondition"
                max={5}
                min={1}
                step={1}
                value={[propertyCondition.electricalCondition]}
                onValueChange={(value) =>
                  handlePropertyConditionChange("electricalCondition", value[0])
                }
              />
            </div>

            <div className="mt-6">
              <Label htmlFor="potentialIssues" className="text-lg font-medium">
                Potential Issues
              </Label>
              <Textarea
                id="potentialIssues"
                placeholder="Note any structural concerns, damp issues, or needed repairs..."
                className="mt-2"
                value={valuationDetails.potentialIssues}
                onChange={handleIssuesChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="location_analysis" className="mt-4 space-y-6">
            <div>
              <div className="mb-2 flex justify-between">
                <Label htmlFor="transport" className="text-base font-medium">
                  Transport Links
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(locationFactors.transport)}
                </span>
              </div>
              <Slider
                id="transport"
                max={5}
                min={1}
                step={1}
                value={[locationFactors.transport]}
                onValueChange={(value) =>
                  handleLocationFactorChange("transport", value[0])
                }
                className="mb-6"
              />

              <div className="mb-2 flex justify-between">
                <Label htmlFor="schools" className="text-base font-medium">
                  Schools
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(locationFactors.schools)}
                </span>
              </div>
              <Slider
                id="schools"
                max={5}
                min={1}
                step={1}
                value={[locationFactors.schools]}
                onValueChange={(value) =>
                  handleLocationFactorChange("schools", value[0])
                }
                className="mb-6"
              />

              <div className="mb-2 flex justify-between">
                <Label htmlFor="amenities" className="text-base font-medium">
                  Local Amenities
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(locationFactors.amenities)}
                </span>
              </div>
              <Slider
                id="amenities"
                max={5}
                min={1}
                step={1}
                value={[locationFactors.amenities]}
                onValueChange={(value) =>
                  handleLocationFactorChange("amenities", value[0])
                }
                className="mb-6"
              />

              <div className="mb-2 flex justify-between">
                <Label htmlFor="crime" className="text-base font-medium">
                  Crime Rate (lower is better)
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(6 - locationFactors.crime)}
                </span>
              </div>
              <Slider
                id="crime"
                max={5}
                min={1}
                step={1}
                value={[locationFactors.crime]}
                onValueChange={(value) =>
                  handleLocationFactorChange("crime", value[0])
                }
                className="mb-6"
              />

              <div className="mb-2 flex justify-between">
                <Label htmlFor="noiseLevel" className="text-base font-medium">
                  Noise Level (lower is better)
                </Label>
                <span className="text-sm font-medium">
                  {getConditionLabel(6 - locationFactors.noiseLevel)}
                </span>
              </div>
              <Slider
                id="noiseLevel"
                max={5}
                min={1}
                step={1}
                value={[locationFactors.noiseLevel]}
                onValueChange={(value) =>
                  handleLocationFactorChange("noiseLevel", value[0])
                }
              />
            </div>

            <div className="mt-6">
              <Label htmlFor="marketTrends" className="text-lg font-medium">
                Local Market Trends
              </Label>
              <Textarea
                id="marketTrends"
                placeholder="Describe the current market trends in the area..."
                className="mt-2"
                value={valuationDetails.marketTrends}
                onChange={handleMarketTrendsChange}
              />
            </div>
          </TabsContent>

          <TabsContent value="valuation" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="estimatedValue" className="text-lg font-medium">
                  Estimated Value
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-2.5">£</span>
                  <Input
                    id="estimatedValue"
                    className="pl-8"
                    placeholder="000,000"
                    value={valuationDetails.estimatedValue}
                    onChange={handleValueChange}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <Label htmlFor="valueRange" className="text-lg font-medium">
                    Value Range (£000s)
                  </Label>
                  <span className="text-sm font-medium">
                    £{valuationDetails.valueRange[0]},000 - £
                    {valuationDetails.valueRange[1]},000
                  </span>
                </div>
                <Slider
                  id="valueRange"
                  min={100}
                  max={1000}
                  step={5}
                  value={valuationDetails.valueRange}
                  onValueChange={handleValueRangeChange}
                />
              </div>

              <div>
                <Label
                  htmlFor="comparableProperties"
                  className="text-lg font-medium"
                >
                  Comparable Properties
                </Label>
                <Textarea
                  id="comparableProperties"
                  placeholder="List comparable properties in the area with their sale prices..."
                  className="mt-2"
                  value={valuationDetails.comparableProperties}
                  onChange={handleComparablesChange}
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-lg font-medium">
                  Valuation Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about the valuation..."
                  className="mt-2"
                  value={valuationDetails.notes}
                  onChange={handleNotesChange}
                />
              </div>

              {valuationStatus === "completed" ? (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CheckCircle className="size-4 text-green-500" />
                  <AlertTitle className="text-green-500">
                    Valuation Completed
                  </AlertTitle>
                  <AlertDescription>
                    This property has been successfully valued and report
                    issued.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="mt-4 border-amber-200 bg-amber-50">
                  <AlertCircle className="size-4 text-amber-500" />
                  <AlertTitle className="text-amber-500">
                    Draft Valuation
                  </AlertTitle>
                  <AlertDescription>
                    Complete all sections before finalizing the valuation.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() =>
              setActiveTab(
                activeTab === "property_details"
                  ? "property_details"
                  : activeTab === "property_condition"
                    ? "property_details"
                    : activeTab === "location_analysis"
                      ? "property_condition"
                      : "location_analysis"
              )
            }
          >
            Back
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() =>
              setActiveTab(
                activeTab === "property_details"
                  ? "property_condition"
                  : activeTab === "property_condition"
                    ? "location_analysis"
                    : activeTab === "location_analysis"
                      ? "valuation"
                      : "valuation"
              )
            }
          >
            {activeTab === "valuation" ? "Review Property Details" : "Next"}
          </Button>
          <Button
            onClick={() => {
              setValuationStatus("completed")
              handleSubmit()
            }}
          >
            {activeTab === "valuation" ? "Complete Valuation" : "Save Draft"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

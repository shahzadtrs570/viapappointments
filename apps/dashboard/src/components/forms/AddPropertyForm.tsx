/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable import/named*/

"use client"

const PropertyDocumentType = {
  DEED: "DEED",
  FLOOR_PLAN: "FLOOR_PLAN",
  ENERGY_CERTIFICATE: "ENERGY_CERTIFICATE",
  SURVEY: "SURVEY",
  PROPERTY_TAX: "PROPERTY_TAX",
  INSURANCE: "INSURANCE",
  PHOTO: "PHOTO",
  OTHER: "OTHER",
}

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { PropertyType, PropertyCondition } from "@/mock-data/types"
import { ChevronRight, ChevronLeft, Upload } from "lucide-react"
import { Checkbox } from "@package/ui/checkbox"

const propertyTypes = Object.values(PropertyType)
const propertyConditions = Object.values(PropertyCondition)
const documentTypes = Object.values(PropertyDocumentType)

type Step = "details" | "features" | "address" | "documents"

export function AddPropertyForm() {
  const [currentStep, setCurrentStep] = useState<Step>("details")
  const [formData, setFormData] = useState({
    // Property Details
    propertyType: "",
    condition: "",
    bedroomCount: "",
    bathroomCount: "",
    totalAreaSqM: "",
    estimatedValue: "",
    yearBuilt: "",
    // Property Features
    features: {
      garden: false,
      garage: false,
      offStreetParking: false,
      conservatory: false,
      outbuilding: false,
      modernKitchen: false,
      modernBathroom: false,
      openPlanLiving: false,
      periodFeatures: false,
    },
    // Address
    streetLine1: "",
    streetLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    // Documents
    documents: [] as { type: string; file: File }[],
  })

  const updateForm = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateFeature = (
    feature: keyof typeof formData.features,
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value,
      },
    }))
  }

  const handleNext = () => {
    if (currentStep === "details") setCurrentStep("features")
    else if (currentStep === "features") setCurrentStep("address")
    else if (currentStep === "address") setCurrentStep("documents")
  }

  const handleBack = () => {
    if (currentStep === "features") setCurrentStep("details")
    else if (currentStep === "address") setCurrentStep("features")
    else if (currentStep === "documents") setCurrentStep("address")
  }

  const handleSubmit = () => {
    // Here you would submit the form data to your API
    console.log("Form submitted:", formData)
  }

  const renderStepIndicator = (
    step: Step,
    index: number,
    isActive: boolean
  ) => {
    const titles = {
      details: "Property Details",
      features: "Property Features",
      address: "Address",
      documents: "Documents",
    }
    const descriptions = {
      details: "Basic information",
      features: "Additional features",
      address: "Location details",
      documents: "Upload files",
    }

    return (
      <>
        <div className={`flex items-center ${!isActive ? "opacity-50" : ""}`}>
          <div
            className={`size-10 rounded-full ${isActive ? "bg-primary text-primary-foreground" : "border-2"} flex items-center justify-center font-medium`}
          >
            {index + 1}
          </div>
          <div className="ml-4">
            <p className="font-medium">{titles[step]}</p>
            <p className="text-sm text-muted-foreground">
              {descriptions[step]}
            </p>
          </div>
        </div>
        {step !== "documents" && (
          <ChevronRight className="size-4 text-muted-foreground" />
        )}
      </>
    )
  }

  const renderPropertyDetailsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
        <CardDescription>
          Enter the basic information about your property
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) => updateForm("propertyType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) +
                      type.slice(1).toLowerCase().replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => updateForm("condition", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {propertyConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition.charAt(0) +
                      condition.slice(1).toLowerCase().replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bedroomCount">Number of Bedrooms</Label>
            <Input
              type="number"
              id="bedroomCount"
              value={formData.bedroomCount}
              onChange={(e) => updateForm("bedroomCount", e.target.value)}
              placeholder="Enter number of bedrooms"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathroomCount">Number of Bathrooms</Label>
            <Input
              type="number"
              id="bathroomCount"
              value={formData.bathroomCount}
              onChange={(e) => updateForm("bathroomCount", e.target.value)}
              placeholder="Enter number of bathrooms"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAreaSqM">Total Area (m²)</Label>
            <Input
              type="number"
              id="totalAreaSqM"
              value={formData.totalAreaSqM}
              onChange={(e) => updateForm("totalAreaSqM", e.target.value)}
              placeholder="Enter total area"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedValue">Estimated Value (£)</Label>
            <Input
              type="number"
              id="estimatedValue"
              value={formData.estimatedValue}
              onChange={(e) => updateForm("estimatedValue", e.target.value)}
              placeholder="Enter estimated value"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearBuilt">Year Built</Label>
            <Input
              type="number"
              id="yearBuilt"
              value={formData.yearBuilt}
              onChange={(e) => updateForm("yearBuilt", e.target.value)}
              placeholder="Enter year built"
              min="1500"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleNext}>
            Next Step
            <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderPropertyFeaturesStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Property Features</CardTitle>
        <CardDescription>
          Select the features available in your property
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(formData.features).map(([feature, value]) => (
            <div key={feature} className="flex items-start space-x-3">
              <Checkbox
                id={feature}
                checked={value}
                onCheckedChange={(checked) =>
                  updateFeature(
                    feature as keyof typeof formData.features,
                    checked as boolean
                  )
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor={feature} className="font-medium">
                  {feature.split(/(?=[A-Z])/).join(" ")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Property has{" "}
                  {feature
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            Next Step
            <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderAddressStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Address Details</CardTitle>
        <CardDescription>Enter the property location details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="streetLine1">Street Address</Label>
            <Input
              id="streetLine1"
              value={formData.streetLine1}
              onChange={(e) => updateForm("streetLine1", e.target.value)}
              placeholder="Enter street address"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="streetLine2">Address Line 2 (Optional)</Label>
            <Input
              id="streetLine2"
              value={formData.streetLine2}
              onChange={(e) => updateForm("streetLine2", e.target.value)}
              placeholder="Apartment, suite, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => updateForm("city", e.target.value)}
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => updateForm("state", e.target.value)}
              placeholder="Enter state or province"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => updateForm("postalCode", e.target.value)}
              placeholder="Enter postal code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => updateForm("country", e.target.value)}
              placeholder="Enter country"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            Next Step
            <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderDocumentsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Property Documents</CardTitle>
        <CardDescription>
          Upload relevant documents for your property
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          <div className="col-span-2">
            <Card className="border-dashed">
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="size-6 text-primary" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold">Upload Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      Required documents: Property deed, Energy certificate,
                      Floor plan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: PDF, JPG, PNG (max 10MB each)
                    </p>
                  </div>
                  <div className="mt-4 space-y-4">
                    {documentTypes.map((type) => (
                      <div key={type} className="flex items-center gap-4">
                        <Label htmlFor={`document-${type}`} className="flex-1">
                          {type.charAt(0) +
                            type.slice(1).toLowerCase().replace("_", " ")}
                        </Label>
                        <Input
                          type="file"
                          id={`document-${type}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setFormData((prev) => ({
                                ...prev,
                                documents: [
                                  ...prev.documents.filter(
                                    (doc) => doc.type !== type
                                  ),
                                  { type, file },
                                ],
                              }))
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button onClick={handleSubmit}>Submit Property</Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        {renderStepIndicator("details", 0, currentStep === "details")}
        {renderStepIndicator("features", 1, currentStep === "features")}
        {renderStepIndicator("address", 2, currentStep === "address")}
        {renderStepIndicator("documents", 3, currentStep === "documents")}
      </div>

      {currentStep === "details" && renderPropertyDetailsStep()}
      {currentStep === "features" && renderPropertyFeaturesStep()}
      {currentStep === "address" && renderAddressStep()}
      {currentStep === "documents" && renderDocumentsStep()}
    </div>
  )
}

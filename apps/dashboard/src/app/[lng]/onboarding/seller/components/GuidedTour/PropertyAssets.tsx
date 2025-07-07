/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
"use client"

import { useState, useEffect } from "react"
import { CheckSquare, Square, InfoIcon } from "lucide-react"
import { Label } from "@package/ui/label"
import { Button } from "@package/ui/button"
import { Textarea } from "@package/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@package/ui/tooltip"

export interface PropertyAssetsData {
  features: string[]
  renovations: string[]
  specialNotes: string
}

interface PropertyAssetsProps {
  data?: PropertyAssetsData
  onDataChange: (data: PropertyAssetsData) => void
}

export function PropertyAssets({ data, onDataChange }: PropertyAssetsProps) {
  const [assetsData, setAssetsData] = useState<PropertyAssetsData>({
    features: data?.features || [],
    renovations: data?.renovations || [],
    specialNotes: data?.specialNotes || "",
  })

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onDataChange(assetsData)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [JSON.stringify(assetsData), onDataChange])

  const handleFeatureToggle = (feature: string) => {
    setAssetsData((prev) => {
      const features = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature]

      return { ...prev, features }
    })
  }

  const handleRenovationToggle = (renovation: string) => {
    setAssetsData((prev) => {
      const renovations = prev.renovations.includes(renovation)
        ? prev.renovations.filter((r) => r !== renovation)
        : [...prev.renovations, renovation]

      return { ...prev, renovations }
    })
  }

  const handleSpecialNotesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAssetsData((prev) => ({
      ...prev,
      specialNotes: e.target.value,
    }))
  }

  // Property features to select from
  const propertyFeatures = [
    { id: "garden", label: "Garden or Outdoor Space" },
    { id: "parking", label: "Private Parking" },
    { id: "balcony", label: "Balcony or Terrace" },
    { id: "storage", label: "Storage Space" },
    { id: "fireplace", label: "Fireplace" },
    { id: "views", label: "Scenic Views" },
    { id: "security", label: "Security System" },
    { id: "elevator", label: "Elevator Access" },
    { id: "garage", label: "Garage" },
    { id: "furnished", label: "Fully Furnished" },
  ]

  // Recent renovations to select from
  const recentRenovations = [
    { id: "kitchen", label: "Kitchen Renovation" },
    { id: "bathroom", label: "Bathroom Renovation" },
    { id: "windows", label: "New Windows" },
    { id: "roof", label: "Roof Replacement" },
    { id: "insulation", label: "Improved Insulation" },
    { id: "heating", label: "Heating System" },
    { id: "electrical", label: "Electrical System" },
    { id: "plumbing", label: "Plumbing" },
    { id: "floors", label: "New Flooring" },
    { id: "paint", label: "Fresh Paint" },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          {`These details help us showcase your property's best features and
          understand its true value. Special features can significantly impact
          the viager agreement terms.`}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-base font-medium">Property Features</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="size-8 p-0">
                    <InfoIcon className="size-4" />
                    <span className="sr-only">Feature Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Select all features that apply to your property. These
                    increase both the appeal and potential value of your
                    property.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {propertyFeatures.map((feature) => (
              <button
                key={feature.id}
                type="button"
                className="flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-50"
                onClick={() => handleFeatureToggle(feature.id)}
                aria-pressed={assetsData.features.includes(feature.id)}
              >
                {assetsData.features.includes(feature.id) ? (
                  <CheckSquare className="size-5 text-primary" />
                ) : (
                  <Square className="size-5 text-gray-400" />
                )}
                <span>{feature.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-base font-medium">
              Recent Renovations (Last 10 Years)
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="size-8 p-0">
                    <InfoIcon className="size-4" />
                    <span className="sr-only">Renovation Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {`Recent renovations can significantly increase your
                      property's value. Select all that apply.`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {recentRenovations.map((renovation) => (
              <button
                key={renovation.id}
                className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-50"
                onClick={() => handleRenovationToggle(renovation.id)}
              >
                {assetsData.renovations.includes(renovation.id) ? (
                  <CheckSquare className="size-5 text-primary" />
                ) : (
                  <Square className="size-5 text-gray-400" />
                )}
                <span>{renovation.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Label
            htmlFor="special-notes"
            className="mb-2 block text-base font-medium"
          >
            Special Notes or Features
          </Label>
          <Textarea
            id="special-notes"
            placeholder="Any other notable features, such as historical significance, recent awards, proximity to amenities, etc."
            className="min-h-[120px]"
            value={assetsData.specialNotes}
            onChange={handleSpecialNotesChange}
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          <strong>Srenova Tip:</strong>{" "}
          {`Properties with unique features or
          recent renovations often receive more favorable viager terms. Be sure
          to include all relevant details to maximize your property's value
          assessment.`}
        </p>
      </div>
    </div>
  )
}

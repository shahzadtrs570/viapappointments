/*eslint-disable*/

import type {
  PropertyConditionInput,
  PropertyStatusInput,
  PropertyTypeInput,
  BathroomCountInput,
  BedroomCountInput,
} from "@/app/store/property/propertyDetails"

// Conversion functions for property size
export const convertSqMeterToSqFeet = (sqMeters: number): number => {
  return sqMeters * 10.7639
}

export const convertSqFeetToSqMeter = (sqFeet: number): number => {
  return sqFeet / 10.7639
}

// Helper function to format API data for Redux
export const formatApiDataForRedux = (data: any) => {
  return {
    ...data,
    // Convert Date objects to strings
    createdAt:
      data.createdAt instanceof Date
        ? data.createdAt.toISOString()
        : data.createdAt,
    updatedAt:
      data.updatedAt instanceof Date
        ? data.updatedAt.toISOString()
        : data.updatedAt,
    // Handle nullable fields
    showDocumentUpload:
      data.showDocumentUpload === null ? undefined : data.showDocumentUpload,
    confirmedValue:
      data.confirmedValue === null ? undefined : data.confirmedValue,
  }
}

// Helper function to update manual address data
export const updateManualAddressData = (
  setManualAddressData: React.Dispatch<
    React.SetStateAction<Record<string, unknown> | null>
  >,
  field: string,
  value: string | string[]
) => {
  setManualAddressData((prev) => ({
    ...prev,
    [field]: value,
  }))
}

// Add helper function to map Rightmove property type to our format
export const mapRightmovePropertyType = (type: string): PropertyTypeInput => {
  const typeMap: Record<string, PropertyTypeInput> = {
    H: "house",
    F: "flat",
    B: "bungalow",
    A: "apartment",
  }
  return typeMap[type]
}

// Add helper function to map Rightmove tenure to our format
export const mapRightmoveTenure = (tenure: string): PropertyStatusInput => {
  const tenureMap: Record<string, PropertyStatusInput> = {
    FH: "freehold",
    LH: "leasehold",
  }
  return tenureMap[tenure]
}

// Add helper function to map Rightmove condition to our format
export const mapRightmoveCondition = (
  condition: string | null
): PropertyConditionInput => {
  if (!condition) return "good"
  const conditionMap: Record<string, PropertyConditionInput> = {
    E: "excellent",
    G: "good",
    F: "fair",
    P: "needs_renovation",
  }
  return conditionMap[condition]
}

// Helper function to get suggested questions for chatbot
export const getSuggestedQuestions = (t: any) => {
  return [
    {
      id: "property-type",
      text: t(
        "wizard_property_information:chatbot.suggestedQuestions.property_type"
      ),
      category: "eligibility",
      followUp: ["property-value", "non-standard", "mortgage"],
    },
    {
      id: "property-value",
      text: t(
        "wizard_property_information:chatbot.suggestedQuestions.property_value"
      ),
      category: "process",
      followUp: ["offer-calculation", "property-type", "tax-implications"],
    },
    {
      id: "mortgage",
      text: t(
        "wizard_property_information:chatbot.suggestedQuestions.mortgage"
      ),
      category: "process",
      followUp: ["property-value", "required-repairs", "offer-calculation"],
    },
    {
      id: "required-repairs",
      text: t(
        "wizard_property_information:chatbot.suggestedQuestions.required_repairs"
      ),
      category: "property-rights",
      followUp: ["renovations", "property-value", "non-standard"],
    },
    {
      id: "renovations",
      text: t(
        "wizard_property_information:chatbot.suggestedQuestions.renovations"
      ),
      category: "property-rights",
      followUp: ["required-repairs", "renting", "health-modifications"],
    },
  ]
}

// Helper function to check if file is an image
export const isImageFile = (filename: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
  return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
}

// Helper function to check if file is a PDF
export const isPdfFile = (filename: string) =>
  filename.toLowerCase().endsWith(".pdf")

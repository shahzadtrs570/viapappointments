/*eslint-disable*/

import { z } from "zod"
import type { TFunction } from "i18next"
import type {
  BathroomCountInput,
  BedroomCountInput,
  PropertyConditionInput,
  PropertyDetailsForm,
  PropertyDocument,
  PropertyFeatureInput,
  PropertyStatusInput,
  PropertyTypeInput,
} from "@/app/store/property/propertyDetails"

// Define a specific TFunction type for the wizard_property_information namespace
export type PropertyInfoTFunction = TFunction<
  ["wizard_property_information", "wizard_common"]
>

export const getPropertySchema = (t: PropertyInfoTFunction) =>
  z.object({
    id: z.string().optional(),
    propertyType: z.enum(["house", "flat", "bungalow", "other", "apartment"], {
      required_error: t(
        "wizard_property_information:validation.propertyTypeRequired"
      ),
    }),
    propertyStatus: z.enum(["freehold", "leasehold"], {
      required_error: t(
        "wizard_property_information:validation.propertyStatusRequired"
      ),
    }),
    leaseLength: z.string().optional(),
    bedrooms: z.enum(["1", "2", "3", "4", "5+"], {
      required_error: t(
        "wizard_property_information:validation.bedroomsRequired"
      ),
    }),
    bathrooms: z.enum(["1", "2", "3+"], {
      required_error: t(
        "wizard_property_information:validation.bathroomsRequired"
      ),
    }),
    yearBuilt: z
      .string()
      .min(4, t("wizard_property_information:validation.yearBuiltInvalid")),
    propertySize: z
      .string()
      .min(1, t("wizard_property_information:validation.propertySizeRequired")),
    features: z
      .array(
        z.enum([
          "Garden",
          "Garage",
          "Parking",
          "Central Heating",
          "Double Glazing",
          "Conservatory",
        ])
      )
      .optional(),
    address: z
      .string()
      .min(1, t("wizard_property_information:validation.addressRequired")),
    postcode: z
      .string()
      .min(1, t("wizard_property_information:validation.postcodeRequired")),
    town: z
      .string()
      .min(1, t("wizard_property_information:validation.townRequired")),
    county: z
      .string()
      .min(1, t("wizard_property_information:validation.countyRequired")),
    condition: z.enum(["excellent", "good", "fair", "needs_renovation"], {
      required_error: t(
        "wizard_property_information:validation.conditionRequired"
      ),
    }),
    conditionNotes: z.string().optional(),
    estimatedValue: z
      .string()
      .min(
        1,
        t("wizard_property_information:validation.estimatedValueRequired")
      ),
    showDocumentUpload: z.boolean().optional(),
  })

export type PropertyInfoData = z.infer<ReturnType<typeof getPropertySchema>>

export interface PreviousStepAddress {
  address: string
  postcode: string
  town: string
  county: string
}

export interface PropertyInformationProps {
  onSubmit: (data: PropertyInfoData) => void
  onBack: () => void
  previousStepAddress?: PreviousStepAddress
  defaultValues?: PropertyInfoData & { id?: string }
  readOnly?: boolean
  mode?: "edit" | "create"
  propertyId?: string
}

export interface StoredTempFile {
  id: string
  filename: string
  base64Data: string
  documentType: string
}

export interface RightmoveResponse {
  error?: string
  propertyDetails: {
    type: string
    style: string
    beds: number
    baths: number
    livingRooms: number
    floorArea: number
    yearBuilt: number | null
    tenure: string
    condition: string | null
  }
  features: {
    centralHeating: boolean | null
    parking: string | null
    conservatories: boolean | null
    cloakrooms: boolean | null
  }
  estimatedValue: {
    sales: number
    confidence: {
      sales: string
    }
    standardDeviation: {
      sales: number
    }
  }
  propertyHistory: {
    latestEvent: {
      listingSales: {
        price: number
        status: string
        type: string
        style: string
        beds: number
        media: {
          photoCount: number
        }
      }
    }
  }
}

// Re-export the types for easier access
export type {
  BathroomCountInput,
  BedroomCountInput,
  PropertyConditionInput,
  PropertyDetailsForm,
  PropertyDocument,
  PropertyFeatureInput,
  PropertyStatusInput,
  PropertyTypeInput,
}

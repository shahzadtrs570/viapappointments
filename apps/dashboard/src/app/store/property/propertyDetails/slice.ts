/*eslint-disable  @typescript-eslint/no-unnecessary-condition*/
/*eslint-disable  @typescript-eslint/no-explicit-any*/
/*eslint-disable  import/order*/
/*eslint-disable  import/order*/
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/app/store"

// Input Types
export type PropertyTypeInput =
  | "house"
  | "flat"
  | "bungalow"
  | "other"
  | "apartment"
export type PropertyStatusInput = "freehold" | "leasehold"
export type BedroomCountInput = "1" | "2" | "3" | "4" | "5+"
export type BathroomCountInput = "1" | "2" | "3+"
export type PropertyConditionInput =
  | "excellent"
  | "good"
  | "fair"
  | "needs_renovation"
export type PropertyFeatureInput =
  | "Garden"
  | "Garage"
  | "Parking"
  | "Central Heating"
  | "Double Glazing"
  | "Conservatory"

// Document interfaces
export interface PropertyPhoto {
  id: string
  filename: string
  fileUrl: string
  contentType: string
}

export interface PropertyDocument {
  id: string
  filename: string
  fileUrl: string
  documentType: string
  verified: boolean
  isTemp?: boolean
}

// Property Details Interface
export interface PropertyDetailsForm {
  id?: string
  address: string
  postcode: string
  town: string
  county: string
  propertyType?: PropertyTypeInput
  propertyStatus?: PropertyStatusInput
  leaseLength?: string
  bedrooms?: BedroomCountInput
  bathrooms?: BathroomCountInput
  yearBuilt: string
  propertySize: string
  estimatedValue: string
  features: PropertyFeatureInput[]
  condition?: PropertyConditionInput
  conditionNotes?: string
  photos: PropertyPhoto[]
  documents: PropertyDocument[]
  fullAddressData?: Record<string, any> // Full address data from lookup service
  showDocumentUpload?: boolean
}

// API Response type
export interface PropertyDetailsApiData {
  id?: string
  propertyType?: string
  bedroomCount?: number
  bathroomCount?: number
  totalAreaSqM?: number
  condition?: string
  estimatedValue?: number
  confirmedValue?: number | null
  features?: string[]
  createdAt?: string
  updatedAt?: string
  showDocumentUpload?: boolean
  address?: {
    id?: string
    streetLine1?: string
    city?: string
    postalCode?: string
    state?: string
    country?: string
    addressData?: Record<string, any> // Full address data from lookup service
  }
  sellerProperties?: Array<{
    id: string
    sellerId: string
    propertyId: string
    ownershipPercentage: number
    seller?: {
      id: string
      firstName: string
      lastName: string
      email?: string
    }
  }>
}

// Update the removeDocument action type
export interface RemoveDocumentPayload {
  id: string
  documentType: string
}

interface PropertyDetailsState {
  formData: PropertyDetailsForm
  apiData: PropertyDetailsApiData | null
  isLoading: boolean
  error: string | null
}

const initialFormData: PropertyDetailsForm = {
  address: "",
  postcode: "",
  town: "",
  county: "",
  yearBuilt: "",
  propertySize: "",
  estimatedValue: "",
  features: [],
  photos: [],
  documents: [],
}

const initialState: PropertyDetailsState = {
  formData: initialFormData,
  apiData: null,
  isLoading: false,
  error: null,
}

// Helper function to ensure formData is initialized
const ensureFormData = (state: PropertyDetailsState): PropertyDetailsState => {
  if (!state || !state.formData) {
    return initialState
  }
  return state
}

// Slice
const propertyDetailsSlice = createSlice({
  name: "propertyDetails",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      safeState.formData.address = action.payload
    },
    setPostcode: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      safeState.formData.postcode = action.payload
    },
    setTown: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      safeState.formData.town = action.payload
    },
    setCounty: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      safeState.formData.county = action.payload
    },
    setPropertyType: (state, action: PayloadAction<PropertyTypeInput>) => {
      const safeState = ensureFormData(state)
      safeState.formData.propertyType = action.payload
    },
    setPropertyStatus: (state, action: PayloadAction<PropertyStatusInput>) => {
      const safeState = ensureFormData(state)
      safeState.formData.propertyStatus = action.payload
    },
    setLeaseLength: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      safeState.formData.leaseLength = action.payload
    },
    setBedrooms: (state, action: PayloadAction<BedroomCountInput>) => {
      const safeState = ensureFormData(state)
      safeState.formData.bedrooms = action.payload
    },
    setBathrooms: (state, action: PayloadAction<BathroomCountInput>) => {
      const safeState = ensureFormData(state)
      safeState.formData.bathrooms = action.payload
    },
    setYearBuilt: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      safeState.formData.yearBuilt = action.payload
    },
    setPropertySize: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      safeState.formData.propertySize = action.payload
    },
    setEstimatedValue: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      safeState.formData.estimatedValue = action.payload
    },
    setCondition: (state, action: PayloadAction<PropertyConditionInput>) => {
      const safeState = ensureFormData(state)
      safeState.formData.condition = action.payload
    },
    setConditionNotes: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      safeState.formData.conditionNotes = action.payload
    },
    setShowDocumentUpload: (state, action: PayloadAction<boolean>) => {
      const safeState = ensureFormData(state)
      safeState.formData.showDocumentUpload = action.payload
    },
    addFeature: (state, action: PayloadAction<PropertyFeatureInput>) => {
      const safeState = ensureFormData(state)
      safeState.formData.features.push(action.payload)
    },
    removeFeature: (state, action: PayloadAction<PropertyFeatureInput>) => {
      const safeState = ensureFormData(state)
      safeState.formData.features = safeState.formData.features.filter(
        (feature) => feature !== action.payload
      )
    },
    addPhoto: (state, action: PayloadAction<PropertyPhoto>) => {
      const safeState = ensureFormData(state)
      if (!safeState.formData.photos) {
        safeState.formData.photos = []
      }
      safeState.formData.photos.push(action.payload)
    },
    removePhoto: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      if (safeState.formData.photos) {
        safeState.formData.photos = safeState.formData.photos.filter(
          (photo) => photo.id !== action.payload
        )
      }
    },
    addTempDocument: (state, action: PayloadAction<PropertyDocument>) => {
      const safeState = ensureFormData(state)
      if (!safeState.formData.documents) {
        safeState.formData.documents = []
      }
      safeState.formData.documents.push({
        ...action.payload,
        isTemp: true,
      })
    },
    addDocument: (state, action: PayloadAction<PropertyDocument>) => {
      const safeState = ensureFormData(state)
      if (!safeState.formData.documents) {
        safeState.formData.documents = []
      }
      safeState.formData.documents = safeState.formData.documents.filter(
        (doc) =>
          !(
            doc.isTemp &&
            doc.documentType === action.payload.documentType &&
            doc.filename === action.payload.filename
          )
      )
      safeState.formData.documents.push({
        ...action.payload,
        isTemp: false,
      })
    },
    removeDocument: (state, action: PayloadAction<RemoveDocumentPayload>) => {
      const safeState = ensureFormData(state)
      if (!safeState.formData.documents) {
        safeState.formData.documents = []
      }
      safeState.formData.documents = safeState.formData.documents.filter(
        (doc) =>
          !(
            doc.id === action.payload.id &&
            doc.documentType === action.payload.documentType
          )
      )
    },
    setDocumentVerified: (
      state,
      action: PayloadAction<{ documentId: string; verified: boolean }>
    ) => {
      const safeState = ensureFormData(state)
      if (safeState.formData.documents) {
        const document = safeState.formData.documents.find(
          (doc) => doc.id === action.payload.documentId
        )
        if (document) {
          document.verified = action.payload.verified
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      const safeState = ensureFormData(state)
      safeState.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      const safeState = ensureFormData(state)
      safeState.error = action.payload
    },
    initializeForm: (
      state,
      action: PayloadAction<Partial<PropertyDetailsForm>>
    ) => {
      const safeState = ensureFormData(state)
      safeState.formData = {
        ...initialFormData,
        ...action.payload,
      }
      safeState.error = null
    },
    resetForm: (state) => {
      const safeState = ensureFormData(state)
      safeState.formData = initialFormData
      safeState.error = null
    },
    setApiData: (state, action: PayloadAction<PropertyDetailsApiData>) => {
      const safeState = ensureFormData(state)
      safeState.apiData = action.payload
    },
    updateApiData: (
      state,
      action: PayloadAction<Partial<PropertyDetailsApiData>>
    ) => {
      const safeState = ensureFormData(state)
      if (safeState.apiData) {
        safeState.apiData = { ...safeState.apiData, ...action.payload }
      } else {
        safeState.apiData = action.payload as PropertyDetailsApiData
      }
    },
    mapApiDataToForm: (state) => {
      const safeState = ensureFormData(state)
      if (safeState.apiData) {
        // Map API data to form data
        const apiData = safeState.apiData

        // Only update if we have API data
        if (apiData) {
          // Update form data with API values, mapping as needed
          const formUpdates: Partial<PropertyDetailsForm> = {}

          // Map address
          if (apiData.address) {
            formUpdates.address = apiData.address.streetLine1 || ""
            formUpdates.town = apiData.address.city || ""
            formUpdates.postcode = apiData.address.postalCode || ""
            formUpdates.county = apiData.address.state || ""
          }

          // Map property attributes
          if (apiData.propertyType) {
            // Map API property type to form property type
            const typeMapping: Record<string, PropertyTypeInput> = {
              HOUSE: "house",
              APARTMENT: "flat",
              BUNGALOW: "bungalow",
              OTHER: "other",
            }
            formUpdates.propertyType =
              typeMapping[apiData.propertyType] || undefined
          }

          // Map bedrooms/bathrooms
          if (apiData.bedroomCount) {
            // Convert number to string format
            const bedroomCount =
              apiData.bedroomCount >= 5
                ? "5+"
                : (apiData.bedroomCount.toString() as BedroomCountInput)
            formUpdates.bedrooms = bedroomCount
          }

          if (apiData.bathroomCount) {
            // Convert number to string format
            const bathroomCount =
              apiData.bathroomCount >= 3
                ? "3+"
                : (apiData.bathroomCount.toString() as BathroomCountInput)
            formUpdates.bathrooms = bathroomCount
          }

          // Map property size
          if (apiData.totalAreaSqM) {
            formUpdates.propertySize = apiData.totalAreaSqM.toString()
          }

          // Map condition
          if (apiData.condition) {
            // Map API condition to form condition
            const conditionMapping: Record<string, PropertyConditionInput> = {
              EXCELLENT: "excellent",
              GOOD: "good",
              FAIR: "fair",
              NEEDS_RENOVATION: "needs_renovation",
            }
            formUpdates.condition =
              conditionMapping[apiData.condition] || undefined
          }

          // Map estimated value
          if (apiData.estimatedValue) {
            formUpdates.estimatedValue = apiData.estimatedValue.toString()
          }

          // Update form data preserving existing values for fields not in the API
          safeState.formData = {
            ...safeState.formData,
            ...formUpdates,
            // Preserve ID if it exists
            id: apiData.id || safeState.formData.id,
          }
        }
      }
    },
    setAddressData: (state, action: PayloadAction<Record<string, any>>) => {
      const safeState = ensureFormData(state)
      safeState.formData.fullAddressData = action.payload
    },
    clearTempDocuments: (state, action: PayloadAction<string>) => {
      const safeState = ensureFormData(state)
      if (safeState.formData.documents) {
        safeState.formData.documents = safeState.formData.documents.filter(
          (doc) => !(doc.isTemp && doc.documentType === action.payload)
        )
      }
    },
    convertTempToPermanent: (
      state,
      action: PayloadAction<{
        documentType: string
        propertyId: string
      }>
    ) => {
      const safeState = ensureFormData(state)
      if (safeState.formData.documents) {
        safeState.formData.documents = safeState.formData.documents.map(
          (doc) => {
            if (
              doc.isTemp &&
              doc.documentType === action.payload.documentType
            ) {
              return { ...doc, isTemp: false }
            }
            return doc
          }
        )
      }
    },
  },
})

// Actions
export const {
  setAddress,
  setPostcode,
  setTown,
  setCounty,
  setPropertyType,
  setPropertyStatus,
  setLeaseLength,
  setBedrooms,
  setBathrooms,
  setYearBuilt,
  setPropertySize,
  setEstimatedValue,
  setCondition,
  setConditionNotes,
  setShowDocumentUpload,
  addFeature,
  removeFeature,
  addPhoto,
  removePhoto,
  addTempDocument,
  addDocument,
  removeDocument,
  setDocumentVerified,
  setLoading,
  setError,
  initializeForm,
  resetForm,
  setApiData,
  updateApiData,
  mapApiDataToForm,
  setAddressData,
  clearTempDocuments,
  convertTempToPermanent,
} = propertyDetailsSlice.actions

// Reducer
export const propertyDetailsReducer = propertyDetailsSlice.reducer

// Selectors
export const selectSellerIdsFromProperty = (
  apiData: PropertyDetailsApiData | null
): string[] => {
  if (!apiData?.sellerProperties || apiData.sellerProperties.length === 0) {
    return []
  }

  return apiData.sellerProperties.map((sp) => sp.sellerId)
}

export const selectDocumentsByType = (state: RootState, documentType: string) =>
  state.property.propertyDetails.formData.documents?.filter(
    (doc: PropertyDocument) => doc.documentType === documentType
  ) || []

export const selectTempDocuments = (state: RootState) =>
  state.property.propertyDetails.formData.documents?.filter(
    (doc: PropertyDocument) => doc.isTemp
  ) || []

/*eslint-disable  @typescript-eslint/no-unnecessary-condition*/
/*eslint-disable  @typescript-eslint/no-explicit-any*/
import { createSlice } from "@reduxjs/toolkit"

import type { PayloadAction } from "@reduxjs/toolkit"

// Types
export interface ReviewChecklist {
  financialAdvisor: boolean
  financialSituation: boolean
  carePlans: boolean
  existingMortgages: boolean
}

export interface ReviewConsiderations {
  ownership: boolean
  benefits: boolean
  mortgage: boolean
}

export interface Review {
  id?: string
  propertyId: string
  sellerId: string
  checklist: ReviewChecklist
  considerations: ReviewConsiderations
  coSellerIds?: string[]
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface ReviewSliceState {
  data: Review | null
  loading: boolean
  error: string | null
}

// Default values
const defaultChecklist: ReviewChecklist = {
  financialAdvisor: false,
  financialSituation: false,
  carePlans: false,
  existingMortgages: false,
}

const defaultConsiderations: ReviewConsiderations = {
  ownership: false,
  benefits: false,
  mortgage: false,
}

const initialState: ReviewSliceState = {
  data: null,
  loading: false,
  error: null,
}

// Slice
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReview: (state, action: PayloadAction<Review>) => {
      state.data = action.payload
      state.error = null
    },
    updateReview: (state, action: PayloadAction<Partial<Review>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload }
      }
    },
    updateChecklist: (
      state,
      action: PayloadAction<Partial<ReviewChecklist>>
    ) => {
      if (state.data) {
        state.data.checklist = { ...state.data.checklist, ...action.payload }
      } else if (action.payload) {
        // Initialize state with default values if it doesn't exist
        state.data = {
          propertyId: "",
          sellerId: "",
          checklist: { ...defaultChecklist, ...action.payload },
          considerations: { ...defaultConsiderations },
        }
      }
    },
    updateConsiderations: (
      state,
      action: PayloadAction<Partial<ReviewConsiderations>>
    ) => {
      if (state.data) {
        state.data.considerations = {
          ...state.data.considerations,
          ...action.payload,
        }
      } else if (action.payload) {
        // Initialize state with default values if it doesn't exist
        state.data = {
          propertyId: "",
          sellerId: "",
          checklist: { ...defaultChecklist },
          considerations: { ...defaultConsiderations, ...action.payload },
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearReview: (state) => {
      state.data = null
      state.error = null
    },
    initializeReviewIfNeeded: (
      state,
      action: PayloadAction<{ propertyId: string; sellerId: string }>
    ) => {
      if (!state.data) {
        state.data = {
          propertyId: action.payload.propertyId,
          sellerId: action.payload.sellerId,
          checklist: { ...defaultChecklist },
          considerations: { ...defaultConsiderations },
        }
      } else {
        // Update the IDs if they've changed
        if (
          state.data.propertyId !== action.payload.propertyId ||
          state.data.sellerId !== action.payload.sellerId
        ) {
          state.data.propertyId = action.payload.propertyId
          state.data.sellerId = action.payload.sellerId
        }
      }
    },
    // New action to update the review with the complete API response
    updateWithApiResponse: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        const apiResponse = action.payload.json || action.payload
        state.data = {
          ...state.data,
          id: apiResponse.id,
          propertyId: apiResponse.propertyId,
          sellerId: apiResponse.sellerId,
          checklist: apiResponse.checklist,
          considerations: apiResponse.considerations,
          coSellerIds: apiResponse.coSellerIds,
          status: apiResponse.status,
          createdAt: apiResponse.createdAt,
          updatedAt: apiResponse.updatedAt,
        }
      }
    },
  },
})

// Actions
export const {
  setReview,
  updateReview,
  updateChecklist,
  updateConsiderations,
  setLoading,
  setError,
  clearReview,
  initializeReviewIfNeeded,
  updateWithApiResponse,
} = reviewSlice.actions

// Reducer
export const reviewReducer = reviewSlice.reducer

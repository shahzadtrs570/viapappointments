import { createSlice } from "@reduxjs/toolkit"

import type { PayloadAction } from "@reduxjs/toolkit"

// Types
export interface SolicitorDetails {
  name: string
  firmName: string
  email: string
  phone: string
  address: string
}

export interface Completion {
  id?: string
  choice: string
  solicitor: SolicitorDetails
  propertyId: string
  sellerId: string
}

interface CompletionSliceState {
  data: Completion | null
  loading: boolean
  error: string | null
}

// Default values for solicitor details
const defaultSolicitor: SolicitorDetails = {
  name: "",
  firmName: "",
  email: "",
  phone: "",
  address: "",
}

const initialState: CompletionSliceState = {
  data: {
    propertyId: "",
    sellerId: "",
    choice: "recommend-solicitor",
    solicitor: { ...defaultSolicitor },
  },
  loading: false,
  error: null,
}

// Slice
const completionSlice = createSlice({
  name: "completion",
  initialState,
  reducers: {
    setCompletion: (state, action: PayloadAction<Completion>) => {
      state.data = action.payload
      state.error = null
    },
    updateCompletion: (state, action: PayloadAction<Partial<Completion>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload }
      } else {
        // If no data exists yet, create it with the provided partial data
        // and fill in missing fields with defaults
        state.data = {
          propertyId: action.payload.propertyId || "",
          sellerId: action.payload.sellerId || "",
          choice: action.payload.choice || "recommend-solicitor",
          solicitor: action.payload.solicitor || { ...defaultSolicitor },
          ...action.payload,
        }
      }
    },
    updateSolicitor: (
      state,
      action: PayloadAction<Partial<SolicitorDetails>>
    ) => {
      if (state.data) {
        state.data.solicitor = { ...state.data.solicitor, ...action.payload }
      } else {
        // If no data exists yet, initialize it
        state.data = {
          propertyId: "",
          sellerId: "",
          choice: "recommend-solicitor",
          solicitor: { ...defaultSolicitor, ...action.payload },
        }
      }
    },
    resetSolicitor: (state) => {
      if (state.data) {
        state.data.solicitor = { ...defaultSolicitor }
      }
    },
    setChoice: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.choice = action.payload
      } else {
        // If no data exists yet, initialize it with the choice
        state.data = {
          propertyId: "",
          sellerId: "",
          choice: action.payload,
          solicitor: { ...defaultSolicitor },
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearCompletion: (state) => {
      if (state.data) {
        // Only reset solicitor but maintain the propertyId and sellerId
        state.data = {
          ...state.data,
          choice: "recommend-solicitor",
          solicitor: { ...defaultSolicitor },
        }
      } else {
        state.data = {
          propertyId: "",
          sellerId: "",
          choice: "recommend-solicitor",
          solicitor: { ...defaultSolicitor },
        }
      }
      state.error = null
      state.loading = false
    },
    // New action to initialize data if it doesn't exist
    initializeCompletionIfNeeded: (
      state,
      action: PayloadAction<{ propertyId: string; sellerId: string }>
    ) => {
      if (!state.data) {
        state.data = {
          propertyId: action.payload.propertyId,
          sellerId: action.payload.sellerId,
          choice: "recommend-solicitor",
          solicitor: { ...defaultSolicitor },
        }
      } else if (
        state.data.propertyId !== action.payload.propertyId ||
        state.data.sellerId !== action.payload.sellerId
      ) {
        // Update IDs if they changed
        state.data.propertyId = action.payload.propertyId
        state.data.sellerId = action.payload.sellerId
      }
    },
  },
})

// Actions
export const {
  setCompletion,
  updateCompletion,
  updateSolicitor,
  resetSolicitor,
  setChoice,
  setLoading,
  setError,
  clearCompletion,
  initializeCompletionIfNeeded,
} = completionSlice.actions

// Reducer
export const completionReducer = completionSlice.reducer

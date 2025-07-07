/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createSlice } from "@reduxjs/toolkit"

import type { PayloadAction } from "@reduxjs/toolkit"

// Types
export interface Owner {
  id?: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  phone?: string
  address?: string
  postcode?: string
  town?: string
  county?: string
  useExistingAddress?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface SellerInformationState {
  id?: string
  ownerType: "single" | "couple" | "multiple"
  numberOfOwners: number
  owners: Owner[]
  userId?: string
  createdAt?: string
  updatedAt?: string
  sellerIds?: string[] // Array of seller profile IDs from the backend
}

interface SellerInformationSliceState {
  data: SellerInformationState | null
  loading: boolean
  error: string | null
}

const initialState: SellerInformationSliceState = {
  data: null,
  loading: false,
  error: null,
}

// Slice
const sellerInformationSlice = createSlice({
  name: "sellerInformation",
  initialState,
  reducers: {
    setSellerInformation: (
      state,
      action: PayloadAction<SellerInformationState>
    ) => {
      state.data = action.payload
      state.error = null
    },
    updateSellerInformation: (
      state,
      action: PayloadAction<Partial<SellerInformationState>>
    ) => {
      if (state.data) {
        // If owners are being updated, merge with existing owners
        if (action.payload.owners) {
          const existingOwners = state.data.owners || []
          const updatedOwners = action.payload.owners.map((newOwner, index) => {
            const existingOwner = existingOwners[index]
            // If we have an existing owner, preserve their data
            if (existingOwner) {
              return {
                ...existingOwner, // Keep all existing owner data as base
                ...newOwner, // Apply new owner data
                id: existingOwner.id, // Explicitly preserve ID
                createdAt: existingOwner.createdAt, // Preserve metadata
                updatedAt: existingOwner.updatedAt,
                // Preserve any other important fields that should not be overwritten
                useExistingAddress:
                  newOwner.useExistingAddress ??
                  existingOwner.useExistingAddress,
              }
            }
            // If no existing owner, use new owner data as is
            return newOwner
          })

          // Update state with merged data
          state.data = {
            ...state.data, // Keep all existing state data
            ...action.payload, // Apply new state data
            owners: updatedOwners, // Use our carefully merged owners array
            numberOfOwners: updatedOwners.length, // Update number of owners to match
          }
        } else {
          // If no owners in payload, preserve existing owners and update other fields
          state.data = {
            ...state.data, // Keep existing state
            ...action.payload, // Apply new state data
            owners: state.data.owners, // Explicitly preserve existing owners array
          }
        }
      }
    },
    addOwner: (state, action: PayloadAction<Owner>) => {
      if (state.data) {
        state.data.owners.push(action.payload)
        state.data.numberOfOwners = state.data.owners.length
      }
    },
    updateOwner: (
      state,
      action: PayloadAction<{ index: number; owner: Partial<Owner> }>
    ) => {
      if (state.data && state.data.owners[action.payload.index]) {
        state.data.owners[action.payload.index] = {
          ...state.data.owners[action.payload.index],
          ...action.payload.owner,
        }
      }
    },
    removeOwner: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.owners = state.data.owners.filter(
          (_, index) => index !== action.payload
        )
        state.data.numberOfOwners = state.data.owners.length
      }
    },
    setSellerIds: (state, action: PayloadAction<string[]>) => {
      if (state.data) {
        state.data.sellerIds = action.payload
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearSellerInformation: (state) => {
      state.data = null
      state.error = null
    },
    resetMetaFlags: (state) => {
      state.loading = false
      state.error = null
    },
  },
})

// Actions
export const {
  setSellerInformation,
  updateSellerInformation,
  addOwner,
  updateOwner,
  removeOwner,
  setSellerIds,
  setLoading,
  setError,
  clearSellerInformation,
  resetMetaFlags,
} = sellerInformationSlice.actions

// Reducer
export const sellerInformationReducer = sellerInformationSlice.reducer

// Selectors
export const selectSellerInformation = (state: {
  property: { sellerInformation: SellerInformationSliceState }
}) => state.property.sellerInformation.data

export const selectSellerInformationLoading = (state: {
  property: { sellerInformation: SellerInformationSliceState }
}) => state.property.sellerInformation.loading

export const selectSellerInformationError = (state: {
  property: { sellerInformation: SellerInformationSliceState }
}) => state.property.sellerInformation.error

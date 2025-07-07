/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit"

import type { RootState } from "@/app/store"
import type { PayloadAction } from "@reduxjs/toolkit"

// Types
export interface OfferValuation {
  marketValue: number
  purchasePrice: number
  initialLumpSum: number
  remainingBalance: number
  monthlyPayment: number
  annuityTerm: string
}

export interface OfferProperty {
  propertyId: string
  address: string
  owners: string[]
  titleNumber: string
  tenure: string
  type: string
}

export type OfferStatus =
  | "DRAFT"
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "WITHDRAWN"

// Add new interface for tracking decisions
export interface DecisionLog {
  timestamp: string
  action: string
  details: Record<string, any>
}

// Add decision status type
export type DecisionStatus =
  | "none"
  | "accepted"
  | "declined"
  | "advisor_requested"

// Add interface for advisor confirmation
export interface AdvisorConfirmation {
  hasSharedOrAcknowledged: boolean
  advisorChoice: "shared" | "proceed" | null
  confirmationTimestamp: string | null
}

// Add interface for agreement in principle
export interface AgreementInPrinciple {
  fullName: string
  checked: boolean
}

export interface Offer {
  id?: string
  referenceNumber: string
  dateOfIssue: string
  property: OfferProperty
  valuation: OfferValuation
  status: OfferStatus
  declineReason?: string
  declineDetails?: string
  indexationRate?: number
  agreementType?: "STANDARD" | "CUSTOM"
  occupancyRight?: "FULL" | "PARTIAL" | "NONE"
  // Add new fields for tracking
  advisorConfirmation?: AdvisorConfirmation
  decisionLog?: DecisionLog[]
  // Add agreement in principle data
  agreementInPrinciple?: AgreementInPrinciple
  // Add flags for UI control
  isOfferValid?: boolean
  disableButtons?: boolean
  // Add decision status
  decisionStatus?: DecisionStatus
}

interface OfferSliceState {
  data: Offer | null
  loading: boolean
  error: string | null
}

const initialState: OfferSliceState = {
  data: null,
  loading: false,
  error: null,
}

// Slice
const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    setOffer: (state, action: PayloadAction<Offer>) => {
      state.data = action.payload
      state.error = null
    },
    updateOffer: (state, action: PayloadAction<Partial<Offer>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload }
      }
    },
    updateValuation: (
      state,
      action: PayloadAction<Partial<OfferValuation>>
    ) => {
      if (state.data) {
        state.data.valuation = { ...state.data.valuation, ...action.payload }
      }
    },
    updateStatus: (state, action: PayloadAction<OfferStatus>) => {
      if (state.data) {
        state.data.status = action.payload
      }
    },
    declineOffer: (
      state,
      action: PayloadAction<{ reason: string; details: string }>
    ) => {
      if (state.data) {
        state.data.status = "REJECTED"
        state.data.declineReason = action.payload.reason
        state.data.declineDetails = action.payload.details
      }
    },
    acceptOffer: (state) => {
      if (state.data) {
        state.data.status = "ACCEPTED"
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearOffer: (state) => {
      state.data = null
      state.error = null
    },
    // Add new reducers for decision tracking
    updateAdvisorConfirmation: (
      state,
      action: PayloadAction<{
        hasSharedOrAcknowledged: boolean
        advisorChoice: "shared" | "proceed" | null
      }>
    ) => {
      if (state.data) {
        state.data.advisorConfirmation = {
          hasSharedOrAcknowledged: action.payload.hasSharedOrAcknowledged,
          advisorChoice: action.payload.advisorChoice,
          confirmationTimestamp: action.payload.hasSharedOrAcknowledged
            ? new Date().toISOString()
            : null,
        }

        // Update offer validity based on advisor confirmation
        state.data.isOfferValid =
          action.payload.hasSharedOrAcknowledged &&
          (action.payload.advisorChoice === "shared" ||
            action.payload.advisorChoice === "proceed")
      }
    },
    setOfferValidity: (state, action: PayloadAction<boolean>) => {
      if (state.data) {
        state.data.isOfferValid = action.payload
      }
    },
    setButtonsDisabled: (state, action: PayloadAction<boolean>) => {
      if (state.data) {
        state.data.disableButtons = action.payload
      }
    },
    logDecision: (
      state,
      action: PayloadAction<{
        action: string
        details: Record<string, any>
      }>
    ) => {
      if (state.data) {
        const newLog: DecisionLog = {
          timestamp: new Date().toISOString(),
          action: action.payload.action,
          details: action.payload.details,
        }

        if (!state.data.decisionLog) {
          state.data.decisionLog = []
        }

        state.data.decisionLog.push(newLog)
      }
    },
    setMarketValuation: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.valuation.marketValue = action.payload
        // Update purchase price to be 80% of market value
        state.data.valuation.purchasePrice = action.payload * 0.8
      }
    },
  },
})

// Actions
export const {
  setOffer,
  updateOffer,
  updateValuation,
  updateStatus,
  declineOffer,
  acceptOffer,
  setLoading,
  setError,
  clearOffer,
  // Export new actions
  updateAdvisorConfirmation,
  logDecision,
  setOfferValidity,
  setButtonsDisabled,
  setMarketValuation,
} = offerSlice.actions

// Selectors
export const selectAdvisorConfirmation = (state: RootState) =>
  state.property.offer.data?.advisorConfirmation || {
    hasSharedOrAcknowledged: false,
    advisorChoice: null,
    confirmationTimestamp: null,
  }

export const selectOfferValidity = (state: RootState) =>
  state.property.offer.data?.isOfferValid || false

export const selectButtonsDisabled = (state: RootState) =>
  state.property.offer.data?.disableButtons || false

// Reducer
export const offerReducer = offerSlice.reducer

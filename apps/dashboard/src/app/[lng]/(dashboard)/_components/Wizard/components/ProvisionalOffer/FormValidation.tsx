/*eslint-disable*/

import type {
  DecisionStatus,
  OfferStatus,
} from "@/app/store/property/offer/slice"
import type { TFunction } from "i18next"

export interface OfferData {
  referenceNumber: string
  dateOfIssue: string
  property: {
    propertyId?: string
    address: string
    owners: string[]
    titleNumber: string
    tenure: string
    type: string
  }
  valuation: {
    marketValue: number
    purchasePrice: number
    initialLumpSum: number
    remainingBalance: number
    monthlyPayment: number
    annuityTerm: string
  }
}

export interface ProvisionalOfferState {
  declineReason: string
  declineDetails: string
  showDeclineForm: boolean
  showSpeakHumanForm: boolean
  showAcceptanceConfirmation: boolean
  decisionStatus?: DecisionStatus
}

export interface BalanceState {
  lumpSum: number
  monthly: number
  balancePercent: number
}

export interface ProvisionalOfferProps {
  data: OfferData
  onSubmit: (state: ProvisionalOfferState) => void
  onBack: () => void
  defaultValues?: Partial<ProvisionalOfferState>
  isContinueAgainMode?: boolean
  propertyId?: string
}

export interface ShareOptions {
  title: string
  text: string
  url: string
}

export interface ShareModalProps {
  onClose: () => void
  shareData: ShareOptions
}

// Define an interface for calculation results
export interface OfferCalculations {
  lumpSum: number
  monthly: number
  remainingBalance: number
  totalMonthlyPayments: number
  totalBenefit: number
  netBenefitPercentage: number
  balancePercent: number
}

// Add the DocumentPreview interface after the other interface definitions
export interface DocumentPreview {
  url: string
  name: string
  isOpen: boolean
}

export interface Seller {
  id: string
  firstName: string
  lastName: string
}

export interface BackendData {
  sellers: Array<Seller>
  existingOffer?: {
    id: string
  }
}

export type TranslationParams = {
  amount: string | number
  term?: string
  percentage?: number
  market_value?: string | number
}

export interface ShareButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export interface DocumentPreviewModalProps {
  onClose: () => void
  documentUrl: string
  documentName: string
}

/**
 * Comprehensive calculation function for offer values
 * This function calculates all values needed for the offer display
 * @param params Parameters for the calculation
 * @returns All calculated values
 */
export const calculateOfferValues = (params: {
  marketValue: number
  purchasePrice: number
  minLumpSum: number
  maxLumpSum: number
  minMonthly: number
  maxMonthly: number
  contractDuration: number
  sliderPercent: number
}): OfferCalculations => {
  const { marketValue, contractDuration, sliderPercent } = params

  // Calculate offer price (always 80% of market value)
  const offerPrice = marketValue * 0.8

  // Determine lump sum percentage based on slider position
  const minPercent = 0.1 // 10%
  const maxPercent = 0.4 // 40%
  const lumpSumPercent =
    minPercent + (maxPercent - minPercent) * (sliderPercent / 100)

  // Calculate lump sum
  const lumpSum = offerPrice * lumpSumPercent

  // Calculate monthly portion
  const monthlyTotal = offerPrice - lumpSum

  // Calculate monthly payment
  const monthly = monthlyTotal / (contractDuration * 12)

  // Round values for display
  const roundedLumpSum = Math.round(lumpSum / 1000) * 1000
  const roundedMonthly = Math.round(monthly / 50) * 50

  // Calculate total payments
  const totalMonthlyPayments = roundedMonthly * 12 * contractDuration
  const totalBenefit = roundedLumpSum + totalMonthlyPayments
  const netBenefitPercentage = (totalBenefit / marketValue) * 100
  const balancePercent = (roundedLumpSum / offerPrice) * 100

  return {
    lumpSum: roundedLumpSum,
    monthly: roundedMonthly,
    remainingBalance: monthlyTotal,
    totalMonthlyPayments,
    totalBenefit,
    netBenefitPercentage,
    balancePercent,
  }
}

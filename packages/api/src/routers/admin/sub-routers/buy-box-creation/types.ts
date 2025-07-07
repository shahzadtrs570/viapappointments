/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Buy Box Theme Type
 */
export type BuyBoxThemeType =
  | "location"
  | "property-type"
  | "demographic"
  | "longevity-profile"
  | "custom"

/**
 * Property Type Enum
 */
export type PropertyType =
  | "residential"
  | "commercial"
  | "luxury"
  | "retirement-friendly"
  | "mixed"

/**
 * Ownership Status Enum
 */
export type OwnershipStatus = "freehold" | "leasehold" | "mixed"

/**
 * Property Condition Enum
 */
export type PropertyCondition = "excellent" | "good" | "fair" | "poor" | "mixed"

/**
 * BuyBox Theme definition
 */
export interface BuyBoxTheme {
  name: string
  description: string
  themeType: string
  location?: {
    city?: string
    region?: string
    postalCodes?: string[]
  }
  propertyType?: string[]
  demographicProfile?: Record<string, any>
  additionalCriteria?: string
  targetInvestors?: string[]
}

/**
 * Property Selection for adding to BuyBox
 */
export interface PropertySelection {
  id: string
  sellerDemographics: Record<string, any>
  dueDiligence: Record<string, any>
  documents?: string[]
}

/**
 * Financial Model for BuyBox
 */
export interface FinancialModel {
  totalBouquet: number
  totalMonthlyAnnuity: number
  guaranteedTerms: Record<string, any>
  expectedReturns: Record<string, any>
  riskAnalysis: Record<string, any>
  pricing: Record<string, any>
  cashFlowProjections?: Array<Record<string, any>>
}

/**
 * Compliance Information for BuyBox
 */
export interface ComplianceInfo {
  regulatoryCompliance: Record<string, any>
  legalChecks: Record<string, any>
  documents: Record<string, any>
  internalApproval: Record<string, any>
}

/**
 * Platform Listing information for BuyBox
 */
export interface PlatformListing {
  buyBoxName: string
  shortDescription: string
  longDescription: string
  highlightFeatures: string[]
  investmentHighlights: Record<string, any>
  riskDisclosures: Record<string, any>
  documents: Record<string, any>
  publishStatus: string
  reviewNotes?: string | null
  publishDate?: Date | null
}

/**
 * Investor Engagement settings for BuyBox
 */
export interface InvestorEngagement {
  accessControls: Record<string, any>
  investorCommunication: Record<string, any>
  subscriptionManagement: Record<string, any>
  qAndASettings: Record<string, any>
}

/**
 * Capital Deployment settings for BuyBox
 */
export interface CapitalDeployment {
  fundsManagement: Record<string, any>
  contractExecution: Record<string, any>
  propertyTransfers: Record<string, any>
  sellerPayments: Record<string, any>
}

/**
 * Continuous Management settings for BuyBox
 */
export interface ContinuousManagement {
  reportingSchedule: Record<string, any>
  performanceTracking: Record<string, any>
  investorRelations: Record<string, any>
  complianceReporting: Record<string, any>
}

/**
 * Final Configuration interface
 */
export interface FinalConfiguration {
  launchDate: string
  fundingDeadline: string
  minInvestmentAmount: number
  maxInvestmentAmount: number
  allowPartialFunding: boolean
  enableEarlyAccess: boolean
  earlyAccessGroups?: string[]
  administrativeNotes?: string
  notifyInvestors: boolean
  launchStrategy: "immediate" | "phased" | "waitlist"
  reviewNotes?: string
}

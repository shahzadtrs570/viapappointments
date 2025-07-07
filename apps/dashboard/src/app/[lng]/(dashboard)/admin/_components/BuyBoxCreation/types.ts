import type { WizardData } from "@/components/WizardCore"

// Define types of Buy-Box themes
export type BuyBoxThemeType =
  | "location"
  | "property-type"
  | "demographic"
  | "longevity-profile"
  | "custom"
export type PropertyType =
  | "residential"
  | "commercial"
  | "luxury"
  | "retirement-friendly"
  | "mixed"
export type OwnershipStatus = "freehold" | "leasehold" | "mixed"
export type PropertyCondition = "excellent" | "good" | "fair" | "poor" | "mixed"

// Step 1: Identification & Conceptualization
export interface BuyBoxTheme {
  name: string
  description: string
  themeType: BuyBoxThemeType
  location?: {
    city?: string
    region?: string
    postalCode?: string[]
    country?: string
  }
  propertyType?: PropertyType[]
  demographicProfile?: {
    minAge?: number
    maxAge?: number
    occupancyStatus?: "owner-occupied" | "tenant-occupied" | "mixed" | "vacant"
  }
  additionalCriteria?: string
  targetInvestors?: string[]
}

// Step 2: Property Aggregation & Due Diligence
export interface PropertyInfo {
  id: string
  address: string
  propertyType: PropertyType
  ownershipStatus: OwnershipStatus
  condition: PropertyCondition
  bedrooms: number
  bathrooms: number
  squareMeters: number
  yearBuilt?: number
  estimatedValue: number
  sellerDemographics: {
    age: number
    lifeExpectancy?: number
  }
  dueDiligence: {
    appraisalCompleted: boolean
    appraisalValue?: number
    titleReportReviewed: boolean
    legalReportReviewed: boolean
    encumbrances: boolean
    encumbrancesDetails?: string
  }
  documents?: {
    id: string
    name: string
    type: "appraisal" | "title" | "legal" | "survey" | "other"
    url: string
  }[]
}

// Step 3: Financial Modeling & Valuation
export interface FinancialModel {
  totalBouquet: number
  totalMonthlyAnnuity: number
  guaranteedTerms: {
    minYears: number
    details?: string
  }
  expectedReturns: {
    conservativeYield: number
    targetYield: number
    optimisticYield: number
  }
  riskAnalysis: {
    longevityRisk: "low" | "medium" | "high"
    marketRisk: "low" | "medium" | "high"
    defaultRisk: "low" | "medium" | "high"
    notes?: string
    riskRating: number
  }
  pricing: {
    totalInvestmentPrice: number
    bouquetPercentage: number
    annuityPercentage: number
    managementFees: number
    otherFees?: number
  }
  cashFlowProjections?: {
    year: number
    expectedCashFlow: number
  }[]
}

// Step 4: Compliance & Legal Review
export interface ComplianceInfo {
  regulatoryCompliance: {
    fcaCompliant: boolean
    mifidCompliant: boolean
    otherRegulations?: string[]
  }
  legalChecks: {
    propertyLiensCleared: boolean
    sellerRightsReviewed: boolean
    contractObligationsReviewed: boolean
    issues?: string
  }
  documents: {
    id: string
    name: string
    type: "valuation" | "legal" | "actuarial" | "risk" | "compliance" | "other"
    url: string
  }[]
  internalApproval: {
    approvedBy?: string
    approvalDate?: string
    approvalNotes?: string
  }
}

// Step 5: Platform Listing & Publication
export interface PlatformListing {
  buyBoxName: string
  shortDescription: string
  longDescription: string
  highlightFeatures: string[]
  investmentHighlights: string[]
  riskDisclosures: string[]
  documents: {
    id: string
    name: string
    type: string
    url: string
    isPublic: boolean
  }[]
  publishStatus: "draft" | "pending_review" | "approved" | "published"
  reviewNotes?: string
  publishDate?: string
}

// Step 6: Investor Engagement & Subscription
export interface InvestorEngagement {
  accessControls: {
    restrictedAccess: boolean
    allowedInvestorGroups: string[]
    customInvitations: boolean
  }
  investorCommunication: {
    initialAnnouncementSent: boolean
    announcementDate?: string
    customMessage?: string
    notifyMethod: "email" | "platform" | "both"
  }
  subscriptionManagement: {
    minInvestmentAmount: number
    maxTotalSubscription: number
    subscriptionDeadline: string
    earlyAccessPeriod: {
      enabled: boolean
      startDate?: string
      endDate?: string
      groups: string[]
    }
  }
  qAndASettings: {
    enableLiveQAndA: boolean
    automatedResponses: boolean
    designatedResponders: string[]
  }
}

// Step 7: Capital Deployment & Contract Execution
export interface CapitalDeployment {
  fundsManagement: {
    escrowDetails: string
    accountingContact: string
    fundsReceived: boolean
    totalReceived?: number
  }
  contractExecution: {
    scheduledExecutionDate: string
    legalRepresentative: string
    executionStatus: "pending" | "in_progress" | "completed"
    notes?: string
  }
  propertyTransfers: {
    transferSchedule: string
    registrationStatus: "not_started" | "in_progress" | "completed"
    lienRegistration: boolean
  }
  sellerPayments: {
    bouquetPaymentDate: string
    bouquetPaymentStatus: "pending" | "initiated" | "completed"
    firstAnnuityDate?: string
    paymentProcessingSystem: string
  }
}

// Step 8: Continuous Management & Reporting
export interface ContinuousManagement {
  reportingSchedule: {
    frequency: "monthly" | "quarterly" | "semi_annual" | "annual"
    nextReportDate: string
    includedMetrics: string[]
    automatedDistribution: boolean
  }
  performanceTracking: {
    trackingMetrics: string[]
    benchmarks: string[]
    alertThresholds: {
      yieldAlert: number
      occupancyAlert: number
      otherAlerts: string[]
    }
  }
  investorRelations: {
    primaryContact: string
    communicationFrequency: string
    feedbackMechanism: string
    escalationProcedure: string
  }
  complianceReporting: {
    regulatoryReports: string[]
    internalAudits: boolean
    auditFrequency: string
    complianceOfficer: string
  }
}

// Final Configuration step
export interface FinalConfiguration {
  launchDate: string
  fundingDeadline: string
  minInvestmentAmount: number
  maxInvestmentAmount: number
  allowPartialFunding: boolean
  enableEarlyAccess: boolean
  earlyAccessGroups: string[]
  administrativeNotes: string
  notifyInvestors: boolean
  launchStrategy: "immediate" | "phased" | "waitlist"
  reviewNotes: string
}

// The complete Buy-Box creation wizard data structure
export interface BuyBoxCreationWizardData extends WizardData {
  buyBoxTheme?: BuyBoxTheme
  selectedProperties?: PropertyInfo[]
  financialModel?: FinancialModel
  complianceInfo?: ComplianceInfo
  platformListing?: PlatformListing
  investorEngagement?: InvestorEngagement
  capitalDeployment?: CapitalDeployment
  continuousManagement?: ContinuousManagement
  finalConfiguration?: FinalConfiguration
}

// Define steps for the Buy-Box creation wizard
export const BUYBOX_CREATION_STEPS = [
  {
    id: "theme-conceptualization",
    label: "Identification & Conceptualization",
  },
  { id: "property-aggregation", label: "Property Aggregation & Due Diligence" },
  { id: "financial-modeling", label: "Financial Modeling & Valuation" },
  { id: "compliance-legal", label: "Compliance & Legal Review" },
  { id: "platform-listing", label: "Platform Listing & Publication" },
  { id: "investor-engagement", label: "Investor Engagement & Subscription" },
  { id: "capital-deployment", label: "Capital Deployment & Execution" },
  { id: "continuous-management", label: "Continuous Management & Reporting" },
  { id: "final-configuration", label: "Final Configuration & Submission" },
]

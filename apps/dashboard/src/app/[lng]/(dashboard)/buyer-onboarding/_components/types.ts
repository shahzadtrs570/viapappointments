/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WizardData } from "@/components/WizardCore/types"

// Define types for the different forms of institutional investors
export type InstitutionalInvestorType =
  | "pension_fund"
  | "family_office"
  | "insurance_company"
  | "wealth_manager"
  | "investment_bank"
  | "asset_manager"
  | "sovereign_wealth_fund"
  | "endowment"
  | "other"

// Define geographical preferences
export type GeographicalPreference =
  | "london"
  | "southeast"
  | "southwest"
  | "midlands"
  | "north"
  | "scotland"
  | "wales"
  | "northern_ireland"
  | "international"
  | "other"

// Define property types for investment preferences
export type PropertyType =
  | "luxury"
  | "urban"
  | "suburban"
  | "retirement"
  | "commercial"
  | "mixed_use"
  | "residential"
  | "other"

// Define risk appetite levels
export type RiskAppetite =
  | "conservative"
  | "moderate"
  | "balanced"
  | "growth"
  | "aggressive"

// Property interface for PropertyStatusCard
export interface Property {
  id: string
  image: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  type: string
  status: "pending" | "active" | "sold" | "inactive"
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  yearBuilt?: number
  lotSize?: number
}

// Transaction interface for TransactionExecution
export interface Transaction {
  id: string
  buyBoxId: string
  buyBoxName: string
  transactionDate: string
  amount: number
  status: "pending" | "in_progress" | "completed" | "failed"
  confirmationCode?: string
  notes?: string
}

// Step 1: Initial Inquiry & Platform Introduction
export interface InitialInquiry {
  organisationName: string
  contactName: string
  contactPosition: string
  contactEmail: string
  contactPhone: string
  referralSource?: string
  initialInterestLevel: "low" | "medium" | "high"
  preferredContactMethod: "email" | "phone" | "video_call" | "in_person"
  introductoryCallScheduled: boolean
  introductoryCallDate?: string
  platformOverviewProvided: boolean
  initialQuestionsNotes?: string
}

// Step 2: Qualification & KYC/AML Procedures
export interface QualificationAndKYCAML {
  investorType: InstitutionalInvestorType
  aum: number // Assets under management in GBP
  regulatoryStatus: {
    fcaRegulated: boolean
    fcaReferenceNumber?: string
    otherRegulators?: string[]
  }
  kycDocuments: {
    corporateDocuments: boolean
    articlesOfIncorporation: boolean
    directorsShareholders: boolean
    regulatoryLicenses: boolean
  }
  amlChecks: {
    uboVerification: boolean
    sanctionsScreening: boolean
    sourceFundsVerified: boolean
    enhancedDueDiligence: boolean
    amlNotes?: string
  }
  qualificationStatus: "pending" | "in_progress" | "qualified" | "rejected"
  complianceOfficerNotes?: string
}

// Step 3: Due Diligence & Legal Compliance
export interface DueDiligenceAndLegal {
  legalDocuments: {
    ddqCompleted: boolean
    ddqSubmissionDate?: string
    legalReviewCompleted: boolean
    complianceChecksCompleted: boolean
    outstandingIssues?: string[]
  }
  platformAgreements: {
    masterInvestmentAgreementSigned: boolean
    signatureDate?: string
    confidentialityAgreementSigned: boolean
    ndaSigned: boolean
  }
  liabilityFramework: {
    rolesResponsibilitiesAcknowledged: boolean
    limitationsAcknowledged: boolean
    disputeResolutionAcknowledged: boolean
  }
  dueDiligenceNotes?: string
  ddqaSurveyResults?: Record<string, any>
}

// Step 4: Investor Profile & Preferences Setup
export interface InvestorProfileAndPreferences {
  investmentPreferences: {
    geographicalPreferences: GeographicalPreference[]
    propertyTypes: PropertyType[]
    riskAppetite: RiskAppetite
    targetedReturns: number // Percentage expected annual return
    minimumInvestmentSize: number // In GBP
    maximumInvestmentSize: number // In GBP
    investmentHorizon: number // In years
  }
  buyBoxPreferences: {
    locationFocus: string[]
    propertyCategories: PropertyType[]
    sellerDemographicsImportance: "low" | "medium" | "high"
    minimumPropertyValue?: number
  }
  allocationStrategy: {
    minimumBuyBoxAllocation: number // In GBP
    maximumBuyBoxAllocation: number // In GBP
    diversificationRequirements?: string
    concentrationLimits?: string
  }
  performanceExpectations: {
    annualYieldTarget: number // Percentage
    totalReturnTarget: number // Percentage
    volatilityTolerance?: string
    benchmarks?: string[]
  }
  additionalRequirements?: string
}

// Step 5: Platform Training & Technical Onboarding
export interface PlatformTrainingAndOnboarding {
  userAccounts: {
    primaryAdminCreated: boolean
    additionalUsersCreated: boolean
    numberOfUsers: number
    rolesAssigned: boolean
    twoFactorEnabled: boolean
  }
  accessPermissions: {
    dataRoomAccess: boolean
    reportingAccess: boolean
    transactionAccess: boolean
    adminRights: boolean
    customPermissions?: string[]
  }
  trainingCompleted: {
    platformOverview: boolean
    portfolioManagement: boolean
    reportingDashboards: boolean
    complianceTools: boolean
    dataRoomUsage: boolean
    analyticTools: boolean
  }
  technicalContact: {
    name: string
    email: string
    phone?: string
  }
  onboardingNotes?: string
  portfolioMonitoring?: {
    alertsConfigured: boolean
  }
}

// Step 6: Buy-Box Allocation & Investment Commencement
export interface BuyBoxAllocationAndInvestment {
  presentedBuyBoxes: {
    id: string
    name: string
    presentationDate: string
    investorInterest: "none" | "low" | "medium" | "high"
    followUpRequired: boolean
  }[]
  selectedBuyBoxes: {
    id: string
    name: string
    allocationAmount: number // In GBP
    selectionDate: string
    dueDiligenceStatus: "pending" | "in_progress" | "completed"
  }[]
  dueDiligenceRequests: {
    legalReviewRequested: boolean
    financialAnalysisRequested: boolean
    riskAssessmentRequested: boolean
    additionalInformationRequested: boolean
    additionalRequests?: string
  }
  investmentCommitment: {
    agreementsSigned: boolean
    signatureDate?: string
    capitalCommitted: number // Total in GBP
    fundingScheduleAgreed: boolean
    initialFundingDate?: string
  }
  allocationNotes?: string
}

// Step 7: Transaction Execution
export interface TransactionExecution {
  fundingArrangements: {
    escrowAccountEstablished: boolean
    escrowDetails?: string
    initialFundsReceived: boolean
    amountReceived?: number // In GBP
    fundingCompleted: boolean
  }
  capitalDeployment: {
    deploymentSchedule: string
    contractsExecuted: boolean
    executionDate?: string
    deploymentProgress: number // Percentage complete
  }
  viagerPurchases: {
    completedPurchases: number
    bouquetPaymentsMade: number
    annuitySetupCompleted: boolean
    nextAnnuityPaymentDate?: string
  }
  legalSecurities: {
    legalChargesRegistered: boolean
    securityDocumentation: boolean
    lienRegistrationStatus: "pending" | "in_progress" | "completed"
  }
  executionNotes?: string
}

// Step 8: Monitoring, Reporting & Investor Relations
export interface MonitoringReportingAndRelations {
  reportingSetup: {
    reportingFrequency: "monthly" | "quarterly" | "biannual" | "annual"
    automaticReportingEnabled: boolean
    customReportingRequirements?: string[]
    nextReportDate?: string
  }
  portfolioMonitoring: {
    realTimeAccessEnabled: boolean
    alertsConfigured: boolean
    performanceMetricsTracked: string[]
    benchmarkingSetup: boolean
  }
  investorCommunication: {
    regularCallsScheduled: boolean
    callFrequency?: string
    relationshipManagerAssigned: boolean
    relationshipManagerName?: string
    feedbackMechanismEstablished: boolean
  }
  continuousSupport: {
    complianceAssistanceAvailable: boolean
    strategyAdjustmentProcess: boolean
    escalationProcedure: boolean
  }
  monitoringNotes?: string
}

// Step 9: Secondary Market & Exit Opportunities
export interface SecondaryMarketAndExit {
  secondaryMarketAccess: {
    accessEnabled: boolean
    liquidityOptionsReviewed: boolean
    secondaryMarketTermsAcknowledged: boolean
  }
  exitPlanning: {
    initialInvestmentTerm: number // In years
    autoRenewalOption: boolean
    exitStrategyDiscussed: boolean
    plannedExitDate?: string
  }
  valuationFramework: {
    regularValuationSchedule: boolean
    valuationMethodologyAgreed: boolean
    independentValuationsRequired: boolean
    lastValuationDate?: string
  }
  exitNotes?: string
}

// The complete Buyer Onboarding wizard data structure
export interface BuyerOnboardingData extends WizardData {
  initialInquiry?: InitialInquiry
  qualificationKYCAML?: QualificationAndKYCAML
  dueDiligenceLegal?: DueDiligenceAndLegal
  investorProfile?: InvestorProfileAndPreferences
  platformTraining?: PlatformTrainingAndOnboarding
  buyBoxAllocation?: BuyBoxAllocationAndInvestment
  transactionExecution?: TransactionExecution
  monitoringReporting?: MonitoringReportingAndRelations
  secondaryMarket?: SecondaryMarketAndExit
}

export type InvestmentPreference = {
  minimumInvestment: number
  maximumInvestment: number
  investmentTimeframe: string
  investorType: string
  fundingSource: string
  investmentGoals: string[]
  riskLevel: string
  returnTarget: number
  diversificationPreference: string
  investorExperience: string
  regionalPreferences: string[]
  additionalNotes: string
}

export type PropertyTypePreference = {
  propertyTypes: string[]
  locationPreferences: {
    countries: string[]
    cities: string[]
    regions: string[]
  }
  propertyAgePreference: string
  propertyConditionPreference: string
  managementPreferences: {
    preferredManagementStyle: string
    managementInvolvementLevel: string
    propertyManagerPreference: string
  }
  tenantProfilePreferences: string[]
  esgConsiderations: string[]
  additionalPreferenceNotes: string
}

export type PersonalInformation = {
  title: string
  firstName: string
  lastName: string
  dateOfBirth: string
  email: string
  phone: string
  address: {
    line1: string
    line2: string
    city: string
    county: string
    postcode: string
    country: string
  }
  nationality: string
  taxCountry: string
  taxIdentificationNumber: string
  occupation: string
  employer: string
  sourceOfFunds: string
  politicallyExposed: boolean
  politicallyExposedDetails?: string
}

export type IdentityVerification = {
  verificationStatus: "pending" | "in_progress" | "verified" | "failed"
  documentType: string
  documentNumber?: string
  expiryDate?: string
  verificationMethod: string
  verificationResults?: {
    identityMatch: boolean
    documentAuthenticity: boolean
    faceMatch?: boolean
    addressMatch?: boolean
    sanctionsCheck: boolean
    pepCheck: boolean
  }
  additionalDocuments: {
    documentType: string
    status: "pending" | "submitted" | "approved" | "rejected"
    submitDate?: string
    comments?: string
  }[]
  verificationNotes?: string
}

export type BuyBox = {
  id: string
  name: string
  description: string
  propertyCount: number
  totalValue: number
  expectedYield: number
  riskRating: 1 | 2 | 3 | 4 | 5
  location: string
}

export type BuyBoxAllocation = {
  selectedBuyBoxes: {
    id: string
    name: string
    allocationPercentage: number
    interestLevel: "high" | "medium" | "low"
    dueDiligenceRequested: boolean
    dueDiligenceStatus?: "pending" | "in_progress" | "completed"
    dueDiligenceNotes?: string
  }[]
  commitmentAgreement: boolean
  commitmentNotes?: string
  investmentAmount: number
  fundingMethod: string
  fundingDetails?: string
  allocationNotes?: string
}

export type TransactionExecutionAndMonitoring = {
  transactions: {
    id: string
    buyBoxId: string
    buyBoxName: string
    transactionDate: string
    amount: number
    status: "pending" | "in_progress" | "completed" | "failed"
    confirmationCode?: string
    notes?: string
  }[]
  monitoringPreferences: {
    monitoringFrequency: string
    reportFormat: string
    customMetrics: string[]
    alertThresholds: {
      occupancyDropBelow: number
      yieldDropBelow: number
      maintenanceCostsExceed: number
    }
  }
  monitoringSetup: {
    dashboardAccess: boolean
    emailReports: boolean
    apiAccess: boolean
    alertsConfigured: boolean
  }
  executionNotes?: string
}

export type Wizard = {
  currentStep: number
  investmentPreference?: InvestmentPreference
  propertyTypePreference?: PropertyTypePreference
  personalInformation?: PersonalInformation
  identityVerification?: IdentityVerification
  buyBoxAllocation?: BuyBoxAllocation
  transactionExecution?: TransactionExecutionAndMonitoring
}

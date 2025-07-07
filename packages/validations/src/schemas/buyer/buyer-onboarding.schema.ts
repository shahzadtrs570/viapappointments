import { z } from "zod"

// Schema for Initial Inquiry
export const initialInquirySchema = z.object({
  investmentGoals: z.string().min(1, "Investment goals are required"),
  estimatedInvestmentAmount: z
    .number()
    .min(1, "Investment amount must be greater than 0"),
  preferredContactMethod: z.enum(["email", "phone", "video"]),
  preferredContactTime: z.string().optional(),
  questions: z.string().optional(),
  referralSource: z.string().optional(),
})

// Schema for Qualification KYC/AML
export const qualificationKYCAMLSchema = z.object({
  investorType: z.enum(["individual", "entity"]),
  entityType: z.string().optional(),
  fullLegalName: z.string().min(1, "Legal name is required"),
  dateOfBirth: z.string().optional(),
  taxIdentificationNumber: z.string().min(1, "Tax ID is required"),
  nationality: z.string().min(1, "Nationality is required"),
  residenceCountry: z.string().min(1, "Country of residence is required"),
  isAccreditedInvestor: z.boolean(),
  accreditationDocuments: z.array(z.string()).optional(),
  sourceOfFunds: z.string().min(1, "Source of funds is required"),
  hasPoliticalExposure: z.boolean(),
  politicalExposureDetails: z.string().optional(),
})

// Schema for Due Diligence and Legal
export const dueDiligenceLegalSchema = z.object({
  hasReviewedInvestmentAgreement: z.boolean(),
  hasReviewedOperatingAgreement: z.boolean(),
  hasReviewedPrivacyPolicy: z.boolean(),
  hasReviewedTermsOfService: z.boolean(),
  hasReviewedRiskDisclosures: z.boolean(),
  legalRepresentativeName: z.string().optional(),
  legalRepresentativeContact: z.string().optional(),
  additionalLegalRequirements: z.string().optional(),
  signedDocuments: z.array(z.string()).optional(),
  electronicSignatureConsent: z.boolean(),
})

// Schema for Investor Profile
export const investorProfileSchema = z.object({
  investmentStrategy: z.enum(["passive", "active", "mixed"]),
  riskTolerance: z.enum(["conservative", "moderate", "aggressive"]),
  investmentHorizon: z.enum(["short_term", "medium_term", "long_term"]),
  targetAnnualReturn: z.number().optional(),
  investmentFrequency: z
    .enum(["one_time", "monthly", "quarterly", "annually"])
    .optional(),
  preferredPropertyTypes: z
    .array(z.string())
    .min(1, "Select at least one property type"),
  preferredLocations: z
    .array(z.string())
    .min(1, "Select at least one location"),
  minPropertyValue: z.number().optional(),
  maxPropertyValue: z.number().optional(),
  preferredDiversification: z
    .enum(["single_property", "multiple_properties", "portfolio"])
    .optional(),
  esgPreferences: z.array(z.string()).optional(),
  specialRequirements: z.string().optional(),
})

// Schema for Platform Training
export const platformTrainingSchema = z.object({
  hasCompletedPlatformOrientation: z.boolean(),
  hasCompletedInvestmentWorkshop: z.boolean(),
  hasCompletedPortfolioManagementTraining: z.boolean(),
  hasSetupAccount: z.boolean(),
  hasSetupNotifications: z.boolean(),
  hasTestedInvestmentSimulation: z.boolean(),
  scheduledPersonalTraining: z.boolean(),
  personalTrainingDate: z.string().optional(),
  trainingFeedback: z.string().optional(),
  additionalTrainingRequested: z.string().optional(),
})

// Schema for Buy Box Allocation
export const buyBoxAllocationSchema = z.object({
  selectedBuyBoxIds: z.array(z.string()).min(1, "Select at least one Buy Box"),
  investmentAmountPerBuyBox: z.record(z.string(), z.number()),
  totalAllocation: z.number().min(1, "Total allocation must be greater than 0"),
  allocationStrategy: z.enum(["equal", "weighted", "custom"]),
  allocationNotes: z.string().optional(),
  targetAllocationDate: z.string().optional(),
  reinvestmentPreferences: z
    .enum(["reinvest", "distribute", "decide_later"])
    .optional(),
  hasDiversificationRequirements: z.boolean(),
  diversificationRequirements: z.string().optional(),
})

// Schema for Transaction Execution
export const transactionExecutionSchema = z.object({
  paymentMethod: z.enum(["wire", "ach", "check", "crypto"]),
  bankingInformation: z
    .object({
      accountName: z.string().min(1, "Account name is required"),
      accountNumber: z.string().min(1, "Account number is required"),
      routingNumber: z.string().optional(),
      bankName: z.string().min(1, "Bank name is required"),
      bankAddress: z.string().optional(),
    })
    .optional(),
  cryptoWalletAddress: z.string().optional(),
  transactionDate: z.string().optional(),
  hasReviewedTransactionDetails: z.boolean(),
  hasConfirmedInvestmentAmount: z.boolean(),
  hasSentFunds: z.boolean(),
  fundsReceivedDate: z.string().optional(),
  transactionConfirmationNumber: z.string().optional(),
  investmentActivationDate: z.string().optional(),
})

// Schema for Monitoring and Reporting
export const monitoringReportingSchema = z.object({
  preferredReportingFrequency: z.enum([
    "monthly",
    "quarterly",
    "semi_annually",
    "annually",
  ]),
  additionalMetricsRequested: z.array(z.string()).optional(),
  notificationPreferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
  hasSetupDashboardAlerts: z.boolean(),
  hasScheduledPeriodicCalls: z.boolean(),
  periodicCallFrequency: z
    .enum(["monthly", "quarterly", "semi_annually", "annually"])
    .optional(),
  taxReportingPreferences: z.string().optional(),
  specialReportingRequirements: z.string().optional(),
})

// Schema for Secondary Market
export const secondaryMarketSchema = z.object({
  interestedInSecondaryMarket: z.boolean(),
  expectedHoldingPeriod: z
    .enum(["less_than_1_year", "1_2_years", "3_5_years", "5_plus_years"])
    .optional(),
  secondaryMarketPreferences: z.array(z.string()).optional(),
  hasReviewedLiquidityOptions: z.boolean(),
  liquidityRequirements: z.string().optional(),
  exitStrategyPreferences: z
    .enum(["sell_on_platform", "refinance", "hold_long_term"])
    .optional(),
  hasTrustedBeneficiaries: z.boolean(),
  beneficiaryInformation: z
    .array(
      z.object({
        name: z.string(),
        relationship: z.string(),
        contactInformation: z.string().optional(),
      })
    )
    .optional(),
})

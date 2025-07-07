import { z } from "zod"

/**
 * Schema for Buy Box Theme
 * Used for the first step of Buy Box creation - Theme Conceptualisation
 */
export const buyBoxThemeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  themeType: z.enum([
    "location",
    "property-type",
    "demographic",
    "longevity-profile",
    "custom",
  ]),
  location: z
    .object({
      city: z.string().optional(),
      region: z.string().optional(),
      postalCode: z.array(z.string()).optional(),
      country: z.string().default("United Kingdom"),
    })
    .optional(),
  propertyType: z
    .array(
      z.enum([
        "residential",
        "commercial",
        "luxury",
        "retirement-friendly",
        "mixed",
      ])
    )
    .optional(),
  demographicProfile: z
    .object({
      minAge: z.number().min(18).optional(),
      maxAge: z.number().max(120).optional(),
      occupancyStatus: z
        .enum(["owner-occupied", "tenant-occupied", "mixed", "vacant"])
        .optional(),
    })
    .optional(),
  additionalCriteria: z.string().optional(),
  targetInvestors: z.array(z.string()).optional(),
})

/**
 * Schema for Property Selection
 * Used for the second step of Buy Box creation - Property Aggregation
 */
export const propertySelectionSchema = z.object({
  id: z.string(),
  address: z.string(),
  propertyType: z.enum([
    "residential",
    "commercial",
    "luxury",
    "retirement-friendly",
    "mixed",
  ]),
  ownershipStatus: z.enum(["freehold", "leasehold", "mixed"]),
  condition: z.enum(["excellent", "good", "fair", "poor", "mixed"]),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  squareMeters: z.number().min(0),
  yearBuilt: z.number().optional(),
  estimatedValue: z.number().min(0),
  sellerDemographics: z.object({
    age: z.number().min(18),
    lifeExpectancy: z.number().optional(),
  }),
  dueDiligence: z.object({
    appraisalCompleted: z.boolean(),
    appraisalValue: z.number().optional(),
    titleReportReviewed: z.boolean(),
    legalReportReviewed: z.boolean(),
    encumbrances: z.boolean(),
    encumbrancesDetails: z.string().optional(),
  }),
  documents: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["appraisal", "title", "legal", "survey", "other"]),
        url: z.string(),
      })
    )
    .optional(),
})

/**
 * Schema for Financial Model
 * Used for the third step of Buy Box creation - Financial Modelling
 */
export const financialModelSchema = z.object({
  totalBouquet: z.number().min(0),
  totalMonthlyAnnuity: z.number().min(0),
  guaranteedTerms: z.object({
    minYears: z.number().min(1),
    details: z.string().optional(),
  }),
  expectedReturns: z.object({
    conservativeYield: z.number().min(0),
    targetYield: z.number().min(0),
    optimisticYield: z.number().min(0),
  }),
  riskAnalysis: z.object({
    longevityRisk: z.enum(["low", "medium", "high"]),
    marketRisk: z.enum(["low", "medium", "high"]),
    defaultRisk: z.enum(["low", "medium", "high"]),
    notes: z.string().optional(),
    riskRating: z.number().min(1).max(10),
  }),
  pricing: z.object({
    totalInvestmentPrice: z.number().min(0),
    bouquetPercentage: z.number().min(0).max(100),
    annuityPercentage: z.number().min(0).max(100),
    managementFees: z.number().min(0),
    otherFees: z.number().optional(),
  }),
  cashFlowProjections: z
    .array(
      z.object({
        year: z.number().min(0),
        expectedCashFlow: z.number(),
      })
    )
    .optional(),
})

/**
 * Schema for Compliance Info
 * Used for the fourth step of Buy Box creation - Compliance and Legal
 */
export const complianceInfoSchema = z.object({
  regulatoryCompliance: z.object({
    fcaCompliant: z.boolean(),
    mifidCompliant: z.boolean(),
    otherRegulations: z.array(z.string()).optional(),
  }),
  legalChecks: z.object({
    propertyLiensCleared: z.boolean(),
    sellerRightsReviewed: z.boolean(),
    contractObligationsReviewed: z.boolean(),
    issues: z.string().optional(),
  }),
  documents: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum([
        "valuation",
        "legal",
        "actuarial",
        "risk",
        "compliance",
        "other",
      ]),
      url: z.string(),
    })
  ),
  internalApproval: z.object({
    approvedBy: z.string().optional(),
    approvalDate: z.string().optional(),
    approvalNotes: z.string().optional(),
  }),
})

/**
 * Schema for Platform Listing
 * Used for the fifth step of Buy Box creation - Platform Listing
 */
export const platformListingSchema = z.object({
  buyBoxName: z.string().min(3, "Name must be at least 3 characters long"),
  shortDescription: z.string().min(10).max(250),
  longDescription: z.string().min(50),
  highlightFeatures: z.array(z.string()),
  investmentHighlights: z.array(z.string()),
  riskDisclosures: z.array(z.string()),
  documents: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      url: z.string(),
      isPublic: z.boolean(),
    })
  ),
  publishStatus: z.enum(["draft", "pending_review", "approved", "published"]),
  reviewNotes: z.string().optional(),
  publishDate: z.string().optional(),
})

/**
 * Schema for Investor Engagement
 * Used for the sixth step of Buy Box creation - Investor Engagement
 */
export const investorEngagementSchema = z.object({
  accessControls: z.object({
    restrictedAccess: z.boolean(),
    allowedInvestorGroups: z.array(z.string()),
    customInvitations: z.boolean(),
  }),
  investorCommunication: z.object({
    initialAnnouncementSent: z.boolean(),
    announcementDate: z.string().optional(),
    customMessage: z.string().optional(),
    notifyMethod: z.enum(["email", "platform", "both"]),
  }),
  subscriptionManagement: z.object({
    minInvestmentAmount: z.number().min(0),
    maxTotalSubscription: z.number().min(0),
    subscriptionDeadline: z.string(),
    earlyAccessPeriod: z.object({
      enabled: z.boolean(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      groups: z.array(z.string()).optional(),
    }),
  }),
  qAndASettings: z.object({
    enableLiveQAndA: z.boolean(),
    automatedResponses: z.boolean(),
    designatedResponders: z.array(z.string()).optional(),
  }),
})

/**
 * Schema for Capital Deployment
 * Used for the seventh step of Buy Box creation - Capital Deployment
 */
export const capitalDeploymentSchema = z.object({
  fundsManagement: z.object({
    escrowDetails: z.string(),
    accountingContact: z.string(),
    fundsReceived: z.boolean(),
    totalReceived: z.number().optional(),
  }),
  contractExecution: z.object({
    scheduledExecutionDate: z.string(),
    legalRepresentative: z.string(),
    executionStatus: z.enum(["pending", "in_progress", "completed"]),
    notes: z.string().optional(),
  }),
  propertyTransfers: z.object({
    transferSchedule: z.string(),
    registrationStatus: z.enum(["not_started", "in_progress", "completed"]),
    lienRegistration: z.boolean(),
  }),
  sellerPayments: z.object({
    bouquetPaymentDate: z.string(),
    bouquetPaymentStatus: z.enum(["pending", "initiated", "completed"]),
    firstAnnuityDate: z.string().optional(),
    paymentProcessingSystem: z.string(),
  }),
})

/**
 * Schema for Continuous Management
 * Used for the eighth step of Buy Box creation - Continuous Management
 */
export const continuousManagementSchema = z.object({
  reportingSchedule: z.object({
    frequency: z.enum(["monthly", "quarterly", "semi_annual", "annual"]),
    nextReportDate: z.string(),
    includedMetrics: z.array(z.string()),
    automatedDistribution: z.boolean(),
  }),
  performanceTracking: z.object({
    trackingMetrics: z.array(z.string()),
    benchmarks: z.array(z.string()),
    alertThresholds: z.object({
      yieldAlert: z.number(),
      occupancyAlert: z.number(),
      otherAlerts: z.array(z.string()).optional(),
    }),
  }),
  investorRelations: z.object({
    primaryContact: z.string(),
    communicationFrequency: z.string(),
    feedbackMechanism: z.string(),
    escalationProcedure: z.string(),
  }),
  complianceReporting: z.object({
    regulatoryReports: z.array(z.string()),
    internalAudits: z.boolean(),
    auditFrequency: z.string(),
    complianceOfficer: z.string(),
  }),
})

/**
 * Schema for Final Configuration
 * Used for the final steps of Buy Box creation
 */
export const finalConfigurationSchema = z.object({
  launchDate: z.string(),
  fundingDeadline: z.string(),
  minInvestmentAmount: z.number().min(0),
  maxInvestmentAmount: z.number().min(0),
  allowPartialFunding: z.boolean(),
  enableEarlyAccess: z.boolean(),
  earlyAccessGroups: z.array(z.string()).optional(),
  administrativeNotes: z.string().optional(),
  notifyInvestors: z.boolean(),
  launchStrategy: z.enum(["immediate", "phased", "waitlist"]),
  reviewNotes: z.string().optional(),
})

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable max-lines */

import { db } from "@package/db"

import type {
  BuyBoxTheme,
  CapitalDeployment,
  ComplianceInfo,
  ContinuousManagement,
  FinancialModel,
  InvestorEngagement,
  PlatformListing,
  PropertySelection,
} from "../types"

/**
 * Repository for Buy-Box database operations
 */
class BuyBoxRepository {
  /**
   * Create a new Buy-Box theme
   */
  async createBuyBoxTheme({
    data,
    userId,
  }: {
    data: BuyBoxTheme
    userId: string
  }) {
    return db.buyBox.create({
      data: {
        name: data.name,
        description: data.description,
        themeType: data.themeType,
        status: "draft",
        createdById: userId,
        themeData: {
          create: {
            location: data.location || {},
            propertyTypes: data.propertyType || [],
            demographicProfile: data.demographicProfile || {},
            additionalCriteria: data.additionalCriteria || "",
            targetInvestors: data.targetInvestors || [],
          },
        },
      },
      include: {
        themeData: true,
      },
    })
  }

  /**
   * Update an existing Buy-Box theme
   */
  async updateBuyBoxTheme({
    buyBoxId,
    data,
  }: {
    buyBoxId: string
    data: BuyBoxTheme
  }) {
    return db.buyBox.update({
      where: { id: buyBoxId },
      data: {
        name: data.name,
        description: data.description,
        themeType: data.themeType,
        themeData: {
          update: {
            location: data.location || {},
            propertyTypes: data.propertyType || [],
            demographicProfile: data.demographicProfile || {},
            additionalCriteria: data.additionalCriteria || "",
            targetInvestors: data.targetInvestors || [],
          },
        },
      },
      include: {
        themeData: true,
      },
    })
  }

  /**
   * Find a Buy-Box by ID
   */
  async findBuyBoxById(buyBoxId: string) {
    return db.buyBox.findUnique({
      where: { id: buyBoxId },
    })
  }

  /**
   * Get a Buy-Box by ID with all related data
   */
  async getBuyBoxWithDetails(buyBoxId: string) {
    return db.buyBox.findUnique({
      where: { id: buyBoxId },
      include: {
        themeData: true,
        properties: {
          include: {
            property: true,
          },
        },
        financialModel: true,
        complianceInfo: true,
        platformListing: true,
        investorEngagement: true,
        capitalDeployment: true,
        continuousManagement: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  /**
   * Add a property to a Buy-Box
   */
  async addPropertyToBuyBox({
    buyBoxId,
    property,
  }: {
    buyBoxId: string
    property: any // Changed from PropertySelection to accept any property shape
  }) {
    // Make sure we have valid values for required fields
    const sellerDemographics = property.sellerDemographics || {
      age: 65,
      lifeExpectancy: 85,
    }
    const dueDiligence = property.dueDiligence || {
      appraisalCompleted: false,
      titleReportReviewed: false,
      legalReportReviewed: false,
      encumbrances: false,
      appraisalValue: 0,
    }
    const documents = Array.isArray(property.documents)
      ? property.documents
      : []

    // Ensure we're getting a valid property ID
    if (!property.id) {
      console.error("Missing property ID", property)
      throw new Error("Property ID is required")
    }

    return db.buyBoxProperty.create({
      data: {
        buyBoxId,
        propertyId: property.id,
        sellerDemographics,
        dueDiligence,
        documents,
      },
    })
  }

  /**
   * Remove a property from a Buy-Box
   */
  async removePropertyFromBuyBox({
    buyBoxId,
    propertyId,
  }: {
    buyBoxId: string
    propertyId: string
  }) {
    return db.buyBoxProperty.delete({
      where: {
        buyBoxId_propertyId: {
          buyBoxId,
          propertyId,
        },
      },
    })
  }

  /**
   * Update or create financial model for a Buy-Box
   */
  async upsertFinancialModel({
    buyBoxId,
    data,
  }: {
    buyBoxId: string
    data: FinancialModel
  }) {
    return db.buyBoxFinancialModel.upsert({
      where: { buyBoxId },
      update: {
        totalBouquet: data.totalBouquet,
        totalMonthlyAnnuity: data.totalMonthlyAnnuity,
        guaranteedTerms: data.guaranteedTerms,
        expectedReturns: data.expectedReturns,
        riskAnalysis: data.riskAnalysis,
        pricing: data.pricing,
        cashFlowProjections: data.cashFlowProjections || [],
      },
      create: {
        buyBoxId,
        totalBouquet: data.totalBouquet,
        totalMonthlyAnnuity: data.totalMonthlyAnnuity,
        guaranteedTerms: data.guaranteedTerms,
        expectedReturns: data.expectedReturns,
        riskAnalysis: data.riskAnalysis,
        pricing: data.pricing,
        cashFlowProjections: data.cashFlowProjections || [],
      },
    })
  }

  /**
   * Update or create compliance info for a Buy-Box
   */
  async upsertComplianceInfo({
    buyBoxId,
    data,
  }: {
    buyBoxId: string
    data: ComplianceInfo
  }) {
    return db.buyBoxComplianceInfo.upsert({
      where: { buyBoxId },
      update: {
        regulatoryCompliance: data.regulatoryCompliance,
        legalChecks: data.legalChecks,
        documents: data.documents,
        internalApproval: data.internalApproval,
      },
      create: {
        buyBoxId,
        regulatoryCompliance: data.regulatoryCompliance,
        legalChecks: data.legalChecks,
        documents: data.documents,
        internalApproval: data.internalApproval,
      },
    })
  }

  /**
   * Update or create platform listing for a Buy-Box
   */
  async upsertPlatformListing({
    buyBoxId,
    data,
  }: {
    buyBoxId: string
    data: PlatformListing
  }) {
    return db.buyBoxListing.upsert({
      where: { buyBoxId },
      update: {
        buyBoxName: data.buyBoxName,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        highlightFeatures: data.highlightFeatures,
        investmentHighlights: data.investmentHighlights,
        riskDisclosures: data.riskDisclosures,
        documents: data.documents,
        publishStatus: data.publishStatus,
        reviewNotes: data.reviewNotes || null,
        publishDate: data.publishDate || null,
      },
      create: {
        buyBoxId,
        buyBoxName: data.buyBoxName,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        highlightFeatures: data.highlightFeatures,
        investmentHighlights: data.investmentHighlights,
        riskDisclosures: data.riskDisclosures,
        documents: data.documents,
        publishStatus: data.publishStatus,
        reviewNotes: data.reviewNotes || null,
        publishDate: data.publishDate || null,
      },
    })
  }

  /**
   * Update Buy-Box status
   */
  async updateBuyBoxStatus({
    buyBoxId,
    status,
    notes,
    submittedAt,
  }: {
    buyBoxId: string
    status: string
    notes?: string | null
    submittedAt?: Date | null
  }) {
    return db.buyBox.update({
      where: { id: buyBoxId },
      data: {
        status,
        submissionNotes: notes,
        submittedAt,
      },
    })
  }

  /**
   * Update or create investor engagement settings for a Buy-Box
   */
  async upsertInvestorEngagement({
    buyBoxId,
    data,
  }: {
    buyBoxId: string
    data: InvestorEngagement
  }) {
    return db.buyBoxInvestorEngagement.upsert({
      where: { buyBoxId },
      update: {
        accessControls: data.accessControls,
        investorCommunication: data.investorCommunication,
        subscriptionManagement: data.subscriptionManagement,
        qAndASettings: data.qAndASettings,
      },
      create: {
        buyBoxId,
        accessControls: data.accessControls,
        investorCommunication: data.investorCommunication,
        subscriptionManagement: data.subscriptionManagement,
        qAndASettings: data.qAndASettings,
      },
    })
  }

  /**
   * Update or create capital deployment settings for a Buy-Box
   */
  async upsertCapitalDeployment({
    buyBoxId,
    data,
  }: {
    buyBoxId: string
    data: CapitalDeployment
  }) {
    return db.buyBoxCapitalDeployment.upsert({
      where: { buyBoxId },
      update: {
        fundsManagement: data.fundsManagement,
        contractExecution: data.contractExecution,
        propertyTransfers: data.propertyTransfers,
        sellerPayments: data.sellerPayments,
      },
      create: {
        buyBoxId,
        fundsManagement: data.fundsManagement,
        contractExecution: data.contractExecution,
        propertyTransfers: data.propertyTransfers,
        sellerPayments: data.sellerPayments,
      },
    })
  }

  /**
   * Update or create continuous management settings for a Buy-Box
   */
  async upsertContinuousManagement({
    buyBoxId,
    data,
  }: {
    buyBoxId: string
    data: ContinuousManagement
  }) {
    return db.buyBoxContinuousManagement.upsert({
      where: { buyBoxId },
      update: {
        reportingSchedule: data.reportingSchedule,
        performanceTracking: data.performanceTracking,
        investorRelations: data.investorRelations,
        complianceReporting: data.complianceReporting,
      },
      create: {
        buyBoxId,
        reportingSchedule: data.reportingSchedule,
        performanceTracking: data.performanceTracking,
        investorRelations: data.investorRelations,
        complianceReporting: data.complianceReporting,
      },
    })
  }

  /**
   * Update platform listing's publish status
   */
  async updatePlatformListingStatus({
    buyBoxId,
    publishStatus,
  }: {
    buyBoxId: string
    publishStatus: string
  }) {
    return db.buyBoxListing.update({
      where: { buyBoxId },
      data: {
        publishStatus,
      },
    })
  }

  /**
   * Get all Buy-Boxes with filtering and pagination
   */
  async getAllBuyBoxes({
    status,
    page,
    limit,
    userId,
  }: {
    status: "draft" | "pending_review" | "approved" | "published" | "all"
    page: number
    limit: number
    userId: string
  }) {
    const skip = (page - 1) * limit
    const where =
      status !== "all"
        ? { status, createdById: userId }
        : { createdById: userId }

    const [buyBoxes, totalCount] = await Promise.all([
      db.buyBox.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          themeData: true,
          properties: {
            select: {
              property: true,
            },
          },
        },
      }),
      db.buyBox.count({ where }),
    ])

    return {
      buyBoxes,
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  }

  /**
   * Get available properties for selection with filtering
   */
  async getAvailableProperties({
    filters,
    page,
    limit,
    userId,
  }: {
    filters: {
      propertyType?: string
      bedroomCount?: number
      bathroomCount?: number
      condition?: string
      estimatedValue?: number
    }
    page: number
    limit: number
    userId?: string
  }) {
    const skip = (page - 1) * limit
    const where: any = {}

    // Only apply filters if present
    if (filters.propertyType) where.propertyType = filters.propertyType
    if (filters.bedroomCount) where.bedroomCount = filters.bedroomCount
    if (filters.bathroomCount) where.bathroomCount = filters.bathroomCount
    if (filters.condition) where.condition = filters.condition
    if (filters.estimatedValue) where.estimatedValue = filters.estimatedValue

    const [properties, totalCount] = await Promise.all([
      db.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          address: true,
          valuations: {
            where: { status: "COMPLETED" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          sellerProperties: {
            include: {
              seller: {
                include: {
                  user: true,
                },
              },
            },
          },
          applicationReview: {
            select: {
              status: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
          dashboardStatuses: {
            select: {
              statusData: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      }),
      db.property.count({ where }),
    ])

    // Process properties to include all required information
    const propertiesWithDetails = properties.map((property) => {
      // Get seller details
      const sellerProp = property.sellerProperties.find(
        (sp: any) => sp.seller && sp.seller.user
      )

      // Get application review status
      const applicationStatus = property.applicationReview[0]?.status || "N/A"

      // Get property value from dashboard status or fallback to estimated value
      let propertyValue = property.estimatedValue
      if (property.dashboardStatuses[0]?.statusData) {
        try {
          const statusData = property.dashboardStatuses[0].statusData as any
          if (statusData.offerDocument?.offerValue) {
            propertyValue = statusData.offerDocument.offerValue
          }
        } catch (error) {
          console.error("Error parsing statusData:", error)
        }
      }

      // Get property address
      const address = property.address
        ? {
            streetLine1: property.address.streetLine1,
            streetLine2: property.address.streetLine2,
            city: property.address.city,
            state: property.address.state,
            postalCode: property.address.postalCode,
            country: property.address.country,
          }
        : "N/A"

      return {
        ...property,
        user: sellerProp?.seller.user || null,
        applicationStatus,
        propertyValue,
        address,
      }
    })

    return {
      properties: propertiesWithDetails,
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  }
}

export const buyBoxRepository = new BuyBoxRepository()

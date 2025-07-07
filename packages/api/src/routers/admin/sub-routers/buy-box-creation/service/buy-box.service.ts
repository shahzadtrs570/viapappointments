/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from "@trpc/server"

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

import { buyBoxRepository } from "../repository/buy-box.repository"

/**
 * Service for Buy-Box creation and management
 */
class BuyBoxService {
  /**
   * Create a new Buy-Box theme
   */
  async createBuyBoxTheme({
    input,
    userId,
  }: {
    input: BuyBoxTheme
    userId: string
  }) {
    try {
      // Create a new Buy-Box record
      const buyBox = await buyBoxRepository.createBuyBoxTheme({
        data: input,
        userId,
      })

      return buyBox
    } catch (error) {
      console.error("Error creating Buy-Box theme:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create Buy-Box theme",
      })
    }
  }

  /**
   * Update an existing Buy-Box theme
   */
  async updateBuyBoxTheme({
    buyBoxId,
    data,
    userId,
  }: {
    buyBoxId: string
    data: BuyBoxTheme
    userId: string
  }) {
    try {
      // Verify ownership
      await this.verifyBuyBoxOwnership(buyBoxId, userId)

      // Update the Buy-Box and theme data
      const buyBox = await buyBoxRepository.updateBuyBoxTheme({
        buyBoxId,
        data,
      })

      return buyBox
    } catch (error) {
      console.error("Error updating Buy-Box theme:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update Buy-Box theme",
      })
    }
  }

  /**
   * Add properties to a Buy-Box
   */
  async addPropertiesToBuyBox({
    buyBoxId,
    properties,
    userId,
  }: {
    buyBoxId: string
    properties: any[] // Changed from PropertySelection[] to accept any array of properties
    userId: string
  }) {
    try {
      // Verify ownership
      await this.verifyBuyBoxOwnership(buyBoxId, userId)

      // Add properties to the Buy-Box
      const buyBoxProperties = await Promise.all(
        properties.map(async (property) => {
          return buyBoxRepository.addPropertyToBuyBox({
            buyBoxId,
            property,
          })
        })
      )

      return buyBoxProperties
    } catch (error) {
      console.error("Error adding properties to Buy-Box:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add properties to Buy-Box",
      })
    }
  }

  /**
   * Remove a property from a Buy-Box
   */
  async removePropertyFromBuyBox({
    buyBoxId,
    propertyId,
    userId,
  }: {
    buyBoxId: string
    propertyId: string
    userId: string
  }) {
    try {
      // Verify ownership
      await this.verifyBuyBoxOwnership(buyBoxId, userId)

      // Remove the property from the Buy-Box
      await buyBoxRepository.removePropertyFromBuyBox({
        buyBoxId,
        propertyId,
      })

      return { success: true }
    } catch (error) {
      console.error("Error removing property from Buy-Box:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove property from Buy-Box",
      })
    }
  }

  /**
   * Update financial model for a Buy-Box
   */
  async updateFinancialModel({
    buyBoxId,
    data,
    userId,
  }: {
    buyBoxId: string
    data: FinancialModel
    userId: string
  }) {
    try {
      // Verify ownership
      await this.verifyBuyBoxOwnership(buyBoxId, userId)

      const financialModel = await buyBoxRepository.upsertFinancialModel({
        buyBoxId,
        data,
      })

      return financialModel
    } catch (error) {
      console.error("Error updating financial model:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update financial model",
      })
    }
  }

  /**
   * Update compliance info for a Buy-Box
   */
  async updateComplianceInfo({
    buyBoxId,
    data,
    userId,
  }: {
    buyBoxId: string
    data: ComplianceInfo
    userId: string
  }) {
    try {
      // Verify ownership
      await this.verifyBuyBoxOwnership(buyBoxId, userId)

      const complianceInfo = await buyBoxRepository.upsertComplianceInfo({
        buyBoxId,
        data,
      })

      return complianceInfo
    } catch (error) {
      console.error("Error updating compliance info:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update compliance info",
      })
    }
  }

  /**
   * Update platform listing for a Buy-Box
   */
  async updatePlatformListing({
    buyBoxId,
    data,
    userId,
  }: {
    buyBoxId: string
    data: PlatformListing
    userId: string
  }) {
    try {
      // Verify ownership
      await this.verifyBuyBoxOwnership(buyBoxId, userId)

      const platformListing = await buyBoxRepository.upsertPlatformListing({
        buyBoxId,
        data,
      })

      // Update the main Buy-Box status based on publish status
      await buyBoxRepository.updateBuyBoxStatus({
        buyBoxId,
        status: data.publishStatus,
      })

      return platformListing
    } catch (error) {
      console.error("Error updating platform listing:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update platform listing",
      })
    }
  }

  /**
   * Update investor engagement settings for a Buy-Box
   */
  async updateInvestorEngagement({
    buyBoxId,
    data,
    userId,
  }: {
    buyBoxId: string
    data: InvestorEngagement
    userId: string
  }) {
    try {
      // Verify ownership
      await this.verifyBuyBoxOwnership(buyBoxId, userId)

      const investorEngagement =
        await buyBoxRepository.upsertInvestorEngagement({
          buyBoxId,
          data,
        })

      return investorEngagement
    } catch (error) {
      console.error("Error updating investor engagement:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update investor engagement",
      })
    }
  }

  /**
   * Update capital deployment settings for a Buy-Box
   */
  async updateCapitalDeployment({
    buyBoxId,
    data,
    userId,
  }: {
    buyBoxId: string
    data: CapitalDeployment
    userId: string
  }) {
    try {
      // Verify ownership
      await this.verifyBuyBoxOwnership(buyBoxId, userId)

      const capitalDeployment = await buyBoxRepository.upsertCapitalDeployment({
        buyBoxId,
        data,
      })

      return capitalDeployment
    } catch (error) {
      console.error("Error updating capital deployment:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update capital deployment",
      })
    }
  }

  /**
   * Update continuous management settings for a Buy-Box
   */
  async updateContinuousManagement({
    buyBoxId,
    data,
    userId,
  }: {
    buyBoxId: string
    data: ContinuousManagement
    userId: string
  }) {
    try {
      // Verify ownership
      await this.verifyBuyBoxOwnership(buyBoxId, userId)

      const continuousManagement =
        await buyBoxRepository.upsertContinuousManagement({
          buyBoxId,
          data,
        })

      return continuousManagement
    } catch (error) {
      console.error("Error updating continuous management:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update continuous management",
      })
    }
  }

  /**
   * Submit a Buy-Box for approval
   */
  async submitBuyBoxForApproval({
    buyBoxId,
    notes,
    userId,
  }: {
    buyBoxId: string
    notes?: string
    userId: string
  }) {
    try {
      // Verify ownership
      await this.verifyBuyBoxOwnership(buyBoxId, userId)

      // Update the Buy-Box status to pending_review
      const buyBox = await buyBoxRepository.updateBuyBoxStatus({
        buyBoxId,
        status: "pending_review",
        notes: notes || null,
        submittedAt: new Date(),
      })

      // Update the platform listing if it exists
      const platformListing =
        await buyBoxRepository.getBuyBoxWithDetails(buyBoxId)

      if (platformListing?.platformListing) {
        await buyBoxRepository.updatePlatformListingStatus({
          buyBoxId,
          publishStatus: "pending_review",
        })
      }

      return buyBox
    } catch (error) {
      console.error("Error submitting Buy-Box for approval:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to submit Buy-Box for approval",
      })
    }
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
    try {
      return await buyBoxRepository.getAllBuyBoxes({
        status,
        page,
        limit,
        userId,
      })
    } catch (error) {
      console.error("Error getting Buy-Boxes:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get Buy-Boxes",
      })
    }
  }

  /**
   * Get a single Buy-Box by ID with all its related data
   */
  async getBuyBoxById({
    buyBoxId,
    userId,
  }: {
    buyBoxId: string
    userId: string
  }) {
    try {
      const buyBox = await buyBoxRepository.getBuyBoxWithDetails(buyBoxId)

      if (!buyBox) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Buy-Box not found",
        })
      }

      // Check if user has permission to view this Buy-Box
      if (buyBox.createdById !== userId) {
        // Admin users can view all Buy-Boxes, but we'd need to check role
        // For now, we'll restrict to creator only
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to view this Buy-Box",
        })
      }

      return buyBox
    } catch (error) {
      console.error("Error getting Buy-Box by ID:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get Buy-Box",
      })
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
      themeType?: string
      location?: {
        city?: string
        region?: string
        postalCodes?: string[]
      }
      propertyTypes?: string[]
    }
    page: number
    limit: number
    userId: string
  }) {
    try {
      const simpleFilters = {} // or map only supported fields if needed

      return await buyBoxRepository.getAvailableProperties({
        filters: simpleFilters,
        page,
        limit,
        userId,
      })
    } catch (error) {
      console.error("Error getting available properties:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get available properties",
      })
    }
  }

  /**
   * Helper method to verify Buy-Box ownership
   */
  private async verifyBuyBoxOwnership(buyBoxId: string, userId: string) {
    const buyBox = await buyBoxRepository.findBuyBoxById(buyBoxId)
    if (!buyBox) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Buy-Box not found",
      })
    }

    if (buyBox.createdById !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to modify this Buy-Box",
      })
    }

    return buyBox
  }
}

export const buyBoxService = new BuyBoxService()

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from "@trpc/server"

import { buyerOnboardingRepository } from "../repository/buyer-onboarding.repository"

/**
 * Service for Buyer Onboarding operations
 */
class BuyerOnboardingService {
  /**
   * Get onboarding progress for a user
   */
  async getOnboardingProgress({ userId }: { userId: string }) {
    try {
      return await buyerOnboardingRepository.getOnboardingProgress(userId)
    } catch (error) {
      console.error("Error getting onboarding progress:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get onboarding progress",
      })
    }
  }

  /**
   * Save initial inquiry data
   */
  async saveInitialInquiry({ data, userId }: { data: any; userId: string }) {
    try {
      return await buyerOnboardingRepository.saveInitialInquiry(data, userId)
    } catch (error) {
      console.error("Error saving initial inquiry:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save initial inquiry",
      })
    }
  }

  /**
   * Save qualification KYC/AML data
   */
  async saveQualificationKYCAML({
    data,
    userId,
  }: {
    data: any
    userId: string
  }) {
    try {
      return await buyerOnboardingRepository.saveQualificationKYCAML(
        data,
        userId
      )
    } catch (error) {
      console.error("Error saving qualification KYC/AML:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save qualification KYC/AML",
      })
    }
  }

  /**
   * Save due diligence legal data
   */
  async saveDueDiligenceLegal({ data, userId }: { data: any; userId: string }) {
    try {
      return await buyerOnboardingRepository.saveDueDiligenceLegal(data, userId)
    } catch (error) {
      console.error("Error saving due diligence legal:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save due diligence legal",
      })
    }
  }

  /**
   * Save investor profile data
   */
  async saveInvestorProfile({ data, userId }: { data: any; userId: string }) {
    try {
      return await buyerOnboardingRepository.saveInvestorProfile(data, userId)
    } catch (error) {
      console.error("Error saving investor profile:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save investor profile",
      })
    }
  }

  /**
   * Save platform training data
   */
  async savePlatformTraining({ data, userId }: { data: any; userId: string }) {
    try {
      return await buyerOnboardingRepository.savePlatformTraining(data, userId)
    } catch (error) {
      console.error("Error saving platform training:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save platform training",
      })
    }
  }

  /**
   * Save buy box allocation data
   */
  async saveBuyBoxAllocation({ data, userId }: { data: any; userId: string }) {
    try {
      return await buyerOnboardingRepository.saveBuyBoxAllocation(data, userId)
    } catch (error) {
      console.error("Error saving buy box allocation:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save buy box allocation",
      })
    }
  }

  /**
   * Save transaction execution data
   */
  async saveTransactionExecution({
    data,
    userId,
  }: {
    data: any
    userId: string
  }) {
    try {
      return await buyerOnboardingRepository.saveTransactionExecution(
        data,
        userId
      )
    } catch (error) {
      console.error("Error saving transaction execution:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save transaction execution",
      })
    }
  }

  /**
   * Save monitoring reporting data
   */
  async saveMonitoringReporting({
    data,
    userId,
  }: {
    data: any
    userId: string
  }) {
    try {
      return await buyerOnboardingRepository.saveMonitoringReporting(
        data,
        userId
      )
    } catch (error) {
      console.error("Error saving monitoring reporting:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save monitoring reporting",
      })
    }
  }

  /**
   * Save secondary market data
   */
  async saveSecondaryMarket({ data, userId }: { data: any; userId: string }) {
    try {
      return await buyerOnboardingRepository.saveSecondaryMarket(data, userId)
    } catch (error) {
      console.error("Error saving secondary market:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save secondary market",
      })
    }
  }

  /**
   * Complete the onboarding process
   */
  async completeOnboarding({ userId }: { userId: string }) {
    try {
      return await buyerOnboardingRepository.completeOnboarding(userId)
    } catch (error) {
      console.error("Error completing onboarding:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to complete onboarding",
      })
    }
  }

  /**
   * Get step data
   */
  async getStepData({
    step,
    userId,
  }: {
    step:
      | "initialInquiry"
      | "qualificationKYCAML"
      | "dueDiligenceLegal"
      | "investorProfile"
      | "platformTraining"
      | "buyBoxAllocation"
      | "transactionExecution"
      | "monitoringReporting"
      | "secondaryMarket"
    userId: string
  }) {
    try {
      return await buyerOnboardingRepository.getStepData(step, userId)
    } catch (error) {
      console.error(`Error getting ${step} data:`, error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get ${step} data`,
      })
    }
  }

  /**
   * Get available buy boxes for allocation
   */
  async getAvailableBuyBoxes({
    page,
    limit,
    filterByPreferences,
    userId,
  }: {
    page: number
    limit: number
    filterByPreferences: boolean
    userId: string
  }) {
    try {
      return await buyerOnboardingRepository.getAvailableBuyBoxes({
        page,
        limit,
        filterByPreferences,
        userId,
      })
    } catch (error) {
      console.error("Error getting available buy boxes:", error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get available buy boxes",
      })
    }
  }
}

export const buyerOnboardingService = new BuyerOnboardingService()

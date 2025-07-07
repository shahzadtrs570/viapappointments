/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
import { db, OnboardingStatus, OnboardingStep } from "@package/db"
import { TRPCError } from "@trpc/server"

import type { Prisma } from "@prisma/client"

/**
 * Repository for Buyer Onboarding operations
 */
class BuyerOnboardingRepository {
  /**
   * Get onboarding progress for a user
   */
  async getOnboardingProgress(userId: string) {
    try {
      // Check if a buyer onboarding record exists for this user
      const onboarding = await db.buyerOnboarding.findUnique({
        where: { userId },
        include: {
          initialInquiry: true,
          qualificationKYCAML: true,
          dueDiligenceLegal: true,
          investorProfile: true,
          platformTraining: true,
          buyBoxAllocation: true,
          transactionExecution: true,
          monitoringReporting: true,
          secondaryMarket: true,
        },
      })

      if (!onboarding) {
        // Create a new onboarding record if it doesn't exist
        return await db.buyerOnboarding.create({
          data: {
            userId,
            status: OnboardingStatus.IN_PROGRESS,
            currentStep: OnboardingStep.INITIAL_INQUIRY,
          },
          include: {
            initialInquiry: true,
            qualificationKYCAML: true,
            dueDiligenceLegal: true,
            investorProfile: true,
            platformTraining: true,
            buyBoxAllocation: true,
            transactionExecution: true,
            monitoringReporting: true,
            secondaryMarket: true,
          },
        })
      }

      return onboarding
    } catch (error) {
      console.error("Error getting onboarding progress:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get onboarding progress",
      })
    }
  }

  /**
   * Get or create a buyer onboarding record
   */
  async getOrCreateOnboarding(userId: string) {
    try {
      let onboarding = await db.buyerOnboarding.findUnique({
        where: { userId },
      })

      if (!onboarding) {
        onboarding = await db.buyerOnboarding.create({
          data: {
            userId,
            status: OnboardingStatus.IN_PROGRESS,
            currentStep: OnboardingStep.INITIAL_INQUIRY,
          },
        })
      }

      return onboarding
    } catch (error) {
      console.error("Error getting or creating onboarding:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get or create onboarding",
      })
    }
  }

  /**
   * Save initial inquiry data
   */
  async saveInitialInquiry(data: any, userId: string) {
    try {
      const onboarding = await this.getOrCreateOnboarding(userId)

      // Upsert initial inquiry data
      const initialInquiry = await db.buyerInitialInquiry.upsert({
        where: {
          buyerOnboardingId: onboarding.id,
        },
        update: {
          ...data,
          completed: true,
          updatedAt: new Date(),
        },
        create: {
          ...data,
          buyerOnboardingId: onboarding.id,
          completed: true,
        },
      })

      // Update current step if needed
      if (onboarding.currentStep === OnboardingStep.INITIAL_INQUIRY) {
        await db.buyerOnboarding.update({
          where: { id: onboarding.id },
          data: {
            currentStep: OnboardingStep.QUALIFICATION_KYC_AML,
            updatedAt: new Date(),
          },
        })
      }

      return initialInquiry
    } catch (error) {
      console.error("Error saving initial inquiry:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save initial inquiry",
      })
    }
  }

  /**
   * Save qualification KYC/AML data
   */
  async saveQualificationKYCAML(data: any, userId: string) {
    try {
      const onboarding = await this.getOrCreateOnboarding(userId)

      // Upsert qualification data
      const qualificationKYCAML = await db.buyerQualificationKYCAML.upsert({
        where: {
          buyerOnboardingId: onboarding.id,
        },
        update: {
          ...data,
          completed: true,
          updatedAt: new Date(),
        },
        create: {
          ...data,
          buyerOnboardingId: onboarding.id,
          completed: true,
        },
      })

      // Update current step if needed
      if (onboarding.currentStep === OnboardingStep.QUALIFICATION_KYC_AML) {
        await db.buyerOnboarding.update({
          where: { id: onboarding.id },
          data: {
            currentStep: OnboardingStep.DUE_DILIGENCE_LEGAL,
            updatedAt: new Date(),
          },
        })
      }

      return qualificationKYCAML
    } catch (error) {
      console.error("Error saving qualification KYC/AML:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save qualification KYC/AML",
      })
    }
  }

  /**
   * Save due diligence legal data
   */
  async saveDueDiligenceLegal(data: any, userId: string) {
    try {
      const onboarding = await this.getOrCreateOnboarding(userId)

      // Upsert due diligence data
      const dueDiligenceLegal = await db.buyerDueDiligenceLegal.upsert({
        where: {
          buyerOnboardingId: onboarding.id,
        },
        update: {
          ...data,
          completed: true,
          updatedAt: new Date(),
        },
        create: {
          ...data,
          buyerOnboardingId: onboarding.id,
          completed: true,
        },
      })

      // Update current step if needed
      if (onboarding.currentStep === OnboardingStep.DUE_DILIGENCE_LEGAL) {
        await db.buyerOnboarding.update({
          where: { id: onboarding.id },
          data: {
            currentStep: OnboardingStep.INVESTOR_PROFILE,
            updatedAt: new Date(),
          },
        })
      }

      return dueDiligenceLegal
    } catch (error) {
      console.error("Error saving due diligence legal:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save due diligence legal",
      })
    }
  }

  /**
   * Save investor profile data
   */
  async saveInvestorProfile(data: any, userId: string) {
    try {
      const onboarding = await this.getOrCreateOnboarding(userId)

      // Upsert investor profile data
      const investorProfile = await db.buyerInvestorProfile.upsert({
        where: {
          buyerOnboardingId: onboarding.id,
        },
        update: {
          ...data,
          completed: true,
          updatedAt: new Date(),
        },
        create: {
          ...data,
          buyerOnboardingId: onboarding.id,
          completed: true,
        },
      })

      // Update current step if needed
      if (onboarding.currentStep === OnboardingStep.INVESTOR_PROFILE) {
        await db.buyerOnboarding.update({
          where: { id: onboarding.id },
          data: {
            currentStep: OnboardingStep.PLATFORM_TRAINING,
            updatedAt: new Date(),
          },
        })
      }

      return investorProfile
    } catch (error) {
      console.error("Error saving investor profile:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save investor profile",
      })
    }
  }

  /**
   * Save platform training data
   */
  async savePlatformTraining(data: any, userId: string) {
    try {
      const onboarding = await this.getOrCreateOnboarding(userId)

      // Upsert platform training data
      const platformTraining = await db.buyerPlatformTraining.upsert({
        where: {
          buyerOnboardingId: onboarding.id,
        },
        update: {
          ...data,
          completed: true,
          updatedAt: new Date(),
        },
        create: {
          ...data,
          buyerOnboardingId: onboarding.id,
          completed: true,
        },
      })

      // Update current step if needed
      if (onboarding.currentStep === OnboardingStep.PLATFORM_TRAINING) {
        await db.buyerOnboarding.update({
          where: { id: onboarding.id },
          data: {
            currentStep: OnboardingStep.BUY_BOX_ALLOCATION,
            updatedAt: new Date(),
          },
        })
      }

      return platformTraining
    } catch (error) {
      console.error("Error saving platform training:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save platform training",
      })
    }
  }

  /**
   * Save buy box allocation data
   */
  async saveBuyBoxAllocation(data: any, userId: string) {
    try {
      const onboarding = await this.getOrCreateOnboarding(userId)

      // Upsert buy-box allocation data
      const buyBoxAllocation = await db.buyerBuyBoxAllocation.upsert({
        where: {
          buyerOnboardingId: onboarding.id,
        },
        update: {
          ...data,
          completed: true,
          updatedAt: new Date(),
        },
        create: {
          ...data,
          buyerOnboardingId: onboarding.id,
          completed: true,
        },
      })

      // Update current step if needed
      if (onboarding.currentStep === OnboardingStep.BUY_BOX_ALLOCATION) {
        await db.buyerOnboarding.update({
          where: { id: onboarding.id },
          data: {
            currentStep: OnboardingStep.TRANSACTION_EXECUTION,
            updatedAt: new Date(),
          },
        })
      }

      return buyBoxAllocation
    } catch (error) {
      console.error("Error saving buy box allocation:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save buy box allocation",
      })
    }
  }

  /**
   * Save transaction execution data
   */
  async saveTransactionExecution(data: any, userId: string) {
    try {
      const onboarding = await this.getOrCreateOnboarding(userId)

      // Upsert transaction execution data
      const transactionExecution = await db.buyerTransactionExecution.upsert({
        where: {
          buyerOnboardingId: onboarding.id,
        },
        update: {
          ...data,
          completed: true,
          updatedAt: new Date(),
        },
        create: {
          ...data,
          buyerOnboardingId: onboarding.id,
          completed: true,
        },
      })

      // Update current step if needed
      if (onboarding.currentStep === OnboardingStep.TRANSACTION_EXECUTION) {
        await db.buyerOnboarding.update({
          where: { id: onboarding.id },
          data: {
            currentStep: OnboardingStep.MONITORING_REPORTING,
            updatedAt: new Date(),
          },
        })
      }

      return transactionExecution
    } catch (error) {
      console.error("Error saving transaction execution:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save transaction execution",
      })
    }
  }

  /**
   * Save monitoring reporting data
   */
  async saveMonitoringReporting(data: any, userId: string) {
    try {
      const onboarding = await this.getOrCreateOnboarding(userId)

      // Upsert monitoring and reporting data
      const monitoringReporting = await db.buyerMonitoringReporting.upsert({
        where: {
          buyerOnboardingId: onboarding.id,
        },
        update: {
          ...data,
          completed: true,
          updatedAt: new Date(),
        },
        create: {
          ...data,
          buyerOnboardingId: onboarding.id,
          completed: true,
        },
      })

      // Update current step if needed
      if (onboarding.currentStep === OnboardingStep.MONITORING_REPORTING) {
        await db.buyerOnboarding.update({
          where: { id: onboarding.id },
          data: {
            currentStep: OnboardingStep.SECONDARY_MARKET,
            updatedAt: new Date(),
          },
        })
      }

      return monitoringReporting
    } catch (error) {
      console.error("Error saving monitoring reporting:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save monitoring reporting",
      })
    }
  }

  /**
   * Save secondary market data
   */
  async saveSecondaryMarket(data: any, userId: string) {
    try {
      const onboarding = await this.getOrCreateOnboarding(userId)

      // Upsert secondary market data
      const secondaryMarket = await db.buyerSecondaryMarket.upsert({
        where: {
          buyerOnboardingId: onboarding.id,
        },
        update: {
          ...data,
          completed: true,
          updatedAt: new Date(),
        },
        create: {
          ...data,
          buyerOnboardingId: onboarding.id,
          completed: true,
        },
      })

      // Update current step if needed
      if (onboarding.currentStep === OnboardingStep.SECONDARY_MARKET) {
        await db.buyerOnboarding.update({
          where: { id: onboarding.id },
          data: {
            currentStep: OnboardingStep.COMPLETED,
            updatedAt: new Date(),
          },
        })
      }

      return secondaryMarket
    } catch (error) {
      console.error("Error saving secondary market:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save secondary market",
      })
    }
  }

  /**
   * Complete the onboarding process
   */
  async completeOnboarding(userId: string) {
    try {
      const onboarding = await db.buyerOnboarding.findUnique({
        where: { userId },
        include: {
          initialInquiry: true,
          qualificationKYCAML: true,
          dueDiligenceLegal: true,
          investorProfile: true,
          platformTraining: true,
          buyBoxAllocation: true,
          transactionExecution: true,
          monitoringReporting: true,
          secondaryMarket: true,
        },
      })

      if (!onboarding) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Onboarding process not started",
        })
      }

      // Check if all required steps are completed
      const stepsCompleted = {
        initialInquiry: onboarding.initialInquiry?.completed,
        qualificationKYCAML: onboarding.qualificationKYCAML?.completed,
        dueDiligenceLegal: onboarding.dueDiligenceLegal?.completed,
        investorProfile: onboarding.investorProfile?.completed,
        platformTraining: onboarding.platformTraining?.completed,
        buyBoxAllocation: onboarding.buyBoxAllocation?.completed,
        transactionExecution: onboarding.transactionExecution?.completed,
        monitoringReporting: onboarding.monitoringReporting?.completed,
        secondaryMarket: onboarding.secondaryMarket?.completed,
      }

      const allStepsCompleted = Object.values(stepsCompleted).every(
        (completed) => completed === true
      )

      if (!allStepsCompleted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "All required onboarding steps must be completed",
        })
      }

      // Mark onboarding as complete
      return await db.buyerOnboarding.update({
        where: { id: onboarding.id },
        data: {
          status: OnboardingStatus.COMPLETED,
          completionDate: new Date(),
          currentStep: OnboardingStep.COMPLETED,
          updatedAt: new Date(),
        },
      })
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
  async getStepData(
    step:
      | "initialInquiry"
      | "qualificationKYCAML"
      | "dueDiligenceLegal"
      | "investorProfile"
      | "platformTraining"
      | "buyBoxAllocation"
      | "transactionExecution"
      | "monitoringReporting"
      | "secondaryMarket",
    userId: string
  ) {
    try {
      const onboarding = await db.buyerOnboarding.findUnique({
        where: { userId },
        include: {
          [step]: true,
        },
      })

      if (!onboarding) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Onboarding process not started",
        })
      }

      return onboarding[step]
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
      const skip = (page - 1) * limit

      // Build query with user preferences if requested
      let whereClause = {}
      if (filterByPreferences) {
        const onboarding = await db.buyerOnboarding.findUnique({
          where: { userId },
          include: {
            investorProfile: true,
          },
        })

        if (onboarding?.investorProfile) {
          const { investorProfile } = onboarding

          // Apply filters based on investor preferences
          whereClause = {
            status: "published",
            ...(investorProfile.preferredPropertyTypes.length > 0
              ? {
                  themeType: {
                    in: investorProfile.preferredPropertyTypes,
                  },
                }
              : {}),
          }
        }
      } else {
        // Just filter for published buy boxes
        whereClause = {
          status: "published",
        }
      }

      // Get available buy boxes
      const buyBoxes = await db.buyBox.findMany({
        where: whereClause,
        include: {
          theme: true,
          financialModel: true,
          properties: {
            include: {
              property: true,
            },
          },
        } as any, // Type assertion to bypass TypeScript error
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      })

      // Get total count
      const totalCount = await db.buyBox.count({
        where: whereClause,
      })

      // Map to client-friendly format
      const formattedBuyBoxes = buyBoxes.map((buyBox: any) => ({
        id: buyBox.id,
        name: buyBox.name,
        description: buyBox.description,
        themeType: buyBox.theme?.themeType || "",
        location: {
          city: buyBox.theme?.location?.city || "",
          region: buyBox.theme?.location?.region || "",
        },
        propertyTypes: buyBox.theme?.propertyType || [],
        financialHighlights: {
          targetReturn: buyBox.financialModel?.projectedReturn || 0,
          estimatedValue: buyBox.financialModel?.totalInvestmentValue || 0,
          minInvestment: buyBox.financialModel?.minimumInvestment || 0,
          riskRating: buyBox.financialModel?.riskAssessment || "medium",
        },
        propertyCount: buyBox.properties?.length || 0,
      }))

      return {
        buyBoxes: formattedBuyBoxes,
        pagination: {
          totalCount,
          page,
          pageSize: limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      }
    } catch (error) {
      console.error("Error getting available buy boxes:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get available buy boxes",
      })
    }
  }
}

export const buyerOnboardingRepository = new BuyerOnboardingRepository()

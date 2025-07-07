import { TRPCError } from "@trpc/server"

import type {
  ClientEligibilityData,
  DbEligibilityData,
} from "../repository/eligibility.repository"

import { EligibilityRepository } from "../repository/eligibility.repository"

/**
 * Service for managing eligibility data
 *
 * The eligibility data includes an isEligible flag that indicates whether
 * the user has been determined to be eligible for the service.
 * This flag is optional and can be set during the eligibility check process.
 */
export class EligibilityService {
  private repository: EligibilityRepository

  constructor() {
    this.repository = new EligibilityRepository()
  }

  /**
   * Get eligibility data by user ID
   * @returns Eligibility data including isEligible status if available
   */
  async getByUserId(userId: string) {
    try {
      return await this.repository.findByUserId(userId)
    } catch (error) {
      console.error("Error fetching eligibility data:", error)
    }
  }

  /**
   * Save eligibility data
   * @param userId The user ID to save eligibility data for
   * @param data The eligibility data including optional isEligible flag
   */
  async saveEligibilityData(userId: string, data: Partial<DbEligibilityData>) {
    try {
      // Transform undefined values to null
      const dbData: DbEligibilityData = {
        isEligible: data.isEligible ?? null,
        age: data.age ?? null,
        ownership: data.ownership ?? null,
        propertyType: data.propertyType ?? null,
        mainResidence: data.mainResidence ?? null,
        financialGoals: data.financialGoals,
        country: data.country ?? null,
        propertyOwnership: data.propertyOwnership ?? null,
        jointOwnership: data.jointOwnership ?? null,
        spouseAge: data.spouseAge ?? null,
        childrenHeirs: data.childrenHeirs ?? null,
        inheritanceImportance: data.inheritanceImportance ?? null,
        confidentUnderstanding: data.confidentUnderstanding ?? null,
        discussOptions: data.discussOptions ?? null,
      }

      // Transform DbEligibilityData to ClientEligibilityData
      const clientData: ClientEligibilityData = {
        ...dbData,
        isEligible: dbData.isEligible ?? false,
      }
      return await this.repository.upsert(userId, clientData)
    } catch (error) {
      console.error("Error saving eligibility data:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save eligibility data",
      })
    }
  }
}

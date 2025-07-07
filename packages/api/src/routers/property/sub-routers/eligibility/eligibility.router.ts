import { z } from "zod"

import type { ClientEligibilityData } from "./repository/eligibility.repository"

import { EligibilityService } from "./service/eligibility.service"
import { createTRPCRouter, protectedProcedure } from "../../../../trpc"

// Define the schema for eligibility data
const eligibilityDataSchema = z.object({
  isEligible: z.boolean().nullable().optional(),
  age: z.string().nullable().optional(),
  ownership: z.string().nullable().optional(),
  propertyType: z.string().nullable().optional(),
  mainResidence: z.string().nullable().optional(),
  financialGoals: z.array(z.string()).optional(),
  country: z.string().nullable().optional(),
  propertyOwnership: z.string().nullable().optional(),
  jointOwnership: z.string().nullable().optional(),
  spouseAge: z.string().nullable().optional(),
  childrenHeirs: z.string().nullable().optional(),
  inheritanceImportance: z.string().nullable().optional(),
  confidentUnderstanding: z.string().nullable().optional(),
  discussOptions: z.string().nullable().optional(),
})

export const eligibilityRouter = createTRPCRouter({
  /**
   * Get eligibility data for the current user
   */
  getEligibility: protectedProcedure.query(async ({ ctx }) => {
    const service = new EligibilityService()
    const data = await service.getByUserId(ctx.session.user.id)
    return data as ClientEligibilityData
  }),

  /**
   * Save eligibility data for the current user
   */
  saveEligibility: protectedProcedure
    .input(eligibilityDataSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new EligibilityService()
      return service.saveEligibilityData(
        ctx.session.user.id,
        input
      ) as Promise<ClientEligibilityData>
    }),
})

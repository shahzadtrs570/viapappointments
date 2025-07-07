import {
  buyBoxAllocationSchema,
  dueDiligenceLegalSchema,
  initialInquirySchema,
  investorProfileSchema,
  monitoringReportingSchema,
  platformTrainingSchema,
  qualificationKYCAMLSchema,
  secondaryMarketSchema,
  transactionExecutionSchema,
} from "@package/validations"
import { z } from "zod"

import { buyerOnboardingService } from "./service/buyer-onboarding.service"
import { createTRPCRouter, protectedProcedure } from "../../../../trpc"

/**
 * Buyer Onboarding Router
 * Handles operations related to the buyer/investor onboarding process
 */
export const buyerOnboardingRouter = createTRPCRouter({
  // Get onboarding status
  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    return buyerOnboardingService.getOnboardingProgress({
      userId: ctx.session.user.id,
    })
  }),

  // Step 1: Initial Inquiry
  submitInitialInquiry: protectedProcedure
    .input(initialInquirySchema)
    .mutation(async ({ ctx, input }) => {
      return buyerOnboardingService.saveInitialInquiry({
        data: input,
        userId: ctx.session.user.id,
      })
    }),

  // Step 2: Qualification KYC/AML
  submitQualificationKYCAML: protectedProcedure
    .input(qualificationKYCAMLSchema)
    .mutation(async ({ ctx, input }) => {
      return buyerOnboardingService.saveQualificationKYCAML({
        data: input,
        userId: ctx.session.user.id,
      })
    }),

  // Step 3: Due Diligence and Legal Compliance
  submitDueDiligenceLegal: protectedProcedure
    .input(dueDiligenceLegalSchema)
    .mutation(async ({ ctx, input }) => {
      return buyerOnboardingService.saveDueDiligenceLegal({
        data: input,
        userId: ctx.session.user.id,
      })
    }),

  // Step 4: Investor Profile and Investment Preferences
  submitInvestorProfile: protectedProcedure
    .input(investorProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return buyerOnboardingService.saveInvestorProfile({
        data: input,
        userId: ctx.session.user.id,
      })
    }),

  // Step 5: Platform Training and Technical Onboarding
  submitPlatformTraining: protectedProcedure
    .input(platformTrainingSchema)
    .mutation(async ({ ctx, input }) => {
      return buyerOnboardingService.savePlatformTraining({
        data: input,
        userId: ctx.session.user.id,
      })
    }),

  // Step 6: Buy-Box Allocation and Investment Commencement
  submitBuyBoxAllocation: protectedProcedure
    .input(buyBoxAllocationSchema)
    .mutation(async ({ ctx, input }) => {
      return buyerOnboardingService.saveBuyBoxAllocation({
        data: input,
        userId: ctx.session.user.id,
      })
    }),

  // Step 7: Transaction Execution
  submitTransactionExecution: protectedProcedure
    .input(transactionExecutionSchema)
    .mutation(async ({ ctx, input }) => {
      return buyerOnboardingService.saveTransactionExecution({
        data: input,
        userId: ctx.session.user.id,
      })
    }),

  // Step 8: Monitoring, Reporting, and Investor Relations
  submitMonitoringReporting: protectedProcedure
    .input(monitoringReportingSchema)
    .mutation(async ({ ctx, input }) => {
      return buyerOnboardingService.saveMonitoringReporting({
        data: input,
        userId: ctx.session.user.id,
      })
    }),

  // Step 9: Secondary Market and Exit Opportunities
  submitSecondaryMarket: protectedProcedure
    .input(secondaryMarketSchema)
    .mutation(async ({ ctx, input }) => {
      return buyerOnboardingService.saveSecondaryMarket({
        data: input,
        userId: ctx.session.user.id,
      })
    }),

  // Complete onboarding process
  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    return buyerOnboardingService.completeOnboarding({
      userId: ctx.session.user.id,
    })
  }),

  // Get step data
  getStepData: protectedProcedure
    .input(
      z.object({
        step: z.enum([
          "initialInquiry",
          "qualificationKYCAML",
          "dueDiligenceLegal",
          "investorProfile",
          "platformTraining",
          "buyBoxAllocation",
          "transactionExecution",
          "monitoringReporting",
          "secondaryMarket",
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      return buyerOnboardingService.getStepData({
        step: input.step,
        userId: ctx.session.user.id,
      })
    }),

  // Get available Buy-Boxes for allocation
  getAvailableBuyBoxes: protectedProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
        filterByPreferences: z.boolean().optional().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      return buyerOnboardingService.getAvailableBuyBoxes({
        page: input.page,
        limit: input.limit,
        filterByPreferences: input.filterByPreferences,
        userId: ctx.session.user.id,
      })
    }),
})

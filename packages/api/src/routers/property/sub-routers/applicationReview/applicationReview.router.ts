import { z } from "zod"

import { ApplicationReviewService } from "./service/applicationReview.service"
import { createTRPCRouter, protectedProcedure } from "../../../../trpc"

// Define the ApplicationReview interface based on the zod schema
interface ApplicationReview {
  checklist: {
    financialAdvisor: boolean
    financialSituation: boolean
    carePlans: boolean
    existingMortgages: boolean
  }
  considerations: {
    ownership: boolean
    benefits: boolean
    mortgage: boolean
  }
  propertyId: string
  sellerId: string
  userId: string
  status: "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED"
  coSellerIds?: string[]
}

const checklistSchema = z.object({
  financialAdvisor: z.boolean(),
  financialSituation: z.boolean(),
  carePlans: z.boolean(),
  existingMortgages: z.boolean(),
})

const considerationsSchema = z.object({
  ownership: z.boolean(),
  benefits: z.boolean(),
  mortgage: z.boolean(),
})

const applicationReviewSchema = z.object({
  checklist: checklistSchema,
  considerations: considerationsSchema,
  propertyId: z.string(),
  sellerId: z.string(),
  coSellerIds: z.array(z.string()).optional(),
  status: z.enum(["PENDING", "PROCESSING", "ACCEPTED", "REJECTED"]),
})

const service = new ApplicationReviewService()

export const applicationReviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(applicationReviewSchema.partial({ status: true }))
    .mutation(async ({ ctx, input }) => {
      return service.create({
        ...input,
        userId: ctx.session.user.id,
        status: input.status || "PENDING",
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: applicationReviewSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return service.update(input.id, {
        ...input.data,
        userId: ctx.session.user.id,
      })
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "PROCESSING", "ACCEPTED", "REJECTED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentReview = await service.get(input.id)
      if (!currentReview) {
        throw new Error("Application review not found")
      }

      const reviewToUpdate: ApplicationReview = {
        propertyId: currentReview.propertyId,
        sellerId: currentReview.sellerId,
        userId: ctx.session.user.id,
        checklist:
          typeof currentReview.checklist === "object" &&
          currentReview.checklist !== null
            ? (currentReview.checklist as ApplicationReview["checklist"])
            : {
                financialAdvisor: false,
                financialSituation: false,
                carePlans: false,
                existingMortgages: false,
              },
        considerations:
          typeof currentReview.considerations === "object" &&
          currentReview.considerations !== null
            ? (currentReview.considerations as ApplicationReview["considerations"])
            : { ownership: false, benefits: false, mortgage: false },
        status: input.status,
        coSellerIds: Array.isArray(currentReview.coSellerIds)
          ? currentReview.coSellerIds
          : [],
      }

      return service.update(input.id, reviewToUpdate)
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return service.get(input.id)
    }),

  getByPropertyId: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .query(async ({ input }) => {
      return service.getByPropertyId(input.propertyId)
    }),

  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    return service.getByUserId(ctx.session.user.id)
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return service.delete(input.id)
    }),
})

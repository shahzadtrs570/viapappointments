import { z } from "zod"

import { ProvisionalOfferService } from "./service/provisionalOffer.service"
import { createTRPCRouter, publicProcedure } from "../../../../trpc"

const propertySchema = z.object({
  propertyId: z.string(),
  address: z.string(),
  owners: z.array(z.string()),
  titleNumber: z.string(),
  tenure: z.string(),
  type: z.string(),
})

const valuationSchema = z.object({
  marketValue: z.number(),
  purchasePrice: z.number(),
  initialLumpSum: z.number(),
  remainingBalance: z.number(),
  monthlyPayment: z.number(),
  annuityTerm: z.string(),
})

const offerSchema = z.object({
  referenceNumber: z.string(),
  dateOfIssue: z.string(),
  sellerId: z.string(),
  coSellerIds: z.array(z.string()).optional(),
  property: propertySchema,
  valuation: valuationSchema,
  status: z
    .enum(["DRAFT", "PENDING", "ACCEPTED", "REJECTED", "EXPIRED", "WITHDRAWN"])
    .default("DRAFT"),
  declineReason: z.string().optional(),
  declineDetails: z.string().optional(),
})

const service = new ProvisionalOfferService()

export const provisionalOfferRouter = createTRPCRouter({
  create: publicProcedure.input(offerSchema).mutation(async ({ input }) => {
    return service.create(input)
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: offerSchema,
      })
    )
    .mutation(async ({ input }) => {
      return service.update(input.id, input.data)
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return service.get(input.id)
    }),

  getByProperty: publicProcedure
    .input(z.object({ propertyId: z.string() }))
    .query(async ({ input }) => {
      return service.getByProperty(input.propertyId)
    }),

  getDashboardStatusWithOfferDocument: publicProcedure
    .input(z.object({ propertyId: z.string() }))
    .query(async ({ input }) => {
      return service.getDashboardStatusWithOfferDocument(input.propertyId)
    }),

  accept: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return service.accept(input.id)
    }),

  decline: publicProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string(),
        details: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return service.decline(input.id, input.reason, input.details)
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return service.delete(input.id)
    }),

  getById: publicProcedure
    .input(
      z.object({
        propertyId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return service.getById(input.propertyId)
    }),
})

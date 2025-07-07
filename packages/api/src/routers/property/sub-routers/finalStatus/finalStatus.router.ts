import { z } from "zod"

import { FinalStatusService } from "./service/finalStatus.service"
import { createTRPCRouter, publicProcedure } from "../../../../trpc"

const solicitorDetailsSchema = z.object({
  name: z.string(),
  firmName: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
})

const finalStatusSchema = z.object({
  choice: z.string(),
  solicitor: solicitorDetailsSchema,
  propertyId: z.string(),
  sellerId: z.string(),
  coSellerIds: z.array(z.string()).optional(),
})

const service = new FinalStatusService()

export const finalStatusRouter = createTRPCRouter({
  create: publicProcedure
    .input(finalStatusSchema)
    .mutation(async ({ input }) => {
      return service.create(input)
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: finalStatusSchema,
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

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return service.delete(input.id)
    }),

  getDashboardStatusDetails: publicProcedure
    .input(z.object({ propertyId: z.string() }))
    .query(async ({ input }) => {
      return service.getDashboardStatusDetails(input.propertyId)
    }),
})

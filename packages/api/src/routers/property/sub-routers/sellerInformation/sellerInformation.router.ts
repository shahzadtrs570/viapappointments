import { z } from "zod"

import type { SellerInformation } from "./types"

import { SellerInformationService } from "./service/sellerInformation.service"
import { createTRPCRouter, protectedProcedure } from "../../../../trpc"

const service = new SellerInformationService()

const ownerSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  postcode: z.string().optional(),
  town: z.string().optional(),
  county: z.string().optional(),
  useExistingAddress: z.boolean().optional().default(false),
})

const sellerInformationSchema = z.object({
  ownerType: z.enum(["single", "couple", "multiple"]),
  numberOfOwners: z.number().min(1).max(5).optional(),
  owners: z.array(ownerSchema).min(1),
}) satisfies z.ZodType<SellerInformation>

export const sellerInformationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        propertyId: z.string().optional(),
        data: sellerInformationSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return service.create(input.data, ctx.session.user.id, input.propertyId)
    }),

  update: protectedProcedure
    .input(
      z.object({
        sellerId: z.string(),
        data: sellerInformationSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return service.update(input.sellerId, input.data, ctx.session.user.id)
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return service.get(input.id, ctx.session.user.id)
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return service.delete(input.id, ctx.session.user.id)
    }),

  addPropertyToSellers: protectedProcedure
    .input(
      z.object({
        sellerIds: z.array(z.string()),
        propertyId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return service.addPropertyToSellers(
        input.sellerIds,
        input.propertyId,
        ctx.session.user.id
      )
    }),
})

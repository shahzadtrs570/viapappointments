import { z } from "zod"

import { MyPropertiesService } from "./service/myProperties.service"
import { createTRPCRouter, protectedProcedure } from "../../../trpc"

const service = new MyPropertiesService()

export const myPropertiesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
        search: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      return service.list({
        userId: ctx.session.user.id,
        ...input,
      })
    }),

  getById: protectedProcedure
    .input(
      z.object({
        propertyId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return service.getById(input.propertyId, ctx.session.user.id)
    }),
})

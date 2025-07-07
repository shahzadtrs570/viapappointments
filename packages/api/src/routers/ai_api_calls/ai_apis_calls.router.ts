import { createAiApiCallSchema } from "@package/validations"

import { createTRPCRouter, protectedProcedure } from "../../trpc"
import { aiApiCallsService } from "./service/ai_api_calls.service"

export const aiApiCallsRouter = createTRPCRouter({
  createAiApiCall: protectedProcedure
    .input(createAiApiCallSchema)
    .mutation(({ input, ctx }) => {
      return aiApiCallsService.createAiApiCall({
        input,
        userId: ctx.session.user.id,
      })
    }),
  getUserAiApiCalls: protectedProcedure.query(({ ctx }) => {
    return aiApiCallsService.getAiApiCallsByUserId(ctx.session.user.id)
  }),
})

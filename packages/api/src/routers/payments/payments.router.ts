import {
  createCheckoutSessionInput,
  upgradeSubscriptionPlanInput,
} from "./service/payments.input"
import { paymentsService } from "./service/payments.service"
import { createTRPCRouter, protectedProcedure } from "../../trpc"

export const paymentsRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(createCheckoutSessionInput)
    .mutation(({ ctx, input }) => {
      return paymentsService.createCheckoutSession({
        input,
        session: ctx.session.user,
      })
    }),
  createBillingPortalSession: protectedProcedure.mutation(({ ctx }) => {
    return paymentsService.createBillingPortalSession({
      session: ctx.session.user,
    })
  }),
  upgradeSubscriptionPlan: protectedProcedure
    .input(upgradeSubscriptionPlanInput)
    .mutation(({ ctx, input }) => {
      return paymentsService.upgradeSubscriptionPlan({
        input,
        session: ctx.session.user,
      })
    }),
})

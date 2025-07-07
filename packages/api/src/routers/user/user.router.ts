import { nameSchema, onboardingSchema } from "@package/validations"

import { userService } from "./service/user.service"
import { createTRPCRouter, protectedProcedure } from "../../trpc"

export const userRouter = createTRPCRouter({
  updateUserOnboarding: protectedProcedure
    .input(onboardingSchema)
    .mutation(({ input, ctx }) => {
      return userService.updateUserOnboarding({
        input,
        session: ctx.session.user,
      })
    }),
  getMe: protectedProcedure.query(({ ctx }) => {
    return userService.getUserMe(ctx.session.user)
  }),
  changeName: protectedProcedure
    .input(nameSchema)
    .mutation(({ ctx, input }) => {
      return userService.changeName({ input, session: ctx.session.user })
    }),
  deleteMe: protectedProcedure.mutation(({ ctx }) => {
    return userService.deleteUserById(ctx.session.user)
  }),
  sendVerificationEmail: protectedProcedure.mutation(({ ctx }) => {
    return userService.sendVerificationEmail(ctx.session.user)
  }),
  checkEmailVerification: protectedProcedure.query(({ ctx }) => {
    return userService.checkEmailVerification(ctx.session.user)
  }),
})

import { PropertyValidationService } from "./service/propertyValidation.service"
import { createTRPCRouter, protectedProcedure } from "../../../../trpc"

const service = new PropertyValidationService()

export const propertyValidationRouter = createTRPCRouter({
  validateNewProperty: protectedProcedure.mutation(async ({ ctx }) => {
    return service.validateNewProperty(ctx.session.user.id)
  }),

  getExistingProperty: protectedProcedure.query(async ({ ctx }) => {
    return service.getExistingProperty(ctx.session.user.id)
  }),
})

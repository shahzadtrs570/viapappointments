import {
  propertiesPaginationInput,
  propertyIdInput,
  searchPropertiesInput,
} from "./service/properties.input"
import { propertiesService } from "./service/properties.service"
import { adminProcedure, createTRPCRouter } from "../../../../trpc"

export const adminPropertiesRouter = createTRPCRouter({
  list: adminProcedure.input(propertiesPaginationInput).query(({ input }) => {
    return propertiesService.getPaginatedProperties({ input })
  }),

  getById: adminProcedure.input(propertyIdInput).query(({ input }) => {
    return propertiesService.getPropertyById({ input })
  }),

  searchProperties: adminProcedure
    .input(searchPropertiesInput)
    .query(({ input }) => {
      return propertiesService.searchProperties({ input })
    }),

  deleteById: adminProcedure
    .input(propertyIdInput)
    .mutation(({ input, ctx }) => {
      return propertiesService.deletePropertyById({
        input,
        session: ctx.session.user,
      })
    }),

  getPropertyJsonData: adminProcedure
    .input(propertyIdInput)
    .query(({ input }) => {
      return propertiesService.getPropertyJsonData({ input })
    }),

  generatePropertyOfferPayload: adminProcedure
    .input(propertyIdInput)
    .query(({ input }) => {
      return propertiesService.generatePropertyOfferPayload({ input })
    }),

  requestProvisionalOffer: adminProcedure
    .input(propertyIdInput)
    .mutation(({ input, ctx }) => {
      return propertiesService.requestProvisionalOffer({
        input,
        session: ctx.session.user,
      })
    }),
})

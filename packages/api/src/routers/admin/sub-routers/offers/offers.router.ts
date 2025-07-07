import {
  createOfferInput,
  getOffersByPropertyIdInput,
} from "./service/offers.input"
import { offersService } from "./service/offers.service"
import { adminProcedure, createTRPCRouter } from "../../../../trpc"

export const adminOffersRouter = createTRPCRouter({
  getByPropertyId: adminProcedure
    .input(getOffersByPropertyIdInput)
    .query(({ input }) => {
      return offersService.getOffersByPropertyId({ input })
    }),

  create: adminProcedure.input(createOfferInput).mutation(({ input, ctx }) => {
    return offersService.createOffer({
      input,
      session: ctx.session.user,
    })
  }),
})

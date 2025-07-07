import { sellerProfilesListInput } from "./service/sellerProfiles.input"
import { sellerProfilesService } from "./service/sellerProfiles.service"
import { adminProcedure, createTRPCRouter } from "../../../../trpc"

export const adminSellerProfilesRouter = createTRPCRouter({
  list: adminProcedure.input(sellerProfilesListInput).query(({ input }) => {
    return sellerProfilesService.getSellerProfiles({ input })
  }),
})

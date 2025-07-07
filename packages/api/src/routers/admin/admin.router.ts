import { createTRPCRouter } from "../../trpc"
import { adminUserRouter } from "./sub-routers/adminUser/adminUser.router"
import { buyBoxCreationRouter } from "./sub-routers/buy-box-creation/buy-box-creation.router"
import { adminOffersRouter } from "./sub-routers/offers/offers.router"
import { adminPropertiesRouter } from "./sub-routers/properties/properties.router"
import { adminSellerProfilesRouter } from "./sub-routers/sellerProfiles/sellerProfiles.router"
import { statisticsRouter } from "./sub-routers/statistics/statistics.router"

export const adminRouter = createTRPCRouter({
  users: adminUserRouter,
  statistics: statisticsRouter,
  buyBoxCreation: buyBoxCreationRouter,
  properties: adminPropertiesRouter,
  offers: adminOffersRouter,
  sellerProfiles: adminSellerProfilesRouter,
})

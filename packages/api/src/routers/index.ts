import { createTRPCRouter } from "../trpc"
import { adminRouter } from "./admin/admin.router"
// import { aiApiCallsRouter } from "./ai_api_calls/ai_api_calls.router"
import { aiApiCallsRouter } from "./ai_api_calls/ai_apis_calls.router"
import { buyerOnboardingRouter } from "./buyer/sub-routers/onboarding/buyer-onboarding.router"
import { fileUploadRouter } from "./fileUpload/fileUpload.router"
import { leadsRouter } from "./leads/leads.router"
import { newsletterRouter } from "./newsletter/newsletter.router"
import { paymentsRouter } from "./payments/payments.router"
import { propertyRouter } from "./property/property.router"
import { userRouter } from "./user/user.router"
import { waitlistRouter } from "./waitlist/waitlist.router"

export const appRouter = createTRPCRouter({
  user: userRouter,
  waitlist: waitlistRouter,
  newsletter: newsletterRouter,
  leads: leadsRouter,
  admin: adminRouter,
  payments: paymentsRouter,
  fileUpload: fileUploadRouter,
  aiApiCalls: aiApiCallsRouter,
  property: propertyRouter,
  onboarding: buyerOnboardingRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

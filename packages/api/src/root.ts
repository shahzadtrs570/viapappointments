import { adminRouter } from "./routers/admin/admin.router"
import { buyerOnboardingRouter } from "./routers/buyer/sub-routers/onboarding/buyer-onboarding.router"
import { featureTemplateRouter } from "./routers/feature-template/feature-template.router"
import { fileUploadRouter } from "./routers/fileUpload/fileUpload.router"
import { inventoryRouter } from "./routers/inventory/inventory.router"
import { leadsRouter } from "./routers/leads/leads.router"
import { newsletterRouter } from "./routers/newsletter/newsletter.router"
import { paymentsRouter } from "./routers/payments/payments.router"
import { propertyRouter } from "./routers/property/property.router"
import { queueRouter } from "./routers/queue/queue.polling.router"
import { surveyRouter } from "./routers/survey/survey.router"
import { userRouter } from "./routers/user/user.router"
import { waitlistRouter } from "./routers/waitlist/waitlist.router"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  user: userRouter,
  admin: adminRouter,
  payments: paymentsRouter,
  waitlist: waitlistRouter,
  newsletter: newsletterRouter,
  leads: leadsRouter,
  inventory: inventoryRouter,
  property: propertyRouter,
  featureTemplate: featureTemplateRouter,
  fileUpload: fileUploadRouter,
  queue: queueRouter,
  survey: surveyRouter,
  buyer: buyerOnboardingRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

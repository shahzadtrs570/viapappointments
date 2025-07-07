// packages/api/src/root.ts
import { createTRPCRouter } from "./trpc";

// Import existing routers
import { userRouter } from "./routers/user/user.router";
import { authRouter } from "./routers/auth/auth.router";
import { billingRouter } from "./routers/billing/billing.router";
import { adminRouter } from "./routers/admin/admin.router";
// ... other existing imports

// Import our new routers
import { newsletterRouter } from "./routers/newsletter/newsletter.router";
import { leadsRouter } from "./routers/leads/leads.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  auth: authRouter,
  billing: billingRouter,
  admin: adminRouter,
  // ... other existing routers
  
  // Add our new routers
  newsletter: newsletterRouter,
  leads: leadsRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

/* eslint-disable import/export */
import type { AppRouter } from "./root"
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

import { appRouter } from "./root"
import { lemonSqueezyService } from "./routers/payments/adapters/lemonSqueezy/service/lemonSqueezy.service"
import { webhookHasMeta } from "./routers/payments/adapters/lemonSqueezy/service/lemonSqueezy.service.typeguards"
import { stripeService } from "./routers/payments/adapters/stripe/service/stripe.service"
import { createCallerFactory, createTRPCContext } from "./trpc"

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter)

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>

export { createTRPCContext, appRouter, createCaller }
export type { AppRouter, RouterInputs, RouterOutputs }

export { lemonSqueezyService, webhookHasMeta, stripeService }

// Export the new routers as part of the API
export * from "./trpc"
export * from "./root"
export * from "./routers/admin/sub-routers/properties/properties.router"
export * from "./routers/admin/sub-routers/offers/offers.router"
export * from "./routers/admin/sub-routers/sellerProfiles/sellerProfiles.router"

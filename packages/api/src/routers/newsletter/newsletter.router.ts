import { TRPCError } from "@trpc/server"
import { z } from "zod"
// import { validateTurnstileToken } from "@package/turnstile"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc"
import { newsletterService } from "./service/newsletter.service"
import { validateTurnstileToken } from "../../utils/turnstile"

// Validation schema for newsletter subscription
const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
  turnstileToken: z.string({
    required_error: "Turnstile verification is required",
  }),
})

// Validation schema for subscribers query
const getSubscribersQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

export const newsletterRouter = createTRPCRouter({
  // Public procedure for subscribing to the newsletter
  subscribe: publicProcedure
    .input(subscribeSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify Turnstile token
      const turnstileVerification = await validateTurnstileToken(
        input.turnstileToken
      )
      if (!turnstileVerification) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Turnstile verification. Please try again.",
        })
      }

      return newsletterService.subscribeToNewsletter({
        input,
        ctx: {
          headers: Object.fromEntries(ctx.headers),
        },
      })
    }),

  // Public procedure for unsubscribing from the newsletter
  unsubscribe: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(({ input }) => {
      return newsletterService.unsubscribeFromNewsletter({ input })
    }),

  // Protected procedure for admin to get subscribers
  getSubscribers: protectedProcedure
    .input(getSubscribersQuerySchema)
    .query(({ input, ctx }) => {
      return newsletterService.getSubscribers({
        input,
        session: ctx.session.user,
      })
    }),

  // Protected procedure for admin to delete a subscriber
  deleteSubscriber: protectedProcedure
    .input(z.object({ subscriberId: z.string() }))
    .mutation(({ input, ctx }) => {
      return newsletterService.deleteSubscriber({
        input,
        session: ctx.session.user,
      })
    }),

  // Protected procedure for admin to update a subscriber
  updateSubscriber: protectedProcedure
    .input(
      z.object({
        subscriberId: z.string(),
        isActive: z.boolean(),
      })
    )
    .mutation(({ input, ctx }) => {
      return newsletterService.updateSubscriber({
        input,
        session: ctx.session.user,
      })
    }),

  // Protected procedure for admin to export subscribers
  exportSubscribers: protectedProcedure
    .input(
      z.object({
        isActive: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        format: z.enum(["csv", "json"]),
      })
    )
    .mutation(({ input, ctx }) => {
      return newsletterService.exportSubscribers({
        input,
        session: ctx.session.user,
      })
    }),

  // Protected procedure for admin to get statistics
  getStatistics: protectedProcedure.query(({ ctx }) => {
    return newsletterService.getNewsletterStatistics({
      session: {
        id: ctx.session.user.id,
        email: ctx.session.user.email ?? "",
        role: ctx.session.user.role,
      },
    })
  }),
})

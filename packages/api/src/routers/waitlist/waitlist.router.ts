import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc"
import { waitlistService } from "./service/waitlist.service"
import { validateTurnstileToken } from "../../utils/turnstile"

const waitlistEntrySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  waitlistType: z.string(),
  source: z.string().optional(),
  referralCode: z.string().optional(),
  turnstileToken: z.string({
    required_error: "Turnstile verification is required",
  }),
  website: z.string().max(0, "This field should be empty").optional(),
  metadata: z.record(z.string().or(z.null())).optional(),
})

type WaitlistServiceResponse = Awaited<
  ReturnType<typeof waitlistService.createWaitlistEntry>
>

export const waitlistRouter = createTRPCRouter({
  create: publicProcedure
    .input(waitlistEntrySchema)
    .mutation(async ({ input }): Promise<WaitlistServiceResponse> => {
      if (input.website) {
        // This is a spam bot check - return same shape as the actual service response
        return Promise.resolve({
          id: "",
          name: "",
          email: "",
          status: "pending",
          waitlistType: "",
          source: null,
          referralCode: null,
          metadata: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }

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

      // Create waitlist entry if verification passes
      return waitlistService.createWaitlistEntry({ input })
    }),

  getEntries: protectedProcedure
    .input(
      z.object({
        waitlistType: z.string().optional(),
        status: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        query: z.string().optional(),
      })
    )
    .query(({ input, ctx }) => {
      return waitlistService.getWaitlistEntries({
        input,
        session: ctx.session.user,
      })
    }),

  export: protectedProcedure
    .input(
      z.object({
        waitlistType: z.string().optional(),
        status: z.string().optional(),
        format: z.enum(["csv", "json"]),
      })
    )
    .mutation(({ input, ctx }) => {
      return waitlistService.exportWaitlistEntries({
        input,
        session: ctx.session.user,
      })
    }),

  updateEntry: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          status: z.string().optional(),
          notes: z.string().optional(),
        }),
      })
    )
    .mutation(({ input, ctx }) => {
      return waitlistService.updateWaitlistEntry({
        input,
        session: ctx.session.user,
      })
    }),

  deleteEntry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return waitlistService.deleteWaitlistEntry({
        input,
        session: ctx.session.user,
      })
    }),

  getStatistics: protectedProcedure.query(({ ctx }) => {
    return waitlistService.getWaitlistStatistics({
      session: ctx.session.user,
    })
  }),
})

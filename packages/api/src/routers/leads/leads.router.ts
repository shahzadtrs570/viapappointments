import { LeadStatus } from "@package/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc"
import { leadsService } from "./service/leads.service"
import { validateTurnstileToken } from "../../utils/turnstile"

// Validation schema for lead submission
const submitLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  leadType: z.string().min(1, "Lead type is required"),
  source: z.string().optional(),
  turnstileToken: z.string({
    required_error: "Turnstile verification is required",
  }),
  metadata: z.record(z.unknown()).optional(),
})

// Validation schema for lead query parameters
const getLeadsQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  cursor: z.string().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  leadType: z.string().optional(),
  assignedTo: z.string().optional(),
  search: z.string().optional(),
})

// Validation schema for lead status update
const updateLeadStatusSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  status: z.nativeEnum(LeadStatus),
  assignedTo: z.string().optional(),
})

export const leadsRouter = createTRPCRouter({
  // Public procedure for submitting leads from marketing site
  submit: publicProcedure
    .input(submitLeadSchema)
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

      // Proceed with lead submission if verification passes
      return leadsService.submitLead({
        input,
        ctx: {
          headers: ctx.headers,
        },
      })
    }),

  // Protected procedure for admin to get leads
  getLeads: protectedProcedure
    .input(getLeadsQuerySchema)
    .query(({ input, ctx }) => {
      return leadsService.getLeads({
        input,
        session: ctx.session.user,
      })
    }),

  // Protected procedure to get a single lead by ID
  getLeadById: protectedProcedure
    .input(z.object({ leadId: z.string() }))
    .query(({ input, ctx }) => {
      return leadsService.getLeadById({
        input,
        session: ctx.session.user,
      })
    }),

  // Protected procedure to update lead status
  updateStatus: protectedProcedure
    .input(updateLeadStatusSchema)
    .mutation(({ input, ctx }) => {
      return leadsService.updateLeadStatus({
        input,
        session: ctx.session.user,
      })
    }),

  // Protected procedure to delete a lead
  deleteLead: protectedProcedure
    .input(z.object({ leadId: z.string() }))
    .mutation(({ input, ctx }) => {
      return leadsService.deleteLead({
        input,
        session: ctx.session.user,
      })
    }),

  // Protected procedure to export leads
  exportLeads: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(LeadStatus).optional(),
        leadType: z.string().optional(),
        format: z.enum(["csv", "json"]),
      })
    )
    .mutation(({ input, ctx }) => {
      return leadsService.exportLeads({
        input,
        session: ctx.session.user,
      })
    }),

  // Protected procedure to get lead statistics
  getStatistics: protectedProcedure.query(({ ctx }) => {
    return leadsService.getLeadStatistics({
      session: ctx.session.user,
    })
  }),
})

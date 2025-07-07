// packages/api/src/routers/leads/leads.router.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { LeadStatus } from "@package/db";
import { sendEmail } from "@package/email";

// Define suggested lead types as constants but don't enforce as enum
export const LEAD_TYPES = {
  MEETING: 'meeting',
  WORKSHOP: 'workshop',
  SERVICE: 'service',
  CONSULTATION: 'consultation',
  OTHER: 'other',
} as const;

// Lead status enum to match Prisma
const LeadStatusEnum = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'LOST'
]);

// Basic lead submission schema with string-based leadType
const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  leadType: z.string(), // Accept any string for leadType
  source: z.string().optional(),
  // Allow any additional metadata as JSON
  metadata: z.record(z.string(), z.any()).optional(),
});

// Validation schema for lead submission
const submitLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  leadType: z.string().min(1, "Lead type is required"),
  source: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Validation schema for lead status update
const updateLeadStatusSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  status: z.nativeEnum(LeadStatus),
  assignedTo: z.string().optional(),
});

// Validation schema for lead query parameters
const getLeadsQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  cursor: z.string().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  leadType: z.string().optional(),
  assignedTo: z.string().optional(),
  search: z.string().optional(),
});

export const leadsRouter = createTRPCRouter({
  // Public procedure for submitting leads from marketing site
  submit: publicProcedure
    .input(submitLeadSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Create the lead in the database
        const lead = await ctx.prisma.lead.create({
          data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            company: input.company,
            message: input.message,
            leadType: input.leadType,
            source: input.source || "website",
            status: "NEW",
            metadata: input.metadata || {},
          },
        });

        // Send notification email to admin
        await sendEmail({
          to: procprocess.env.ENV_CLIENT_AUTH_ADMIN_EMAIL || '',
          subject: `New ${input.leadType} Lead: ${input.name}`,
          template: "lead-notification",
          props: {
            lead: {
              id: lead.id,
              name: lead.name,
              email: lead.email,
              phone: lead.phone,
              company: lead.company,
              message: lead.message,
              leadType: lead.leadType,
              source: lead.source,
              metadata: lead.metadata,
            },
            adminUrl: `${process.env.DASHBOARD_URL}/admin/leads?id=${lead.id}`,
          },
        });

        return {
          leadId: lead.id,
          success: true,
        };
      } catch (error) {
        console.error("Error submitting lead:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit lead. Please try again.",
        });
      }
    }),

  // Protected procedure for admin to get leads
  getLeads: protectedProcedure
    .input(getLeadsQuerySchema)
    .query(async ({ ctx, input }) => {
      // Check if user has admin access
      if (ctx.user.role !== "ADMIN" && ctx.user.role !== "SUPER_ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access leads",
        });
      }

      // Build filter based on input
      const filter: any = {};

      if (input.status) {
        filter.status = input.status;
      }

      if (input.leadType) {
        filter.leadType = input.leadType;
      }

      if (input.assignedTo) {
        filter.assignedTo = input.assignedTo;
      }

      if (input.search) {
        filter.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { email: { contains: input.search, mode: "insensitive" } },
          { company: { contains: input.search, mode: "insensitive" } },
        ];
      }

      // Get leads with pagination
      const leads = await ctx.prisma.lead.findMany({
        where: filter,
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      // Handle pagination
      let nextCursor: string | undefined = undefined;
      if (leads.length > input.limit) {
        const nextItem = leads.pop();
        nextCursor = nextItem?.id;
      }

      // Get lead type statistics for filters
      const leadTypeStats = await ctx.prisma.lead.groupBy({
        by: ["leadType"],
        _count: true,
      });

      // Get status statistics for filters
      const statusStats = await ctx.prisma.lead.groupBy({
        by: ["status"],
        _count: true,
      });

      return {
        leads,
        nextCursor,
        leadTypeStats: leadTypeStats.map((stat) => ({
          type: stat.leadType,
          count: stat._count,
        })),
        statusStats: statusStats.map((stat) => ({
          status: stat.status,
          count: stat._count,
        })),
      };
    }),

  // Protected procedure to update lead status
  updateStatus: protectedProcedure
    .input(updateLeadStatusSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user has admin access
      if (ctx.user.role !== "ADMIN" && ctx.user.role !== "SUPER_ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update leads",
        });
      }

      try {
        // Update the lead status
        const updatedLead = await ctx.prisma.lead.update({
          where: { id: input.leadId },
          data: {
            status: input.status,
            ...(input.assignedTo && { assignedTo: input.assignedTo }),
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          lead: updatedLead,
        };
      } catch (error) {
        console.error("Error updating lead status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR", 
          message: "Failed to update lead status. Please try again.",
        });
      }
    }),

  // Protected procedure to get a single lead by ID
  getLeadById: protectedProcedure
    .input(z.object({ leadId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if user has admin access
      if (ctx.user.role !== "ADMIN" && ctx.user.role !== "SUPER_ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access leads",
        });
      }

      const lead = await ctx.prisma.lead.findUnique({
        where: { id: input.leadId },
      });

      if (!lead) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead not found",
        });
      }

      return { lead };
    }),

  // Protected procedure to delete a lead
  deleteLead: protectedProcedure
    .input(z.object({ leadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user has super admin access
      if (ctx.user.role !== "SUPER_ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only super admins can delete leads",
        });
      }

      try {
        await ctx.prisma.lead.delete({
          where: { id: input.leadId },
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting lead:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete lead. Please try again.",
        });
      }
    }),
});

import { type Lead, LeadStatus } from "@package/db"
import { GenericSystemEmail, sendEmail } from "@package/email"
import { TRPCError } from "@trpc/server"

import type {
  DeleteLeadArgs,
  ExportLeadsArgs,
  GetLeadByIdArgs,
  GetLeadsArgs,
  GetLeadStatisticsArgs,
  LeadStatistics,
  SubmitLeadArgs,
  UpdateLeadStatusArgs,
} from "./leads.service.types"
import type { Prisma } from "@prisma/client"

import { leadsRepository } from "../repository/leads.repository"

// Rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const WINDOW_MS = 3600000 // 1 hour
const MAX_REQUESTS = 5 // 5 requests per hour per IP

class LeadsService {
  private checkRateLimit(ip: string): void {
    const now = Date.now()
    const key = `leads:${ip}`
    const record = rateLimit.get(key)

    if (!record) {
      rateLimit.set(key, {
        count: 1,
        resetTime: now + WINDOW_MS,
      })
      return
    }

    if (now > record.resetTime) {
      rateLimit.set(key, {
        count: 1,
        resetTime: now + WINDOW_MS,
      })
      return
    }

    if (record.count >= MAX_REQUESTS) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many subscription attempts. Please try again later.",
      })
    }

    record.count++
    rateLimit.set(key, record)
  }
  public async submitLead(args: SubmitLeadArgs) {
    try {
      const ip = args.ctx?.headers.get("x-forwarded-for") || "unknown"
      this.checkRateLimit(ip)

      // Create the lead in the database
      const lead = await leadsRepository.createLead({
        name: args.input.name,
        email: args.input.email,
        phone: args.input.phone,
        company: args.input.company,
        message: args.input.message,
        leadType: args.input.leadType,
        source: args.input.source || "website",
        metadata: args.input.metadata as Prisma.JsonValue,
      })

      // Create email content
      const htmlContent = `
        <h1>New Lead Submission</h1>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone || "N/A"}</p>
        <p><strong>Company:</strong> ${lead.company || "N/A"}</p>
        <p><strong>Type:</strong> ${lead.leadType}</p>
        <p><strong>Source:</strong> ${lead.source || "Website"}</p>
        <p><strong>Message:</strong> ${lead.message || "N/A"}</p>
        <p><a href="${process.env.DASHBOARD_URL}/admin/leads?id=${lead.id}">View in Dashboard</a></p>
      `

      // Send notification email to admin
      try {
        await sendEmail({
          from: process.env.ENV_CLIENT_AUTH_ADMIN_EMAIL || "",
          email: [
            process.env.EMAIL_TO_RECEIEVE_USER_REQUESTS ||
              "oliver@rainventures.ai",
          ],
          subject: `New ${args.input.leadType} Lead: ${args.input.name}`,
          react: GenericSystemEmail({
            preview: `New ${args.input.leadType} Lead: ${args.input.name}`,
            email: process.env.ENV_CLIENT_AUTH_ADMIN_EMAIL || "",
            reactBody: htmlContent,
          }),
        })
      } catch (emailError) {
        // Failed to send notification email, continue execution
        // Continue execution even if email fails
      }

      return { leadId: lead.id, success: true }
    } catch (error) {
      if (error instanceof TRPCError) throw error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to submit lead. Please try again.",
      })
    }
  }

  public async getLeads(args: GetLeadsArgs) {
    try {
      this.checkIsAdmin(args.session)

      const result = await leadsRepository.getLeads(args.input)
      const totalCount = await leadsRepository.getLeadCount({
        status: args.input.status,
        leadType: args.input.leadType,
        assignedTo: args.input.assignedTo,
      })

      return {
        leads: result.leads,
        nextCursor: result.nextCursor,
        totalCount,
      }
    } catch (error) {
      this.handleError(error, "fetching leads")
    }
  }

  public async getLeadById(args: GetLeadByIdArgs) {
    try {
      this.checkIsAdmin(args.session)

      const lead = await leadsRepository.findLeadById(args.input.leadId)

      if (!lead) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead not found",
        })
      }

      return lead
    } catch (error) {
      this.handleError(error, "fetching lead details")
    }
  }

  public async updateLeadStatus(args: UpdateLeadStatusArgs) {
    try {
      this.checkIsAdmin(args.session)

      const updatedLead = await leadsRepository.updateLead(args.input.leadId, {
        status: args.input.status,
        ...(args.input.assignedTo && { assignedTo: args.input.assignedTo }),
      })

      return {
        success: true,
        message: `Lead status updated to ${args.input.status}`,
        lead: updatedLead,
      }
    } catch (error) {
      this.handleError(error, "updating lead status")
    }
  }

  public async deleteLead(args: DeleteLeadArgs) {
    try {
      this.checkIsSuperAdmin(args.session)

      await leadsRepository.deleteLead(args.input.leadId)

      return {
        success: true,
        message: "Lead deleted successfully",
      }
    } catch (error) {
      this.handleError(error, "deleting lead")
    }
  }

  public async exportLeads(args: ExportLeadsArgs) {
    try {
      this.checkIsAdmin(args.session)

      // Get all leads matching the filter criteria
      const leads = await leadsRepository.getAllLeads({
        status: args.input.status,
        leadType: args.input.leadType,
      })

      if (leads.length === 0) {
        return {
          success: false,
          message: "No leads found matching the criteria.",
          data: "",
        }
      }

      let exportData = ""

      if (args.input.format === "csv") {
        // Generate CSV
        exportData = this.generateCsv(leads)
      } else {
        // Generate JSON
        exportData = JSON.stringify(leads, null, 2)
      }

      return {
        success: true,
        message: `Exported ${leads.length} leads in ${args.input.format} format.`,
        data: exportData,
      }
    } catch (error) {
      this.handleError(error, "exporting leads")
    }
  }

  public async getLeadStatistics(
    args: GetLeadStatisticsArgs
  ): Promise<LeadStatistics> {
    try {
      this.checkIsAdmin(args.session)

      // Get total lead count
      const totalLeads = await leadsRepository.getLeadCount({})

      // Get leads by type
      const leadsByType = await leadsRepository.getLeadTypeStats()

      // Get leads by status
      const leadsByStatus = await leadsRepository.getStatusStats()

      // Get leads by source
      const leadsBySource = await leadsRepository.getLeadsBySource()

      // Get recent leads (last 7 days)
      const recentLeads = await leadsRepository.getRecentLeads(7)

      // Calculate conversion rate
      const convertedLeads = leadsByStatus.find(
        (stat) => stat.status === LeadStatus.CONVERTED
      )
      const conversionRate =
        totalLeads > 0 && convertedLeads
          ? (convertedLeads.count / totalLeads) * 100
          : 0

      return {
        totalLeads,
        leadsByType,
        leadsByStatus,
        leadsBySource,
        recentLeads,
        conversionRate,
      }
    } catch (error) {
      this.handleError(error, "fetching lead statistics")
    }
  }

  private checkIsAdmin(session: { role: string }): void {
    if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "You don't have permission to perform this action. Admin role required.",
      })
    }
  }

  private checkIsSuperAdmin(session: { role: string }): void {
    if (session.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "You don't have permission to perform this action. Super admin role required.",
      })
    }
  }

  private handleError(error: unknown, action: string): never {
    if (error instanceof TRPCError) throw error
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed ${action}. Please try again.`,
    })
  }

  private generateCsv(leads: Lead[]): string {
    const headers = "Email,Name,Phone,Company,Type,Status,Source,Created Date\n"
    const rows = leads
      .map(
        (lead) =>
          `"${lead.email}","${lead.name || ""}","${lead.phone || ""}","${lead.company || ""}","${lead.leadType}","${lead.status}","${lead.source || ""}","${lead.createdAt.toISOString()}"`
      )
      .join("\n")

    return headers + rows
  }
}

export const leadsService = new LeadsService()

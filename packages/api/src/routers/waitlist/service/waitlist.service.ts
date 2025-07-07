import { sendEmail, WaitlistConfirmationEmail } from "@package/email"
import { TRPCError } from "@trpc/server"

import type {
  CreateWaitlistEntryArgs,
  DeleteWaitlistEntryArgs,
  ExportWaitlistEntriesArgs,
  GetWaitlistEntriesArgs,
  GetWaitlistStatisticsArgs,
  UpdateWaitlistEntryArgs,
  WaitlistStatistics,
} from "./waitlist.service.types"
import type { WaitlistEntry } from "@prisma/client"

import { waitlistRepository } from "../repository/waitlist.repository"

const rateLimit = new Map<string, { count: number; resetTime: number }>()
const WINDOW_MS = 3600000 // 1 hour
const MAX_REQUESTS = 5 // 5 requests per hour per IP

class WaitlistService {
  private checkRateLimit(ip: string): void {
    const now = Date.now()
    const key = `waitlist:${ip}`
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
        message: "Too many waitlist signup attempts. Please try again later.",
      })
    }

    record.count++
    rateLimit.set(key, record)
  }

  public async createWaitlistEntry(args: CreateWaitlistEntryArgs) {
    const ip = args.ctx?.headers.get("x-forwarded-for") || "unknown"
    this.checkRateLimit(ip)

    const existingEntry = await waitlistRepository.findWaitlistEntryByEmail(
      args.input.email
    )

    if (existingEntry) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email already registered for waitlist",
      })
    }

    const createData = { ...args.input }
    delete createData.website
    const entry = await waitlistRepository.createWaitlistEntry(createData)

    try {
      if (
        process.env.NEXT_PUBLIC_APP_ENV === "development" &&
        process.env.DEBUG_MAGIC_LINK === "true"
      ) {
        console.log(
          "\n------------------------------------------------------------"
        )
        console.log("🔑 Development Mode: Skipping waitlist confirmation email")
        console.log(
          "------------------------------------------------------------\n"
        )
        return entry
      }

      await sendEmail({
        email: [entry.email],
        subject: "Welcome to the NextJet Waitlist! 🚀",
        react: WaitlistConfirmationEmail({
          name: entry.name,
          waitlistType: entry.waitlistType,
        }),
      })

      return entry
    } catch (error) {
      console.error("Failed to send waitlist confirmation email:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Failed to send waitlist confirmation email. Please try again later.",
      })
    }
  }

  public async getWaitlistEntries(args: GetWaitlistEntriesArgs) {
    if (args.session.role !== "ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can access waitlist entries",
      })
    }

    const skip = (args.input.page - 1) * args.input.limit
    return waitlistRepository.getWaitlistEntries({
      ...args.input,
      skip,
      take: args.input.limit,
    })
  }

  public updateWaitlistEntry(args: UpdateWaitlistEntryArgs) {
    if (args.session.role !== "ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can update waitlist entries",
      })
    }

    return waitlistRepository.updateWaitlistEntry({
      id: args.input.id,
      data: args.input.data,
    })
  }

  public deleteWaitlistEntry(args: DeleteWaitlistEntryArgs) {
    if (args.session.role !== "ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can delete waitlist entries",
      })
    }

    return waitlistRepository.deleteWaitlistEntry(args.input.id)
  }

  public async exportWaitlistEntries(args: ExportWaitlistEntriesArgs) {
    if (args.session.role !== "ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can export waitlist entries",
      })
    }

    const entries = await waitlistRepository.getAllWaitlistEntries({
      waitlistType: args.input.waitlistType,
      status: args.input.status,
    })

    if (args.input.format === "json") {
      return JSON.stringify(entries, null, 2)
    }

    const headers = [
      "ID",
      "Email",
      "Name",
      "Type",
      "Status",
      "Source",
      "Referral Code",
      "Created At",
      "Notes",
    ].join(",")

    const rows = entries.map((entry: WaitlistEntry) =>
      [
        entry.id,
        entry.email,
        entry.name,
        entry.waitlistType,
        entry.status,
        entry.source || "",
        entry.referralCode || "",
        entry.createdAt.toISOString(),
        entry.notes?.replace(/,/g, ";") || "",
      ]
        .map((value) => `"${value}"`)
        .join(",")
    )

    return [headers, ...rows].join("\n")
  }

  public async getWaitlistStatistics(
    args: GetWaitlistStatisticsArgs
  ): Promise<WaitlistStatistics> {
    if (args.session.role !== "ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can access waitlist statistics",
      })
    }

    const [totalEntries, entriesByType, entriesByStatus, recentSignups] =
      await Promise.all([
        waitlistRepository.countWaitlistEntries(),
        waitlistRepository.getEntriesByType(),
        waitlistRepository.getEntriesByStatus(),
        waitlistRepository.getRecentSignups(),
      ])

    const convertedCount =
      entriesByStatus.find((s) => s.status === "converted")?.count || 0

    return {
      totalEntries,
      entriesByType,
      entriesByStatus,
      recentSignups,
      conversionRate: (convertedCount / totalEntries) * 100,
    }
  }
}

export const waitlistService = new WaitlistService()

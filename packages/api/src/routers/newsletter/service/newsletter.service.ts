import { GenericSystemEmail, sendEmail } from "@package/email"
import { TRPCError } from "@trpc/server"

import type {
  DeleteSubscriberArgs,
  ExportSubscribersArgs,
  GetNewsletterStatisticsArgs,
  GetSubscribersArgs,
  MonthlyGrowthData,
  SourceStat,
  SubscribeToNewsletterArgs,
  UnsubscribeFromNewsletterArgs,
  UpdateSubscriberArgs,
} from "./newsletter.service.types"

import { newsletterRepository } from "../repository/newsletter.repository"

// Helper function to create a React element mockup with HTML content
function createHtmlElement(htmlContent: string): {
  type: string
  props: { dangerouslySetInnerHTML: { __html: string } }
  key: null
  ref: null
  $$typeof: symbol
} {
  // This creates a minimal object structure that simulates a React element
  return {
    type: "div",
    props: {
      dangerouslySetInnerHTML: { __html: htmlContent },
    },
    key: null,
    ref: null,
    $$typeof: Symbol.for("react.element"),
  }
}

// Rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const WINDOW_MS = 3600000 // 1 hour
const MAX_REQUESTS = 5 // 5 requests per hour per IP

class NewsletterService {
  private checkRateLimit(ip: string): void {
    const now = Date.now()
    const key = `newsletter:${ip}`
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

  /**
   * Subscribe a user to the newsletter
   */
  async subscribeToNewsletter({ input, ctx }: SubscribeToNewsletterArgs) {
    try {
      // Check rate limit for the IP address
      const ipAddress =
        ctx.headers["x-forwarded-for"] || ctx.headers["x-real-ip"] || "unknown"
      this.checkRateLimit(Array.isArray(ipAddress) ? ipAddress[0] : ipAddress)

      // Check if email already exists in subscription list
      const existingSubscriber =
        await newsletterRepository.findSubscriberByEmail(input.email)

      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          return {
            success: true,
            message: "You are already subscribed to our newsletter.",
            subscriberId: existingSubscriber.id,
          }
        } else {
          // Reactivate the subscription if it was previously unsubscribed
          const reactivatedSubscriber =
            await newsletterRepository.updateSubscriber(existingSubscriber.id, {
              isActive: true,
            })

          return {
            success: true,
            message: "Your subscription has been reactivated.",
            subscriberId: reactivatedSubscriber.id,
          }
        }
      }
      // Create new subscriber
      const userAgent = ctx.headers["user-agent"] || "unknown"

      // Combine firstName and lastName into name

      const newSubscriber = await newsletterRepository.createSubscriber({
        email: input.email,
        name: input.name,
        source: input.source || "website",
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
        metadata: {
          ...input.metadata,
          turnstileToken: input.turnstileToken,
        },
        tags: input.tags || [],
      })

      // Send confirmation email to subscriber
      const subscriberHtml = `
        <div>
          <p>Hello ${input.name || "there"},</p>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>You'll now receive updates and news from us.</p>
          <p>
            If you wish to unsubscribe, 
            <a href="${process.env.NEXT_PUBLIC_MARKETING_URL || "http://localhost:3001"}/newsletter/unsubscribe?token=${newSubscriber.unsubscribeToken}">
              click here
            </a>
          </p>
        </div>
      `
      await sendEmail({
        email: [input.email],
        subject: "Newsletter Subscription Confirmation",
        react: createHtmlElement(subscriberHtml),
      })

      // Send notification email to admin
      const adminEmail =
        process.env.EMAIL_TO_RECEIEVE_USER_REQUESTS || "oliver@rainventures.ai"
      const dateFormatted = new Date().toLocaleString()

      const adminHtml = `
        <h2>New Newsletter Subscription</h2>
        <p>A new user has subscribed to the newsletter:</p>
        <ul>
          <li><strong>Email:</strong> ${input.email}</li>
          <li><strong>Name:</strong> ${input.name || ""}</li>
          <li><strong>Date:</strong> ${dateFormatted}</li>
          <li><strong>Source:</strong> ${input.source || "website"}</li>
          <li><strong>IP Address:</strong> ${Array.isArray(ipAddress) ? ipAddress[0] : ipAddress}</li>
        </ul>
      `

      await sendEmail({
        email: [adminEmail],
        subject: "New Newsletter Subscription",
        react: GenericSystemEmail({
          email: adminEmail,
          preview: "New Newsletter Subscription",
          reactBody: createHtmlElement(adminHtml),
        }),
      })

      return {
        success: true,
        message: "You have successfully subscribed to our newsletter.",
        subscriberId: newSubscriber.id,
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to subscribe to newsletter. Please try again.",
      })
    }
  }

  /**
   * Unsubscribe a user from the newsletter
   */
  async unsubscribeFromNewsletter({ input }: UnsubscribeFromNewsletterArgs) {
    try {
      // Find subscriber by unsubscribe token
      const subscriber = await newsletterRepository.findSubscriberByToken(
        input.token
      )

      if (!subscriber) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Subscription not found. The token may be invalid or expired.",
        })
      }

      // Update subscriber status - only update isActive (updatedAt will be automatically updated)
      await newsletterRepository.updateSubscriber(subscriber.id, {
        isActive: false,
      })

      return {
        success: true,
        message: "You have been unsubscribed from our newsletter.",
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to unsubscribe. Please try again.",
      })
    }
  }

  /**
   * Get newsletter subscribers with filtering and pagination
   */
  async getSubscribers({ input, session }: GetSubscribersArgs) {
    // Check if user has admin access
    if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to access newsletter subscribers",
      })
    }

    try {
      const { subscribers, nextCursor, totalCount } =
        await newsletterRepository.getSubscribers({
          isActive: input.isActive,
          search: input.search,
          source: input.source,
          cursor: input.cursor,
          limit: input.limit,
        })

      return {
        subscribers,
        nextCursor,
        totalCount,
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch subscribers. Please try again.",
      })
    }
  }

  /**
   * Delete a newsletter subscriber
   */
  async deleteSubscriber({ input, session }: DeleteSubscriberArgs) {
    // Check if user has admin access
    if (session.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only super admins can delete subscribers",
      })
    }

    try {
      await newsletterRepository.deleteSubscriber(input.subscriberId)

      return {
        success: true,
        message: "Subscriber deleted successfully.",
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete subscriber. Please try again.",
      })
    }
  }

  /**
   * Update a newsletter subscriber's status
   */
  async updateSubscriber({ input, session }: UpdateSubscriberArgs) {
    // Check if user has admin access
    if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to update subscribers",
      })
    }

    try {
      // First check if the subscriber exists
      const subscriber = await newsletterRepository.findSubscriberById(
        input.subscriberId
      )

      if (!subscriber) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscriber not found",
        })
      }

      // Just update the isActive field
      const updatedSubscriber = await newsletterRepository.updateSubscriber(
        input.subscriberId,
        {
          isActive: input.isActive,
        }
      )

      return {
        success: true,
        message: input.isActive
          ? "Subscriber has been activated."
          : "Subscriber has been deactivated.",
        subscriberId: updatedSubscriber.id,
        isActive: updatedSubscriber.isActive,
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }

      console.error("Error updating subscriber:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update subscriber. Please try again.",
      })
    }
  }

  /**
   * Export newsletter subscribers
   */
  async exportSubscribers({ input, session }: ExportSubscribersArgs) {
    // Check if user has admin access
    if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to export subscriber data",
      })
    }

    try {
      const { subscribers } = await newsletterRepository.getSubscribers({
        isActive: input.isActive,
        source: input.source,
        limit: 10000, // Export up to 10k records
      })

      if (subscribers.length === 0) {
        return {
          success: false,
          message: "No subscribers found matching the criteria.",
          data: "",
        }
      }

      let exportData = ""

      if (input.format === "csv") {
        // Generate CSV
        const headers = "Email,Name,Subscribed Date,Source,Is Active\n"
        const rows = subscribers
          .map(
            (sub) =>
              `"${sub.email}","${sub.name || ""}","${sub.subscribedAt.toISOString()}","${sub.source || ""}","${sub.isActive}"`
          )
          .join("\n")

        exportData = headers + rows
      } else {
        // Generate JSON (exclude sensitive info)
        const safeSubscribers = subscribers.map((sub) => ({
          email: sub.email,
          name: sub.name,
          subscribedAt: sub.subscribedAt,
          source: sub.source,
          isActive: sub.isActive,
        }))

        exportData = JSON.stringify(safeSubscribers, null, 2)
      }

      return {
        success: true,
        message: `Exported ${subscribers.length} subscribers in ${input.format} format.`,
        data: exportData,
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to export subscribers. Please try again.",
      })
    }
  }

  /**
   * Get newsletter statistics
   */
  async getNewsletterStatistics({ session }: GetNewsletterStatisticsArgs) {
    // Check if user has admin access
    if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to access newsletter statistics",
      })
    }

    // Initialize default values
    let totalSubscribers = 0
    let activeSubscribers = 0
    let monthlyGrowth: MonthlyGrowthData[] = []
    let sourceStats: SourceStat[] = []

    try {
      // Get each statistic independently so one failure doesn't block everything
      try {
        totalSubscribers = await newsletterRepository.getSubscriberCount({})
      } catch (error) {
        console.error("Error fetching total subscribers:", error)
      }

      try {
        activeSubscribers = await newsletterRepository.getSubscriberCount({
          isActive: true,
        })
      } catch (error) {
        console.error("Error fetching active subscribers:", error)
      }

      try {
        // Get monthly growth data (last 6 months)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        monthlyGrowth =
          await newsletterRepository.getMonthlySubscriberGrowth(sixMonthsAgo)
      } catch (error) {
        console.error("Error fetching monthly growth:", error)
      }

      try {
        // Get source distribution
        sourceStats = await newsletterRepository.getSubscribersBySource()
      } catch (error) {
        console.error("Error fetching source stats:", error)
      }

      return {
        totalSubscribers,
        activeSubscribers,
        monthlyGrowth,
        sourceStats,
      }
    } catch (error) {
      console.error("Error in getNewsletterStatistics:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch newsletter statistics. Please try again.",
      })
    }
  }
}

export const newsletterService = new NewsletterService()

import { randomBytes } from "crypto"

import { PrismaClient } from "@package/db"

import type { Prisma } from "@package/db"

// Initialize Prisma client
const prisma = new PrismaClient()

class NewsletterRepository {
  /**
   * Create a new newsletter subscriber
   */
  async createSubscriber(data: {
    email: string
    name?: string
    source?: string
    ipAddress?: string
    userAgent?: string
    metadata?: Record<string, unknown>
    tags?: string[]
  }) {
    const unsubscribeToken = this.generateUnsubscribeToken()

    return prisma.newsletterSubscriber.create({
      data: {
        email: data.email,
        name: data.name,
        source: data.source,
        isActive: true,
        tags: data.tags || [],
        metadata: {
          ...(data.metadata || {}),
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
        unsubscribeToken,
      },
    })
  }

  /**
   * Generate a new unsubscribe token for a subscriber
   */
  async generateUnsubscribeTokenForSubscriber(
    subscriberId: string
  ): Promise<string> {
    const token = this.generateUnsubscribeToken()

    await prisma.newsletterSubscriber.update({
      where: { id: subscriberId },
      data: { unsubscribeToken: token },
    })

    return token
  }

  /**
   * Get or create an unsubscribe token for a subscriber
   */
  async getOrCreateUnsubscribeTokenForSubscriber(
    subscriberId: string
  ): Promise<string> {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: subscriberId },
      select: { unsubscribeToken: true },
    })

    if (subscriber?.unsubscribeToken) {
      return subscriber.unsubscribeToken
    }

    return this.generateUnsubscribeTokenForSubscriber(subscriberId)
  }

  /**
   * Find a subscriber by email
   */
  async findSubscriberByEmail(email: string) {
    return prisma.newsletterSubscriber.findUnique({
      where: { email },
    })
  }

  /**
   * Find a subscriber by ID
   */
  async findSubscriberById(id: string) {
    return prisma.newsletterSubscriber.findUnique({
      where: { id },
    })
  }

  /**
   * Find a subscriber by unsubscribe token
   */
  async findSubscriberByToken(token: string) {
    return prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    })
  }

  /**
   * Update a subscriber
   */
  async updateSubscriber(
    id: string,
    data: {
      isActive?: boolean
      name?: string
      updatedAt?: Date
      unsubscribedAt?: Date
      metadata?: Prisma.InputJsonValue
      tags?: string[]
    }
  ) {
    return prisma.newsletterSubscriber.update({
      where: { id },
      data,
    })
  }

  /**
   * Delete a subscriber
   */
  async deleteSubscriber(id: string) {
    return prisma.newsletterSubscriber.delete({
      where: { id },
    })
  }

  /**
   * Get subscribers with filtering and pagination
   */
  async getSubscribers(params: {
    isActive?: boolean
    search?: string
    source?: string
    cursor?: string
    limit?: number
  }) {
    const { isActive, search, source, cursor, limit = 10 } = params

    // Build where conditions
    const where: Prisma.NewsletterSubscriberWhereInput = {}

    if (isActive !== undefined) {
      where.isActive = isActive
    }

    if (source) {
      where.source = source
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get total count for pagination
    const totalCount = await prisma.newsletterSubscriber.count({ where })

    // Get subscribers with pagination
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      take: limit + 1, // Take one more to check if there are more results
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { updatedAt: "desc" },
    })

    // Check if there are more results
    let nextCursor: string | undefined
    if (subscribers.length > limit) {
      const nextItem = subscribers.pop()
      nextCursor = nextItem?.id
    }

    return {
      subscribers,
      nextCursor,
      totalCount,
    }
  }

  /**
   * Get subscriber count
   */
  async getSubscriberCount(params: { isActive?: boolean }) {
    return prisma.newsletterSubscriber.count({
      where: {
        isActive: params.isActive,
      },
    })
  }

  /**
   * Get monthly subscriber growth
   */
  async getMonthlySubscriberGrowth(startDate: Date) {
    // Get all subscribers created after the start date
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        subscribedAt: {
          gte: startDate,
        },
      },
      select: {
        subscribedAt: true,
      },
      orderBy: {
        subscribedAt: "asc",
      },
    })

    // Group by month
    const monthlyGroups: Record<string, number> = {}

    subscribers.forEach((subscriber) => {
      const date = new Date(subscriber.subscribedAt)
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyGroups[yearMonth]) {
        monthlyGroups[yearMonth] = 0
      }

      monthlyGroups[yearMonth]++
    })

    // Convert to the expected format
    const result = Object.entries(monthlyGroups).map(([month, count]) => ({
      month,
      count,
    }))

    return result
  }

  /**
   * Get subscriber distribution by source
   */
  async getSubscribersBySource() {
    try {
      const sourceStats = await prisma.newsletterSubscriber.groupBy({
        by: ["source"],
        _count: {
          id: true,
        },
        where: {
          isActive: true,
        },
      })

      return sourceStats.map((stat) => ({
        source: stat.source || "Unknown",
        count: stat._count.id,
      }))
    } catch (error) {
      console.error("Error getting subscribers by source:", error)
      // Return an empty array as fallback in case of database error
      return []
    }
  }

  /**
   * Generate a random unsubscribe token
   */
  generateUnsubscribeToken(): string {
    return randomBytes(32).toString("hex")
  }
}

export const newsletterRepository = new NewsletterRepository()

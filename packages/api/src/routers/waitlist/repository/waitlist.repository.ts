import { db } from "@package/db"
import { Prisma } from "@prisma/client"

import type { WaitlistEntry } from "@package/db"

class WaitlistRepository {
  public createWaitlistEntry(data: {
    email: string
    name: string
    waitlistType: string
    source?: string
    referralCode?: string
  }) {
    return db.waitlistEntry.create({
      data: {
        ...data,
        metadata: {},
      },
    })
  }

  public async getWaitlistEntries(args: {
    waitlistType?: string
    status?: string
    skip: number
    take: number
    query?: string
  }) {
    const where = {
      ...(args.waitlistType && { waitlistType: args.waitlistType }),
      ...(args.status && { status: args.status }),
      ...(args.query && {
        OR: [
          { name: { contains: args.query, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: args.query, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    }

    const [entries, total] = await Promise.all([
      db.waitlistEntry.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: { createdAt: "desc" },
      }),
      db.waitlistEntry.count({ where }),
    ])

    return {
      entries,
      total,
    }
  }

  public getAllWaitlistEntries(args: {
    waitlistType?: string
    status?: string
  }): Promise<WaitlistEntry[]> {
    const where = {
      ...(args.waitlistType && { waitlistType: args.waitlistType }),
      ...(args.status && { status: args.status }),
    }

    return db.waitlistEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })
  }

  public updateWaitlistEntry(args: {
    id: string
    data: {
      status?: string
      notes?: string
    }
  }) {
    return db.waitlistEntry.update({
      where: { id: args.id },
      data: args.data,
    })
  }

  public deleteWaitlistEntry(id: string) {
    return db.waitlistEntry.delete({
      where: { id },
    })
  }

  public findWaitlistEntryByEmail(email: string) {
    return db.waitlistEntry.findUnique({
      where: { email },
    })
  }

  public countWaitlistEntries(): Promise<number> {
    return db.waitlistEntry.count()
  }

  public async getEntriesByType() {
    const results = await db.waitlistEntry.groupBy({
      by: ["waitlistType"],
      _count: true,
    })
    return results.map((r) => ({
      type: r.waitlistType,
      count: r._count,
    }))
  }

  public async getEntriesByStatus() {
    const results = await db.waitlistEntry.groupBy({
      by: ["status"],
      _count: true,
    })
    return results.map((r) => ({
      status: r.status,
      count: r._count,
    }))
  }

  public getRecentSignups(days = 7) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return db.waitlistEntry.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }
}

export const waitlistRepository = new WaitlistRepository()

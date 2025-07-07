import { db, LeadStatus } from "@package/db"

import type { Lead, Prisma } from "@package/db"

class LeadsRepository {
  public createLead(data: {
    name: string
    email: string
    phone?: string
    company?: string
    message?: string
    leadType: string
    source?: string
    metadata?: Prisma.JsonValue
  }) {
    return db.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message,
        leadType: data.leadType,
        source: data.source || "website",
        status: LeadStatus.NEW,
        metadata: data.metadata || {},
      },
    })
  }

  public findLeadById(id: string) {
    return db.lead.findUnique({
      where: { id },
    })
  }

  public updateLead(
    id: string,
    data: {
      status?: LeadStatus
      assignedTo?: string
    }
  ) {
    return db.lead.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
  }

  public deleteLead(id: string) {
    return db.lead.delete({
      where: { id },
    })
  }

  public async getLeads(args: {
    status?: LeadStatus
    leadType?: string
    assignedTo?: string
    search?: string
    cursor?: string
    limit: number
  }) {
    const { status, leadType, assignedTo, search, cursor, limit } = args

    const where: Prisma.LeadWhereInput = {}

    if (status) {
      where.status = status
    }

    if (leadType) {
      where.leadType = leadType
    }

    if (assignedTo) {
      where.assignedTo = assignedTo
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ]
    }

    const leads = await db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    let nextCursor: string | undefined = undefined
    if (leads.length > limit) {
      const nextItem = leads.pop()
      nextCursor = nextItem?.id
    }

    return {
      leads,
      nextCursor,
    }
  }

  public async getAllLeads(args: {
    status?: LeadStatus
    leadType?: string
    assignedTo?: string
  }): Promise<Lead[]> {
    const { status, leadType, assignedTo } = args

    const where: Prisma.LeadWhereInput = {}

    if (status) {
      where.status = status
    }

    if (leadType) {
      where.leadType = leadType
    }

    if (assignedTo) {
      where.assignedTo = assignedTo
    }

    return db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })
  }

  public async getLeadTypeStats() {
    const results = await db.lead.groupBy({
      by: ["leadType"],
      _count: true,
    })

    return results.map((item) => ({
      type: item.leadType,
      count: item._count,
    }))
  }

  public async getStatusStats() {
    const results = await db.lead.groupBy({
      by: ["status"],
      _count: true,
    })

    return results.map((item) => ({
      status: item.status,
      count: item._count,
    }))
  }

  public async getLeadCount(args: {
    status?: LeadStatus
    leadType?: string
    assignedTo?: string
  }): Promise<number> {
    const { status, leadType, assignedTo } = args

    const where: Prisma.LeadWhereInput = {}

    if (status) {
      where.status = status
    }

    if (leadType) {
      where.leadType = leadType
    }

    if (assignedTo) {
      where.assignedTo = assignedTo
    }

    return db.lead.count({ where })
  }

  public getRecentLeads(days = 7) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return db.lead.findMany({
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

  public async getLeadsBySource() {
    const results = await db.lead.groupBy({
      by: ["source"],
      _count: true,
    })

    return results.map((item) => ({
      source: item.source || "unknown",
      count: item._count,
    }))
  }
}

export const leadsRepository = new LeadsRepository()

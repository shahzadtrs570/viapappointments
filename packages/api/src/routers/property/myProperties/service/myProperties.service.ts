import { PrismaClient } from "@prisma/client"
import { TRPCError } from "@trpc/server"

import { MyPropertiesRepository } from "../repository/myProperties.repository"

const prisma = new PrismaClient()

interface ListParams {
  userId: string
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export class MyPropertiesService {
  private repository: MyPropertiesRepository

  constructor() {
    this.repository = new MyPropertiesRepository()
  }

  async list({ userId, page, limit, search, sortBy, sortOrder }: ListParams) {
    return this.repository.list({
      userId,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    })
  }

  async getById(propertyId: string, userId: string) {
    // Get property with all related information
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        // Include property address
        address: true,
        // Include seller information through SellerProperty
        sellerProperties: {
          include: {
            seller: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        // Include property documents
        propertyDocuments: {
          select: {
            id: true,
            documentType: true,
            filename: true,
            fileUrl: true,
            verified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        // Include application review
        applicationReview: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            seller: true,
          },
        },
      },
    })

    if (!property) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Property not found",
      })
    }

    // Verify ownership
    if (!property.sellerProperties.some((sp) => sp.seller.user.id === userId)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have access to this property",
      })
    }

    // Format the response to match the wizard's expected structure
    return {
      ...property,
      sellers: property.sellerProperties.map((sp) => ({
        id: sp.seller.id,
        userId: sp.seller.user.id,
        firstName: sp.seller.firstName,
        lastName: sp.seller.lastName,
        dateOfBirth: sp.seller.dateOfBirth,
        email: sp.seller.user.email,
        ownershipPercentage: sp.ownershipPercentage,
      })),
      review: property.applicationReview[0] || null,
      documents: property.propertyDocuments.map((doc) => ({
        id: doc.id,
        documentType: doc.documentType,
        filename: doc.filename,
        fileUrl: doc.fileUrl,
        verified: doc.verified,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    }
  }
}

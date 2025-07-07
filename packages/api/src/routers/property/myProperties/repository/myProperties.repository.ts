/*eslint-disable @typescript-eslint/no-explicit-any*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
import { db } from "@package/db"

interface ListParams {
  userId: string
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export class MyPropertiesRepository {
  async list({
    userId,
    page,
    limit,
    sortBy = "createdAt",
    sortOrder = "desc",
  }: ListParams) {
    const skip = (page - 1) * limit

    // Map frontend sort fields to database fields
    const sortFieldMapping: Record<string, string> = {
      title: "id", // Since title might not exist, fall back to id
      address: "id", // Since address might be nested, fall back to id
      postcode: "id", // Since postcode might be nested, fall back to id
      price: "estimatedValue", // Assuming price maps to estimatedValue
      propertyType: "propertyType",
      bedrooms: "bedroomCount",
      bathrooms: "bathroomCount",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }

    // Use mapped field or fall back to createdAt
    const dbSortField = sortFieldMapping[sortBy] || "createdAt"

    // Build where clause
    const where = {
      sellerProperties: {
        some: {
          seller: {
            userId,
          },
        },
      },
    }

    // Using the search filter if provided
    // Note: We'll implement this based on the actual schema fields
    // when integrating with the frontend

    const [properties, totalCount] = await Promise.all([
      db.property.findMany({
        where,
        include: {
          address: true,
          sellerProperties: {
            include: {
              seller: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  userId: true,
                },
              },
            },
          },
          propertyDocuments: {
            select: {
              id: true,
              documentType: true,
              filename: true,
            },
          },
          // Include the latest application review
          applicationReview: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          [dbSortField]: sortOrder,
        },
        skip,
        take: limit,
      }),
      db.property.count({ where }),
    ])

    // Transform address data for frontend display
    const transformedProperties = properties.map((property) => {
      // Cast property to any to access address safely
      const propertyAny = property as any

      // Safely access address properties
      const addressData = propertyAny.address
      const streetLine1 = addressData?.streetLine1 || ""
      const streetLine2 = addressData?.streetLine2 || ""
      const city = addressData?.city || ""
      const state = addressData?.state || ""
      const postalCode = addressData?.postalCode || ""

      // Get the latest application status
      const latestReview = property.applicationReview?.[0]
      const applicationStatus = latestReview?.status || "PENDING"

      // Construct the address string
      const formattedAddress = addressData
        ? `${streetLine1}${streetLine2 ? `, ${streetLine2}` : ""}, ${city}${state ? `, ${state}` : ""}`
        : null

      return {
        ...property,
        formattedAddress,
        postcode: postalCode,
        title: `Property in ${city || "Unknown location"}`,
        price: property.confirmedValue || property.estimatedValue,
        status: applicationStatus,
        lastStatusUpdate: latestReview?.createdAt || property.createdAt,
      }
    })

    return {
      data: transformedProperties,
      meta: {
        totalCount,
        page,
        limit,
        pageCount: Math.ceil(totalCount / limit),
      },
    }
  }

  async getById(propertyId: string, userId: string) {
    const property = await db.property.findFirst({
      where: {
        id: propertyId,
        sellerProperties: {
          some: {
            seller: {
              userId,
            },
          },
        },
      },
      include: {
        address: true,
        sellerProperties: {
          include: {
            seller: true,
          },
        },
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
        valuations: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        offers: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    })

    if (!property) return null

    // Cast property to any to access address safely
    const propertyAny = property as any

    // Safely access address properties
    const addressData = propertyAny.address
    const streetLine1 = addressData?.streetLine1 || ""
    const streetLine2 = addressData?.streetLine2 || ""
    const city = addressData?.city || ""
    const state = addressData?.state || ""
    const postalCode = addressData?.postalCode || ""

    // Construct the address string
    const formattedAddress = addressData
      ? `${streetLine1}${streetLine2 ? `, ${streetLine2}` : ""}, ${city}${state ? `, ${state}` : ""}`
      : null

    return {
      ...property,
      // Add these as additional properties
      formattedAddress,
      postcode: postalCode,
      // Set a title for the property
      title: `Property in ${city || "Unknown location"}`,
      // Use confirmed value for price if available
      price: property.confirmedValue || property.estimatedValue,
    }
  }
}

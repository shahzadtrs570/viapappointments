/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */

import { db, PropertyCondition, PropertyType } from "@package/db"

import type { PropertiesPaginationInput } from "../service/properties.service.types"

import {
  encryptedStringToDate,
  encryptedStringToFloat,
  encryptedStringToInt,
  encryptedStringToJson,
  encryptedStringToStringArray,
  safeEncryptedStringToFloat,
} from "../../../../../utils/encryptionUtils"

class PropertiesRepository {
  /**
   * Helper method to decrypt property data
   */
  private decryptPropertyData(property: any) {
    if (!property) return null

    try {
      return {
        ...property,
        bedroomCount: encryptedStringToInt(property.bedroomCount),
        bathroomCount: encryptedStringToInt(property.bathroomCount),
        totalAreaSqM: encryptedStringToFloat(property.totalAreaSqM),
        estimatedValue: encryptedStringToFloat(property.estimatedValue),
        confirmedValue: safeEncryptedStringToFloat(property.confirmedValue),
        features: encryptedStringToStringArray(property.features),
        // Address is already decrypted by prisma-field-encryption
        address: property.address,
      }
    } catch (error) {
      console.error(
        "Error decrypting property data in admin properties:",
        error
      )
      throw error
    }
  }

  /**
   * Helper method to decrypt seller data
   */
  private decryptSellerData(seller: any) {
    if (!seller) return null

    try {
      return {
        ...seller,
        firstName: seller.firstName, // Already decrypted by prisma-field-encryption
        lastName: seller.lastName, // Already decrypted by prisma-field-encryption
        email: seller.email, // Already decrypted by prisma-field-encryption
        dateOfBirth: seller.dateOfBirth
          ? encryptedStringToDate(seller.dateOfBirth)
          : null,
      }
    } catch (error) {
      console.error("Error decrypting seller data in admin properties:", error)
      throw error
    }
  }

  /**
   * Helper method to decrypt application review data
   */
  private decryptApplicationReviewData(review: any) {
    if (!review) return null

    try {
      return {
        ...review,
        checklist: encryptedStringToJson(review.checklist),
        considerations: encryptedStringToJson(review.considerations),
        createdAt: encryptedStringToDate(review.createdAt),
        updatedAt: encryptedStringToDate(review.updatedAt),
      }
    } catch (error) {
      console.error(
        "Error decrypting application review data in admin properties:",
        error
      )
      throw error
    }
  }

  /**
   * Helper method to transform property data with decrypted relations
   */
  private transformPropertyForAPI(property: any) {
    if (!property) return null

    const decryptedProperty = this.decryptPropertyData(property)

    return {
      ...decryptedProperty,
      sellerProperties: property.sellerProperties?.map((sp: any) => ({
        ...sp,
        seller: this.decryptSellerData(sp.seller),
      })),
      applicationReview: property.applicationReview?.map((review: any) =>
        this.decryptApplicationReviewData(review)
      ),
    }
  }

  public async getPropertyById(propertyId: string) {
    const property = await db.property.findUnique({
      where: {
        id: propertyId,
      },
      include: {
        address: true,
        sellerProperties: {
          include: {
            seller: true,
          },
        },
      },
    })

    return this.transformPropertyForAPI(property)
  }

  public async getPaginatedProperties(data: PropertiesPaginationInput) {
    const { page, limit } = data

    const properties = await db.property.findMany({
      include: {
        address: true,
        sellerProperties: {
          include: {
            seller: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return properties.map((property) => this.transformPropertyForAPI(property))
  }

  public getTotalProperties() {
    return db.property.count()
  }

  public async searchProperties(query: string) {
    // Try to parse the query as a number for numeric searches
    const numericQuery = parseFloat(query)
    const isNumeric = !isNaN(numericQuery)

    // Handle property type search
    const propertyTypeSearch = this.getPropertyTypeFromQuery(query)

    // Handle property condition search
    const propertyConditionSearch = this.getPropertyConditionFromQuery(query)

    const properties = await db.property.findMany({
      where: {
        OR: [
          // Address searches
          {
            address: {
              streetLine1: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            address: {
              streetLine2: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            address: {
              city: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            address: {
              state: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            address: {
              postalCode: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            address: {
              country: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          // Property type search - only if we found a valid property type
          ...(propertyTypeSearch
            ? [
                {
                  propertyType: propertyTypeSearch,
                },
              ]
            : []),

          // Property condition search - only if we found a valid condition
          ...(propertyConditionSearch
            ? [
                {
                  condition: propertyConditionSearch,
                },
              ]
            : []),

          // Note: Numeric searches on encrypted fields (bedroomCount, bathroomCount, totalAreaSqM, estimatedValue, confirmedValue)
          // are not supported as these fields are encrypted and stored as strings
        ],
      },
      include: {
        address: true,
      },
      take: 10,
    })

    return properties.map((property) => this.transformPropertyForAPI(property))
  }

  private getPropertyTypeFromQuery(query: string): PropertyType | null {
    const upperQuery = query.toUpperCase()
    return Object.values(PropertyType).includes(upperQuery as PropertyType)
      ? (upperQuery as PropertyType)
      : null
  }

  private getPropertyConditionFromQuery(
    query: string
  ): PropertyCondition | null {
    const upperQuery = query.toUpperCase()
    return Object.values(PropertyCondition).includes(
      upperQuery as PropertyCondition
    )
      ? (upperQuery as PropertyCondition)
      : null
  }

  public async deletePropertyById(propertyId: string) {
    return db.property.delete({
      where: {
        id: propertyId,
      },
    })
  }

  public async getCompletePropertyDetails(propertyId: string) {
    const property = await db.property.findUnique({
      where: {
        id: propertyId,
      },
      include: {
        address: true,
        sellerProperties: {
          include: {
            seller: {
              include: {
                // Remove user relation
              },
            },
          },
        },
        propertyDocuments: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        valuations: {
          include: {
            valuer: true,
          },
        },
        offers: {
          include: {
            sellerProfile: true,
          },
        },
        applicationReview: {
          select: {
            checklist: true,
            considerations: true,
            createdAt: true,
            updatedAt: true,
          },
        }, // Include all needed fields for decryption
      },
    })

    return this.transformPropertyForAPI(property)
  }

  public async transformPropertyData(propertyId: string) {
    const property = await this.getCompletePropertyDetails(propertyId)

    if (!property) {
      return null
    }

    // Extract sellers from sellerProperties to create a flat sellers array
    // Note: property is already decrypted by getCompletePropertyDetails
    const sellers =
      property.sellerProperties?.map((sp: any) => ({
        id: sp.seller.id,
        userId: sp.seller.userId,
        firstName: sp.seller.firstName,
        lastName: sp.seller.lastName,
        email: sp.seller.email,
        dateOfBirth: sp.seller.dateOfBirth, // Already converted to Date object
        generalHealth: sp.seller.generalHealth,
        financialPriority: sp.seller.financialPriority,
        willStayInProperty: sp.seller.willStayInProperty,
        ownershipPercentage: sp.ownershipPercentage,
        createdAt: sp.seller.createdAt,
        updatedAt: sp.seller.updatedAt,
        // Remove user property
      })) || []

    return {
      id: property.id,
      propertyType: property.propertyType,
      bedroomCount: property.bedroomCount, // Already decrypted to number
      bathroomCount: property.bathroomCount, // Already decrypted to number
      totalAreaSqM: property.totalAreaSqM, // Already decrypted to number
      condition: property.condition,
      estimatedValue: property.estimatedValue, // Already decrypted to number
      confirmedValue: property.confirmedValue, // Already decrypted to number
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      address: property.address,
      sellers, // Replace sellerProperties with flat sellers array
      documents: property.propertyDocuments,
      reviewAndReccommendations: property.applicationReview, // Already decrypted JSON objects
      valuations: property.valuations,
      offers: property.offers,
    }
  }

  public async generatePropertyOfferPayload(propertyId: string): Promise<{
    success: boolean
    data?: any
    error?: string
  }> {
    try {
      const property = await this.getCompletePropertyDetails(propertyId)

      if (!property) {
        return { success: false, error: "Property not found" }
      }

      // Get main seller's contact address
      let contactId = ""
      let contactDetails = null

      if (property.sellerProperties.length > 0) {
        const mainSeller = property.sellerProperties[0].seller
        // Fixed: Using userId directly from seller instead of through user object
        const contactAddress = await db.contactAddress.findUnique({
          where: { userId: mainSeller.userId },
        })

        if (contactAddress) {
          contactId = contactAddress.id
          contactDetails = contactAddress
        }
      }

      // Format sellers data
      const sellers = await Promise.all(
        property.sellerProperties.map(async (sp: any) => {
          const contact = await db.contactAddress.findUnique({
            where: { userId: sp.seller.userId },
          })

          // Get user email from the database directly
          const user = await db.user.findUnique({
            where: { id: sp.seller.userId },
            select: { email: true },
          })

          return {
            id: sp.seller.id,
            firstName: sp.seller.firstName,
            lastName: sp.seller.lastName,
            dateOfBirth: sp.seller.dateOfBirth.toISOString(),
            generalHealth: sp.seller.generalHealth,
            financialPriority: sp.seller.financialPriority,
            willStayInProperty: sp.seller.willStayInProperty,
            ownershipPercentage: sp.ownershipPercentage,
            userId: sp.seller.userId,
            contact: {
              email: user?.email || null,
              phone: null, // Add phone field to user profile if needed
              address: contact
                ? {
                    streetLine1: contact.streetLine1,
                    streetLine2: contact.streetLine2,
                    city: contact.city,
                    state: contact.state,
                    postalCode: contact.postalCode,
                    country: contact.country,
                  }
                : null,
            },
          }
        })
      )

      // Format documents
      const documents = property.propertyDocuments.map((doc: any) => ({
        id: doc.id,
        documentType: doc.documentType,
        filename: doc.filename,
        fileUrl: doc.fileUrl,
        verified: doc.verified,
        uploadedBy: doc.uploadedById,
        uploadedAt: doc.createdAt.toISOString(),
      }))

      // Format valuations
      const valuations = property.valuations.map((val: any) => ({
        id: val.id,
        marketValue: val.marketValue,
        occupiedValue: val.occupiedValue,
        status: val.status,
        notes: val.notes,
        valuerId: val.valuerId,
        valuerName: val.valuer.firmName,
        completedAt:
          val.status === "COMPLETED" ? val.updatedAt.toISOString() : null,
      }))

      // Get and format recommendations from applicationReview if available
      const reviewAndReccommendations =
        property.applicationReview?.map((review: any) => ({
          checklist: review.checklist, // Already decrypted JSON object
          considerations: review.considerations, // Already decrypted JSON object
        })) || []

      // Construct the complete payload
      const payload = {
        propertyId: property.id,
        contactId,

        property: {
          id: property.id,
          propertyType: property.propertyType,
          bedroomCount: property.bedroomCount,
          bathroomCount: property.bathroomCount,
          totalAreaSqM: property.totalAreaSqM,
          condition: property.condition,
          estimatedValue: property.estimatedValue,
          confirmedValue: property.confirmedValue,
          address: property.address
            ? {
                streetLine1: property.address.streetLine1,
                streetLine2: property.address.streetLine2,
                city: property.address.city,
                state: property.address.state,
                postalCode: property.address.postalCode,
                country: property.address.country,
              }
            : null,
        },

        sellers,
        documents,
        reviewAndReccommendations, // Renamed from rviewAndreccommendations to reviewAndReccommendations
        valuations,
        metadata: {
          requestId: crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 15),
          timestamp: new Date().toISOString(),
          source: "ESTATE_FLEX_ADMIN",
          requestType: "PROVISIONAL_OFFER",
        },
      }

      return { success: true, data: payload }
    } catch (error) {
      console.error("Error generating property offer payload:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

export const propertiesRepository = new PropertiesRepository()

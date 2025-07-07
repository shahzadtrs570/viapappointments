/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@package/db"

import type {
  FullPropertyDetails,
  PropertyValidationResult,
  WizardStep,
} from "../types"

import {
  encryptedStringToDate,
  encryptedStringToFloat,
  encryptedStringToInt,
  encryptedStringToJson,
  encryptedStringToStringArray,
  safeEncryptedStringToFloat,
} from "../../../../../utils/encryptionUtils"

export class PropertyValidationRepository {
  /**
   * Helper method to decrypt property data
   */
  private decryptPropertyData(property: any) {
    try {
      return {
        ...property,
        bedroomCount: encryptedStringToInt(property.bedroomCount),
        bathroomCount: encryptedStringToInt(property.bathroomCount),
        totalAreaSqM: encryptedStringToFloat(property.totalAreaSqM),
        estimatedValue: encryptedStringToFloat(property.estimatedValue),
        confirmedValue: safeEncryptedStringToFloat(property.confirmedValue),
        features: encryptedStringToStringArray(property.features),
      }
    } catch (error) {
      console.error("Error decrypting property data:", error)
      console.error("Property data:", {
        bedroomCount: property.bedroomCount,
        bathroomCount: property.bathroomCount,
        totalAreaSqM: property.totalAreaSqM,
        estimatedValue: property.estimatedValue,
        confirmedValue: property.confirmedValue,
        features: property.features,
      })
      throw error
    }
  }

  /**
   * Helper method to decrypt seller data
   */
  private decryptSellerData(seller: any) {
    try {
      return {
        ...seller,
        firstName: seller.firstName, // Already decrypted by prisma-field-encryption
        lastName: seller.lastName, // Already decrypted by prisma-field-encryption
        email: seller.email, // Already decrypted by prisma-field-encryption
        dateOfBirth: seller.dateOfBirth
          ? encryptedStringToDate(seller.dateOfBirth)
          : null, // Convert string back to Date
      }
    } catch (error) {
      console.error("Error decrypting seller data:", error)
      console.error("Seller data:", {
        firstName: seller.firstName,
        lastName: seller.lastName,
        email: seller.email,
        dateOfBirth: seller.dateOfBirth,
      })
      throw error
    }
  }

  /**
   * Helper method to decrypt property document data
   */
  private decryptPropertyDocumentData(document: any) {
    try {
      return {
        ...document,
        documentType: document.documentType, // Already decrypted by prisma-field-encryption
        filename: document.filename, // Already decrypted by prisma-field-encryption
        fileUrl: document.fileUrl, // Already decrypted by prisma-field-encryption
        createdAt: encryptedStringToDate(document.createdAt), // Convert string back to Date
        updatedAt: encryptedStringToDate(document.updatedAt), // Convert string back to Date
      }
    } catch (error) {
      console.error("Error decrypting property document data:", error)
      console.error("Document data:", {
        documentType: document.documentType,
        filename: document.filename,
        fileUrl: document.fileUrl,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      })
      throw error
    }
  }

  async checkExistingProperty(
    userId: string
  ): Promise<PropertyValidationResult> {
    // First check if user has any seller profiles
    const existingSellers = await db.sellerProfile.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    })

    // If no seller profile exists, start with Seller Information
    if (!existingSellers || existingSellers.length === 0) {
      return {
        hasExistingProperty: false,
        currentStep: "Seller Information",
      }
    }

    // Check for existing property
    const existingProperty = await db.property.findFirst({
      where: {
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
            seller: {
              include: {
                user: true,
              },
            },
          },
        },
        propertyDocuments: true,
        applicationReview: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            seller: true,
          },
        },
        offers: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    // If no property exists but seller exists, return with Property Information step and seller data
    if (!existingProperty) {
      const sellersData = existingSellers.map((seller) => {
        const decryptedSeller = this.decryptSellerData(seller)
        return {
          id: decryptedSeller.id,
          userId: decryptedSeller.user.id,
          firstName: decryptedSeller.firstName,
          lastName: decryptedSeller.lastName,
          dateOfBirth: decryptedSeller.dateOfBirth,
          email: decryptedSeller.user.email, // User email is already decrypted by prisma-field-encryption
          ownershipPercentage: 100 / existingSellers.length, // Equal ownership by default
        }
      })

      return {
        hasExistingProperty: false,
        currentStep: "Property Information",
        sellers: sellersData,
      }
    }

    const latestReview = existingProperty.applicationReview[0]
    const latestOffer = existingProperty.offers[0]

    // Always determine current step based on the complete application state
    let currentStep: WizardStep = "Seller Information"

    // Check if seller information is complete
    if (existingProperty.sellerProperties.length > 0) {
      // Check if property information is complete
      if (!existingProperty.propertyType || !existingProperty.address) {
        currentStep = "Property Information"
      }
      // Check if review is needed or in progress
      else if (!latestReview) {
        currentStep = "Review & Recommendations"
      }
      // Check if review is accepted and offer is pending
      else if (latestReview.status === "ACCEPTED" && !latestOffer) {
        currentStep = "Offer & Next Steps"
      }
      // Check if offer is accepted
      else if (latestOffer) {
        currentStep = "Completion Status"
      }
      // If review is in progress or rejected, stay in contemplation
      else if (
        latestReview.status === "PROCESSING" ||
        latestReview.status === "REJECTED" ||
        latestReview.status === "PENDING"
      ) {
        currentStep = "Contemplation"
      }
    }

    // Decrypt the property data before formatting
    const decryptedProperty = this.decryptPropertyData(existingProperty)

    // Format the response to match the expected structure
    const propertyData: FullPropertyDetails = {
      id: decryptedProperty.id,
      propertyType: decryptedProperty.propertyType,
      propertyStatus: (decryptedProperty.leaseLength
        ? "leasehold"
        : "freehold") as "leasehold" | "freehold",
      leaseLength: decryptedProperty.leaseLength || undefined,
      bedroomCount: decryptedProperty.bedroomCount,
      bathroomCount: decryptedProperty.bathroomCount,
      totalAreaSqM: decryptedProperty.totalAreaSqM,
      yearBuilt: decryptedProperty.yearBuilt || undefined,
      features: decryptedProperty.features,
      condition: decryptedProperty.condition,
      conditionNotes: undefined,
      estimatedValue: decryptedProperty.estimatedValue,
      confirmedValue: decryptedProperty.confirmedValue,
      address: decryptedProperty.address
        ? {
            streetLine1: decryptedProperty.address.streetLine1, // Already decrypted by prisma-field-encryption
            streetLine2: decryptedProperty.address.streetLine2 || undefined, // Already decrypted by prisma-field-encryption
            postalCode: decryptedProperty.address.postalCode, // Already decrypted by prisma-field-encryption
            city: decryptedProperty.address.city, // Already decrypted by prisma-field-encryption
            state: decryptedProperty.address.state || undefined, // Already decrypted by prisma-field-encryption
          }
        : undefined,
      sellers: decryptedProperty.sellerProperties.map((sp: any) => {
        const decryptedSeller = this.decryptSellerData(sp.seller)
        return {
          id: decryptedSeller.id,
          userId: decryptedSeller.user.id,
          firstName: decryptedSeller.firstName,
          lastName: decryptedSeller.lastName,
          dateOfBirth: decryptedSeller.dateOfBirth,
          email: decryptedSeller.user.email, // User email is already decrypted by prisma-field-encryption
          ownershipPercentage: sp.ownershipPercentage,
        }
      }),
      review: latestReview
        ? {
            id: latestReview.id,
            status: latestReview.status,
            checklist: encryptedStringToJson(latestReview.checklist) as Record<
              string,
              boolean
            >,
            considerations: encryptedStringToJson(
              latestReview.considerations
            ) as Record<string, boolean>,
            seller: {
              id: latestReview.seller.id,
              firstName: latestReview.seller.firstName,
              lastName: latestReview.seller.lastName,
            },
          }
        : null,
      documents: existingProperty.propertyDocuments.map((doc: any) => {
        const decryptedDoc = this.decryptPropertyDocumentData(doc)
        return {
          id: decryptedDoc.id,
          documentType: decryptedDoc.documentType,
          filename: decryptedDoc.filename,
          fileUrl: decryptedDoc.fileUrl,
          verified: decryptedDoc.verified,
          createdAt: decryptedDoc.createdAt.toISOString(),
          updatedAt: decryptedDoc.updatedAt.toISOString(),
        }
      }),
    }

    return {
      hasExistingProperty: true,
      currentStep,
      propertyDetails: propertyData,
    }
  }
}

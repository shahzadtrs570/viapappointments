/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@package/db"
import { type ApplicationReviewStatus } from "@prisma/client"

import type { ApplicationReview } from "../types"

import {
  dateToEncryptedString,
  encryptedStringToDate,
  encryptedStringToFloat,
  encryptedStringToInt,
  encryptedStringToJson,
  encryptedStringToStringArray,
  jsonToEncryptedString,
  safeEncryptedStringToFloat,
} from "../../../../../utils/encryptionUtils"

// Helper function to convert string status to ApplicationReviewStatus enum
function convertStatus(status?: string): ApplicationReviewStatus | undefined {
  if (!status) return undefined

  return status as ApplicationReviewStatus
}

export class ApplicationReviewRepository {
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
        "Error decrypting property data in ApplicationReview:",
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
      console.error("Error decrypting seller data in ApplicationReview:", error)
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
      console.error("Error decrypting application review data:", error)
      throw error
    }
  }

  /**
   * Helper method to transform application review data with decrypted relations
   */
  private transformApplicationReviewForAPI(review: any) {
    if (!review) return null

    const decryptedReview = this.decryptApplicationReviewData(review)

    return {
      ...decryptedReview,
      property: this.decryptPropertyData(review.property),
      seller: this.decryptSellerData(review.seller),
    }
  }

  async create(data: ApplicationReview) {
    const now = new Date()

    return db.applicationReview.create({
      data: {
        checklist: jsonToEncryptedString({
          financialAdvisor: data.checklist.financialAdvisor,
          financialSituation: data.checklist.financialSituation,
          carePlans: data.checklist.carePlans,
          existingMortgages: data.checklist.existingMortgages,
        }) as any,
        considerations: jsonToEncryptedString({
          ownership: data.considerations.ownership,
          benefits: data.considerations.benefits,
          mortgage: data.considerations.mortgage,
        }) as any,
        createdAt: dateToEncryptedString(now) as any,
        updatedAt: dateToEncryptedString(now) as any,
        property: {
          connect: {
            id: data.propertyId,
          },
        },
        seller: {
          connect: {
            id: data.sellerId,
          },
        },
        userId: data.userId,
        ...(data.coSellerIds ? { coSellerIds: data.coSellerIds } : {}),
        ...(data.status ? { status: convertStatus(data.status) } : {}),
      },
    })
  }

  async update(id: string, data: ApplicationReview) {
    const now = new Date()

    return db.applicationReview.update({
      where: { id },
      data: {
        checklist: jsonToEncryptedString({
          financialAdvisor: data.checklist.financialAdvisor,
          financialSituation: data.checklist.financialSituation,
          carePlans: data.checklist.carePlans,
          existingMortgages: data.checklist.existingMortgages,
        }) as any,
        considerations: jsonToEncryptedString({
          ownership: data.considerations.ownership,
          benefits: data.considerations.benefits,
          mortgage: data.considerations.mortgage,
        }) as any,
        updatedAt: dateToEncryptedString(now) as any,
        userId: data.userId,
        ...(data.coSellerIds ? { coSellerIds: data.coSellerIds } : {}),
        ...(data.status ? { status: convertStatus(data.status) } : {}),
      },
    })
  }

  async get(id: string) {
    const review = await db.applicationReview.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            address: true,
          },
        },
        seller: true,
      },
    })

    return this.transformApplicationReviewForAPI(review)
  }

  async getByPropertyId(propertyId: string) {
    const review = await db.applicationReview.findFirst({
      where: { propertyId },
      include: {
        property: {
          include: {
            address: true,
          },
        },
        seller: true,
      },
    })

    return this.transformApplicationReviewForAPI(review)
  }

  async getByUserId(userId: string) {
    const review = await db.applicationReview.findFirst({
      where: { userId },
      include: {
        property: {
          include: {
            address: true,
          },
        },
        seller: true,
      },
    })

    return this.transformApplicationReviewForAPI(review)
  }

  async delete(id: string) {
    return db.applicationReview.delete({
      where: { id },
    })
  }
}

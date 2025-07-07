/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@package/db"

import type { ProvisionalOffer } from "../types"

import {
  encryptedStringToDate,
  encryptedStringToFloat,
  encryptedStringToJson,
} from "../../../../../utils/encryptionUtils"
import { ProvisionalOfferRepository } from "../repository/provisionalOffer.repository"

// Define the decrypted dashboard status type for API responses
interface DecryptedDashboardStatus {
  id: string
  propertyId: string
  sellerId: string
  coSellerIds: string[]
  referenceNumber: string
  currentStage: string
  stageProgress: number
  statusData: any
  createdAt: Date
  updatedAt: Date
}

export class ProvisionalOfferService {
  private repository: ProvisionalOfferRepository

  constructor() {
    this.repository = new ProvisionalOfferRepository()
  }

  /**
   * Transform encrypted dashboard status data back to API format
   */
  private transformDashboardStatusForAPI(
    status: any
  ): DecryptedDashboardStatus {
    return {
      ...status,
      referenceNumber: status.referenceNumber, // Already decrypted by prisma-field-encryption
      currentStage: status.currentStage, // Already decrypted by prisma-field-encryption
      stageProgress: encryptedStringToFloat(status.stageProgress as string),
      statusData: encryptedStringToJson(status.statusData as string),
      createdAt: encryptedStringToDate(status.createdAt as string),
      updatedAt: encryptedStringToDate(status.updatedAt as string),
    }
  }

  async create(data: ProvisionalOffer) {
    // Add any business logic/validation here
    return this.repository.create(data)
  }

  async update(id: string, data: ProvisionalOffer) {
    // Add any business logic/validation here
    return this.repository.update(id, data)
  }

  async get(id: string) {
    return this.repository.get(id)
  }

  async getByProperty(propertyId: string) {
    return this.repository.getByProperty(propertyId)
  }

  async accept(id: string) {
    return this.repository.updateStatus(id, "ACCEPTED")
  }

  async decline(id: string, reason: string, details: string) {
    return this.repository.decline(id, reason, details)
  }

  async delete(id: string) {
    return this.repository.delete(id)
  }

  // Add method to get dashboard status with offer document
  async getDashboardStatusWithOfferDocument(propertyId: string) {
    const dashboardStatus = await db.propertyDashboardStatus.findFirst({
      where: { propertyId },
      orderBy: { updatedAtHash: "asc" }, // Use hash field for sorting
    })

    console.log("dashboardStatus", dashboardStatus)

    if (!dashboardStatus) {
      return null
    }

    // Transform encrypted dashboard status to decrypted format
    const decryptedStatus = this.transformDashboardStatusForAPI(dashboardStatus)

    // Extract offer document from decrypted statusData JSON
    const offerDocument = decryptedStatus.statusData.offerDocument || null

    return {
      dashboardStatus: decryptedStatus,
      offerDocument,
      referenceNumber: decryptedStatus.referenceNumber,
      createdAt: decryptedStatus.createdAt,
    }
  }

  async getById(propertyId: string) {
    const property = await this.repository.getById(propertyId)

    if (!property) {
      throw new Error("Property not found")
    }

    // Get seller IDs from seller properties
    const sellers = property.sellerProperties.map((sp) => ({
      id: sp.seller.id,
      ownershipPercentage: sp.ownershipPercentage,
    }))

    // Get existing offer if any
    const existingOffer = property.offers[0]

    return {
      property,
      sellers,
      existingOffer,
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@package/db"
import { TRPCError } from "@trpc/server"

import type { FinalStatus } from "../types"

import {
  encryptedStringToDate,
  encryptedStringToFloat,
  encryptedStringToJson,
} from "../../../../../utils/encryptionUtils"
import { FinalStatusRepository } from "../repository/finalStatus.repository"

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

export class FinalStatusService {
  private repository: FinalStatusRepository

  constructor() {
    this.repository = new FinalStatusRepository()
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

  async create(data: FinalStatus) {
    // Add any business logic/validation here
    return this.repository.create(data)
  }

  async update(id: string, data: FinalStatus) {
    const existing = await this.repository.get(id)
    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Final status not found",
      })
    }
    return this.repository.update(id, data)
  }

  async get(id: string) {
    const data = await this.repository.get(id)
    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Final status not found",
      })
    }
    return data
  }

  async getByProperty(propertyId: string) {
    return this.repository.getByProperty(propertyId)
  }

  async delete(id: string) {
    const existing = await this.repository.get(id)
    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Final status not found",
      })
    }
    return this.repository.delete(id)
  }

  // Add method to get dashboard status with solicitor details
  async getDashboardStatusDetails(propertyId: string) {
    const dashboardStatus = await db.propertyDashboardStatus.findFirst({
      where: { propertyId },
      orderBy: { updatedAt: "desc" },
    })

    if (!dashboardStatus) {
      return null
    }

    // Transform encrypted dashboard status to decrypted format
    const decryptedStatus = this.transformDashboardStatusForAPI(dashboardStatus)

    // Get final status data for the property
    const finalStatus = await this.getByProperty(propertyId)

    // Extract data from decrypted statusData JSON
    const statusData = decryptedStatus.statusData

    // Add solicitor information if available
    let solicitorDetails = null
    if (finalStatus) {
      solicitorDetails = finalStatus.solicitor
    }

    return {
      dashboardStatus: decryptedStatus,
      solicitorDetails,
      keyContacts: statusData.keyContacts || null,
      processStatus: statusData.ProcessStatus || null,
      documentChecklist: statusData.documentChecklist || null,
      referenceNumber: decryptedStatus.referenceNumber,
      createdAt: decryptedStatus.createdAt,
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

import { db } from "@package/db"

import type { FinalStatus } from "../types"

import {
  dateToEncryptedString,
  encryptedStringToDate,
  encryptedStringToJson,
  jsonToEncryptedString,
} from "../../../../../utils/encryptionUtils"

// Define the decrypted completion status type for API responses
interface DecryptedCompletionStatus {
  id: string
  choice: string
  details: any // Decrypted JSON object (solicitor details)
  propertyId: string
  sellerId: string
  coSellerIds: string[]
  createdAt: Date
  updatedAt: Date
  property?: any
  seller?: any
  solicitor?: any // For backward compatibility
}

export class FinalStatusRepository {
  /**
   * Transform encrypted completion status data back to API format
   */
  private transformCompletionStatusForAPI(
    status: any
  ): DecryptedCompletionStatus {
    const decryptedDetails = encryptedStringToJson(status.details as string)

    return {
      ...status,
      choice: status.choice, // Already decrypted by prisma-field-encryption
      details: decryptedDetails,
      createdAt: encryptedStringToDate(status.createdAt as string),
      updatedAt: encryptedStringToDate(status.updatedAt as string),
      solicitor: decryptedDetails, // For backward compatibility
    }
  }

  async create(data: FinalStatus) {
    const now = new Date()

    const createdStatus = await db.completionStatus.create({
      data: {
        choice: data.choice as any, // Will be encrypted by prisma-field-encryption
        details: jsonToEncryptedString(data.solicitor) as any,
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
        ...(data.coSellerIds ? { coSellerIds: data.coSellerIds } : {}),
      },
    })

    // Return decrypted data for API response
    return this.transformCompletionStatusForAPI(createdStatus)
  }

  async update(id: string, data: FinalStatus) {
    const now = new Date()

    const updatedStatus = await db.completionStatus.update({
      where: { id },
      data: {
        choice: data.choice as any, // Will be encrypted by prisma-field-encryption
        details: jsonToEncryptedString(data.solicitor) as any,
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
        ...(data.coSellerIds ? { coSellerIds: data.coSellerIds } : {}),
      },
    })

    // Return decrypted data for API response
    return this.transformCompletionStatusForAPI(updatedStatus)
  }

  async get(id: string): Promise<DecryptedCompletionStatus | null> {
    const result = await db.completionStatus.findUnique({
      where: { id },
      include: {
        property: true,
        seller: true,
      },
    })

    if (!result) return null
    return this.transformCompletionStatusForAPI(result)
  }

  async getByProperty(
    propertyId: string
  ): Promise<DecryptedCompletionStatus | null> {
    const result = await db.completionStatus.findFirst({
      where: { propertyId },
      include: {
        property: true,
        seller: true,
      },
    })

    if (!result) return null
    return this.transformCompletionStatusForAPI(result)
  }

  async delete(id: string) {
    const deletedStatus = await db.completionStatus.delete({
      where: { id },
    })

    // Return decrypted data for API response
    return this.transformCompletionStatusForAPI(deletedStatus)
  }
}

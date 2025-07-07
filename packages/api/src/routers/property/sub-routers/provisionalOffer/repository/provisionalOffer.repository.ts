/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { db, OfferStatus } from "@package/db"

import type { ProvisionalOffer } from "../types"

import {
  dateToEncryptedString,
  encryptedStringToDate,
  encryptedStringToFloat,
  encryptedStringToJson,
  floatToEncryptedString,
  jsonToEncryptedString,
} from "../../../../../utils/encryptionUtils"

// Define the decrypted offer type for API responses
interface DecryptedOffer {
  id: string
  propertyId: string
  sellerProfileId: string
  referenceNumber: string | null
  initialPaymentAmount: number
  monthlyPaymentAmount: number
  indexationRate: number
  status: OfferStatus
  agreementType: string
  offerData: any
  coSellerIds: string[]
  createdAt: Date
  updatedAt: Date
  expirationDate: Date | null
  isProvisional: boolean
  responseId: string | null
  property?: any
  sellerProfile?: any
}

export class ProvisionalOfferRepository {
  /**
   * Transform encrypted offer data back to API format
   */
  private transformOfferForAPI(offer: any): DecryptedOffer {
    return {
      ...offer,
      initialPaymentAmount: encryptedStringToFloat(
        offer.initialPaymentAmount as string
      ),
      monthlyPaymentAmount: encryptedStringToFloat(
        offer.monthlyPaymentAmount as string
      ),
      indexationRate: encryptedStringToFloat(offer.indexationRate as string),
      offerData: offer.offerData
        ? encryptedStringToJson(offer.offerData as string)
        : null,
      createdAt: encryptedStringToDate(offer.createdAt as string),
      updatedAt: encryptedStringToDate(offer.updatedAt as string),
    }
  }

  async create(data: ProvisionalOffer) {
    const now = new Date()
    const offerDataJson = {
      occupancyRight: "FULL",
      // Add other custom fields here
    }

    const createdOffer = await db.offer.create({
      data: {
        initialPaymentAmount: floatToEncryptedString(
          data.valuation.initialLumpSum
        ) as any,
        monthlyPaymentAmount: floatToEncryptedString(
          data.valuation.monthlyPayment
        ) as any,
        indexationRate: floatToEncryptedString(0) as any, // This should come from data
        status: data.status,
        agreementType: "STANDARD", // This should come from data
        // Add coSellerIds if provided
        ...(data.coSellerIds ? { coSellerIds: data.coSellerIds } : {}),
        // Store additional data in offerData JSON field as encrypted string
        offerData: jsonToEncryptedString(offerDataJson) as any,
        createdAt: dateToEncryptedString(now) as any,
        updatedAt: dateToEncryptedString(now) as any,

        property: {
          connect: {
            id: data.property.propertyId,
          },
        },
        sellerProfile: {
          connect: {
            id: data.sellerId,
          },
        },
      },
    })

    // Return decrypted data for API response
    return this.transformOfferForAPI(createdOffer)
  }

  async update(id: string, data: ProvisionalOffer) {
    const now = new Date()

    const updatedOffer = await db.offer.update({
      where: { id },
      data: {
        initialPaymentAmount: floatToEncryptedString(
          data.valuation.initialLumpSum
        ) as any,
        monthlyPaymentAmount: floatToEncryptedString(
          data.valuation.monthlyPayment
        ) as any,
        status: data.status,
        updatedAt: dateToEncryptedString(now) as any,
        // Add coSellerIds if provided
        ...(data.coSellerIds ? { coSellerIds: data.coSellerIds } : {}),
      },
    })

    // Return decrypted data for API response
    return this.transformOfferForAPI(updatedOffer)
  }

  async updateStatus(id: string, status: OfferStatus) {
    const now = new Date()

    const updatedOffer = await db.offer.update({
      where: { id },
      data: {
        status,
        updatedAt: dateToEncryptedString(now) as any,
      },
    })

    // Return decrypted data for API response
    return this.transformOfferForAPI(updatedOffer)
  }

  async decline(id: string, reason: string, details: string) {
    const now = new Date()

    const updatedOffer = await db.offer.update({
      where: { id },
      data: {
        status: OfferStatus.REJECTED,
        updatedAt: dateToEncryptedString(now) as any,
      },
    })

    // Return decrypted data for API response
    return this.transformOfferForAPI(updatedOffer)
  }

  async get(id: string): Promise<DecryptedOffer | null> {
    const offer = await db.offer.findUnique({
      where: { id },
      include: {
        property: true,
        sellerProfile: true,
      },
    })

    if (!offer) return null
    return this.transformOfferForAPI(offer)
  }

  async getByProperty(propertyId: string): Promise<DecryptedOffer | null> {
    const offer = await db.offer.findFirst({
      where: { propertyId },
      include: {
        property: true,
        sellerProfile: true,
      },
    })

    if (!offer) return null
    return this.transformOfferForAPI(offer)
  }

  async delete(id: string) {
    const deletedOffer = await db.offer.delete({
      where: { id },
    })

    // Return decrypted data for API response
    return this.transformOfferForAPI(deletedOffer)
  }

  async getById(propertyId: string) {
    const property = await db.property.findUnique({
      where: { id: propertyId },
      include: {
        sellerProperties: {
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

    if (!property) return null

    // Transform offers to decrypted format
    const transformedProperty = {
      ...property,
      offers: property.offers.map((offer) => this.transformOfferForAPI(offer)),
    }

    return transformedProperty
  }
}

import { db } from "@package/db"

import type { CreateOfferInput } from "../service/offers.service.types"

import {
  dateToEncryptedString,
  floatToEncryptedString,
} from "../../../../../utils/encryptionUtils"

class OffersRepository {
  public getOffersByPropertyId(propertyId: string) {
    return db.offer.findMany({
      where: {
        propertyId,
      },
      include: {
        sellerProfile: true,
        contract: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  public async createOffer(data: CreateOfferInput) {
    const now = new Date()
    return db.offer.create({
      data: {
        ...data,
        initialPaymentAmount: floatToEncryptedString(data.initialPaymentAmount),
        monthlyPaymentAmount: floatToEncryptedString(data.monthlyPaymentAmount),
        indexationRate: floatToEncryptedString(data.indexationRate),
        status: "DRAFT",
        createdAt: dateToEncryptedString(now),
        updatedAt: dateToEncryptedString(now),
      },
      include: {
        sellerProfile: true,
        property: {
          include: {
            address: true,
          },
        },
      },
    })
  }
}

export const offersRepository = new OffersRepository()

/* eslint-disable no-nested-ternary */
import { db, FinancialPriority, HealthCondition } from "@package/db"

import { inputDateStringToEncryptedString } from "../../../../../utils/encryptionUtils"

interface Owner {
  id?: string
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
}

export class SellerInformationRepository {
  async create(data: {
    ownerType: "single" | "couple" | "multiple"
    numberOfOwners?: number
    owners: Owner[]
    userId: string
    propertyId?: string
  }) {
    const profiles = await db.$transaction(async (tx) => {
      const createdProfiles = await Promise.all(
        data.owners.map((owner) =>
          tx.sellerProfile.create({
            data: {
              firstName: owner.firstName,
              lastName: owner.lastName,
              email: owner.email,
              dateOfBirth: inputDateStringToEncryptedString(owner.dateOfBirth),
              generalHealth: HealthCondition.GOOD,
              financialPriority: FinancialPriority.UNDECIDED,
              willStayInProperty: true,
              user: {
                connect: {
                  id: data.userId,
                },
              },
            },
          })
        )
      )

      return {
        ownerType: data.ownerType,
        numberOfOwners: data.owners.length,
        owners: createdProfiles.map((profile) => ({
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          dateOfBirth: profile.dateOfBirth, // Already in string format from encrypted field
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        })),
      }
    })

    return profiles
  }

  async update(
    sellerId: string,
    data: {
      ownerType: "single" | "couple" | "multiple"
      numberOfOwners?: number
      owners: Owner[]
    }
  ) {
    const mainProfile = await db.sellerProfile.findUnique({
      where: { id: sellerId },
    })
    if (!mainProfile) return null

    const profiles = await db.$transaction(async (tx) => {
      // First, update or create each owner profile
      const updatedProfiles = await Promise.all(
        data.owners.map(async (owner) => {
          if (owner.id) {
            // Update existing profile
            return tx.sellerProfile.update({
              where: { id: owner.id },
              data: {
                firstName: owner.firstName,
                lastName: owner.lastName,
                email: owner.email,
                dateOfBirth: inputDateStringToEncryptedString(
                  owner.dateOfBirth
                ),
              },
            })
          } else {
            // Create new profile
            return tx.sellerProfile.create({
              data: {
                firstName: owner.firstName,
                lastName: owner.lastName,
                email: owner.email,
                dateOfBirth: inputDateStringToEncryptedString(
                  owner.dateOfBirth
                ),
                generalHealth: HealthCondition.GOOD,
                financialPriority: FinancialPriority.UNDECIDED,
                willStayInProperty: true,
                user: {
                  connect: {
                    id: mainProfile.userId,
                  },
                },
              },
            })
          }
        })
      )

      // Get all existing profiles for this user
      const existingProfiles = await tx.sellerProfile.findMany({
        where: { userId: mainProfile.userId },
      })

      // Find profiles that are no longer in the owners list and should be deleted
      const updatedProfileIds = updatedProfiles.map((p) => p.id)
      const profilesToDelete = existingProfiles.filter(
        (p) => !updatedProfileIds.includes(p.id) && p.id !== sellerId
      )

      // Delete removed profiles
      if (profilesToDelete.length > 0) {
        await tx.sellerProfile.deleteMany({
          where: {
            id: {
              in: profilesToDelete.map((p) => p.id),
            },
          },
        })
      }

      return {
        ownerType: data.ownerType,
        numberOfOwners: data.owners.length,
        owners: updatedProfiles.map((profile) => ({
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          dateOfBirth: profile.dateOfBirth, // Already in string format from encrypted field
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        })),
      }
    })

    return profiles
  }

  async get(id: string) {
    const profile = await db.sellerProfile.findUnique({ where: { id } })
    if (!profile) return null

    const relatedProfiles = await db.sellerProfile.findMany({
      where: { userId: profile.userId },
    })

    return {
      ownerType:
        relatedProfiles.length === 1
          ? "single"
          : relatedProfiles.length === 2
            ? "couple"
            : "multiple",
      numberOfOwners: relatedProfiles.length,
      owners: relatedProfiles.map((p) => ({
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        dateOfBirth: p.dateOfBirth, // Already in string format from encrypted field
      })),
      userId: profile.userId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    }
  }

  async delete(id: string) {
    const profile = await db.sellerProfile.findUnique({ where: { id } })
    if (!profile) return null

    await db.sellerProfile.delete({ where: { id } })

    return {
      ownerType: "single",
      numberOfOwners: 1,
      owners: [
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          dateOfBirth: profile.dateOfBirth, // Already in string format from encrypted field
        },
      ],
      userId: profile.userId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    }
  }

  async createSellerPropertyRelation(
    sellerId: string,
    propertyId: string,
    ownershipPercentage: number
  ) {
    return db.sellerProperty.create({
      data: {
        sellerId,
        propertyId,
        ownershipPercentage,
      },
    })
  }
}

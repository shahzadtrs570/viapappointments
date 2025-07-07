import { TRPCError } from "@trpc/server"

import type { SellerInformation } from "../types"

import { SellerInformationRepository } from "../repository/sellerInformation.repository"

export class SellerInformationService {
  private repository: SellerInformationRepository

  constructor() {
    this.repository = new SellerInformationRepository()
  }

  async create(data: SellerInformation, userId: string, propertyId?: string) {
    // Create seller profiles with property relationship if propertyId is provided
    return this.repository.create({ ...data, userId, propertyId })
  }

  async update(sellerId: string, data: SellerInformation, userId: string) {
    const existing = await this.repository.get(sellerId)
    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Seller information not found",
      })
    }
    if (existing.userId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not authorized to update this seller information",
      })
    }
    return this.repository.update(sellerId, data)
  }

  async get(id: string, userId: string) {
    const data = await this.repository.get(id)
    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Seller information not found",
      })
    }
    if (data.userId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not authorized to view this seller information",
      })
    }
    return data
  }

  async delete(id: string, userId: string) {
    const existing = await this.repository.get(id)
    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Seller information not found",
      })
    }
    if (existing.userId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Not authorized to delete this seller information",
      })
    }
    return this.repository.delete(id)
  }

  async addPropertyToSellers(
    sellerIds: string[],
    propertyId: string,
    userId: string
  ) {
    // Validate that all sellers exist and belong to the user
    for (const sellerId of sellerIds) {
      const seller = await this.repository.get(sellerId)
      if (!seller) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Seller profile ${sellerId} not found`,
        })
      }
      if (seller.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Not authorized to modify seller profile ${sellerId}`,
        })
      }
    }

    // Calculate equal ownership percentage
    const ownershipPercentage = 100 / sellerIds.length

    // Create SellerProperty relationships
    return Promise.all(
      sellerIds.map((sellerId) =>
        this.repository.createSellerPropertyRelation(
          sellerId,
          propertyId,
          ownershipPercentage
        )
      )
    )
  }
}

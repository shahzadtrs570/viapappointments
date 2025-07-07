import { TRPCError } from "@trpc/server"

import type {
  CreateOfferArgs,
  GetOffersByPropertyIdArgs,
} from "./offers.service.types"

import { offersRepository } from "../repository/offers.repository"

class OffersService {
  public async getOffersByPropertyId(args: GetOffersByPropertyIdArgs) {
    return offersRepository.getOffersByPropertyId(args.input.propertyId)
  }

  public async createOffer(args: CreateOfferArgs) {
    try {
      return await offersRepository.createOffer(args.input)
    } catch (error) {
      throw new TRPCError({
        message: "Failed to create offer.",
        code: "INTERNAL_SERVER_ERROR",
      })
    }
  }
}

export const offersService = new OffersService()

import type { GetSellerProfilesArgs } from "./sellerProfiles.service.types"

import { sellerProfilesRepository } from "../repository/sellerProfiles.repository"

class SellerProfilesService {
  public async getSellerProfiles(args: GetSellerProfilesArgs) {
    return sellerProfilesRepository.getSellerProfiles(args.input.limit)
  }
}

export const sellerProfilesService = new SellerProfilesService()

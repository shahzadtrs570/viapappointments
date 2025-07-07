import { db } from "@package/db"

class SellerProfilesRepository {
  public getSellerProfiles(limit?: number) {
    return db.sellerProfile.findMany({
      take: limit || 100,
      orderBy: {
        createdAt: "desc",
      },
    })
  }
}

export const sellerProfilesRepository = new SellerProfilesRepository()

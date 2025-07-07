import { db } from "@package/db"

import type {
  ChangeNameByIdData,
  SaveVerificationTokenData,
  UpdateUserOnboardingByIdData,
} from "./user.repository.types"

class UserRepository {
  public getUserById(userId: string) {
    return db.user.findUnique({
      where: {
        id: userId,
      },
      include: { subscription: true },
    })
  }

  getSubscriptionByUserId(userId: string) {
    return db.subscription.findUnique({
      where: { userId },
    })
  }

  public async changeNameById(data: ChangeNameByIdData) {
    await db.user.update({
      where: {
        id: data.userId,
      },
      data: {
        name: data.name,
      },
    })
  }

  public updateUserOnboardingById(data: UpdateUserOnboardingByIdData) {
    return db.user.update({
      where: { id: data.userId },
      data: {
        hasOnboarded: true,
        name: data.onboardingData.name,
      },
    })
  }

  public async saveVerificationToken(data: SaveVerificationTokenData) {
    // First, delete any existing verification tokens for this user
    await db.verificationToken.deleteMany({
      where: {
        identifier: data.userId,
      },
    })

    // Create a new verification token that expires in 24 hours
    return db.verificationToken.create({
      data: {
        identifier: data.userId,
        token: data.token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    })
  }
}

export const userRepository = new UserRepository()

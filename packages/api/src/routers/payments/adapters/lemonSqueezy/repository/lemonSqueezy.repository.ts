import { db } from "@package/db"

import type { SubscriptionWithOptionalStatus } from "./lemonSqueezy.repository.types"

class LemonSqueezyRepository {
  public updateSubscriptionByUserId<T extends SubscriptionWithOptionalStatus>({
    userId,
    updateData,
  }: {
    userId: string
    updateData: T
  }) {
    return db.subscription.upsert({
      where: { userId },
      create: updateData,
      update: updateData,
    })
  }
}

export const lemonSqueezyRepository = new LemonSqueezyRepository()

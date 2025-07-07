import { db } from "@package/db"

import type { GetUsersStatisticsArgs } from "../service/statistics.service.types"

class StatisticsRepository {
  public getSubscriptionStatistics() {
    return db.subscription.findMany({
      select: {
        status: true,
        lookupKey: true,
      },
    })
  }

  public getUsersStatistics(data: GetUsersStatisticsArgs["input"]) {
    return db.user.findMany({
      where: {
        createdAt: {
          gte: data.from,
          lte: data.to,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    })
  }
}

export const statisticsRepository = new StatisticsRepository()

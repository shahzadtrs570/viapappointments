import type { UserStatisticsInput } from "./statistics.input"
import type { $Enums, Prisma } from "@package/db"
import type { SubscriptionPlanName } from "@package/utils"

export type Subscriptions = {
  subscriptionPlan: SubscriptionPlanName | null
  status: $Enums.SubscriptionStatus | null
}[]

export type SubscriptionsWithLookupKey = Prisma.SubscriptionGetPayload<{
  select: {
    status: true
    lookupKey: true
  }
}>[]

export type GetUsersStatisticsArgs = {
  input: UserStatisticsInput
}

export type UsersCreatedAt = {
  createdAt: Date
}[]

export type UsersAndDaysBetween = {
  users: UsersCreatedAt
  allDaysBetween: Date[]
}

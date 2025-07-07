import type { Subscription } from "@package/db"

export type SubscriptionWithOptionalStatus = Omit<Subscription, "status"> & {
  status?: Subscription["status"]
}

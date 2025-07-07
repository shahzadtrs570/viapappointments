import type {
  CreateCheckoutSessionInput,
  GiveFreeTrialInput,
  UpgradeSubscriptionPlanInput,
} from "./payments.input"
import type { UserSession } from "@package/auth/types"

export type CreateCheckoutsessionArgs = {
  input: CreateCheckoutSessionInput
  session: UserSession
}

export type CreateBillingPortalSessionArgs = {
  session: UserSession
}

export type UpgradeSubscriptionPlanArgs = {
  input: UpgradeSubscriptionPlanInput
  session: UserSession
}

export type GiveFreeTrialArgs = {
  input: GiveFreeTrialInput
  session: UserSession
}

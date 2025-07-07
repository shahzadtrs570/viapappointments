import { onboardingSchema } from "@package/validations"
import { z } from "zod"

const lookupKeySchema = z.object({
  lookupKey: z.string({
    required_error: "Lookup key is required.",
  }),
})

export const createCheckoutSessionInput = lookupKeySchema
export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionInput
>

export const upgradeSubscriptionPlanInput = lookupKeySchema
export type UpgradeSubscriptionPlanInput = z.infer<
  typeof upgradeSubscriptionPlanInput
>

export const giveFreeTrialInput = onboardingSchema
export type GiveFreeTrialInput = z.infer<typeof giveFreeTrialInput>

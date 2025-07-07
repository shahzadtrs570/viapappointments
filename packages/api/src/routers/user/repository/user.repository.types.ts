import type { ChangeNameArgs } from "../service/user.service.types"
import type { OnboardingData } from "@package/validations"

export type ChangeNameByIdData = ChangeNameArgs["input"] & {
  userId: string
}

export type UpdateUserOnboardingByIdData = {
  userId: string
  onboardingData: Omit<OnboardingData, "lookupKey">
}

export type SaveVerificationTokenData = {
  userId: string
  token: string
}

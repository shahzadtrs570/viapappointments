import type { UserSession } from "@package/auth/types"
import type { Name, OnboardingData } from "@package/validations"

export type UpdateUserOnboardingArgs = {
  input: OnboardingData
  session: UserSession | undefined
}

export type ChangeNameArgs = {
  input: Name
  session: UserSession
}

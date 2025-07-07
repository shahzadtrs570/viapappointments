import type {
  Interval,
  Name,
  Plan,
  PlanAndInterval,
} from "@package/validations"

type ChangeName = {
  type: "CHANGE_NAME"
  payload: Name
}

type ChangePlan = {
  type: "CHANGE_PLAN"
  payload: Plan
}

type ChangeInterval = {
  type: "CHANGE_INTERVAL"
  payload: Interval
}

type ChangePlanAndInterval = {
  type: "CHANGE_PLAN_AND_INTERVAL"
  payload: PlanAndInterval
}

export type OnboardingState = Name & PlanAndInterval

export type OnboardingActions =
  | ChangeName
  | ChangePlan
  | ChangeInterval
  | ChangePlanAndInterval

export const initialOnboardingState: OnboardingState = {
  name: "",
  plan: "PREMIUM",
  interval: "yearly",
}

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingActions
) {
  switch (action.type) {
    case "CHANGE_NAME":
      return {
        ...state,
        ...action.payload,
      }
    case "CHANGE_PLAN_AND_INTERVAL":
      return {
        ...state,
        ...action.payload,
      }
    case "CHANGE_PLAN":
      return {
        ...state,
        ...action.payload,
      }
    case "CHANGE_INTERVAL":
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state
  }
}

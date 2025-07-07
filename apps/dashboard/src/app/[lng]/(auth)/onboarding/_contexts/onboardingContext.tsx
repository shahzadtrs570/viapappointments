"use client"

import type { Dispatch } from "react"
import { createContext, useContext, useReducer } from "react"

import type {
  OnboardingActions,
  OnboardingState,
} from "../_reducers/onboardingReducer"

import {
  initialOnboardingState,
  onboardingReducer,
} from "../_reducers/onboardingReducer"

type OnboardingContextProviderProps = {
  children: React.ReactNode
}

type OnboardingContext = {
  onboardingState: OnboardingState
  dispatchOnboarding: Dispatch<OnboardingActions>
}

const OnboardingContext = createContext<OnboardingContext | null>(null)

export function OnboardingContextProvider({
  children,
}: OnboardingContextProviderProps) {
  const [onboardingState, dispatchOnboarding] = useReducer(
    onboardingReducer,
    initialOnboardingState
  )

  return (
    <OnboardingContext.Provider value={{ onboardingState, dispatchOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboardingContext() {
  const onboardingContext = useContext(OnboardingContext)

  if (!onboardingContext) {
    throw new Error(
      "useOnboardingContext should be used within a OnboardingContextProvider"
    )
  }

  return onboardingContext
}

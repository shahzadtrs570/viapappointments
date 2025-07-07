"use client"

import { useRef } from "react"

import { AnimatePresence } from "framer-motion"
import { Wizard } from "react-use-wizard"

import { OnboardingContextProvider } from "../../_contexts/onboardingContext"
import { AnimatedStep } from "../AnimatedStep/AnimatedStep"
import { StepOne } from "../StepOne/StepOne"
import { StepStatus } from "../StepStatus/StepStatus"
import { StepTwo } from "../StepTwo/StepTwo"

export function OnboardingProvider() {
  const previousStep = useRef<number>(0)

  return (
    <OnboardingContextProvider>
      <Wizard
        header={<StepStatus />}
        wrapper={<AnimatePresence initial={false} mode="wait" />}
      >
        <AnimatedStep previousStep={previousStep}>
          <StepOne />
        </AnimatedStep>
        <AnimatedStep previousStep={previousStep}>
          <StepTwo />
        </AnimatedStep>
      </Wizard>
    </OnboardingContextProvider>
  )
}

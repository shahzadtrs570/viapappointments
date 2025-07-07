import type { Metadata } from "next"

import { OnboardingContextProvider } from "@/app/[lng]/(auth)/onboarding/_contexts/onboardingContext"

import { Header } from "./_components/Header/Header"
import { PlanSection } from "./_components/PlanSection/PlanSection"

// import { OnboardingContextProvider } from "@/app/(auth)/onboarding/_contexts/onboardingContext"
export const metadata: Metadata = {
  title: "Billing",
  description: "Billing",
}

export default function BillingPage() {
  return (
    <OnboardingContextProvider>
      <section className="flex flex-col items-start gap-6">
        <Header />
        <PlanSection />
      </section>
    </OnboardingContextProvider>
  )
}

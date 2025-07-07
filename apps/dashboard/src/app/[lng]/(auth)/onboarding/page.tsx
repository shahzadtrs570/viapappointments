import { Container } from "@package/ui/container"
import { featureFlags } from "@package/utils"
import { notFound } from "next/navigation"

import type { Metadata } from "next"

import { OnboardingProvider } from "./_components/OnboardingProvider/OnboardingProvider"

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Onboarding page for new users.",
}

export default function OnboardingPage() {
  if (!featureFlags.onboardingFlow) {
    return notFound()
  }

  return (
    <Container className="flex w-full max-w-[650px] flex-col items-center justify-center overflow-x-hidden min-h-dynamic-screen">
      <OnboardingProvider />
    </Container>
  )
}

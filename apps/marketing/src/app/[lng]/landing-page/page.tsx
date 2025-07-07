/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next"

import { useTranslation } from "@/lib/i18n"

import { Benefits } from "./_components/Benefits"
import { Calculator } from "./_components/Calculator"
import { CallToAction } from "./_components/CallToAction"
import { FAQ } from "./_components/FAQ"
import { Features } from "./_components/Features"
import { Hero } from "./_components/Hero"
import { HowItWorks } from "./_components/HowItWorks"
import { PreQualifyImage } from "./_components/PreQualifyImage"
import { ScrollingBanner } from "./_components/ScrollingBanner"
import { TrustIndicators } from "./_components/TrustIndicators"
import { ValueProposition } from "./_components/ValueProposition"
import { WhatIsSrenova } from "./_components/WhatIsSrenova"

/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/rules-of-hooks */
// Generate dynamic metadata from translations
export async function generateMetadata({
  params: { lng },
}: {
  params: { lng: string }
}): Promise<Metadata> {
  const { t } = await useTranslation(lng, ["landing"])

  return {
    title: t(
      "meta.title",
      "VIPAPPOINTMENTS | Unlock Your Vehicle By Choosing The Right Vehicle"
    ),
    description: t(
      "meta.description",
      "Srenova helps homeowners access their property's value while maintaining the right to live in their home. Flexible payment options, transparent process, and professional support."
    ),
  }
}

// Landing page component
export default async function LandingPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  // Get translations for landing page
  const { t } = await useTranslation(lng, ["landing", "common"])

  return (
    <section className="bg-white">
      <Hero />
      <ScrollingBanner />
      <PreQualifyImage />
      <Features />
      <WhatIsSrenova />
      <Calculator />
      <ValueProposition />
      <HowItWorks />
      <Benefits />
      <FAQ />
      <TrustIndicators />
      <CallToAction />
    </section>
  )
}

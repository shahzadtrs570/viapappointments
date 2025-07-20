/* eslint-disable  */

import type { Metadata } from "next"

import { useTranslation } from "@/lib/i18n"
import { Hero } from "./landing-page/_components/Hero"
import { ScrollingBanner } from "./landing-page/_components/ScrollingBanner"
import { ExploreCarMakes } from "./landing-page/_components/ExploreCarMakes"
import { ExploreCarTypes } from "./landing-page/_components/ExploreCarTypes"
import { BudgetCalculator } from "./landing-page/_components/BudgetCalculator"
import { SearchComponent } from "./landing-page/_components/SearchComponent"
import { WheelPopupWrapper } from "./landing-page/_components/WheelPopupWrapper"
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
      "VIPAPPOINTMENTS helps homeowners access their property's value while maintaining the right to live in their home. Flexible payment options, transparent process, and professional support."
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
    <section className="bg-white dark:bg-background">
      <Hero />
      {/* <ScrollingBanner /> */}
      <SearchComponent />
      {/* <PreQualifyImage /> */}
      <BudgetCalculator />
      <ExploreCarMakes />
      <ExploreCarTypes />
      <WheelPopupWrapper />
    </section>
  )
}

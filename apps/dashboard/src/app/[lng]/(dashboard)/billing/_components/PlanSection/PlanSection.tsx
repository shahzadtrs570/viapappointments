"use client"

import { getSubscriptionPlanFromLookupKey } from "@package/utils"

import { useAuth } from "@/hooks/useAuth"

import { CurrentPlan } from "../CurrentPlan/CurrentPlan"
import { UpgradePlanSection } from "../UpgradePlanSection/UpgradePlanSection"

export function PlanSection() {
  const { user, isSubscribed } = useAuth()

  function renderPlanSection() {
    if (
      isSubscribed &&
      getSubscriptionPlanFromLookupKey(user?.subscription?.lookupKey ?? "")
        ?.name !== "PREMIUM"
    ) {
      return <UpgradePlanSection />
    } else if (!isSubscribed) {
      return <UpgradePlanSection />
    }
  }

  return (
    <>
      <CurrentPlan />
      {renderPlanSection()}
    </>
  )
}

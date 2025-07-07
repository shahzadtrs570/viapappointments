import { SUBSCRIPTION_PLANS } from "@package/utils"

import { PricingCard } from "../PricingCard/PricingCard"
import { PricingSwitch } from "../PricingSwitch/PricingSwitch"

type PricingPlansProps = {
  checked: boolean
  onCheckedChange: React.Dispatch<React.SetStateAction<boolean>>
  hideButtons?: boolean
}

export function PricingPlans({
  checked,
  onCheckedChange,
  hideButtons,
}: PricingPlansProps) {
  return (
    <section className="mt-8 flex flex-col items-center gap-4">
      <PricingSwitch checked={checked} onCheckedChange={onCheckedChange} />
      <section className="mt-4 flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <PricingCard
            key={plan.name}
            hideButtons={hideButtons}
            isYearlyChecked={checked}
            subscriptionPlan={plan}
          />
        ))}
      </section>
    </section>
  )
}

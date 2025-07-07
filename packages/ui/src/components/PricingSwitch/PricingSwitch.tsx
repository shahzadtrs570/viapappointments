import type { SwitchPrimitives } from "../Switch/Switch"

import { Label } from "../Label/Label"
import { Switch } from "../Switch/Switch"

type PricingSwitchProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
>

export function PricingSwitch({ ...props }: PricingSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Label className="font-bold" htmlFor="pricing">
        Monthly
      </Label>
      <Switch checked id="pricing" {...props} />
      <Label className="font-bold" htmlFor="pricing">
        Yearly
      </Label>
    </div>
  )
}

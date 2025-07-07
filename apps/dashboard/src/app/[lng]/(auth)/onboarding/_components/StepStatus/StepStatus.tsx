import { cn } from "@package/utils"

import { useStepStatus } from "../../_hooks/useStepStatus"

export function StepStatus() {
  const { activeStep, stepCount } = useStepStatus()

  return (
    <section className="mb-8 flex w-full flex-col items-center gap-2">
      <section className="flex gap-3">
        {Array(stepCount)
          .fill(stepCount)
          .map((step, index) => (
            <div
              key={step + index}
              className={cn(
                "h-[5px] w-[43px] rounded bg-muted md:h-[7px] md:w-[71px]",
                {
                  "bg-primary": activeStep >= index,
                }
              )}
            />
          ))}
      </section>

      <p>{`${activeStep + 1} / ${stepCount}`}</p>
    </section>
  )
}

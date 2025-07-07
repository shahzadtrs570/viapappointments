/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import type { NextStepsCardProps } from "./FormValidation"

export function NextStepsCard({ t }: NextStepsCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg sm:p-4 md:p-6">
      <Typography
        className="mb-2 text-base text-primary sm:mb-4 sm:text-lg"
        variant="h3"
      >
        {t("nextSteps.title")}
      </Typography>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
            1
          </div>
          <Typography
            className="ml-2 text-xs text-card-foreground sm:ml-3 sm:text-sm"
            variant="body"
          >
            {t("nextSteps.step1")}
          </Typography>
        </div>

        <div className="flex items-center">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
            2
          </div>
          <Typography
            className="ml-2 text-xs text-card-foreground sm:ml-3 sm:text-sm"
            variant="body"
          >
            {t("nextSteps.step2")}
          </Typography>
        </div>

        <div className="flex items-center">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
            3
          </div>
          <Typography
            className="ml-2 text-xs text-card-foreground sm:ml-3 sm:text-sm"
            variant="body"
          >
            {t("nextSteps.step3")}
          </Typography>
        </div>
      </div>
    </div>
  )
}

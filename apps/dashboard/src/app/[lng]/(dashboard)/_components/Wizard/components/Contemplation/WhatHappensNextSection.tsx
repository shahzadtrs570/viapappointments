/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import type { WhatHappensNextSectionProps } from "./FormValidation"

export function WhatHappensNextSection({ t }: WhatHappensNextSectionProps) {
  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-border bg-muted/30 shadow-sm sm:mb-6 md:mb-8">
      <div className="bg-primary/5 p-3 sm:p-4">
        <Typography
          className="text-lg font-semibold text-primary sm:text-xl"
          variant="h3"
        >
          {t("what_happens_next")}
        </Typography>
      </div>

      <div className="p-3 sm:p-4 md:p-6">
        <div className="relative border-l-2 border-dashed border-primary/30 pl-4 before:absolute before:left-[-5px] before:top-0 before:size-3 before:rounded-full before:bg-primary/40 before:content-[''] sm:pl-6 sm:before:size-4 md:pl-8">
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute left-[-26px] top-[-2px] flex size-5 items-center justify-center rounded-full bg-primary text-white sm:left-[-41px] sm:size-6">
              1
            </div>
            <Typography
              className="mb-1 text-base font-semibold text-card-foreground sm:mb-2 sm:text-lg"
              variant="body"
            >
              {t("steps.review.title")}
            </Typography>
            <Typography
              className="text-sm text-muted-foreground sm:text-base"
              variant="body"
            >
              {t("steps.review.description")}
            </Typography>
            <div className="mt-2 rounded bg-primary/5 p-2 text-xs text-muted-foreground sm:mt-3 sm:p-3 sm:text-sm">
              <span className="font-medium text-primary">
                {t("steps.review.timeframe")}:
              </span>{" "}
              {t("steps.review.timeframe_value")}
            </div>
          </div>

          <div className="relative mb-6 sm:mb-8">
            <div className="absolute left-[-26px] top-[-2px] flex size-5 items-center justify-center rounded-full bg-primary text-white sm:left-[-41px] sm:size-6">
              2
            </div>
            <Typography
              className="mb-1 text-base font-semibold text-card-foreground sm:mb-2 sm:text-lg"
              variant="body"
            >
              {t("steps.verification.title")}
            </Typography>
            <Typography
              className="text-sm text-muted-foreground sm:text-base"
              variant="body"
            >
              {t("steps.verification.description")}
            </Typography>
            <div className="mt-2 rounded bg-primary/5 p-2 text-xs text-muted-foreground sm:mt-3 sm:p-3 sm:text-sm">
              <span className="font-medium text-primary">
                {t("steps.verification.process")}:
              </span>{" "}
              {t("steps.verification.process_value")}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[-26px] top-[-2px] flex size-5 items-center justify-center rounded-full bg-primary text-white sm:left-[-41px] sm:size-6">
              3
            </div>
            <Typography
              className="mb-1 text-base font-semibold text-card-foreground sm:mb-2 sm:text-lg"
              variant="body"
            >
              {t("steps.offer.title")}
            </Typography>
            <Typography
              className="text-sm text-muted-foreground sm:text-base"
              variant="body"
            >
              {t("steps.offer.description")}
            </Typography>
            <div className="mt-2 rounded bg-primary/5 p-2 text-xs text-muted-foreground sm:mt-3 sm:p-3 sm:text-sm">
              <span className="font-medium text-primary">
                {t("steps.offer.expect")}:
              </span>{" "}
              {t("steps.offer.expect_value")}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

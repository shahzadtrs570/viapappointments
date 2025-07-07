/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import type { ApplicationHeaderProps } from "./FormValidation"

export function ApplicationHeader({
  applicationReviewData,
  getFormattedDate,
  t,
}: ApplicationHeaderProps) {
  return (
    <div className="bg-primary/5 p-4 sm:p-6 md:p-8">
      <div className="mb-4 flex flex-col sm:mb-6 sm:flex-row sm:items-center sm:space-x-4 md:mb-8 md:space-x-6">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/20 p-3 shadow-md transition-all duration-300 hover:bg-primary/30 sm:mb-0 sm:size-14 sm:p-4 md:size-16">
          <svg
            className="size-6 text-primary sm:size-7 md:size-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <div>
          <Typography
            className="text-xl font-bold text-primary sm:text-2xl md:text-3xl"
            variant="h2"
          >
            {t("title")}
          </Typography>
          <Typography
            className="mt-1 text-base text-muted-foreground sm:mt-2 sm:text-lg"
            variant="body"
          >
            {t("subtitle")}
          </Typography>
          <div className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:mt-3 sm:px-4 sm:text-sm md:mt-4">
            {t("application_received")} •{" "}
            {getFormattedDate(applicationReviewData?.createdAt)}
          </div>
        </div>
      </div>
    </div>
  )
}

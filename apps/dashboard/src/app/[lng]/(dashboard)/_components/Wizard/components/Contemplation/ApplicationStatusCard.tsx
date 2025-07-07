/*eslint-disable*/

import { Card } from "@package/ui/card"
import { Typography } from "@package/ui/typography"
import { Loader } from "lucide-react"
import type { ApplicationStatusCardProps } from "./FormValidation"

export function ApplicationStatusCard({
  applicationReviewData,
  isLoadingReview,
  getProgressPercentage,
  getProgressBarColorClass,
  getFormattedDate,
  t,
}: ApplicationStatusCardProps) {
  return (
    <Card className="relative overflow-hidden border border-border bg-card shadow-md">
      <div className="absolute right-0 top-0 size-16 rounded-bl-full bg-primary/10 sm:size-20" />
      <div className="p-3 sm:p-4 md:p-6">
        <Typography
          className="mb-3 flex items-center text-base text-primary sm:mb-4 sm:text-lg"
          variant="h3"
        >
          <svg
            className="mr-1 size-4 sm:mr-2 sm:size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          {t("wizard_completion_status:status.title")}
        </Typography>

        <div className="mb-3 rounded-lg bg-primary/5 p-2 sm:mb-4 sm:p-3 md:p-4">
          <div className="flex items-center justify-between">
            <Typography
              className="text-sm font-medium sm:text-base"
              variant="body"
            >
              {t("wizard_completion_status:status.progress")}
            </Typography>
            {isLoadingReview ? (
              <span className="text-xs text-muted-foreground sm:text-sm">
                {t("wizard_completion_status:status.loading")}
              </span>
            ) : (
              <span
                className={`text-xs font-medium sm:text-sm ${
                  applicationReviewData?.status === "REJECTED"
                    ? "text-destructive"
                    : applicationReviewData?.status === "ACCEPTED"
                      ? "text-green-500"
                      : applicationReviewData?.status === "PROCESSING"
                        ? "text-primary"
                        : "text-amber-500"
                }`}
              >
                {applicationReviewData?.status === "ACCEPTED"
                  ? t("wizard_completion_status:status.approved")
                  : applicationReviewData?.status === "PROCESSING"
                    ? t("wizard_completion_status:status.processing")
                    : applicationReviewData?.status === "PENDING"
                      ? t("wizard_completion_status:status.pending")
                      : applicationReviewData?.status === "REJECTED"
                        ? t("wizard_completion_status:status.rejected")
                        : t("wizard_completion_status:status.in_process")}
              </span>
            )}
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted sm:mt-2 sm:h-2">
            {isLoadingReview ? (
              <div
                className="h-full w-1/3 animate-[gradient_1.5s_ease-in-out_infinite] animate-pulse rounded-full bg-gradient-to-r from-blue-300 via-primary to-blue-300 bg-[length:200%_100%]"
                style={{
                  animation: "gradientMove 1.5s ease-in-out infinite",
                }}
              />
            ) : (
              <div
                className={`h-full rounded-full ${getProgressBarColorClass()}`}
                style={{ width: `${getProgressPercentage()}%` }}
              />
            )}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground sm:mt-2 sm:text-xs">
            <span>{t("application_received")}</span>
            <span>{t("steps.verification.title")}</span>
            <span>{t("steps.offer.title")}</span>
          </div>
        </div>

        <div className="mb-3 space-y-1 text-xs sm:mb-4 sm:space-y-2 sm:text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("status.application_id")}:
            </span>
            {applicationReviewData ? (
              <span className="font-medium">{applicationReviewData?.id}</span>
            ) : (
              <span className="flex items-center">
                <Loader className="mr-1 size-3 animate-spin" />
              </span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("status.submission_date")}:
            </span>
            <span className="font-medium">
              {getFormattedDate(applicationReviewData?.createdAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("status.estimated_completion")}:
            </span>
            <span className="font-medium">{t("status.completion_time")}</span>
          </div>
        </div>

        <div className="rounded-md bg-muted/30 p-2 text-xs text-muted-foreground sm:p-3 sm:text-sm">
          <div className="flex">
            <svg
              className="size-4 shrink-0 text-primary sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <div className="ml-2 sm:ml-3">{t("status.check_status_info")}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

/*eslint-disable*/

import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { ProcessStatus } from "./FormValidation"

interface ConveyancingStatusSectionProps {
  processStatus: ProcessStatus | null
  isLoadingDashboardStatus: boolean
  dashboardStatusError: string | null
}

export function ConveyancingStatusSection({
  processStatus,
  isLoadingDashboardStatus,
  dashboardStatusError,
}: ConveyancingStatusSectionProps) {
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  return (
    <>
      <Typography
        className="mb-3 text-base font-bold text-card-foreground sm:mb-4 sm:text-lg"
        variant="h2"
      >
        {t("wizard_completion_status:conveyancingStatus.title")}
      </Typography>
      <Typography
        className="mb-3 text-xs text-muted-foreground sm:mb-6 sm:text-sm"
        variant="body"
      >
        {t("wizard_completion_status:conveyancingStatus.description")}
      </Typography>

      <div className="-mx-3 mb-6 overflow-x-auto px-3 sm:mx-0 sm:mb-8 sm:px-0">
        <div className="min-w-[640px] sm:min-w-0">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-10">
                  <svg
                    className="size-4 sm:size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <span className="mt-2 max-w-[80px] text-center text-[10px] font-medium text-card-foreground sm:max-w-none sm:text-xs">
                  {t(
                    "wizard_completion_status:conveyancingStatus.steps.applicationAccepted"
                  )}
                </span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  15/06/2023
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-10">
                  <svg
                    className="size-4 sm:size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <span className="mt-2 max-w-[80px] text-center text-[10px] font-medium text-card-foreground sm:max-w-none sm:text-xs">
                  {t(
                    "wizard_completion_status:conveyancingStatus.steps.legalDocumentation"
                  )}
                </span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  22/06/2023
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-10">
                  <svg
                    className="size-4 sm:size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <span className="mt-2 max-w-[80px] text-center text-[10px] font-medium text-card-foreground sm:max-w-none sm:text-xs">
                  {t(
                    "wizard_completion_status:conveyancingStatus.steps.propertyValuation"
                  )}
                </span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  29/06/2023
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-10">
                  <svg
                    className="size-4 sm:size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <span className="mt-2 max-w-[80px] text-center text-[10px] font-medium text-card-foreground sm:max-w-none sm:text-xs">
                  {t(
                    "wizard_completion_status:conveyancingStatus.steps.conveyancing"
                  )}
                </span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  {t(
                    "wizard_completion_status:conveyancingStatus.status.inProgress"
                  )}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-10">
                  <svg
                    className="size-4 sm:size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <span className="mt-2 max-w-[80px] text-center text-[10px] font-medium text-card-foreground sm:max-w-none sm:text-xs">
                  {t(
                    "wizard_completion_status:conveyancingStatus.steps.completion"
                  )}
                </span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  {t(
                    "wizard_completion_status:conveyancingStatus.status.pending"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-border bg-card p-3 sm:p-6">
        <div className="mb-4 flex items-center">
          <div className="shrink-0">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <Typography
              className="text-lg font-medium text-card-foreground"
              variant="h3"
            >
              {t("wizard_completion_status:conveyancingStatus.title")}
            </Typography>
            <Typography
              className="text-sm text-muted-foreground"
              variant="body"
            >
              {t(
                "wizard_completion_status:conveyancingStatus.currentStagePrefix"
              )}{" "}
              {processStatus?.currentStage ||
                t(
                  "wizard_completion_status:conveyancingStatus.steps.legalDocumentation"
                )}
            </Typography>
          </div>
        </div>

        {isLoadingDashboardStatus ? (
          <div className="flex justify-center py-8">
            <div className="size-12 animate-spin rounded-full border-t-4 border-primary" />
          </div>
        ) : dashboardStatusError ? (
          <div className="rounded-md bg-red-100 p-4 text-red-700">
            {dashboardStatusError}
          </div>
        ) : (
          <div className="space-y-4">
            {processStatus?.tasks?.map((task, index) => (
              <div key={index} className="flex items-start">
                <div className="mt-1 shrink-0">
                  <svg
                    className="size-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {task.status === "Completed" ? (
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    ) : (
                      <path
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    )}
                  </svg>
                </div>
                <div className="ml-3">
                  <Typography
                    className="text-sm font-medium text-card-foreground"
                    variant="body"
                  >
                    {task.name}
                  </Typography>
                  <Typography
                    className="text-xs text-muted-foreground"
                    variant="body"
                  >
                    {task.status === "Completed" ? (
                      <>
                        {t(
                          "wizard_completion_status:conveyancingStatus.status.completedOnNoDate"
                        )}
                        {task.dateCompleted && ` ${task.dateCompleted}`}
                      </>
                    ) : task.status === "In Progress" ? (
                      <>
                        {t(
                          "wizard_completion_status:conveyancingStatus.status.inProgress"
                        )}{" "}
                        -{" "}
                        {t(
                          "wizard_completion_status:conveyancingStatus.expectedCompletionPrefix"
                        )}
                        {task.expectedCompletion}
                      </>
                    ) : (
                      <>
                        {t(
                          "wizard_completion_status:conveyancingStatus.status.pending"
                        )}{" "}
                        -{" "}
                        {t(
                          "wizard_completion_status:conveyancingStatus.expectedPrefix"
                        )}
                        {task.expectedCompletion}
                      </>
                    )}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        )}

        {processStatus?.nextActionRequired && (
          <div className="mt-6 border-t border-border pt-4">
            <Typography
              className="mb-2 text-sm font-medium text-card-foreground"
              variant="h4"
            >
              {t("wizard_completion_status:nextActionRequired.title")}
            </Typography>
            <Typography
              className="text-sm text-muted-foreground"
              variant="body"
            >
              {processStatus.nextActionRequired.message}
            </Typography>
            <div className="mt-3">
              <Button className="inline-flex items-center">
                <svg
                  className="mr-2 size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                {processStatus.nextActionRequired.actionButton}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

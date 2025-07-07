/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import type { ContemplationPhaseCardProps } from "./FormValidation"

export function ContemplationPhaseCard({ t }: ContemplationPhaseCardProps) {
  return (
    <div className="mb-4 rounded-lg border border-border bg-card p-3 shadow-lg sm:mb-6 sm:p-4 md:p-6">
      <div className="mb-2 flex flex-col justify-between gap-2 sm:mb-4 sm:flex-row sm:items-center sm:gap-0">
        <Typography className="text-base text-primary sm:text-lg" variant="h3">
          {t("contemplationPhase.title")}
        </Typography>
        <div className="group relative inline-flex self-start sm:self-auto">
          <button
            className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 sm:size-8"
            type="button"
          >
            <svg
              className="size-4 text-primary sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
          <span className="absolute -top-2 right-0 z-50 w-48 -translate-y-full scale-0 rounded bg-popover p-2 text-xs text-popover-foreground transition-all duration-300 ease-in-out group-hover:scale-100 sm:w-64 sm:text-sm">
            {t("contemplationPhase.description")}
          </span>
        </div>
      </div>
      <Typography
        className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm"
        variant="body"
      >
        {t("contemplationPhase.description")}
      </Typography>

      <div className="rounded-md border border-amber-100 bg-amber-50 p-2 dark:border-amber-900/50 dark:bg-amber-950/30 sm:p-3">
        <div className="flex items-start">
          <div className="shrink-0">
            <svg
              className="size-4 text-amber-600 dark:text-amber-400 sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <div className="ml-2 sm:ml-3">
            <Typography
              className="text-xs text-amber-800 dark:text-amber-300 sm:text-sm"
              variant="body"
            >
              {t("contemplationPhase.remember")}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

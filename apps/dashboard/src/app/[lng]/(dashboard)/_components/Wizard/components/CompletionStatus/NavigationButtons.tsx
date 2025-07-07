/*eslint-disable*/

import { Button } from "@package/ui/button"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface NavigationButtonsProps {
  isRefreshing: boolean
  onRefreshStatus: () => void
}

export function NavigationButtons({
  isRefreshing,
  onRefreshStatus,
}: NavigationButtonsProps) {
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  return (
    <div className="flex justify-between pt-6">
      <Button
        disabled={isRefreshing}
        id="refresh-status-btn"
        onClick={onRefreshStatus}
      >
        {isRefreshing ? (
          <>
            <svg
              className="mr-2 size-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
            {t("wizard_completion_status:buttons.refreshing")}
          </>
        ) : (
          <>
            <svg
              className="mr-2 size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            {t("wizard_completion_status:buttons.refreshStatus")}
          </>
        )}
      </Button>
    </div>
  )
}

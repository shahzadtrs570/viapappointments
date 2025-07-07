/*eslint-disable*/

import { Button } from "@package/ui/button"
import type { NavigationButtonsProps } from "./FormValidation"

export function NavigationButtons({
  isContinueAgain,
  isChecking,
  onBack,
  onCheckStatus,
  t,
}: NavigationButtonsProps) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-0">
      {isContinueAgain && (
        <Button className="w-full sm:w-auto" variant="outline" onClick={onBack}>
          {t("buttons.back")}
        </Button>
      )}
      <Button
        className="w-full bg-primary/90 px-4 transition-colors duration-300 hover:bg-primary sm:ml-auto sm:w-auto sm:px-6"
        disabled={isChecking}
        onClick={onCheckStatus}
      >
        {isChecking ? (
          <>
            <svg
              className="mr-1 size-3 animate-spin sm:mr-2 sm:size-4"
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
            {t("buttons.checking")}
          </>
        ) : (
          t("buttons.check_status")
        )}
      </Button>
    </div>
  )
}

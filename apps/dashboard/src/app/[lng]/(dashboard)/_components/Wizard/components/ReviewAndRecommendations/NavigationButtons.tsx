/*eslint-disable*/

import { Button } from "@package/ui/button"
import type { NavigationButtonsProps } from "./FormValidation"

export function NavigationButtons({
  readOnly,
  onBack,
  onSubmit,
  createReviewPending,
  updateReviewPending,
  t,
}: NavigationButtonsProps) {
  const isLoading = createReviewPending || updateReviewPending

  return (
    <div className="flex flex-col items-center justify-between gap-3 pt-4 sm:flex-row sm:gap-0 sm:pt-6">
      <Button className="w-full sm:w-auto" variant="outline" onClick={onBack}>
        {t("buttons.back")}
      </Button>
      {!readOnly && (
        <Button
          className="w-full sm:w-[300px]"
          disabled={isLoading}
          onClick={onSubmit}
        >
          {isLoading ? (
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
              {t("buttons.saving")}
            </>
          ) : (
            <>
              {t("buttons.requestProvisionalOffer")}
              <svg
                className="ml-1 size-4 sm:ml-2 sm:size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </>
          )}
        </Button>
      )}
      {readOnly && (
        <Button
          className="w-full sm:w-[300px]"
          disabled={isLoading}
          onClick={onSubmit}
        >
          {isLoading ? (
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
              {t("buttons.saving")}
            </>
          ) : (
            <>
              {t("buttons.continue")}
              <svg
                className="ml-1 size-4 sm:ml-2 sm:size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </>
          )}
        </Button>
      )}
    </div>
  )
}

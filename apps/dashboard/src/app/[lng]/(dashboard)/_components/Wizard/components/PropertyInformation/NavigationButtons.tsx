/*eslint-disable*/

import { Button } from "@package/ui/button"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface NavigationButtonsProps {
  onBack: () => void
  readOnly: boolean
  mode: "edit" | "create"
  isCreatePending: boolean
  isUpdatePending: boolean
}

export function NavigationButtons({
  onBack,
  readOnly,
  mode,
  isCreatePending,
  isUpdatePending,
}: NavigationButtonsProps) {
  const { t } = useClientTranslation([
    "wizard_property_information",
    "wizard_common",
  ])

  const isLoading = !readOnly && (isCreatePending || isUpdatePending)

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border/30 pt-4 sm:mt-8 sm:flex-row sm:gap-0 sm:pt-6">
      <Button
        className="w-full border-border/80 bg-background transition-all duration-200 hover:bg-background/90 hover:text-primary sm:w-auto"
        type="button"
        variant="outline"
        onClick={onBack}
      >
        <svg
          className="mr-1 size-4 sm:mr-2 sm:size-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        {t("wizard_property_information:buttons.back")}
      </Button>
      <Button
        className="relative w-full bg-primary text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] sm:w-[300px]"
        type="submit"
        disabled={isLoading}
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
            {t("wizard_property_information:buttons.saving")}
          </>
        ) : (
          <>
            {readOnly
              ? t("wizard_property_information:buttons.continue")
              : mode === "edit"
                ? t(
                    "wizard_property_information:buttons.saveChanges",
                    "Save Changes"
                  )
                : t("wizard_property_information:buttons.continueToReview")}
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
    </div>
  )
}

/*eslint-disable*/

import { Button } from "@package/ui/button"
import { ArrowLeftIcon, ArrowRightIcon, LoadingSpinnerIcon } from "./FormIcons"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface NavigationButtonsProps {
  onBack: () => void
  readOnly?: boolean
  mode?: "edit" | "create"
  isLoading: boolean
  createSellerInfoPending: boolean
  updateSellerInfoPending: boolean
}

export function NavigationButtons({
  onBack,
  readOnly = false,
  mode = "create",
  isLoading,
  createSellerInfoPending,
  updateSellerInfoPending,
}: NavigationButtonsProps) {
  const { t } = useClientTranslation([
    "wizard_seller_information",
    "wizard_common",
  ])

  let buttonText

  if (readOnly) {
    buttonText = t("wizard_seller_information:buttons.continue")
  } else if (mode === "edit") {
    buttonText = t(
      "wizard_seller_information:buttons.saveChanges",
      "Save Changes"
    )
  } else {
    buttonText = t("wizard_seller_information:buttons.continueToProperty")
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 pt-4 sm:flex-row sm:gap-4 sm:pt-6 lg:pt-8">
      <Button
        className="w-full sm:w-auto"
        type="button"
        variant="outline"
        onClick={onBack}
      >
        <ArrowLeftIcon />
        {t("wizard_seller_information:buttons.back")}
      </Button>

      <Button
        className="w-full sm:w-[300px]"
        type="submit"
        disabled={
          // Never disable the button in readOnly mode
          readOnly
            ? false
            : isLoading || createSellerInfoPending || updateSellerInfoPending
        }
      >
        {!readOnly &&
        (isLoading || createSellerInfoPending || updateSellerInfoPending) ? (
          <>
            <LoadingSpinnerIcon />
            {t("wizard_seller_information:buttons.saving")}
          </>
        ) : (
          <>
            {buttonText}
            <ArrowRightIcon />
          </>
        )}
      </Button>
    </div>
  )
}

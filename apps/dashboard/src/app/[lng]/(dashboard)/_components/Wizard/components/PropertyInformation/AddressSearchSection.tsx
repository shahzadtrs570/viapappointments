/*eslint-disable*/

import { Button } from "@package/ui/button"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import AddressLookup from "../../AddressLookup"
import type { RightmoveResponse } from "./FormValidation"

interface AddressSearchSectionProps {
  readOnly: boolean
  onAddressSet: (address: string) => void
  onRightmoveData: (data: RightmoveResponse | null) => void
  onAddressSelected: (completeAddress: any) => void
  onGoButtonClick: () => void
  onBack: () => void
  onManualEntry: () => void
}

export function AddressSearchSection({
  readOnly,
  onAddressSet,
  onRightmoveData,
  onAddressSelected,
  onGoButtonClick,
  onBack,
  onManualEntry,
}: AddressSearchSectionProps) {
  const { t } = useClientTranslation([
    "wizard_property_information",
    "wizard_common",
  ])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="w-full">
        <AddressLookup
          apiKey={process.env.NEXT_PUBLIC_ADDRESS_LOOKUP_API_KEY}
          className=""
          readOnly={readOnly}
          setAddress={onAddressSet}
          onRightmoveData={onRightmoveData}
          onAddressSelected={onAddressSelected}
          onGoButtonClick={onGoButtonClick}
        />
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-3 pt-2 sm:flex-row sm:gap-0 sm:pt-4">
        <Button
          className="w-full border-border/80 bg-background/50  hover:text-primary sm:w-auto"
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
          className="flex w-full items-center gap-1 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary sm:w-auto sm:gap-2"
          variant="outline"
          onClick={onManualEntry}
        >
          <svg
            className="size-3 sm:size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          {t(
            "wizard_property_information:addressSearchSection.manualEntryButton"
          )}
        </Button>
      </div>
    </div>
  )
}

/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface SolicitorChoiceSectionProps {
  solicitorChoice: string
  showSavedSolicitorDetails: boolean
  onSolicitorChoiceChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function SolicitorChoiceSection({
  solicitorChoice,
  showSavedSolicitorDetails,
  onSolicitorChoiceChange,
}: SolicitorChoiceSectionProps) {
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  if (showSavedSolicitorDetails) {
    return null
  }

  return (
    <div
      className="mb-3 rounded-lg border border-border bg-card p-3 sm:mb-4 sm:p-6"
      id="solicitor-choice"
    >
      <Typography
        className="sm:text-md mb-3 text-sm font-medium text-card-foreground sm:mb-4"
        variant="h4"
      >
        {t("wizard_completion_status:solicitorDetails.question")}
      </Typography>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center">
          <input
            checked={solicitorChoice === "has-solicitor"}
            className="size-3 border-border text-primary focus:ring-primary sm:size-4"
            id="has-solicitor"
            name="solicitor-choice"
            type="radio"
            onChange={onSolicitorChoiceChange}
          />
          <label
            className="ml-2 block text-xs font-medium text-card-foreground sm:ml-3 sm:text-sm"
            htmlFor="has-solicitor"
          >
            {t(
              "wizard_completion_status:solicitorDetails.choices.hasSolicitor"
            )}
          </label>
        </div>
        <div className="flex items-center">
          <input
            checked={solicitorChoice === "recommend-solicitor"}
            className="size-3 border-border text-primary focus:ring-primary sm:size-4"
            id="recommend-solicitor"
            name="solicitor-choice"
            type="radio"
            onChange={onSolicitorChoiceChange}
          />
          <label
            className="ml-2 block text-xs font-medium text-card-foreground sm:ml-3 sm:text-sm"
            htmlFor="recommend-solicitor"
          >
            {t("wizard_completion_status:solicitorDetails.choices.noSolicitor")}
          </label>
        </div>
      </div>
    </div>
  )
}

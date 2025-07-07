/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

export function NextStepsSection() {
  const { t } = useClientTranslation(["wizard_provisional_offer"])

  return (
    <div className="mb-4 sm:mb-8">
      <Typography
        className="mb-3 text-lg font-bold text-card-foreground sm:mb-4 sm:text-xl"
        variant="h3"
      >
        {t("wizard_provisional_offer:nextStepsSection.title")}
      </Typography>
      <Typography
        className="mb-2 text-xs text-muted-foreground sm:mb-3 sm:text-sm"
        variant="body"
      >
        {t("wizard_provisional_offer:nextStepsSection.intro")}
      </Typography>
      <ol className="mb-4 list-decimal space-y-1 pl-5 text-xs text-muted-foreground sm:mb-6 sm:space-y-2 sm:text-sm">
        <li>{t("wizard_provisional_offer:nextStepsSection.item1")}</li>
        <li>{t("wizard_provisional_offer:nextStepsSection.item2")}</li>
        <li>{t("wizard_provisional_offer:nextStepsSection.item3")}</li>
        <li>{t("wizard_provisional_offer:nextStepsSection.item4")}</li>
        <li>{t("wizard_provisional_offer:nextStepsSection.item5")}</li>
      </ol>

      <div className="rounded-md bg-muted p-3 sm:p-4">
        <Typography
          className="mb-2 text-sm font-medium text-card-foreground"
          variant="h4"
        >
          {t("wizard_provisional_offer:nextStepsSection.dedicatedAdvisorTitle")}
        </Typography>
        <div className="space-y-1 text-xs sm:text-sm">
          <Typography className="text-muted-foreground" variant="body">
            Sarah Johnson
          </Typography>
          <Typography className="text-muted-foreground" variant="body">
            Telephone: 0800 123 4567
          </Typography>
          <Typography className="text-muted-foreground" variant="body">
            Email: sarah.johnson@estateflex.com
          </Typography>
        </div>
      </div>
    </div>
  )
}

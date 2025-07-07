/*eslint-disable*/

import { CircleCheckIcon } from "./FormIcons"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

export function AgeRequirementsCard() {
  const { t } = useClientTranslation([
    "wizard_seller_information",
    "wizard_common",
  ])

  return (
    <div className="mb-4 rounded-lg border border-border/60 bg-card/90 p-3 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg sm:mb-6 sm:p-4 md:p-6">
      <h3 className="mb-2 text-base font-medium text-primary sm:text-lg">
        {t("wizard_seller_information:ageRequirements.title")}
      </h3>

      <p className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
        {t("wizard_seller_information:ageRequirements.description")}
      </p>

      <div className="space-y-2 sm:space-y-3">
        <div className="group flex items-start rounded-md transition-all duration-200 hover:bg-background/40">
          <div className="shrink-0">
            <CircleCheckIcon />
          </div>
          <div className="ml-2 sm:ml-3">
            <h4 className="text-xs font-medium text-card-foreground sm:text-sm">
              {t("wizard_seller_information:ageRequirements.minimumAge.title")}
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t(
                "wizard_seller_information:ageRequirements.minimumAge.description"
              )}
            </p>
          </div>
        </div>

        <div className="group flex items-start rounded-md transition-all duration-200 hover:bg-background/40">
          <div className="shrink-0">
            <CircleCheckIcon />
          </div>
          <div className="ml-2 sm:ml-3">
            <h4 className="text-xs font-medium text-card-foreground sm:text-sm">
              {t("wizard_seller_information:ageRequirements.maximumAge.title")}
            </h4>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t(
                "wizard_seller_information:ageRequirements.maximumAge.description"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/*eslint-disable*/

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

export function NextStepsCard() {
  const { t } = useClientTranslation([
    "wizard_seller_information",
    "wizard_common",
  ])

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg sm:p-4 md:p-6">
      <h3 className="mb-3 text-base font-medium text-primary sm:mb-4 sm:text-lg">
        {t("wizard_seller_information:nextSteps.title")}
      </h3>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
            1
          </div>
          <div className="ml-2 sm:ml-3">
            <p className="text-xs text-card-foreground sm:text-sm">
              {t("wizard_seller_information:nextSteps.step1")}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
            2
          </div>
          <div className="ml-2 sm:ml-3">
            <p className="text-xs text-card-foreground sm:text-sm">
              {t("wizard_seller_information:nextSteps.step2")}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
            3
          </div>
          <div className="ml-2 sm:ml-3">
            <p className="text-xs text-card-foreground sm:text-sm">
              {t("wizard_seller_information:nextSteps.step3")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

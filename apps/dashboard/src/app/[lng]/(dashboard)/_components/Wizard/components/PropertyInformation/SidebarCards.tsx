/*eslint-disable*/

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

export function SidebarCards() {
  const { t } = useClientTranslation([
    "wizard_property_information",
    "wizard_common",
  ])

  return (
    <>
      {/* Property valuation tips */}
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg sm:p-4 md:p-6">
        <h3 className="mb-2 text-base font-medium text-primary sm:mb-4 sm:text-lg">
          {t("wizard_property_information:valuationTips.title")}
        </h3>

        <p className="mb-2 text-xs text-muted-foreground sm:text-sm">
          {t("wizard_property_information:valuationTips.description")}
        </p>

        <div className="space-y-3 sm:space-y-4">
          <div className="group flex items-start rounded-md transition-all duration-200 hover:bg-background/40">
            <div className="shrink-0">
              <svg
                className="size-5 text-primary transition-transform duration-200 group-hover:scale-110 sm:size-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <h4 className="text-xs font-medium text-card-foreground sm:text-sm">
                {t("wizard_property_information:valuationTips.tip1.title")}
              </h4>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {t(
                  "wizard_property_information:valuationTips.tip1.description"
                )}
              </p>
            </div>
          </div>

          <div className="group flex items-start rounded-md transition-all duration-200 hover:bg-background/40">
            <div className="shrink-0">
              <svg
                className="size-5 text-primary transition-transform duration-200 group-hover:scale-110 sm:size-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <h4 className="text-xs font-medium text-card-foreground sm:text-sm">
                {t("wizard_property_information:valuationTips.tip2.title")}
              </h4>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {t(
                  "wizard_property_information:valuationTips.tip2.description"
                )}
              </p>
            </div>
          </div>

          <div className="group flex items-start rounded-md transition-all duration-200 hover:bg-background/40">
            <div className="shrink-0">
              <svg
                className="size-5 text-primary transition-transform duration-200 group-hover:scale-110 sm:size-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <h4 className="text-xs font-medium text-card-foreground sm:text-sm">
                {t("wizard_property_information:valuationTips.tip3.title")}
              </h4>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {t(
                  "wizard_property_information:valuationTips.tip3.description"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-lg border border-border/60 bg-card/90 p-3 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg sm:p-4 md:p-6">
        <h3 className="mb-3 text-base font-medium text-primary sm:mb-4 sm:text-lg">
          {t("wizard_property_information:nextStepsSidebar.title")}
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
              1
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs text-card-foreground sm:text-sm">
                {t("wizard_property_information:nextStepsSidebar.step1")}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
              2
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs text-card-foreground sm:text-sm">
                {t("wizard_property_information:nextStepsSidebar.step2")}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary sm:size-8">
              3
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs text-card-foreground sm:text-sm">
                {t("wizard_property_information:nextStepsSidebar.step3")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

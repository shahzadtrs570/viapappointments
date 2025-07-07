/*eslint-disable*/

import { Checkbox } from "@package/ui/checkbox"
import { Typography } from "@package/ui/typography"
import type { SrenovaRecommendationsChecklistProps } from "./FormValidation"

export function SrenovaRecommendationsChecklist({
  localChecklist,
  readOnly,
  onChecklistChange,
  t,
}: SrenovaRecommendationsChecklistProps) {
  return (
    <div>
      <div className="mb-2 flex flex-col justify-between gap-2 sm:mb-4 sm:flex-row sm:items-center sm:gap-0">
        <Typography className="text-base sm:text-lg md:text-xl" variant="h3">
          {t("srenovaRecommendations.title")}
        </Typography>
        <div className="group relative inline-flex self-start sm:self-auto">
          <button
            className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 sm:size-8"
            type="button"
          >
            <svg
              className="size-4 text-primary sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
          <span className="absolute -top-2 right-0 z-50 w-48 -translate-y-full scale-0 rounded bg-popover p-2 text-xs text-popover-foreground transition-all duration-300 ease-in-out group-hover:scale-100 sm:w-64 sm:text-sm">
            {t("srenovaRecommendations.description")}
          </span>
        </div>
      </div>
      <Typography
        className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm"
        variant="body"
      >
        {t("srenovaRecommendations.description")}
      </Typography>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-start">
          <Checkbox
            checked={localChecklist.financialAdvisor}
            disabled={readOnly}
            id="checklist-1"
            onCheckedChange={(checked) => {
              onChecklistChange("financialAdvisor", checked === true)
            }}
          />
          <label
            className="ml-2 text-xs sm:ml-3 sm:text-sm"
            htmlFor="checklist-1"
          >
            <Typography className="text-card-foreground" variant="body">
              {t("srenovaRecommendations.checklist.financialAdvisor")}
            </Typography>
          </label>
        </div>

        <div className="flex items-start">
          <Checkbox
            checked={localChecklist.financialSituation}
            disabled={readOnly}
            id="checklist-2"
            onCheckedChange={(checked) => {
              onChecklistChange("financialSituation", checked === true)
            }}
          />
          <label
            className="ml-2 text-xs sm:ml-3 sm:text-sm"
            htmlFor="checklist-2"
          >
            <Typography className="text-card-foreground" variant="body">
              {t("srenovaRecommendations.checklist.financialSituation")}
            </Typography>
          </label>
        </div>

        <div className="flex items-start">
          <Checkbox
            checked={localChecklist.carePlans}
            disabled={readOnly}
            id="checklist-3"
            onCheckedChange={(checked) => {
              onChecklistChange("carePlans", checked === true)
            }}
          />
          <label
            className="ml-2 text-xs sm:ml-3 sm:text-sm"
            htmlFor="checklist-3"
          >
            <Typography className="text-card-foreground" variant="body">
              {t("srenovaRecommendations.checklist.carePlans")}
            </Typography>
          </label>
        </div>

        <div className="flex items-start">
          <Checkbox
            checked={localChecklist.existingMortgages}
            disabled={readOnly}
            id="checklist-4"
            onCheckedChange={(checked) => {
              onChecklistChange("existingMortgages", checked === true)
            }}
          />
          <label
            className="ml-2 text-xs sm:ml-3 sm:text-sm"
            htmlFor="checklist-4"
          >
            <Typography className="text-card-foreground" variant="body">
              {t("srenovaRecommendations.checklist.existingMortgages")}
            </Typography>
          </label>
        </div>
      </div>

      <div className="mt-3 rounded-md bg-primary/5 p-2 sm:mt-4 sm:p-3">
        <div className="flex items-start sm:items-center">
          <div className="shrink-0">
            <svg
              className="size-4 text-primary sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <div className="ml-2 sm:ml-3">
            <Typography
              className="text-xs text-card-foreground sm:text-sm"
              variant="body"
            >
              <span className="font-medium">
                {t("srenovaRecommendations.tip")}
              </span>
            </Typography>
          </div>
        </div>
      </div>

      {/* Non-binding disclaimer */}
      <div className="borderborder-secondary mt-3 rounded-md bg-secondary/10 sm:mt-4 sm:p-4">
        <div className="flex items-start">
          <div className="shrink-0">
            <svg
              className="size-4 text-secondary sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <div className="ml-2 sm:ml-3">
            <Typography
              className="text-xs text-card-foreground sm:text-sm"
              variant="body"
            >
              <span className="font-medium">
                {t("nonBindingDisclaimer.title")}:
              </span>{" "}
              {t("nonBindingDisclaimer.text")}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

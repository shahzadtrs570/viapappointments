/*eslint-disable*/

import { Checkbox } from "@package/ui/checkbox"
import { Typography } from "@package/ui/typography"
import type { KeyConsiderationsSectionProps } from "./FormValidation"

export function KeyConsiderationsSection({
  localConsiderations,
  readOnly,
  onConsiderationsChange,
  t,
}: KeyConsiderationsSectionProps) {
  return (
    <div className="mb-4 rounded-lg border border-border bg-card p-3 shadow-lg sm:mb-6 sm:p-4 md:p-6">
      <Typography
        className="mb-2 text-base text-primary sm:mb-4 sm:text-lg"
        variant="h3"
      >
        {t("keyConsiderations.title")}
      </Typography>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start">
          <Checkbox
            checked={localConsiderations.ownership}
            disabled={readOnly}
            id="consideration1"
            onCheckedChange={(checked) => {
              onConsiderationsChange("ownership", checked === true)
            }}
          />
          <label
            className="ml-2 text-xs sm:ml-3 sm:text-sm"
            htmlFor="consideration1"
          >
            <Typography className="block text-card-foreground" variant="body">
              {t("keyConsiderations.ownership.main")}
            </Typography>
            <Typography
              className="text-xs text-muted-foreground sm:text-sm"
              variant="body"
            >
              {t("keyConsiderations.ownership.sub")}
            </Typography>
          </label>
        </div>

        <div className="flex items-start">
          <Checkbox
            checked={localConsiderations.benefits}
            disabled={readOnly}
            id="consideration2"
            onCheckedChange={(checked) => {
              onConsiderationsChange("benefits", checked === true)
            }}
          />
          <label
            className="ml-2 text-xs sm:ml-3 sm:text-sm"
            htmlFor="consideration2"
          >
            <Typography className="block text-card-foreground" variant="body">
              {t("keyConsiderations.benefits.main")}
            </Typography>
            <Typography
              className="text-xs text-muted-foreground sm:text-sm"
              variant="body"
            >
              {t("keyConsiderations.benefits.sub")}
            </Typography>
          </label>
        </div>

        <div className="flex items-start">
          <Checkbox
            checked={localConsiderations.mortgage}
            disabled={readOnly}
            id="consideration3"
            onCheckedChange={(checked) => {
              onConsiderationsChange("mortgage", checked === true)
            }}
          />
          <label
            className="ml-2 text-xs sm:ml-3 sm:text-sm"
            htmlFor="consideration3"
          >
            <Typography className="block text-card-foreground" variant="body">
              {t("keyConsiderations.mortgage.main")}
            </Typography>
            <Typography
              className="text-xs text-muted-foreground sm:text-sm"
              variant="body"
            >
              {t("keyConsiderations.mortgage.sub")}
            </Typography>
          </label>
        </div>
      </div>
    </div>
  )
}

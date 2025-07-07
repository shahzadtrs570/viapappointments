/*eslint-disable*/

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Textarea } from "@package/ui/textarea"
import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { PropertyConditionInput } from "./FormValidation"

interface PropertyConditionSectionProps {
  form: any
  readOnly: boolean
  onConditionChange: (value: PropertyConditionInput) => void
  onConditionNotesChange: (value: string) => void
}

export function PropertyConditionSection({
  form,
  readOnly,
  onConditionChange,
  onConditionNotesChange,
}: PropertyConditionSectionProps) {
  const { t } = useClientTranslation([
    "wizard_property_information",
    "wizard_common",
  ])

  return (
    <div className="space-y-3 sm:space-y-4">
      <Typography
        className="border-b border-border/40 pb-1 text-lg font-semibold text-primary sm:pb-2 sm:text-xl"
        variant="h3"
      >
        Property Condition
      </Typography>

      {/* Condition */}
      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem className="space-y-2 sm:space-y-3">
            <FormLabel className="text-xs font-medium sm:text-base">
              Overall Condition
            </FormLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {[
                {
                  value: "excellent",
                  label: t(
                    "wizard_property_information:manualEntryForm.form.condition.options.excellent"
                  ),
                  emoji: "✨",
                },
                {
                  value: "good",
                  label: t(
                    "wizard_property_information:manualEntryForm.form.condition.options.good"
                  ),
                  emoji: "👍",
                },
                {
                  value: "fair",
                  label: t(
                    "wizard_property_information:manualEntryForm.form.condition.options.fair"
                  ),
                  emoji: "👌",
                },
                {
                  value: "needs_renovation",
                  label: t(
                    "wizard_property_information:manualEntryForm.form.condition.options.needs_renovation"
                  ),
                  emoji: "🔧",
                },
              ].map((condition) => (
                <button
                  key={condition.value}
                  disabled={readOnly}
                  type="button"
                  className={`flex cursor-pointer flex-col items-center rounded-md border p-2 transition-all duration-200 sm:p-3 ${
                    field.value === condition.value
                      ? "border-primary/50 bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/20 "
                  } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                  onClick={() => {
                    if (readOnly) return
                    field.onChange(condition.value)
                    onConditionChange(condition.value as PropertyConditionInput)
                  }}
                >
                  <span className="mb-1 text-lg sm:text-xl">
                    {condition.emoji}
                  </span>
                  <span
                    className={`text-center text-xs capitalize sm:text-sm ${
                      field.value === condition.value
                        ? "font-medium text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {condition.label}
                  </span>
                </button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Condition Notes */}
      <FormField
        control={form.control}
        name="conditionNotes"
        render={({ field }) => (
          <FormItem className="rounded-md border border-border/30 bg-background/30 p-3 sm:p-4">
            <FormLabel className="text-xs font-medium sm:text-sm">
              Additional Notes
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Please provide any additional information about the property's condition..."
                className={`min-h-[80px] border-border/60 bg-card text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-primary/30 sm:min-h-[100px] ${
                  readOnly
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : ""
                }`}
                {...field}
                readOnly={readOnly}
                onChange={(e) => {
                  field.onChange(e)
                  onConditionNotesChange(e.target.value)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

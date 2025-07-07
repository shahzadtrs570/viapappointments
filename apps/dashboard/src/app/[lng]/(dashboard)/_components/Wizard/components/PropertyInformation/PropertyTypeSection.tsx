/*eslint-disable*/

import { FormField, FormItem, FormLabel, FormMessage } from "@package/ui/form"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { PropertyTypeInput } from "./FormValidation"

interface PropertyTypeSectionProps {
  form: any
  readOnly: boolean
  onPropertyTypeChange: (value: PropertyTypeInput) => void
}

export function PropertyTypeSection({
  form,
  readOnly,
  onPropertyTypeChange,
}: PropertyTypeSectionProps) {
  const { t } = useClientTranslation([
    "wizard_property_information",
    "wizard_common",
  ])

  return (
    <FormField
      control={form.control}
      name="propertyType"
      render={({ field }) => (
        <FormItem className="space-y-2 sm:space-y-3">
          <FormLabel className="text-sm font-semibold text-foreground sm:text-base">
            {t(
              "wizard_property_information:manualEntryForm.form.propertyType.label"
            )}
          </FormLabel>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
            {[
              { value: "house", label: "House", icon: "🏠" },
              {
                value: "apartment",
                label: "Flat/Apartment",
                icon: "🏢",
              },
              { value: "bungalow", label: "Bungalow", icon: "🏡" },
              { value: "other", label: "Other", icon: "🏘️" },
            ].map((option) => (
              <button
                key={option.value}
                disabled={readOnly}
                type="button"
                className={`group flex cursor-pointer items-center gap-2 rounded-md border p-3 transition-all duration-200 sm:gap-3 sm:p-4 ${
                  field.value === option.value
                    ? "border-primary/50 bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/20 "
                } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                onClick={() => {
                  if (readOnly) return
                  field.onChange(option.value)
                  onPropertyTypeChange(option.value as PropertyTypeInput)
                }}
              >
                <span className="text-base group-hover:scale-110 group-hover:transition-transform sm:text-lg">
                  {option.icon}
                </span>
                <span
                  className={`text-center text-sm sm:text-base ${field.value === option.value ? "font-medium text-primary" : "text-foreground group-hover:text-primary/80"}`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

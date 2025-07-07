/*eslint-disable*/

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { PropertyStatusInput } from "./FormValidation"

interface PropertyStatusSectionProps {
  form: any
  readOnly: boolean
  showLeaseholdDetails: boolean
  onPropertyStatusChange: (value: PropertyStatusInput) => void
  onLeaseLengthChange: (value: string) => void
  setShowLeaseholdDetails: (show: boolean) => void
}

export function PropertyStatusSection({
  form,
  readOnly,
  showLeaseholdDetails,
  onPropertyStatusChange,
  onLeaseLengthChange,
  setShowLeaseholdDetails,
}: PropertyStatusSectionProps) {
  const { t } = useClientTranslation([
    "wizard_property_information",
    "wizard_common",
  ])

  return (
    <>
      {/* Property Status */}
      <FormField
        control={form.control}
        name="propertyStatus"
        render={({ field }) => (
          <FormItem className="space-y-2 sm:space-y-3">
            <FormLabel className="text-sm font-semibold text-foreground sm:text-base">
              {t(
                "wizard_property_information:manualEntryForm.form.propertyStatus.label"
              )}
            </FormLabel>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
              {[
                { value: "freehold", label: "Freehold", icon: "🔑" },
                {
                  value: "leasehold",
                  label: "Leasehold",
                  icon: "📄",
                },
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
                    setShowLeaseholdDetails(option.value === "leasehold")
                    onPropertyStatusChange(option.value as PropertyStatusInput)
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

      {/* Lease Length (conditional) */}
      {showLeaseholdDetails && (
        <FormField
          control={form.control}
          name="leaseLength"
          render={({ field }) => (
            <FormItem className="rounded-md border border-border/50 bg-background/50 p-3 shadow-sm sm:p-4">
              <FormLabel className="text-xs font-medium text-foreground sm:text-sm">
                {t(
                  "wizard_property_information:manualEntryForm.form.leaseLength.label"
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  readOnly={readOnly}
                  className={`border-border text-sm focus:border-primary/50 focus:ring-primary/50 ${
                    readOnly
                      ? "cursor-not-allowed bg-muted text-muted-foreground"
                      : ""
                  }`}
                  onChange={(e) => {
                    field.onChange(e)
                    onLeaseLengthChange(e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  )
}

/*eslint-disable*/

import { FormControl, FormField, FormItem, FormMessage } from "@package/ui/form"
import { cn } from "@package/utils"
import { User, Users } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { SellerInfoData } from "./FormValidation"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface OwnerTypeSelectionProps {
  form: UseFormReturn<SellerInfoData>
  ownerType: "single" | "couple" | "multiple"
  onOwnerTypeChange: (value: "single" | "couple" | "multiple") => void
}

export function OwnerTypeSelection({
  form,
  ownerType,
  onOwnerTypeChange,
}: OwnerTypeSelectionProps) {
  const { t } = useClientTranslation([
    "wizard_seller_information",
    "wizard_common",
  ])

  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      <h3 className="mb-3 text-base font-medium text-card-foreground sm:mb-4 sm:text-lg">
        {t("wizard_seller_information:ownershipSection.title")}
      </h3>

      <div className="mb-4 sm:mb-6">
        <FormField
          control={form.control}
          name="ownerType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
                  {[
                    {
                      value: "single",
                      icon: User,
                      labelKey:
                        "wizard_seller_information:ownershipSection.ownerType.single.label",
                      descriptionKey:
                        "wizard_seller_information:ownershipSection.ownerType.single.description",
                    },
                    {
                      value: "couple",
                      icon: Users,
                      labelKey:
                        "wizard_seller_information:ownershipSection.ownerType.couple.label",
                      descriptionKey:
                        "wizard_seller_information:ownershipSection.ownerType.couple.description",
                    },
                    {
                      value: "multiple",
                      icon: Users,
                      labelKey:
                        "wizard_seller_information:ownershipSection.ownerType.multiple.label",
                      descriptionKey:
                        "wizard_seller_information:ownershipSection.ownerType.multiple.description",
                    },
                  ].map((option) => {
                    const IconComponent = option.icon
                    return (
                      <div
                        key={option.value}
                        aria-checked={field.value === option.value}
                        role="radio"
                        tabIndex={0}
                        className={cn(
                          "cursor-pointer rounded-lg border bg-card p-3 sm:p-4 md:p-6 text-center transition-all hover:shadow-lg",
                          field.value === option.value
                            ? "border-primary ring-2 ring-primary shadow-lg"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => {
                          field.onChange(option.value)
                          onOwnerTypeChange(
                            option.value as "single" | "couple" | "multiple"
                          )
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            field.onChange(option.value)
                            onOwnerTypeChange(
                              option.value as "single" | "couple" | "multiple"
                            )
                          }
                        }}
                      >
                        <IconComponent className="mx-auto mb-2 size-6 text-primary sm:mb-3 sm:size-7" />
                        <span className="mb-1 block text-xs font-semibold text-card-foreground sm:text-sm">
                          {t(option.labelKey)}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {t(option.descriptionKey)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

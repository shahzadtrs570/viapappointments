/*eslint-disable*/

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import type { UseFormReturn } from "react-hook-form"
import type { SellerInfoData } from "./FormValidation"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface NumberOfOwnersSelectProps {
  form: UseFormReturn<SellerInfoData>
  numberOfMultipleOwners: number
  onNumberOfOwnersChange: (value: string) => void
  setStoredOwnersCount: (count: number) => void
  setNumberOfMultipleOwners: (count: number) => void
}

export function NumberOfOwnersSelect({
  form,
  numberOfMultipleOwners,
  onNumberOfOwnersChange,
  setStoredOwnersCount,
  setNumberOfMultipleOwners,
}: NumberOfOwnersSelectProps) {
  const { t } = useClientTranslation([
    "wizard_seller_information",
    "wizard_common",
  ])

  return (
    <div className="mb-4 sm:mb-6">
      <FormField
        control={form.control}
        name="numberOfOwners"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="block text-xs font-medium text-card-foreground sm:text-sm">
              {t(
                "wizard_seller_information:ownershipSection.numberOfOwnersLabel"
              )}
            </FormLabel>
            <FormControl>
              <select
                className="mt-1 block w-full rounded-md border border-border/50 bg-background/80 px-2 py-1 text-sm shadow-sm transition-colors hover:border-primary/30 focus:border-primary/50 focus:outline-none focus:ring-primary/30 sm:px-3 sm:py-2"
                value={numberOfMultipleOwners || field.value}
                onChange={(e) => {
                  const num = parseInt(e.target.value)
                  field.onChange(num)
                  setStoredOwnersCount(num)
                  setNumberOfMultipleOwners(num)
                  onNumberOfOwnersChange(e.target.value)
                }}
              >
                {[2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </FormControl>
            <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
              {t(
                "wizard_seller_information:ownershipSection.numberOfOwnersDescription"
              )}
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

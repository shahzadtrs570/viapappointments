/*eslint-disable*/

import { Button } from "@package/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"
import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface PropertyLocationSectionProps {
  form: any
  readOnly: boolean
  onAddressChange: (value: string) => void
  onPostcodeChange: (value: string) => void
  onTownChange: (value: string) => void
  onCountyChange: (value: string) => void
  onSwitchToAddressSearch: () => void
}

export function PropertyLocationSection({
  form,
  readOnly,
  onAddressChange,
  onPostcodeChange,
  onTownChange,
  onCountyChange,
  onSwitchToAddressSearch,
}: PropertyLocationSectionProps) {
  const { t } = useClientTranslation([
    "wizard_property_information",
    "wizard_common",
  ])

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
        <Typography
          className="text-sm font-semibold text-foreground sm:text-base"
          variant="h3"
        >
          {t("wizard_property_information:manualEntryForm.locationTitle")}
        </Typography>
        <Button
          className="relative flex w-full items-center justify-center gap-1 text-xs font-medium text-primary hover:bg-transparent hover:text-primary sm:w-auto sm:justify-start sm:text-sm"
          type="button"
          variant="ghost"
          onClick={onSwitchToAddressSearch}
        >
          <svg
            className="size-3 sm:size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
            Search by postcode
          </span>
        </Button>
      </div>

      {/* Address */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs sm:text-sm">
              {t(
                "wizard_property_information:manualEntryForm.form.address.label"
              )}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                readOnly={readOnly}
                value={field.value}
                className={`${
                  readOnly
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : ""
                } text-sm`}
                placeholder={t(
                  "wizard_property_information:manualEntryForm.form.address.placeholder"
                )}
                onChange={(e) => {
                  field.onChange(e)
                  onAddressChange(e.target.value)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Postcode */}
      <FormField
        control={form.control}
        name="postcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs sm:text-sm">
              {t(
                "wizard_property_information:manualEntryForm.form.postcode.label"
              )}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                readOnly={readOnly}
                value={field.value || ""}
                className={`${
                  readOnly
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : ""
                } text-sm`}
                onChange={(e) => {
                  field.onChange(e)
                  onPostcodeChange(e.target.value)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Town/City */}
      <FormField
        control={form.control}
        name="town"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs sm:text-sm">
              {t(
                "wizard_property_information:manualEntryForm.form.townCity.label"
              )}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                readOnly={readOnly}
                value={field.value || ""}
                className={`${
                  readOnly
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : ""
                } text-sm`}
                onChange={(e) => {
                  field.onChange(e)
                  onTownChange(e.target.value)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* County */}
      <FormField
        control={form.control}
        name="county"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs sm:text-sm">
              {t(
                "wizard_property_information:manualEntryForm.form.county.label"
              )}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                readOnly={readOnly}
                value={field.value || ""}
                className={`${
                  readOnly
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : ""
                } text-sm`}
                onChange={(e) => {
                  field.onChange(e)
                  onCountyChange(e.target.value)
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

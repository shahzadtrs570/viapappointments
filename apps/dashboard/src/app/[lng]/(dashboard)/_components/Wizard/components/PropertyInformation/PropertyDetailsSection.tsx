/*eslint-disable*/

import { Checkbox } from "@package/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import { convertSqMeterToSqFeet, convertSqFeetToSqMeter } from "./FormHelpers"
import type {
  BedroomCountInput,
  BathroomCountInput,
  PropertyFeatureInput,
} from "./FormValidation"

interface PropertyDetailsSectionProps {
  form: any
  readOnly: boolean
  propertySizeSqFt: string
  setPropertySizeSqFt: (value: string) => void
  onBedroomsChange: (value: BedroomCountInput) => void
  onBathroomsChange: (value: BathroomCountInput) => void
  onYearBuiltChange: (value: string) => void
  onPropertySizeChange: (value: string) => void
  onEstimatedValueChange: (value: string) => void
  onFeatureAdd: (feature: PropertyFeatureInput) => void
  onFeatureRemove: (feature: PropertyFeatureInput) => void
  manualAddressData: Record<string, unknown> | null
  updateManualAddressData: (field: string, value: string | string[]) => void
}

export function PropertyDetailsSection({
  form,
  readOnly,
  propertySizeSqFt,
  setPropertySizeSqFt,
  onBedroomsChange,
  onBathroomsChange,
  onYearBuiltChange,
  onPropertySizeChange,
  onEstimatedValueChange,
  onFeatureAdd,
  onFeatureRemove,
  manualAddressData,
  updateManualAddressData,
}: PropertyDetailsSectionProps) {
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
        {t("wizard_property_information:manualEntryForm.detailsTitle")}
      </Typography>

      {/* Estimated Value and Year Built in a grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {/* Estimated Value */}
        <FormField
          control={form.control}
          name="estimatedValue"
          render={({ field }) => (
            <FormItem className="rounded-md bg-card p-2 transition-all duration-200  sm:p-3">
              <FormLabel className="text-xs font-medium sm:text-sm">
                {t(
                  "wizard_property_information:manualEntryForm.form.estimatedValue.label"
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 250,000"
                  type="text"
                  {...field}
                  readOnly={readOnly}
                  className={`${
                    readOnly
                      ? "cursor-not-allowed bg-muted text-muted-foreground"
                      : ""
                  } border-border/60 text-sm shadow-sm transition-all duration-200 focus:border-primary/60 focus:ring-primary/30`}
                  value={
                    field.value ? Number(field.value).toLocaleString() : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^0-9]/g, "")
                    field.onChange(rawValue)
                    onEstimatedValueChange(rawValue)
                    if (rawValue) {
                      const formattedValue = Number(rawValue).toLocaleString()
                      e.target.value = formattedValue
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearBuilt"
          render={({ field }) => (
            <FormItem className="rounded-md bg-card p-2 transition-all duration-200  sm:p-3">
              <FormLabel className="text-xs font-medium sm:text-sm">
                {t(
                  "wizard_property_information:manualEntryForm.form.yearBuilt.label"
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className={`${
                    readOnly
                      ? "cursor-not-allowed bg-muted text-muted-foreground"
                      : ""
                  } border-border/60 text-sm shadow-sm transition-all duration-200 focus:border-primary/60 focus:ring-primary/30`}
                  {...field}
                  readOnly={readOnly}
                  onChange={(e) => {
                    field.onChange(e)
                    onYearBuiltChange(e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Bedrooms and Bathrooms in a grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {/* Bedrooms */}
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem className="rounded-md bg-card p-2 transition-all duration-200  sm:p-3">
              <FormLabel className="text-xs font-medium sm:text-sm">
                {t(
                  "wizard_property_information:manualEntryForm.form.bedrooms.label"
                )}
              </FormLabel>
              <Select
                defaultValue={field.value}
                disabled={readOnly}
                value={field.value}
                onValueChange={(value) => {
                  if (readOnly) return
                  field.onChange(value)
                  onBedroomsChange(value as BedroomCountInput)
                }}
              >
                <FormControl>
                  <SelectTrigger
                    className={`border-border/60 bg-background/50 text-sm shadow-sm ${
                      readOnly
                        ? "cursor-not-allowed bg-muted text-muted-foreground"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select number of bedrooms" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["1", "2", "3", "4", "5+"].map((num) => (
                    <SelectItem key={num} className="text-sm" value={num}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bathrooms */}
        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem className="rounded-md bg-card p-2 transition-all duration-200  sm:p-3">
              <FormLabel className="text-xs font-medium sm:text-sm">
                {t(
                  "wizard_property_information:manualEntryForm.form.bathrooms.label"
                )}
              </FormLabel>
              <Select
                defaultValue={field.value}
                disabled={readOnly}
                value={field.value}
                onValueChange={(value) => {
                  if (readOnly) return
                  field.onChange(value)
                  onBathroomsChange(value as BathroomCountInput)
                }}
              >
                <FormControl>
                  <SelectTrigger
                    className={`border-border/60 bg-background/50 text-sm shadow-sm ${
                      readOnly
                        ? "cursor-not-allowed bg-muted text-muted-foreground"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select number of bathrooms" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["1", "2", "3+"].map((num) => (
                    <SelectItem key={num} className="text-sm" value={num}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Property Size in a grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {/* Property Size (sq meters) */}
        <FormField
          control={form.control}
          name="propertySize"
          render={({ field }) => (
            <FormItem className="rounded-md bg-card p-2 transition-all duration-200  sm:p-3">
              <FormLabel className="text-xs font-medium sm:text-sm">
                {t(
                  "wizard_property_information:manualEntryForm.form.propertySize.label"
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className={`${
                    readOnly
                      ? "cursor-not-allowed bg-muted text-muted-foreground"
                      : ""
                  } border-border/60 text-sm shadow-sm transition-all duration-200 focus:border-primary/60 focus:ring-primary/30`}
                  {...field}
                  readOnly={readOnly}
                  onChange={(e) => {
                    field.onChange(e)
                    onPropertySizeChange(e.target.value)
                    if (e.target.value) {
                      const sqFt = convertSqMeterToSqFeet(
                        Number(e.target.value)
                      )
                      setPropertySizeSqFt(sqFt.toString())
                    } else {
                      setPropertySizeSqFt("")
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Property Size (sq feet) */}
        <div className="rounded-md bg-card p-2 transition-all duration-200 sm:p-3">
          <div className="mb-2 text-xs font-medium sm:text-sm">
            {t(
              "wizard_property_information:manualEntryForm.form.propertySizeFt.label"
            )}
          </div>
          <Input
            readOnly={readOnly}
            type="number"
            value={propertySizeSqFt}
            className={`${
              readOnly
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : ""
            } border-border/60 text-sm shadow-sm transition-all duration-200 focus:border-primary/60 focus:ring-primary/30`}
            onChange={(e) => {
              const sqFtValue = e.target.value
              setPropertySizeSqFt(sqFtValue)
              if (sqFtValue) {
                const sqMeters = convertSqFeetToSqMeter(Number(sqFtValue))
                const roundedSqMeters = Math.round(sqMeters * 100) / 100
                form.setValue("propertySize", roundedSqMeters.toString(), {
                  shouldValidate: true,
                  shouldDirty: true,
                })
                onPropertySizeChange(roundedSqMeters.toString())
              } else {
                form.setValue("propertySize", "", {
                  shouldValidate: true,
                  shouldDirty: true,
                })
                onPropertySizeChange("")
              }
            }}
          />
        </div>
      </div>

      {/* Features */}
      <FormField
        control={form.control}
        name="features"
        render={() => (
          <FormItem className="rounded-md border border-border/30 bg-background/30 p-3 shadow-sm sm:p-4">
            <FormLabel className="mb-1 block text-xs font-medium text-foreground sm:mb-2 sm:text-base">
              {t(
                "wizard_property_information:manualEntryForm.form.features.label",
                "Property Features"
              )}
            </FormLabel>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
              {[
                {
                  id: "garden",
                  label: t(
                    "wizard_property_information:manualEntryForm.form.features.options.garden"
                  ),
                  icon: "🌳",
                },
                {
                  id: "garage",
                  label: t(
                    "wizard_property_information:manualEntryForm.form.features.options.garage"
                  ),
                  icon: "🚗",
                },
                {
                  id: "parking",
                  label: t(
                    "wizard_property_information:manualEntryForm.form.features.options.parking"
                  ),
                  icon: "🅿️",
                },
                {
                  id: "central-heating",
                  label: t(
                    "wizard_property_information:manualEntryForm.form.features.options.centralHeating"
                  ),
                  icon: "🔥",
                },
                {
                  id: "double-glazing",
                  label: t(
                    "wizard_property_information:manualEntryForm.form.features.options.doubleGlazing"
                  ),
                  icon: "🪟",
                },
                {
                  id: "conservatory",
                  label: t(
                    "wizard_property_information:manualEntryForm.form.features.options.conservatory"
                  ),
                  icon: "🏠",
                },
              ].map((feature) => (
                <FormField
                  key={feature.id}
                  control={form.control}
                  name="features"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={feature.id}
                        className="flex flex-row items-center space-x-2 space-y-0 rounded-md border border-border/20 bg-card p-2 shadow-sm transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 sm:space-x-3 sm:p-3"
                      >
                        <FormControl>
                          <Checkbox
                            className="border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                            disabled={readOnly}
                            checked={field.value.includes(
                              feature.label as PropertyFeatureInput
                            )}
                            onCheckedChange={(checked) => {
                              if (readOnly) return
                              const newValue = checked
                                ? [
                                    ...field.value,
                                    feature.label as PropertyFeatureInput,
                                  ]
                                : field.value.filter(
                                    (value: PropertyFeatureInput) =>
                                      value !== feature.label
                                  )
                              field.onChange(newValue)
                              if (checked) {
                                onFeatureAdd(
                                  feature.label as PropertyFeatureInput
                                )
                                // Update features in manual address data
                                const currentFeatures =
                                  manualAddressData?.features || []
                                updateManualAddressData("features", [
                                  ...(Array.isArray(currentFeatures)
                                    ? currentFeatures
                                    : []),
                                  feature.label,
                                ])
                              } else {
                                onFeatureRemove(
                                  feature.label as PropertyFeatureInput
                                )
                                // Remove feature from manual address data
                                const currentFeatures =
                                  manualAddressData?.features || []
                                updateManualAddressData(
                                  "features",
                                  Array.isArray(currentFeatures)
                                    ? currentFeatures.filter(
                                        (f: string) => f !== feature.label
                                      )
                                    : []
                                )
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="flex cursor-pointer items-center gap-1 text-xs font-normal sm:gap-2 sm:text-sm">
                          <span className="text-sm sm:text-base">
                            {feature.icon}
                          </span>
                          {feature.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}

/*eslint-disable*/

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"
import type { UseFormReturn } from "react-hook-form"
import type { SellerInfoData, FormOwner } from "./FormValidation"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface OwnerInformationFormProps {
  form: UseFormReturn<SellerInfoData>
  owners: FormOwner[]
  readOnly?: boolean
  onFieldChange: (index: number, field: keyof FormOwner, value: string) => void
}

export function OwnerInformationForm({
  form,
  owners,
  readOnly = false,
  onFieldChange,
}: OwnerInformationFormProps) {
  const { t } = useClientTranslation([
    "wizard_seller_information",
    "wizard_common",
  ])

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8" id="owners-container">
      {owners.map((owner: FormOwner, index: number) => (
        <div
          key={index}
          className="owner-section rounded-lg border border-border/50 bg-card/80 p-3 shadow-sm transition-all duration-300 hover:shadow-md sm:p-4 md:p-6"
        >
          <div className="mb-3 flex items-center justify-between sm:mb-4 md:mb-6">
            <h3 className="text-base font-medium text-primary sm:text-lg">
              {t("wizard_seller_information:ownerDetailsSection.title")}{" "}
              {index + 1}
            </h3>
          </div>

          {/* Personal Information */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h4 className="sm:text-md mb-3 flex items-center text-sm font-medium text-card-foreground sm:mb-4">
              <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-primary/10 sm:size-6">
                <svg
                  className="size-3 text-primary sm:size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              {t(
                "wizard_seller_information:ownerDetailsSection.personalDetailsTitle"
              )}
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6">
              <FormField
                control={form.control}
                name={`owners.${index}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-card-foreground sm:text-sm">
                      {t(
                        "wizard_seller_information:ownerDetailsSection.form.firstName.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={readOnly}
                        className={`${
                          readOnly
                            ? "cursor-not-allowed bg-muted text-muted-foreground"
                            : ""
                        } border-border/50 bg-background/80 text-sm transition-colors hover:border-primary/30 focus:border-primary/50`}
                        onChange={(e) => {
                          field.onChange(e)
                          onFieldChange(index, "firstName", e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`owners.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-card-foreground sm:text-sm">
                      {t(
                        "wizard_seller_information:ownerDetailsSection.form.lastName.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={readOnly}
                        className={`${
                          readOnly
                            ? "cursor-not-allowed bg-muted text-muted-foreground"
                            : ""
                        } border-border/50 bg-background/80 text-sm transition-colors hover:border-primary/30 focus:border-primary/50`}
                        onChange={(e) => {
                          field.onChange(e)
                          onFieldChange(index, "lastName", e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-3 sm:mt-4">
              <FormField
                control={form.control}
                name={`owners.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-card-foreground sm:text-sm">
                      {t(
                        "wizard_seller_information:ownerDetailsSection.form.email.label",
                        "Email Address"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={readOnly}
                        type="email"
                        className={`${
                          readOnly
                            ? "cursor-not-allowed bg-muted text-muted-foreground"
                            : ""
                        } border-border/50 bg-background/80 text-sm transition-colors hover:border-primary/30 focus:border-primary/50`}
                        onChange={(e) => {
                          field.onChange(e)
                          onFieldChange(index, "email", e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-3 sm:mt-4">
              <FormField
                control={form.control}
                name={`owners.${index}.dateOfBirth`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-card-foreground sm:text-sm">
                      {t(
                        "wizard_seller_information:ownerDetailsSection.form.dateOfBirth.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="date"
                          {...field}
                          placeholder="mm/dd/yyyy"
                          readOnly={readOnly}
                          className={`${
                            readOnly
                              ? "cursor-not-allowed bg-muted text-muted-foreground"
                              : ""
                          } border-border/50 bg-background/80 text-sm transition-colors hover:border-primary/30 focus:border-primary/50 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100`}
                          value={field.value ? field.value.split("T")[0] : ""}
                          onChange={(e) => {
                            field.onChange(e)
                            onFieldChange(index, "dateOfBirth", e.target.value)
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

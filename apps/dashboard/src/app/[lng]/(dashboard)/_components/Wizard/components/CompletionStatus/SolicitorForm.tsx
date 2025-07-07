/*eslint-disable*/

import { Button } from "@package/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"
import { Textarea } from "@package/ui/textarea"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { UseFormReturn } from "react-hook-form"
import type { SolicitorFormData } from "./FormValidation"

interface SolicitorFormProps {
  form: UseFormReturn<SolicitorFormData>
  onSubmit: () => void
  onCancel: () => void
  onDelete?: () => void
  isSaving: boolean
  isDeleting: boolean
  showDeleteButton: boolean
  hasSolicitor: boolean
}

export function SolicitorForm({
  form,
  onSubmit,
  onCancel,
  onDelete,
  isSaving,
  isDeleting,
  showDeleteButton,
  hasSolicitor,
}: SolicitorFormProps) {
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  return (
    <div id="solicitor-details-form">
      <div className="rounded-lg border border-border bg-card p-3 sm:p-6">
        <Form {...(form as any)}>
          <form
            className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
            onSubmit={onSubmit}
          >
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1 block text-xs font-medium text-card-foreground sm:mb-2 sm:text-sm">
                    {t(
                      "wizard_completion_status:solicitorDetails.form.solicitorName.label"
                    )}{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:px-3 sm:py-2 sm:text-sm"
                      placeholder={t(
                        "wizard_completion_status:solicitorDetails.form.solicitorName.placeholder"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="firmName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1 block text-xs font-medium text-card-foreground sm:mb-2 sm:text-sm">
                    {t(
                      "wizard_completion_status:solicitorDetails.form.firmName.label"
                    )}{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:px-3 sm:py-2 sm:text-sm"
                      placeholder={t(
                        "wizard_completion_status:solicitorDetails.form.firmName.placeholder"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1 block text-xs font-medium text-card-foreground sm:mb-2 sm:text-sm">
                    {t(
                      "wizard_completion_status:solicitorDetails.form.email.label"
                    )}{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:px-3 sm:py-2 sm:text-sm"
                      type="email"
                      placeholder={t(
                        "wizard_completion_status:solicitorDetails.form.email.placeholder"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1 block text-xs font-medium text-card-foreground sm:mb-2 sm:text-sm">
                    {t(
                      "wizard_completion_status:solicitorDetails.form.phone.label"
                    )}{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:px-3 sm:py-2 sm:text-sm"
                      type="tel"
                      placeholder={t(
                        "wizard_completion_status:solicitorDetails.form.phone.placeholder"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel className="mb-1 block text-xs font-medium text-card-foreground sm:mb-2 sm:text-sm">
                    {t(
                      "wizard_completion_status:solicitorDetails.form.address.label"
                    )}{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:px-3 sm:py-2 sm:text-sm"
                      rows={3}
                      placeholder={t(
                        "wizard_completion_status:solicitorDetails.form.address.placeholder"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <div className="col-span-1 mt-3 flex flex-col justify-between gap-3 sm:mt-4 sm:flex-row sm:gap-0 md:col-span-2">
              {showDeleteButton && onDelete && (
                <Button
                  className="h-auto py-1 text-xs sm:py-2 sm:text-sm"
                  disabled={isDeleting}
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="mr-1.5 size-3 animate-spin sm:mr-2 sm:size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    t(
                      "wizard_completion_status:solicitorDetails.form.buttons.delete"
                    )
                  )}
                </Button>
              )}
              <div
                className={`flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0 ${!hasSolicitor ? "w-full sm:justify-end" : ""}`}
              >
                <Button
                  className="h-auto py-1 text-xs sm:py-2 sm:text-sm"
                  id="cancel-solicitor-btn"
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  {t(
                    "wizard_completion_status:solicitorDetails.form.buttons.cancel"
                  )}
                </Button>
                <Button
                  className="h-auto py-1 text-xs sm:py-2 sm:text-sm"
                  disabled={isSaving}
                  id="save-solicitor-btn"
                  type="submit"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="mr-1.5 size-3 animate-spin sm:mr-2 sm:size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        />
                      </svg>
                      {t("wizard_property_information:buttons.saving")}
                    </>
                  ) : (
                    t(
                      "wizard_completion_status:solicitorDetails.form.buttons.save"
                    )
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

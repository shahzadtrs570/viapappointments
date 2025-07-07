/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { UseFormReturn } from "react-hook-form"
import type { SolicitorFormData } from "./FormValidation"

interface SavedSolicitorDetailsProps {
  form: UseFormReturn<SolicitorFormData>
  showSavedSolicitorDetails: boolean
  showSolicitorForm: boolean
  onEditSolicitorDetails: () => void
}

export function SavedSolicitorDetails({
  form,
  showSavedSolicitorDetails,
  showSolicitorForm,
  onEditSolicitorDetails,
}: SavedSolicitorDetailsProps) {
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  if (!showSavedSolicitorDetails || showSolicitorForm) {
    return null
  }

  return (
    <div id="saved-solicitor-details">
      <div className="rounded-lg border border-border bg-card p-3 sm:p-6">
        <div className="mb-3 flex flex-col justify-between gap-2 sm:mb-4 sm:flex-row sm:items-center sm:gap-0">
          <Typography
            className="text-base font-medium text-card-foreground sm:text-lg"
            variant="h4"
          >
            {t("wizard_completion_status:solicitorDetails.savedDetails.title")}
          </Typography>
          <button
            className="flex items-center self-start text-xs text-primary hover:text-primary/80 sm:self-auto sm:text-sm"
            id="edit-solicitor-btn"
            onClick={onEditSolicitorDetails}
          >
            <svg
              className="mr-1 size-3 sm:size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            {t(
              "wizard_completion_status:solicitorDetails.savedDetails.editButton"
            )}
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <Typography
                className="mb-1 text-xs font-medium text-muted-foreground sm:text-sm"
                variant="h4"
              >
                {t(
                  "wizard_completion_status:solicitorDetails.savedDetails.nameLabel"
                )}
              </Typography>
              <Typography
                className="text-sm text-card-foreground sm:text-base"
                variant="body"
              >
                {form.getValues().name as string}
              </Typography>
            </div>
            <div>
              <Typography
                className="mb-1 text-xs font-medium text-muted-foreground sm:text-sm"
                variant="h4"
              >
                {t(
                  "wizard_completion_status:solicitorDetails.savedDetails.firmLabel"
                )}
              </Typography>
              <Typography
                className="text-sm text-card-foreground sm:text-base"
                variant="body"
              >
                {form.getValues().firmName as string}
              </Typography>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <Typography
                className="mb-1 text-xs font-medium text-muted-foreground sm:text-sm"
                variant="h4"
              >
                {t(
                  "wizard_completion_status:solicitorDetails.savedDetails.emailLabel"
                )}
              </Typography>
              <Typography
                className="break-words text-sm text-card-foreground sm:text-base"
                variant="body"
              >
                {form.getValues().email as string}
              </Typography>
            </div>
            <div>
              <Typography
                className="mb-1 text-xs font-medium text-muted-foreground sm:text-sm"
                variant="h4"
              >
                {t(
                  "wizard_completion_status:solicitorDetails.savedDetails.phoneLabel"
                )}
              </Typography>
              <Typography
                className="text-sm text-card-foreground sm:text-base"
                variant="body"
              >
                {form.getValues().phone as string}
              </Typography>
            </div>
          </div>
          <div>
            <Typography
              className="mb-1 text-xs font-medium text-muted-foreground sm:text-sm"
              variant="h4"
            >
              {t(
                "wizard_completion_status:solicitorDetails.savedDetails.addressLabel"
              )}
            </Typography>
            <Typography
              className="text-sm text-card-foreground sm:text-base"
              variant="body"
            >
              {form.getValues().address as string}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

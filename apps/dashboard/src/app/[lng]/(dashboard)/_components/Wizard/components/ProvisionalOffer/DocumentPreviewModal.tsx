/*eslint-disable*/

import { X } from "lucide-react"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { DocumentPreviewModalProps } from "./FormValidation"

export function DocumentPreviewModal({
  onClose,
  documentUrl,
  documentName,
}: DocumentPreviewModalProps) {
  const { t } = useClientTranslation(["wizard_provisional_offer"])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-4xl rounded-lg bg-card p-4 shadow-xl sm:p-6">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h3 className="text-base font-semibold text-card-foreground sm:text-xl">
            {documentName ||
              t(
                "wizard_provisional_offer:documentPreview.title",
                "Document Preview"
              )}
          </h3>
          <button
            className="text-muted-foreground hover:text-card-foreground"
            onClick={onClose}
          >
            <X className="size-4 sm:size-5" />
          </button>
        </div>

        <div className="h-[70vh] w-full overflow-hidden rounded border border-border">
          <iframe
            className="size-full"
            src={documentUrl}
            title={documentName || "Document Preview"}
          />
        </div>
      </div>
    </div>
  )
}

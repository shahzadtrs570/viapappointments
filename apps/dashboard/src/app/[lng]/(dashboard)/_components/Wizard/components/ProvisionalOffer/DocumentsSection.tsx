/*eslint-disable*/

import { Skeleton } from "@package/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { AlertCircle } from "lucide-react"
import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { DocumentPreview } from "./FormValidation"

interface DocumentsSectionProps {
  isLoadingOfferDocument: boolean
  offerDocumentError: string | null
  offerDocument: any
  onSetDocumentPreview: (preview: DocumentPreview) => void
}

export function DocumentsSection({
  isLoadingOfferDocument,
  offerDocumentError,
  offerDocument,
  onSetDocumentPreview,
}: DocumentsSectionProps) {
  const { t } = useClientTranslation(["wizard_provisional_offer"])

  return (
    <div className="mb-4 rounded-lg border border-border bg-card p-3 sm:mb-8 sm:p-6">
      <Typography
        className="mb-3 text-base font-semibold text-card-foreground sm:mb-4 sm:text-lg"
        variant="h4"
      >
        {t(
          "wizard_provisional_offer:agreement.documents.title",
          "Important Documents"
        )}
      </Typography>

      {isLoadingOfferDocument ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : offerDocumentError ? (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error Loading Documents</AlertTitle>
          <AlertDescription>{offerDocumentError}</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {/* Display only offer document if available */}
          {offerDocument?.urlPath ? (
            <div className="flex items-center justify-between rounded-md border border-border bg-background p-2 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                  <svg
                    className="size-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    Provisional Offer Document
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {offerDocument.offerData
                      ? new Date(offerDocument.offerData).toLocaleDateString()
                      : "No date"}
                    {" • "}Expires:{" "}
                    {offerDocument.expirationDate
                      ? new Date(
                          offerDocument.expirationDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-card-foreground"
                  title="Open in new window"
                  onClick={() => window.open(offerDocument.urlPath, "_blank")}
                >
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </button>
                <button
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-card-foreground"
                  title="Preview"
                  onClick={() =>
                    onSetDocumentPreview({
                      url: offerDocument.urlPath,
                      name: "Provisional Offer Document",
                      isOpen: true,
                    })
                  }
                >
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                    <path
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No offer document available
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

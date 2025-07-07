/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { Document } from "./FormValidation"

interface DocumentChecklistSectionProps {
  documentChecklist: Document[] | null
  isLoadingDashboardStatus: boolean
  dashboardStatusError: string | null
}

export function DocumentChecklistSection({
  documentChecklist,
  isLoadingDashboardStatus,
  dashboardStatusError,
}: DocumentChecklistSectionProps) {
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  return (
    <div className="mb-6 sm:mb-8">
      <Typography
        className="mb-3 text-base font-medium text-card-foreground sm:mb-4 sm:text-lg"
        variant="h3"
      >
        {t("wizard_completion_status:documentChecklist.title")}
      </Typography>
      <Typography
        className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm"
        variant="body"
      >
        {t("wizard_completion_status:documentChecklist.description")}
      </Typography>

      <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        <div className="min-w-[640px] sm:min-w-0">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th
                    className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:px-6 sm:py-3 sm:text-xs"
                    scope="col"
                  >
                    {t(
                      "wizard_completion_status:documentChecklist.headers.document"
                    )}
                  </th>
                  <th
                    className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:px-6 sm:py-3 sm:text-xs"
                    scope="col"
                  >
                    {t(
                      "wizard_completion_status:documentChecklist.headers.status"
                    )}
                  </th>
                  <th
                    className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:px-6 sm:py-3 sm:text-xs"
                    scope="col"
                  >
                    {t(
                      "wizard_completion_status:documentChecklist.headers.date"
                    )}
                  </th>
                  <th
                    className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:px-6 sm:py-3 sm:text-xs"
                    scope="col"
                  >
                    {t(
                      "wizard_completion_status:documentChecklist.headers.action"
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {isLoadingDashboardStatus ? (
                  <tr>
                    <td className="py-8 text-center" colSpan={4}>
                      <div className="flex justify-center">
                        <div className="size-12 animate-spin rounded-full border-t-4 border-primary" />
                      </div>
                    </td>
                  </tr>
                ) : dashboardStatusError ? (
                  <tr>
                    <td
                      className="bg-red-100 py-4 text-center text-red-700"
                      colSpan={4}
                    >
                      {dashboardStatusError}
                    </td>
                  </tr>
                ) : documentChecklist && documentChecklist.length > 0 ? (
                  documentChecklist.map((document, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-3 py-2 text-xs font-medium text-card-foreground sm:px-6 sm:py-4 sm:text-sm">
                        {document.documentName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 sm:px-6 sm:py-4">
                        <span className="inline-flex rounded-full bg-primary/10 px-2 text-[10px] font-semibold leading-5 text-primary sm:text-xs">
                          {document.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
                        {document.date || "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs sm:px-6 sm:py-4 sm:text-sm">
                        {document.action ? (
                          <a
                            className="text-primary hover:text-primary/80"
                            href={document.documentLink || "#"}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {document.action}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-4 text-center text-muted-foreground"
                      colSpan={4}
                    >
                      No documents available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { KeyContacts } from "./FormValidation"

interface KeyContactsSectionProps {
  keyContacts: KeyContacts | null
  isLoadingDashboardStatus: boolean
  dashboardStatusError: string | null
}

export function KeyContactsSection({
  keyContacts,
  isLoadingDashboardStatus,
  dashboardStatusError,
}: KeyContactsSectionProps) {
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  return (
    <div className="mb-8">
      <Typography
        className="mb-4 text-lg font-medium text-card-foreground"
        variant="h3"
      >
        {t("wizard_completion_status:keyContacts.title")}
      </Typography>
      <Typography className="mb-4 text-muted-foreground" variant="body">
        {t("wizard_completion_status:keyContacts.description")}
      </Typography>

      {isLoadingDashboardStatus ? (
        <div className="flex justify-center py-8">
          <div className="size-12 animate-spin rounded-full border-t-4 border-primary" />
        </div>
      ) : dashboardStatusError ? (
        <div className="rounded-md bg-red-100 p-4 text-red-700">
          {dashboardStatusError}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Srenova Advisor Contact */}
          {keyContacts?.srenovaadvisor && (
            <div className="rounded-lg border border-border bg-card p-3 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      className="size-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <Typography
                    className="text-sm font-medium text-card-foreground"
                    variant="h4"
                  >
                    {t(
                      "wizard_completion_status:keyContacts.srenovaAdvisor.role"
                    )}
                  </Typography>
                  <Typography
                    className="text-sm text-muted-foreground"
                    variant="body"
                  >
                    {keyContacts.srenovaadvisor.name}
                  </Typography>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Typography
                  className="text-sm text-muted-foreground"
                  variant="body"
                >
                  {keyContacts.srenovaadvisor.email}
                </Typography>
                <Typography
                  className="text-sm text-muted-foreground"
                  variant="body"
                >
                  {keyContacts.srenovaadvisor.phone}
                </Typography>
              </div>
            </div>
          )}

          {/* Owner 1 Contact */}
          {keyContacts?.owner1 && (
            <div className="rounded-lg border border-border bg-card p-3 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      className="size-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <Typography
                    className="text-sm font-medium text-card-foreground"
                    variant="h4"
                  >
                    {t("wizard_completion_status:keyContacts.owner")}
                  </Typography>
                  <Typography
                    className="text-sm text-muted-foreground"
                    variant="body"
                  >
                    {keyContacts.owner1.name}
                  </Typography>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Typography
                  className="text-sm text-muted-foreground"
                  variant="body"
                >
                  {keyContacts.owner1.email}
                </Typography>
                <Typography
                  className="text-sm text-muted-foreground"
                  variant="body"
                >
                  {keyContacts.owner1.phone}
                </Typography>
              </div>
            </div>
          )}

          {/* Owner 2 Contact */}
          {keyContacts?.owner2 && (
            <div className="rounded-lg border border-border bg-card p-3 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      className="size-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <Typography
                    className="text-sm font-medium text-card-foreground"
                    variant="h4"
                  >
                    {t("wizard_completion_status:keyContacts.owner")}
                  </Typography>
                  <Typography
                    className="text-sm text-muted-foreground"
                    variant="body"
                  >
                    {keyContacts.owner2.name}
                  </Typography>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Typography
                  className="text-sm text-muted-foreground"
                  variant="body"
                >
                  {keyContacts.owner2.email}
                </Typography>
                <Typography
                  className="text-sm text-muted-foreground"
                  variant="body"
                >
                  {keyContacts.owner2.phone}
                </Typography>
              </div>
            </div>
          )}

          {/* Solicitor Contact */}
          {keyContacts?.solicitor && (
            <div className="rounded-lg border border-border bg-card p-3 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      className="size-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <Typography
                    className="text-sm font-medium text-card-foreground"
                    variant="h4"
                  >
                    {t(
                      "wizard_completion_status:keyContacts.yourSolicitor.role"
                    )}
                  </Typography>
                  <Typography
                    className="text-sm text-muted-foreground"
                    variant="body"
                  >
                    {keyContacts.solicitor.name}
                  </Typography>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Typography
                  className="text-sm text-muted-foreground"
                  variant="body"
                >
                  {keyContacts.solicitor.email}
                </Typography>
                <Typography
                  className="text-sm text-muted-foreground"
                  variant="body"
                >
                  {keyContacts.solicitor.phone}
                </Typography>
                {keyContacts.solicitor.company && (
                  <Typography
                    className="text-sm text-muted-foreground"
                    variant="body"
                  >
                    {keyContacts.solicitor.company}
                  </Typography>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

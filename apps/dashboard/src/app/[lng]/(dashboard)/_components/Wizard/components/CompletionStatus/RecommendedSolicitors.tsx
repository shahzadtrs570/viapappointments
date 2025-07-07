/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import config from "../../../../../../../../../../rain.config"

interface RecommendedSolicitorsProps {
  showRecommendedSolicitors: boolean
  onSelectRecommendedSolicitor: (firmName: string) => void
}

export function RecommendedSolicitors({
  showRecommendedSolicitors,
  onSelectRecommendedSolicitor,
}: RecommendedSolicitorsProps) {
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  if (!showRecommendedSolicitors || !config.flags.showRecommendedSolicitors) {
    return null
  }

  const solicitors = [
    {
      name: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.smithAndPartners.name"
      ),
      specialty: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.smithAndPartners.specialty"
      ),
      location: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.smithAndPartners.location"
      ),
      phone: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.smithAndPartners.phone"
      ),
    },
    {
      name: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.johnsonAndBrown.name"
      ),
      specialty: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.johnsonAndBrown.specialty"
      ),
      location: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.johnsonAndBrown.location"
      ),
      phone: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.johnsonAndBrown.phone"
      ),
    },
    {
      name: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.wilsonPropertyLaw.name"
      ),
      specialty: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.wilsonPropertyLaw.specialty"
      ),
      location: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.wilsonPropertyLaw.location"
      ),
      phone: t(
        "wizard_completion_status:solicitorDetails.recommendedSolicitors.wilsonPropertyLaw.phone"
      ),
    },
  ]

  return (
    <div id="recommended-solicitors">
      <div className="rounded-lg border border-border bg-card p-3 sm:p-6">
        <Typography
          className="sm:text-md mb-3 text-sm font-medium text-card-foreground sm:mb-4"
          variant="h4"
        >
          {t(
            "wizard_completion_status:solicitorDetails.recommendedSolicitors.title"
          )}
        </Typography>
        <Typography
          className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm"
          variant="body"
        >
          {t(
            "wizard_completion_status:solicitorDetails.recommendedSolicitors.description"
          )}
        </Typography>

        <div className="space-y-3 sm:space-y-4">
          {solicitors.map((solicitor, index) => (
            <div
              key={index}
              className="rounded-lg border border-border p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Typography
                    className="sm:text-md text-sm font-medium text-card-foreground"
                    variant="h4"
                  >
                    {solicitor.name}
                  </Typography>
                  <Typography
                    className="mt-1 text-xs text-muted-foreground sm:text-sm"
                    variant="body"
                  >
                    {solicitor.specialty}
                  </Typography>
                  <div className="mt-1 sm:mt-2">
                    <Typography
                      className="text-xs text-muted-foreground sm:text-sm"
                      variant="body"
                    >
                      {solicitor.location}
                    </Typography>
                    <Typography
                      className="text-xs text-muted-foreground sm:text-sm"
                      variant="body"
                    >
                      {solicitor.phone}
                    </Typography>
                  </div>
                </div>
                <a
                  className="mt-2 flex items-center text-primary hover:text-primary/80 sm:mt-0"
                  href="#"
                  data-firm={solicitor.name}
                  onClick={(e) => {
                    e.preventDefault()
                    onSelectRecommendedSolicitor(solicitor.name)
                  }}
                >
                  <span className="mr-1 text-xs sm:text-sm">
                    {t(
                      "wizard_completion_status:solicitorDetails.recommendedSolicitors.visitWebsite"
                    )}
                  </span>
                  <svg
                    className="size-3 sm:size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

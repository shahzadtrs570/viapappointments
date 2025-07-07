/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

export function TimelineCard() {
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  const timelineItems = [
    {
      step: 1,
      text: t(
        "wizard_completion_status:timeline.items.applicationAcceptedNoDate"
      ),
      date: "15/06/2023",
    },
    {
      step: 2,
      text: t(
        "wizard_completion_status:timeline.items.legalDocumentationNoDate"
      ),
      date: "22/06/2023",
    },
    {
      step: 3,
      text: t(
        "wizard_completion_status:timeline.items.propertyValuationNoDate"
      ),
      date: "29/06/2023",
    },
    {
      step: 4,
      text: t("wizard_completion_status:timeline.items.conveyancing"),
      date: null,
    },
    {
      step: 5,
      text: t(
        "wizard_completion_status:timeline.items.completionExpectedNoDate"
      ),
      date: "03/08/2023",
    },
  ]

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-lg">
      <Typography
        className="mb-4 text-lg font-medium text-card-foreground"
        variant="h3"
      >
        {t("wizard_completion_status:timeline.title")}
      </Typography>

      <div className="space-y-4">
        {timelineItems.map((item) => (
          <div key={item.step} className="flex items-center">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
              {item.step}
            </div>
            <Typography className="ml-3 text-card-foreground" variant="body">
              {item.text}
              {item.date && ` (${item.date})`}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}

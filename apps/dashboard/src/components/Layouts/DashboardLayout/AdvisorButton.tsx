"use client"

import { Button } from "@package/ui/button"
import { Phone } from "lucide-react"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

export function AdvisorButton() {
  const { t } = useClientTranslation("wizard_header")

  return (
    <div>
      <Button
        aria-label={t("speakToAdvisorButton")}
        className="gap-2"
        variant="outline"
      >
        <Phone className="size-4" />
        <span>{t("speakToAdvisorButton")}</span>
      </Button>
    </div>
  )
}

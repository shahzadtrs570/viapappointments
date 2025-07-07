/*eslint-disable*/

import { Info, Share } from "lucide-react"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface ImportantRecommendationSectionProps {
  advisorChoice: "shared" | "proceed" | null
  onAdvisorChoiceChange: (value: string) => void
  onShare: () => void
}

export function ImportantRecommendationSection({
  advisorChoice,
  onAdvisorChoiceChange,
  onShare,
}: ImportantRecommendationSectionProps) {
  const { t } = useClientTranslation(["wizard_provisional_offer"])

  return (
    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:mb-8 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start">
        <div className="mb-2 shrink-0 sm:mb-0">
          <Info className="size-5 text-blue-600 sm:size-6" />
        </div>
        <div className="sm:ml-3">
          <h3 className="text-base font-medium text-blue-800 sm:text-lg">
            {t("wizard_provisional_offer:importantRecommendation.title")}
          </h3>
          <p className="mt-1 text-xs text-blue-700 sm:text-sm">
            {t("wizard_provisional_offer:importantRecommendation.description")}
          </p>

          <div className="mt-3 sm:mt-4">
            {/* Remove the checkbox and just have radio buttons */}
            <div className="space-y-2 flex flex-col">
              <label className="inline-flex items-center">
                <input
                  checked={advisorChoice === "shared"}
                  className="form-radio size-3 text-blue-600 sm:size-4"
                  name="advisor-choice"
                  type="radio"
                  value="shared"
                  onChange={(e) => onAdvisorChoiceChange(e.target.value)}
                />
                <span className="ml-2 text-xs text-blue-700 sm:text-sm">
                  {t(
                    "wizard_provisional_offer:importantRecommendation.sharedOption"
                  )}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  checked={advisorChoice === "proceed"}
                  className="form-radio size-3 text-blue-600 sm:size-4"
                  name="advisor-choice"
                  type="radio"
                  value="proceed"
                  onChange={(e) => onAdvisorChoiceChange(e.target.value)}
                />
                <span className="ml-2 text-xs text-blue-700 sm:text-sm">
                  {t(
                    "wizard_provisional_offer:importantRecommendation.proceedOption"
                  )}
                </span>
              </label>
            </div>
          </div>

          <button
            className="mt-3 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-4 sm:px-4 sm:py-2 sm:text-sm"
            onClick={onShare}
          >
            <Share className="mr-1.5 size-4 sm:mr-2 sm:size-5" />
            {t("wizard_provisional_offer:importantRecommendation.shareButton")}
          </button>
        </div>
      </div>
    </div>
  )
}

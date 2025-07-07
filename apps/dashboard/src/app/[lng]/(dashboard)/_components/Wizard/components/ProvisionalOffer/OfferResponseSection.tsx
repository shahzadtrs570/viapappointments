/*eslint-disable*/

import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Textarea } from "@package/ui/textarea"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { DecisionStatus } from "@/app/store/property/offer/slice"

interface OfferResponseSectionProps {
  advisorChoice: "shared" | "proceed" | null
  decisionStatus: DecisionStatus
  showDeclineForm: boolean
  showSpeakHumanForm: boolean
  showAcceptanceConfirmation: boolean
  declineReason: string
  declineDetails: string
  onAcceptOffer: () => void
  onSpeakHuman: () => void
  onDeclineOffer: () => void
  onSubmitDecline: () => void
  onDeclineReasonChange: (value: string) => void
  onDeclineDetailsChange: (value: string) => void
  data: any
}

export function OfferResponseSection({
  advisorChoice,
  decisionStatus,
  showDeclineForm,
  showSpeakHumanForm,
  showAcceptanceConfirmation,
  declineReason,
  declineDetails,
  onAcceptOffer,
  onSpeakHuman,
  onDeclineOffer,
  onSubmitDecline,
  onDeclineReasonChange,
  onDeclineDetailsChange,
  data,
}: OfferResponseSectionProps) {
  const { t } = useClientTranslation(["wizard_provisional_offer"])

  return (
    <div className="mb-4 sm:mb-8">
      <Typography
        className="mb-3 text-lg font-bold text-card-foreground sm:mb-4 sm:text-xl"
        variant="h3"
      >
        {t("wizard_provisional_offer:responseSection.title")}
      </Typography>

      <Typography
        className="mb-3 text-center text-xs text-card-foreground sm:mb-4 sm:text-sm"
        variant="body"
      >
        {t("wizard_provisional_offer:responseSection.question")}
      </Typography>

      {!advisorChoice && (
        <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 sm:mb-4 sm:p-4">
          <div className="flex items-start">
            <div className="shrink-0 pt-0.5">
              <svg
                className="size-4 text-amber-600 sm:size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <Typography className="text-xs sm:text-sm" variant="body">
                Please confirm that you have reviewed this offer with family
                members or financial advisors before proceeding. This
                confirmation is required for legal and compliance purposes.
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Add a warning message if no decision has been made */}
      {advisorChoice && decisionStatus === "none" && (
        <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 sm:mb-4 sm:p-4">
          <div className="flex items-start">
            <div className="shrink-0 pt-0.5">
              <svg
                className="size-4 text-amber-600 sm:size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <Typography className="text-xs sm:text-sm" variant="body">
                Please select one of the options below to proceed. You must
                either accept the offer, speak with an advisor, or decline the
                offer before continuing to finalization.
              </Typography>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4">
        <button
          disabled={!advisorChoice}
          id="accept-provisional"
          className={`flex flex-col items-center justify-center rounded-lg border p-3 transition sm:p-6 ${
            advisorChoice
              ? "border-primary/10 bg-primary/5 hover:bg-primary/10"
              : "cursor-not-allowed border-muted/30 bg-muted/10 opacity-60"
          }`}
          onClick={onAcceptOffer}
        >
          <svg
            className={`mb-2 size-6 sm:size-8 ${advisorChoice ? "text-primary" : "text-muted-foreground"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span className="text-sm font-medium text-primary sm:text-base">
            {t("wizard_provisional_offer:responseSection.acceptButton.label")}
          </span>
          <span className="text-xs text-primary/80 sm:text-sm">
            {t(
              "wizard_provisional_offer:responseSection.acceptButton.subLabel"
            )}
          </span>
        </button>

        <button
          disabled={!advisorChoice}
          id="speak-human"
          className={`flex flex-col items-center justify-center rounded-lg border p-3 transition sm:p-6 ${
            advisorChoice
              ? "border-primary/10 bg-primary/5 hover:bg-primary/10"
              : "cursor-not-allowed border-muted/30 bg-muted/10 opacity-60"
          }`}
          onClick={onSpeakHuman}
        >
          <svg
            className={`mb-2 size-6 sm:size-8 ${advisorChoice ? "text-primary" : "text-muted-foreground"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span className="text-sm font-medium text-primary sm:text-base">
            {t(
              "wizard_provisional_offer:responseSection.speakAdvisorButton.label"
            )}
          </span>
          <span className="text-xs text-primary/80 sm:text-sm">
            {t(
              "wizard_provisional_offer:responseSection.speakAdvisorButton.subLabel"
            )}
          </span>
        </button>

        <button
          className="flex flex-col items-center justify-center rounded-lg border border-destructive/10 bg-destructive/5 p-3 transition hover:bg-destructive/10 sm:p-6"
          id="decline-offer"
          onClick={onDeclineOffer}
        >
          <svg
            className="mb-2 size-6 text-destructive sm:size-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span className="text-sm font-medium text-destructive sm:text-base">
            {t("wizard_provisional_offer:responseSection.declineButton.label")}
          </span>
          <span className="text-xs text-destructive/80 sm:text-sm">
            {t(
              "wizard_provisional_offer:responseSection.declineButton.subLabel"
            )}
          </span>
        </button>
      </div>

      {/* Forms for different actions */}
      {showDeclineForm && (
        <div className="rounded-lg border border-border bg-muted p-3 sm:p-6">
          <Typography
            className="mb-3 text-base font-medium text-card-foreground sm:mb-4 sm:text-lg"
            variant="h4"
          >
            {t("wizard_provisional_offer:declineForm.title")}
          </Typography>
          <Typography
            className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm"
            variant="body"
          >
            {t("wizard_provisional_offer:declineForm.description")}
          </Typography>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-card-foreground sm:mb-2 sm:text-sm">
                {t(
                  "wizard_provisional_offer:declineForm.reasonSelectPlaceholder"
                )}
              </label>
              <Select
                value={declineReason}
                onValueChange={onDeclineReasonChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terms">
                    {t(
                      "wizard_provisional_offer:declineForm.reasons.amountLow"
                    )}
                  </SelectItem>
                  <SelectItem value="amount">
                    {t(
                      "wizard_provisional_offer:declineForm.reasons.againstViager"
                    )}
                  </SelectItem>
                  <SelectItem value="timing">
                    {t(
                      "wizard_provisional_offer:declineForm.reasons.alternativeSolution"
                    )}
                  </SelectItem>
                  <SelectItem value="personalCircumstances">
                    {t(
                      "wizard_provisional_offer:declineForm.reasons.personalCircumstances"
                    )}
                  </SelectItem>
                  <SelectItem value="termsConcern">
                    {t(
                      "wizard_provisional_offer:declineForm.reasons.termsConcern"
                    )}
                  </SelectItem>
                  <SelectItem value="otherReason">
                    {t("wizard_provisional_offer:declineForm.reasons.other")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                className="mb-1 block text-xs font-medium text-card-foreground sm:mb-2 sm:text-sm"
                htmlFor="decline-details"
              >
                {t("wizard_provisional_offer:declineForm.detailsLabel")}
              </label>
              <Textarea
                className="mt-1 block w-full text-xs sm:text-sm"
                id="decline-details"
                rows={3}
                value={declineDetails}
                onChange={(e) => onDeclineDetailsChange(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm"
                onClick={onSubmitDecline}
              >
                {t("wizard_provisional_offer:declineForm.submitButton")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSpeakHumanForm && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-6">
          <Typography
            className="mb-3 text-base font-medium text-primary sm:mb-4 sm:text-lg"
            variant="h4"
          >
            {t("wizard_provisional_offer:speakHumanForm.title")}
          </Typography>
          <Typography
            className="mb-3 text-xs text-card-foreground sm:mb-4 sm:text-sm"
            variant="body"
          >
            {t("wizard_provisional_offer:speakHumanForm.description")}
          </Typography>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col rounded-lg border border-border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-4">
              <div className="mb-2 shrink-0 sm:mb-0">
                <svg
                  className="mx-auto size-6 text-primary sm:mx-0 sm:size-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="ml-0 text-center sm:ml-4 sm:text-left">
                <Typography
                  className="text-base font-medium text-gray-900 sm:text-lg"
                  variant="h4"
                >
                  {t("wizard_provisional_offer:speakHumanForm.nameLabel")}
                </Typography>
                <Typography
                  className="text-xl font-bold text-primary sm:text-2xl"
                  variant="body"
                >
                  0800 123 4567
                </Typography>
                <Typography
                  className="text-xs text-gray-500 sm:text-sm"
                  variant="body"
                >
                  {t(
                    "wizard_provisional_offer:speakHumanForm.questionPlaceholder"
                  )}
                </Typography>
              </div>
            </div>

            <div className="flex flex-col rounded-lg border border-border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-4">
              <div className="mb-2 shrink-0 sm:mb-0">
                <svg
                  className="mx-auto size-6 text-primary sm:mx-0 sm:size-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="ml-0 text-center sm:ml-4 sm:text-left">
                <Typography
                  className="text-base font-medium text-gray-900 sm:text-lg"
                  variant="h4"
                >
                  {t(
                    "wizard_provisional_offer:speakHumanForm.requestCallbackButton"
                  )}
                </Typography>
                <Typography
                  className="text-xs text-gray-500 sm:text-sm"
                  variant="body"
                >
                  {t(
                    "wizard_provisional_offer:speakHumanForm.questionPlaceholder"
                  )}
                </Typography>
                <Button
                  className="mt-2 w-full text-xs sm:w-auto sm:text-sm"
                  variant="default"
                >
                  {t(
                    "wizard_provisional_offer:speakHumanForm.requestCallbackButton"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAcceptanceConfirmation && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-6">
          <div className="mb-3 flex flex-col sm:mb-4 sm:flex-row sm:items-center">
            <div className="mx-auto mb-2 shrink-0 sm:mx-0 sm:mb-0">
              <svg
                className="size-6 text-primary sm:size-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="ml-0 text-center sm:ml-3 sm:text-left">
              <Typography
                className="text-base font-medium text-primary sm:text-lg"
                variant="h4"
              >
                {t("wizard_provisional_offer:acceptanceConfirmation.title")}
              </Typography>
              <Typography
                className="text-xs text-primary/80 sm:text-sm"
                variant="body"
              >
                {t(
                  "wizard_provisional_offer:acceptanceConfirmation.thankYouMessage"
                )}
                {data.referenceNumber}
              </Typography>
            </div>
          </div>

          <Typography
            className="mb-3 text-xs text-card-foreground sm:mb-4 sm:text-sm"
            variant="body"
          >
            {t(
              "wizard_provisional_offer:acceptanceConfirmation.whatsNextTitle"
            )}
          </Typography>

          <div className="mt-3 rounded-md bg-primary/10 p-2 sm:mt-4 sm:p-3">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg
                  className="size-4 text-primary sm:size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="ml-2 sm:ml-3">
                <Typography
                  className="text-xs text-card-foreground sm:text-sm"
                  variant="body"
                >
                  <span className="font-medium">
                    {t(
                      "wizard_provisional_offer:acceptanceConfirmation.meantimeMessage"
                    )}
                  </span>
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

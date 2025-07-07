/*eslint-disable*/

import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"
import type { EmailVerificationAlertProps } from "./FormValidation"

export function EmailVerificationAlert({
  isEmailVerified,
  readOnly,
  primaryOwnerEmail,
  isVerificationSent,
  isVerificationLoading,
  onSendVerificationEmail,
  renderVerificationButtonContent,
  t,
}: EmailVerificationAlertProps) {
  if (isEmailVerified || readOnly || !primaryOwnerEmail) {
    return null
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/50 sm:p-4">
      <div className="flex items-start">
        <div className="shrink-0">
          <svg
            className="size-5 text-amber-600 dark:text-amber-400"
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
        <div className="ml-3 flex-1">
          <Typography
            className="text-sm font-medium text-amber-800 dark:text-amber-300"
            variant="h4"
          >
            {t("emailVerification.title")}
          </Typography>
          <div className="mt-2">
            <Typography
              className="text-xs text-amber-700 dark:text-amber-400 sm:text-sm"
              variant="body"
            >
              {t("emailVerification.description")}
              {isVerificationSent
                ? ` ${t("emailVerification.sentMessage")}`
                : ""}
            </Typography>
          </div>
          <div className="mt-3">
            <Button
              className="text-xs sm:text-sm"
              disabled={isVerificationLoading}
              variant="outline"
              onClick={onSendVerificationEmail}
            >
              {renderVerificationButtonContent()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

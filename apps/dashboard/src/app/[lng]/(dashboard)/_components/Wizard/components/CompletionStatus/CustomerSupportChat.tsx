/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

export function CustomerSupportChat() {
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-lg">
      <div className="mb-4 flex items-center">
        <div className="mr-3 rounded-full bg-primary/10 p-2">
          <svg
            className="size-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <Typography className="text-lg font-medium text-primary" variant="h3">
          {t("wizard_completion_status:customerSupportChat.title")}
        </Typography>
      </div>

      <div
        className="mb-4 h-64 overflow-y-auto rounded-lg border border-border bg-muted p-4"
        id="chat-messages"
      >
        <div className="mb-4 flex items-start">
          <div className="shrink-0">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                className="size-5"
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
          <div className="ml-3 max-w-xs rounded-lg bg-card p-3 shadow-sm">
            <Typography className="text-sm text-card-foreground" variant="body">
              {t("wizard_completion_status:customerSupportChat.greeting")}
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          className="flex-1 rounded-l-md border border-border bg-card p-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          type="text"
          placeholder={t(
            "wizard_completion_status:customerSupportChat.inputPlaceholder"
          )}
        />
        <button className="flex h-[38px] items-center justify-center rounded-r-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary">
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

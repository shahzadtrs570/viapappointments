import { Button } from "@package/ui/button"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

export function Header() {
  const { t } = useClientTranslation("wizard_header")

  return (
    <header className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-0 md:mb-8">
      <Button
        className="flex h-auto w-full items-center justify-center gap-1 px-2 py-1.5 text-xs sm:w-auto sm:justify-start sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
        variant="outline"
      >
        <svg
          className="size-4 sm:size-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        {t("speakToAdvisorButton")}
      </Button>
    </header>
  )
}

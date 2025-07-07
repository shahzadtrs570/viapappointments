/*eslint-disable*/

import { Card } from "@package/ui/card"
import { Typography } from "@package/ui/typography"
import type { HelpfulResourcesCardProps } from "./FormValidation"

export function HelpfulResourcesCard({ t }: HelpfulResourcesCardProps) {
  return (
    <Card className="overflow-hidden border border-border bg-card shadow-md">
      <div className="bg-primary/5 p-3 sm:p-4">
        <Typography
          className="text-base font-semibold text-primary sm:text-lg"
          variant="h3"
        >
          {t("resources.title")}
        </Typography>
      </div>

      <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
        <a
          className="flex items-start rounded-md border border-border p-2 transition-all duration-300 hover:border-primary/20 hover:bg-primary/5 hover:shadow-sm sm:p-3 md:p-4"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 sm:size-10">
            <svg
              className="size-4 text-primary sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <div className="ml-2 sm:ml-3 md:ml-4">
            <Typography
              className="text-sm font-medium sm:text-base"
              variant="body"
            >
              {t("resources.guide.title")}
            </Typography>
            <Typography
              className="text-xs text-muted-foreground sm:text-sm"
              variant="body"
            >
              {t("resources.guide.description")}
            </Typography>
            <span className="mt-1 inline-block text-xs font-medium text-primary sm:mt-2">
              {t("resources.guide.link")}
            </span>
          </div>
        </a>

        <a
          className="flex items-start rounded-md border border-border p-2 transition-all duration-300 hover:border-primary/20 hover:bg-primary/5 hover:shadow-sm sm:p-3 md:p-4"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 sm:size-10">
            <svg
              className="size-4 text-primary sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <div className="ml-2 sm:ml-3 md:ml-4">
            <Typography
              className="text-sm font-medium sm:text-base"
              variant="body"
            >
              {t("resources.calculator.title")}
            </Typography>
            <Typography
              className="text-xs text-muted-foreground sm:text-sm"
              variant="body"
            >
              {t("resources.calculator.description")}
            </Typography>
            <span className="mt-1 inline-block text-xs font-medium text-primary sm:mt-2">
              {t("resources.calculator.link")}
            </span>
          </div>
        </a>

        <a
          className="flex items-start rounded-md border border-border p-2 transition-all duration-300 hover:border-primary/20 hover:bg-primary/5 hover:shadow-sm sm:p-3 md:p-4"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 sm:size-10">
            <svg
              className="size-4 text-primary sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 9l3 3-3 3M16 9l-3 3 3 3M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <div className="ml-2 sm:ml-3 md:ml-4">
            <Typography
              className="text-sm font-medium sm:text-base"
              variant="body"
            >
              {t("resources.faq.title")}
            </Typography>
            <Typography
              className="text-xs text-muted-foreground sm:text-sm"
              variant="body"
            >
              {t("resources.faq.description")}
            </Typography>
            <span className="mt-1 inline-block text-xs font-medium text-primary sm:mt-2">
              {t("resources.faq.link")}
            </span>
          </div>
        </a>
      </div>
    </Card>
  )
}

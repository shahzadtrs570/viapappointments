/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import type { AboutSrenovaSectionProps } from "./FormValidation"

export function AboutSrenovaSection({ t }: AboutSrenovaSectionProps) {
  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-border shadow-sm sm:mb-6 md:mb-8">
      <div className="bg-primary/5 p-3 sm:p-4">
        <Typography
          className="text-lg font-semibold text-primary sm:text-xl"
          variant="h3"
        >
          {t("about_section.title")}
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 md:gap-6 md:p-6">
        <div className="rounded-lg bg-background/70 p-3 shadow-sm transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md sm:p-4 md:p-5">
          <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-3 sm:size-10">
            <svg
              className="size-4 sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <Typography
            className="mb-2 font-semibold text-card-foreground"
            variant="body"
          >
            {t("about_section.viager.title")}
          </Typography>
          <Typography className="text-muted-foreground" variant="body">
            {t("about_section.viager.description")}
          </Typography>
        </div>

        <div className="rounded-lg bg-background/70 p-3 shadow-sm transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md sm:p-4 md:p-5">
          <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-3 sm:size-10">
            <svg
              className="size-4 sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <Typography
            className="mb-2 font-semibold text-card-foreground"
            variant="body"
          >
            {t("about_section.benefits.title")}
          </Typography>
          <Typography className="text-muted-foreground" variant="body">
            {t("about_section.benefits.description")}
          </Typography>
        </div>

        <div className="rounded-lg bg-background/70 p-3 shadow-sm transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md sm:p-4 md:p-5">
          <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-3 sm:size-10">
            <svg
              className="size-4 sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <Typography
            className="mb-2 font-semibold text-card-foreground"
            variant="body"
          >
            {t("about_section.difference.title")}
          </Typography>
          <Typography className="text-muted-foreground" variant="body">
            {t("about_section.difference.description")}
          </Typography>
        </div>

        <div className="rounded-lg bg-background/70 p-3 shadow-sm transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md sm:p-4 md:p-5">
          <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-3 sm:size-10">
            <svg
              className="size-4 sm:size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <Typography
            className="mb-2 font-semibold text-card-foreground"
            variant="body"
          >
            {t("about_section.peace.title")}
          </Typography>
          <Typography className="text-muted-foreground" variant="body">
            {t("about_section.peace.description")}
          </Typography>
        </div>
      </div>

      {/* Testimonial */}
      <div className="border-t border-border bg-muted/20 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-0 sm:size-12">
            <svg
              className="size-5 sm:size-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
            </svg>
          </div>
          <div>
            <Typography
              className="sm:text-md text-sm font-medium italic text-card-foreground"
              variant="body"
            >
              {t("testimonial.quote")}
            </Typography>
            <Typography
              className="mt-1 text-xs font-medium text-primary sm:mt-2 sm:text-sm"
              variant="body"
            >
              {t("testimonial.author")}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

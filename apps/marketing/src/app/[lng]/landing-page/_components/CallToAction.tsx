"use client"

import { useParams } from "next/navigation"

import { useTranslation } from "@/lib/i18n/client"

export function CallToAction() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "callToAction")

  return (
    <div className="bg-white dark:bg-background">
      <div className="relative m-auto  max-w-6xl overflow-hidden rounded-[30px] bg-[#FFEDC8] p-12 px-4 text-center">
        <div className="absolute left-1/2 top-0 mt-5 -translate-x-1/2">
          <img
            alt="decorative vector"
            className="w-32"
            src="/images/vector-1.svg"
          />
        </div>
        <h2 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          {t("description")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-3">
          <a
            aria-label="Check your eligibility and get started"
            className="inline-block rounded-2xl bg-secondary px-6 py-3 text-base font-bold text-foreground transition-all hover:bg-secondary/90 sm:text-sm"
            href="/eligibility"
          >
            {t("buttons.get_started")}
          </a>
          <a
            aria-label="Learn more about our services"
            className="rounded-2xl border border-secondary bg-white px-6 py-3 text-base font-bold text-foreground transition-all hover:text-gray-700 sm:text-sm"
            href="/"
          >
            {t("buttons.learn_more")}
          </a>
        </div>
      </div>
    </div>
  )
}

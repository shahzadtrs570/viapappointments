"use client"

import { useParams } from "next/navigation"

import { useTranslation } from "@/lib/i18n/client"

export function HowItWorks() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "howItWorks")

  // Get steps from translations
  const steps = t("steps", { returnObjects: true }) as Array<{
    number: number
    title: string
    items: string[]
  }>

  return (
    <section
      className="relative overflow-hidden bg-background-2 py-16 md:py-24 lg:py-32"
      id="how-it-works"
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-white">{t("title.how_to")}</span>{" "}
            <span className="text-primary">{t("title.get_started")}</span>
          </h2>
          <p className="md:text-md text-sm text-white/90 md:pb-5">
            {t("description")}
          </p>
        </div>

        {/* Curved arrow background */}
        <div className="pointer-events-none absolute left-0 top-[45%] w-[98%] -translate-y-1/2">
          <img alt="" className="w-full" src="/images/how-it-works-1.svg" />
        </div>

        <div className="relative grid gap-6 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative ${
                index % 2 === 1 ? "md:mt-12" : "md:-mt-12"
              }`}
            >
              {/* Card content */}
              <div className="rounded-[30px] border border-secondary bg-card p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]">
                {/* Step number circle */}
                <div className="mb-4 ml-0">
                  <div className="relative inline-flex">
                    <img
                      alt=""
                      className="size-[62px]"
                      src="/images/ellipse-3.svg"
                    />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-black">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <ul className="space-y-2.5">
                  {step.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <img
                        alt=""
                        className="mr-3 size-5 shrink-0 dark:invert"
                        src="/images/tick.svg"
                      />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-md text-center">
          <button
            className="inline-block rounded-2xl bg-secondary px-8 py-4 text-base font-bold text-foreground transition-all hover:bg-secondary/90 sm:text-sm"
            onClick={() => {
              window.location.href = "/eligibility"
            }}
          >
            {t("cta_button")}
          </button>
        </div>
      </div>
    </section>
  )
}

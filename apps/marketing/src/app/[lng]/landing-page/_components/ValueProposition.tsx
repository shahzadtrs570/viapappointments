"use client"

import { useParams } from "next/navigation"

import { useTranslation } from "@/lib/i18n/client"

export function ValueProposition() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "valueProposition")

  // Get features from translations
  const features = t("features", { returnObjects: true }) as Array<{
    title: string
    benefits: string[]
  }>

  // Define icons for each feature
  const featureIcons = [
    "/images/value-1.svg",
    "/images/value-2.svg",
    "/images/value-3.svg",
  ]

  return (
    <section className="bg-card py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 flex flex-col items-center md:hidden">
            <img
              alt="Srenova vector"
              className="mb-3 h-auto w-48"
              src="/images/vector-2.svg"
            />
            <h2 className="mb-4 text-4xl font-semibold text-foreground">
              <span className="text-foreground">{t("title.the")}</span>{" "}
              <span className="bg-gradient-to-r from-[#CA8A04] via-[#F5B329] to-[#F5B329] bg-clip-text text-transparent">
                {t("title.srenova")}
              </span>
              <span className="text-foreground"> {t("title.way")}</span>
            </h2>
          </div>
          <p className="text-sm text-foreground md:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl border border-muted bg-card p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]"
            >
              <div className="mb-4">
                <div className="mb-3 inline-block">
                  <img alt={feature.title} src={featureIcons[index]} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>

              <ul className="space-y-3">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <img
                      alt="check"
                      className="mt-0.5 size-5 shrink-0 dark:invert"
                      src="/images/tick.svg"
                    />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 text-center">
          <a
            className="inline-block rounded-2xl bg-secondary px-8 py-4 text-base font-bold text-foreground transition-all hover:bg-secondary/90 sm:text-sm"
            href="/eligibility"
          >
            {t("cta_button")}
          </a>
        </div>
      </div>
    </section>
  )
}

"use client"

import Image from "next/image"
import { useParams } from "next/navigation"

import { useTranslation } from "@/lib/i18n/client"

export function TrustIndicators() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "trustIndicators")

  // Get trust columns from translations
  const trustColumns = t("columns", { returnObjects: true }) as Array<{
    title: string
    features: string[]
  }>

  // Get partner logos from translations
  const partnerLogos = t("partners.logos", { returnObjects: true }) as Array<{
    name: string
  }>

  // Map partner names to placeholder images
  const partnerImages = partnerLogos.map((partner) => ({
    name: partner.name,
    image: `/images/placeholder.jpg`,
  }))

  return (
    <section className="mb-8 bg-white dark:bg-background">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center md:mt-12">
          <h2 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
            <span className="text-foreground">{t("title.why_trust")}</span>
            <span className="bg-[linear-gradient(90deg,_#CA8A04_43.31%,_#F5B329_94.88%)] bg-clip-text text-transparent">
              {t("title.srenova")}
            </span>
            <span className="text-gray-900">{t("title.question_mark")}</span>
          </h2>
          <p className="text-sm">{t("description")}</p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {trustColumns.map((column, index) => (
            <div
              key={index}
              className="rounded-[30px] border border-foreground/20 bg-white p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)] transition-shadow hover:shadow-lg"
            >
              <div className="relative mb-4">
                <Image
                  alt=""
                  aria-hidden="true"
                  className="absolute left-0 top-0"
                  height={62}
                  src="/images/ellipse-2.svg"
                  width={62}
                />
                <div className="relative z-10 flex size-16 items-center justify-center">
                  <Image
                    alt={column.title}
                    className="text-gray-900"
                    height={40}
                    src={`/images/trust-${index + 1}.svg`}
                    width={40}
                  />
                </div>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="mr-2 shrink-0"
                      height={20}
                      src="/images/tick.svg"
                      width={20}
                    />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-8 text-center">
          <p className="text-md mb-6 font-medium text-foreground">
            {t("partners.title")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {partnerImages.map((partner, index) => (
              <div
                key={index}
                className="relative h-12 w-32 grayscale transition-all hover:grayscale-0"
              >
                <Image
                  fill
                  alt={partner.name}
                  className="object-contain"
                  src={partner.image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

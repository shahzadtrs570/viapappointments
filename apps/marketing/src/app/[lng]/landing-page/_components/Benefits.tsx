/* eslint-disable */

"use client"

import Image from "next/image"
import { useParams } from "next/navigation"

import { useTranslation } from "@/lib/i18n/client"

export function Benefits() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "benefits")

  const benefits = t("benefits_list", { returnObjects: true }) as Array<{
    title: string
  }>

  return (
    <section className="py-16 md:py-24 lg:py-32" id="benefits">
      <div className="container mx-auto mb-64 max-w-6xl px-4 sm:mb-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column - Benefits */}
          <div>
            <div className="mb-8">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                <span>{t("title.benefits_for")}</span>
                <br />
                <span className="bg-[linear-gradient(90deg,_#CA8A04_43.31%,_#F5B329_94.88%)] bg-clip-text text-transparent">
                  {t("title.homeowners")}
                </span>
              </h2>
              <p className="md:text-md text-sm text-foreground">
                {t("description")}
              </p>
            </div>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="shrink-0">
                    <div className="flex size-6 items-center justify-center rounded-full bg-[#050B1A] dark:invert">
                      <img
                        alt={t("alt_text.checkmark")}
                        className="size-5"
                        src="/images/tick-white.svg"
                      />
                    </div>
                  </div>
                  <span className="text-sm">{benefit.title}</span>
                </div>
              ))}
            </div>

            <button className="mt-8 flex items-center gap-2 rounded-2xl bg-secondary px-6 py-3 text-base font-bold text-foreground transition-all hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:text-sm">
              <img
                alt={t("alt_text.download")}
                className="size-6"
                src="/images/download.svg"
              />
              <span>{t("download_button")}</span>
            </button>
          </div>

          {/* Right Column - Image with Testimonial */}
          <div className="relative mx-auto w-full max-w-[540px] md:w-auto md:max-w-none">
            <div className="overflow-hidden rounded-lg">
              <Image
                alt={t("alt_text.homeowners")}
                className="h-auto w-full object-cover"
                height={400}
                src="/images/homeowner_benefits.jpg"
                width={540}
              />
            </div>
            <div className="absolute inset-x-4 rounded-3xl bg-background p-4 text-foreground shadow-[0px_-4px_0px_0px_hsl(var(--secondary))] sm:left-auto sm:right-0 md:top-48 md:max-w-[330px] lg:top-56 lg:max-w-[440px] xl:-right-12 xl:top-64">
              <img
                alt="decorative vector"
                className="absolute -top-8 left-8"
                src="/images/vector.svg"
              />
              <p className="mb-2 text-xs font-semibold italic leading-5 sm:text-xs">{`"${t("testimonial.quote")}"`}</p>
              <p className="text-[10px] font-medium leading-5">
                {t("testimonial.author")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

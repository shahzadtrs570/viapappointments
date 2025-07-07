"use client"

import Image from "next/image"
import { useParams } from "next/navigation"

import { useTranslation } from "@/lib/i18n/client"

export function Features() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "features")

  // Get benefits from translations
  const benefits = t("benefits", { returnObjects: true }) as Array<{
    title: string
    subtitle: string
  }>

  return (
    <div className="w-full bg-background-3 p-12 md:my-24 md:p-12">
      <div className="md:animate-scroll flex flex-col items-center justify-center space-y-12 md:flex-row md:space-y-0 md:overflow-hidden">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex w-full items-start space-x-3 md:mx-8 md:w-auto md:whitespace-nowrap"
          >
            <Image
              alt=""
              className="mt-1"
              height={26}
              src="/images/ellipse.svg"
              width={26}
            />

            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium text-foreground">
                {benefit.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {benefit.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import React from "react"

import Link from "next/link"
import { useParams } from "next/navigation"

import { useTranslation } from "@/lib/i18n/client"

export function FAQ() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "faq")

  // Get FAQs from translations
  const faqs = t("faqs", { returnObjects: true }) as Array<{
    question: string
    answer: string
  }>

  return (
    <section
      className="bg-[linear-gradient(99deg,_#FBFCFF_0%,_#F1F6FF_100%)] py-16 md:py-24 lg:py-32"
      id="faq"
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left side - Title and description */}
          <div className="mx-auto max-w-xl text-center lg:text-left">
            <h2 className="mb-4 text-3xl font-bold tracking-tight  md:text-4xl">
              {t("title")}
            </h2>
            <p className="text-md text-center text-foreground lg:text-left">
              {t("description")
                .split("<span>")
                .map((part, i) => {
                  if (i === 0) return <span key={`part-${i}`}>{part}</span>
                  const [spanContent, rest] = part.split("</span>")
                  return (
                    <React.Fragment key={`part-${i}`}>
                      <Link
                        className="font-medium text-primary hover:underline"
                        href="#what-is-srenova"
                      >
                        {spanContent}
                      </Link>
                      {rest}
                    </React.Fragment>
                  )
                })}
            </p>
          </div>

          {/* Right side - Questions */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]"
              >
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <h3 className="text-md font-medium text-foreground">
                      {faq.question}
                    </h3>
                    <div className="relative ml-2 flex items-center justify-center">
                      <img
                        alt=""
                        className="size-10"
                        src="/images/ellipse-5.svg"
                      />
                      <img
                        alt=""
                        className="absolute size-5 transition-transform group-open:rotate-45"
                        src="/images/plus.svg"
                      />
                    </div>
                  </summary>
                  <div className="prose prose-sm mt-4 max-w-none ">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

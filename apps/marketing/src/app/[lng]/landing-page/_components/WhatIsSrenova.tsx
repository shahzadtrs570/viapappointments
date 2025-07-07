"use client"

import { Button } from "@package/ui/button"
import { ChatBot, ChatHeader } from "@package/ui/chatbot"
import { useParams } from "next/navigation"

import { useTranslation } from "@/lib/i18n/client"

export function WhatIsSrenova() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "whatIsSrenova")

  // Define suggested questions using translations
  const SUGGESTED_QUESTIONS = [
    {
      id: "age-requirements",
      text: t("suggested_questions.age_requirements"),
      category: "eligibility",
    },
    {
      id: "property-types",
      text: t("suggested_questions.property_types"),
      category: "eligibility",
    },
    {
      id: "property-value",
      text: t("suggested_questions.property_value"),
      category: "process",
    },
    {
      id: "mortgage",
      text: t("suggested_questions.mortgage"),
      category: "eligibility",
    },
    {
      id: "viager-program",
      text: t("suggested_questions.viager_program"),
      category: "general",
    },
    {
      id: "process-timeline",
      text: t("suggested_questions.process_timeline"),
      category: "process",
    },
  ]

  return (
    <div
      className="container mx-auto max-w-7xl px-4 py-12 md:px-12 md:pb-12 lg:pb-16"
      id="what-is-srenova"
    >
      <div className="flex flex-col md:gap-16 lg:flex-row lg:items-start lg:justify-between">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="mb-6 text-4xl font-bold leading-[120%] tracking-tight md:text-5xl">
            <span className="text-foreground">{t("title.what_is")} </span>
            <span className="bg-gradient-to-r from-[#CA8A04] to-[#F5B329] bg-clip-text text-transparent">
              {t("title.srenova")}
            </span>
            <span className="text-foreground">{t("title.question_mark")}</span>
          </h2>

          <p className="mb-6 text-lg font-normal leading-[150%]  text-foreground">
            {t("description.paragraph1")}
          </p>

          <p className="mb-8 text-lg font-normal leading-[150%] text-foreground">
            {t("description.paragraph2")}
          </p>

          <p className="md:text-md mb-8 text-sm font-bold text-foreground">
            {t("chat_prompt")}
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              className="rounded-2xl bg-secondary px-6 py-5 text-base font-bold text-foreground hover:bg-secondary/70 sm:px-8 sm:py-6 sm:text-sm"
              size="lg"
              onClick={() => {
                window.location.href = "/eligibility"
              }}
            >
              {t("buttons.eligibility")}
            </Button>
            <Button
              className="flex items-center rounded-2xl border border-secondary bg-transparent px-6 py-5 text-base font-bold text-foreground hover:bg-secondary sm:px-8 sm:py-6 sm:text-sm"
              size="lg"
              variant="outline"
              onClick={() => {
                window.location.href = "/#how-it-works"
              }}
            >
              {t("buttons.how_it_works")}
            </Button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          <ChatBot
            className="rounded-3xl bg-card"
            initialMessage={t("chat.initial_message")}
            suggestedQuestions={SUGGESTED_QUESTIONS}
            title={t("chat.header")}
            header={
              <ChatHeader
                header={t("chat.header")}
                image="/images/ellipse-2.svg"
              />
            }
          />
        </div>
      </div>
    </div>
  )
}

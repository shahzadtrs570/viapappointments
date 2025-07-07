/*eslint-disable*/

import { ChatBot, ChatHeader } from "@package/ui/chatbot"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

export function ChatBotSection() {
  const { t } = useClientTranslation([
    "wizard_seller_information",
    "wizard_common",
  ])

  // Create translated suggested questions
  const getSuggestedQuestions = () => {
    return [
      {
        id: "minimum-age",
        text: t(
          "wizard_seller_information:chatbot.suggestedQuestions.minimum_age"
        ),
        category: "eligibility",
        followUp: ["eligible-properties", "process-time", "mortgage"],
      },
      {
        id: "multiple-owners",
        text: t(
          "wizard_seller_information:chatbot.suggestedQuestions.multiple_owners"
        ),
        category: "life-changes",
        followUp: ["remarry", "change-mind", "separation"],
      },
      {
        id: "process-time",
        text: t(
          "wizard_seller_information:chatbot.suggestedQuestions.process_time"
        ),
        category: "process",
        followUp: ["mortgage", "tax-implications", "property-valuation"],
      },
      {
        id: "eligible-properties",
        text: t(
          "wizard_seller_information:chatbot.suggestedQuestions.eligible_properties"
        ),
        category: "eligibility",
        followUp: ["minimum-age", "non-standard", "property-valuation"],
      },
      {
        id: "medical-exam",
        text: t(
          "wizard_seller_information:chatbot.suggestedQuestions.medical_exam"
        ),
        category: "health",
        followUp: ["minimum-age", "care-home", "multiple-owners"],
      },
    ]
  }

  return (
    <ChatBot
      className="mb-4 sm:mb-6"
      initialMessage={t("wizard_seller_information:chatbot.initialMessage")}
      suggestedQuestions={getSuggestedQuestions()}
      title={t("wizard_seller_information:chatbot.title")}
      header={
        <ChatHeader
          header={t("wizard_seller_information:chatbot.title")}
          image="/images/ellipse-2.svg"
        />
      }
    />
  )
}

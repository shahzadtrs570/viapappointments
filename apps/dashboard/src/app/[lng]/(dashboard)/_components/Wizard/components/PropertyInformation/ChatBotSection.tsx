/*eslint-disable*/

import { ChatBot, ChatHeader } from "@package/ui/chatbot"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import { getSuggestedQuestions } from "./FormHelpers"

export function ChatBotSection() {
  const { t } = useClientTranslation([
    "wizard_property_information",
    "wizard_common",
  ])

  return (
    <ChatBot
      suggestedQuestions={getSuggestedQuestions(t)}
      title={t("wizard_property_information:chatbot.title")}
      header={
        <ChatHeader
          header={t("wizard_property_information:chatbot.title")}
          image="/images/ellipse-2.svg"
        />
      }
      initialMessage={t("wizard_property_information:chatbot.initialMessage")}
    />
  )
}

/*eslint-disable*/

import { ChatBot, ChatHeader } from "@package/ui/chatbot"
import type { ChatBotSectionProps } from "./FormValidation"

export function ChatBotSection({ suggestedQuestions, t }: ChatBotSectionProps) {
  return (
    <ChatBot
      className="mb-4 sm:mb-6"
      initialMessage={t("chatbot.initialMessage")}
      suggestedQuestions={suggestedQuestions}
      title={t("chatbot.title")}
      header={
        <ChatHeader header={t("chatbot.title")} image="/images/ellipse-2.svg" />
      }
    />
  )
}

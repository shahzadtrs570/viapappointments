import { GuideBot as CoreGuideBot } from "@package/ui/guidebot"

import type { BotConfig } from "./types"

interface GuideBotProps extends BotConfig {
  className?: string
}

export function GuideBot({
  initialMessage = "I'm here to guide you through this process. How can I help you?",
  title = "Your Guide",
  botResponses = {},
  suggestedQuestions = [],
  className = "",
}: GuideBotProps) {
  return (
    <CoreGuideBot
      botResponses={botResponses}
      className={`mb-6 border border-border bg-card ${className}`}
      initialMessage={initialMessage}
      suggestedQuestions={suggestedQuestions}
      title={title}
    />
  )
}

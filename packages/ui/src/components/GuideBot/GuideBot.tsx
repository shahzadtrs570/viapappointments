/*eslint-disable react/jsx-max-depth*/
import { useEffect, useRef, useState } from "react"

import { Bot } from "lucide-react"

import { useClientTranslation } from "../../../../../apps/dashboard/src/lib/i18n/I18nProvider"
import { Button } from "../Button/Button"
import { Card } from "../Card/Card"
import { Input } from "../Input/Input"
// import { ScrollArea } from "../ScrollArea/ScrollArea"
import { Typography } from "../Typography/Typography"

interface Message {
  type: "user" | "bot"
  content: string
}

interface QuestionSuggestion {
  id: string
  text: string
  category: string
  followUp?: string[] // IDs of related follow-up questions
}

export interface GuideBotProps {
  title?: string
  initialMessage?: string
  suggestedQuestions?: QuestionSuggestion[]
  botResponses?: Record<string, string>
  className?: string
}

const DEFAULT_SUGGESTED_QUESTIONS: QuestionSuggestion[] = [
  {
    id: "what-is",
    text: "What is a viager?",
    category: "basics",
    followUp: ["process", "benefits", "right-for-me"],
  },
  {
    id: "process",
    text: "How does the process work?",
    category: "process",
    followUp: ["timeline", "guarantees", "right-for-me"],
  },
  {
    id: "right-for-me",
    text: "Is viager right for me?",
    category: "eligibility",
    followUp: ["benefits", "guarantees", "process"],
  },
  {
    id: "benefits",
    text: "What are the benefits?",
    category: "benefits",
    followUp: ["guarantees", "process", "timeline"],
  },
  {
    id: "guarantees",
    text: "What guarantees do I have?",
    category: "security",
    followUp: ["process", "timeline", "right-for-me"],
  },
  {
    id: "timeline",
    text: "How long does the process take?",
    category: "process",
    followUp: ["process", "guarantees", "right-for-me"],
  },
]

const DEFAULT_BOT_RESPONSES: Record<string, string> = {
  "what-is":
    "A viager is a unique French property transaction that allows you to unlock the value of your home while continuing to live in it. You receive an initial lump sum payment (bouquet) and regular monthly payments (rente) for life. This arrangement provides financial security while maintaining your right to stay in your home.",
  process:
    "The process is straightforward and secure:\n\n1. Initial Consultation: We assess your property and discuss your needs\n2. Valuation: Professional assessment of your property's market value\n3. Offer Creation: We calculate your payments\n4. Legal Review: Our experts handle all legal documentation\n5. Notarial Deed: Official completion with a notary\n\nOur team guides you through each step, ensuring you're fully informed and comfortable.",
  "right-for-me":
    "This could be ideal for you if you:\n\n• Own your property\n• Are aged 55 or older\n• Want to maintain independence in your home\n• Need additional regular income\n• Want to optimize your estate planning\n\nWe can provide a personalized assessment of your situation to help you make an informed decision.",
  benefits:
    "The benefits include:\n\n• Guaranteed lifetime right to stay in your home\n• Immediate lump sum payment plus monthly income\n• No maintenance fees or property taxes\n• Professional support throughout the process\n• Regulated and protected\n• Full transparency and no hidden costs",
  guarantees:
    "We provide robust guarantees:\n\n• Legal protection of your occupancy rights\n• Guaranteed monthly payments for life\n• Full regulatory compliance\n• Professional indemnity insurance\n• Transparent documentation and contracts",
  timeline:
    "The typical timeline from initial consultation to completion is 8-12 weeks. This includes:\n\n• Initial consultation (1-2 weeks)\n• Property valuation (1 week)\n• Offer preparation (1 week)\n• Legal processing (4-6 weeks)\n• Notarial completion (2 weeks)\n\nWe manage the entire process to ensure smooth progression.",
}

export function GuideBot({
  title: propTitle, // Renamed to avoid conflict with default value logic
  initialMessage = "Welcome! I'm your dedicated guide. I can help you understand our solutions and answer any questions you have. Feel free to ask or select from the suggested topics below.",
  suggestedQuestions = DEFAULT_SUGGESTED_QUESTIONS,
  botResponses = DEFAULT_BOT_RESPONSES,
  className = "",
}: GuideBotProps) {
  const { t } = useClientTranslation("ui_guidebot")
  const titleToDisplay = propTitle !== undefined ? propTitle : t("defaultTitle")

  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content: initialMessage,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [lastQuestionId, setLastQuestionId] = useState<string | null>(null)
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollElement = chatContainerRef.current
      // Direct control of the scrollTop
      scrollElement.scrollTop = scrollElement.scrollHeight
    }
  }

  // Use MutationObserver to detect DOM changes in the chat area
  useEffect(() => {
    if (chatContainerRef.current) {
      const observer = new MutationObserver(() => {
        scrollToBottom()
      })

      observer.observe(chatContainerRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      })

      return () => observer.disconnect()
    }
  }, [])

  // Scroll to bottom whenever messages change
  useEffect(() => {
    // Use RAF to ensure DOM has been painted
    requestAnimationFrame(() => {
      scrollToBottom()
    })
  }, [messages])

  // Scroll when suggestions or questions change
  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom()
    })
  }, [showSuggestions, lastQuestionId])

  const handleSendMessage = (
    content: string,
    isQuestion = false,
    questionId?: string
  ) => {
    setIsExpanded(true)
    setMessages((prev) => [...prev, { type: "user", content }])
    scrollToBottom()

    let botResponse: string
    if (isQuestion && questionId && botResponses[questionId]) {
      botResponse = botResponses[questionId]
      setLastQuestionId(questionId)
      setShowSuggestions(true)
      setAskedQuestions((prev) => new Set([...prev, questionId]))
    } else {
      botResponse =
        "Thank you for your question. Let me help you with that. To provide the most accurate information, could you please be more specific about what you'd like to know?"
      setLastQuestionId(null)
      setShowSuggestions(false)
    }

    // Add bot response with delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", content: botResponse }])
      requestAnimationFrame(() => {
        scrollToBottom()
      })
    }, 500)

    setInputValue("")
  }

  const getFollowUpQuestions = () => {
    if (!lastQuestionId) return []
    const currentQuestion = suggestedQuestions.find(
      (q) => q.id === lastQuestionId
    )
    return (
      currentQuestion?.followUp
        ?.map((id) => suggestedQuestions.find((q) => q.id === id))
        .filter((q) => q && !askedQuestions.has(q.id)) || []
    )
  }

  const getInitialQuestions = () => {
    return suggestedQuestions.filter((q) => !askedQuestions.has(q.id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      handleSendMessage(inputValue.trim())
    }
  }

  return (
    <Card
      className={`flex h-[590px] w-full flex-col rounded-2xl border-border bg-card/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-card hover:shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-2xl border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent p-6">
        <div className="rounded-full bg-primary/20 p-3 shadow-sm transition-transform duration-300 hover:scale-105">
          <Bot className="size-6 text-primary" />
        </div>
        <Typography className="text-card-foreground" variant="h3">
          {titleToDisplay}
        </Typography>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden px-6 pb-6">
        <div className="flex min-h-0 flex-1 flex-col">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto pr-4"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="min-h-[300px] space-y-4 pt-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`max-w-[80%] animate-fade-in rounded-lg px-4 py-2 shadow-sm ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/80 text-foreground backdrop-blur-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {!isExpanded && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {getInitialQuestions().map((question) => (
                    <Button
                      key={question.id}
                      className="border border-border/60 bg-secondary text-secondary-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/30"
                      variant="secondary"
                      onClick={() =>
                        handleSendMessage(question.text, true, question.id)
                      }
                    >
                      {question.text}
                    </Button>
                  ))}
                </div>
              )}

              {showSuggestions &&
                lastQuestionId &&
                getFollowUpQuestions().length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Typography
                      className="font-medium text-foreground"
                      variant="small"
                    >
                      Related questions:
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {getFollowUpQuestions().map(
                        (question) =>
                          question && (
                            <Button
                              key={question.id}
                              className="border border-border/60 bg-secondary text-secondary-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/30"
                              size="sm"
                              variant="default"
                              onClick={() =>
                                handleSendMessage(
                                  question.text,
                                  true,
                                  question.id
                                )
                              }
                            >
                              {question.text}
                            </Button>
                          )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                className="border-border bg-background pr-12 text-card-foreground"
                placeholder={t("ui_guidebot:inputPlaceholder")}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/80 transition-colors duration-200 hover:text-primary"
                disabled={!inputValue.trim()}
                size="icon"
                type="submit"
                variant="ghost"
              >
                <svg
                  className="size-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    fillRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Card>
  )
}

/*eslint-disable react/jsx-max-depth*/
/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
"use client"

import { useEffect, useRef, useState } from "react"

import { useChat } from "@ai-sdk/react"
import { Bot, ChevronUp, MessageSquare, Send, X } from "lucide-react"

import { Button } from "../Button/Button"
import { Card } from "../Card/Card"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../Drawer/Drawer"
import { Input } from "../Input/Input"
import { ScrollArea } from "../ScrollArea/ScrollArea"
import { Typography } from "../Typography/Typography"

interface QuestionSuggestion {
  id: string
  text: string
  category: string
  followUp?: string[]
}

export interface ChatBotProps {
  title?: string
  initialMessage?: string
  className?: string
  maxSteps?: number
  suggestedQuestions?: QuestionSuggestion[]
  botResponses?: Record<string, string>
  customButtonClass?: string
  header?: React.ReactNode
  messageBoxClassName?: string
  userMessageClassName?: string
}

// Add loading dots animation styles
const loadingDotsAnimation = `
  @keyframes loadingDots {
    0% { content: ""; }
    25% { content: "."; }
    50% { content: ".."; }
    75% { content: "..."; }
    100% { content: ""; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .loading-dots::after {
    content: "";
    animation: loadingDots 1.5s infinite;
  }
  
  .message-in {
    animation: fadeSlideIn 0.3s ease-out forwards;
  }

  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .pulse-glow {
    animation: pulse 2s infinite;
  }

  /* Custom Scrollbar Styles */
  .chat-scrollbar::-webkit-scrollbar {
    width: 4px;
  }

  .chat-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    margin: 1px;
  }

  .chat-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
    transition: background-color 0.2s ease;
  }

  .chat-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.7);
  }

  /* For Firefox */
  .chat-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
`

const formatBotMessage = (message: string) => {
  // Check for citations and sections
  const hasCitation =
    message.includes("Section:") || message.includes("Citation:")
  const hasSection = message.includes("---")

  // If no special formatting needed, return as is
  if (!hasCitation && !hasSection) {
    return message
  }

  // Handle sections if present
  if (hasSection) {
    const sections = message.split("---").map((section) => section.trim())
    return (
      <>
        {sections.map((section, index) => (
          <div
            key={index}
            className={index > 0 ? "mt-3 border-t border-border/40 pt-3" : ""}
          >
            {formatBotMessage(section)} {/* Recursively format each section */}
          </div>
        ))}
      </>
    )
  }

  // Handle citations
  const parts = message.split(/(?=Section:|Citation:)/)
  const mainContent = parts[0].trim()
  const citations = parts.slice(1).map((citation) => citation.trim())

  return (
    <>
      <div className="whitespace-pre-line">{mainContent}</div>
      {citations.length > 0 && (
        <div className="mt-2 space-y-1 border-t border-border/40 pt-1">
          {citations.map((citation, index) => (
            <div key={index} className="text-xs text-muted-foreground">
              {citation}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export function ChatBot({
  title = "Chatbot",
  initialMessage = "Hello! I'm your FAQ assistant. I can help answer questions about our products and services. What would you like to know?",
  className = "min-h-[400px] border border-muted shadow-lg sm:min-h-[500px]",
  maxSteps = 3,
  suggestedQuestions = [],
  customButtonClass = "rounded-xl text-xs border border-secondary bg-secondary/10 text-foreground hover:bg-secondary/20",
  header,
  messageBoxClassName = "rounded-lg bg-muted/80 shadow-md",
  userMessageClassName = "rounded-lg bg-primary text-foreground shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)]",
}: ChatBotProps) {
  // AI SDK chat hook
  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit: aiHandleSubmit,
    status,
  } = useChat({
    maxSteps,
  })

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set())
  const [lastQuestionId, setLastQuestionId] = useState<string | null>(null)
  const [showFollowUps, setShowFollowUps] = useState(false)
  const [showThinking, setShowThinking] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile drawer state
  const [isOpen, setIsOpen] = useState(false)

  // Effect to detect viewport width and set mobile state
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIsMobile()

    // Add resize listener
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Effect to listen for custom event to open mobile chatbot
  useEffect(() => {
    const handleOpenMobileChatbot = () => {
      if (isMobile) {
        setIsOpen(true)
      }
    }

    // Add event listener for opening mobile chatbot
    window.addEventListener("openMobileChatbot", handleOpenMobileChatbot)

    // Cleanup
    return () => {
      window.removeEventListener("openMobileChatbot", handleOpenMobileChatbot)
    }
  }, [isMobile])

  // Transform AI SDK messages to our format
  const combinedMessages = [
    ...(aiMessages.length > 0
      ? aiMessages
          .map((m) => ({
            type: m.role === "user" ? "user" : ("bot" as "user" | "bot"),
            content:
              m.content ||
              // Don't show tool invocations in the UI
              "",
          }))
          // Filter out empty bot messages (which would be tool invocations)
          .filter(
            (message) => !(message.type === "bot" && message.content === "")
          )
      : [{ type: "bot" as const, content: initialMessage }]),
  ]

  // Check if bot is thinking
  const isToolInvocation =
    aiMessages.length > 0 &&
    aiMessages[aiMessages.length - 1].role === "assistant" &&
    (!aiMessages[aiMessages.length - 1].content ||
      aiMessages[aiMessages.length - 1].content === "") &&
    (aiMessages[aiMessages.length - 1].toolInvocations ?? []).length > 0

  const isBotThinking = status === "submitted" || isToolInvocation

  // Effect to manage thinking state with a slight delay on hiding
  useEffect(() => {
    if (isBotThinking) {
      setShowThinking(true)
      // Hide suggestions immediately when thinking starts
      setShowSuggestions(false)
      setShowFollowUps(false)
    } else {
      // Add a slight delay before hiding the thinking indicator
      const timer = setTimeout(() => {
        setShowThinking(false)
        // Only show follow-ups after bot has responded and isn't thinking
        if (lastQuestionId && aiMessages.length > 1) {
          setShowFollowUps(true)
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isBotThinking, lastQuestionId, aiMessages.length])

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (isMobile) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } else if (chatContainerRef.current) {
      const scrollElement = chatContainerRef.current
      scrollElement.scrollTop = scrollElement.scrollHeight
    }
  }

  // Add the animation styles using useEffect to avoid hydration issues
  useEffect(() => {
    if (typeof document !== "undefined" && !styleRef.current) {
      const style = document.createElement("style")
      style.innerHTML = loadingDotsAnimation
      document.head.appendChild(style)
      styleRef.current = style

      return () => {
        if (styleRef.current) {
          document.head.removeChild(styleRef.current)
          styleRef.current = null
        }
      }
    }
  }, [])

  // Set up mutation observer for desktop view
  useEffect(() => {
    if (!isMobile && chatContainerRef.current) {
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
  }, [isMobile])

  // General scroll effect for both views
  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom()
    })
  }, [combinedMessages, showFollowUps])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      aiHandleSubmit(e)
      // Hide suggestions immediately when submitting
      setShowSuggestions(false)
      setShowFollowUps(false)

      // Open drawer if it's closed and on mobile
      if (isMobile && !isOpen) {
        setIsOpen(true)
      }
    }
  }

  const handleSuggestedQuestion = (
    questionId: string,
    questionText: string
  ) => {
    // Mark this question as asked and save as last question
    setAskedQuestions((prev) => new Set([...prev, questionId]))
    setLastQuestionId(questionId)

    // Set the input value directly - this updates the visible input field
    handleInputChange({
      target: { value: questionText },
    } as React.ChangeEvent<HTMLInputElement>)

    // Set a timeout to ensure the state is updated before submitting
    setTimeout(() => {
      // Submit the form using the ref
      if (formRef.current) {
        const submitEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        })
        formRef.current.dispatchEvent(submitEvent)
      } else {
        // Fallback if form element not found
        aiHandleSubmit(new Event("submit"))
      }
    }, 0)

    // Hide initial suggestions, will show follow-ups after response
    setShowSuggestions(false)
    setShowFollowUps(false)

    // Open drawer if it's closed and on mobile
    if (isMobile && !isOpen) {
      setIsOpen(true)
    }
  }

  // Get unasked questions
  const getUnaskedQuestions = () => {
    return suggestedQuestions.filter((q) => !askedQuestions.has(q.id))
  }

  // Get follow-up questions based on last question
  const getFollowUpQuestions = () => {
    if (!lastQuestionId) return []

    const currentQuestion = suggestedQuestions.find(
      (q) => q.id === lastQuestionId
    )
    if (!currentQuestion || !currentQuestion.followUp) return []

    return currentQuestion.followUp
      .map((id) => suggestedQuestions.find((q) => q.id === id))
      .filter((q): q is QuestionSuggestion => !!q && !askedQuestions.has(q.id))
  }

  // Chat content to be used in both desktop and mobile
  const renderChatContent = () => (
    <>
      {combinedMessages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} mb-3 md:mb-4`}
        >
          <div
            className={`message-in max-w-[85%] px-4 py-2.5 shadow-md transition-all duration-200 md:max-w-[80%] ${
              message.type === "user"
                ? userMessageClassName
                : `bg-muted/80 text-foreground backdrop-blur-sm hover:bg-muted/90 ${messageBoxClassName}`
            }`}
          >
            {message.type === "bot"
              ? formatBotMessage(message.content)
              : message.content}
          </div>
        </div>
      ))}

      {showThinking && (
        <div className="mb-3 flex justify-start md:mb-4">
          <div
            className={`max-w-[85%] rounded-2xl bg-muted/80 px-4 py-2.5 text-foreground shadow-md backdrop-blur-sm md:max-w-[80%] ${messageBoxClassName}`}
          >
            <span className="loading-dots">I&apos;m thinking</span>
          </div>
        </div>
      )}

      {showSuggestions &&
        !showThinking &&
        suggestedQuestions.length > 0 &&
        combinedMessages.length === 1 && (
          <div className="mt-4 space-y-3 md:mt-6">
            <Typography
              className="block font-bold text-foreground"
              variant="small"
            >
              Suggested questions:
            </Typography>
            <div className="flex flex-wrap gap-2">
              {getUnaskedQuestions().map((question) => (
                <Button
                  key={question.id}
                  className={`message-in justify-start whitespace-normal border border-border/60 bg-secondary text-left text-secondary-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-secondary/90 hover:shadow-md ${customButtonClass}`}
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleSuggestedQuestion(question.id, question.text)
                  }
                >
                  {question.text}
                </Button>
              ))}
            </div>
          </div>
        )}

      {showFollowUps && !showThinking && getFollowUpQuestions().length > 0 && (
        <div className="mt-4 space-y-3 md:mt-6">
          <Typography
            className="block font-medium text-foreground"
            variant="small"
          >
            Related questions:
          </Typography>
          <div className="flex flex-wrap gap-2">
            {getFollowUpQuestions().map((question) => (
              <Button
                key={question.id}
                className={`message-in justify-start whitespace-normal border border-border/60 bg-secondary text-left text-secondary-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-secondary/90 hover:shadow-md ${customButtonClass}`}
                size="sm"
                variant="secondary"
                onClick={() =>
                  handleSuggestedQuestion(question.id, question.text)
                }
              >
                {question.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isMobile && <div ref={messagesEndRef} />}
    </>
  )

  // Chat input form
  const renderChatForm = () => (
    <form ref={formRef} className="mt-3 md:mt-4" onSubmit={handleFormSubmit}>
      <div className="relative">
        <Input
          className="rounded-xl border-border/60 bg-background/80 pr-12 text-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
          disabled={isBotThinking}
          placeholder="Ask a question about our products or services..."
          value={input}
          onChange={handleInputChange}
        />
        <Button
          aria-label="Send message"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/80 transition-colors duration-200 hover:text-primary disabled:opacity-50"
          disabled={!input.trim() || isBotThinking}
          size="icon"
          type="submit"
          variant="ghost"
        >
          <Send className="size-4.5 md:size-5" />
        </Button>
      </div>
    </form>
  )

  // Desktop chat component
  if (!isMobile) {
    return (
      <Card
        className={`flex flex-col overflow-hidden border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 ${className}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b border-border/60 p-2 md:p-6 ${
            header ? "" : "bg-gradient-to-r from-primary/10 to-transparent"
          }`}
        >
          {header || (
            <div className="flex items-center gap-3">
              <div className="relative rounded-full bg-primary/20 p-2.5 shadow-md transition-transform duration-300 hover:scale-105 md:p-3">
                <Bot className="size-5 text-primary md:size-6" />
              </div>
              <Typography className="font-medium text-foreground" variant="h3">
                {title}
              </Typography>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-hidden bg-card/95 md:min-h-[400px] md:px-6 md:pb-6">
          <div className="flex min-h-0 flex-1 flex-col">
            <div
              ref={chatContainerRef}
              className="chat-scrollbar mb-1 max-h-[350px] flex-1 overflow-y-auto pr-1 md:max-h-[400px]"
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="space-y-4 py-2 pr-1 md:pt-4">
                {renderChatContent()}
              </div>
            </div>

            {renderChatForm()}
          </div>
        </div>
      </Card>
    )
  }

  // Mobile drawer component
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4">
      {!isOpen ? (
        <button
          aria-label="Open chat"
          className="flex w-full cursor-pointer items-center justify-between rounded-t-lg bg-primary p-2 text-primary-foreground shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center">
            <MessageSquare className="mr-2 size-5" />
            <span className="text-sm font-medium md:text-base">{title}</span>
          </div>
          <ChevronUp className="size-5" />
        </button>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="mt-16 h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] w-full max-w-full rounded-t-lg bg-card/95 px-2 transition-all duration-300 sm:max-w-[450px]">
            <DrawerHeader className="border-b px-4 py-2">
              <div className="flex items-center justify-between">
                <DrawerTitle className="flex items-center text-lg">
                  <Bot className="mr-2 size-5 text-primary" />
                  {title}
                </DrawerTitle>

                {/* Only show close button */}
                <div className="flex items-center gap-2">
                  <Button
                    aria-label="Close chat"
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="size-5" />
                  </Button>
                </div>
              </div>
            </DrawerHeader>

            <div className="grow overflow-hidden p-3">
              <ScrollArea className="h-full">
                <div className="space-y-4 pt-2">{renderChatContent()}</div>
              </ScrollArea>
            </div>

            <div className="border-t p-3">{renderChatForm()}</div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}

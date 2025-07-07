/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable react/self-closing-comp*/
"use client"

import { useState } from "react"
import { Button } from "@package/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@package/ui/avatar"
import { Textarea } from "@package/ui/textarea"
import { Badge } from "@package/ui/badge"
import { SendHorizontal, User, Users, Paperclip, FileText } from "lucide-react"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

// Mock conversation data
const conversations = [
  {
    id: "conv1",
    contact: {
      name: "Sarah Johnson",
      role: "Seller",
      avatar: "/mock/avatar-1.jpg",
      relationship: "Mother",
      isOnline: true,
    },
    lastMessage: {
      content: "I've uploaded the new valuation documents for your review",
      timestamp: "1 hour ago",
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
  },
  {
    id: "conv2",
    contact: {
      name: "Michael Wright",
      role: "Srenova Advisor",
      avatar: "/mock/avatar-2.jpg",
      isOnline: true,
    },
    lastMessage: {
      content: "I've scheduled a call with the valuer to discuss the report",
      timestamp: "3 hours ago",
      isRead: false,
      sender: "them",
    },
    unreadCount: 2,
  },
  {
    id: "conv3",
    contact: {
      name: "Emma Thompson",
      role: "Conveyancer",
      avatar: "/mock/avatar-3.jpg",
      isOnline: false,
    },
    lastMessage: {
      content: "Please review the property information form I sent earlier",
      timestamp: "Yesterday",
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
  },
]

// Mock message history for the selected conversation
const messageHistory = [
  {
    id: "msg1",
    sender: "them",
    content:
      "Hi there! I wanted to let you know that I've decided to sell my house with Srenova.",
    timestamp: "28 Mar, 10:23 AM",
    read: true,
  },
  {
    id: "msg2",
    sender: "you",
    content:
      "That's great news, Mom! I'm happy to help you through the process.",
    timestamp: "28 Mar, 10:30 AM",
    read: true,
  },
  {
    id: "msg3",
    sender: "them",
    content:
      "Thank you! The Srenova advisor has scheduled a valuation for tomorrow.",
    timestamp: "28 Mar, 11:45 AM",
    read: true,
  },
  {
    id: "msg4",
    sender: "you",
    content: "Do you want me to join the valuation appointment with you?",
    timestamp: "28 Mar, 12:10 PM",
    read: true,
  },
  {
    id: "msg5",
    sender: "them",
    content: "That would be wonderful if you're available. It's at 2pm.",
    timestamp: "28 Mar, 1:05 PM",
    read: true,
  },
  {
    id: "msg6",
    sender: "them",
    content:
      "I've uploaded the new valuation documents for your review. Can you take a look when you have time?",
    timestamp: "1 hour ago",
    read: true,
    attachments: [
      { id: "att1", name: "Valuation_Report.pdf", type: "PDF", size: "2.4 MB" },
    ],
  },
]

export function CommunicationCenter() {
  const { t } = useClientTranslation("family_communication")
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  )
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to an API
      setNewMessage("")
    }
  }

  return (
    <div className="flex h-[650px] rounded-md border">
      {/* Conversations sidebar */}
      <div className="w-1/3 border-r">
        <div className="border-b p-3">
          <h3 className="font-medium">{t("conversationsTitle")}</h3>
        </div>

        <div className="h-[calc(650px-3.5rem)] overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`cursor-pointer border-b p-3 hover:bg-muted/50 ${
                selectedConversation.id === conversation.id ? "bg-muted" : ""
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={conversation.contact.avatar}
                      alt={conversation.contact.name}
                    />
                    <AvatarFallback>
                      {conversation.contact.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.contact.isOnline && (
                    <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-green-500"></div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="truncate font-medium">
                        {conversation.contact.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="px-1 py-0 text-xs">
                          {conversation.contact.role}
                        </Badge>
                        {conversation.contact.relationship && (
                          <Badge
                            variant="outline"
                            className="border-blue-200 bg-blue-50 px-1 py-0 text-xs text-blue-700"
                          >
                            {conversation.contact.relationship}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {conversation.lastMessage.timestamp}
                    </div>
                  </div>

                  <div className="mt-1 flex justify-between">
                    <p
                      className={`truncate text-sm ${
                        !conversation.lastMessage.isRead
                          ? "font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {conversation.lastMessage.sender === "you" ? "You: " : ""}
                      {conversation.lastMessage.content}
                    </p>

                    {conversation.unreadCount > 0 && (
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                        <span className="text-xs text-primary-foreground">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={selectedConversation.contact.avatar}
                alt={selectedConversation.contact.name}
              />
              <AvatarFallback>
                {selectedConversation.contact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  {selectedConversation.contact.name}
                </h3>
                {selectedConversation.contact.isOnline && (
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700"
                  >
                    Online
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedConversation.contact.role}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label={t("profileButtonLabel")}
            >
              <User className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("participantsButtonLabel")}
            >
              <Users className="size-4" />
            </Button>
          </div>
        </div>

        {/* Message history */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messageHistory.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === "you"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                } rounded-lg p-3`}
              >
                <div className="space-y-2">
                  <p>{message.content}</p>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-2 rounded bg-background/80 p-2"
                        >
                          <FileText className="size-4 text-blue-500" />
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.type} • {attachment.size}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            {t("viewButton")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className={`mt-1 text-xs ${
                    message.sender === "you"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp}{" "}
                  {message.read && message.sender === "you" && "• Read"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="border-t p-3">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder={t("inputPlaceholder")}
              className="min-h-10 resize-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <div className="flex shrink-0 gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label={t("attachButtonLabel")}
              >
                <Paperclip className="size-4" />
              </Button>
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <SendHorizontal className="mr-1 size-4" />
                {t("sendButton")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

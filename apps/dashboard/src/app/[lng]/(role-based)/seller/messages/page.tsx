"use client"
/*eslint-disable sort-imports*/
/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable react/jsx-max-depth*/
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { ScrollArea } from "@package/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@package/ui/avatar"
import { Send } from "lucide-react"
import { formatDistance } from "date-fns"

// Mock data - In a real app, this would come from an API
const mockMessages = [
  {
    id: 1,
    sender: {
      id: 1,
      name: "John Smith",
      role: "FUND_BUYER",
      avatar: "/avatars/john-smith.jpg",
    },
    content:
      "Hi, I'm interested in your property at 123 Main St. Would you be open to discussing the details?",
    createdAt: "2024-04-03T10:00:00Z",
    read: true,
  },
  {
    id: 2,
    sender: {
      id: 2,
      name: "Sarah Wilson",
      role: "CONVEYANCER",
      avatar: "/avatars/sarah-wilson.jpg",
    },
    content:
      "I've reviewed the property documents you submitted. Everything looks good, but we need a few additional documents.",
    createdAt: "2024-04-03T11:30:00Z",
    read: false,
  },
  {
    id: 3,
    sender: {
      id: 3,
      name: "Michael Brown",
      role: "VALUER",
      avatar: "/avatars/michael-brown.jpg",
    },
    content:
      "Your property valuation is complete. I've uploaded the report to your documents section.",
    createdAt: "2024-04-03T14:15:00Z",
    read: false,
  },
]

const mockContacts = [
  {
    id: 1,
    name: "John Smith",
    role: "Fund Buyer",
    avatar: "/avatars/john-smith.jpg",
    lastMessage: "Hi, I'm interested in your property...",
    lastMessageTime: "2024-04-03T10:00:00Z",
    unreadCount: 0,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    role: "Conveyancer",
    avatar: "/avatars/sarah-wilson.jpg",
    lastMessage: "I've reviewed the property documents...",
    lastMessageTime: "2024-04-03T11:30:00Z",
    unreadCount: 1,
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Valuer",
    avatar: "/avatars/michael-brown.jpg",
    lastMessage: "Your property valuation is complete...",
    lastMessageTime: "2024-04-03T14:15:00Z",
    unreadCount: 1,
  },
]

export default function MessagesPage() {
  const { t } = useClientTranslation("seller_messages")
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">{t("pageTitle")}</h1>
        <p className="text-muted-foreground">{t("pageDescription")}</p>
      </div>

      <div className="grid h-[calc(100vh-12rem)] grid-cols-12 gap-6">
        {/* Contacts List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("conversationsTitle")}</CardTitle>
            <CardDescription>{t("conversationsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {mockContacts.map((contact) => (
                <button
                  key={contact.id}
                  className="relative flex w-full items-start gap-3 p-4 transition-colors hover:bg-muted/50"
                >
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {contact.role}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistance(
                          new Date(contact.lastMessageTime),
                          new Date(),
                          { addSuffix: true }
                        )}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {contact.lastMessage}
                    </p>
                  </div>
                  {contact.unreadCount > 0 && (
                    <div className="absolute right-4 top-4 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {contact.unreadCount}
                    </div>
                  )}
                </button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="col-span-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={mockContacts[0].avatar}
                  alt={mockContacts[0].name}
                />
                <AvatarFallback>
                  {mockContacts[0].name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{mockContacts[0].name}</CardTitle>
                <CardDescription>{mockContacts[0].role}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-24rem)] px-4">
              <div className="space-y-4 py-4">
                {mockMessages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <Avatar>
                      <AvatarImage
                        src={message.sender.avatar}
                        alt={message.sender.name}
                      />
                      <AvatarFallback>
                        {message.sender.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{message.sender.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistance(
                              new Date(message.createdAt),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="mt-1">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t("seller_messages:inputPlaceholder")}
                  className="flex-1"
                />
                <Button>
                  <Send className="mr-2 size-4" />
                  {t("seller_messages:sendButton")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

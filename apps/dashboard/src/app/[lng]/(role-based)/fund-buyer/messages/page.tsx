/*eslint-disable react/jsx-sort-props*/
/*eslint-disable no-nested-ternary*/
/*eslint-disable import/order*/
/*eslint-disable sort-imports*/
"use client"

import { useState } from "react"
import { Card, CardContent } from "@package/ui/card"
import { Input } from "@package/ui/input"
import { Button } from "@package/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Badge } from "@package/ui/badge"
import { Clock, Building2, MessageCircle, Search, User } from "lucide-react"

interface Message {
  id: string
  sender: string
  senderType: "SELLER" | "SUPPORT" | "SYSTEM"
  content: string
  timestamp: string
  read: boolean
  buyBoxName?: string
}

const mockMessages: Message[] = [
  {
    id: "msg-1",
    sender: "John Smith",
    senderType: "SELLER",
    content:
      "I've reviewed your offer for the London properties. Can we discuss the terms?",
    timestamp: "2024-03-10T14:30:00Z",
    read: false,
    buyBoxName: "London Residential Portfolio A",
  },
  {
    id: "msg-2",
    sender: "Support Team",
    senderType: "SUPPORT",
    content:
      "Your contract for Manchester Commercial Bundle is ready for review.",
    timestamp: "2024-03-09T11:15:00Z",
    read: true,
    buyBoxName: "Manchester Commercial Bundle",
  },
  {
    id: "msg-3",
    sender: "System",
    senderType: "SYSTEM",
    content:
      "New property match found for your active buy box 'Birmingham Mixed Use Development'",
    timestamp: "2024-03-08T09:00:00Z",
    read: true,
    buyBoxName: "Birmingham Mixed Use Development",
  },
]

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "sellers" | "support">(
    "all"
  )
  const [searchQuery, setSearchQuery] = useState("")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    }
  }

  const filteredMessages = mockMessages.filter(
    (message) =>
      (activeTab === "all" ||
        (activeTab === "sellers" && message.senderType === "SELLER") ||
        (activeTab === "support" && message.senderType === "SUPPORT")) &&
      (message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (message.buyBoxName &&
          message.buyBoxName.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with sellers and support team
          </p>
        </div>
        <Button>
          <MessageCircle className="mr-2 size-4" />
          New Message
        </Button>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) =>
          setActiveTab(value as "all" | "sellers" | "support")
        }
      >
        <TabsList>
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredMessages.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No messages found
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`cursor-pointer p-4 transition-colors hover:bg-accent ${
                        !message.read ? "bg-accent/5" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex grow items-start gap-3">
                          <div className={`rounded-full bg-accent p-2`}>
                            {message.senderType === "SELLER" ? (
                              <User className="size-4" />
                            ) : message.senderType === "SUPPORT" ? (
                              <MessageCircle className="size-4" />
                            ) : (
                              <Building2 className="size-4" />
                            )}
                          </div>
                          <div className="grow space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">
                                {message.sender}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="size-3" />
                                {formatDate(message.timestamp)}
                              </div>
                            </div>
                            {message.buyBoxName && (
                              <Badge variant="secondary" className="mb-1">
                                {message.buyBoxName}
                              </Badge>
                            )}
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/

"use client"

import { useState } from "react"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import {
  Clock,
  Home,
  Check,
  CalendarDays,
  Clipboard,
  FileText,
  Users,
} from "lucide-react"
import Image from "next/image"
import { Progress } from "@package/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@package/ui/tooltip"

// Mock property data
const property = {
  id: "prop-123",
  address: "15 Willow Avenue, Manchester, M20 1FD",
  status: "valuation",
  progress: 35,
  timeline: [
    {
      date: "12 Mar 2024",
      event: "Property listed",
      completed: true,
      icon: Home,
    },
    {
      date: "20 Mar 2024",
      event: "Valuation requested",
      completed: true,
      icon: Clipboard,
    },
    {
      date: "27 Mar 2024",
      event: "Valuation in progress",
      completed: false,
      icon: Users,
    },
    { date: "TBD", event: "Offers review", completed: false, icon: FileText },
    { date: "TBD", event: "Sale agreed", completed: false, icon: Check },
    { date: "TBD", event: "Completion", completed: false, icon: CalendarDays },
  ],
  documents: [
    {
      id: "doc1",
      name: "Property Particulars",
      type: "PDF",
      date: "12 Mar 2024",
    },
    { id: "doc2", name: "EPC Certificate", type: "PDF", date: "14 Mar 2024" },
    { id: "doc3", name: "Floor Plan", type: "JPG", date: "12 Mar 2024" },
  ],
  nextMilestone: {
    event: "Valuation report",
    expectedDate: "4 Apr 2024",
  },
}

export function PropertyTracker() {
  const [activeSection, setActiveSection] = useState<"timeline" | "documents">(
    "timeline"
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{property.address}</h3>
          <div className="mt-1 flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-blue-700"
            >
              {`Sarah's Property`}
            </Badge>
            <Badge className="bg-amber-500">Valuation</Badge>
          </div>
        </div>
        <Button variant="outline">Contact Srenova</Button>
      </div>

      <div className="relative h-48 w-full overflow-hidden rounded-md">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black/50" />
        <div className="absolute bottom-4 left-4 z-20">
          <Badge className="bg-white text-black">3 Bedroom Semi-Detached</Badge>
        </div>
        <Image
          src="/mock/property-1.jpg"
          alt="Property exterior"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Overall Progress
            </span>
          </div>
          <span className="font-medium">{property.progress}%</span>
        </div>
        <Progress value={property.progress} className="h-2" />
      </div>

      <div className="rounded-md border">
        <div className="flex border-b">
          <button
            className={`flex-1 p-3 text-center font-medium ${
              activeSection === "timeline" ? "border-b-2 border-primary" : ""
            }`}
            onClick={() => setActiveSection("timeline")}
          >
            Timeline
          </button>
          <button
            className={`flex-1 p-3 text-center font-medium ${
              activeSection === "documents" ? "border-b-2 border-primary" : ""
            }`}
            onClick={() => setActiveSection("documents")}
          >
            Documents
          </button>
        </div>

        <div className="p-4">
          {activeSection === "timeline" ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                <div className="rounded-full bg-primary p-2">
                  <Clock className="size-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">
                    Next milestone: {property.nextMilestone.event}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expected: {property.nextMilestone.expectedDate}
                  </p>
                </div>
              </div>

              <div className="relative">
                {property.timeline.map((item, index) => (
                  <div key={index} className="relative mb-6">
                    {index < property.timeline.length - 1 && (
                      <div
                        className={`absolute left-[14px] top-6 h-14 w-0.5 ${
                          item.completed ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 rounded-full p-1 ${item.completed ? "bg-primary" : "bg-muted"}`}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <item.icon
                                  className={`size-4 ${item.completed ? "text-primary-foreground" : "text-muted-foreground"}`}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.event}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div>
                        <p className="font-medium">{item.event}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Documents shared by Sarah:
              </p>
              <div className="space-y-2">
                {property.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} • {doc.date}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  Request Additional Documents
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

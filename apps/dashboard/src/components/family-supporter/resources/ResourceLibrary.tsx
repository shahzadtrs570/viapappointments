/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/

"use client"

import { useState } from "react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Button } from "@package/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Input } from "@package/ui/input"
import { Badge } from "@package/ui/badge"
import {
  Search,
  BookOpen,
  CheckSquare,
  Calculator,
  Download,
  ChevronRight,
  Clock,
  BookMarked,
} from "lucide-react"

// Mock resources data
const resources = {
  guides: [
    {
      id: "guide1",
      title: "Supporting a Loved One's Property Sale",
      description:
        "How to provide emotional and practical support during the selling process.",
      category: "Emotional Support",
      readingTime: "8 min read",
      featured: true,
      image: "/mock/guide-1.jpg",
    },
    {
      id: "guide2",
      title: "Understanding Property Valuations",
      description:
        "A guide to how property valuations work and what factors affect them.",
      category: "Financial",
      readingTime: "12 min read",
      featured: false,
    },
    {
      id: "guide3",
      title: "Property Legal Terms Explained",
      description:
        "Simple explanations of complex legal terminology in property transactions.",
      category: "Legal",
      readingTime: "15 min read",
      featured: false,
    },
    {
      id: "guide4",
      title: "Downsizing Support Guide",
      description:
        "How to help your loved ones through the emotional journey of downsizing.",
      category: "Emotional Support",
      readingTime: "10 min read",
      featured: true,
      image: "/mock/guide-2.jpg",
    },
  ],
  checklists: [
    {
      id: "checklist1",
      title: "Property Viewing Companion Checklist",
      description:
        "Questions to ask and things to look for when viewing properties with your loved one.",
      itemCount: 15,
      category: "Viewing",
    },
    {
      id: "checklist2",
      title: "Document Preparation Checklist",
      description:
        "Essential documents your loved one needs for the selling process.",
      itemCount: 12,
      category: "Documents",
    },
    {
      id: "checklist3",
      title: "Moving Day Support Checklist",
      description:
        "Ways to help make moving day less stressful for your loved one.",
      itemCount: 18,
      category: "Moving",
    },
  ],
  tools: [
    {
      id: "tool1",
      title: "Cost Calculator",
      description: "Calculate the total costs involved in selling a property.",
      category: "Financial",
    },
    {
      id: "tool2",
      title: "Timeline Planner",
      description:
        "Create a personalized selling timeline with key milestones.",
      category: "Planning",
    },
    {
      id: "tool3",
      title: "Document Organizer",
      description: "Keep track of all important documents in one place.",
      category: "Documents",
    },
  ],
}

export function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="guides">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="size-4" />
            <span>Guides</span>
          </TabsTrigger>
          <TabsTrigger value="checklists" className="flex items-center gap-2">
            <CheckSquare className="size-4" />
            <span>Checklists</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Calculator className="size-4" />
            <span>Tools</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {resources.guides
                .filter((guide) => guide.featured)
                .map((guide) => (
                  <Card key={guide.id} className="overflow-hidden">
                    <div className="relative h-40 bg-gray-100">
                      {guide.image && (
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${guide.image})` }}
                        />
                      )}
                      <div className="absolute right-2 top-2">
                        <Badge className="bg-primary">Featured</Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between p-4 pt-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{guide.category}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 size-3" />
                          {guide.readingTime}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Read
                        <ChevronRight className="size-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>

            <h3 className="mt-6 font-medium">All Guides</h3>
            <div className="grid grid-cols-1 gap-3">
              {resources.guides.map((guide) => (
                <Card key={guide.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <BookMarked className="size-5 text-primary" />
                        <h4 className="font-medium">{guide.title}</h4>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {guide.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">{guide.category}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 size-3" />
                          {guide.readingTime}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="checklists" className="pt-4">
          <div className="grid grid-cols-1 gap-4">
            {resources.checklists.map((checklist) => (
              <Card key={checklist.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{checklist.title}</CardTitle>
                      <CardDescription>{checklist.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{checklist.category}</Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckSquare className="mr-1 size-4 text-primary" />
                    {checklist.itemCount} items
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 size-4" />
                      Download
                    </Button>
                    <Button size="sm">View</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {resources.tools.map((tool) => (
              <Card key={tool.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <div className="flex w-full items-center justify-between">
                    <Badge variant="outline">{tool.category}</Badge>
                    <Button>Open Tool</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-4 bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Need More Support?</CardTitle>
          <CardDescription>
            Our experts are available to provide guidance tailored to your
            specific situation.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline">Schedule a Support Call</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

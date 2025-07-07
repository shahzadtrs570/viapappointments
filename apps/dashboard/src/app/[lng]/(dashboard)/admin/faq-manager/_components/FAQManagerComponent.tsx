/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRef, useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@package/ui/alert-dialog"
import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Input } from "@package/ui/input"
import { Separator } from "@package/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { toast } from "@package/ui/toast"
import { ChevronLeft, ChevronRight, Loader2, Trash2 } from "lucide-react"

interface FAQ {
  section: string
  subsection: string | null
  question: string
  answer: string
  vector?: any
}

export function FAQManagerComponent() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")
  const [currentPage, setCurrentPage] = useState(1)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const itemsPerPage = 5
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsedFaqs = JSON.parse(content) as FAQ[]
        setFaqs(parsedFaqs)
        setCurrentPage(1)
        toast({
          title: "FAQ file loaded successfully",
        })
        setActiveTab("preview")
      } catch (error) {
        console.error("Error parsing JSON file:", error)
        toast({
          title: "Failed to parse JSON file. Please check the format.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    reader.onerror = () => {
      toast({
        title: "Error reading file",
      })
      setIsLoading(false)
    }

    reader.readAsText(file)
  }

  const handleVectorize = () => {
    if (faqs.length === 0) {
      toast({
        title: "Please load FAQ data first",
      })
      return
    }

    setShowConfirmDialog(true)
  }

  const processVectorization = async () => {
    setShowConfirmDialog(false)
    setIsProcessing(true)

    try {
      // Proceed with vectorization with replaceExisting flag set to true
      const response = await fetch("/api/vectorize-faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faqs,
          replaceExisting: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to vectorize FAQ data")
      }

      const result = await response.json()
      toast({
        title: result.message || "FAQs vectorized successfully",
      })
    } catch (error) {
      console.error("Error vectorizing FAQs:", error)
      toast({
        title: "Failed to vectorize FAQs. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const totalPages = Math.ceil(faqs.length / itemsPerPage)
  const paginatedFaqs = faqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload FAQ Data</CardTitle>
          <CardDescription>
            Upload a JSON file containing FAQ data with sections, questions, and
            answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              accept=".json"
              className="max-w-md"
              disabled={isLoading}
              type="file"
              onChange={handleFileUpload}
            />
            {isLoading && <Loader2 className="size-5 animate-spin" />}
          </div>
        </CardContent>
      </Card>

      {faqs.length > 0 && (
        <Tabs
          className="space-y-4"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="preview">
            <Card>
              <CardHeader>
                <CardTitle>FAQ Preview</CardTitle>
                <CardDescription>
                  Showing page {currentPage} of {totalPages} ({faqs.length}{" "}
                  total entries)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {paginatedFaqs.map((faq, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="text-lg font-semibold text-primary">
                        {faq.question}
                      </h3>
                      <p className="text-sm">{faq.answer}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Section: {faq.section}</span>
                        {faq.subsection && (
                          <span>• Subsection: {faq.subsection}</span>
                        )}
                      </div>
                      {index < paginatedFaqs.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    disabled={currentPage === 1}
                    size="sm"
                    variant="outline"
                    onClick={goToPreviousPage}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    disabled={currentPage === totalPages}
                    size="sm"
                    variant="outline"
                    onClick={goToNextPage}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
                <Button
                  className="w-full sm:w-auto"
                  disabled={isProcessing}
                  onClick={handleVectorize}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 size-4" />
                      Vectorize and Replace FAQs
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent className="space-y-4" value="structure">
            <Card>
              <CardHeader>
                <CardTitle>FAQ Structure</CardTitle>
                <CardDescription>
                  Analysis of FAQ sections and organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(faqs.map((faq) => faq.section))).map(
                    (section, index) => {
                      const sectionFaqs = faqs.filter(
                        (faq) => faq.section === section
                      )
                      const subsections = Array.from(
                        new Set(
                          sectionFaqs
                            .map((faq) => faq.subsection)
                            .filter(Boolean)
                        )
                      )

                      return (
                        <div key={index} className="space-y-2">
                          <h3 className="font-medium text-primary">
                            {section}
                          </h3>
                          <p className="text-sm">
                            Questions: {sectionFaqs.length}
                          </p>

                          {subsections.length > 0 && (
                            <div className="ml-4 space-y-2">
                              <p className="text-sm font-medium">
                                Subsections:
                              </p>
                              <ul className="list-inside list-disc space-y-1">
                                {subsections.map((subsection, idx) => (
                                  <li key={idx} className="text-sm">
                                    {subsection} (
                                    {
                                      faqs.filter(
                                        (faq) => faq.subsection === subsection
                                      ).length
                                    }{" "}
                                    questions)
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {index <
                            Array.from(new Set(faqs.map((faq) => faq.section)))
                              .length -
                              1 && <Separator className="my-2" />}
                        </div>
                      )
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vectorize and Replace FAQs?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all existing FAQ embeddings and resources before
              creating new ones. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={processVectorization}
            >
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

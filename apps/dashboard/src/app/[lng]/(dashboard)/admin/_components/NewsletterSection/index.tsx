"use client"

import { useState } from "react"

import { Button } from "@package/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { toast } from "@package/ui/toast"
import { RefreshCcw } from "lucide-react"

import { api } from "@/lib/trpc/react"

// Import components from extracted files
import { FilterControls } from "./FilterControls"
import {
  type NewsletterStatistics,
  StatisticsContent,
} from "./StatisticsComponents"
import { type Subscriber, SubscribersTable } from "./SubscriberComponents"

export function AdminNewsletterSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [source, setSource] = useState<string | undefined>(undefined)
  const [isActive, setIsActive] = useState<boolean | undefined>(true)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv")

  // Get subscribers data
  const { data, isLoading, refetch } = api.newsletter.getSubscribers.useQuery({
    search: searchQuery || undefined,
    isActive,
    limit: pageSize,
    cursor: page > 0 ? `page_${page}` : undefined,
  })

  // Explicitly type the subscribers data
  const subscribers: Subscriber[] = data?.subscribers || []

  // Create pagination data from API response
  const paginationData = {
    totalItems: data?.totalCount || 0,
    totalPages: Math.ceil((data?.totalCount || 0) / pageSize),
    hasNextPage: !!data?.nextCursor,
    hasPreviousPage: page > 0,
  }

  // Get statistics data
  const {
    data: statistics,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = api.newsletter.getStatistics.useQuery() as {
    data: NewsletterStatistics | undefined
    isLoading: boolean
    isError: boolean
    refetch: () => void
  }

  // Define the export mutation
  const exportMutation = api.newsletter.exportSubscribers.useMutation({
    onSuccess: (data) => {
      // Create a download link for the exported data
      const blob = new Blob([data.data], {
        type: exportFormat === "csv" ? "text/csv" : "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `newsletter-subscribers.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    onError: () => {
      // Handle error silently or use a toast notification instead
    },
  })

  // Then call it when needed
  const handleExport = async (format: "csv" | "json") => {
    setExportFormat(format)
    await exportMutation.mutateAsync({
      format,
      isActive,
    })
  }

  // Helper function for export button text
  const renderExportButtonText = (format: "csv" | "json") => {
    if (exportMutation.isPending && exportFormat === format) {
      return "Exporting..."
    }
    return `Export ${format.toUpperCase()}`
  }

  // Get unique sources for the filter dropdown
  const sources =
    statistics?.sourceStats.map(
      (stat: { source: string | null; count: number }) =>
        stat.source || "Website"
    ) || []

  // Function to handle refresh
  const handleRefresh = async () => {
    try {
      await refetch()
      toast({
        title: "Data refreshed",
        description:
          "The subscribers list has been updated with the latest data.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Newsletter Management</CardTitle>
          <div className="flex space-x-2">
            <Button
              disabled={isLoading}
              size="icon"
              title="Refresh data"
              variant="outline"
              onClick={handleRefresh}
            >
              <RefreshCcw
                className={`size-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              disabled={exportMutation.isPending}
              variant="outline"
              onClick={() => handleExport("csv")}
            >
              {renderExportButtonText("csv")}
            </Button>
            <Button
              disabled={exportMutation.isPending}
              variant="outline"
              onClick={() => handleExport("json")}
            >
              {renderExportButtonText("json")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FilterControls
          isActive={isActive}
          searchQuery={searchQuery}
          setIsActive={setIsActive}
          setSearchQuery={setSearchQuery}
          setSource={setSource}
          source={source}
          sources={sources}
        />

        <Tabs className="space-y-4" defaultValue="subscribers">
          <TabsList>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent className="space-y-4" value="subscribers">
            <SubscribersTable
              data={paginationData}
              isLoading={isLoading}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              subscribers={subscribers}
            />
          </TabsContent>
          <TabsContent className="space-y-4" value="statistics">
            <StatisticsContent
              refetchStats={refetchStats}
              statistics={statistics || null}
              statsError={statsError}
              statsLoading={statsLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

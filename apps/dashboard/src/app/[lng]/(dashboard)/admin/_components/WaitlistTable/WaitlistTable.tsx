"use client"

import { useEffect, useState } from "react"

import { Button } from "@package/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { DataTable } from "@package/ui/data-table"
import { Input } from "@package/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Spinner } from "@package/ui/spinner"
import { useToast } from "@package/ui/toast"
import { Download } from "lucide-react"

import type { PaginationState } from "@tanstack/react-table"

import { api } from "@/lib/trpc/react"

import { waitlistColumns } from "./waitlistTableColumns"

const ITEMS_PER_PAGE = 10

export function WaitlistTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
  })
  const [waitlistType, setWaitlistType] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const waitlistQuery = api.waitlist.getEntries.useQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    waitlistType:
      waitlistType === "all" ? undefined : waitlistType || undefined,
    status: status === "all" ? undefined : status || undefined,
    query: debouncedSearch || undefined,
  })

  const exportMutation = api.waitlist.export.useMutation({
    onSuccess: (data) => {
      const blob = new Blob([data], {
        type: exportFormat === "csv" ? "text/csv" : "application/json",
      })
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `waitlist-export-${new Date().toISOString().split("T")[0]}.${exportFormat}`
      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export successful",
        description: "Your waitlist data has been exported successfully.",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Export failed",
        description:
          error.message || "Failed to export waitlist data. Please try again.",
      })
    },
  })

  const handleExport = () => {
    exportMutation.mutate({
      waitlistType:
        waitlistType === "all" ? undefined : waitlistType || undefined,
      status: status === "all" ? undefined : status || undefined,
      format: exportFormat,
    })
  }

  const entries = waitlistQuery.data?.entries ?? []
  const totalPages = Math.ceil(
    (waitlistQuery.data?.total ?? 0) / pagination.pageSize
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Waitlist Entries</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={exportFormat}
              onValueChange={(value: "csv" | "json") => setExportFormat(value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
            <Button
              disabled={exportMutation.isPending}
              size="sm"
              variant="outline"
              onClick={handleExport}
            >
              {exportMutation.isPending ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 size-4" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Input
              className="max-w-sm"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Select value={waitlistType} onValueChange={setWaitlistType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="beta">Beta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative">
          {(waitlistQuery.isLoading || waitlistQuery.isFetching) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
              <Spinner className="size-8" />
            </div>
          )}
          <DataTable
            columnToggle
            showPagination
            columns={waitlistColumns}
            data={entries}
            customPagination={{
              pagination,
              setPagination,
              hasMore: pagination.pageIndex < totalPages - 1,
              totalPages,
            }}
            initialState={{
              columnVisibility: {
                id: false,
                name: true,
                email: true,
                waitlistType: true,
                status: true,
                source: true,
                referralCode: false,
                createdAt: true,
                notes: true,
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

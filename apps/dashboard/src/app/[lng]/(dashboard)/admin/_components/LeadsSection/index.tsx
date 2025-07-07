"use client"

import { useState } from "react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"

import type { Lead } from "./types"
import type { LeadStatus } from "@package/db"

import { api } from "@/lib/trpc/react"

import { LeadDetailsDialog } from "./LeadDetailsDialog"
import { createColumns } from "./LeadTableColumnDefinitions"
import { LeadsBySourceCard, LeadsByStatusCard, StatCard } from "./StatCards"

export function AdminLeadsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | undefined>(
    undefined
  )
  const [selectedLeadType, setSelectedLeadType] = useState<string | undefined>(
    undefined
  )
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv")

  // Get leads data
  const { data, isLoading, refetch } = api.leads.getLeads.useQuery({
    status: selectedStatus,
    leadType: selectedLeadType,
    search: searchQuery || undefined,
    limit: pageSize,
    cursor: page > 0 ? `page_${page}` : undefined,
  })

  // Get statistics data
  const { data: statistics } = api.leads.getStatistics.useQuery()

  // Export leads mutation
  const exportLeadsMutation = api.leads.exportLeads.useMutation({
    onSuccess: (data) => {
      // Create a download link for the exported data
      const blob = new Blob([data.data], {
        type: exportFormat === "csv" ? "text/csv" : "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `leads-export.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    onError: () => {
      // Handle error silently or use a toast notification instead
    },
  })

  const handleExport = async (format: "csv" | "json") => {
    setExportFormat(format)
    await exportLeadsMutation.mutateAsync({
      format,
      status: selectedStatus,
      leadType: selectedLeadType,
    })
  }

  const handleRowClick = (row: Lead) => {
    setSelectedLeadId(row.id)
  }

  const handleDialogClose = () => {
    setSelectedLeadId(null)
    void refetch()
  }

  // Define columns for the data table
  const columns = createColumns(handleRowClick)

  // Get unique lead types for the filter dropdown
  const leadTypes = Array.from(
    new Set((data?.leads || []).map((lead) => lead.leadType as string))
  )

  // Prepare status options
  const statusOptions = [
    { value: "NEW", label: "New" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "CONVERTED", label: "Converted" },
    { value: "DISQUALIFIED", label: "Disqualified" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lead Management</CardTitle>
          <div className="flex space-x-2">
            <Button
              disabled={exportLeadsMutation.isPending}
              variant="outline"
              onClick={() => void handleExport("csv")}
            >
              {exportLeadsMutation.isPending && exportFormat === "csv"
                ? "Exporting..."
                : "Export CSV"}
            </Button>
            <Button
              disabled={exportLeadsMutation.isPending}
              variant="outline"
              onClick={() => void handleExport("json")}
            >
              {exportLeadsMutation.isPending && exportFormat === "json"
                ? "Exporting..."
                : "Export JSON"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Input
              className="max-w-sm"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Select
              value={selectedStatus || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedStatus(undefined)
                } else {
                  setSelectedStatus(value as LeadStatus)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {leadTypes.length > 0 && (
            <div>
              <Select
                value={selectedLeadType || "all"}
                onValueChange={(value) =>
                  setSelectedLeadType(value === "all" ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lead Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {leadTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Tabs className="space-y-4" defaultValue="leads">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent className="space-y-4" value="leads">
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
                  <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
              <DataTable
                columns={columns}
                data={data?.leads || []}
                customPagination={{
                  pagination: {
                    pageIndex: page,
                    pageSize,
                  },
                  setPagination: (p) => {
                    if (typeof p === "function") {
                      const newState = p({ pageIndex: page, pageSize })
                      setPage(newState.pageIndex)
                      setPageSize(newState.pageSize)
                    } else {
                      setPage(p.pageIndex)
                      setPageSize(p.pageSize)
                    }
                  },
                  hasMore: !!data?.nextCursor,
                  totalPages: data?.nextCursor ? page + 2 : page + 1,
                }}
              />
            </div>
          </TabsContent>
          <TabsContent className="space-y-4" value="statistics">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatCard
                description="From all sources"
                title="Total Leads"
                value={statistics?.totalLeads || 0}
              />
              <StatCard
                description="Based on leads from the past 7 days"
                title="New Leads (Last 30 Days)"
                value={statistics?.recentLeads.length || 0}
              />
              <StatCard
                description="From lead to customer"
                title="Conversion Rate"
                value={
                  statistics?.conversionRate !== undefined
                    ? `${statistics.conversionRate}%`
                    : "N/A"
                }
              />
            </div>

            {statistics?.leadsBySource &&
              statistics.leadsBySource.length > 0 && (
                <LeadsBySourceCard
                  sources={statistics.leadsBySource}
                  title="Leads by Source"
                  totalLeads={statistics.totalLeads}
                />
              )}

            {statistics?.leadsByStatus &&
              statistics.leadsByStatus.length > 0 && (
                <LeadsByStatusCard
                  statuses={statistics.leadsByStatus}
                  title="Leads by Status"
                  totalLeads={statistics.totalLeads}
                />
              )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {selectedLeadId && (
        <LeadDetailsDialog
          leadId={selectedLeadId}
          open={!!selectedLeadId}
          onOpenChange={(open) => {
            if (!open) handleDialogClose()
          }}
        />
      )}
    </Card>
  )
}

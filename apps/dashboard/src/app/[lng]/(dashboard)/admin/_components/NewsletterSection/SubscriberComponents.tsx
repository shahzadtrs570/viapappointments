import { useState } from "react"

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
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { DataTable } from "@package/ui/data-table"
import { Switch } from "@package/ui/switch"
import { toast } from "@package/ui/toast"
import { Trash2 } from "lucide-react"

import { api } from "@/lib/trpc/react"

// Define type for subscriber
export type Subscriber = {
  id: string
  email: string
  name?: string | null
  source?: string | null
  isActive: boolean
  subscribedAt: Date
  updatedAt: Date
  metadata?: unknown
  tags?: string[]
  unsubscribeToken?: string | null
}

// Define interface for pagination data
interface PaginationData {
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Columns for the subscribers data table
export const columns = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({
      row,
    }: {
      row: { getValue: (key: string) => string | null | undefined }
    }) => {
      const name = row.getValue("name")
      return name || "-"
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({
      row,
    }: {
      row: { getValue: (key: string) => string | null | undefined }
    }) => {
      const source = row.getValue("source")
      return source || "Website"
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }: { row: { original: Subscriber } }) => {
      const tags = row.original.tags || []
      return (
        <div className="flex flex-wrap gap-1">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "subscribedAt",
    header: "Subscribed On",
    cell: ({ row }: { row: { getValue: (key: string) => string | Date } }) => {
      const date = new Date(row.getValue("subscribedAt"))
      return (
        <div>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated On",
    cell: ({ row }: { row: { getValue: (key: string) => string | Date } }) => {
      const date = new Date(row.getValue("updatedAt"))
      return (
        <div>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      )
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }: { row: { original: Subscriber } }) => {
      const subscriber = row.original
      return <StatusToggle subscriber={subscriber} />
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: Subscriber } }) => {
      const subscriber = row.original
      return <DeleteButton subscriber={subscriber} />
    },
  },
]

// Component for status toggle
export function StatusToggle({ subscriber }: { subscriber: Subscriber }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const utils = api.useContext()

  // Toggle activation mutation
  const toggleActivationMutation = api.newsletter.updateSubscriber.useMutation({
    onSuccess: (data) => {
      toast({
        title: data.isActive
          ? "Subscriber activated"
          : "Subscriber deactivated",
        description: `The subscriber has been ${data.isActive ? "activated" : "deactivated"} successfully.`,
      })
      void utils.newsletter.getSubscribers.invalidate()
      void utils.newsletter.getStatistics.invalidate()
    },
    onError: (error: { message?: string }) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscriber status.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsProcessing(false)
    },
  })

  const handleToggleActivation = (checked: boolean) => {
    setIsProcessing(true)
    void toggleActivationMutation.mutate({
      subscriberId: subscriber.id,
      isActive: checked,
    })
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Switch
        aria-label={subscriber.isActive ? "Active" : "Inactive"}
        checked={subscriber.isActive}
        disabled={isProcessing}
        onCheckedChange={handleToggleActivation}
      />
      <span className="text-sm text-muted-foreground">
        {subscriber.isActive ? "Active" : "Inactive"}
      </span>
    </div>
  )
}

// Component to display subscriber info in deletion dialog
function SubscriberInfoDisplay({ subscriber }: { subscriber: Subscriber }) {
  return (
    <div className="mt-2 rounded bg-muted p-2">
      <p>
        <strong>Email:</strong> {subscriber.email}
      </p>
      {subscriber.name && (
        <p>
          <strong>Name:</strong> {subscriber.name}
        </p>
      )}
      {subscriber.tags && subscriber.tags.length > 0 && (
        <p>
          <strong>Tags:</strong>{" "}
          <span className="mt-1 flex flex-wrap gap-1">
            {subscriber.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </span>
        </p>
      )}
    </div>
  )
}

// Component for delete button
export function DeleteButton({ subscriber }: { subscriber: Subscriber }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const utils = api.useContext()

  // Delete mutation
  const deleteMutation = api.newsletter.deleteSubscriber.useMutation({
    onSuccess: () => {
      toast({
        title: "Subscriber deleted",
        description: "The subscriber has been deleted successfully.",
      })
      void utils.newsletter.getSubscribers.invalidate()
      void utils.newsletter.getStatistics.invalidate()
    },
    onError: (error: { message?: string }) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscriber.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsProcessing(false)
      setShowDeleteDialog(false)
    },
  })

  const handleDelete = () => {
    setIsProcessing(true)
    void deleteMutation.mutate({ subscriberId: subscriber.id })
  }

  return (
    <div className="flex items-center justify-center">
      <Button
        disabled={isProcessing}
        size="icon"
        title="Delete subscriber"
        variant="ghost"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this subscriber? This action
              cannot be undone.
              <SubscriberInfoDisplay subscriber={subscriber} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isProcessing}
              onClick={handleDelete}
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Component for subscribers table
export function SubscribersTable({
  isLoading,
  subscribers,
  page,
  pageSize,
  setPage,
  setPageSize,
  data,
}: {
  isLoading: boolean
  subscribers: Subscriber[]
  page: number
  pageSize: number
  setPage: (value: number) => void
  setPageSize: (value: number) => void
  data: PaginationData
}) {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      <DataTable
        columns={columns}
        data={subscribers}
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
          hasMore: data.hasNextPage,
          totalPages: data.totalPages,
        }}
      />
    </div>
  )
}

import { useEffect, useState } from "react"

import { LeadStatus } from "@package/db"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { toast } from "@package/ui/toast"

import { api } from "@/lib/trpc/react"

interface LeadDetailsDialogProps {
  leadId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800"
    case "CONTACTED":
      return "bg-yellow-100 text-yellow-800"
    case "QUALIFIED":
      return "bg-green-100 text-green-800"
    case "CONVERTED":
      return "bg-purple-100 text-purple-800"
    case "DISQUALIFIED":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Lead details component to reduce nesting depth
function LeadDetails({
  lead,
  selectedStatus,
  setSelectedStatus,
  isUpdating,
  handleStatusChange,
}: {
  lead: {
    id: string
    name: string | null
    email: string
    phone?: string | null
    company?: string | null
    message?: string | null
    leadType: string
    status: string
    source?: string | null
    createdAt: string | Date
  }
  selectedStatus: string | null
  setSelectedStatus: (status: string) => void
  isUpdating: boolean
  handleStatusChange: () => void
}) {
  return (
    <div className="py-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p className="mt-1">{lead.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="mt-1">{lead.email}</p>
          </div>
          {lead.phone && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Phone
              </h3>
              <p className="mt-1">{lead.phone}</p>
            </div>
          )}
          {lead.company && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Company
              </h3>
              <p className="mt-1">{lead.company}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
            <p className="mt-1">{lead.leadType}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Status
            </h3>
            <Badge
              className={`mt-1 ${getStatusColor(lead.status)}`}
              variant="outline"
            >
              {lead.status}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Source
            </h3>
            <p className="mt-1">{lead.source || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
            <p className="mt-1">
              {new Date(lead.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {lead.message && (
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Message
            </h3>
            <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
              {lead.message}
            </p>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Update Status
          </h3>
          <div className="flex flex-wrap gap-2">
            <Select
              value={selectedStatus || ""}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LeadStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              disabled={isUpdating || selectedStatus === lead.status}
              onClick={handleStatusChange}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LeadDetailsDialog({
  leadId,
  open,
  onOpenChange,
}: LeadDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  // Fetch lead details
  const {
    data: lead,
    isLoading,
    refetch,
  } = api.leads.getLeadById.useQuery(
    { leadId },
    {
      enabled: open && !!leadId,
    }
  )

  // Update selected status when lead data changes
  useEffect(() => {
    if (lead) {
      setSelectedStatus(lead.status)
    }
  }, [lead])

  // Update lead status mutation
  const updateLeadStatus = api.leads.updateStatus.useMutation({
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Lead status has been successfully updated.",
      })
      void refetch()
      setIsUpdating(false)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead status",
        variant: "destructive",
      })
      setIsUpdating(false)
    },
  })

  // Delete lead mutation
  const deleteLead = api.leads.deleteLead.useMutation({
    onSuccess: () => {
      toast({
        title: "Lead deleted",
        description: "Lead has been successfully deleted.",
      })
      onOpenChange(false)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete lead",
        variant: "destructive",
      })
    },
  })

  const handleStatusChange = async () => {
    if (!selectedStatus || !lead) return

    setIsUpdating(true)
    try {
      void (await updateLeadStatus.mutateAsync({
        leadId: lead.id,
        status: selectedStatus as LeadStatus,
      }))
    } catch (error) {
      // Error is handled in mutation callbacks
    }
  }

  const handleDeleteLead = async () => {
    if (!lead) return

    if (
      window.confirm(
        "Are you sure you want to delete this lead? This action cannot be undone."
      )
    ) {
      try {
        await deleteLead.mutateAsync({ leadId: lead.id })
      } catch (error) {
        // Error is handled in mutation callbacks
      }
    }
  }

  // Create content based on loading and lead state
  const dialogContent = () => {
    if (isLoading) {
      return (
        <div className="py-6 text-center text-muted-foreground">
          Loading lead details...
        </div>
      )
    }

    if (lead) {
      return (
        <LeadDetails
          handleStatusChange={handleStatusChange}
          isUpdating={isUpdating}
          lead={lead}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      )
    }

    return (
      <div className="py-6 text-center text-muted-foreground">
        Lead not found or has been deleted.
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
          <DialogDescription>
            View and manage lead information
          </DialogDescription>
        </DialogHeader>

        {dialogContent()}

        <DialogFooter className="gap-2 sm:gap-0">
          {lead && (
            <Button
              className="w-full sm:w-auto"
              variant="destructive"
              onClick={handleDeleteLead}
            >
              Delete Lead
            </Button>
          )}
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

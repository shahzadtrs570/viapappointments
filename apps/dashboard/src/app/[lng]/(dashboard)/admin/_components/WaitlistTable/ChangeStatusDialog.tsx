"use client"

import { useState } from "react"

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
import { useToast } from "@package/ui/toast"

import { api } from "@/lib/trpc/react"

interface ChangeStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  entryId: string
  currentStatus: string
}

export function ChangeStatusDialog({
  isOpen,
  onClose,
  entryId,
  currentStatus,
}: ChangeStatusDialogProps) {
  const [status, setStatus] = useState(currentStatus)
  const { toast } = useToast()
  const utils = api.useUtils()

  const updateMutation = api.waitlist.updateEntry.useMutation({
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The waitlist entry status has been updated successfully.",
      })
      void utils.waitlist.getEntries.invalidate()
      onClose()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update status. Please try again.",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({
      id: entryId,
      data: {
        status,
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription>
            Update the status of this waitlist entry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              disabled={updateMutation.isPending}
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button disabled={updateMutation.isPending} type="submit">
              {updateMutation.isPending ? "Saving..." : "Save Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { Textarea } from "@package/ui/textarea"
import { useToast } from "@package/ui/toast"

import { api } from "@/lib/trpc/react"

interface EditNotesDialogProps {
  isOpen: boolean
  onClose: () => void
  entryId: string
  currentNotes: string | null
}

export function EditNotesDialog({
  isOpen,
  onClose,
  entryId,
  currentNotes,
}: EditNotesDialogProps) {
  const [notes, setNotes] = useState(currentNotes || "")
  const { toast } = useToast()
  const utils = api.useUtils()

  const updateMutation = api.waitlist.updateEntry.useMutation({
    onSuccess: () => {
      toast({
        title: "Notes updated",
        description: "The waitlist entry notes have been updated successfully.",
      })
      void utils.waitlist.getEntries.invalidate()
      onClose()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update notes. Please try again.",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({
      id: entryId,
      data: {
        notes,
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Notes</DialogTitle>
          <DialogDescription>
            Add or update notes for this waitlist entry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Textarea
              className="min-h-[100px]"
              placeholder="Enter notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
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
              {updateMutation.isPending ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Button } from "@package/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"
import { Spinner } from "@package/ui/spinner"

import { useDeleteProperty } from "../../_hooks/useDeleteProperty"

type DeletePropertyDialogProps = {
  propertyId: string
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function DeletePropertyDialog({
  propertyId,
  isDialogOpen,
  setIsDialogOpen,
}: DeletePropertyDialogProps) {
  const { onSubmit, deletePropertyMutation } = useDeleteProperty({
    propertyId,
    setIsDialogOpen,
  })

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Property</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this property? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={deletePropertyMutation.isPending}
            variant="destructive"
            onClick={onSubmit}
          >
            {deletePropertyMutation.isPending ? (
              <>
                <Spinner className="mr-2 size-4" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

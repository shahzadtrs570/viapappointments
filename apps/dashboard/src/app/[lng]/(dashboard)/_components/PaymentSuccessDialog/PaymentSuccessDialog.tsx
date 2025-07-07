"use client"

import { useEffect, useState } from "react"

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

type PaymentSuccessDialogProps = {
  billing?: string
}

export function PaymentSuccessDialog({ billing }: PaymentSuccessDialogProps) {
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    if (billing === "success") {
      setOpenModal(true)
    }
  }, [billing])

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment succeeded!</DialogTitle>
          <DialogDescription>
            Thank you for your purchase. The payment was successful and your
            subscription has been updated.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

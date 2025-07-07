"use client"

// import { useState } from "react"
import { ShieldCheck } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"

import { Turnstile } from "./Turnstile"

interface TurnstileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: (error: Error) => void
  title?: string
  description?: string
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact"
}

export function TurnstileDialog({
  open,
  onOpenChange,
  onVerify,
  onExpire,
  onError,
  title = "Security Check",
  description = "Please complete the security check to continue",
  theme = "auto",
  size = "normal",
}: TurnstileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center py-6">
          <Turnstile
            size={size}
            theme={theme}
            onError={onError}
            onExpire={onExpire}
            onVerify={onVerify}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

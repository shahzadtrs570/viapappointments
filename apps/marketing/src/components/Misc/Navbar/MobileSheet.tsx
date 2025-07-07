"use client"

import { useState } from "react"

import { Button } from "@package/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@package/ui/sheet"
import { Menu } from "lucide-react"

import type { PageTree } from "fumadocs-core/server"

import { MobileLinks } from "./MobileLinks"

export function MobileSheet() {
  const [open, setOpen] = useState(false)

  function handleCloseSheet() {
    if (open) {
      setOpen(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="block rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          size="icon"
          variant="ghost"
        >
          <Menu className="size-6 text-gray-700" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="z-[52] mr-0 mt-16 h-auto w-full rounded-none border-0 bg-white p-0 shadow-lg"
        side="top"
      >
        <MobileLinks onLinkClick={handleCloseSheet} />
      </SheetContent>
    </Sheet>
  )
}

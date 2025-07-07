"use client"

import { useState } from "react"

import { Button } from "@package/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@package/ui/sheet"
import { Menu } from "lucide-react"

import { DashboardLinks } from "./DashboardLinks"

export function DashboardMobileSidebar() {
  const [open, setOpen] = useState(false)

  const handleLinkClick = () => {
    if (open) {
      setOpen(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="shrink-0 lg:hidden" size="icon" variant="outline">
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col" side="left">
        <DashboardLinks onLinkClick={handleLinkClick} />
      </SheetContent>
    </Sheet>
  )
}

"use client"

import { useState } from "react"

import { Button } from "@package/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@package/ui/sheet"
import { MenuIcon } from "lucide-react"

import { DashboardSideNav } from "./DashboardSideNav"

export function DashboardMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="lg:hidden" size="icon" variant="outline">
          <MenuIcon className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[240px] sm:w-[300px]" side="left">
        <div className="py-4">
          <DashboardSideNav />
        </div>
      </SheetContent>
    </Sheet>
  )
}

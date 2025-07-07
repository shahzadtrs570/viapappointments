/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

"use client"

import { useState } from "react"
import { Button } from "@package/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@package/ui/sheet"
import { MenuIcon } from "lucide-react"
import { DashboardLinks } from "@/components/Layouts/DashboardLayout/DashboardLinks"

export function RoleBasedMobileSidebar() {
  const [open, setOpen] = useState(false)

  const handleLinkClick = () => {
    setOpen(false)
  }

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
          <DashboardLinks isRoleBased onLinkClick={handleLinkClick} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

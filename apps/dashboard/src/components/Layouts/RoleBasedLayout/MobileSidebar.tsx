/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

"use client"

import { Button } from "@package/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@package/ui/sheet"
import { UserRole } from "@/mock-data/types"
import { useSession } from "next-auth/react"
import { Menu } from "lucide-react"
import { useState } from "react"

import {
  AdminNavigation,
  SellerNavigation,
  FundBuyerNavigation,
  FamilySupporterNavigation,
  ConveyancerNavigation,
  ValuerNavigation,
} from "@/components/Navigation"
import { Logo } from "@package/ui/logo"

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const userRole = (session?.user?.role as UserRole) || "SELLER" // Default to seller if no role

  const handleLinkClick = () => {
    setOpen(false)
  }

  const renderNavigation = () => {
    switch (userRole) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return <AdminNavigation />
      case "SELLER":
        return <SellerNavigation />
      case "FUND_BUYER":
        return <FundBuyerNavigation />
      case "FAMILY_SUPPORTER":
        return <FamilySupporterNavigation />
      case "CONVEYANCER":
        return <ConveyancerNavigation />
      case "VALUER":
        return <ValuerNavigation />
      default:
        return <SellerNavigation /> // Default to seller navigation
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Menu className="size-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <div className="px-7">
          <Logo className="w-[30px]" color="currentColor" />
        </div>
        <button
          className="my-4 h-[calc(100vh-8rem)] overflow-y-auto px-6"
          onClick={handleLinkClick}
        >
          {renderNavigation()}
        </button>
      </SheetContent>
    </Sheet>
  )
}

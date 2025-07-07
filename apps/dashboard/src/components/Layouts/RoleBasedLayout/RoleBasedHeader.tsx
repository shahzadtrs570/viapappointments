/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

"use client"

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Logo } from "@package/ui/logo"
import { ThemeToggle } from "@package/ui/theme-toggle"
import { featureFlags } from "@package/utils"
import Link from "next/link"
import { RoleBasedMobileSidebar } from "./RoleBasedMobileSidebar"
import { RoleBasedHorizontalNavLinks } from "./RoleBasedHorizontalNavLinks"
import { RoleBasedUserMenu } from "./RoleBasedUserMenu"

export function RoleBasedHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between p-4">
        <div className="flex items-center gap-6">
          {/* Mobile Sidebar - only show on mobile */}
          <div className="lg:hidden">
            <RoleBasedMobileSidebar />
          </div>

          <div className="flex h-14 items-center gap-2 px-3 lg:h-[60px]">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-[30px]" color="currentColor" />
              {/* <span className="text-xl font-bold text-primary">Srenova</span> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center lg:flex">
            <RoleBasedHorizontalNavLinks />
          </nav>
        </div>

        <aside className="flex items-center gap-4">
          {featureFlags.themeToggle && <ThemeToggle />}
          <RoleBasedUserMenu />
        </aside>
      </div>
    </header>
  )
}

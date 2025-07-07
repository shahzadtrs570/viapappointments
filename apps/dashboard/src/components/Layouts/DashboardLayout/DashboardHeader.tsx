/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react/jsx-sort-props */
"use client"

import { Logo } from "@package/ui/logo"
import { ThemeToggle } from "@package/ui/theme-toggle-enhanced" // remomve -enhanced to use standard theme toggle
import { featureFlags } from "@package/utils"

import { useAuth } from "@/hooks/useAuth"

import { AdvisorButton } from "./AdvisorButton"
import { DashboardMobileSidebar } from "./DashboardMobileSidebar"
import { HorizontalNavLinks } from "./HorizontalNavLinks"
import { UserMenu } from "./UserMenu"
import { LanguageSwitcher } from "../../Layout/LanguageSwitcher"

export function DashboardHeader() {
  const { user } = useAuth()
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between p-4">
        <div className="flex items-center gap-6">
          {/* Mobile Sidebar - only show on mobile */}
          <div className="lg:hidden">
            <DashboardMobileSidebar />
          </div>

          <div className="flex h-14 items-center gap-2 px-3 lg:h-[60px]">
            <Logo
              className="w-[30px]"
              color="currentColor"
              hideOnMobile={true}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center lg:flex">
            <HorizontalNavLinks />
          </nav>
        </div>

        <aside className="flex items-center gap-4">
          {featureFlags.themeToggle && <ThemeToggle />}
          {user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN" && (
            <AdvisorButton />
          )}
          <LanguageSwitcher />
          <UserMenu />
        </aside>
      </div>
    </header>
  )
}

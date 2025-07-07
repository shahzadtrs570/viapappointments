"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@package/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@package/ui/sheet"
import { FilterIcon, SlidersHorizontal } from "lucide-react"

type ColumnContainerProps = {
  leftColumn?: React.ReactNode
  centerColumn: React.ReactNode
  rightColumn?: React.ReactNode
  showLeftColumn?: boolean
  showRightColumn?: boolean
  leftColumnTitle?: string
  rightColumnTitle?: string
}

export function ColumnContainer({
  leftColumn,
  centerColumn,
  rightColumn,
  showLeftColumn = true,
  showRightColumn = true,
  leftColumnTitle = "Filters",
  rightColumnTitle = "Details",
}: ColumnContainerProps) {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)

  return (
    <div className="flex w-full flex-1 flex-col gap-4 overflow-hidden">
      {/* Mobile Controls - Only visible on small screens */}
      {(showLeftColumn && leftColumn) || (showRightColumn && rightColumn) ? (
        <div className="flex items-center justify-between gap-4 lg:hidden">
          {showLeftColumn && leftColumn && (
            <Sheet open={leftDrawerOpen} onOpenChange={setLeftDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  variant="outline"
                >
                  <FilterIcon className="size-4" />
                  <span>{leftColumnTitle}</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[350px]" side="left">
                <div className="h-full overflow-y-auto py-2">{leftColumn}</div>
              </SheetContent>
            </Sheet>
          )}

          {showRightColumn && rightColumn && (
            <Sheet open={rightDrawerOpen} onOpenChange={setRightDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  className="ml-auto flex items-center gap-2"
                  size="sm"
                  variant="outline"
                >
                  <SlidersHorizontal className="size-4" />
                  <span>{rightColumnTitle}</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[350px]" side="right">
                <div className="h-full overflow-y-auto py-2">{rightColumn}</div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      ) : null}

      {/* Desktop Layout - Three columns */}
      <div className="flex w-full flex-1 gap-4 overflow-hidden">
        {/* Left Column - typically for navigation, filters, or context */}
        {showLeftColumn && leftColumn && (
          <div className="hidden w-64 shrink-0 overflow-y-auto rounded-lg border border-border bg-card p-4 lg:block">
            {leftColumn}
          </div>
        )}

        {/* Center Column - main content area */}
        <div className="flex-1 overflow-y-auto">{centerColumn}</div>

        {/* Right Column - typically for details, properties, or context-specific actions */}
        {showRightColumn && rightColumn && (
          <div className="hidden w-80 shrink-0 overflow-y-auto rounded-lg border border-border bg-card p-4 xl:block">
            {rightColumn}
          </div>
        )}
      </div>
    </div>
  )
}

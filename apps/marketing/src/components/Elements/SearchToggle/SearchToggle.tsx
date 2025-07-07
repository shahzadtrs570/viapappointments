"use client"

import { Button } from "@package/ui/button"
import { SearchIcon } from "lucide-react"

type SearchToggleProps = {
  onClick: () => void
}

export function SearchToggle({ onClick }: SearchToggleProps) {
  return (
    <Button
      className="inline-flex w-full max-w-[240px] items-center gap-2 rounded-full border bg-secondary/50 p-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      type="button"
      onClick={onClick}
    >
      <SearchIcon aria-label="Open Search" className="ms-1 size-4" />
      Search
      <div className="ms-auto inline-flex gap-0.5 text-xs">
        <kbd className="rounded-md border bg-background px-[2px] py-1 xs:px-1.5">
          ⌘ K
        </kbd>
      </div>
    </Button>
  )
}

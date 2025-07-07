"use client"

import { useEffect, useState } from "react"

import { useDocsSearch } from "fumadocs-core/search/client"
import { SearchDialog } from "fumadocs-ui/components/dialog/search"
import { usePathname } from "next/navigation"

import { SearchToggle } from "../SearchToggle/SearchToggle"

type DocsSearchProps = {
  onSearchLinkClick?: () => void
}

export function DocsSearch({ onSearchLinkClick }: DocsSearchProps) {
  const { query, search, setSearch } = useDocsSearch()
  const [open, setOpen] = useState(false)
  const path = usePathname()

  useEffect(() => {
    setOpen(false)
    if (open && onSearchLinkClick) {
      onSearchLinkClick()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSearchLinkClick, path])

  function handleOpenDialog() {
    setOpen(true)
  }

  return (
    <section className="flex min-w-[175px] flex-1 justify-center lg:w-[260px]">
      <SearchToggle onClick={handleOpenDialog} />
      <SearchDialog
        open={open}
        results={query.data ?? "empty"}
        search={search}
        onOpenChange={setOpen}
        onSearchChange={setSearch}
      />
    </section>
  )
}

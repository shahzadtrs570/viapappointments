import { type ReactNode } from "react"

import { DocsLayout } from "fumadocs-ui/layout"

import { legal } from "@/lib/fuma"

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      nav={{ enabled: false }}
      sidebar={{ enabled: false }}
      tree={legal.pageTree}
    >
      {children}
    </DocsLayout>
  )
}

// Thanslation is not integrated in this folder yet.

import { type ReactNode } from "react"

import { DocsLayout } from "fumadocs-ui/layout"

import { docs } from "@/lib/fuma"

export default function RootDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      nav={{ enabled: false }}
      sidebar={{ collapsible: false }}
      tree={docs.pageTree}
    >
      {children}
    </DocsLayout>
  )
}

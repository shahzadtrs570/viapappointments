import { type ReactNode } from "react"

import { DocsLayout } from "fumadocs-ui/layout"

import { blog } from "@/lib/fuma"

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      nav={{ enabled: false }}
      sidebar={{ enabled: false }}
      tree={blog.pageTree}
    >
      {children}
    </DocsLayout>
  )
}

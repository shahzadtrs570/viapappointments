import { featureFlags } from "@package/utils"
import { DocsBody, DocsPage as FumaDocsPage } from "fumadocs-ui/page"
import { notFound } from "next/navigation"

import type { Metadata } from "next"

import { docs } from "@/lib/fuma"

export function generateStaticParams() {
  return docs
    .getPages()
    .filter((page) => page.slugs.length > 0)
    .map((page) => ({
      slug: page.slugs,
    }))
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = docs.getPage(params.slug)

  if (page == null) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata
}

export default function DocsPage({ params }: { params: { slug?: string[] } }) {
  if (!featureFlags.docs) {
    return notFound()
  }

  const page = docs.getPage(params.slug)

  if (page == null) {
    notFound()
  }

  const MDX = page.data.exports.default

  return (
    <FumaDocsPage lastUpdate={page.data.updatedAt} toc={page.data.exports.toc}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX />
      </DocsBody>
    </FumaDocsPage>
  )
}

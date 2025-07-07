import { featureFlags } from "@package/utils"
import { DocsBody, DocsPage } from "fumadocs-ui/page"
import { notFound } from "next/navigation"

import type { Metadata } from "next"

import { blog } from "@/lib/fuma"

import { ArticleFooter } from "../_components/ArticleFooter/ArticleFooter"
import { ArticleHeader } from "../_components/ArticleHeader/ArticleHeader"

export function generateStaticParams() {
  return blog.getPages().map((page) => ({
    slug: page.slugs,
  }))
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  if (!featureFlags.blog) {
    return notFound()
  }

  const page = blog.getPage(params.slug)

  if (page == null || !page.data.published) notFound()

  // optionally access and extend (rather than replace) parent metadata

  return {
    title: page.data.title,
    description: page.data.description,
    keywords: page.data.keywords,
    authors: [{ name: page.data.authorName }],
    openGraph: {
      title: page.data.title,
      tags: page.data.keywords,
      description: page.data.description,
      type: "article",
      images: [page.data.coverImage],
      publishedTime: page.data.publishedAt,
      modifiedTime: page.data.updatedAt,
      siteName: "Rain Ventures",
      authors: [page.data.authorName],
    },
    twitter: {
      title: page.data.title,
      description: page.data.description,
      images: [page.data.coverImage],
      site: "Rain Ventures",
    },
  } satisfies Metadata
}

export default function ArticlePage({
  params,
}: {
  params: { slug?: string[] }
}) {
  const page = blog.getPage(params.slug)

  if (page == null || !page.data.published) {
    notFound()
  }

  const MDX = page.data.exports.default

  return (
    <DocsPage toc={page.data.exports.toc}>
      <DocsBody className="mx-auto">
        <ArticleHeader article={page} />
        <MDX />
        <ArticleFooter article={page} />
      </DocsBody>
    </DocsPage>
  )
}

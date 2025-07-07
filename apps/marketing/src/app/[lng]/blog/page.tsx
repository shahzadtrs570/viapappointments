// This folder is also not translated
import { Container } from "@package/ui/container"
import { Typography } from "@package/ui/typography"
import { featureFlags } from "@package/utils"
import { notFound } from "next/navigation"

import type { Metadata } from "next"

import { blog } from "@/lib/fuma"

import { Articles } from "./_components/Articles/Articles"

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog",
}

export default function BlogPage() {
  if (!featureFlags.blog) {
    return notFound()
  }

  const articles = blog.getPages()

  const publishedArticles = articles.filter((article) => article.data.published)

  return (
    <Container className="flex max-w-7xl flex-col gap-6">
      <Typography variant="h1">Blog</Typography>
      <Typography variant="h2">Latest Articles</Typography>
      <Articles articles={publishedArticles} />
    </Container>
  )
}

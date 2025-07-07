import { MoveLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { BlogPage } from "@/lib/fuma"

import { ArticleAvatar } from "../ArticleAvatar/ArticleAvatar"
import { Keywords } from "../Keywords/Keywords"

type ArticleHeaderProps = {
  article: BlogPage
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="mb-12">
      <Link
        className="mb-4 flex items-center gap-2 text-muted-foreground no-underline hover:text-foreground"
        href="/blog"
      >
        <MoveLeft /> All Articles
      </Link>
      <Image
        alt={article.data.title}
        className="my-0 mb-2 max-h-[400px] w-full rounded-md object-cover object-center"
        height={0}
        sizes="(min-width: 680px) 680px, 100vw"
        src={article.data.coverImage}
        width={0}
      />
      <Keywords keywords={article.data.keywords} />
      <h1 className="mt-2">{article.data.title}</h1>
      <ArticleAvatar article={article} />
    </header>
  )
}

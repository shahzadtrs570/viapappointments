import { cn } from "@package/utils"
import Link from "next/link"

import type { BlogPage } from "@/lib/fuma"

import { ArticlePreviewCard } from "../Article/Article"

type ArticlesProps = {
  articles: BlogPage[]
}

export function Articles({ articles }: ArticlesProps) {
  return (
    <section className="grid grid-cols-1 gap-20 md:grid-cols-2">
      {articles.map((article: BlogPage, articleIndex) => {
        const isFirstArticle = articleIndex === 0
        return (
          <Link
            key={article.url}
            href={article.url}
            className={cn(
              "w-full h-fit transition-transform duration-300 ease-in-out hover:scale-[1.02] animate-fade-in",
              {
                "md:col-span-2": isFirstArticle,
              }
            )}
          >
            <ArticlePreviewCard
              article={article}
              isFirstArticle={isFirstArticle}
            />
          </Link>
        )
      })}
    </section>
  )
}

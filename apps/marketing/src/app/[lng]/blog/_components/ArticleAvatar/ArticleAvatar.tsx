import { Avatar, AvatarFallback, AvatarImage } from "@package/ui/avatar"
import { Typography } from "@package/ui/typography"
import { formatDateToMonthDayYear } from "@package/utils"

import type { BlogPage } from "@/lib/fuma"

import { authors } from "../../_config/authors"

type ArticleAvatarProps = {
  article: BlogPage
}

export function ArticleAvatar({ article }: ArticleAvatarProps) {
  return (
    <section className="flex items-center gap-3">
      <Avatar className="size-14">
        <AvatarImage
          className="my-0"
          src={authors[article.data.authorName]?.image}
        />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <section className="flex flex-col">
        <Typography className="my-0 font-bold" variant="body">
          {article.data.authorName}
        </Typography>
        <Typography className="my-0 text-muted-foreground" variant="small">
          {formatDateToMonthDayYear(new Date(article.data.publishedAt))}
        </Typography>
      </section>
    </section>
  )
}

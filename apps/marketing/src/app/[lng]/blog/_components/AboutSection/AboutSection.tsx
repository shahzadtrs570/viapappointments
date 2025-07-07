import { Avatar, AvatarFallback, AvatarImage } from "@package/ui/avatar"
import { Typography } from "@package/ui/typography"

import type { BlogPage } from "@/lib/fuma"

import { authors } from "../../_config/authors"

type AboutSectionProps = {
  article: BlogPage
}

export function AboutSection({ article }: AboutSectionProps) {
  const author = authors[article.data.authorName]
  return (
    <section className="flex items-center gap-4">
      <Avatar className="size-20 sm:size-40">
        <AvatarImage className="my-0" src={author?.image} />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <aside>
        <Typography className="my-0 font-bold" variant="body">
          Written by {article.data.authorName}
        </Typography>
        <Typography className="my-0">{author?.bio}</Typography>
      </aside>
    </section>
  )
}

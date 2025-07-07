import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { cn } from "@package/utils"
import Image from "next/image"

import type { BlogPage } from "@/lib/fuma"

import { ArticleAvatar } from "../ArticleAvatar/ArticleAvatar"
import { Keywords } from "../Keywords/Keywords"

type ArticlePreviewCardProps = {
  article: BlogPage
  isFirstArticle: boolean
}

export function ArticlePreviewCard({
  article,
  isFirstArticle,
}: ArticlePreviewCardProps) {
  return (
    <Card className="flex flex-col border-none bg-transparent shadow-none">
      <CardHeader className="p-0">
        <Image
          alt={article.data.title}
          height={0}
          sizes="(min-width: 1024px) 1300px, 100vw"
          src={article.data.coverImage}
          width={0}
          className={cn(
            "md:h-80 rounded-md object-cover object-center w-full max-h-[630px] h-full",
            {
              "md:h-[600px]": isFirstArticle,
            }
          )}
        />
        <Keywords keywords={article.data.keywords} />
        <CardTitle>{article.data.title}</CardTitle>
        <CardContent className="px-0 py-2">
          {article.data.description}
        </CardContent>
      </CardHeader>
      <CardFooter className="px-0 py-2 pb-0">
        <ArticleAvatar article={article} />
      </CardFooter>
    </Card>
  )
}

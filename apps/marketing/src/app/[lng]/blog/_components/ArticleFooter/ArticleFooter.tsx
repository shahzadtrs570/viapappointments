import { Typography } from "@package/ui/typography"
import { formatDateToMonthDayYear } from "@package/utils"

import type { BlogPage } from "@/lib/fuma"

import { AboutSection } from "../AboutSection/AboutSection"
import { ShareSection } from "../ShareSection/ShareSection"

type ArticleFooterProps = {
  article: BlogPage
}

export function ArticleFooter({ article }: ArticleFooterProps) {
  return (
    <footer className="mt-20 space-y-20">
      <ShareSection article={article} />
      <AboutSection article={article} />
      {article.data.updatedAt && (
        <Typography className="text-right text-sm text-muted-foreground">
          Last updated on:{" "}
          {formatDateToMonthDayYear(new Date(article.data.updatedAt))}
        </Typography>
      )}
    </footer>
  )
}

import { Typography } from "@package/ui/typography"

type KeywordsProps = {
  keywords: string[]
}

export function Keywords({ keywords }: KeywordsProps) {
  return (
    <aside className="flex flex-wrap items-center gap-x-3">
      {keywords.map((keyword) => (
        <Typography
          key={keyword}
          className="my-0 text-muted-foreground"
          variant="body"
        >
          #{keyword}
        </Typography>
      ))}
    </aside>
  )
}

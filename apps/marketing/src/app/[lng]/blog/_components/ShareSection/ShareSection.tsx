import { RedditIcon } from "@package/ui/social-icons"
import { Typography } from "@package/ui/typography"
import { Facebook, Heart, Linkedin, TwitterIcon } from "lucide-react"

import type { BlogPage } from "@/lib/fuma"

import { CopyToClipboard } from "../CopyToClipboard/CopyToClipboard"

type ShareSectionProps = {
  article: BlogPage
}

export function ShareSection({ article }: ShareSectionProps) {
  const link = process.env.NEXT_PUBLIC_APP_URL + article.url

  return (
    <section className="flex flex-col items-center justify-between gap-6 rounded-md bg-secondary p-4 md:flex-row">
      <section className="flex items-center justify-center gap-2">
        <Heart className="size-6 animate-pulse text-transparent" fill="red" />
        <Typography className="my-0 font-bold">
          Share this article with your friends!
        </Typography>
      </section>
      <section className="flex items-center gap-4 md:gap-6">
        <a
          className="size-8 transition-transform duration-300 hover:scale-110"
          href={`https://twitter.com/intent/tweet/?text=${article.data.title}&url=${link}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <TwitterIcon size={32} strokeWidth={1} />
          <div className="sr-only">share on twitter</div>
        </a>
        <a
          className="size-8 transition-transform duration-300 hover:scale-110"
          href={`https://facebook.com/sharer/sharer.php?u=${link}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Facebook size={32} strokeWidth={1} />
          <div className="sr-only">share on facebook</div>
        </a>
        <a
          className="size-8 transition-transform duration-300 hover:scale-110"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${link}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Linkedin size={32} strokeWidth={1} />
          <div className="sr-only">share on linkedin</div>
        </a>
        <a
          className="size-8 transition-transform duration-300 hover:scale-110"
          href={`https://reddit.com/submit/?url=${link}&title=${article.data.title}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <RedditIcon
            svgProps={{ fill: "transparent", stroke: "currentColor" }}
          />
          <div className="sr-only">share on reddit</div>
        </a>
        <CopyToClipboard link={link} />
      </section>
    </section>
  )
}

"use client"

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@package/ui/accordion"
import { cn } from "@package/utils"
import { Circle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type DashboardLinkProps = {
  onClick?: () => void
  icon: React.ReactElement
  iconTitle?: string
  links: { href: string; text: string; target?: string; rel?: string }[]
  itemNumber?: number
}

export function DashboardLink({
  onClick,
  links,
  iconTitle,
  icon,
  itemNumber,
}: DashboardLinkProps) {
  const currentUrl = usePathname()
  const allUrls = links.map((link) => link.href)

  if (links.length === 1) {
    return (
      <Link
        href={links[0].href}
        rel={links[0].rel}
        target={links[0].target}
        className={cn(
          "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-4 py-2 text-muted-foreground hover:text-foreground md:gap-3 md:rounded-lg md:transition-all md:hover:text-primary",
          {
            "font-bold bg-accent text-foreground": currentUrl === links[0].href,
          }
        )}
        onClick={onClick}
      >
        {icon}
        {links[0].text}
      </Link>
    )
  }

  if (links.length > 1) {
    return (
      <AccordionItem
        className="w-full rounded-lg border-none"
        value={`item-${itemNumber}`}
      >
        <AccordionTrigger
          className={cn(
            "w-full rounded-lg py-0 [&[data-state=open]]:rounded-b-none hover:no-underline px-1",
            {
              "bg-accent": allUrls.includes(currentUrl),
            }
          )}
        >
          <section
            className={cn(
              "mx-[-0.65rem] text-base flex items-center gap-4 px-3 py-2 text-muted-foreground hover:text-foreground md:gap-3 md:transition-all md:hover:text-primary",
              {
                "font-bold text-foreground": allUrls.includes(currentUrl),
              }
            )}
          >
            {icon} {iconTitle}
          </section>
        </AccordionTrigger>
        <AccordionContent
          className={cn("w-full rounded-b-lg px-2 pb-0", {
            "bg-accent": allUrls.includes(currentUrl),
          })}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              rel={link.rel}
              target={link.target}
              className={cn(
                "mx-[-0.65rem] flex items-center gap-2 rounded-xl pl-5 py-2 text-muted-foreground hover:text-foreground md:transition-all md:hover:text-primary",
                {
                  "font-bold bg-accent text-foreground":
                    currentUrl === link.href,
                }
              )}
              onClick={onClick}
            >
              <Circle className="size-2" />
              {link.text}
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }
}

"use client"

import { cn } from "@package/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { MobileAccordionLinkItem } from "./MobileAccordionLinkItem"

export type Link = {
  href: string
  text: string
  children?: Link[]
}

export type MobileLinkProps = {
  onClick?: () => void
  icon?: React.ReactElement
  iconTitle?: string
  links: Link[]
  itemNumber?: number
}

export function MobileLink({
  onClick,
  links,
  iconTitle,
  icon,
  itemNumber,
}: MobileLinkProps) {
  const currentUrl = usePathname()

  if (links.length === 1) {
    return (
      <Link
        href={links[0].href}
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
      <MobileAccordionLinkItem
        icon={icon}
        iconTitle={iconTitle}
        itemNumber={itemNumber}
        links={links}
        onClick={onClick}
      />
    )
  }
}

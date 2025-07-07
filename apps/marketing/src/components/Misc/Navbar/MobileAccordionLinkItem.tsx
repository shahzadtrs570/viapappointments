"use client"

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@package/ui/accordion"
import { cn } from "@package/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { MobileLinkProps } from "./MobileLink"

export function MobileAccordionLinkItem({
  icon,
  links,
  iconTitle,
  itemNumber,
  onClick,
}: MobileLinkProps) {
  const currentUrl = usePathname()
  const allUrls = links.map((link) => link.href)

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
            "mx-[-0.65rem] text-base flex items-center gap-4 px-3 py-2 text-muted-foreground md:gap-3",
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
        {links.map((link, index) => (
          <div key={link.text}>
            {link.children ? (
              <MobileAccordionLinkItem
                iconTitle={link.text}
                itemNumber={(itemNumber ?? index) + 1}
                links={link.children}
                onClick={onClick}
              />
            ) : (
              <Link
                href={link.href}
                className={cn(
                  "mx-[-0.65rem] text-base flex items-center gap-4 px-4 py-2 text-muted-foreground md:gap-3",
                  {
                    "font-bold bg-accent text-foreground":
                      currentUrl === link.href,
                  }
                )}
                onClick={onClick}
              >
                {link.text}
              </Link>
            )}
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}

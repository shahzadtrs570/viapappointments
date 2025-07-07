/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

import { Button } from "@package/ui/button"
import { Separator } from "@package/ui/separator"
import { Typography } from "@package/ui/typography"
import { cn } from "@package/utils"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  disabled?: boolean
}

export interface NavSection {
  title: string
  items: NavItem[]
}

interface BaseNavigationProps {
  sections: NavSection[]
  className?: string
}

export function BaseNavigation({ sections, className }: BaseNavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("grid items-start gap-4", className)}>
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-2">
          <Typography className="text-muted-foreground">
            {section.title}
          </Typography>
          <Separator />
          {section.items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-disabled={item.disabled}
              >
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href
                      ? "bg-secondary font-medium text-secondary-foreground"
                      : "font-normal",
                    item.disabled && "pointer-events-none opacity-60"
                  )}
                >
                  <Icon className="mr-2 size-5" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

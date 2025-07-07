"use client"

import { Button } from "@package/ui/button"
import { cn } from "@package/utils"
import {
  BarChart3,
  InboxIcon,
  Layout,
  LifeBuoy,
  MailIcon,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
}

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <BarChart3 className="size-4" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="size-4" />,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: <MailIcon className="size-4" />,
  },
  {
    title: "Leads",
    href: "/admin/leads",
    icon: <InboxIcon className="size-4" />,
  },
  {
    title: "Features",
    href: "/admin/feature-template",
    icon: <Layout className="size-4" />,
  },
  {
    title: "Support",
    href: "/admin/support",
    icon: <LifeBuoy className="size-4" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="size-4" />,
  },
]

type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN"

export function AdminNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user.role as UserRole

  // Only show admin nav for admin users
  if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
    return null
  }

  return (
    <nav className="grid items-start gap-2">
      {adminNavItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === item.href
                ? "bg-secondary font-medium text-secondary-foreground"
                : "font-normal"
            )}
          >
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Button>
        </Link>
      ))}
    </nav>
  )
}

/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

import {
  Home,
  User,
  Users,
  FileText,
  Settings,
  BarChart2,
  Boxes,
  Building,
  Shield,
  HelpCircle,
  MessageSquareText,
} from "lucide-react"

import { BaseNavigation, NavSection } from "./BaseNavigation"

const adminNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: Home,
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Properties",
        href: "/admin/properties",
        icon: Building,
      },
      {
        title: "Buy Boxes",
        href: "/admin/buy-boxes",
        icon: Boxes,
      },
      {
        title: "Documents",
        href: "/admin/documents",
        icon: FileText,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "FAQ Manager",
        href: "/admin/faq-manager",
        icon: MessageSquareText,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
        href: "/admin/reports",
        icon: BarChart2,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Access Control",
        href: "/admin/access",
        icon: Shield,
      },
      {
        title: "Support",
        href: "/admin/support",
        icon: HelpCircle,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        href: "/admin/profile",
        icon: User,
      },
    ],
  },
]

export function AdminNavigation() {
  return <BaseNavigation sections={adminNavSections} />
}

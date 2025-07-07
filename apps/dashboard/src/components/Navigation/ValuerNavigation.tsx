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
  Landmark,
  FileText,
  MessageCircle,
  Settings,
  BarChart,
  Clock,
} from "lucide-react"

import { BaseNavigation, NavSection } from "./BaseNavigation"

const valuerNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/valuer",
        icon: Home,
      },
      {
        title: "Valuation Requests",
        href: "/valuer/requests",
        icon: Clock,
      },
      {
        title: "Properties",
        href: "/valuer/properties",
        icon: Landmark,
      },
      {
        title: "Reports",
        href: "/valuer/reports",
        icon: BarChart,
      },
      {
        title: "Documents",
        href: "/valuer/documents",
        icon: FileText,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Messages",
        href: "/valuer/messages",
        icon: MessageCircle,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Firm Profile",
        href: "/valuer/profile",
        icon: User,
      },
      {
        title: "Settings",
        href: "/valuer/settings",
        icon: Settings,
      },
    ],
  },
]

export function ValuerNavigation() {
  return <BaseNavigation sections={valuerNavSections} />
}

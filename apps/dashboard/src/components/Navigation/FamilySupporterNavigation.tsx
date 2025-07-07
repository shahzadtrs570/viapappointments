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
  MessageCircle,
  Settings,
  Bell,
} from "lucide-react"

import { BaseNavigation, NavSection } from "./BaseNavigation"

const familySupporterNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/family-supporter",
        icon: Home,
      },
      {
        title: "My Sellers",
        href: "/family-supporter/sellers",
        icon: Users,
      },
      {
        title: "Documents",
        href: "/family-supporter/documents",
        icon: FileText,
      },
      {
        title: "Notifications",
        href: "/family-supporter/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Messages",
        href: "/family-supporter/messages",
        icon: MessageCircle,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        href: "/family-supporter/profile",
        icon: User,
      },
      {
        title: "Settings",
        href: "/family-supporter/settings",
        icon: Settings,
      },
    ],
  },
]

export function FamilySupporterNavigation() {
  return <BaseNavigation sections={familySupporterNavSections} />
}

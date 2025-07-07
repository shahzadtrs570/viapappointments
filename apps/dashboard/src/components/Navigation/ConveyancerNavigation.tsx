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
  ClipboardCheck,
  FileText,
  MessageCircle,
  Settings,
  Briefcase,
} from "lucide-react"

import { BaseNavigation, NavSection } from "./BaseNavigation"

const conveyancerNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/conveyancer",
        icon: Home,
      },
      {
        title: "Active Contracts",
        href: "/conveyancer/contracts",
        icon: ClipboardCheck,
      },
      {
        title: "Documents",
        href: "/conveyancer/documents",
        icon: FileText,
      },
      {
        title: "Cases",
        href: "/conveyancer/cases",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Messages",
        href: "/conveyancer/messages",
        icon: MessageCircle,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Firm Profile",
        href: "/conveyancer/profile",
        icon: User,
      },
      {
        title: "Settings",
        href: "/conveyancer/settings",
        icon: Settings,
      },
    ],
  },
]

export function ConveyancerNavigation() {
  return <BaseNavigation sections={conveyancerNavSections} />
}

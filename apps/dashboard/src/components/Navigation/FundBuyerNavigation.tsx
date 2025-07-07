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
  Search,
  Boxes,
  Calculator,
  FileText,
  MessageCircle,
  Settings,
  BarChart2,
} from "lucide-react"

import { BaseNavigation, NavSection } from "./BaseNavigation"

const fundBuyerNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/fund-buyer",
        icon: Home,
      },
      {
        title: "Property Search",
        href: "/fund-buyer/search",
        icon: Search,
      },
      {
        title: "Buy Boxes",
        href: "/fund-buyer/buy-boxes",
        icon: Boxes,
      },
      {
        title: "My Offers",
        href: "/fund-buyer/offers",
        icon: Calculator,
      },
      {
        title: "Contracts",
        href: "/fund-buyer/contracts",
        icon: FileText,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Portfolio",
        href: "/fund-buyer/portfolio",
        icon: BarChart2,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Messages",
        href: "/fund-buyer/messages",
        icon: MessageCircle,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Company Profile",
        href: "/fund-buyer/profile",
        icon: User,
      },
      {
        title: "Settings",
        href: "/fund-buyer/settings",
        icon: Settings,
      },
    ],
  },
]

export function FundBuyerNavigation() {
  return <BaseNavigation sections={fundBuyerNavSections} />
}

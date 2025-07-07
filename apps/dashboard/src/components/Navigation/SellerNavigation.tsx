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
  Calculator,
  Settings,
} from "lucide-react"

import { BaseNavigation, NavSection } from "./BaseNavigation"

const sellerNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/seller",
        icon: Home,
      },
      {
        title: "My Properties",
        href: "/seller/properties",
        icon: Landmark,
      },
      {
        title: "Offers",
        href: "/seller/offers",
        icon: Calculator,
      },
      {
        title: "Documents",
        href: "/seller/documents",
        icon: FileText,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Messages",
        href: "/seller/messages",
        icon: MessageCircle,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        href: "/seller/profile",
        icon: User,
      },
      {
        title: "Settings",
        href: "/seller/settings",
        icon: Settings,
      },
    ],
  },
]

export function SellerNavigation() {
  return <BaseNavigation sections={sellerNavSections} />
}

"use client"
import { Srenova_UserRole } from "@package/db"
import { Accordion } from "@package/ui/accordion"
import { Logo } from "@package/ui/logo"
import { Separator } from "@package/ui/separator"
import { Typography } from "@package/ui/typography"
import { Home, Shield, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Authorization } from "@/components/Misc"
import {
  ConveyancerNavigation,
  FamilySupporterNavigation,
  FundBuyerNavigation,
  SellerNavigation,
  ValuerNavigation,
} from "@/components/Navigation"
import { useAuth } from "@/hooks/useAuth"

import { DashboardLink } from "./DashboardLink"

type LinksProps = {
  onLinkClick?: () => void
  isRoleBased?: boolean
  className?: string
}

export function DashboardLinks({
  onLinkClick,
  isRoleBased = false,
  className,
}: LinksProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const defaultRole: Srenova_UserRole[] = [Srenova_UserRole.SELLER]
  const userRoles = user?.SrenovaRole ?? defaultRole

  const determineRoleFromPath = (path: string): Srenova_UserRole | null => {
    if (path.includes("/seller")) return Srenova_UserRole.SELLER
    if (path.includes("/valuer")) return Srenova_UserRole.VALUER
    if (path.includes("/fund-buyer")) return Srenova_UserRole.FUND_BUYER
    if (path.includes("/conveyancer")) return Srenova_UserRole.CONVEYANCER
    if (path.includes("/family-supporter"))
      return Srenova_UserRole.FAMILY_SUPPORTER
    return null
  }

  const getRoleNavigation = (role: Srenova_UserRole) => {
    switch (role) {
      case Srenova_UserRole.SELLER:
        return <SellerNavigation />
      case Srenova_UserRole.FUND_BUYER:
        return <FundBuyerNavigation />
      case Srenova_UserRole.FAMILY_SUPPORTER:
        return <FamilySupporterNavigation />
      case Srenova_UserRole.CONVEYANCER:
        return <ConveyancerNavigation />
      case Srenova_UserRole.VALUER:
        return <ValuerNavigation />
      default:
        return <SellerNavigation />
    }
  }

  const renderRoleBasedNavigation = () => {
    // If only one role, use it directly
    if (userRoles.length === 1) {
      return getRoleNavigation(userRoles[0] as Srenova_UserRole)
    }

    // For multiple roles, determine based on path
    const roleFromPath = determineRoleFromPath(pathname)
    if (roleFromPath && userRoles.includes(roleFromPath)) {
      return getRoleNavigation(roleFromPath)
    }

    // Default to first role in array if path doesn't match
    return getRoleNavigation(userRoles[0] as Srenova_UserRole)
  }

  const renderStandardNavigation = () => (
    <>
      <section className="flex flex-col gap-2">
        <Typography className="text-muted-foreground">Menu</Typography>
        <Separator />
        <DashboardLink
          icon={<Home className="size-5" />}
          links={[
            {
              href: `${process.env.NEXT_PUBLIC_MARKETING_URL}`,
              text: "Home",
              target: "_blank",
              rel: "noopener noreferrer",
            },
          ]}
          onClick={onLinkClick}
        />

        <DashboardLink
          icon={<Home className="size-5" />}
          links={[{ href: "/", text: "My Srenova" }]}
          onClick={onLinkClick}
        />
      </section>

      <section className="flex flex-col gap-2">
        <Typography className="text-muted-foreground">Preferences</Typography>
        <Separator />
        <Authorization allowedRoles={["ADMIN"]}>
          <DashboardLink
            icon={<Shield className="size-5" />}
            iconTitle="Admin"
            itemNumber={2}
            links={[
              { href: "/admin", text: "Overview" },
              { href: "/admin/users", text: "Users" },
              { href: "/admin/properties", text: "Properties" },
              { href: "/admin/buy-box-creation", text: "Buy Box Creation" },
              { href: "/admin/faq-manager", text: "Manage FAQ" },
              { href: "/admin/security", text: "Security" },
            ]}
            onClick={onLinkClick}
          />
        </Authorization>
        <DashboardLink
          icon={<User className="size-5" />}
          links={[{ href: "/profile", text: "Profile" }]}
          onClick={onLinkClick}
        />
        {/* <DashboardLink
            icon={<Receipt className="size-5" />}
            links={[{ href: "/billing", text: "Billing" }]}
            onClick={onLinkClick}
          /> */}
      </section>
    </>
  )

  return (
    <nav
      className={`flex h-full flex-col content-between gap-2 text-base font-medium lg:items-start lg:px-4 lg:font-medium ${className || ""}`}
    >
      <Link
        className="mb-4 flex items-center gap-2 text-lg font-semibold lg:hidden"
        href="/"
        onClick={onLinkClick}
      >
        <Logo color="currentColor" hideOnMobile={true} />
      </Link>
      <Accordion
        collapsible
        className="flex size-full flex-col gap-12"
        type="single"
      >
        {isRoleBased ? renderRoleBasedNavigation() : renderStandardNavigation()}
      </Accordion>
    </nav>
  )
}

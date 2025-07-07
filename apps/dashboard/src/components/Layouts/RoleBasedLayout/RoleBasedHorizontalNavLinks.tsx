"use client"
import { Srenova_UserRole } from "@package/db"
import { cn } from "@package/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAuth } from "@/hooks/useAuth"

type NavLinkProps = {
  href: string
  text: string
  isActive: boolean
  onClick?: () => void
}

function NavLink({ href, text, isActive, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
    >
      {text}
    </Link>
  )
}

type RoleBasedHorizontalNavLinksProps = {
  className?: string
  onLinkClick?: () => void
}

export function RoleBasedHorizontalNavLinks({
  className,
  onLinkClick,
}: RoleBasedHorizontalNavLinksProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const defaultRole: Srenova_UserRole[] = [Srenova_UserRole.SELLER]
  const userRoles = user?.SrenovaRole ?? defaultRole

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`)

  // Function to determine role from URL path
  const determineRoleFromPath = (): Srenova_UserRole => {
    if (pathname.includes("/seller")) return Srenova_UserRole.SELLER
    if (pathname.includes("/valuer")) return Srenova_UserRole.VALUER
    if (pathname.includes("/fund-buyer")) return Srenova_UserRole.FUND_BUYER
    if (pathname.includes("/conveyancer")) return Srenova_UserRole.CONVEYANCER
    if (pathname.includes("/family-supporter"))
      return Srenova_UserRole.FAMILY_SUPPORTER

    // Default to first role if path doesn't match
    return userRoles[0] || Srenova_UserRole.SELLER
  }

  // Check if we're on admin routes
  const isAdminRoute = pathname.startsWith("/admin")

  // Generate navigation links based on active role
  const renderNavLinks = () => {
    // If on admin route and user is admin, show admin navigation
    if (
      isAdminRoute &&
      (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN")
    ) {
      return [
        { href: "/surveys", text: "Surveys" },
        { href: "/admin", text: "Overview" },
        { href: "/admin/users", text: "Users" },
        { href: "/admin/waitlist/analytics", text: "Analytics" },
        { href: "/admin/newsletter", text: "Subscribers" },
        { href: "/admin/leads", text: "Manage Leads" },
        { href: "/admin/feature-template", text: "Manage Feature Templates" },
        { href: "/admin/survey", text: "Manage Surveys" },
        { href: "/admin/faq-manager", text: "Manage FAQ" },
      ].map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          isActive={isActive(link.href)}
          text={link.text}
          onClick={onLinkClick}
        />
      ))
    }

    // Common links for all users
    const commonLinks = [{ href: "/dashboard", text: "Dashboard" }]

    // Role-specific links based on current path/role
    const activeRole = determineRoleFromPath()
    let roleLinks: { href: string; text: string }[] = []

    switch (activeRole) {
      case Srenova_UserRole.SELLER:
        roleLinks = [
          { href: "/seller/properties", text: "My Properties" },
          { href: "/seller/offers", text: "Offers" },
          { href: "/seller/documents", text: "Documents" },
          { href: "/seller/support", text: "Support" },
        ]
        break

      case Srenova_UserRole.FUND_BUYER:
        roleLinks = [
          { href: "/fund-buyer/dashboard", text: "Investments" },
          { href: "/fund-buyer/properties", text: "Available Properties" },
          { href: "/fund-buyer/analytics", text: "Analytics" },
        ]
        break

      case Srenova_UserRole.FAMILY_SUPPORTER:
        roleLinks = [
          { href: "/family-supporter/dashboard", text: "Overview" },
          { href: "/family-supporter/family-members", text: "Family Members" },
          { href: "/family-supporter/support", text: "Support" },
        ]
        break

      case Srenova_UserRole.CONVEYANCER:
        roleLinks = [
          { href: "/conveyancer/cases", text: "Active Cases" },
          { href: "/conveyancer/documents", text: "Documents" },
          { href: "/conveyancer/clients", text: "Clients" },
        ]
        break

      case Srenova_UserRole.VALUER:
        roleLinks = [
          { href: "/valuer/dashboard", text: "Valuations" },
          { href: "/valuer/properties", text: "Properties" },
          { href: "/valuer/reports", text: "Reports" },
        ]
        break

      default:
        roleLinks = []
    }

    // Add profile link
    roleLinks.push({ href: "/profile", text: "Profile" })

    // Add admin link if user is admin (only when not on admin routes)
    // if (
    //   !isAdminRoute &&
    //   (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN")
    // ) {
    //   roleLinks.push({ href: "/admin", text: "Admin" })
    // }

    // Combine and deduplicate links
    const allLinks = [...commonLinks, ...roleLinks]
    const uniqueLinks = Array.from(
      new Map(allLinks.map((link) => [link.href, link])).values()
    )

    // Render the links
    return uniqueLinks.map((link) => (
      <NavLink
        key={link.href}
        href={link.href}
        isActive={isActive(link.href)}
        text={link.text}
        onClick={onLinkClick}
      />
    ))
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {renderNavLinks()}
    </div>
  )
}

"use client"
// import { Srenova_UserRole } from "@package/db"

import { cn } from "@package/utils"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { useAuth } from "@/hooks/useAuth"

type NavLinkProps = {
  href: string
  text: string
  isActive: boolean
  onClick?: () => void
  target?: string
  rel?: string
  isButton?: boolean
  icon?: React.ReactNode
}

function NavLink({
  href,
  text,
  isActive,
  onClick,
  target,
  rel,
  isButton,
  icon,
}: NavLinkProps) {
  if (isButton) {
    return (
      <Link
        href={href}
        rel={rel}
        target={target}
        className={cn(
          "flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground" : "text-foreground"
        )}
        onClick={onClick}
      >
        {icon}
        {text}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      rel={rel}
      target={target}
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

type HorizontalNavLinksProps = {
  className?: string
  onLinkClick?: () => void
}

export function HorizontalNavLinks({
  className,
  onLinkClick,
}: HorizontalNavLinksProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const params = useParams()

  // const defaultRole: Srenova_UserRole[] = [Srenova_UserRole.SELLER]
  // const userRoles = user?.SrenovaRole ?? defaultRole

  const lng = params.lng as string

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`)

  // Check if we're on admin routes
  const isAdminRoute = pathname.startsWith(`/${lng}/admin`)

  // Generate navigation links based on roles
  const renderNavLinks = () => {
    // If on admin route and user is admin, show admin navigation
    if (
      isAdminRoute &&
      (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN")
    ) {
      return [
        { href: "/admin", text: "Overview" },
        { href: "/admin/users", text: "Users" },
        { href: "/admin/properties", text: "Properties" },
        { href: "/admin/buy-box-creation", text: "Buy Box Creation" },
        { href: "/admin/faq-manager", text: "Manage FAQ" },
        { href: "/admin/security", text: "Security" },
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

    // Otherwise show user navigation
    const commonLinks = [
      {
        href: `${process.env.NEXT_PUBLIC_MARKETING_URL}`,
        text: "Home",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      { href: "/", text: "My Srenova" },
      // { href: "/buyer-onboarding", text: "Buyer Onboarding" },
    ]

    // Always include profile link
    // const userLinks = [{ href: "/profile", text: "Profile" }]

    // // Add admin link for admins (only when not on admin routes)
    // if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
    //   userLinks.push({ href: "/admin", text: "Admin" })
    // }

    // Combine links
    const allLinks = [...commonLinks]

    // Render the links
    return allLinks.map((link) => (
      <NavLink
        key={link.href}
        href={link.href}
        isActive={isActive(link.href)}
        rel={link.rel}
        target={link.target}
        text={link.text}
        onClick={onLinkClick}
      />
    ))
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {renderNavLinks()}
    </div>
  )
}

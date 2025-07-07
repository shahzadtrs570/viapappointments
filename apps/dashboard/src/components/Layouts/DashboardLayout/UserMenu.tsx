/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Srenova_UserRole } from "@package/db"
import { Button } from "@package/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import { Typography } from "@package/ui/typography"
import { featureFlags } from "@package/utils"
import { CircleUser } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

import { Authorization } from "@/components/Misc/Authorization/Authorization"
import { useAuth } from "@/hooks/useAuth"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

const roleToPath: Record<Srenova_UserRole, string> = {
  [Srenova_UserRole.SELLER]: "/seller",
  [Srenova_UserRole.FUND_BUYER]: "/fund-buyer",
  [Srenova_UserRole.VALUER]: "/valuer",
  [Srenova_UserRole.CONVEYANCER]: "/conveyancer",
  [Srenova_UserRole.FAMILY_SUPPORTER]: "/family-supporter",
}

export type UserMenuProps = {
  isRoleBased?: boolean
}

export function UserMenu({ isRoleBased = false }: UserMenuProps) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useClientTranslation("user_menu")

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const getCurrentRole = (path: string): Srenova_UserRole | null => {
    const entry = Object.entries(roleToPath).find(([_, rolePath]) =>
      path.startsWith(rolePath)
    )
    return entry ? (entry[0] as Srenova_UserRole) : null
  }

  const currentRole = getCurrentRole(pathname)
  const isMainDashboard = pathname === "/"
  const isSuperAdmin = user?.role === "SUPER_ADMIN"
  const isAdmin = user?.role === "ADMIN"

  const getDashboardLabel = () => {
    if (isSuperAdmin) return t("dashboardLabel.SUPER_ADMIN")
    if (isAdmin) return t("dashboardLabel.ADMIN")
    return t("dashboardLabel.USER")
  }

  const handleSignOut = async () => {
    await signOut()
    localStorage.clear()
  }

  // Filter out current role from user's assigned roles
  const baseRoles = (user?.SrenovaRole || []).filter(
    (role) => role !== currentRole
  ) as Srenova_UserRole[]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size="icon" variant="secondary">
          {user?.image ? (
            <Image
              alt={"avatar"}
              className="rounded-full"
              height={20}
              src={user.image}
              width={20}
            />
          ) : (
            <CircleUser className="size-5" />
          )}
          <span className="sr-only">{t("srOnly.toggleUserMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col">
          <Typography className="text-muted-foreground" variant="body">
            {capitalizeFirstLetter(user?.name || "")}
          </Typography>
          <Typography className="text-muted-foreground" variant="body">
            {user?.email}
          </Typography>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!pathname.startsWith("/admin") && (
          <Authorization allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              {t("menuItems.adminDashboard")}
            </DropdownMenuItem>
          </Authorization>
        )}

        {/* <DropdownMenuItem onClick={() => router.push("/my-properties")}>
          {t("menuItems.myProperties")}
        </DropdownMenuItem> */}

        {/* {baseRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => router.push(roleToPath[role])}
          >
            {t(`roles.${role}`)}
          </DropdownMenuItem>
        ))} */}
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          {t("menuItems.profile")}
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => router.push("/billing")}>
          Billing
        </DropdownMenuItem> */}
        {process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN &&
          featureFlags.feedbackWidget && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/feedback")}>
                {t("menuItems.giveFeedback")}
              </DropdownMenuItem>
            </>
          )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSignOut()}>
          {t("menuItems.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

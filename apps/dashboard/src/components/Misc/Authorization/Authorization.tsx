"use client"

import { ROLES, type RoleTypes } from "@package/auth/types"

import { useAuthorization } from "../../../hooks/useAuthorization"

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode
  children: React.ReactNode
} & (
  | {
      allowedRoles: RoleTypes[]
      policyCheck?: never
    }
  | {
      allowedRoles?: never
      policyCheck: boolean
    }
)

export const allRoles = Object.values(ROLES)

export function Authorization({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) {
  const { checkAccess } = useAuthorization()

  let canAccess = false

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles })
  }

  if (typeof policyCheck !== "undefined") {
    canAccess = policyCheck
  }

  return <>{canAccess ? children : forbiddenFallback}</>
}

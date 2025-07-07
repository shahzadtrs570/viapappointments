"use client"

import type { RouterOutputs } from "@package/api"

import { useAuth } from "@/hooks/useAuth"

type UserInitializerProps = {
  initialUser: RouterOutputs["user"]["getMe"]
}

export function UserInitializer({ initialUser }: UserInitializerProps) {
  useAuth({ initialUser })

  return null
}

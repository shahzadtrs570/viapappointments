import type { RouterOutputs } from "@package/api"
import type { Prisma } from "@package/db"
import type { ChartData } from "@package/ui/charts"
import type { BanSchema } from "@package/validations"
import type { UseFormReturn } from "react-hook-form"

export type ChartProps = {
  lineColors: Record<string, string>
  chartData: ChartData
}

export type BanUserDialogProps = {
  form: UseFormReturn<BanSchema>
  userId: string
  userEmail: string
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type Bans = Prisma.BanGetPayload<{
  include: {
    bannedBy: { select: { email: true } }
    unbannedBy: { select: { email: true } }
  }
}>

export type PerformedBans = Prisma.BanGetPayload<{
  include: {
    user: { select: { email: true } }
    unbannedBy: { select: { email: true } }
  }
}>

export type PerformedUnBans = Prisma.BanGetPayload<{
  include: {
    user: { select: { email: true } }
    bannedBy: { select: { email: true } }
  }
}>

export type UserProfile = Prisma.UserGetPayload<{
  include: {
    subscription: true
    accounts: {
      select: {
        provider: true
      }
    }
    bans: {
      include: {
        bannedBy: { select: { email: true } }
        unbannedBy: { select: { email: true } }
      }
    }
    performedBans: {
      include: {
        user: { select: { email: true } }
        unbannedBy: { select: { email: true } }
      }
    }
    performedUnbans: {
      include: {
        user: { select: { email: true } }
        bannedBy: { select: { email: true } }
      }
    }
  }
}>

export type Statistics = RouterOutputs["admin"]["statistics"]

export type PaginatedUsers = RouterOutputs["admin"]["users"]["list"]

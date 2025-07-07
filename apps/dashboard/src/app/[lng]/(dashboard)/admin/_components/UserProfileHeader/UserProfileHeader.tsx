/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
import { Avatar, AvatarFallback, AvatarImage } from "@package/ui/avatar"
import { Card } from "@package/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@package/ui/tooltip"
import { Typography } from "@package/ui/typography"
import { ShieldCheck, ShieldX } from "lucide-react"

// import type { UserProfile } from "@/app/(dashboard)/admin/_types"
import type { UserProfile } from "@/app/[lng]/(dashboard)/admin/_types"

import { ImpersonateUserButton } from "../ImpersonateUserButton/ImpersonateUserButton"

type UserProfileHeaderProps = {
  user: UserProfile
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <Card className="mt-8 gap-4 space-y-4 p-6 lg:flex lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:p-7">
      <section className="relative lg:flex lg:items-center lg:gap-7">
        <Avatar className="left:top-0 absolute -top-[calc(50%-18px)] left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 lg:relative lg:left-0 lg:translate-x-0 lg:translate-y-0">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        <section className="flex flex-col items-center lg:items-start">
          <Typography className="mt-8 lg:mt-0" variant="large">
            {user.name}
          </Typography>
          <section className="flex items-center gap-4">
            <Typography>{user.email}</Typography>
            {user.emailVerified ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ShieldCheck className="size-5 text-success" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Typography variant="body">Email verified</Typography>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ShieldX className="size-5 text-destructive " />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Typography variant="body">Email not verified</Typography>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </section>
        </section>
      </section>
      <section className="self-start">
        <ImpersonateUserButton userId={user.id} />
      </section>
    </Card>
  )
}

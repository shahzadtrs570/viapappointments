import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Typography } from "@package/ui/typography"
import { formatDateToMonthDayYear } from "@package/utils"
import { CheckCircle2, XCircle } from "lucide-react"

// import type { UserProfile } from "@/app/(dashboard)/admin/_types"
import type { UserProfile } from "@/app/[lng]/(dashboard)/admin/_types"

type UserAccountInfoProps = {
  user: UserProfile
}
export function UserAccountInfo({ user }: UserAccountInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 md:flex-row md:gap-32 xl:gap-52">
        <section className="flex flex-col gap-4">
          <section className="flex flex-col">
            <Typography className="font-bold">ID</Typography>
            <Typography>{user.id}</Typography>
          </section>
          <section className="flex flex-col">
            <Typography className="font-bold">Provider</Typography>
            <Typography>
              {user.accounts.length > 0 && user.accounts[0].provider}
            </Typography>
          </section>
        </section>

        <section className="flex flex-col gap-4">
          <section className="flex flex-col">
            <Typography className="font-bold">Account created</Typography>
            <Typography>{formatDateToMonthDayYear(user.createdAt)}</Typography>
          </section>
          <section className="flex flex-col">
            <section className="flex flex-col">
              <Typography className="font-bold">Role</Typography>
              <Typography>{user.role}</Typography>
            </section>
          </section>
        </section>

        <section className="flex flex-col gap-4">
          <section>
            <Typography className="mb-1 font-bold">Onboarded</Typography>

            <Typography className="flex items-center gap-1">
              {user.hasOnboarded ? (
                <>
                  <CheckCircle2 className="size-5 text-success" /> Yes
                </>
              ) : (
                <>
                  <XCircle className="size-5 text-destructive" /> No
                </>
              )}
            </Typography>
          </section>
          <section className="flex flex-col">
            <Typography className="mb-1 font-bold">Is Banned</Typography>
            <Typography className="flex items-center gap-1">
              {user.isBanned ? (
                <>
                  <XCircle className="size-5 text-destructive" /> Yes
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-5 text-success" /> No
                </>
              )}
            </Typography>
          </section>
        </section>
      </CardContent>
    </Card>
  )
}

import { Typography } from "@package/ui/typography"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Banned",
  description: "Banned",
}

export default function BannedPage() {
  return (
    <section className="flex flex-col gap-2">
      <Typography variant="h1">You&apos;ve been banned!</Typography>
      <Typography>
        Your account has been suspended for breaking our policy. Please contact
        support for more information.
      </Typography>
    </section>
  )
}

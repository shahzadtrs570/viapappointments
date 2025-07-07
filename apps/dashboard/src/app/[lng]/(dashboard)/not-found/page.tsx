import { Container } from "@package/ui/container"
import { Typography } from "@package/ui/typography"
import Link from "next/link"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Not Found",
  description: "Not Found",
}

export default function NotFoundPage() {
  return (
    <Container className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <Typography variant="h1">Not Found</Typography>
        <Typography variant="lead">
          Could not find the requested resource.
        </Typography>
        <Link className="mt-6 rounded-md bg-primary px-4 py-2  " href="/">
          Return to Dashboard
        </Link>
      </div>
    </Container>
  )
}

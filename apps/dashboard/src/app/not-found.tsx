/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/rules-of-hooks */
"use client"

import { Button } from "@package/ui/button"
import { Container } from "@package/ui/container"
import { Typography } from "@package/ui/typography"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <Container className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <Typography className="text-center" variant="h1">
          Not Found
        </Typography>
        <Typography className="mt-2" variant="lead">
          Could not find the requested resource.
        </Typography>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => router.back()}>Go Back</Button>{" "}
      </div>
    </Container>
  )
}

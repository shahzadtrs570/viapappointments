import { Container } from "@package/ui/container"

import type { Metadata } from "next"

import { Auth } from "../_components/Auth/Auth"

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up page.",
}

export default function SignUpPage() {
  return (
    <Container className="flex flex-col items-center justify-center min-h-dynamic-screen">
      <Auth isSignUp />
    </Container>
  )
}

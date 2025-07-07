"use client"

import { Suspense } from "react"

import { Container } from "@package/ui/container"

import { Auth } from "../_components/Auth/Auth"
import { useEligibilityData } from "../_hooks/useEligibilityData"

function SignInContent() {
  useEligibilityData()

  return (
    <Container className="flex flex-col items-center justify-center min-h-dynamic-screen">
      <Auth />
    </Container>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  )
}

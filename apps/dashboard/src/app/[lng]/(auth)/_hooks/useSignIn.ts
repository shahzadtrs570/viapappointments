import type { FormEvent } from "react"
import { useCallback, useState } from "react"

import { validateEmail } from "@package/utils"
import { signIn } from "next-auth/react"

import type { BuiltInProviderType } from "next-auth/providers/index"
import type { LiteralUnion } from "next-auth/react"

type UseSignInProps = {
  isSignUp?: boolean
}

export function useSignIn({ isSignUp = false }: UseSignInProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showModal, setshowModal] = useState(false)

  const handleLoginWithEmail = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      try {
        setError("")
        setLoading(true)

        // Validate email against allow/block lists
        const validationResult = validateEmail(email)
        if (!validationResult.isValid) {
          setError(validationResult.reason || "Invalid email address")
          setLoading(false)
          return
        }

        const signInResponse = await signIn("email", {
          redirect: false,
          callbackUrl: "/",
          email: email,
        })

        if (signInResponse?.error) {
          setError(
            `Failed to sign ${isSignUp ? "up" : "in"}. Please try again.`
          )
        }

        if (signInResponse?.ok && signInResponse.url) {
          setshowModal(true)
        }
      } catch (error) {
        setError("An error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    [email, isSignUp]
  )

  const submitWithTurnstileToken = useCallback(
    async (turnstileToken: string) => {
      try {
        setError("")
        setLoading(true)

        const signInResponse = await signIn("email", {
          redirect: false,
          callbackUrl: "/",
          email: email,
          turnstileToken: turnstileToken,
        })

        if (signInResponse?.error) {
          setError(
            `Failed to sign ${isSignUp ? "up" : "in"}. Please try again.`
          )
        }

        if (signInResponse?.ok && signInResponse.url) {
          setshowModal(true)
        }
      } catch (error) {
        setError("An error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    [email, isSignUp]
  )

  const handleLoginWithProvider = useCallback(
    async (provider: LiteralUnion<BuiltInProviderType> | undefined) => {
      try {
        setLoading(true)
        await signIn(provider, { callbackUrl: "/" })
      } catch (error) {
        setError("An error occurred. Please try again.")
        setLoading(false)
      }
    },
    []
  )

  return {
    error,
    email,
    setEmail,
    showModal,
    setshowModal,
    handleLoginWithEmail,
    handleLoginWithProvider,
    loading,
    submitWithTurnstileToken,
  }
}

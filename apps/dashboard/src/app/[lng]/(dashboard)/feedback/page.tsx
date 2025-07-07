/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { serverSession } from "@package/auth"
import { featureFlags } from "@package/utils"
import jwt from "jsonwebtoken"
import { notFound } from "next/navigation"

import type { Metadata } from "next"
import type { User } from "next-auth"

import { CannyFeedback } from "@/lib/canny"

export const metadata: Metadata = {
  title: "Feedback",
  description: "Feedback",
}

export default async function FeedbackPage() {
  const session = await serverSession()

  if (
    !session ||
    !process.env.CANNY_PRIVATE_KEY ||
    !featureFlags.feedbackWidget
  ) {
    return notFound()
  }

  function createCannyToken(user: User) {
    const userData = {
      avatarURL: user.image,
      email: user.email,
      id: user.id,
      name: user.name,
    }
    // eslint-disable-next-line import/no-named-as-default-member
    return jwt.sign(userData, process.env.CANNY_PRIVATE_KEY!, {
      algorithm: "HS256",
    })
  }

  const ssoToken = createCannyToken(session.user)

  return process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN ? (
    <CannyFeedback ssoToken={ssoToken} />
  ) : (
    notFound()
  )
}

import crypto from "crypto"

import { EmailVerification, sendEmail } from "@package/email"
import { TRPCError } from "@trpc/server"

import type {
  ChangeNameArgs,
  UpdateUserOnboardingArgs,
} from "./user.service.types"
import type { UserSession } from "@package/auth/types"

import { adminUserRepository } from "../../admin/sub-routers/adminUser/repository/adminUser.repository"
import { paymentsService } from "../../payments/service/payments.service"
import { userRepository } from "../repository/user.repository"

class UserService {
  public async updateUserOnboarding(args: UpdateUserOnboardingArgs) {
    if (!args.session) {
      throw new TRPCError({
        message: "You need to be logged in to onboard.",
        code: "UNAUTHORIZED",
      })
    }

    if (args.session.hasOnboarded) {
      throw new TRPCError({
        message: "You have already onboarded.",
        code: "FORBIDDEN",
      })
    }

    // Give free trial
    await paymentsService.giveFreeTrial({
      input: args.input,
      session: args.session,
    })

    // update user with onboarding data
    await userRepository.updateUserOnboardingById({
      userId: args.session.id,
      onboardingData: args.input,
    })
  }

  public getUserMe(session: UserSession) {
    return userRepository.getUserById(session.id)
  }

  public async changeName(args: ChangeNameArgs) {
    await userRepository.changeNameById({
      name: args.input.name,
      userId: args.session.id,
    })
  }

  public async deleteUserById(session: UserSession) {
    await adminUserRepository.deleteUserById(session.id)
  }

  public async sendVerificationEmail(session: UserSession) {
    if (!session.email) {
      throw new TRPCError({
        message: "No email address found for this user.",
        code: "BAD_REQUEST",
      })
    }

    const user = await userRepository.getUserById(session.id)

    if (user?.emailVerified) {
      return { success: true, message: "Email already verified" }
    }

    try {
      // Generate verification token and URL
      const verificationToken = crypto.randomUUID()

      // Store the token in the database
      await userRepository.saveVerificationToken({
        userId: session.id,
        token: verificationToken,
      })

      // Create verification URL
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}&userId=${session.id}`

      // Send verification email
      await sendEmail({
        email: [session.email],
        subject: "Verify your email address",
        react: EmailVerification({
          email: session.email,
          url: verificationUrl,
          name: session.name || "User",
        }),
      })

      return { success: true, message: "Verification email sent" }
    } catch (error) {
      console.error("Failed to send verification email:", error)
      throw new TRPCError({
        message: "Failed to send verification email",
        code: "INTERNAL_SERVER_ERROR",
      })
    }
  }

  public async checkEmailVerification(session: UserSession) {
    if (!session.id) {
      throw new TRPCError({
        message: "User not found",
        code: "NOT_FOUND",
      })
    }

    const user = await userRepository.getUserById(session.id)

    return {
      isVerified: !!user?.emailVerified,
      email: user?.email || session.email,
    }
  }
}

export const userService = new UserService()

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable import/no-default-export */
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@package/db"
// eslint-disable-next-line import/order
import { MagicLinkSignIn, sendEmail } from "@package/email"
import { validateEmail } from "@package/utils"

// eslint-disable-next-line import/no-named-as-default
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import type { UserSession } from "../types"
import type { $Enums, Account } from "@package/db"
import type {
  Account as AuthAccount,
  DefaultSession,
  NextAuthOptions,
  Session,
  TokenSet,
} from "next-auth"
import type { Adapter } from "next-auth/adapters"
import type { DefaultJWT } from "next-auth/jwt"

export type ExtendedSession = {
  id: string
  role: $Enums.Role
  hasOnboarded: boolean
  isBanned: boolean
  isCompanyUser: boolean
  emailVerified: Date | null
}

type RefreshAccessTokenError = "RefreshAccessTokenError"
type EmailValidationError = "EmailValidationError"
type AuthError =
  | RefreshAccessTokenError
  | EmailValidationError
  | "UserNotFoundError"

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT, ExtendedSession {
    error?: AuthError
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: UserSession & {
      emailVerified: Date | null
    }
    error?: AuthError
  }
}

async function updateRefreshToken(account: AuthAccount) {
  try {
    await db.account.update({
      where: {
        provider_providerAccountId: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      },
      data: {
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
      },
    })
  } catch (error) {
    console.error("Error updating refresh token", error)
  }
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(dbAccount: Account, session: Session) {
  try {
    // https://accounts.google.com/.well-known/openid-configuration
    // We need the `token_endpoint`.
    const response = await fetch("https://oauth2.googleapis.com/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: dbAccount.refresh_token!,
      }),
      method: "POST",
    })

    const tokens: TokenSet = await response.json()

    if (!response.ok) throw tokens

    await db.account.update({
      data: {
        access_token: tokens.access_token,
        expires_at: Math.floor(
          Date.now() / 1000 + (tokens.expires_in as number)
        ),
        refresh_token: tokens.refresh_token ?? dbAccount.refresh_token,
      },
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: dbAccount.providerAccountId,
        },
      },
    })
  } catch (error) {
    console.error("Error refreshing access token", error)
    // The error property will be used client-side to handle the refresh token error
    session.error = "RefreshAccessTokenError"
  }
}

// Utility function to check if email is a company user
function isCompanyUserEmail(email: string): boolean {
  if (!email) return false

  try {
    // Import the config
    const config = require("../../../../rain.config")

    // Check if the email exists in the company users array
    const companyUsers = config.default?.company?.users || []

    return companyUsers.some(
      (user: { email: string }) =>
        user.email.toLowerCase() === email.toLowerCase()
    )
  } catch (error) {
    console.error("Error checking company user:", error)
    return false
  }
}

const scopes = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
]

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: scopes.join(" "),
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    EmailProvider({
      type: "email",
      async sendVerificationRequest({ identifier: email, url }) {
        // Validate email against allow/block lists
        const validationResult = validateEmail(email)
        if (!validationResult.isValid) {
          console.error(
            `Email validation failed for ${email}: ${validationResult.reason}`
          )
          throw new Error(
            validationResult.reason ||
              "This email address is not allowed to sign in"
          )
        }

        // Call the cloud Email provider API for sending emails

        // Debug magic link in development environment
        if (
          process.env.NEXT_PUBLIC_APP_ENV === "development" &&
          process.env.DEBUG_MAGIC_LINK === "true"
        ) {
          console.log(
            "\n------------------------------------------------------------"
          )
          console.log("🔑 MAGIC LINK for development:")
          console.log(url)
          console.log(
            "------------------------------------------------------------\n"
          )

          //skip sending email in development environment
          return
        }

        try {
          await sendEmail({
            email: [email],
            subject: "Magic Link Sign In/Register",
            react: MagicLinkSignIn({
              email: email,
              url,
            }),
          })
        } catch (error) {
          throw new Error(JSON.stringify(error))
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // User and account is only returned on sign in
      // Token is returned for every authentication session

      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user.id
        }
        return token
      }

      if (account?.provider === "google") {
        await updateRefreshToken(account)
      }

      // Validate email again during token creation
      if (token.email) {
        const validationResult = validateEmail(token.email)
        if (!validationResult.isValid) {
          console.error(
            `Token creation blocked for ${token.email}: ${validationResult.reason}`
          )
          // Add an error to the token that will be forwarded to the session
          token.error = "EmailValidationError"
          return token
        }
      }

      // Check if user is a company user and update the database if needed
      const isCompanyUser = isCompanyUserEmail(dbUser.email || "")
      if (isCompanyUser !== dbUser.isCompanyUser) {
        // Update the database with the correct company user status
        await db.user.update({
          where: { id: dbUser.id },
          data: { isCompanyUser },
        })
      }

      // These are forwarded to the session in the token object
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
        hasOnboarded: dbUser.hasOnboarded,
        isBanned: dbUser.isBanned,
        isCompanyUser,
        SrenovaRole: dbUser.SrenovaRole,
        emailVerified: dbUser.emailVerified,
      }
    },
    async session({ token, session }) {
      // Check if user still exists in DB
      const dbUser = await db.user.findUnique({
        where: {
          id: token.id,
        },
      })

      if (!dbUser) {
        // Set a specific error that will trigger client-side cookie clearing
        session.error = "UserNotFoundError"
        return session
      }

      const dbAccount = await db.account.findFirst({
        where: {
          userId: token.id,
        },
      })

      if (
        dbAccount?.expires_at &&
        dbAccount.expires_at * 1000 < Date.now() &&
        dbAccount.provider === "google"
      ) {
        await refreshAccessToken(dbAccount, session)
      }

      // Forward any validation errors to the client
      if (token.error === "EmailValidationError") {
        throw new Error(
          "Your email address is not allowed to access this application"
        )
      }

      // Forward the content of the token to the session so it's available client-side
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role
        session.user.hasOnboarded = token.hasOnboarded
        session.user.isBanned = token.isBanned
        session.user.isCompanyUser = token.isCompanyUser
        session.user.SrenovaRole =
          token.SrenovaRole as $Enums.Srenova_UserRole[]
        session.user.emailVerified = token.emailVerified ?? null
      }

      return session
    },

    async signIn({ user, account }) {
      try {
        // Double check email validation for all providers (including OAuth)
        if (user.email) {
          const validationResult = validateEmail(user.email)
          if (!validationResult.isValid) {
            console.error(
              `OAuth sign-in blocked for ${user.email}: ${validationResult.reason}`
            )
            return false // This will redirect to error page with default message
          }

          // Additional validation for OAuth providers
          if (
            account?.provider &&
            ["google", "github"].includes(account.provider)
          ) {
            // You could add additional OAuth-specific validation here
            // For example, checking company domain for Google accounts
            const domain = user.email.split("@")[1]
            if (!domain) {
              console.error(
                `Invalid email format for OAuth sign-in: ${user.email}`
              )
              return false
            }
          }
        } else {
          console.error("Sign-in attempt without email address")
          return false
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false // Safely handle any errors by blocking sign-in
      }
    },
  },
}

export default authOptions

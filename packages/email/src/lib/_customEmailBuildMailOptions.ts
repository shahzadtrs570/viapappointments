import { EmailProviders, Users } from "./sendEmail"

interface IEnvironmentVariables {
  ENV_CLIENT_AUTH_GMAIL_FROM: string // Ensure this is a string
  ENV_CLIENT_AUTH_ADMIN_EMAIL: string // Ensure this is a string
  UNKNOWN_SYSTEM_ERROR_MESSAGE?: string // Optional for error messages
}

interface EmailOptions {
  options: {
    from?: string
    to?: string | string[] // Adjusted to handle multiple emails
    include_email_tokens?: string[]
    channel_for_external_user_ids?: string[]
    include_unsubscribed?: boolean
  }
}

const getEnvironmentVariables = (): IEnvironmentVariables => {
  return process.env as unknown as IEnvironmentVariables
}

const fnEmailBuildMailOptions = function (
  emailType: Users.User | Users.Admin,
  emailAddresses: string | string[], // Adjusted to accept multiple emails
  emailProvider: string
): EmailOptions | { status: number; message: string } {
  const {
    ENV_CLIENT_AUTH_GMAIL_FROM,
    ENV_CLIENT_AUTH_ADMIN_EMAIL,
    UNKNOWN_SYSTEM_ERROR_MESSAGE,
  } = getEnvironmentVariables()

  // Check required environment variables
  if (emailProvider === EmailProviders.Gmail && !ENV_CLIENT_AUTH_GMAIL_FROM) {
    console.error("EMAIL BUILD OPTIONS - Missing ENV_CLIENT_AUTH_GMAIL_FROM")
    return {
      status: 500,
      message: "Missing Gmail 'from' address configuration",
    }
  }

  if (emailType === Users.Admin && !ENV_CLIENT_AUTH_ADMIN_EMAIL) {
    console.error("EMAIL BUILD OPTIONS - Missing ENV_CLIENT_AUTH_ADMIN_EMAIL")
    return { status: 500, message: "Missing admin email configuration" }
  }

  // Helper function to get Gmail options
  const getGmailOptions = (
    from: string,
    to: string | string[]
  ): EmailOptions => {
    console.log("EMAIL BUILD OPTIONS - Gmail options:", { from, to })
    return {
      options: {
        from,
        to: Array.isArray(to) ? to.join(", ") : to, // Join multiple emails into a string
      },
    }
  }

  // Helper function to get OneSignal options
  const getOneSignalOptions = (to: string | string[]): EmailOptions => {
    console.log("EMAIL BUILD OPTIONS - OneSignal options for:", to)
    return {
      options: {
        include_email_tokens: Array.isArray(to) ? to : [to], // Convert to array if necessary
        channel_for_external_user_ids: Array.isArray(to) ? to : [to], // Use the
        include_unsubscribed: true,
      },
    }
  }

  try {
    let result: EmailOptions

    switch (emailType) {
      case Users.User:
        console.log("EMAIL BUILD OPTIONS - Building for User")
        switch (emailProvider) {
          case EmailProviders.Gmail: {
            const from = ENV_CLIENT_AUTH_GMAIL_FROM
            console.log("EMAIL BUILD OPTIONS - User Gmail from:", from)
            result = getGmailOptions(from, emailAddresses)
            break
          }
          case EmailProviders.OneSignal: {
            console.log("EMAIL BUILD OPTIONS - User OneSignal")
            result = getOneSignalOptions(emailAddresses)
            break
          }
          default:
            console.error(
              "EMAIL BUILD OPTIONS - Unknown provider:",
              emailProvider
            )
            throw new Error("UNKNOWN_ENV_EMAIL_PROVIDER")
        }
        break

      case Users.Admin:
        console.log("EMAIL BUILD OPTIONS - Building for Admin")
        switch (emailProvider) {
          case EmailProviders.Gmail: {
            const from = ENV_CLIENT_AUTH_GMAIL_FROM
            const to = ENV_CLIENT_AUTH_ADMIN_EMAIL
            console.log("EMAIL BUILD OPTIONS - Admin Gmail:", { from, to })
            result = getGmailOptions(from, to)
            break
          }
          case EmailProviders.OneSignal: {
            const to = ENV_CLIENT_AUTH_ADMIN_EMAIL
            console.log("EMAIL BUILD OPTIONS - Admin OneSignal:", to)
            result = getOneSignalOptions(to)
            break
          }
          default:
            console.error(
              "EMAIL BUILD OPTIONS - Unknown provider:",
              emailProvider
            )
            throw new Error("UNKNOWN_ENV_EMAIL_PROVIDER")
        }
        break

      default:
        console.error("EMAIL BUILD OPTIONS - Unknown email type:", emailType)
        throw new Error("UNKNOWN_EMAIL_TO_TYPE")
    }

    console.log("EMAIL BUILD OPTIONS - Final options:", result)
    return result
  } catch (error) {
    console.error("EMAIL BUILD OPTIONS - Error:", error)
    return {
      status: 500,
      message:
        UNKNOWN_SYSTEM_ERROR_MESSAGE ||
        "Unknown error in mail options building",
    }
  }
}

export default fnEmailBuildMailOptions

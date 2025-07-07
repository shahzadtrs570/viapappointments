import { render } from "@react-email/render"

import type { EmailOptions } from "./sendEmail"

import fnEmailBuildMailOptions from "./_customEmailBuildMailOptions"
import fnEmailTransportorCreate from "./_customEmailTransportor"
import { EmailProviders, Users } from "./sendEmail"

interface IEnvironmentVariables {
  UNKNOWN_SYSTEM_ERROR_MESSAGE: string
  ENV_CLIENT_AUTH_ADMIN_EMAIL: string
}

interface FnEmailUserSendResponse {
  status: number
  message?: string
  error?: Error // Optional for error handling
}

const getEmailProviderConfig = (): IEnvironmentVariables => {
  return process.env as unknown as IEnvironmentVariables
}

// Define types for Gmail and OneSignal mail options
type GmailMailOptions = {
  from: string
  to: string // Updated to accept string or array of strings
  subject: string
  html: string
}

type OneSignalMailOptions = {
  from: string
  to: string // Updated to accept string or array of strings
  subject: string
  include_email_tokens: Record<string, string>
  channel_for_external_user_ids?: string[]
  include_unsubscribed?: boolean
  email_subject: string
  email_body: string
}

// Union type for both mail options
type MailOptions = GmailMailOptions | OneSignalMailOptions

export const fnEmailUserSend = async function (
  fnOptions: EmailOptions,
  email_provider: string
): Promise<FnEmailUserSendResponse> {
  try {
    console.log("CUSTOM EMAIL SEND - Starting with provider:", email_provider)
    const { email, subject, react } = fnOptions // Destructure the options parameter

    // Render the React component to a static HTML string
    console.log("CUSTOM EMAIL SEND - Rendering React component")
    const htmlContent = await render(react)

    // Use all provided email addresses or default to one
    const emailAddresses = email // Could be an array of emails
    console.log("CUSTOM EMAIL SEND - Recipients:", emailAddresses)

    // Fetch email provider configuration for each email address
    const mailOptionsList: MailOptions[] = []

    for (const emailAddress of emailAddresses) {
      console.log(
        "CUSTOM EMAIL SEND - Building mail options for:",
        emailAddress
      )
      const result = fnEmailBuildMailOptions(
        Users.User, // Assuming you're sending emails to users
        emailAddress,
        email_provider
      )

      if (!("options" in result)) {
        console.error("MAIL OPTIONS ERROR:", result)
        throw new Error("Invalid email_provider configuration")
      }

      let mailOptions
      const options = result.options

      switch (email_provider) {
        case EmailProviders.Gmail:
          console.log("CUSTOM EMAIL SEND - Creating Gmail mail options")
          if (!options.from) {
            console.error("ERROR: Missing 'from' address in mail options")
          }
          mailOptions = {
            from: options.from,
            to:
              emailAddresses.length === 1
                ? emailAddress
                : emailAddresses.join(", "), // For multiple recipients
            subject,
            html: htmlContent,
          } as GmailMailOptions
          break

        case EmailProviders.OneSignal:
          console.log("CUSTOM EMAIL SEND - Creating OneSignal mail options")
          mailOptions = {
            from: options.from || "", // Provide a default if necessary
            include_email_tokens: options.include_email_tokens ?? {},
            channel_for_external_user_ids:
              options.channel_for_external_user_ids,
            include_unsubscribed: options.include_unsubscribed,
            email_subject: subject,
            email_body: htmlContent,
          } as OneSignalMailOptions
          break

        default:
          console.error(`ERROR: Unsupported email provider: ${email_provider}`)
          throw new Error(`Unsupported email_provider: ${email_provider}`)
      }

      mailOptionsList.push(mailOptions)
    }

    // Use the imported function to create email transport and send emails
    console.log("CUSTOM EMAIL SEND - Creating email transporter")
    const transportResponse = fnEmailTransportorCreate(email_provider)
    if (!transportResponse.sendEmail) {
      console.error("ERROR: No sendEmail function returned from transporter")
      throw new Error("Email transport creation failed")
    }

    const { sendEmail } = transportResponse

    console.log("CUSTOM EMAIL SEND - Preparing to send emails")

    // Loop over mailOptionsList to send emails one by one
    for (const mailOptions of mailOptionsList) {
      console.log(
        "CUSTOM EMAIL SEND - Sending email with provider:",
        email_provider
      )

      if (
        email_provider === EmailProviders.Gmail &&
        typeof sendEmail === "function"
      ) {
        try {
          console.log(
            "CUSTOM EMAIL SEND - Calling Gmail sender with options:",
            JSON.stringify(mailOptions, null, 2)
          )
          const result = await sendEmail(mailOptions as GmailMailOptions)
          console.log("GMAIL SEND RESULT:", result)
        } catch (emailError) {
          console.error("GMAIL SEND ERROR:", emailError)
          throw emailError
        }
      } else if (
        email_provider === EmailProviders.OneSignal &&
        typeof sendEmail === "function"
      ) {
        try {
          await sendEmail(mailOptions as OneSignalMailOptions)
        } catch (emailError) {
          console.error("ONESIGNAL SEND ERROR:", emailError)
          throw emailError
        }
      } else {
        console.error("ERROR: Invalid email provider configuration")
        throw new Error("Invalid email provider or sendEmail function.")
      }
    }

    console.log("CUSTOM EMAIL SEND - All emails sent successfully")
    return { status: 200, message: "EMAIL_SENT" }
  } catch (error) {
    console.error("CUSTOM EMAIL SEND - Critical failure:", error)
    const { UNKNOWN_SYSTEM_ERROR_MESSAGE } = getEmailProviderConfig()
    return {
      status: 500,
      message: UNKNOWN_SYSTEM_ERROR_MESSAGE || "Email sending failed",
      error: error as Error, // Cast error to Error type
    }
  }
}

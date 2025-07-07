import { fnEmailUserSend } from "./_customEmailUserSend"
import { resend } from "./resend"

export type EmailOptions = {
  from?: string
  email: string[]
  subject: string
  react: React.ReactElement
}

export enum EmailProviders {
  Resend = "resend",
  Gmail = "gmail",
  OneSignal = "onesignal",
}

export enum Users {
  Admin = "admin",
  User = "user",
}

interface IEnvironmentVariables {
  ENV_CLIENT_EMAIL_PROVIDER: string
}

const getEnvironmentVariables = (): IEnvironmentVariables => {
  return process.env as unknown as IEnvironmentVariables
}

const { ENV_CLIENT_EMAIL_PROVIDER } = getEnvironmentVariables()
// Todo 1: We need an env variable for the def provider
const emailProvider = ENV_CLIENT_EMAIL_PROVIDER

export function sendEmail(options: EmailOptions) {
  if (!emailProvider) {
    console.error(
      "ERROR: No email provider configured. Check ENV_CLIENT_EMAIL_PROVIDER"
    )
    throw new Error("No email provider configured")
  }

  try {
    switch (emailProvider) {
      case EmailProviders.Resend:
        return sendEmailResend(options)
      case EmailProviders.Gmail:
        return sendEmailGmail(options, emailProvider)
      case EmailProviders.OneSignal:
        return sendEmailOneSignal(options, emailProvider)
      default:
        console.error(`ERROR: Invalid email provider: ${emailProvider}`)
        throw new Error("Invalid email provider")
    }
  } catch (error) {
    console.error("EMAIL SENDING FAILED:", error)
    throw error
  }
}

export async function sendEmailResend(options: EmailOptions) {
  try {
    const sentEmailsResponse = await resend.emails.send({
      from:
        options.from ??
        `${process.env.NEXT_PUBLIC_APP_NAME} <${process.env.RESEND_EMAIL_DOMAIN}>`,
      to: options.email,
      subject: options.subject,
      react: options.react,
    })
    return sentEmailsResponse
  } catch (error) {
    console.error("RESEND EMAIL ERROR:", error)
    throw error
  }
}

export function sendEmailGmail(options: EmailOptions, email_provider: string) {
  // Check Gmail environment variables
  if (!process.env.ENV_CLIENT_AUTH_GMAIL_SENDER) {
    console.error("ERROR: ENV_CLIENT_AUTH_GMAIL_SENDER is not set")
    throw new Error("Gmail sender email is not set")
  }

  if (!process.env.ENV_CLIENT_AUTH_GMAIL_SENDER_PASSWORD) {
    console.error("ERROR: ENV_CLIENT_AUTH_GMAIL_SENDER_PASSWORD is not set")
    throw new Error("Gmail sender password is not set")
  }

  if (!process.env.ENV_CLIENT_AUTH_GMAIL_FROM) {
    console.error("ERROR: ENV_CLIENT_AUTH_GMAIL_FROM is not set")
    throw new Error("Gmail from address is not set")
  }

  try {
    return fnEmailUserSend(options, email_provider)
  } catch (error) {
    console.error("GMAIL EMAIL ERROR:", error)
    throw error
  }
}

export function sendEmailOneSignal(
  options: EmailOptions,
  email_provider: string
) {
  return fnEmailUserSend(options, email_provider)
}

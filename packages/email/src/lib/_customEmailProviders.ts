import { EmailProviders } from "./sendEmail"

interface IEnvironmentVariables {
  ENV_CLIENT_AUTH_GMAIL_SENDER: string
  ENV_CLIENT_AUTH_GMAIL_SENDER_PASSWORD: string
  ENV_CLIENT_AUTH_ONESIGNAL_APP_ID: string
  ENV_CLIENT_AUTH_ONESIGNAL_REST_API_KEY: string
}

interface IEmailProviderConfig {
  gmail?: { user: string; pass: string }
  onesignal?: { app_id: string; rest_api_key: string }
}

const getEmailProviderConfig = (): IEnvironmentVariables => {
  return process.env as unknown as IEnvironmentVariables
}

const fnEmailProviderCredentialsGet = (
  email_provider: string
): IEmailProviderConfig => {
  console.log(
    "EMAIL PROVIDER CREDENTIALS - Getting for provider:",
    email_provider
  )

  const config = getEmailProviderConfig()

  // Check for required variables based on provider
  if (email_provider === EmailProviders.Gmail) {
    // Check Gmail specific environment variables
    if (!config.ENV_CLIENT_AUTH_GMAIL_SENDER) {
      console.error(
        "EMAIL PROVIDER CREDENTIALS - Missing ENV_CLIENT_AUTH_GMAIL_SENDER"
      )
    }
    if (!config.ENV_CLIENT_AUTH_GMAIL_SENDER_PASSWORD) {
      console.error(
        "EMAIL PROVIDER CREDENTIALS - Missing ENV_CLIENT_AUTH_GMAIL_SENDER_PASSWORD"
      )
    }
  } else if (email_provider === EmailProviders.OneSignal) {
    // Check OneSignal specific environment variables
    if (!config.ENV_CLIENT_AUTH_ONESIGNAL_APP_ID) {
      console.error(
        "EMAIL PROVIDER CREDENTIALS - Missing ENV_CLIENT_AUTH_ONESIGNAL_APP_ID"
      )
    }
    if (!config.ENV_CLIENT_AUTH_ONESIGNAL_REST_API_KEY) {
      console.error(
        "EMAIL PROVIDER CREDENTIALS - Missing ENV_CLIENT_AUTH_ONESIGNAL_REST_API_KEY"
      )
    }
  }

  switch (email_provider) {
    case EmailProviders.Gmail:
      console.log("EMAIL PROVIDER CREDENTIALS - Returning Gmail credentials")
      return {
        gmail: {
          user: config.ENV_CLIENT_AUTH_GMAIL_SENDER,
          pass: config.ENV_CLIENT_AUTH_GMAIL_SENDER_PASSWORD,
        },
      }
    case EmailProviders.OneSignal:
      console.log(
        "EMAIL PROVIDER CREDENTIALS - Returning OneSignal credentials"
      )
      return {
        onesignal: {
          app_id: config.ENV_CLIENT_AUTH_ONESIGNAL_APP_ID,
          rest_api_key: config.ENV_CLIENT_AUTH_ONESIGNAL_REST_API_KEY,
        },
      }
    default:
      console.log(
        "EMAIL PROVIDER CREDENTIALS - Unknown provider, defaulting to Gmail"
      )
      return {
        gmail: {
          user: config.ENV_CLIENT_AUTH_GMAIL_SENDER,
          pass: config.ENV_CLIENT_AUTH_GMAIL_SENDER_PASSWORD,
        },
      } // Fallback to Gmail
  }
}

export default fnEmailProviderCredentialsGet

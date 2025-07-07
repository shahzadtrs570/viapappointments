import https from "https"

import { createTransport } from "nodemailer"

import type { IncomingMessage } from "http"
import type { RequestOptions } from "https"
import type { SentMessageInfo, Transporter } from "nodemailer"

import fnEmailProviderCredentialsGet from "./_customEmailProviders"
import { EmailProviders } from "./sendEmail"

interface MailOptions {
  from: string
  to: string
  subject: string
  text?: string
  html?: string
  attachments?: Array<{ filename: string; path: string }>
  include_email_tokens?: Record<string, string>
  channel_for_external_user_ids?: string[]
  include_unsubscribed?: boolean
  email_subject?: string
  email_body?: string
}

interface IEmailProviderCredentials {
  gmail?: { user: string; pass: string }
  sendgrid?: { apiKey: string }
  mailgun?: { apiKey: string }
  onesignal?: { app_id: string; rest_api_key: string }
}

interface IEmailTransportCreateResponse {
  status: number
  sendEmail?: (data: MailOptions) => Promise<SentMessageInfo | void> // Allow for either return type
}

const fnEmailTransportorCreate = (
  email_provider: string
): IEmailTransportCreateResponse => {
  console.log("EMAIL TRANSPORTER - Creating for provider:", email_provider)

  try {
    const emailProviders: IEmailProviderCredentials =
      fnEmailProviderCredentialsGet(email_provider)

    if (email_provider === EmailProviders.Gmail && !emailProviders.gmail) {
      console.error("EMAIL TRANSPORTER - Gmail credentials missing")
      throw new Error("Gmail credentials not found")
    } else if (
      email_provider === EmailProviders.OneSignal &&
      !emailProviders.onesignal
    ) {
      console.error("EMAIL TRANSPORTER - OneSignal credentials missing")
      throw new Error("OneSignal credentials not found")
    }

    switch (email_provider) {
      case EmailProviders.Gmail: {
        console.log("EMAIL TRANSPORTER - Setting up Gmail transport")
        console.log(
          "EMAIL TRANSPORTER - Gmail user:",
          emailProviders.gmail?.user
        )

        if (!emailProviders.gmail?.user || !emailProviders.gmail.pass) {
          console.error("EMAIL TRANSPORTER - Invalid Gmail credentials:", {
            user: !!emailProviders.gmail?.user,
            pass: !!emailProviders.gmail?.pass,
          })
          throw new Error("Invalid Gmail credentials")
        }

        return {
          status: 200,
          sendEmail: async (mailOptions: MailOptions) => {
            try {
              console.log(
                "EMAIL TRANSPORTER - Creating Gmail transport with credentials"
              )
              const transporter: Transporter = createTransport({
                service: "Gmail",
                auth: emailProviders.gmail,
              })

              console.log(
                "EMAIL TRANSPORTER - Gmail transport created successfully"
              )
              console.log(
                "EMAIL TRANSPORTER - Sending email to:",
                mailOptions.to
              )
              const result = await transporter.sendMail(mailOptions)
              console.log(
                "EMAIL TRANSPORTER - Gmail email sent successfully. MessageId:",
                result.messageId
              )
              return result
            } catch (error) {
              console.error("EMAIL TRANSPORTER - Gmail sending error:", error)
              throw error
            }
          },
        }
      }

      case EmailProviders.OneSignal: {
        console.log("EMAIL TRANSPORTER - Setting up OneSignal transport")

        const sendEmailNotificationOneSignal = async (
          mailOptions: MailOptions
        ): Promise<void> => {
          try {
            console.log("EMAIL TRANSPORTER - Building OneSignal payload")

            // Construct the payload
            const data = {
              app_id: emailProviders.onesignal!.app_id,
              rest_api_key: emailProviders.onesignal!.rest_api_key,
              ...mailOptions,
            }

            const headers = {
              "Content-Type": "application/json; charset=utf-8",
              Authorization: `Basic ${data.rest_api_key}`,
            }

            const options: RequestOptions = {
              host: "onesignal.com",
              port: 443,
              path: "/api/v1/notifications",
              method: "POST",
              headers,
            }

            console.log("EMAIL TRANSPORTER - Sending OneSignal request")

            return new Promise((resolve, reject) => {
              const req = https.request(options, (res: IncomingMessage) => {
                let responseData = ""

                res.on("data", (chunk: string) => {
                  responseData += chunk
                })

                res.on("end", () => {
                  try {
                    const parsed = JSON.parse(responseData)
                    console.log(
                      "EMAIL TRANSPORTER - OneSignal response:",
                      parsed
                    )
                    resolve()
                  } catch (parseError) {
                    console.error(
                      "EMAIL TRANSPORTER - OneSignal response parse error:",
                      parseError
                    )
                    console.error(
                      "EMAIL TRANSPORTER - Raw response:",
                      responseData
                    )
                    reject(parseError)
                  }
                })
              })

              req.on("error", (e: Error) => {
                console.error("EMAIL TRANSPORTER - OneSignal request error:", e)
                reject(e)
              })

              // Log request data
              console.log(
                "EMAIL TRANSPORTER - OneSignal request data:",
                JSON.stringify(data, null, 2)
              )

              req.write(JSON.stringify(data))
              req.end()
            })
          } catch (error) {
            console.error(
              "EMAIL TRANSPORTER - OneSignal critical error:",
              error
            )
            throw error
          }
        }

        return { status: 200, sendEmail: sendEmailNotificationOneSignal }
      }

      default:
        console.error("EMAIL TRANSPORTER - Invalid provider:", email_provider)
        throw new Error("Invalid email provider")
    }
  } catch (error) {
    console.error("EMAIL TRANSPORTER - Setup error:", error)
    return { status: 500 }
  }
}

export default fnEmailTransportorCreate

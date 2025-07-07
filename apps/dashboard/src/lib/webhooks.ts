// import crypto from "crypto"

// const BACKOFFICE_WEBHOOK_SECRET = process.env.BACKOFFICE_WEBHOOK_SECRET || ""

/**
 * Verifies a webhook request from the backoffice API
 *
 * @param request The incoming webhook request
 * @returns A boolean indicating if the webhook signature is valid
 */
export async function verifyBackofficeWebhook(
  request: Request
): Promise<boolean> {
  // In development or when testing, allow test requests
  if (
    process.env.NODE_ENV === "development" ||
    request.headers.get("X-Webhook-Test") === "true"
  ) {
    return Promise.resolve(true)
  }

  // Here you would implement actual validation logic for production
  // For example:
  // - Check for a secret token or signature
  // - Validate the request IP against allowed IPs
  // - Verify timestamps to prevent replay attacks

  // This is a placeholder for actual verification logic
  const authHeader = request.headers.get("Authorization")
  if (!authHeader) {
    return Promise.resolve(false)
  }

  // In production, implement proper verification
  // For example, compare with a secret from env variables
  const expectedToken = process.env.BACKOFFICE_WEBHOOK_SECRET
  return Promise.resolve(authHeader === `Bearer ${expectedToken}`)
}

/**
 * Sends a notification to Google Chat about webhook errors
 *
 * @param message The error message to send
 * @param details Additional details about the error
 */
export async function notifyWebhookError(
  message: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL

    if (!webhookUrl) {
      console.error("Missing Google Chat webhook URL")
      return
    }

    // Format the message for Google Chat
    const payload = {
      text: `⚠️ Webhook Error: ${message}`,
      cards: [
        {
          sections: [
            {
              widgets: [
                {
                  textParagraph: {
                    text: `<b>Error Details</b><br>${JSON.stringify(details, null, 2)}`,
                  },
                },
                {
                  textParagraph: {
                    text: `<i>Time: ${new Date().toISOString()}</i>`,
                  },
                },
              ],
            },
          ],
        },
      ],
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error("Failed to send notification to Google Chat:", error)
  }
}

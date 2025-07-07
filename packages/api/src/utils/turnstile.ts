/**
 * Validates a Cloudflare Turnstile token
 * @param token - The token to validate
 * @returns A boolean indicating if the token is valid
 */
export async function validateTurnstileToken(token: string): Promise<boolean> {
  try {
    const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY

    if (!SECRET_KEY) {
      console.error("Turnstile secret key is not configured")
      return false
    }

    const formData = new URLSearchParams()
    formData.append("secret", SECRET_KEY)
    formData.append("response", token)

    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    const data = (await result.json()) as { success: boolean }
    return data.success === true
  } catch (error) {
    console.error("Error validating Turnstile token:", error)
    return false
  }
}

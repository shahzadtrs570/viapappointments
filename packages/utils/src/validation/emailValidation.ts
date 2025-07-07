import config from "../../../../rain.config"

export interface EmailValidationResult {
  isValid: boolean
  reason?: string
}

/**
 * Validates an email address against the configured allow/block lists
 * @param email The email address to validate
 * @returns EmailValidationResult with validation status and optional reason
 */
export function validateEmail(email: string): EmailValidationResult {
  const { emailValidation } = config
  const emailDomain = email.split("@")[1]?.toLowerCase()

  // Check if email is explicitly blocked
  if (emailValidation.disallowedEmails.includes(email.toLowerCase())) {
    return {
      isValid: false,
      reason:
        "This email address is not allowed to register. Please contact support if you believe this is an error.",
    }
  }

  // Check if domain is explicitly blocked
  if (emailDomain && emailValidation.disallowedDomains.includes(emailDomain)) {
    return {
      isValid: false,
      reason:
        "This email domain is not allowed to register. Please contact support if you believe this is an error.",
    }
  }

  // If enforceAllowList is true, check if email or domain is explicitly allowed
  if (emailValidation.enforceAllowList) {
    const isAllowedEmail = emailValidation.allowedEmails.includes(
      email.toLowerCase()
    )
    const isAllowedDomain =
      emailDomain && emailValidation.allowedDomains.includes(emailDomain)

    if (!isAllowedEmail && !isAllowedDomain) {
      return {
        isValid: false,
        reason:
          "This email address is not on allow to use this app. Please contact support if you believe this is an error.",
      }
    }
  }

  return { isValid: true }
}

/**
 * Utility function to extract domain from email
 * @param email The email address
 * @returns The domain part of the email or null if invalid
 */
export function getEmailDomain(email: string): string | null {
  const parts = email.split("@")
  return parts.length === 2 ? parts[1].toLowerCase() : null
}

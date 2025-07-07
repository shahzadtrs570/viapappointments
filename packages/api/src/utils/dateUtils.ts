/**
 * Utility functions for handling date conversion between DateTime and string
 * for field encryption purposes
 */

/**
 * Converts a DateTime object to ISO string format for encryption
 */
export function dateToEncryptedString(date: Date): string {
  return date.toISOString()
}

/**
 * Converts an ISO string back to a DateTime object after decryption
 */
export function encryptedStringToDate(dateString: string): Date {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`)
  }
  return date
}

/**
 * Validates if a string is a valid date string
 */
export function isValidDateString(dateString: string): boolean {
  try {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  } catch {
    return false
  }
}

/**
 * Converts a date string (YYYY-MM-DD or ISO) to encrypted string format
 */
export function inputDateStringToEncryptedString(dateString: string): string {
  // Handle YYYY-MM-DD format or ISO format
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`)
  }
  return date.toISOString()
}

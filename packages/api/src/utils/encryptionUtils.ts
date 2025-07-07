/* eslint-disable */

/**
 * Utility functions for handling data type conversion for field encryption
 * Since prisma-field-encryption only supports String fields, we need to convert
 * all other data types to/from strings for encryption
 */

/**
 * DATE CONVERSION UTILITIES
 */

/**
 * Converts a DateTime object to ISO string format for encryption
 */

import config from "../../../../rain.config"

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
 * Converts a date string (YYYY-MM-DD or ISO) to encrypted string format
 */
export function inputDateStringToEncryptedString(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`)
  }
  return date.toISOString()
}

/**
 * INTEGER CONVERSION UTILITIES
 */

/**
 * Converts an integer to string for encryption
 */
export function intToEncryptedString(value: number): string {
  if (!Number.isInteger(value)) {
    throw new Error(`Value must be an integer: ${value}`)
  }
  return value.toString()
}

/**
 * Converts an encrypted string back to integer
 */
export function encryptedStringToInt(value: string): number {
  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) {
    throw new Error(`Invalid integer string: ${value}`)
  }
  return parsed
}

/**
 * FLOAT CONVERSION UTILITIES
 */

/**
 * Converts a float to string for encryption
 */
export function floatToEncryptedString(value: number): string {
  if (typeof value !== "number" || isNaN(value)) {
    throw new Error(`Value must be a valid number: ${value}`)
  }
  return value.toString()
}

/**
 * Converts an encrypted string back to float
 */
export function encryptedStringToFloat(value: string): number {
  const parsed = parseFloat(value)
  if (isNaN(parsed)) {
    throw new Error(`Invalid float string: ${value}`)
  }
  return parsed
}

/**
 * STRING ARRAY CONVERSION UTILITIES
 */

/**
 * Converts a string array to JSON string for encryption
 */
export function stringArrayToEncryptedString(values: string[]): string {
  return JSON.stringify(values)
}

/**
 * Converts an encrypted JSON string back to string array
 */
export function encryptedStringToStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) {
      throw new Error("Parsed value is not an array")
    }
    return parsed.filter((item) => typeof item === "string")
  } catch (error) {
    throw new Error(`Invalid JSON array string: ${value}`)
  }
}

/**
 * VALIDATION UTILITIES
 */

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
 * Validates if a string is a valid integer
 */
export function isValidIntString(value: string): boolean {
  const parsed = parseInt(value, 10)
  return !isNaN(parsed) && parsed.toString() === value
}

/**
 * Validates if a string is a valid float
 */
export function isValidFloatString(value: string): boolean {
  const parsed = parseFloat(value)
  return !isNaN(parsed)
}

/**
 * INPUT PARSING UTILITIES (for handling form inputs)
 */

/**
 * Safely converts string input to encrypted integer string
 * Handles special cases like "5+" for bedrooms/bathrooms
 */
export function parseInputToEncryptedInt(input: string | number): string {
  // Handle numeric input
  if (typeof input === "number") {
    if (isNaN(input)) {
      throw new Error(`Invalid numeric input: ${input}`)
    }
    return intToEncryptedString(input)
  }

  // Handle string input - remove any non-numeric characters except decimal point
  let cleanInput = input.toString().trim()

  // Handle special cases like "5+" for bedrooms/bathrooms
  if (cleanInput.includes("+")) {
    cleanInput = cleanInput.replace("+", "")
  }

  // Remove any other non-numeric characters except digits
  cleanInput = cleanInput.replace(/[^\d]/g, "")

  if (cleanInput === "") {
    throw new Error(
      `Invalid integer input: ${input} - no numeric characters found`
    )
  }

  const parsed = parseInt(cleanInput, 10)
  if (isNaN(parsed)) {
    throw new Error(
      `Invalid integer input: ${input} - could not parse as number`
    )
  }
  return intToEncryptedString(parsed)
}

/**
 * Safely converts string input to encrypted float string
 * Handles various formats and removes non-numeric characters
 */
export function parseInputToEncryptedFloat(input: string | number): string {
  // Handle numeric input
  if (typeof input === "number") {
    if (isNaN(input)) {
      throw new Error(`Invalid numeric input: ${input}`)
    }
    return floatToEncryptedString(input)
  }

  // Handle string input - remove currency symbols and other non-numeric characters
  let cleanInput = input.toString().trim()

  // Remove common currency symbols and commas
  cleanInput = cleanInput.replace(/[£$€,]/g, "")

  // Remove any characters except digits, decimal point, and minus sign
  cleanInput = cleanInput.replace(/[^\d.-]/g, "")

  if (cleanInput === "" || cleanInput === "." || cleanInput === "-") {
    throw new Error(
      `Invalid float input: ${input} - no valid numeric value found`
    )
  }

  const parsed = parseFloat(cleanInput)
  if (isNaN(parsed)) {
    throw new Error(`Invalid float input: ${input} - could not parse as number`)
  }
  return floatToEncryptedString(parsed)
}

/**
 * JSON OBJECT CONVERSION UTILITIES
 */

/**
 * Converts a JSON object to encrypted string
 */
export function jsonToEncryptedString(obj: any): string {
  return JSON.stringify(obj)
}

/**
 * Converts an encrypted JSON string back to object
 */
export function encryptedStringToJson(value: string): any {
  try {
    return JSON.parse(value)
  } catch (error) {
    throw new Error(`Invalid JSON string: ${value}`)
  }
}

/**
 * HASH UTILITIES FOR SEARCHABLE ENCRYPTED FIELDS
 */

/**
 * Generates a hash for searchable encrypted fields
 * Uses SHA-256 to create a consistent hash for searching
 */
export function generateSearchHash(value: string): string {
  // Use Node.js crypto module for consistent hashing
  const crypto = require("crypto")
  return crypto
    .createHash("sha256")
    .update(value.toLowerCase().trim())
    .digest("hex")
}

/**
 * Generates a sortable hash for DateTime fields
 * Converts date to timestamp for consistent ordering
 */
export function generateDateSortHash(date: Date): string {
  // Convert to timestamp for sortable numeric hash
  const timestamp = date.getTime()
  return timestamp.toString().padStart(15, "0") // Pad to ensure consistent string sorting
}

/**
 * Generates a sortable hash from an encrypted date string
 */
export function generateEncryptedDateSortHash(
  encryptedDateString: string
): string {
  try {
    const date = encryptedStringToDate(encryptedDateString)
    return generateDateSortHash(date)
  } catch (error) {
    // If date parsing fails, return a default value for consistent behavior
    return "000000000000000"
  }
}

/**
 * Utility to generate both encrypted date string and sort hash
 */
export function prepareDateForEncryption(date: Date): {
  encryptedString: string
  sortHash: string
} {
  const encryptedString = dateToEncryptedString(date)
  const sortHash = generateDateSortHash(date)
  return { encryptedString, sortHash }
}

/**
 * HELPER UTILITIES
 */

/**
 * Safely handles nullable encrypted string to number conversion
 */
export function safeEncryptedStringToFloat(
  value: string | null
): number | null {
  if (value === null || value === "") return null
  return encryptedStringToFloat(value)
}

/**
 * Safely handles nullable encrypted string to int conversion
 */
export function safeEncryptedStringToInt(value: string | null): number | null {
  if (value === null || value === "") return null
  return encryptedStringToInt(value)
}

/**
 * COMPANY USER UTILITIES
 */

/**
 * Check if an email belongs to a company user
 * @param email - The email to check
 * @returns boolean - Whether the email is in the company users list
 */
export function isCompanyUserEmail(email: string): boolean {
  if (!email) return false

  try {
    // Import the config

    // Check if the email exists in the company users array
    const companyUsers = config.company?.users || []

    return companyUsers.some(
      (user: { email: string }) =>
        user.email.toLowerCase() === email.toLowerCase()
    )
  } catch (error) {
    console.error("Error checking company user:", error)
    return false
  }
}

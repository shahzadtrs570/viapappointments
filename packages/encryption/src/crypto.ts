/**
 * Provides core cryptographic functions for the encryption package.
 * This includes AES-256-GCM encryption and decryption, data hashing (SHA-256),
 * HMAC signature creation and verification, and secure encryption key generation.
 * It handles the low-level details of converting data to appropriate formats for encryption
 * and ensuring secure cryptographic practices.
 */
import crypto from "crypto"
import { getEncryptionConfig } from "./config"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16 // Initialization vector length for AES-256-GCM

/**
 * Encrypts a string or object with AES-256-GCM
 *
 * @param data - String or object to encrypt
 * @returns Encrypted data as base64 string
 */
export function encrypt<T>(data: T): string {
  const { encryptionKey } = getEncryptionConfig()

  // Convert data to string if it's an object
  const dataString = typeof data === "string" ? data : JSON.stringify(data)

  // Generate random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH)

  // Create cipher using key and iv
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(encryptionKey, "hex"),
    iv
  )

  // Encrypt the data
  let encrypted = cipher.update(dataString, "utf8", "base64")
  encrypted += cipher.final("base64")

  // Get authentication tag
  const authTag = cipher.getAuthTag()

  // Combine IV, encrypted data, and auth tag into a single string
  // Format: base64(iv):base64(authTag):base64(encryptedData)
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`
}

/**
 * Decrypts a string encrypted with encrypt()
 *
 * @param encryptedData - String encrypted with encrypt()
 * @param asObject - Whether to parse the result as JSON object
 * @returns Decrypted data as string or object
 */
export function decrypt<T>(
  encryptedData: string,
  asObject = false
): T | string {
  const { encryptionKey } = getEncryptionConfig()

  // Split the encrypted data into its components
  const [ivBase64, authTagBase64, encryptedBase64] = encryptedData.split(":")

  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error("Invalid encrypted data format")
  }

  // Convert components from base64
  const iv = Buffer.from(ivBase64, "base64")
  const authTag = Buffer.from(authTagBase64, "base64")
  const encrypted = encryptedBase64

  // Create decipher
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(encryptionKey, "hex"),
    iv
  )

  // Set auth tag
  decipher.setAuthTag(authTag)

  // Decrypt the data
  let decrypted = decipher.update(encrypted, "base64", "utf8")
  decrypted += decipher.final("utf8")

  // Parse as object if requested
  if (asObject) {
    try {
      return JSON.parse(decrypted) as T
    } catch (error) {
      throw new Error("Failed to parse decrypted data as JSON")
    }
  }

  return decrypted as unknown as T
}

/**
 * Hash a string using SHA-256
 *
 * @param data - String to hash
 * @returns SHA-256 hash as hex string
 */
export function hash(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex")
}

/**
 * Creates a HMAC signature for data verification
 *
 * @param data - Data to sign
 * @returns HMAC signature as hex string
 */
export function createSignature(data: string): string {
  const { encryptionKey } = getEncryptionConfig()
  return crypto.createHmac("sha256", encryptionKey).update(data).digest("hex")
}

/**
 * Verifies a HMAC signature
 *
 * @param data - Original data
 * @param signature - Signature to verify
 * @returns True if signature is valid
 */
export function verifySignature(data: string, signature: string): boolean {
  const computedSignature = createSignature(data)
  return crypto.timingSafeEqual(
    Buffer.from(computedSignature, "hex"),
    Buffer.from(signature, "hex")
  )
}

/**
 * Generates a random encryption key
 *
 * @returns Random 32-byte key as hex string
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex")
}

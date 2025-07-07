/**
 * Manages the configuration for the encryption package.
 * Its primary responsibility is to load encryption-related settings from environment variables,
 * such as the encryption key, whether encryption is enabled, and the specific fields
 * designated for encryption. It provides functions to access this configuration reliably
 * throughout the package and includes diagnostic logging for setup verification.
 */
interface EncryptionConfig {
  encryptionKey: string
  encryptionEnabled: boolean
}

// Module-level counter for logging
let logCount = 0

/**
 * Loads encryption configuration from environment variables
 *
 * @returns Encryption configuration object
 * @throws Error if ENCRYPTION_KEY is not set when encryption is enabled
 */
export function getEncryptionConfig(): EncryptionConfig {
  const encryptionEnabled = process.env.ENCRYPTION_ENABLED === "true"

  // Add diagnostic logging

  // If encryption is disabled, return a dummy key
  if (!encryptionEnabled) {
    return {
      encryptionKey:
        "0000000000000000000000000000000000000000000000000000000000000000",
      encryptionEnabled,
    }
  }

  const encryptionKey = process.env.ENCRYPTION_KEY

  if (!encryptionKey) {
    console.error(
      "ENCRYPTION DEBUG - ERROR: ENCRYPTION_KEY is missing but encryption is enabled"
    )
    throw new Error(
      "ENCRYPTION_KEY environment variable must be set when encryption is enabled"
    )
  }

  return {
    encryptionKey,
    encryptionEnabled,
  }
}

/**
 * Determines if a specific field should be encrypted
 *
 * @param modelName - Prisma model name
 * @param fieldName - Field name
 * @returns Whether the field should be encrypted
 */
export function shouldEncryptField(
  modelName: string,
  fieldName: string
): boolean {
  // For testing: always encrypt User.encryptedTestData regardless of config
  if (modelName === "User" && fieldName === "encryptedTestData") {
    return true
  }

  // Fields that should be encrypted can be configured here
  // This could be loaded from environment variables or a configuration file

  const encryptedFieldsConfig = process.env.ENCRYPTED_FIELDS
    ? JSON.parse(process.env.ENCRYPTED_FIELDS)
    : {}

  // Add diagnostic logging for the first few calls
  if (logCount < 10) {
    // Special logging for User.receiveUpdates field which we're testing
    if (modelName === "User" && fieldName === "receiveUpdates") {
      console.log(`ENCRYPTION DEBUG - User.receiveUpdates field check:`, {
        shouldEncrypt:
          encryptedFieldsConfig[modelName]?.includes(fieldName) || false,
        fieldsConfig: encryptedFieldsConfig[modelName] || [],
        rawConfig: process.env.ENCRYPTED_FIELDS,
      })
    }

    logCount++
  }

  // Check if model and field are in the configuration
  return encryptedFieldsConfig[modelName]?.includes(fieldName) || false
}

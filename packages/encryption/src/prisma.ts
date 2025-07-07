/**
 * Integrates field-level encryption directly into Prisma Client operations.
 * It defines Prisma middleware that automatically encrypts specified fields before data is written
 * to the database and decrypts them when data is read. This file contains the logic for
 * determining which fields to encrypt/decrypt based on configuration (environment variables)
 * and orchestrates the use of the core crypto functions for these operations. It also provides
 * a helper function to create an encrypted Prisma Client instance.
 */
import { PrismaClient, Prisma } from "@prisma/client"
import { encrypt, decrypt } from "./crypto"
import { getEncryptionConfig } from "./config"

let logCount = 0 // Declare logCount

type ModelData = Record<string, any>

/**
 * Processes data recursively, encrypting fields that should be encrypted
 */
function encryptFields(
  data: ModelData,
  modelName: string | undefined
): ModelData {
  const { encryptionEnabled } = getEncryptionConfig()
  if (!encryptionEnabled || !modelName) return data

  const result = { ...data }

  for (const [key, value] of Object.entries(data)) {
    // Skip null or undefined values
    if (value === null || value === undefined) continue

    // If the field should be encrypted, let encrypt() handle type conversion
    if (shouldEncryptField(modelName, key)) {
      result[key] = encrypt(value)
    }
    // If the value is an object, recurse (but not for arrays or Dates)
    else if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[key] = encryptFields(value, modelName)
    }
  }

  return result
}

/**
 * Processes data recursively, decrypting fields that are encrypted
 */
function decryptFields(
  data: ModelData,
  modelName: string | undefined
): ModelData {
  const { encryptionEnabled } = getEncryptionConfig()
  if (!encryptionEnabled || !modelName) return data

  const result = { ...data }

  for (const [key, value] of Object.entries(data)) {
    // Skip null or undefined values
    if (value === null || value === undefined) continue

    // If the field should be encrypted and is a string (assuming encrypted data is stored as string)
    if (shouldEncryptField(modelName, key) && typeof value === "string") {
      try {
        // Try to determine if the value should be parsed as an object
        const decrypted = decrypt(value, false)

        // If the decrypted value looks like JSON, parse it
        if (
          typeof decrypted === "string" &&
          ((decrypted.startsWith("{") && decrypted.endsWith("}")) ||
            (decrypted.startsWith("[") && decrypted.endsWith("]")))
        ) {
          try {
            result[key] = JSON.parse(decrypted as string)
          } catch {
            result[key] = decrypted
          }
        } else {
          result[key] = decrypted
        }
      } catch (error) {
        // If decryption fails, keep the original value
        console.error(
          `Failed to decrypt field ${key} on model ${modelName}:`,
          error
        )
        result[key] = value
      }
    }
    // If the value is an object, recurse (but not for arrays or Dates)
    else if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[key] = decryptFields(value, modelName)
    }
  }

  return result
}

/**
 * Adds encryption middleware to a Prisma client instance
 *
 * @param prisma - PrismaClient instance
 * @returns PrismaClient with encryption middleware
 */
export function addEncryptionMiddleware(prisma: PrismaClient): PrismaClient {
  const { encryptionEnabled } = getEncryptionConfig()

  if (!encryptionEnabled) {
    console.log("🔒 Encryption is DISABLED, not adding middleware")
    return prisma
  }

  console.log("🔐 Adding encryption middleware to Prisma client")

  // Middleware for encrypting data before writing to database
  prisma.$use(
    async (
      params: Prisma.MiddlewareParams,
      next: (params: Prisma.MiddlewareParams) => Promise<any>
    ) => {
      // Only encrypt on create or update operations
      if (
        params.action === "create" ||
        params.action === "update" ||
        params.action === "upsert"
      ) {
        const modelName = params.model

        // Log what we're encrypting
        console.log(
          `🔒 Prisma Write Operation: ${params.action} on ${modelName}`
        )

        if (params.action === "create" || params.action === "update") {
          if (params.args.data) {
            // Log before encryption
            if (modelName === "User" && params.args.data.preferredLanguage) {
              console.log("Before encryption:", {
                preferredLanguage: params.args.data.preferredLanguage,
              })
            }

            params.args.data = encryptFields(params.args.data, modelName)

            // Log after encryption
            if (modelName === "User" && params.args.data.preferredLanguage) {
              console.log("After encryption:", {
                preferredLanguage: params.args.data.preferredLanguage,
              })
            }
          }
        } else if (params.action === "upsert") {
          if (params.args.create) {
            params.args.create = encryptFields(params.args.create, modelName)
          }
          if (params.args.update) {
            params.args.update = encryptFields(params.args.update, modelName)
          }
        }
      }

      return next(params)
    }
  )

  // Middleware for decrypting data after reading from database
  prisma.$use(
    async (
      params: Prisma.MiddlewareParams,
      next: (params: Prisma.MiddlewareParams) => Promise<any>
    ) => {
      const result = await next(params)

      // Only decrypt on find operations that return data
      if (params.action.startsWith("find") && result) {
        const modelName = params.model

        // Log what we're decrypting
        console.log(
          `🔓 Prisma Read Operation: ${params.action} on ${modelName}`
        )

        // Handle array results (findMany)
        if (Array.isArray(result)) {
          // Check for User data before decryption
          if (modelName === "User") {
            const userWithLanguage = result.find((u) => u.preferredLanguage)
            if (userWithLanguage) {
              console.log("Before decryption (array):", {
                preferredLanguage: userWithLanguage.preferredLanguage,
              })
            }
          }

          const decrypted = result.map((item) => decryptFields(item, modelName))

          // Check after decryption
          if (modelName === "User") {
            const userWithLanguage = decrypted.find((u) => u.preferredLanguage)
            if (userWithLanguage) {
              console.log("After decryption (array):", {
                preferredLanguage: userWithLanguage.preferredLanguage,
              })
            }
          }

          return decrypted
        }
        // Handle single object results (findUnique, findFirst)
        else if (result && typeof result === "object") {
          // Check User data before decryption
          if (modelName === "User" && result.preferredLanguage) {
            console.log("Before decryption (single):", {
              preferredLanguage: result.preferredLanguage,
            })
          }

          const decrypted = decryptFields(result, modelName)

          // Check after decryption
          if (modelName === "User" && decrypted.preferredLanguage) {
            console.log("After decryption (single):", {
              preferredLanguage: decrypted.preferredLanguage,
            })
          }

          return decrypted
        }
      }

      return result
    }
  )

  return prisma
}

/**
 * Creates a new PrismaClient instance with encryption middleware
 *
 * @returns PrismaClient with encryption middleware
 */
export function createEncryptedPrismaClient(): PrismaClient {
  const prisma = new PrismaClient()
  return addEncryptionMiddleware(prisma)
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
  // Fields that should be encrypted are loaded from the ENCRYPTED_FIELDS environment variable
  const encryptedFieldsConfig = process.env.ENCRYPTED_FIELDS
    ? JSON.parse(process.env.ENCRYPTED_FIELDS)
    : {}

  // Add diagnostic logging for the first few calls
  if (logCount < 10) {
    console.log(
      `ENCRYPTION DEBUG - Checking field: ${modelName}.${fieldName}`,
      {
        shouldEncrypt:
          encryptedFieldsConfig[modelName]?.includes(fieldName) || false,
        availableModels: Object.keys(encryptedFieldsConfig),
        fieldsForModel: encryptedFieldsConfig[modelName] || [],
      }
    )

    logCount++
  }

  // Check if model and field are in the configuration
  return encryptedFieldsConfig[modelName]?.includes(fieldName) || false
}

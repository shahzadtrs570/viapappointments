/// <reference lib="dom" />
import { PrismaClient } from "@prisma/client"

declare global {
  var cachedPrisma: PrismaClient
  var window: Window & typeof globalThis
}

let prisma: PrismaClient

// Only import field encryption on server side
const getFieldEncryptionExtension = async () => {
  if (typeof window === "undefined") {
    // Server side
    const { fieldEncryptionExtension } = await import("prisma-field-encryption")
    return fieldEncryptionExtension()
  }
  // Client side - return identity function
  return (client: any) => client
}

if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
  if (typeof window === "undefined") {
    // Server side
    const { fieldEncryptionExtension } = require("prisma-field-encryption")
    prisma = new PrismaClient().$extends(
      fieldEncryptionExtension()
    ) as PrismaClient
  } else {
    // Client side
    prisma = new PrismaClient()
  }
} else {
  if (!global.cachedPrisma) {
    if (typeof window === "undefined") {
      // Server side
      const { fieldEncryptionExtension } = require("prisma-field-encryption")
      global.cachedPrisma = new PrismaClient().$extends(
        fieldEncryptionExtension()
      ) as PrismaClient
    } else {
      // Client side
      global.cachedPrisma = new PrismaClient()
    }
  }
  prisma = global.cachedPrisma
}

export const db = prisma

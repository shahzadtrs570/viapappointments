/**
 * Provides a higher-order function `withEncryption` to easily apply
 * encryption middleware to any Prisma Client instance.
 * This simplifies the setup process for enabling automatic field-level encryption
 * in applications using Prisma, abstracting away the direct middleware application.
 */
/**
 * This file provides a drop-in solution for database encryption.
 * Usage: import { withEncryption } from '@srenova/encryption/encrypted-db';
 */

import { addEncryptionMiddleware } from "./prisma"

/**
 * Enhances any Prisma client with encryption middleware.
 * Use this when you need encrypted fields.
 *
 * @param dbClient - Your original Prisma client
 * @returns The same client with encryption middleware added
 */
export function withEncryption<T>(dbClient: T): T {
  return addEncryptionMiddleware(dbClient as any) as unknown as T
}

/**
 * Example usage of the encrypted database in your application:
 *
 * // First import your regular db client
 * import { db } from '@package/db'; // or '../../db/db';
 * import { withEncryption } from '@srenova/encryption/encrypted-db';
 *
 * // Create an encrypted version of your client
 * const encryptedDb = withEncryption(db);
 *
 * // Then use encryptedDb as normal - encryption/decryption happens automatically
 * const user = await encryptedDb.user.findUnique({ where: { id: userId } });
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLogger } from "@package/logger"

interface ErrorLogContext {
  className?: string
  methodName?: string
  fileName?: string
  userId?: string
  [key: string]: any
}

/**
 * Logs an error with context information
 * @param error The error to log
 * @param context Optional context information
 */
export function logError(error: unknown, context?: ErrorLogContext): void {
  const logger = getLogger()

  void logger.error(error instanceof Error ? error.message : String(error), {
    app: process.env.NEXT_PUBLIC_APP_NAME,
    env: process.env.NEXT_PUBLIC_APP_ENV,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    currentClass: context?.className || "UnknownClass",
    currentMethod: context?.methodName || "unknownMethod",
    currentFile: context?.fileName || "unknown.ts",
    ...context,
  })
}

/**
 * Logs an informational message with context
 * @param message The message to log
 * @param context Optional context information
 */
export function logInfo(message: string, context?: ErrorLogContext): void {
  const logger = getLogger()

  void logger.info(message, {
    app: process.env.NEXT_PUBLIC_APP_NAME,
    env: process.env.NEXT_PUBLIC_APP_ENV,
    currentClass: context?.className || "UnknownClass",
    currentMethod: context?.methodName || "unknownMethod",
    currentFile: context?.fileName || "unknown.ts",
    ...context,
  })
}

/**
 * Logs a warning message with context
 * @param message The warning message to log
 * @param context Optional context information
 */
export function logWarning(message: string, context?: ErrorLogContext): void {
  const logger = getLogger()

  void logger.warn(message, {
    app: process.env.NEXT_PUBLIC_APP_NAME,
    env: process.env.NEXT_PUBLIC_APP_ENV,
    currentClass: context?.className || "UnknownClass",
    currentMethod: context?.methodName || "unknownMethod",
    currentFile: context?.fileName || "unknown.ts",
    ...context,
  })
}

/**
 * Logs a critical error with context
 * @param error The critical error to log
 * @param context Optional context information
 */
export function logCritical(error: unknown, context?: ErrorLogContext): void {
  const logger = getLogger()

  void logger.critical(error instanceof Error ? error.message : String(error), {
    app: process.env.NEXT_PUBLIC_APP_NAME,
    env: process.env.NEXT_PUBLIC_APP_ENV,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    currentClass: context?.className || "UnknownClass",
    currentMethod: context?.methodName || "unknownMethod",
    currentFile: context?.fileName || "unknown.ts",
    ...context,
  })
}

/**
 * Creates a contextual logger with pre-filled context information
 * @param baseContext The base context to include in all log messages
 * @returns An object with logging methods
 */
export function createContextualLogger(baseContext: Partial<ErrorLogContext>) {
  return {
    info: (message: string, additionalContext?: Record<string, any>) => {
      logInfo(message, { ...baseContext, ...additionalContext })
    },

    warn: (message: string, additionalContext?: Record<string, any>) => {
      logWarning(message, { ...baseContext, ...additionalContext })
    },

    error: (error: unknown, additionalContext?: Record<string, any>) => {
      logError(error, { ...baseContext, ...additionalContext })
    },

    critical: (error: unknown, additionalContext?: Record<string, any>) => {
      logCritical(error, { ...baseContext, ...additionalContext })
    },
  }
}

// // Basic usage with minimal context
// logError(new Error("Something went wrong"));

// // With full context
// logError(new Error("Database connection failed"), {
//   className: "DatabaseService",
//   methodName: "connect",
//   fileName: "database.service.ts",
//   connectionString: "postgres://..."
// });

// // Using the contextual logger
// const logger = createContextualLogger({
//   className: "AuthService",
//   fileName: "auth.service.ts"
// });

// // Now you can log with pre-filled context
// logger.info("User authenticated", {
//   methodName: "authenticate",
//   userId: "user-123"
// });

// logger.error(new Error("Authentication failed"), {
//   methodName: "authenticate",
//   username: "john.doe"
// });

import { ErrorMetadata, LoggerConfig, LogMessage } from "./types"

declare const window: any | undefined

const isClient = () => {
  try {
    return typeof window !== "undefined"
  } catch {
    return false
  }
}

// Keep track of if we've warned about missing environment variables
const hasLoggedMissingEnvVar = { value: false }

export class Logger {
  private config: LoggerConfig
  private static lastSentTime: number = 0
  private static messageQueue: LogMessage[] = []
  private static isProcessingQueue: boolean = false

  constructor(config: LoggerConfig) {
    this.config = {
      ...config,
      enableConsoleLog: config.enableConsoleLog ?? true,
    }
  }

  private async sendToGoogleChat(logMessage: LogMessage): Promise<void> {
    // If notifications are disabled, return early
    // if the process.env.DISABLE_NOTIFICATION_LOGGER is not set then output a console.log message telling the user it is not set and return early
    if (!process.env.DISABLE_NOTIFICATION_LOGGER) {
      // Only log the warning once to avoid console spam
      if (!hasLoggedMissingEnvVar.value) {
        console.log(
          "DISABLE_NOTIFICATION_LOGGER is not set in environment - logging is disabled"
        )
        hasLoggedMissingEnvVar.value = true
      }
      return
    }
    // if the process.env.DISABLE_NOTIFICATION_LOGGER is set to true then return early
    // if the process.env.DISABLE_NOTIFICATION_LOGGER is set to false then continue with the rest of the function
    if (
      process.env.NEXT_PUBLIC_APP_ENV === "development" &&
      process.env.DISABLE_NOTIFICATION_LOGGER === "true"
    ) {
      // In development, just log to console if explicitly set to true
      console.log(
        `[${logMessage.severity}] ${logMessage.message}`,
        logMessage.metadata
      )
      return
    }

    // Always log to console as a backup
    console.log(
      `[${logMessage.severity}] ${logMessage.message}`,
      logMessage.metadata
    )

    // Add to queue and process
    Logger.messageQueue.push(logMessage)
    this.processQueue()
  }

  private async processQueue(): Promise<void> {
    // If already processing, return
    if (Logger.isProcessingQueue) return

    Logger.isProcessingQueue = true

    try {
      while (Logger.messageQueue.length > 0) {
        // Check rate limit
        const now = Date.now()
        if (Logger.lastSentTime && now - Logger.lastSentTime < 2000) {
          // Wait before trying again
          console.log("Rate limiting Google Chat message, waiting 2 seconds")
          await new Promise((resolve) => setTimeout(resolve, 2000))
          continue
        }

        // Get next message
        const logMessage = Logger.messageQueue[0]

        try {
          const {
            severity,
            message,
            metadata,
            timestamp = new Date().toISOString(),
          } = logMessage

          // Add source to metadata
          const enhancedMetadata = {
            ...metadata,
            source: this.config.source || (isClient() ? "client" : "server"),
          }

          // Create a formatted message for Google Chat
          const formattedMessage = {
            text: `*${severity} - ${this.config.service} (${this.config.environment}) [${enhancedMetadata.source}]*\n${timestamp}\n\n${message}${
              enhancedMetadata
                ? `\n\n*Metadata:*\n\`\`\`\n${JSON.stringify(enhancedMetadata, null, 2)}\n\`\`\``
                : ""
            }`,
          }

          const response = await fetch(this.config.webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedMessage),
          })

          Logger.lastSentTime = Date.now()
          const responseText = await response.text()

          if (!response.ok) {
            this.error(
              `Failed to send message to Google Chat: ${response.status} ${responseText}`,
              {
                app: process.env.NEXT_PUBLIC_APP_NAME,
                env: process.env.NEXT_PUBLIC_APP_ENV,
                error: `Failed to send message to Google Chat: ${response.status} ${responseText}`,
                currentMethod: "sendToGoogleChat/processQueue",
                currentFile: "logger.ts",
              }
            )

            // If it's a rate limit error, wait longer
            if (response.status === 429) {
              console.log("Rate limit hit, waiting 30 seconds")
              await new Promise((resolve) => setTimeout(resolve, 30000))
              continue // Try again with the same message
            }
          }

          // Message sent successfully or failed with non-rate-limit error, remove from queue
          Logger.messageQueue.shift()
        } catch (error) {
          this.error(error instanceof Error ? error.message : "Unknown error", {
            app: process.env.NEXT_PUBLIC_APP_NAME,
            env: process.env.NEXT_PUBLIC_APP_ENV,
            error: error instanceof Error ? error.message : String(error),
            currentMethod: "sendToGoogleChat/processQueue",
            currentFile: "logger.ts",
          })
          console.log("===============================================")
          console.log("===============================================")
          console.error("Error sending message to Google Chat:", error)
          console.log("===============================================")
          console.log("===============================================")
          // Remove failed message from queue to avoid infinite loop
          // Logger.messageQueue.shift()
        }
      }
    } finally {
      Logger.isProcessingQueue = false
    }
  }

  // private consoleLog(
  //   severity: LogMessage["severity"],
  //   message: string,
  //   metadata?: ErrorMetadata
  // ): void {
  //   if (!this.config.enableConsoleLog) return

  //   // const logFn =
  //   //   severity === "ERROR" || severity === "CRITICAL"
  //   //     ? console.error
  //   //     : console.log
  //   // logFn(`[${severity}] ${message}`, metadata ? '\nMetadata:', metadata : '');
  // }

  async info(message: string, metadata?: ErrorMetadata): Promise<void> {
    // this.consoleLog("INFO", message, metadata)
    await this.sendToGoogleChat({ severity: "INFO", message, metadata })
  }

  async warn(message: string, metadata?: ErrorMetadata): Promise<void> {
    // this.consoleLog("WARNING", message, metadata)
    await this.sendToGoogleChat({ severity: "WARNING", message, metadata })
  }

  async error(message: string, metadata?: ErrorMetadata): Promise<void> {
    // this.consoleLog("ERROR", message, metadata)
    await this.sendToGoogleChat({ severity: "ERROR", message, metadata })
  }

  async critical(message: string, metadata?: ErrorMetadata): Promise<void> {
    // this.consoleLog("CRITICAL", message, metadata)
    await this.sendToGoogleChat({ severity: "CRITICAL", message, metadata })
  }

  async logError(error: Error, metadata?: ErrorMetadata): Promise<void> {
    const enhancedMetadata = {
      ...metadata,
      stackTrace: error.stack,
    }

    await this.error(error.message, enhancedMetadata)
  }
}

// Create a singleton instance for common use
let globalLogger: Logger | undefined

export function initializeLogger(config: LoggerConfig): Logger {
  globalLogger = new Logger(config)
  return globalLogger
}

export function getLogger(): Logger {
  const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL || ""
  if (!webhookUrl) {
    return new Logger({
      webhookUrl: "",
      environment: process.env.NEXT_PUBLIC_APP_ENV || "development",
      service: process.env.NEXT_PUBLIC_APP_NAME || "",
      enableConsoleLog: true,
      source: isClient() ? "client" : "server",
    })
  }
  if (!globalLogger) {
    // Auto-initialize with default config
    globalLogger = new Logger({
      webhookUrl: process.env.GOOGLE_CHAT_WEBHOOK_URL || "",
      environment: process.env.NEXT_PUBLIC_APP_ENV || "development",
      service: process.env.NEXT_PUBLIC_APP_NAME || "",
      enableConsoleLog: true,
      source: isClient() ? "client" : "server",
    })
  }
  return globalLogger
}

/* eslint-disable */
/* tslint:disable */
import { Prisma, PrismaClient, QueueStatus } from "../../db"
import { getLogger } from "../../logger/src/lib/logger"
import { processQueueTask } from "./workers/project" // Direct import

// Add a connection management helper
const withConnection = async <T>(
  db: PrismaClient,
  operation: () => Promise<T>
): Promise<T> => {
  let connected = false
  const logger = getLogger()
  try {
    // Ensure we have a connection
    await db.$connect()
    connected = true

    // Execute the operation
    return await operation()
  } catch (error) {
    await logger.error("Database operation error", {
      app: process.env.NEXT_PUBLIC_APP_NAME,
      env: process.env.NEXT_PUBLIC_APP_ENV,
      error: error instanceof Error ? error.message : String(error),
      currentMethod: "withConnection",
      currentFile: "QueueService.ts",
    })
    throw error
  } finally {
    // Only disconnect if we successfully connected
    if (connected) {
      try {
        await db.$disconnect()
      } catch (disconnectError) {
        await logger.error("Error disconnecting from database", {
          app: process.env.NEXT_PUBLIC_APP_NAME,
          env: process.env.NEXT_PUBLIC_APP_ENV,
          error:
            disconnectError instanceof Error
              ? disconnectError.message
              : String(disconnectError),
          currentMethod: "withConnection",
          currentFile: "QueueService.ts",
        })
      }
    }
  }
}

export interface QueueTask<TData = { [key: string]: any }, TResult = unknown> {
  id: string
  type: string
  data: TData
  result?: TResult
  status: QueueStatus
  attempts: number
  maxAttempts: number
  failedProviders: string[]
  errorMessage?: string | null
  errorPatterns?: Record<string, unknown> | null
  priority?: number
  scheduledFor?: Date | null
  processedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  referenceId?: string | null
  referenceType?: string | null
}

export class QueueService {
  private db: PrismaClient
  private logger = getLogger()

  constructor(db: PrismaClient) {
    this.db = db
  }

  // Add to queue
  async addToQueue<TData>(
    type: string,
    data: TData,
    options?: {
      priority?: number
      scheduledFor?: Date
      maxAttempts?: number
      reference?: {
        id: string
        type: string
      }
    }
  ): Promise<QueueTask<TData>> {
    // Default maxAttempts to 3 if not provided
    const maxAttempts = options?.maxAttempts || 3

    return withConnection(this.db, async () => {
      return this.db.queueTask.create({
        data: {
          type,
          data: data as Prisma.JsonObject,
          status: "PENDING",
          attempts: 0,
          maxAttempts: maxAttempts,
          failedProviders: [],
          priority: options?.priority || 0,
          scheduledFor: options?.scheduledFor,
          referenceId: options?.reference?.id,
          referenceModel: options?.reference?.type,
        },
      }) as unknown as QueueTask<TData>
    })
  }

  // Read from queue
  async readFromQueue<TData, TResult>(
    taskId: string
  ): Promise<QueueTask<TData, TResult> | null> {
    return withConnection(this.db, async () => {
      const task = await this.db.queueTask.findUnique({
        where: { id: taskId },
      })
      return task as unknown as QueueTask<TData, TResult> | null
    })
  }

  // Check if there are any tasks currently processing
  async hasProcessingTasks(type?: string): Promise<boolean> {
    return withConnection(this.db, async () => {
      const whereClause: any = {
        status: "PROCESSING",
      }

      // If type is provided, filter by task type
      if (type) {
        whereClause.type = type
      }

      const count = await this.db.queueTask.count({
        where: whereClause,
      })

      return count > 0
    })
  }

  // Process job with recursive retries
  async processJob<TData, TResult>(
    taskId: string,
    currentAttempt = 0,
    options?: {
      skipIfProcessing?: boolean
    }
  ): Promise<QueueTask<TData, TResult> | null> {
    return withConnection(this.db, async () => {
      try {
        const task = await this.db.queueTask.findUnique({
          where: { id: taskId },
        })
        if (!task) {
          await this.logger.error(
            "Task not found in the queue while processing a task",
            {
              app: process.env.NEXT_PUBLIC_APP_NAME,
              env: process.env.NEXT_PUBLIC_APP_ENV,
              error: `Task not found in the queue while processing a task ${taskId}`,
              currentClass: "QueueService",
              currentMethod: "withConnection",
              currentFile: "QueueService.ts",
            }
          )
          throw new Error("Task not found")
        }

        // Use the task's attempts count if this is the first call
        const attemptNumber =
          currentAttempt > 0 ? currentAttempt : task.attempts + 1
        const maxAttempts = task.maxAttempts

        try {
          // Update to processing
          await this.db.queueTask.update({
            where: { id: taskId },
            data: {
              status: "PROCESSING",
              attempts: attemptNumber, // Set attempts directly to the current attempt number
            },
          })

          const result = await processQueueTask(task as QueueTask)

          if (result.success === true) {
            // Success! Update the task as completed
            return this.db.queueTask.update({
              where: { id: taskId },
              data: {
                status: "COMPLETED",
                result: result as unknown as Prisma.InputJsonValue,
                processedAt: new Date(),
                attempts: attemptNumber, // Set the final attempt count
              },
            }) as unknown as QueueTask<TData, TResult>
          } else {
            // Success! Update the task as completed
            return this.db.queueTask.update({
              where: { id: taskId },
              data: {
                status: "FAILED",
                result: result as unknown as Prisma.InputJsonValue,
                processedAt: new Date(),
                attempts: attemptNumber, // Set the final attempt count
              },
            }) as unknown as QueueTask<TData, TResult>
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error"

          // Increment the attempt counter in the database
          await this.db.queueTask.update({
            where: { id: taskId },
            data: {
              attempts: attemptNumber,
              errorMessage,
            },
          })

          // Check if max attempts reached
          if (attemptNumber >= maxAttempts) {
            return this.db.queueTask.update({
              where: { id: taskId },
              data: {
                status: "MAX_RETRIES_REACHED",
              },
            }) as unknown as QueueTask<TData, TResult>
          }

          // Update status to FAILED before retrying
          await this.db.queueTask.update({
            where: { id: taskId },
            data: {
              status: "FAILED",
            },
          })

          // Implements exponential backoff between retries (starting at 1 second, doubling each time, up to 30 seconds)
          // Wait a moment before retrying (exponential backoff)
          const delayMs = Math.min(1000 * Math.pow(2, attemptNumber), 30000)
          await new Promise((resolve) => setTimeout(resolve, delayMs))

          // Recursive call with incremented attempt number
          // Note: We need to disconnect before the recursive call to avoid connection leaks
          await this.db.$disconnect()
          return this.processJob(taskId, attemptNumber + 1)
        }
      } catch (dbError) {
        // Handle database connection errors
        // USE LOGGER TO NOTIFY IF NEEDED

        // Try to update the task status
        try {
          await this.db.queueTask.update({
            where: { id: taskId },
            data: {
              status: "FAILED",
              errorMessage:
                dbError instanceof Error ? dbError.message : String(dbError),
            },
          })
        } catch (updateError) {
          // USE LOGGER TO NOTIFY IF NEEDED
        }

        throw dbError
      }
    })
  }

  // Update in queue
  async updateInQueue<TData, TResult>(
    taskId: string,
    data: Partial<
      Omit<QueueTask<TData, TResult>, "id" | "createdAt" | "updatedAt">
    >
  ): Promise<QueueTask<TData, TResult>> {
    return withConnection(this.db, async () => {
      const updateData: any = {
        ...data,
        errorPatterns: data.errorPatterns
          ? { set: data.errorPatterns as Prisma.JsonObject }
          : undefined,
      }

      return this.db.queueTask.update({
        where: { id: taskId },
        data: updateData,
      }) as unknown as QueueTask<TData, TResult>
    })
  }

  // Delete from queue
  async deleteFromQueue(taskId: string): Promise<void> {
    return withConnection(this.db, async () => {
      await this.db.queueTask.delete({
        where: { id: taskId },
      })
    })
  }

  /**
   * Handles rate limit errors by updating the task and sending notifications
   * @param taskId The ID of the task that encountered a rate limit
   * @param provider The provider that rate limited the request (e.g., "OpenAI")
   * @param retryAfter Optional time in seconds to retry after
   */
  async handleRateLimitError(
    taskId: string,
    provider: string,
    retryAfter?: number
  ): Promise<void> {
    try {
      const task = await this.readFromQueue(taskId)
      if (!task) {
        console.error(`Task ${taskId} not found for rate limit handling`)
        return
      }

      const retryTime = retryAfter ? retryAfter : 300
      const scheduledFor = new Date(Date.now() + retryTime * 1000)

      await this.updateInQueue(taskId, {
        status: "FAILED",
        scheduledFor,
        errorMessage: `Rate limited by ${provider}. Will retry after ${scheduledFor.toISOString()}`,
        errorPatterns: {
          ...(task.errorPatterns || {}),
          rateLimited: true,
          provider,
          retryAfter: retryTime,
        },
      })

      const referenceId = task.referenceId || undefined

      await this.logger.error(`Rate limit reached for ${provider}`, {
        taskId,
        referenceId,
        statusCode: 429,
        provider,
        retryAfter,
        additionalInfo: {
          ai_key: process.env.OPENAI_AUTH,
        },
      })
    } catch (error) {
      await this.logger.error("Error handling rate limit", {
        taskId,
        provider,
        statusCode: 429,
        retryAfter,
      })
    }
  }

  async retryFailedQueueTasks() {
    return withConnection(this.db, async () => {
      try {
        // Find failed tasks that are scheduled to be retried
        const failedTasks = await this.db.queueTask.findMany({
          where: {
            OR: [{ status: "FAILED" }, { status: "MAX_RETRIES_REACHED" }],
          },
        })

        if (failedTasks.length === 0) {
          return {
            success: true,
            message: "No failed tasks to process",
            processed: 0,
          }
        }
        // Process each task
        const results = await Promise.allSettled(
          failedTasks.map(async (task) => {
            try {
              const result = await this.processJob(task.id, task.attempts + 1, {
                skipIfProcessing: true,
              })
              return { taskId: task.id, success: true, result }
            } catch (error) {
              return {
                taskId: task.id,
                success: false,
                error: error instanceof Error ? error.message : String(error),
              }
            }
          })
        )

        const successful = results.filter(
          (result) => result.status === "fulfilled" && result.value.success
        ).length

        return {
          success: true,
          message: `Processed ${results.length} failed tasks`,
          processed: results.length,
          successful,
          failed: results.length - successful,
          results: results.map((result) =>
            result.status === "fulfilled"
              ? result.value
              : { success: false, error: result.reason }
          ),
        }
      } catch (error) {
        await this.logger.error("Failed to retry failed queue tasks", {
          app: process.env.NEXT_PUBLIC_APP_NAME,
          env: process.env.NEXT_PUBLIC_APP_ENV,
          error: error instanceof Error ? error.message : String(error),
          currentClass: "QueueService",
          currentMethod: "retryFailedQueueTasks",
          currentFile: "QueueService.ts",
        })
        throw error
      }
    })
  }
}

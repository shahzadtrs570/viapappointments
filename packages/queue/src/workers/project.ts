/* eslint-disable */
/* tslint:disable */
import { QueueTask } from "../QueueService"
import { db } from "../../../db"

import { getLogger } from "../../../logger/src"

// Add a connection management helper - A wrapper fn that controls db connection in long processing db operations
// Wrape this as a closure fn to handle the process
const withConnection = async <T>(operation: () => Promise<T>): Promise<T> => {
  let connected = false
  const logger = getLogger()

  try {
    // Ensure we have a connection
    await db.$connect()
    connected = true

    // Execute the operation
    return await operation()
  } catch (error) {
    await logger.error(`Database operation error:`, {
      app: process.env.NEXT_PUBLIC_APP_NAME,
      env: process.env.NEXT_PUBLIC_APP_ENV,
      error: error instanceof Error ? error.message : String(error),
      currentMethod: "withConnection",
      currentFile: "project.ts",
    })
    throw error
  } finally {
    // Only disconnect if we successfully connected
    if (connected) {
      try {
        await db.$disconnect()
      } catch (disconnectError) {
        await logger.error(`Error disconnecting from database`, {
          app: process.env.NEXT_PUBLIC_APP_NAME,
          env: process.env.NEXT_PUBLIC_APP_ENV,
          error:
            disconnectError instanceof Error
              ? disconnectError.message
              : String(disconnectError),
          currentMethod: "withConnection",
          currentFile: "project.ts",
        })
      }
    }
  }
}

// Worker types - Project can have multiple workers (e.g. task1 (image-processing), task2 (video-processing))
export const WORKER_TYPES = {}

// Main worker processor that routes tasks to the appropriate handler
export async function processQueueTask(task: QueueTask): Promise<any> {
  // Your application logic here to handle queue
  // use QueueService methods to add task in the queue, process, get, remove, retry etc
}

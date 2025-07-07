/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@package/db"
import { getLogger } from "@package/logger"
import { QueueService } from "@package/queue"

// Initialize the queue service with the database
const queueServiceInstance = new QueueService(db)
const logger = getLogger()

/**
 * Adds a task to the queue for backoffice requests
 * @param type The type of request (e.g. PROVISIONAL_OFFER, ACCEPT_OFFER)
 * @param data The data to include in the request
 * @param reference Additional reference information
 */
async function addBackofficeRequestToQueue(
  type: string,
  data: any,
  reference?: {
    id: string
    type: string
  }
) {
  // Add the task to the queue
  const task = await queueServiceInstance.addToQueue(
    `BACKOFFICE_${type}`, // Queue task type
    data,
    {
      priority: 10, // High priority for backoffice requests
      maxAttempts: 5, // Retry up to 5 times
      reference: reference || undefined,
    }
  )

  // Try to process the job immediately via the API endpoint
  try {
    // First try to process via API endpoint (non-blocking)
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/queue/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.QUEUE_API_SECRET}`,
      },
      body: JSON.stringify({
        taskId: task.id,
        currentAttempt: 0,
        options: { skipIfProcessing: true },
      }),
    }).catch(async (error) => {
      await logger.error(
        `Error triggering queue processing API for task ${task.id}:`,
        {
          app: process.env.NEXT_PUBLIC_APP_NAME,
          env: process.env.NEXT_PUBLIC_APP_ENV,
          error: error,
          currentMethod: "addBackofficeRequestToQueue",
          currentFile: "queue.service.ts",
        }
      )
    })
  } catch (error) {
    await logger.error(`Error in direct processing for task ${task.id}:`, {
      app: process.env.NEXT_PUBLIC_APP_NAME,
      env: process.env.NEXT_PUBLIC_APP_ENV,
      error: error instanceof Error ? error.message : String(error),
      currentMethod: "addBackofficeRequestToQueue",
      currentFile: "queue.service.ts",
    })
    console.error(`Error processing backoffice request task ${task.id}:`, error)
  }

  return task
}

export { queueServiceInstance as queueService, addBackofficeRequestToQueue }

import { db } from "@package/db"

import { getLogger } from "../../../../../../../packages/logger/src"
import { QueueService } from "../../../../../../../packages/queue/src"

// Increase maxDuration to the maximum allowed by your Vercel plan
export const maxDuration = 300 // 5 minutes (if your Vercel plan supports it)

export async function POST(req: Request) {
  try {
    // Verify authorization
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.QUEUE_API_SECRET}`) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Parse request body
    const { taskId, currentAttempt, options } = await req.json()

    if (!taskId) {
      return new Response("Missing required field: taskId", {
        status: 400,
      })
    }

    // Create queue service
    const queueService = new QueueService(db)

    try {
      // Process the job and wait for it to complete
      const result = await queueService.processJob(
        taskId,
        currentAttempt || 0,
        options
      )

      // Return success response after processing is complete
      return new Response(
        JSON.stringify({
          success: true,
          message: "Task processing completed",
          taskId,
          result,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    } catch (processingError) {
      console.error(`Error processing task ${taskId}:`, processingError)

      // Return error response
      return new Response(
        JSON.stringify({
          success: false,
          message: "Task processing failed",
          taskId,
          error:
            processingError instanceof Error
              ? processingError.message
              : "Unknown error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }
  } catch (error) {
    const logger = getLogger()
    await logger.error(`Error in queue processing route:`, {
      app: "storykraft",
      env: process.env.NEXT_PUBLIC_APP_ENV,
      error: error instanceof Error ? error.message : String(error),
      currentMethod: "POST",
      currentFile: "queue/process/route.ts",
    })
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
}

import { db } from "@package/db"

import { createTRPCRouter, protectedProcedure } from "../../trpc"

export const queueRouter = createTRPCRouter({
  getQueueStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    // Get active tasks (pending and processing)
    const activeTasks = await db.queueTask.findMany({
      where: {
        data: {
          path: ["userId"],
          equals: userId,
        },
        status: {
          in: ["PENDING", "PROCESSING"],
        },
      },
      select: {
        id: true,
        type: true,
        data: true,
        status: true,
        result: true,
        referenceId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get recently completed tasks independently
    const recentlyCompletedTasks = await db.queueTask.findMany({
      where: {
        data: {
          path: ["userId"],
          equals: userId,
        },
        status: {
          in: ["COMPLETED", "FAILED", "MAX_RETRIES_REACHED"],
        },
        updatedAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000), // Last 30 minutes
        },
        OR: [
          // Include tasks that are currently active
          {
            id: {
              in: activeTasks.map((task) => task.id),
            },
          },
          // Include recently completed tasks
          {
            updatedAt: {
              gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes for immediate completion tracking
            },
          },
        ],
      },
      select: {
        id: true,
        type: true,
        data: true,
        status: true,
        result: true,
        referenceId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10,
    })

    return {
      pendingTasks: activeTasks.filter((task) => task.status === "PENDING"),
      processingTasks: activeTasks.filter(
        (task) => task.status === "PROCESSING"
      ),
      completedTasks: recentlyCompletedTasks.filter(
        (task) => task.status === "COMPLETED"
      ),
      failedTasks: recentlyCompletedTasks.filter((task) =>
        ["FAILED", "MAX_RETRIES_REACHED"].includes(task.status)
      ),
    }
  }),
})

// Add to root router
export const appRouter = createTRPCRouter({
  // ... other routers
  queue: queueRouter,
})

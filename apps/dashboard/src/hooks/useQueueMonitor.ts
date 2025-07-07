/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react"

// import { useDispatch } from "react-redux"
import type { QueueStatus } from "@package/db"
import type { JsonValue } from "@prisma/client/runtime/library"

import { api } from "@/lib/trpc/react"

interface QueueTask {
  id: string
  type: string
  status: QueueStatus
  data: JsonValue | null
  result: JsonValue | null
  referenceId: string | null
}

export const useQueueMonitor = () => {
  // const dispatch = useDispatch()
  const [hasProcessingTasks, setHasProcessingTasks] = useState(false)
  const lastProcessedTasksRef = useRef<Map<string, QueueStatus>>(new Map())

  // Query to check processing tasks first
  const { data: queueStatus, refetch: refetchQueue } =
    api.queue.getQueueStatus.useQuery(undefined, {
      refetchInterval: hasProcessingTasks ? 10000 : false,
      enabled: true,
      staleTime: 0, // Always fetch fresh data
    })

  // Function to manually start polling
  const startMonitoring = useCallback(async () => {
    setHasProcessingTasks(true)
    try {
      // Fetch queue status first
      const queueResult = await refetchQueue()
      if ("data" in queueResult && queueResult.data) {
        setHasProcessingTasks(
          queueResult.data.processingTasks.length > 0 ||
            queueResult.data.pendingTasks.length > 0
        )
        // Then fetch stories if needed
        if (queueResult.data.completedTasks.length > 0) {
          // TODO: Fetch data to update the UI
        }
      }
    } catch (error) {
      console.error("Error starting monitoring:", error)
      setHasProcessingTasks(false)
    }
  }, [refetchQueue])

  useEffect(() => {
    if (!queueStatus) return

    const currentTasks = [
      ...queueStatus.pendingTasks,
      ...queueStatus.processingTasks,
      ...queueStatus.completedTasks,
      ...queueStatus.failedTasks, // Include failed tasks
    ]

    // Update status for all current tasks
    currentTasks.forEach((task) => {
      const previousStatus = lastProcessedTasksRef.current.get(task.id)
      if (previousStatus !== task.status) {
        lastProcessedTasksRef.current.set(task.id, task.status)
      }
    })

    setHasProcessingTasks(
      queueStatus.pendingTasks.length > 0 ||
        queueStatus.processingTasks.length > 0
    )
  }, [queueStatus])

  // Transform task data for UI if you need to
  const transformTaskForUI = (task: QueueTask) => ({
    id: task.id,
    status: task.status,
    data: task.result,
  })

  return {
    hasProcessingTasks,
    processingCount:
      (queueStatus?.pendingTasks.length || 0) +
      (queueStatus?.processingTasks.length || 0),
    processingTasks: [
      ...(queueStatus?.pendingTasks || []),
      ...(queueStatus?.processingTasks || []),
    ].map(transformTaskForUI),
    completedTasks: (queueStatus?.completedTasks || []).map(transformTaskForUI),
    failedTasks: (queueStatus?.failedTasks || []).map(transformTaskForUI),
    startMonitoring,
    taskStatuses: lastProcessedTasksRef.current,
  }
}

// UI example usage
// import { useQueueMonitor } from "@/hooks/useQueueMonitor"
// import { useQueueTaskToast } from "@/hooks/useQueueTaskToast"

// const { processingTasks, completedTasks } = useQueueMonitor()

// Memoize the current tasks state
// const currentTasks = useMemo(() => {
//   return [...processingTasks, ...completedTasks].reduce((acc, task) => {
//     acc.set(task.id, task.status)
//     return acc
//   }, new Map<string, string>())
// }, [processingTasks, completedTasks])

// const { showToast, dismissToast } = useQueueTaskToast()

// // Track task updates with stable refs
// useEffect(() => {
//   const updates = new Map<string, any>()
//   const removals = new Set<string>()

//   // Compare current vs last processed state
//   currentTasks.forEach((status, taskId) => {
//     const lastStatus = lastProcessedTasksRef.current.get(taskId)
//     if (status !== lastStatus) {
//       const task = [...processingTasks, ...completedTasks].find(
//         (t) => t.id === taskId
//       )
//       if (task) {
//         updates.set(taskId, task)
//       }
//     }
//   })

//   // Apply updates
//   updates.forEach((task) => {
//     showToast(task)
//     lastProcessedTasksRef.current.set(task.id, task.status)
//   })

//   // Clean up removed tasks
//   removals.forEach((taskId) => {
//     dismissToast(taskId)
//     lastProcessedTasksRef.current.delete(taskId)
//   })
// }, [currentTasks, processingTasks, completedTasks, showToast, dismissToast])

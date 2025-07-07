/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useRef } from "react"

import { toast, useToast } from "@package/ui/toast"
import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface TaskStep {
  label: string
  status: "completed" | "waiting" | "processing"
  icon: React.ReactNode
}

interface Task {
  id: string
  status: string
  data?: {
    // title: string
  }
}

export const useQueueTaskToast = () => {
  const router = useRouter()
  const { dismiss } = useToast()
  const toastIdsRef = useRef<Map<string, string>>(new Map())
  const completedTasksRef = useRef<Set<string>>(new Set())

  // Load completed tasks from localStorage on mount
  useEffect(() => {
    const savedCompletedTasks = localStorage.getItem("completedTaskIds")
    if (savedCompletedTasks) {
      completedTasksRef.current = new Set(JSON.parse(savedCompletedTasks))
    }
  }, [])

  const saveCompletedTask = useCallback((taskId: string) => {
    // As this will be used to track the task status, we need to save the task id to the local storage to ensure it'll not appear again on reload
    completedTasksRef.current.add(taskId)
    localStorage.setItem(
      "completedTaskIds",
      JSON.stringify([...completedTasksRef.current])
    )
  }, [])

  const getTaskSteps = (task: Task): TaskStep[] => {
    const isCompleted = task.status === "COMPLETED"
    const isFailed = task.status === "FAILED"
    const isProcessing = task.status === "PROCESSING"
    const isPending = task.status === "PENDING"

    return [
      {
        label: "Added to queue",
        status: "completed",
        icon: <Check className="size-4 text-green-500" />,
      },
      {
        label: "Waiting to start...",
        status: isPending ? "waiting" : "completed",
        icon: isPending ? (
          <div className="size-4 rounded-full border" />
        ) : (
          <Check className="size-4 text-green-500" />
        ),
      },
      {
        label: isFailed ? "Generation failed" : "Generating story",
        status: isProcessing
          ? "processing"
          : isCompleted || isFailed
            ? "completed"
            : "waiting",
        icon: isProcessing ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isCompleted || isFailed ? (
          <Check className="size-4 text-green-500" />
        ) : (
          <div className="size-4 rounded-full border" />
        ),
      },
      {
        label: "Process Completed",
        status: isPending || isProcessing ? "waiting" : "completed",
        icon:
          isPending || isProcessing ? (
            <div className="size-4 rounded-full border" />
          ) : (
            <Check className="size-4 text-green-500" />
          ),
      },
    ]
  }

  const showToast = useCallback(
    (task: Task) => {
      // Don't show toast if task was already completed
      if (completedTasksRef.current.has(task.id)) {
        return
      }

      const existingToastId = toastIdsRef.current.get(task.id)
      const isCompleted = task.status === "COMPLETED"
      const isFailed = task.status === "FAILED"

      if (existingToastId) {
        dismiss(existingToastId)
      }

      const steps = getTaskSteps(task)

      const { id } = toast({
        title: "Title",
        description: (
          <div className="w-full space-y-2">
            <div className="flex w-full flex-col gap-2">
              {steps.map((step, i) => (
                <div key={i} className="flex w-full items-center gap-2">
                  {step.icon}
                  <span className={`flex-1 ${isFailed ? "text-red-500" : ""}`}>
                    {step.label}
                  </span>
                </div>
              ))}
              {(isCompleted || isFailed) && (
                <button
                  className={`mt-2 w-full rounded ${
                    isFailed
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-primary text-primary-foreground"
                  } px-3 py-2 text-sm font-medium`}
                  onClick={() => {
                    toastIdsRef.current.delete(task.id)
                    router.push(`/url`)
                  }}
                >
                  {isFailed ? "View Failed Task" : "View Task"}
                </button>
              )}
            </div>
          </div>
        ),
        duration: isCompleted || isFailed ? 10000 : Infinity,
        className: "w-full max-w-md",
      })

      toastIdsRef.current.set(task.id, id)

      // Handle cleanup separately
      if (isCompleted || isFailed) {
        setTimeout(() => {
          dismissToast(task.id)
          saveCompletedTask(task.id)
        }, 10000)
      }
    },
    [dismiss, router]
  )

  const dismissToast = useCallback(
    (taskId: string) => {
      const toastId = toastIdsRef.current.get(taskId)
      if (toastId) {
        dismiss(toastId)
        toastIdsRef.current.delete(taskId)
      }
    },
    [dismiss]
  )

  const clearCompletedTasks = useCallback(() => {
    completedTasksRef.current.clear()
    localStorage.removeItem("completedTaskIds")
  }, [])

  return {
    showToast,
    dismissToast,
    clearCompletedTasks,
    getActiveToastIds: () => toastIdsRef.current,
  }
}

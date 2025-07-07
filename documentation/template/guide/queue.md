# Queue Package Documentation

## Overview

The `@package/queue` package provides a robust queuing system for handling asynchronous tasks with features like retry mechanisms, rate limiting, and error handling. It's designed to manage background jobs reliably with database persistence using Prisma.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Usage Examples](#usage-examples)
- [Queue Tasks](#queue-tasks)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)
- [Queue Monitoring and Real-time Updates](#queue-monitoring-and-real-time-updates)

## Installation

The package is included in the monorepo and can be used by adding it as a dependency:

```json
{
  "dependencies": {
    "@package/queue": "workspace:*"
  }
}
```

## Quick Start

```typescript
import { QueueService } from "@package/queue";
import { db } from "@package/db";

// Initialize the queue service
const queueService = new QueueService(db);

// Add a task to the queue
const task = await queueService.addToQueue(
  "EMAIL_SEND",
  {
    to: "user@example.com",
    subject: "Welcome",
    template: "welcome-email"
  },
  {
    maxAttempts: 3,
    priority: 1
  }
);

// Process the task
const result = await queueService.processJob(task.id);
```

## Architecture

The queue package is structured around three main components:

```
queue/
├── src/
│   ├── QueueService.ts     # Main queue service implementation
│   ├── workers/
│   │   └── project.ts      # Task processors and worker types
│   └── index.ts           # Public API exports
```

### Key Components

1. **QueueService**: Manages queue operations (add, process, update, delete)
2. **Workers**: Handle specific task types and their processing logic
3. **Database Integration**: Uses Prisma for persistent storage of queue tasks

## Queue Tasks

### Task Structure

```typescript
interface QueueTask<TData = any, TResult = unknown> {
  id: string;
  type: string;
  data: TData;
  result?: TResult;
  status: QueueStatus;
  attempts: number;
  maxAttempts: number;
  failedProviders: string[];
  errorMessage?: string | null;
  errorPatterns?: Record<string, unknown> | null;
  priority?: number;
  scheduledFor?: Date | null;
  processedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  referenceId?: string | null;
  referenceType?: string | null;
}
```

### Task Statuses

- `PENDING`: Task is waiting to be processed
- `PROCESSING`: Task is currently being processed
- `COMPLETED`: Task completed successfully
- `FAILED`: Task failed but may be retried
- `MAX_RETRIES_REACHED`: Task failed and won't be retried

## Usage Examples

### Adding Tasks to Queue

```typescript
// Simple task
const emailTask = await queueService.addToQueue(
  "EMAIL_SEND",
  { to: "user@example.com", template: "welcome" }
);

// Task with options
const priorityTask = await queueService.addToQueue(
  "IMAGE_PROCESS",
  { imageUrl: "https://example.com/image.jpg" },
  {
    priority: 2,
    maxAttempts: 5,
    scheduledFor: new Date(Date.now() + 3600000), // Schedule for 1 hour later
    reference: {
      id: "user-123",
      type: "User"
    }
  }
);
```

### Processing Tasks

```typescript
// Process a specific task
const result = await queueService.processJob(taskId);

// Retry failed tasks
const retryResult = await queueService.retryFailedQueueTasks();
```

### Handling Rate Limits

```typescript
// Handle rate limit errors
await queueService.handleRateLimitError(
  taskId,
  "OpenAI",
  300 // Retry after 5 minutes
);
```

## Queue Monitoring and Real-time Updates

The queue package provides built-in monitoring capabilities through polling and real-time status updates.

### Polling System

The polling system is implemented through a tRPC router and React hooks for real-time queue monitoring.

#### Queue Status Router

```typescript
// packages/api/src/routers/queue/queue.polling.router.ts
export const queueRouter = createTRPCRouter({
  getQueueStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    // Returns:
    // - Active tasks (pending and processing)
    // - Recently completed tasks
    // - Failed tasks
    return {
      pendingTasks,
      processingTasks,
      completedTasks,
      failedTasks
    }
  })
})
```

#### Queue Monitor Hook

```typescript
// apps/dashboard/src/hooks/useQueueMonitor.ts
const {
  hasProcessingTasks,
  processingCount,
  processingTasks,
  completedTasks,
  failedTasks,
  startMonitoring,
  taskStatuses
} = useQueueMonitor()
```

Features:
- Automatic polling (10s intervals when tasks are processing)
- Real-time status updates
- Task state tracking
- Efficient memory management

#### Toast Notification System

```typescript
// apps/dashboard/src/hooks/useQueueTaskToast.tsx
const {
  showToast,
  dismissToast,
  clearCompletedTasks,
  getActiveToastIds
} = useQueueTaskToast()
```

Features:
- Progress step indicators
- Status-based styling
- Automatic cleanup
- Task completion persistence
- Navigation to task details

### Implementation Example

```typescript
import { useQueueMonitor } from "@/hooks/useQueueMonitor"
import { useQueueTaskToast } from "@/hooks/useQueueTaskToast"

function QueueMonitorComponent() {
  const {
    processingTasks,
    completedTasks,
    startMonitoring
  } = useQueueMonitor()
  
  const { showToast } = useQueueTaskToast()

  useEffect(() => {
    startMonitoring()
  }, [startMonitoring])

  // Monitor and show toasts for tasks
  useEffect(() => {
    processingTasks.forEach(task => {
      showToast({
        id: task.id,
        status: task.status,
        data: task.data
      })
    })
  }, [processingTasks, showToast])

  return (
    <div>
      <h2>Active Tasks: {processingTasks.length}</h2>
      <h2>Completed: {completedTasks.length}</h2>
      {/* Render task list */}
    </div>
  )
}
```

### Task Progress Steps

The toast system shows task progress through defined steps:

```typescript
const steps = [
  {
    label: "Added to queue",
    status: "completed",
    icon: <Check />
  },
  {
    label: "Waiting to start...",
    status: isPending ? "waiting" : "completed",
    icon: isPending ? <Spinner /> : <Check />
  },
  {
    label: "Processing",
    status: isProcessing ? "processing" : "completed",
    icon: isProcessing ? <Spinner /> : <Check />
  },
  {
    label: "Completed",
    status: isCompleted ? "completed" : "waiting",
    icon: isCompleted ? <Check /> : <Spinner />
  }
]
```

### Monitoring Best Practices

1. **Polling Configuration**
   - Use appropriate polling intervals (default: 10s)
   - Stop polling when no active tasks
   - Implement error handling for failed polls

2. **Toast Management**
   - Limit concurrent toasts
   - Clear completed toasts automatically
   - Provide clear status feedback

3. **State Management**
   - Use refs for non-render state
   - Clean up completed tasks
   - Track task history efficiently

4. **Error Handling**
   - Show clear error messages
   - Provide retry options
   - Log errors appropriately

## Error Handling

The package includes comprehensive error handling with exponential backoff:

```typescript
try {
  const task = await queueService.processJob(taskId);
} catch (error) {
  // Tasks will automatically retry based on maxAttempts
  console.error("Task processing error:", error);
}
```

### Retry Mechanism

- Exponential backoff between retries
- Configurable maximum attempts
- Automatic handling of rate limits
- Detailed error tracking

## Best Practices

1. **Task Definition**
   - Use specific task types
   - Include all necessary data in the task
   - Set appropriate maxAttempts

```typescript
await queueService.addToQueue(
  "IMAGE_PROCESS",
  {
    imageUrl: "https://example.com/image.jpg",
    options: {
      resize: true,
      format: "webp"
    }
  },
  {
    maxAttempts: 3,
    priority: 1
  }
);
```

2. **Error Handling**
   - Implement proper error handling
   - Use rate limit handling for API calls
   - Monitor failed tasks

```typescript
// Monitor processing tasks
const hasProcessing = await queueService.hasProcessingTasks("IMAGE_PROCESS");
if (hasProcessing) {
  console.log("Tasks are currently processing");
}
```

3. **Task Processing**
   - Process tasks asynchronously
   - Handle task results appropriately
   - Clean up completed tasks

## API Reference

### QueueService Methods

```typescript
class QueueService {
  // Add a task to the queue
  async addToQueue<TData>(
    type: string,
    data: TData,
    options?: {
      priority?: number;
      scheduledFor?: Date;
      maxAttempts?: number;
      reference?: {
        id: string;
        type: string;
      };
    }
  ): Promise<QueueTask<TData>>;

  // Process a task
  async processJob<TData, TResult>(
    taskId: string,
    currentAttempt?: number,
    options?: {
      skipIfProcessing?: boolean;
    }
  ): Promise<QueueTask<TData, TResult> | null>;

  // Read a task from the queue
  async readFromQueue<TData, TResult>(
    taskId: string
  ): Promise<QueueTask<TData, TResult> | null>;

  // Update a task in the queue
  async updateInQueue<TData, TResult>(
    taskId: string,
    data: Partial<QueueTask<TData, TResult>>
  ): Promise<QueueTask<TData, TResult>>;

  // Delete a task from the queue
  async deleteFromQueue(taskId: string): Promise<void>;

  // Handle rate limit errors
  async handleRateLimitError(
    taskId: string,
    provider: string,
    retryAfter?: number
  ): Promise<void>;

  // Retry failed tasks
  async retryFailedQueueTasks(): Promise<{
    success: boolean;
    message: string;
    processed: number;
    successful?: number;
    failed?: number;
    results?: any[];
  }>;
}
```

## Database Integration

The queue uses Prisma for database operations. Ensure your Prisma schema includes the necessary models:

```prisma
model QueueTask {
  id              String      @id @default(cuid())
  type            String
  data            Json
  result          Json?
  status          QueueStatus @default(PENDING)
  attempts        Int         @default(0)
  maxAttempts     Int         @default(3)
  failedProviders String[]
  errorMessage    String?
  errorPatterns   Json?
  priority        Int?        @default(0)
  scheduledFor    DateTime?
  processedAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  referenceId     String?
  referenceType   String?
}

enum QueueStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  MAX_RETRIES_REACHED
}
```

## Contributing

When contributing to the queue package:

1. Follow the existing patterns for implementing new features
2. Add appropriate error handling
3. Update documentation for any changes
4. Maintain type safety
5. Add tests for new functionality

## License

This package is part of the NextJet project and is subject to its licensing terms. 
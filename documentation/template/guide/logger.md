# Logger Package Documentation

## Overview

The `@package/logger` package provides a unified logging system for both client and server-side applications. It features Google Chat integration for real-time notifications, error tracking, and structured logging with metadata.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Usage Examples](#usage-examples)
- [Server-Side Usage](#server-side-usage)
- [Client-Side Usage](#client-side-usage)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

## Installation

```json
{
  "dependencies": {
    "@package/logger": "workspace:*"
  }
}
```

## Quick Start

```typescript
import { getLogger } from '@package/logger'

// Get logger instance
const logger = getLogger()

// Log different severity levels
await logger.info('Operation successful')
await logger.warn('Resource running low')
await logger.error('Operation failed')
await logger.critical('System crash')
```

## Architecture

```
logger/
├── src/
│   ├── lib/
│   │   ├── logger.ts    # Main logger implementation
│   │   └── types.ts     # TypeScript interfaces
│   └── index.ts         # Public exports
```

## Usage Examples

### Basic Logging

```typescript
import { getLogger } from '@package/logger'

const logger = getLogger()

await logger.info('User logged in', {
  userId: 'user-123',
  source: 'auth-service'
})
```

### Error Logging with Metadata

```typescript
try {
  // Some operation
} catch (error) {
  await logger.error('Database operation failed', {
    error: error instanceof Error ? error.message : String(error),
    currentClass: 'UserService',
    currentMethod: 'createUser',
    currentFile: 'user.service.ts'
  })
}
```

## Server-Side Usage

### Using the Error Logger Utility

```typescript
import { logError, logInfo, logWarning, logCritical } from '@package/utils/errorLogger'

// Basic error logging
logError(new Error('Operation failed'), {
  className: 'PaymentService',
  methodName: 'processPayment',
  fileName: 'payment.service.ts'
})

// Create contextual logger
const logger = createContextualLogger({
  className: 'AuthService',
  fileName: 'auth.service.ts'
})

// Use contextual logger
logger.info('User authenticated', {
  methodName: 'authenticate',
  userId: 'user-123'
})
```

### Advanced Server-Side Example

```typescript
import { getLogger } from '@package/logger'

class PaymentProcessor {
  private logger = getLogger()

  async processPayment(userId: string, amount: number) {
    try {
      // Payment processing logic
      await this.logger.info('Payment processed', {
        userId,
        amount,
        currentClass: 'PaymentProcessor',
        currentMethod: 'processPayment'
      })
    } catch (error) {
      await this.logger.error('Payment failed', {
        userId,
        amount,
        error: error instanceof Error ? error.message : String(error),
        currentClass: 'PaymentProcessor',
        currentMethod: 'processPayment'
      })
      throw error
    }
  }
}
```

## Client-Side Usage

### React Hook Usage

```typescript
import { useErrorLogger } from '@/hooks/useErrorLogger'

function MyComponent() {
  const logger = useErrorLogger({
    className: 'MyComponent',
    fileName: 'MyComponent.tsx'
  })

  const handleClick = async () => {
    try {
      // Some operation
      logger.info('Operation successful', {
        methodName: 'handleClick'
      })
    } catch (error) {
      logger.error(error, {
        methodName: 'handleClick',
        additionalContext: 'Button click handler'
      })
    }
  }
}
```

## API Reference

### Logger Interface

```typescript
interface Logger {
  info(message: string, metadata?: ErrorMetadata): Promise<void>
  warn(message: string, metadata?: ErrorMetadata): Promise<void>
  error(message: string, metadata?: ErrorMetadata): Promise<void>
  critical(message: string, metadata?: ErrorMetadata): Promise<void>
  logError(error: Error, metadata?: ErrorMetadata): Promise<void>
}
```

### Error Metadata Interface

```typescript
interface ErrorMetadata {
  taskId?: string
  referenceId?: string
  statusCode?: number
  provider?: string
  endpoint?: string
  stackTrace?: string
  userId?: string
  additionalInfo?: Record<string, unknown>
  app?: string
  env?: string
  currentClass?: string
  currentMethod?: string
  currentFile?: string
  source?: "client" | "server"
  [key: string]: any
}
```

### Logger Configuration

```typescript
interface LoggerConfig {
  webhookUrl: string
  environment: string
  service: string
  enableConsoleLog?: boolean
  source?: string
}
```

## Best Practices

1. **Structured Logging**
   - Always include relevant metadata
   - Use consistent naming for metadata fields
   - Include context information (class, method, file)

```typescript
logger.error('Operation failed', {
  currentClass: 'UserService',
  currentMethod: 'createUser',
  currentFile: 'user.service.ts',
  userId: 'user-123',
  errorCode: 'AUTH_001'
})
```

2. **Error Handling**
   - Log errors before throwing them
   - Include stack traces when available
   - Use appropriate severity levels

```typescript
try {
  // Operation
} catch (error) {
  await logger.error('Operation failed', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  })
  throw error
}
```

3. **Performance**
   - Use rate limiting for high-volume logs
   - Batch related log messages
   - Consider log level importance

4. **Security**
   - Never log sensitive information
   - Sanitize error messages
   - Use appropriate access controls

5. **Monitoring**
   - Set up alerts for critical errors
   - Monitor log volume
   - Track error patterns

## Environment Variables

```env
NEXT_PUBLIC_GOOGLE_CHAT_WEBHOOK_URL=your_webhook_url
NEXT_PUBLIC_APP_ENV=development|production
NEXT_PUBLIC_APP_NAME=your_app_name
NEXT_PUBLIC_DISABLE_NOTIFICATION_LOGGER=true|false
```

## Contributing

When contributing to the logger package:

1. Follow the established metadata structure
2. Add appropriate TypeScript types
3. Test both client and server-side usage
4. Document new features or changes
5. Consider backward compatibility

## License

This package is part of the NextJet project and is subject to its licensing terms. 
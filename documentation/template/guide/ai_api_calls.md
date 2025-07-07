# AI API Calls Package Documentation

## Overview

The `@package/api/ai_api_calls` module provides functionality to track and manage AI API calls, including usage metrics, costs, and performance monitoring. It stores detailed information about each API call for analytics and debugging purposes.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Best Practices](#best-practices)

## Quick Start

```typescript
import { aiApiCallsService } from "@package/api/routers/ai_api_calls/service/ai_api_calls.service"

// Create an AI API call record
const input = {
  id: "call_xyz123",
  provider: "openai",
  model: "gpt-4",
  prompt_string: "Explain quantum computing",
  prompt_tokens: 10,
  completion_tokens: 150,
  total_tokens: 160,
  responseData: JSON.stringify(response),
  response_time: "1.5",
  status_code: 200,
  usage_cost: 0.12,
  ai_response_words: 300,
  ai_response_chars: 1500,
  prompt_number_words: 3,
  prompt_number_chars: 25
}

await aiApiCallsService.createAiApiCall({
  input,
  userId: "user_123"
})
```

## Architecture

```
ai_api_calls/
├── repository/
│   ├── ai_api_calls.repository.ts     # Database operations
│   └── ai_api_calls.repository.types.ts
├── service/
│   ├── ai_api_calls.service.ts        # Business logic
│   └── ai_api_calls.service.types.ts
└── ai_apis_calls.router.ts            # tRPC router
```

## Usage Examples

### Creating an API Call Record

```typescript
import { aiApiCallsService } from "@package/api"

// After making an AI API call
const callRecord = await aiApiCallsService.createAiApiCall({
  input: {
    id: response.id,
    provider: "openai",
    model: response.model,
    prompt_string: JSON.stringify(prompt),
    prompt_tokens: usage.prompt_tokens,
    completion_tokens: usage.completion_tokens,
    total_tokens: usage.total_tokens,
    responseData: JSON.stringify(response),
    status_code: 200,
    usage_cost: calculateCost(usage),
    response_time: measureResponseTime(),
    // Optional metrics
    ai_response_words: countWords(response.text),
    ai_response_chars: response.text.length,
    prompt_number_words: countWords(prompt),
    prompt_number_chars: prompt.length
  },
  userId: "user_123"
})
```

### Retrieving User's API Calls

```typescript
// Get all API calls for a user
const userCalls = await aiApiCallsService.getAiApiCallsByUserId("user_123")
```

## API Reference

### Service Methods

```typescript
class AiApiCallsService {
  // Create a new API call record
  async createAiApiCall(args: {
    input: CreateAiApiCallData
    userId: string | undefined
  }): Promise<Ai_api_calls>

  // Get all API calls for a user
  async getAiApiCallsByUserId(
    userId: string
  ): Promise<Ai_api_calls[]>
}
```

### Input Types

```typescript
interface CreateAiApiCallData {
  id: string
  provider: string
  model: string
  prompt_string: string
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  responseData: string
  response_time: string
  status_code: number
  usage_cost: number
  ai_response_words?: number
  ai_response_chars?: number
  prompt_number_words?: number
  prompt_number_chars?: number
  audio_length_mins?: number
}
```

## Database Schema

```prisma
model Ai_api_calls {
  id                  String   @id
  userId              String
  provider            String
  model               String
  prompt_string       String
  prompt_tokens       Int
  completion_tokens   Int
  total_tokens        Int
  responseData        String
  response_time       String
  status_code         Int
  usage_cost          Float
  createdAt           DateTime @default(now())
  audio_length_mins   Float?
  ai_response_words   Int?
  ai_response_chars   Int?
  prompt_number_words Int?
  prompt_number_chars Int?
}
```

## Best Practices

1. **Error Handling**
   ```typescript
   try {
     await aiApiCallsService.createAiApiCall({
       input,
       userId
     })
   } catch (error) {
     logger.error("Failed to record AI API call", {
       error,
       userId,
       callId: input.id
     })
   }
   ```

2. **Response Data Sanitization**
   ```typescript
   const safeStringify = (data: any) => {
     try {
       return JSON.stringify(data)
     } catch (error) {
       return String(data)
     }
   }
   ```

3. **Usage Tracking**
   - Always include accurate token counts
   - Track response times
   - Calculate costs correctly
   - Monitor rate limits

4. **Performance Metrics**
   - Track word and character counts
   - Monitor response times
   - Analyze token usage patterns

5. **Security**
   - Sanitize prompt strings
   - Validate user permissions
   - Handle sensitive data appropriately

## Contributing

When contributing to the AI API calls package:

1. Follow the established error handling patterns
2. Add appropriate logging
3. Update documentation
4. Include relevant metrics
5. Consider backward compatibility

## License

This package is part of the NextJet project and is subject to its licensing terms. 
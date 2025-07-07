# AI LLM Package Documentation

## Overview

The `@package/ai_llm` package provides a flexible and extensible interface for integrating Large Language Models (LLMs) into your application. It currently supports OpenAI and Anthropic models with both direct API implementations and LangChain integrations.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Installation

The package is included in the monorepo and can be used by adding it as a dependency in your package.json:

```json
{
  "dependencies": {
    "@package/ai_llm": "workspace:*"
  }
}
```

## Quick Start

```typescript
import { AILLM } from "@package/ai_llm";

// Initialize with default provider (OpenAI)
const llm = new AILLM();

// Or specify provider and implementation
const anthropicLLM = new AILLM("anthropic", "langchain");

// Generate a response
const response = await llm.getProvider().generateResponse(
  JSON.stringify("What is the meaning of life?"),
  "user-123", // optional userId for tracking
  "openai",   // optional provider override
  schema      // optional Zod schema for response validation
);
```

## Architecture

The package uses a factory pattern to create LLM instances with different providers and implementations:

```
ai_llm/
├── src/
│   ├── lib/
│   │   ├── factory/
│   │   │   └── LLMFactory.ts    # Factory for creating LLM instances
│   │   ├── langchain/
│   │   │   ├── anthropic.ts     # LangChain Anthropic implementation
│   │   │   └── openai.ts        # LangChain OpenAI implementation
│   │   ├── anthropic.ts         # Direct Anthropic API implementation
│   │   ├── openai.ts            # Direct OpenAI API implementation
│   │   └── llmapi.ts           # Common interface for all LLM implementations
│   └── index.ts                # Main entry point
```

### Provider Types
- `openai`: OpenAI's GPT models
- `anthropic`: Anthropic's Claude models

### Implementation Types
- `default`: Direct API implementation
- `langchain`: LangChain-based implementation

## Usage Examples

### Basic Usage

```typescript
import { AILLM } from "@package/ai_llm";

// Initialize with OpenAI
const llm = new AILLM("openai", "default");

// Generate a response
const response = await llm.getProvider().generateResponse(
  JSON.stringify("Write a short poem about coding.")
);
```

### With LangChain Implementation

```typescript
import { AILLM } from "@package/ai_llm";
import { z } from "zod";

// Initialize with Anthropic + LangChain
const llm = new AILLM("anthropic", "langchain");

// Define response schema
const responseSchema = z.object({
  content: z.string(),
  sentiment: z.enum(["positive", "negative", "neutral"])
});

// Generate structured response
const response = await llm.getProvider().generateResponse(
  JSON.stringify({
    prompt: "Analyze the sentiment of: 'I love coding!'",
    format: "Return JSON with content and sentiment"
  }),
  "user-123",
  "anthropic",
  responseSchema
);
```

### With Usage Tracking

```typescript
import { AILLM } from "@package/ai_llm";

const llm = new AILLM("openai", "default");

// Track usage with userId
const response = await llm.getProvider().generateResponse(
  JSON.stringify("Explain quantum computing."),
  "user-123", // userId for tracking
  "openai"    // explicit provider
);
```

## Configuration

### Environment Variables

Required environment variables for each provider:

```env
# OpenAI Configuration
OPENAI_AUTH=your_openai_api_key
OPENAI_TEXT_MODEL=gpt-4 # or other model

# Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Model Configuration

Each provider implementation includes default model settings that can be customized:

```typescript
// OpenAI defaults
this.OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-4";

// Anthropic defaults
this.ANTHROPIC_MODEL = "claude-3-sonnet-20240229";
```

## API Reference

### AILLM Class

```typescript
class AILLM {
  constructor(
    provider: "openai" | "anthropic" = "openai",
    implementation: "default" | "langchain" = "default"
  )
  
  getProvider(): LLMAPI
}
```

### LLMAPI Interface

```typescript
interface LLMAPI {
  generateResponse(
    stringifiedPrompt: string,
    userId?: string,
    AI_LLM_PROVIDER?: "openai" | "anthropic",
    schema?: z.ZodType<any>
  ): Promise<string>
}
```

## Error Handling

The package includes comprehensive error handling:

```typescript
try {
  const llm = new AILLM("openai");
  const response = await llm.getProvider().generateResponse(
    JSON.stringify("Your prompt")
  );
} catch (error) {
  if (error instanceof Error) {
    console.error("LLM Error:", error.message);
    // Handle specific error cases
  }
}
```

Common errors:
- Missing API keys
- Invalid model specifications
- Rate limiting
- Context length exceeded
- Invalid response format

## Best Practices

1. **Environment Variables**
   - Always use environment variables for API keys
   - Set appropriate model names in environment

2. **Error Handling**
   - Implement proper error handling for API failures
   - Log errors appropriately for debugging

3. **Response Validation**
   - Use Zod schemas to validate responses when structure is important
   - Handle validation failures gracefully

4. **Usage Tracking**
   - Provide userId when available for usage tracking
   - Monitor API usage and costs

5. **Provider Selection**
   - Choose appropriate provider based on use case
   - Consider using LangChain implementation for complex chains

## Examples

### Content Generation

```typescript
const llm = new AILLM("anthropic", "langchain");

const response = await llm.getProvider().generateResponse(
  JSON.stringify({
    prompt: "Write a blog post about AI safety",
    style: "technical but accessible",
    length: "500 words"
  })
);
```

### Structured Data Extraction

```typescript
const llm = new AILLM("openai");

const schema = z.object({
  title: z.string(),
  keywords: z.array(z.string()),
  summary: z.string()
});

const response = await llm.getProvider().generateResponse(
  JSON.stringify({
    text: "Your long article here...",
    task: "Extract key information"
  }),
  undefined,
  "openai",
  schema
);
```

## Contributing

When contributing to the ai_llm package:

1. Follow the existing pattern for implementing new providers
2. Add appropriate tests for new functionality
3. Update documentation for any changes
4. Ensure error handling is comprehensive
5. Maintain type safety throughout

## License

This package is part of the NextJet project and is subject to its licensing terms. 
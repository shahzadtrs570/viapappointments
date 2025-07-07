# AI Audio Package Documentation

## Overview

The `@package/ai_audio` package provides a unified interface for text-to-speech (TTS) audio generation using various providers. Currently, it supports OpenAI's TTS service and has a placeholder for ElevenLabs integration. The package handles audio file generation, metadata management, and cloud storage integration.

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

The package is included in the monorepo and can be used by adding it as a dependency:

```json
{
  "dependencies": {
    "@package/ai_audio": "workspace:*"
  }
}
```

## Quick Start

```typescript
import { AIAudio, AudioGenerationData } from "@package/ai_audio";

// Initialize with OpenAI provider
const audioGenerator = new AIAudio("openai");

// Generate audio file
const audioData: AudioGenerationData = {
  userId: "user-123",
  id: "title-456",
  title: "Title",
  content: "Once upon a time..."
};

const metadata = {
  title: "My Audio",
  artist: "AI Narrator",
  album: "AI Audio"
};

const result = await audioGenerator.generateAudioFile(
  audioData,
  metadata,
  "user-123",
  "openai"
);
```

## Architecture

The package uses a simple provider pattern for different audio services:

```
ai_audio/
├── src/
│   ├── lib/
│   │   ├── openai.ts      # OpenAI TTS implementation
│   │   └── elevenlabs.ts  # ElevenLabs implementation (placeholder)
│   └── index.ts           # Main entry point and interfaces
```

### Provider Types
- `openai`: OpenAI's text-to-speech service
- `elevenlabs`: ElevenLabs TTS service (coming soon)

## Usage Examples

### Basic Audio Generation

```typescript
import { AIAudio } from "@package/ai_audio";

const audioGenerator = new AIAudio("openai");

const result = await audioGenerator.generateAudioFile(
  {
    userId: "user-123",
    id: "id-1",
    title: "Welcome Message",
    content: "Welcome to our platform!"
  },
  {
    title: "Welcome Audio",
    artist: "AI Assistant"
  },
  "user-123",
  "openai"
);

if (result) {
  console.log("Audio URL:", result.audioUrl);
  console.log("Duration:", result.duration);
}
```

### With Metadata and Long Content

```typescript
import { AIAudio } from "@package/ai_audio";

const audioGenerator = new AIAudio("openai");

// Long content will be automatically chunked
const longContent = `
  This is a long article that will be automatically split into chunks
  for processing. The package handles chunking and combines the audio
  files automatically...
`.trim();

const result = await audioGenerator.generateAudioFile(
  {
    userId: "user-123",
    id: "article-1",
    title: "Long Article",
    content: longContent
  },
  {
    title: "Article Audio Version",
    artist: "AI Narrator",
    album: "AI Articles Collection"
  },
  "user-123",
  "openai"
);
```

## Configuration

### Environment Variables

Required environment variables:

```env
# OpenAI Configuration
OPENAI_AUTH=your_openai_api_key
OPENAI_AUDIO_MODEL=tts-1
OPENAI_VOICE=fable

# File Storage Configuration (for storing audio files)
CLOUDFLARE_ENDPOINT=your_cloudflare_endpoint
CLOUDFLARE_BUCKET_NAME=your_bucket_name
CLOUDFLARE_PUBLIC_URL=your_public_url
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_ACCESS_KEY_SECRET=your_secret_key
```

### Audio Settings

Default settings that can be customized:

```typescript
// OpenAI defaults
this.OPENAI_AUDIO_MODEL = process.env.OPENAI_AUDIO_MODEL || "tts-1";
this.OPENAI_VOICE = process.env.OPENAI_VOICE || "fable";
```

## API Reference

### AIAudio Class

```typescript
class AIAudio {
  constructor(provider: "openai" | "elevenlabs" = "openai")
  
  generateAudioFile(
    data: AudioGenerationData,
    metadata: {
      title?: string;
      artist?: string;
      album?: string;
    },
    userId: string,
    AI_AUDIO_PROVIDER: "openai" | "elevenlabs"
  ): Promise<{
    audioMP3Object: string;
    audioUrl: string;
    duration: AudioDuration;
  } | null>
}
```

### AudioGenerationData Interface

```typescript
interface AudioGenerationData {
  userId: string;
  id: string;
  title?: string;
  content: string;
}
```

### AudioDuration Interface

```typescript
interface AudioDuration {
  minutes: number;
  seconds: number;
  totalMinutes: number;
}
```

## Error Handling

The package includes comprehensive error handling:

```typescript
try {
  const audioGenerator = new AIAudio("openai");
  const result = await audioGenerator.generateAudioFile(
    audioData,
    metadata,
    userId,
    "openai"
  );
  
  if (!result) {
    throw new Error("Failed to generate audio");
  }
} catch (error) {
  console.error("Audio generation error:", error);
  // Handle error appropriately
}
```

Common errors:
- Missing API keys
- Invalid audio model
- Content too long
- File storage issues
- Metadata parsing errors

## Best Practices

1. **Environment Variables**
   - Always set required API keys and configuration
   - Use appropriate audio models for quality needs

2. **Content Management**
   - Keep content chunks under 4000 characters
   - Sanitize input content to remove invalid characters
   - Provide clear, descriptive metadata

3. **Error Handling**
   - Implement proper error handling for API failures
   - Handle null results appropriately
   - Monitor API usage and costs

4. **File Storage**
   - Configure cloud storage properly
   - Implement appropriate file naming conventions
   - Manage file lifecycle (cleanup old files)

5. **Performance**
   - Use appropriate chunk sizes for long content
   - Monitor audio generation duration
   - Implement caching if needed

## Examples

### Complete Audio Generation Flow

```typescript
import { AIAudio } from "@package/ai_audio";

async function generateAndSaveAudio(
  content: string,
  title: string,
  userId: string
) {
  const audioGenerator = new AIAudio("openai");
  
  try {
    const result = await audioGenerator.generateAudioFile(
      {
        userId,
        id: Date.now().toString(),
        title,
        content
      },
      {
        title,
        artist: "AI Narrator",
        album: "Generated Content"
      },
      userId,
      "openai"
    );
    
    if (!result) {
      throw new Error("Failed to generate audio");
    }
    
    return {
      url: result.audioUrl,
      duration: `${result.duration.minutes}:${result.duration.seconds
        .toString()
        .padStart(2, "0")}`,
      base64: result.audioMP3Object
    };
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
}
```

## Contributing

When contributing to the ai_audio package:

1. Follow the existing pattern for implementing new providers
2. Add appropriate error handling
3. Update documentation for any changes
4. Maintain type safety
5. Add tests for new functionality

## License

This package is part of the NextJet project and is subject to its licensing terms. 
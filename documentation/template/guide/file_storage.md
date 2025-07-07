# File Storage Package Documentation

## Overview

The `@package/file_storage` package provides a unified interface for file storage operations across multiple providers (AWS S3, Cloudflare R2, Local Storage). It supports file uploads, downloads, signed URLs, and metadata management.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Providers](#providers)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Best Practices](#best-practices)

## Installation

```json
{
  "dependencies": {
    "@package/file_storage": "workspace:*"
  }
}
```

## Quick Start

```typescript
import { FileStorage } from "@package/file_storage"

// Initialize with default config (from environment variables)
const storage = new FileStorage()

// Upload a file
const url = await storage.uploadFile(
  "path/to/file.mp3",
  audioBuffer,
  {
    contentType: "audio/mpeg",
    title: "My Audio",
    artist: "AI Generated"
  }
)
```

## Architecture

```
file_storage/
├── src/
│   ├── lib/
│   │   ├── services/
│   │   │   ├── aws.service.ts     # AWS S3 implementation
│   │   │   ├── cloudflare.service.ts # Cloudflare R2 implementation
│   │   │   ├── local.service.ts   # Local filesystem implementation
│   │   │   └── s3.service.ts      # Base S3 implementation
│   │   ├── factory.ts             # Service factory
│   │   ├── fileStorage.ts         # Main class
│   │   └── types.ts               # TypeScript interfaces
│   └── index.ts                   # Public exports
```

## Providers

### 1. AWS S3
```typescript
const storage = new FileStorage({
  provider: "aws",
  region: "us-east-1",
  bucket: "my-bucket",
  credentials: {
    accessKeyId: "ACCESS_KEY",
    secretAccessKey: "SECRET_KEY"
  }
})
```

### 2. Cloudflare R2
```typescript
const storage = new FileStorage({
  provider: "cloudflare",
  endpoint: "https://xxx.r2.cloudflarestorage.com",
  bucket: "my-bucket",
  credentials: {
    accessKeyId: "ACCESS_KEY",
    secretAccessKey: "SECRET_KEY"
  }
})
```

### 3. Local Storage
```typescript
const storage = new FileStorage({
  provider: "local",
  options: {
    storagePath: "./storage",
    publicUrl: "/storage"
  }
})
```

## Service Implementations

### Base S3 Service (s3.service.ts)

The base S3 service provides common S3-compatible storage functionality:

```typescript
import { S3Service } from "@package/file_storage"

// Base implementation for S3-compatible storage
class S3Service implements StorageServiceInterface {
  async uploadFile(path: string, content: Buffer, metadata?: FileMetadata) {
    // Handles basic S3 upload with metadata
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: path,
      Body: content,
      ContentType: metadata?.contentType,
      Metadata: this.flattenMetadata(metadata)
    })
    // Returns public URL after upload
  }
  
  // Additional methods: getFile, deleteFile, getSignedUrl, listFiles
}
```

Key Features:
- Standard S3 operations
- Metadata handling
- Content type management
- Signed URL generation

### AWS Service (aws.service.ts)

Extends the base S3 service with AWS-specific features:

```typescript
import { AWSService } from "@package/file_storage"

const storage = new FileStorage({
  provider: "aws",
  region: "us-east-1",
  bucket: "my-bucket"
})
```

Unique Features:
- AWS region-specific configuration
- S3 Select support for querying file contents
- Object tagging
- Media file type detection
- Specialized content type handling for:
  - Video files (mp4, mov, avi, etc.)
  - Audio files (mp3, wav, ogg, etc.)
  - Image files (jpg, png, webp, etc.)

Example Media Upload:
```typescript
const awsStorage = new AWSService(config)

// Upload video with automatic content type
await awsStorage.uploadMediaFile(
  "videos/sample.mp4",
  videoBuffer,
  "video",
  { title: "Sample Video" }
)
```

### Cloudflare Service (cloudflare.service.ts)

Implements Cloudflare R2 storage functionality:

```typescript
import { CloudflareService } from "@package/file_storage"

const storage = new FileStorage({
  provider: "cloudflare",
  endpoint: "https://xxx.r2.cloudflarestorage.com",
  bucket: "my-bucket"
})
```

Features:
- Cloudflare R2 specific configuration
- Auto-region ("auto")
- Custom endpoint support
- Compatible with S3 API
- Optimized for Cloudflare's edge network

### Local Service (local.service.ts)

Provides local filesystem storage for development:

```typescript
import { LocalService } from "@package/file_storage"

const storage = new FileStorage({
  provider: "local",
  options: {
    storagePath: "./storage",
    publicUrl: "/storage"
  }
})
```

Features:
- Local filesystem storage
- Directory structure maintenance
- Metadata stored in separate .meta.json files
- File walking capabilities
- Development-friendly configuration

Example Local Usage:
```typescript
const localStorage = new LocalService({
  options: {
    storagePath: "./public/uploads",
    publicUrl: "/uploads"
  }
})

// Upload with metadata
await localStorage.uploadFile(
  "documents/report.pdf",
  pdfBuffer,
  {
    contentType: "application/pdf",
    fileName: "Annual Report 2024"
  }
)
```

### Service Factory (factory.ts)

The factory pattern for service instantiation:

```typescript
import { StorageServiceFactory } from "@package/file_storage"

const service = StorageServiceFactory.createService({
  provider: "aws", // or "cloudflare" or "local"
  // provider-specific config
})
```

Features:
- Dynamic provider selection
- Configuration validation
- Error handling for unsupported providers
- Environment-based configuration

### Provider-Specific Features

#### AWS S3
- S3 Select queries:
```typescript
const awsService = new AWSService(config)
const result = await awsService.queryFileContent(
  "data/users.json",
  "SELECT * FROM S3Object[*] s WHERE s.age > 25"
)
```

- Object tagging:
```typescript
const tags = await awsService.getObjectTags("path/to/file.pdf")
```

#### Cloudflare R2
- Edge-optimized uploads:
```typescript
const cloudflareService = new CloudflareService(config)
const url = await cloudflareService.uploadFile(
  "images/profile.jpg",
  imageBuffer,
  {
    contentType: "image/jpeg",
    cacheControl: "public, max-age=31536000"
  }
)
```

#### Local Storage
- Metadata management:
```typescript
const localStorage = new LocalService(config)
await localStorage.uploadFile(
  "data/config.json",
  jsonBuffer,
  {
    contentType: "application/json",
    lastModified: new Date(),
    version: "1.0.0"
  }
)
// Creates both file and config.json.meta.json
```

## Usage Examples

### Basic File Upload

```typescript
const storage = new FileStorage()

// Upload buffer
const buffer = Buffer.from("Hello World")
const url = await storage.uploadFile("hello.txt", buffer, {
  contentType: "text/plain"
})

// Upload base64
const base64 = "data:image/png;base64,iVBORw0KGgo..."
const imageUrl = await storage.uploadFile("image.png", base64)
```

### Audio File Upload with Metadata

```typescript
const storage = new FileStorage()

const audioUrl = await storage.uploadFile(
  "audio/story.mp3",
  audioBuffer,
  {
    contentType: "audio/mpeg",
    title: "Story Title",
    artist: "AI Narrator",
    album: "AI Stories"
  }
)
```

### File Operations

```typescript
const storage = new FileStorage()

// Get file
const file = await storage.getFile("path/to/file.txt")

// Delete file
const deleted = await storage.deleteFile("path/to/file.txt")

// Get signed URL
const signedUrl = await storage.getSignedUrl("private/file.pdf", 3600)

// List files
const files = await storage.listFiles("prefix/")
```

### Using with OpenAI Response

```typescript
import { FileStorage } from "@package/file_storage"

class AudioService {
  private fileStorage: FileStorage

  constructor() {
    this.fileStorage = new FileStorage()
  }

  async uploadFileFromOpenAIResponse(
    fileName: string,
    audioBase64: string,
    metadata: {
      title?: string
      artist?: string
      album?: string
      contentType?: string
    }
  ) {
    return await this.fileStorage.uploadFile(
      fileName,
      audioBase64,
      metadata
    )
  }
}
```

## Configuration

### Environment Variables

```env
# AWS S3
AWS_REGION=us-east-1
AWS_BUCKET_NAME=my-bucket
AWS_ACCESS_KEY_ID=access_key
AWS_SECRET_ACCESS_KEY=secret_key
AWS_PUBLIC_URL=https://my-bucket.s3.amazonaws.com

# Cloudflare R2
CLOUDFLARE_ENDPOINT=https://xxx.r2.cloudflarestorage.com
CLOUDFLARE_BUCKET_NAME=my-bucket
CLOUDFLARE_ACCESS_KEY_ID=access_key
CLOUDFLARE_ACCESS_KEY_SECRET=secret_key
CLOUDFLARE_PUBLIC_URL=https://pub-xxx.r2.dev

# Local Storage
LOCAL_STORAGE_PATH=./storage
LOCAL_PUBLIC_URL=/storage

# Provider Selection
STORAGE_PROVIDER=aws|cloudflare|local
```

## API Reference

### FileStorage Class

```typescript
class FileStorage {
  constructor(config?: StorageConfig)
  
  uploadFile(
    path: string,
    content: string | Buffer,
    metadata?: FileMetadata
  ): Promise<string>
  
  getFile(path: string): Promise<Buffer>
  
  deleteFile(path: string): Promise<boolean>
  
  getSignedUrl(
    path: string,
    expiresIn?: number
  ): Promise<string>
  
  listFiles(prefix?: string): Promise<string[]>
}
```

### Interfaces

```typescript
interface FileMetadata {
  title?: string
  artist?: string
  album?: string
  contentType?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  encoding?: string
  lastModified?: Date
  [key: string]: any
}

interface StorageConfig {
  provider: "aws" | "cloudflare" | "local"
  region?: string
  endpoint?: string
  bucket?: string
  publicUrl?: string
  credentials?: {
    accessKeyId?: string
    secretAccessKey?: string
  }
  options?: Record<string, any>
}
```

## Best Practices

1. **Error Handling**
   - Always wrap storage operations in try-catch blocks
   - Log errors appropriately
   - Implement retry mechanisms for failed operations

2. **File Organization**
   - Use consistent path patterns
   - Implement proper file naming conventions
   - Use prefixes for better organization

3. **Security**
   - Validate file types before upload
   - Use signed URLs for private files
   - Implement proper access controls

4. **Performance**
   - Use appropriate content types
   - Implement caching strategies
   - Consider file compression

5. **Metadata**
   - Include relevant metadata for files
   - Use consistent metadata naming
   - Document custom metadata fields

## Contributing

When contributing to the file_storage package:

1. Follow the established provider interface
2. Add appropriate error handling
3. Include tests for new functionality
4. Update documentation
5. Consider backward compatibility

## License

This package is part of the NextJet project and is subject to its licensing terms. 
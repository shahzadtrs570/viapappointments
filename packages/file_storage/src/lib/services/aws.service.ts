import { S3Service } from "./s3.service"
import { StorageConfig } from "../types"
import { getLogger } from "@package/logger"
import {
  SelectObjectContentCommand,
  GetObjectTaggingCommand,
} from "@aws-sdk/client-s3"
import { FileMetadata } from "../types"

export class AWSService extends S3Service {
  protected readonly logger = getLogger()

  constructor(config: StorageConfig) {
    // Ensure AWS-specific defaults
    if (!config.region) {
      config.region = "us-east-1" // Default AWS region
    }

    // Set default public URL format if not provided
    if (!config.publicUrl && config.bucket) {
      config.publicUrl = `https://${config.bucket}.s3.${config.region}.amazonaws.com`
    }

    super(config)

    // Add AWS-specific validation after super() call
    if (
      !config.credentials?.accessKeyId ||
      !config.credentials?.secretAccessKey
    ) {
      this.logger.error(`AWS credentials are not set`, {
        currentClass: "AWSService",
        currentMethod: "constructor",
      })
      throw new Error("AWS credentials are not set")
    }
  }

  // Method for uploading media files with appropriate content types
  async uploadMediaFile(
    path: string,
    content: Buffer,
    mediaType: "video" | "audio" | "image",
    metadata?: FileMetadata
  ): Promise<string> {
    // Set appropriate content type based on file extension
    const extension = path.split(".").pop()?.toLowerCase() || ""
    let contentType = ""

    if (mediaType === "video") {
      contentType = this.getVideoContentType(extension)
    } else if (mediaType === "audio") {
      contentType = this.getAudioContentType(extension)
    } else if (mediaType === "image") {
      contentType = this.getImageContentType(extension)
    }

    // Merge with provided metadata
    const updatedMetadata = {
      ...metadata,
      contentType:
        contentType || metadata?.contentType || "application/octet-stream",
    }

    // Use standard upload method
    return this.uploadFile(path, content, updatedMetadata)
  }

  // Override the uploadFile method to add AWS-specific functionality
  async uploadFile(
    path: string,
    content: Buffer,
    metadata?: FileMetadata
  ): Promise<string> {
    // Add AWS-specific pre-processing if needed
    this.logger.info(`Uploading file to AWS S3: ${path}`, {
      currentClass: "AWSService",
      currentMethod: "uploadFile",
    })

    // Call the parent implementation
    return super.uploadFile(path, content, metadata)
  }

  // AWS-specific method to query data using S3 Select
  async queryFileContent(
    path: string,
    query: string,
    inputFormat: "CSV" | "JSON" | "Parquet" = "JSON"
  ): Promise<any> {
    try {
      const command = new SelectObjectContentCommand({
        Bucket: this.bucket,
        Key: path,
        Expression: query,
        ExpressionType: "SQL",
        InputSerialization: {
          [inputFormat]: {},
          CompressionType: "NONE",
        },
        OutputSerialization: {
          JSON: {},
        },
      })

      const response = await this.s3.send(command)
      let result = ""

      // Process the event stream in the response
      if (response.Payload) {
        for await (const event of response.Payload) {
          if (event.Records && event.Records.Payload) {
            result += Buffer.from(event.Records.Payload).toString()
          }
        }
      }

      return JSON.parse(result)
    } catch (error) {
      this.logger.error(`Error querying file with S3 Select: ${path}`, {
        error: error instanceof Error ? error.message : String(error),
        currentClass: "AWSService",
        currentMethod: "queryFileContent",
      })
      throw error
    }
  }

  // Add a method to get object tags
  async getObjectTags(path: string): Promise<Record<string, string>> {
    try {
      const command = new GetObjectTaggingCommand({
        Bucket: this.bucket,
        Key: path,
      })

      const response = await this.s3.send(command)
      const tags: Record<string, string> = {}

      if (response.TagSet) {
        for (const tag of response.TagSet) {
          if (tag.Key && tag.Value) {
            tags[tag.Key] = tag.Value
          }
        }
      }

      return tags
    } catch (error) {
      this.logger.error(`Error getting object tags: ${path}`, {
        error: error instanceof Error ? error.message : String(error),
        currentClass: "AWSService",
        currentMethod: "getObjectTags",
      })
      return {}
    }
  }

  // Helper methods for content type detection
  private getVideoContentType(extension: string): string {
    const videoTypes: Record<string, string> = {
      mp4: "video/mp4",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      wmv: "video/x-ms-wmv",
      flv: "video/x-flv",
      webm: "video/webm",
      mkv: "video/x-matroska",
    }
    return videoTypes[extension] || "video/mp4"
  }

  private getAudioContentType(extension: string): string {
    const audioTypes: Record<string, string> = {
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      flac: "audio/flac",
      aac: "audio/aac",
      m4a: "audio/mp4",
    }
    return audioTypes[extension] || "audio/mpeg"
  }

  private getImageContentType(extension: string): string {
    const imageTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      bmp: "image/bmp",
      tiff: "image/tiff",
    }
    return imageTypes[extension] || "image/jpeg"
  }
}

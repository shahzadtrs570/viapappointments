import { getLogger } from "@package/logger"
import {
  FileMetadata,
  StorageConfig,
  StorageProvider,
  StorageServiceInterface,
} from "./types"
import { StorageServiceFactory } from "./factory"

export class FileStorage {
  private service: StorageServiceInterface | null = null
  private config: StorageConfig | null = null
  private logger = getLogger()

  constructor(config?: StorageConfig) {
    // Store config but don't initialize service yet
    this.config = config || null
  }

  // Lazy initialization of the service
  private getService(): StorageServiceInterface {
    if (!this.service) {
      const config = this.config || this.loadConfigFromEnv()
      this.service = StorageServiceFactory.createService(config)
    }
    return this.service
  }

  private loadConfigFromEnv(): StorageConfig {
    const provider = (process.env.STORAGE_PROVIDER ||
      "cloudflare") as StorageProvider

    // Base config with provider
    const config: StorageConfig = { provider }

    // Add provider-specific config
    switch (provider) {
      case "cloudflare":
        config.endpoint = process.env.CLOUDFLARE_ENDPOINT
        config.bucket = process.env.CLOUDFLARE_BUCKET_NAME
        config.publicUrl = process.env.CLOUDFLARE_PUBLIC_URL
        config.credentials = {
          accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
          secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY_SECRET,
        }
        break

      case "aws":
        config.region = process.env.AWS_REGION
        config.bucket = process.env.AWS_BUCKET_NAME
        config.publicUrl = process.env.AWS_PUBLIC_URL
        config.credentials = {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
        break

      case "local":
        config.options = {
          storagePath: process.env.LOCAL_STORAGE_PATH || "./storage",
          publicUrl: process.env.LOCAL_PUBLIC_URL || "/storage",
        }
        break

      // Add more providers as needed
    }

    return config
  }

  async uploadFile(
    path: string,
    content: string | Buffer,
    metadata?: FileMetadata
  ): Promise<string> {
    try {
      // Convert base64 string to buffer if needed
      let buffer: Buffer
      if (typeof content === "string" && content.startsWith("data:")) {
        const matches = content.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
        if (matches && matches.length === 3) {
          const contentType = matches[1]
          const base64Data = matches[2]
          buffer = Buffer.from(base64Data, "base64")

          // Add content type to metadata if not already present
          if (metadata && !metadata.contentType) {
            metadata.contentType = contentType
          }
        } else {
          buffer = Buffer.from(content, "base64")
        }
      } else if (typeof content === "string") {
        buffer = Buffer.from(content, "base64")
      } else {
        buffer = content
      }

      // Process metadata for specific file types
      if (
        metadata?.contentType === "audio/mpeg" &&
        (metadata.title || metadata.artist || metadata.album)
      ) {
        buffer = this.addMetadataToAudio(buffer, metadata)
      }

      return await this.getService().uploadFile(path, buffer, metadata)
    } catch (error) {
      this.logger.error(`Error uploading file: ${path}`, {
        error: error instanceof Error ? error.message : String(error),
        currentClass: "FileStorage",
        currentMethod: "uploadFile",
      })
      throw error
    }
  }

  async getFile(path: string): Promise<Buffer> {
    return this.getService().getFile(path)
  }

  async deleteFile(path: string): Promise<boolean> {
    return this.getService().deleteFile(path)
  }

  async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    return this.getService().getSignedUrl(path, expiresIn)
  }

  async listFiles(prefix?: string): Promise<string[]> {
    return this.getService().listFiles(prefix)
  }

  private addMetadataToAudio(buffer: Buffer, metadata: FileMetadata): Buffer {
    try {
      const NodeID3 = require("node-id3")
      const tags = {
        title: metadata.title || "Unknown Title",
        artist: metadata.artist || "AI Generated",
        album: metadata.album || "AI Stories",
      }
      return NodeID3.write(tags, buffer)
    } catch (error) {
      this.logger.warn(`Failed to add ID3 tags to audio file`, {
        error: error instanceof Error ? error.message : String(error),
      })
      return buffer
    }
  }
}

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getLogger } from "@package/logger"
import { FileMetadata, StorageConfig, StorageServiceInterface } from "../types"

// Keep track of when we've logged warnings about missing configuration
const hasLoggedCredentialsWarning = { value: false }
const hasLoggedBucketWarning = { value: false }

export class CloudflareService implements StorageServiceInterface {
  private s3: S3Client
  private bucket: string
  private publicUrl: string
  private logger = getLogger()

  constructor(config: StorageConfig) {
    if (
      !config.endpoint ||
      !config.credentials?.accessKeyId ||
      !config.credentials?.secretAccessKey
    ) {
      // Only log the error once per session to avoid spamming the console
      if (!hasLoggedCredentialsWarning.value) {
        this.logger.error(`Cloudflare credentials are not set`, {
          currentClass: "CloudflareService",
          currentMethod: "constructor",
        })

        if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
          console.log(
            "Cloudflare credentials are not set, using placeholder values"
          )
        }

        hasLoggedCredentialsWarning.value = true
      }

      config.endpoint = ""
      config.credentials = {
        accessKeyId: "",
        secretAccessKey: "",
      }
      config.bucket = ""
      config.publicUrl = ""
    }

    if (!config.bucket || !config.publicUrl) {
      // Only log the error once per session
      if (!hasLoggedBucketWarning.value) {
        this.logger.error(`Cloudflare bucket configuration is not set`, {
          currentClass: "CloudflareService",
          currentMethod: "constructor",
        })

        if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
          console.log(
            "Cloudflare bucket configuration is not set, using placeholder values"
          )
        }

        hasLoggedBucketWarning.value = true
      }

      config.bucket = ""
      config.publicUrl = ""
    }

    this.bucket = config.bucket
    this.publicUrl = config.publicUrl

    this.s3 = new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.credentials.accessKeyId || "",
        secretAccessKey: config.credentials.secretAccessKey || "",
      },
    })
  }

  async uploadFile(
    path: string,
    content: Buffer,
    metadata?: FileMetadata
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: path,
      Body: content,
      ContentType: metadata?.contentType || "application/octet-stream",
      ContentDisposition: `attachment; filename=${path.split("/").pop()}`,
      Metadata: this.flattenMetadata(metadata),
    })

    await this.s3.send(command)
    return `${this.publicUrl}/${path}`
  }

  async getFile(path: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: path,
    })

    const response = await this.s3.send(command)
    const chunks: Uint8Array[] = []

    if (response.Body) {
      // @ts-ignore - ReadableStream type issues
      for await (const chunk of response.Body) {
        chunks.push(chunk)
      }
    }

    return Buffer.concat(chunks)
  }

  async deleteFile(path: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      })

      await this.s3.send(command)
      return true
    } catch (error) {
      this.logger.error(`Error deleting file: ${path}`, {
        error: error instanceof Error ? error.message : String(error),
      })
      return false
    }
  }

  async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: path,
    })

    return getSignedUrl(this.s3, command, { expiresIn })
  }

  async listFiles(prefix?: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    })

    const response = await this.s3.send(command)
    return (response.Contents || []).map((item): string => item.Key || "")
  }

  private flattenMetadata(
    metadata?: FileMetadata
  ): Record<string, string> | undefined {
    if (!metadata) return undefined

    const result: Record<string, string> = {}

    for (const [key, value] of Object.entries(metadata)) {
      if (value !== undefined && value !== null) {
        result[key] = String(value)
      }
    }

    return result
  }
}

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

export class S3Service implements StorageServiceInterface {
  protected s3: S3Client
  protected bucket: string
  private publicUrl: string
  protected readonly logger = getLogger()

  constructor(config: StorageConfig) {
    if (
      !config.region ||
      !config.credentials?.accessKeyId ||
      !config.credentials?.secretAccessKey
    ) {
      this.logger.error(`S3 credentials are not set`, {
        currentClass: "S3Service",
        currentMethod: "constructor",
      })
      throw new Error("S3 credentials are not set")
    }

    if (!config.bucket) {
      this.logger.error(`S3 bucket configuration is not set`, {
        currentClass: "S3Service",
        currentMethod: "constructor",
      })
      throw new Error("S3 bucket configuration is not set")
    }

    this.bucket = config.bucket
    this.publicUrl =
      config.publicUrl ||
      `https://${config.bucket}.s3.${config.region}.amazonaws.com`

    this.s3 = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.credentials.accessKeyId,
        secretAccessKey: config.credentials.secretAccessKey,
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

  protected flattenMetadata(
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

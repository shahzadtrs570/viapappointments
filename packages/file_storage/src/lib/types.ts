export interface FileMetadata {
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

export interface StorageConfig {
  provider: StorageProvider
  region?: string
  endpoint?: string
  bucket?: string
  publicUrl?: string
  credentials?: {
    accessKeyId?: string
    secretAccessKey?: string
    apiKey?: string
  }
  options?: Record<string, any>
}

export type StorageProvider = "aws" | "cloudflare" | "local" | "gcp" | "azure"

export interface StorageServiceInterface {
  uploadFile(
    path: string,
    content: Buffer,
    metadata?: FileMetadata
  ): Promise<string>
  getFile(path: string): Promise<Buffer>
  deleteFile(path: string): Promise<boolean>
  getSignedUrl(path: string, expiresIn?: number): Promise<string>
  listFiles(prefix?: string): Promise<string[]>
}

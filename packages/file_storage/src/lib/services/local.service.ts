import fs from "fs"
import path from "path"
import { promisify } from "util"
import { getLogger } from "@package/logger"
import { FileMetadata, StorageConfig, StorageServiceInterface } from "../types"

// Promisify fs functions
const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const unlink = promisify(fs.unlink)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

export class LocalService implements StorageServiceInterface {
  private storagePath: string
  private publicUrl: string
  private logger = getLogger()

  constructor(config: StorageConfig) {
    if (!config.options?.storagePath) {
      this.logger.error(`Local storage path is not set`, {
        currentClass: "LocalService",
        currentMethod: "constructor",
      })
      throw new Error("Local storage path is not set")
    }

    this.storagePath = config.options.storagePath
    this.publicUrl = config.options.publicUrl || "/storage"

    // Ensure storage directory exists
    this.ensureDirectoryExists(this.storagePath)
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await mkdir(dirPath, { recursive: true })
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
        throw error
      }
    }
  }

  async uploadFile(
    filePath: string,
    content: Buffer,
    metadata?: FileMetadata
  ): Promise<string> {
    try {
      const fullPath = path.join(this.storagePath, filePath)
      const directory = path.dirname(fullPath)

      // Ensure directory exists
      await this.ensureDirectoryExists(directory)

      // Write file
      await writeFile(fullPath, content)

      // If metadata exists, store it in a separate JSON file
      if (metadata) {
        await writeFile(
          `${fullPath}.meta.json`,
          JSON.stringify(metadata, null, 2)
        )
      }

      return `${this.publicUrl}/${filePath}`
    } catch (error) {
      this.logger.error(`Error uploading file: ${filePath}`, {
        error: error instanceof Error ? error.message : String(error),
        currentClass: "LocalService",
        currentMethod: "uploadFile",
      })
      throw error
    }
  }

  async getFile(filePath: string): Promise<Buffer> {
    try {
      const fullPath = path.join(this.storagePath, filePath)
      return await readFile(fullPath)
    } catch (error) {
      this.logger.error(`Error reading file: ${filePath}`, {
        error: error instanceof Error ? error.message : String(error),
        currentClass: "LocalService",
        currentMethod: "getFile",
      })
      throw error
    }
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.storagePath, filePath)
      await unlink(fullPath)

      // Try to delete metadata file if it exists
      try {
        await unlink(`${fullPath}.meta.json`)
      } catch (error) {
        // Ignore errors if metadata file doesn't exist
      }

      return true
    } catch (error) {
      this.logger.error(`Error deleting file: ${filePath}`, {
        error: error instanceof Error ? error.message : String(error),
        currentClass: "LocalService",
        currentMethod: "deleteFile",
      })
      return false
    }
  }

  async getSignedUrl(
    filePath: string,
    expiresIn: number = 3600
  ): Promise<string> {
    // Local files don't need signed URLs, but we could implement a token-based system
    // For now, just return the public URL
    return `${this.publicUrl}/${filePath}`
  }

  async listFiles(prefix?: string): Promise<string[]> {
    try {
      const results: string[] = []
      const basePath = prefix
        ? path.join(this.storagePath, prefix)
        : this.storagePath

      // Ensure the directory exists
      try {
        await stat(basePath)
      } catch (error) {
        return [] // Directory doesn't exist, return empty array
      }

      await this.walkDirectory(basePath, results, prefix || "")

      return results
    } catch (error) {
      this.logger.error(`Error listing files`, {
        error: error instanceof Error ? error.message : String(error),
        currentClass: "LocalService",
        currentMethod: "listFiles",
      })
      return []
    }
  }

  private async walkDirectory(
    dirPath: string,
    results: string[],
    prefix: string
  ): Promise<void> {
    const files = await readdir(dirPath, { withFileTypes: true })

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name)
      const relativePath = path.relative(this.storagePath, fullPath)

      if (file.isDirectory()) {
        await this.walkDirectory(fullPath, results, prefix)
      } else if (!file.name.endsWith(".meta.json")) {
        // Skip metadata files
        results.push(relativePath)
      }
    }
  }
}

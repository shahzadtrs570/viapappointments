import { FileStorage } from "@package/file_storage"
import { getLogger } from "@package/logger"
import { TRPCError } from "@trpc/server"

class FileUploadService {
  private fileStorage = new FileStorage()
  private logger = getLogger()

  async uploadFile({
    fileName,
    base64,
    metadata,
  }: {
    fileName: string
    base64: string
    metadata: {
      contentType?: string
      title?: string
      artist?: string
      album?: string
    }
  }) {
    try {
      const url = await this.fileStorage.uploadFile(fileName, base64, metadata)
      return { url }
    } catch (error) {
      await this.logger.error("Failed to upload file", {
        error: error instanceof Error ? error.message : String(error),
        currentClass: "FileUploadService",
        currentMethod: "uploadFile",
        currentFile: "fileUpload.service.ts",
      })
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload file",
      })
    }
  }
}

export const fileUploadService = new FileUploadService()

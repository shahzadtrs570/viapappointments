/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-params */
import { FileStorage } from "@package/file_storage"
import { TRPCError } from "@trpc/server"

import type { PropertyDetails } from "../types"

import { DetailsRepository } from "../repository/details.repository"

interface FileUpload {
  filename: string
  contentType: string
  buffer: Buffer
}

interface DocumentUpload {
  propertyId: string
  documentType: string
  file: FileUpload
}

export class DetailsService {
  private repository: DetailsRepository
  private fileStorage: FileStorage

  constructor() {
    this.repository = new DetailsRepository()
    this.fileStorage = new FileStorage()
  }

  async create(data: PropertyDetails) {
    // Add any business logic/validation here
    return this.repository.create(data)
  }

  async update(id: string, data: PropertyDetails) {
    // Add any business logic/validation here
    return this.repository.update(id, data)
  }

  async get(id: string) {
    return this.repository.get(id)
  }

  async delete(id: string) {
    return this.repository.delete(id)
  }

  // Add helper function for file path generation
  private getStoragePath(
    propertyId: string,
    filename: string,
    type: "documents" | "photos",
    userId?: string,
    docId?: string
  ): string {
    const envPrefix =
      process.env.NEXT_PUBLIC_APP_ENV === "development" ? "dev" : "prod"

    // If userId and docId are provided for documents, include them in the path
    if (type === "documents" && userId && docId) {
      return `${envPrefix}/properties/${propertyId}/${type}/${userId}/${docId}/${filename}`
    }

    // Otherwise use the original path format
    return `${envPrefix}/properties/${propertyId}/${type}/${filename}`
  }

  async uploadPropertyPhoto(propertyId: string, file: FileUpload) {
    try {
      // First create the document record to get an ID
      const photo = await this.repository.addPropertyPhoto(propertyId, {
        filename: file.filename,
        fileUrl: "", // Temporary empty URL
        contentType: file.contentType,
      })

      // Use the document ID from the database
      const storagePath = this.getStoragePath(
        propertyId,
        file.filename,
        "photos",
        "system", // System upload default
        photo.id // Use actual document ID from database
      )

      // Upload to storage
      const fileUrl = await this.fileStorage.uploadFile(
        storagePath,
        file.buffer,
        {
          contentType: file.contentType,
          fileName: file.filename,
        }
      )

      // Update the document record with the actual URL
      const updatedPhoto = await this.repository.updateDocumentUrl(
        photo.id,
        fileUrl
      )

      return updatedPhoto
    } catch (error) {
      console.error("Error uploading property photo:", error)
      throw error
    }
  }

  async uploadPropertyDocument(propertyId: string, file: FileUpload) {
    try {
      // First create a document record to get an ID
      const document = await this.repository.createDocument({
        propertyId,
        filename: file.filename,
        fileUrl: "", // Temporary empty URL
        documentType: "OTHER",
        uploadedById: "system", // System user ID
      })

      // Use the document ID from the database
      const storagePath = this.getStoragePath(
        propertyId,
        file.filename,
        "documents",
        "system", // System upload default
        document.id // Use actual document ID
      )

      // Upload to storage
      const fileUrl = await this.fileStorage.uploadFile(
        storagePath,
        file.buffer,
        {
          contentType: file.contentType,
          fileName: file.filename,
        }
      )

      // Update the document with the actual URL
      const updatedDocument = await this.repository.updateDocumentUrl(
        document.id,
        fileUrl
      )

      return updatedDocument
    } catch (error) {
      console.error("Error uploading property document:", error)
      throw error
    }
  }

  async deletePropertyPhoto(propertyId: string, photoId: string) {
    try {
      const photo = await this.repository.getPropertyPhoto(photoId)
      if (!photo) {
        throw new Error("Photo not found")
      }

      // Delete from storage using the full path from fileUrl
      const urlPath = new URL(photo.fileUrl).pathname
      const storagePath = urlPath.split("/").slice(2).join("/") // Remove the first empty segment and domain
      await this.fileStorage.deleteFile(storagePath)

      // Delete from database
      return this.repository.deletePropertyPhoto(photoId)
    } catch (error) {
      console.error("Error deleting property photo:", error)
      throw error
    }
  }

  async deletePropertyDocument(propertyId: string, documentId: string) {
    try {
      const document = await this.repository.getPropertyDocument(documentId)
      if (!document) {
        throw new Error("Document not found")
      }

      // Delete from storage using the full path from fileUrl
      const urlPath = new URL(document.fileUrl).pathname
      const storagePath = urlPath.split("/").slice(2).join("/") // Remove the first empty segment and domain
      await this.fileStorage.deleteFile(storagePath)

      // Delete from database
      return this.repository.deletePropertyDocument(documentId)
    } catch (error) {
      console.error("Error deleting property document:", error)
      throw error
    }
  }

  async uploadDocument(data: DocumentUpload, userId: string) {
    try {
      // First create the document record in database to get a document ID
      const document = await this.repository.createDocument({
        propertyId: data.propertyId,
        documentType: data.documentType,
        filename: data.file.filename,
        fileUrl: "", // Temporary empty URL to be updated
        uploadedById: userId,
      })

      // Now use the generated document ID from the database
      const storagePath = this.getStoragePath(
        data.propertyId,
        data.file.filename,
        "documents",
        userId,
        document.id // Use actual document ID from database
      )

      // Upload file to Cloudflare
      const fileUrl = await this.fileStorage.uploadFile(
        storagePath,
        data.file.buffer,
        {
          contentType: data.file.contentType,
          fileName: data.file.filename,
        }
      )

      // Update the document record with the actual file URL
      const updatedDocument = await this.repository.updateDocumentUrl(
        document.id,
        fileUrl
      )

      return updatedDocument
    } catch (error) {
      console.error("Error uploading document:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload document",
      })
    }
  }

  async removeDocument(documentId: string, userId: string) {
    try {
      // Get document details
      const document = await this.repository.getDocument(documentId)

      if (!document) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        })
      }

      // Delete document record from database
      await this.repository.deleteDocument(documentId)

      return { success: true }
    } catch (error) {
      console.error("Error removing document:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove document",
      })
    }
  }

  async getByUserId(userId: string) {
    return this.repository.getByUserId(userId)
  }
}

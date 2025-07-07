/* eslint-disable @typescript-eslint/no-explicit-any */

import { db, Prisma, PropertyCondition, PropertyType } from "@package/db"

import type { PropertyDetails } from "../types"

import {
  dateToEncryptedString,
  encryptedStringToDate,
  encryptedStringToFloat,
  encryptedStringToInt,
  encryptedStringToStringArray,
  parseInputToEncryptedFloat,
  parseInputToEncryptedInt,
  safeEncryptedStringToFloat,
  stringArrayToEncryptedString,
} from "../../../../../utils/encryptionUtils"

interface PropertyPhoto {
  filename: string
  fileUrl: string
  contentType: string
}

interface PropertyDocument {
  propertyId: string
  documentType: string
  filename: string
  fileUrl: string
  uploadedById: string
}

// Type for the decrypted property document data
interface DecryptedPropertyDocument {
  id: string
  propertyId: string
  documentType: string
  filename: string
  fileUrl: string
  verified: boolean
  uploadedById: string
  createdAt: Date
  updatedAt: Date
}

// Type for the decrypted property data returned by the API
interface DecryptedProperty {
  id: string
  propertyType: PropertyType
  bedroomCount: number
  bathroomCount: number
  totalAreaSqM: number
  condition: PropertyCondition
  estimatedValue: number
  confirmedValue: number | null
  yearBuilt: string | null
  features: string[]
  leaseLength: string | null
  userId: string
  showDocumentUpload: boolean | null
  createdAt: Date
  updatedAt: Date
  address?: {
    id: string
    streetLine1: string
    streetLine2: string | null
    city: string
    state: string | null
    postalCode: string
    country: string
    addressData: any
    createdAt: Date
    updatedAt: Date
  } | null
  sellerProperties?: any[]
  propertyDocuments?: DecryptedPropertyDocument[]
}

export class DetailsRepository {
  /**
   * Transform encrypted property document data back to expected API format
   */
  private transformPropertyDocumentForAPI(
    document: any
  ): DecryptedPropertyDocument {
    return {
      ...document,
      documentType: document.documentType, // Already decrypted by prisma-field-encryption
      filename: document.filename, // Already decrypted by prisma-field-encryption
      fileUrl: document.fileUrl, // Already decrypted by prisma-field-encryption
      createdAt: encryptedStringToDate(document.createdAt),
      updatedAt: encryptedStringToDate(document.updatedAt),
    }
  }

  /**
   * Transform encrypted property data back to expected API format
   */
  private transformPropertyForAPI(property: any): DecryptedProperty {
    return {
      ...property,
      bedroomCount: encryptedStringToInt(property.bedroomCount),
      bathroomCount: encryptedStringToInt(property.bathroomCount),
      totalAreaSqM: encryptedStringToFloat(property.totalAreaSqM),
      estimatedValue: encryptedStringToFloat(property.estimatedValue),
      confirmedValue: safeEncryptedStringToFloat(property.confirmedValue),
      features: encryptedStringToStringArray(property.features),
      propertyDocuments: property.propertyDocuments?.map((doc: any) =>
        this.transformPropertyDocumentForAPI(doc)
      ),
    }
  }

  async create(data: PropertyDetails) {
    try {
      const encryptedBedrooms = parseInputToEncryptedInt(data.bedrooms)
      const encryptedBathrooms = parseInputToEncryptedInt(data.bathrooms)
      const encryptedPropertySize = parseInputToEncryptedFloat(
        data.propertySize
      )
      const encryptedEstimatedValue = parseInputToEncryptedFloat(
        data.estimatedValue
      )
      const encryptedConfirmedValue = data.confirmedValue
        ? parseInputToEncryptedFloat(data.confirmedValue)
        : null

      // Create property transaction with owner-property relationships
      return db.$transaction(async (tx) => {
        // Create the property
        const property = await tx.property.create({
          data: {
            propertyType: this.mapPropertyType(data.propertyType),
            bedroomCount: encryptedBedrooms as any,
            bathroomCount: encryptedBathrooms as any,
            totalAreaSqM: encryptedPropertySize as any,
            condition: this.mapPropertyCondition(data.condition),
            estimatedValue: encryptedEstimatedValue as any,
            confirmedValue: encryptedConfirmedValue as any,
            yearBuilt: data.yearBuilt || null,
            features: stringArrayToEncryptedString(data.features || []) as any,
            leaseLength:
              data.propertyStatus === "leasehold" ? data.leaseLength : null,
            userId: data.userId,
            showDocumentUpload: data.showDocumentUpload,
            address: {
              create: {
                streetLine1: data.address,
                city: data.town,
                postalCode: data.postcode,
                state: data.county || null,
                country: "GB",
                addressData: data.fullAddressData
                  ? data.fullAddressData
                  : Prisma.JsonNull,
              },
            },
          },
        })

        // Create seller-property relationships if owner IDs are provided
        if (data.ownerIds && data.ownerIds.length > 0) {
          const ownershipPercentage = 100 / data.ownerIds.length // Equal distribution by default

          await Promise.all(
            data.ownerIds.map((sellerId) =>
              tx.sellerProperty.create({
                data: {
                  sellerId,
                  propertyId: property.id,
                  ownershipPercentage,
                },
              })
            )
          )
        }

        return property
      })
    } catch (error) {
      console.error("Error during property creation:", error)
      throw error
    }
  }

  async update(id: string, data: PropertyDetails) {
    try {
      const encryptedBedrooms = parseInputToEncryptedInt(data.bedrooms)
      const encryptedBathrooms = parseInputToEncryptedInt(data.bathrooms)
      const encryptedPropertySize = parseInputToEncryptedFloat(
        data.propertySize
      )
      const encryptedEstimatedValue = parseInputToEncryptedFloat(
        data.estimatedValue
      )
      const encryptedConfirmedValue = data.confirmedValue
        ? parseInputToEncryptedFloat(data.confirmedValue)
        : null

      // Update property and owner-property relationships in a transaction
      return db.$transaction(async (tx) => {
        // Update the property
        const property = await tx.property.update({
          where: { id },
          data: {
            propertyType: this.mapPropertyType(data.propertyType),
            bedroomCount: encryptedBedrooms as any,
            bathroomCount: encryptedBathrooms as any,
            totalAreaSqM: encryptedPropertySize as any,
            condition: this.mapPropertyCondition(data.condition),
            estimatedValue: encryptedEstimatedValue as any,
            confirmedValue: encryptedConfirmedValue as any,
            yearBuilt: data.yearBuilt || null,
            features: stringArrayToEncryptedString(data.features || []) as any,
            leaseLength:
              data.propertyStatus === "leasehold" ? data.leaseLength : null,
            userId: data.userId,
            showDocumentUpload: data.showDocumentUpload,
            address: {
              update: {
                streetLine1: data.address,
                city: data.town,
                postalCode: data.postcode,
                state: data.county || null,
                country: "GB",
                addressData: data.fullAddressData
                  ? data.fullAddressData
                  : Prisma.JsonNull,
              },
            },
          },
        })

        // Update seller-property relationships if owner IDs are provided
        if (data.ownerIds && data.ownerIds.length > 0) {
          // Delete existing relationships
          await tx.sellerProperty.deleteMany({
            where: { propertyId: id },
          })

          // Create new relationships
          const ownershipPercentage = 100 / data.ownerIds.length // Equal distribution by default

          await Promise.all(
            data.ownerIds.map((sellerId) =>
              tx.sellerProperty.create({
                data: {
                  sellerId,
                  propertyId: property.id,
                  ownershipPercentage,
                },
              })
            )
          )
        }

        return property
      })
    } catch (error) {
      console.error("Error during property update:", error)
      throw error
    }
  }

  async get(id: string): Promise<DecryptedProperty | null> {
    const property = await db.property.findUnique({
      where: { id },
      include: {
        address: true,
        sellerProperties: {
          include: {
            seller: true,
          },
        },
        propertyDocuments: true,
      },
    })

    if (!property) return null

    return this.transformPropertyForAPI(property)
  }

  async delete(id: string) {
    return db.$transaction(async (tx) => {
      // Delete seller-property relationships first
      await tx.sellerProperty.deleteMany({
        where: { propertyId: id },
      })

      // Delete property documents
      await tx.propertyDocument.deleteMany({
        where: { propertyId: id },
      })

      // Then delete the property
      return tx.property.delete({
        where: { id },
      })
    })
  }

  // New methods for handling photos and documents
  async addPropertyPhoto(propertyId: string, photo: PropertyPhoto) {
    const now = new Date()
    const createdDocument = await db.propertyDocument.create({
      data: {
        propertyId,
        documentType: "PHOTO" as any, // Encrypted by prisma-field-encryption
        filename: photo.filename as any, // Encrypted by prisma-field-encryption
        fileUrl: photo.fileUrl as any, // Encrypted by prisma-field-encryption
        verified: false,
        uploadedById: "system", // You might want to pass the actual user ID
        createdAt: dateToEncryptedString(now) as any,
        updatedAt: dateToEncryptedString(now) as any,
      },
    })
    return this.transformPropertyDocumentForAPI(createdDocument)
  }

  async addPropertyDocument(propertyId: string, document: PropertyDocument) {
    const now = new Date()
    const createdDocument = await db.propertyDocument.create({
      data: {
        propertyId,
        documentType: document.documentType as any, // Encrypted by prisma-field-encryption
        filename: document.filename as any, // Encrypted by prisma-field-encryption
        fileUrl: document.fileUrl as any, // Encrypted by prisma-field-encryption
        verified: false,
        uploadedById: "system", // You might want to pass the actual user ID
        createdAt: dateToEncryptedString(now) as any,
        updatedAt: dateToEncryptedString(now) as any,
      },
    })
    return this.transformPropertyDocumentForAPI(createdDocument)
  }

  async getPropertyPhoto(id: string) {
    const document = await db.propertyDocument.findFirst({
      where: {
        id,
        documentType: "PHOTO",
      },
    })
    return document ? this.transformPropertyDocumentForAPI(document) : null
  }

  async getPropertyDocument(id: string) {
    const document = await db.propertyDocument.findUnique({
      where: { id },
    })
    return document ? this.transformPropertyDocumentForAPI(document) : null
  }

  async deletePropertyPhoto(id: string) {
    const deletedDocument = await db.propertyDocument.delete({
      where: { id },
    })
    return this.transformPropertyDocumentForAPI(deletedDocument)
  }

  async deletePropertyDocument(id: string) {
    const deletedDocument = await db.propertyDocument.delete({
      where: { id },
    })
    return this.transformPropertyDocumentForAPI(deletedDocument)
  }

  async createDocument(data: PropertyDocument) {
    const now = new Date()
    const createdDocument = await db.propertyDocument.create({
      data: {
        propertyId: data.propertyId,
        documentType: data.documentType as any, // Encrypted by prisma-field-encryption
        filename: data.filename as any, // Encrypted by prisma-field-encryption
        fileUrl: data.fileUrl as any, // Encrypted by prisma-field-encryption
        uploadedById: data.uploadedById,
        createdAt: dateToEncryptedString(now) as any,
        updatedAt: dateToEncryptedString(now) as any,
      },
    })
    return this.transformPropertyDocumentForAPI(createdDocument)
  }

  async getDocument(id: string) {
    const document = await db.propertyDocument.findUnique({
      where: { id },
    })
    return document ? this.transformPropertyDocumentForAPI(document) : null
  }

  async deleteDocument(id: string) {
    const deletedDocument = await db.propertyDocument.delete({
      where: { id },
    })
    return this.transformPropertyDocumentForAPI(deletedDocument)
  }

  // Add method to update document URL
  async updateDocumentUrl(id: string, fileUrl: string) {
    const now = new Date()
    const updatedDocument = await db.propertyDocument.update({
      where: { id },
      data: {
        fileUrl: fileUrl as any, // Encrypted by prisma-field-encryption
        updatedAt: dateToEncryptedString(now) as any,
      },
    })
    return this.transformPropertyDocumentForAPI(updatedDocument)
  }

  async getByUserId(userId: string): Promise<DecryptedProperty | null> {
    const property = await db.property.findFirst({
      where: { userId },
      include: {
        address: true,
        sellerProperties: {
          include: {
            seller: true,
          },
        },
        propertyDocuments: true,
      },
    })

    if (!property) return null

    return this.transformPropertyForAPI(property)
  }

  private mapPropertyType(
    type: "house" | "flat" | "bungalow" | "other" | "apartment"
  ): PropertyType {
    const mapping: Record<typeof type, PropertyType> = {
      house: PropertyType.HOUSE,
      flat: PropertyType.APARTMENT,
      apartment: PropertyType.APARTMENT,
      bungalow: PropertyType.BUNGALOW,
      other: PropertyType.OTHER,
    }
    return mapping[type]
  }

  private mapPropertyCondition(
    condition: "excellent" | "good" | "fair" | "needs_renovation"
  ): PropertyCondition {
    const mapping: Record<typeof condition, PropertyCondition> = {
      excellent: PropertyCondition.EXCELLENT,
      good: PropertyCondition.GOOD,
      fair: PropertyCondition.FAIR,
      needs_renovation: PropertyCondition.NEEDS_RENOVATION,
    }
    return mapping[condition]
  }
}

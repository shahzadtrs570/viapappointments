/* eslint-disable import/named */
import { z } from "zod"

import { DetailsService } from "./service/details.service"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../../../trpc"

const propertySchema = z.object({
  propertyType: z.enum(["house", "flat", "bungalow", "other", "apartment"]),
  propertyStatus: z.enum(["freehold", "leasehold"]),
  leaseLength: z.string().optional(),
  bedrooms: z.enum(["1", "2", "3", "4", "5+"]),
  bathrooms: z.enum(["1", "2", "3+"]),
  yearBuilt: z.string(),
  propertySize: z.string(),
  features: z.array(z.string()).optional(),
  address: z.string(),
  postcode: z.string(),
  town: z.string(),
  county: z.string(),
  condition: z.enum(["excellent", "good", "fair", "needs_renovation"]),
  conditionNotes: z.string().optional(),
  estimatedValue: z.string(),
  confirmedValue: z.string().optional(),
  ownerIds: z.array(z.string()).optional(),
  fullAddressData: z.record(z.any()).optional(),
  showDocumentUpload: z.boolean().optional(),
  photos: z
    .array(
      z.object({
        filename: z.string(),
        fileUrl: z.string(),
        contentType: z.string(),
      })
    )
    .optional(),
  documents: z
    .array(
      z.object({
        filename: z.string(),
        fileUrl: z.string(),
        contentType: z.string(),
        documentType: z.string(),
      })
    )
    .optional(),
})

const service = new DetailsService()

// File upload schema
// const fileUploadSchema = z.object({
//   filename: z.string(),
//   contentType: z.string(),
//   buffer: z.instanceof(Buffer),
// })

// Document upload schema
const documentUploadSchema = z.object({
  propertyId: z.string(),
  documentType: z.string(),
  file: z.object({
    filename: z.string(),
    contentType: z.string(),
    data: z.string(), // base64 data
  }),
})

// Document removal schema
const documentRemovalSchema = z.object({
  documentId: z.string(),
})

export const detailsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(propertySchema)
    .mutation(async ({ ctx, input }) => {
      return service.create({
        ...input,
        userId: ctx.session.user.id,
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: propertySchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return service.update(input.id, {
        ...input.data,
        userId: ctx.session.user.id,
      })
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return service.get(input.id)
    }),

  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    return service.getByUserId(ctx.session.user.id)
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return service.delete(input.id)
    }),

  // New procedures for file operations
  uploadPropertyPhoto: publicProcedure
    .input(
      z.object({
        propertyId: z.string(),
        file: z.object({
          filename: z.string(),
          contentType: z.string(),
          buffer: z.instanceof(Buffer),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return service.uploadPropertyPhoto(input.propertyId, input.file)
    }),

  uploadPropertyDocument: publicProcedure
    .input(
      z.object({
        propertyId: z.string(),
        file: z.object({
          filename: z.string(),
          contentType: z.string(),
          buffer: z.instanceof(Buffer),
          documentType: z.enum([
            "PROOF_OF_OWNERSHIP",
            "SURVEY_REPORT",
            "ENERGY_CERTIFICATE",
            "OTHER",
          ]),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return service.uploadPropertyDocument(input.propertyId, input.file)
    }),

  deletePropertyPhoto: publicProcedure
    .input(
      z.object({
        propertyId: z.string(),
        photoId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return service.deletePropertyPhoto(input.propertyId, input.photoId)
    }),

  deletePropertyDocument: publicProcedure
    .input(
      z.object({
        propertyId: z.string(),
        documentId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return service.deletePropertyDocument(input.propertyId, input.documentId)
    }),

  uploadDocument: protectedProcedure
    .input(documentUploadSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new DetailsService()

      // Type-safe access to validated input
      const { propertyId, documentType, file } = input

      // Convert base64 to buffer
      const buffer = Buffer.from(file.data, "base64")

      return service.uploadDocument(
        {
          propertyId,
          documentType,
          file: {
            filename: file.filename,
            contentType: file.contentType,
            buffer: buffer,
          },
        },
        ctx.session.user.id
      )
    }),

  removeDocument: protectedProcedure
    .input(documentRemovalSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new DetailsService()
      return service.removeDocument(input.documentId, ctx.session.user.id)
    }),
})

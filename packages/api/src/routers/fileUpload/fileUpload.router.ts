import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "../../trpc"
import { fileUploadService } from "./service/fileUpload.service"

export const fileUploadRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        base64: z.string(),
        metadata: z.object({
          contentType: z.string().optional(),
          title: z.string().optional(),
          artist: z.string().optional(),
          album: z.string().optional(),
        }),
      })
    )
    .mutation(({ input }) => {
      return fileUploadService.uploadFile(input)
    }),
})

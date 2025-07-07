import { z } from "zod"

export const resourceSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Content is required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type Resource = z.infer<typeof resourceSchema>

export const insertResourceSchema = resourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type NewResourceParams = z.infer<typeof insertResourceSchema>

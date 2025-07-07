import { z } from "zod"

export const embeddingSchema = z.object({
  id: z.string(),
  resourceId: z.string(),
  content: z.string().min(1, "Content is required"),
  embedding: z.any(), // Using any for vector type as zod doesn't have a direct vector type
})

export type Embedding = z.infer<typeof embeddingSchema>

export const insertEmbeddingSchema = embeddingSchema.omit({
  id: true,
})

export type NewEmbeddingParams = z.infer<typeof insertEmbeddingSchema>

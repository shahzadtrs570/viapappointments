"use server"

import { NewResourceParams, insertResourceSchema } from "@package/validations"
import { db } from "@package/db"
import { generateEmbeddings } from "./embedding"
import { randomUUID } from "crypto"

export const createResource = async (input: NewResourceParams) => {
  try {
    // Validate input using the provided schema
    const { content } = insertResourceSchema.parse(input)

    // Create the resource in the database
    const resource = await db.resource.create({
      data: {
        content,
      },
    })

    // Generate embeddings for the resource content
    const embeddings = await generateEmbeddings(content)

    // Map embeddings to match the required format and insert them into the database
    const embeddingData = embeddings.map((embedding) => ({
      resourceId: resource.id,
      content: embedding.content || "", // Ensure content is never null
      embedding: embedding.embedding, // Correct
    }))

    // Insert embeddings using raw SQL (custom logic)
    // Since Prisma doesn't support vector types directly, you need to insert the embeddings manually
    for (const data of embeddingData) {
      // Check if data has all required fields
      if (data.resourceId && data.content && data.embedding) {
        await db.$executeRaw`
          INSERT INTO embeddings (id, resource_id, content, embedding)
          VALUES (${randomUUID()}, ${data.resourceId}, ${data.content}, ${data.embedding})
        `
      }
    }

    return "Resource successfully created and embedded."
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again."
  }
}

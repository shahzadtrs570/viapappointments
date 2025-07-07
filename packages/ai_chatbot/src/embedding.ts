import { embed, embedMany } from "ai"
import { openai } from "@ai-sdk/openai"
import { db } from "@package/db"

const embeddingModel = openai.embedding("text-embedding-ada-002")

const generateChunks = (input: string): string[] => {
  const isMarkdown = /(^|\n)#{1,6}\s|[*_-]{3,}|^\s*[-*+]\s|\n\d+\.\s/.test(
    input
  )

  if (isMarkdown) {
    return input
      .split(/\n{2,}|(?=^#+\s)/gm)
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 30)
  } else {
    return input
      .trim()
      .split(/(?<=[.!?])\s+/)
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 30)
  }
}

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value)
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  })
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }))
}

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ")
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  })
  return embedding
}

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery)

  // Prisma does not support vector search natively.
  // You'll need to use raw SQL here.
  const result = await db.$queryRaw<
    Array<{ content: string; similarity: number }>
  >`
    SELECT 
      content, 
      1 - (embedding <#> ${userQueryEmbedded}::vector) AS similarity
    FROM embeddings
    WHERE (1 - (embedding <#> ${userQueryEmbedded}::vector)) > 0.5
    ORDER BY similarity DESC
    LIMIT 4;
  `

  return result
}

import { generateEmbedding } from "@package/ai_chatbot"
import { authOptions } from "@package/auth"
import { db } from "@package/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

// Define the schema for the request body
const requestSchema = z.object({
  faqs: z.array(
    z.object({
      section: z.string(),
      subsection: z.string().nullable(),
      question: z.string(),
      answer: z.string(),
    })
  ),
  replaceExisting: z.boolean().optional().default(false),
})

// Helper function to delete existing FAQ resources and embeddings
async function deleteExistingFAQResources() {
  // First, identify resource IDs for FAQs
  const resources = await db.resource.findMany({
    where: {
      content: {
        contains: "question",
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  })

  const resourceIds = resources.map((r) => r.id)

  if (resourceIds.length === 0) {
    return 0 // No resources to delete
  }

  // Delete associated embeddings first (due to foreign key constraints)
  await db.embedding.deleteMany({
    where: {
      resourceId: {
        in: resourceIds,
      },
    },
  })

  // Delete the resources
  const result = await db.resource.deleteMany({
    where: {
      id: {
        in: resourceIds,
      },
    },
  })

  return result.count
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate the request body
    const body = await req.json()
    const { faqs, replaceExisting } = requestSchema.parse(body)

    // Delete existing resources if requested
    let deletedCount = 0
    if (replaceExisting) {
      deletedCount = await deleteExistingFAQResources()
    }

    // Process each FAQ
    const results = await Promise.all(
      faqs.map(async (faq) => {
        try {
          // Create the content string that will be embedded
          const content = `
Section: ${faq.section}
${faq.subsection ? `Subsection: ${faq.subsection}` : ""}
Question: ${faq.question}
Answer: ${faq.answer}
`.trim()

          // Create a resource for the FAQ
          const resource = await db.resource.create({
            data: {
              content: JSON.stringify(faq),
            },
          })

          // Generate embedding for the content
          const embedding = await generateEmbedding(content)

          // Store the embedding in the database
          await db.$executeRaw`
            INSERT INTO embeddings (id, resource_id, content, embedding)
            VALUES (gen_random_uuid(), ${resource.id}, ${content}, ${embedding})
          `

          return { success: true, resourceId: resource.id }
        } catch (error) {
          console.error("Error processing FAQ:", error)
          return { success: false, error: "Failed to process FAQ" }
        }
      })
    )

    // Check if all FAQs were processed successfully
    const allSuccessful = results.every((result) => result.success)
    const successCount = results.filter((result) => result.success).length

    if (allSuccessful) {
      return NextResponse.json({
        success: true,
        message: replaceExisting
          ? `Successfully replaced ${deletedCount} and vectorized ${successCount} FAQs`
          : `Successfully vectorized ${successCount} FAQs`,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: `Processed ${successCount} out of ${faqs.length} FAQs`,
        errors: results.filter((result) => !result.success),
      })
    }
  } catch (error) {
    console.error("Error handling request:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to process FAQs" },
      { status: 500 }
    )
  }
}

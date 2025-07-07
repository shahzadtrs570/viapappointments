/* eslint-disable max-depth */
import { randomUUID } from "crypto"

import { openai } from "@ai-sdk/openai"
import { createResource, findRelevantContent } from "@package/ai_chatbot"
import { authOptions } from "@package/auth"
import { db } from "@package/db"
import { streamText, tool } from "ai"
import { getServerSession } from "next-auth"
import { z } from "zod"
// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  const session = await getServerSession(authOptions)
  const startTime = new Date()
  let totalTokens = 0
  let promptTokens = 0
  let completionTokens = 0
  let usageCost = 0
  const inputCostPer1M = 5.0
  const outputCostPer1M = 15.0

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are a helpful assistant for answering customer FAQs. 
    
    When a user asks a question:
    1. Search the FAQ knowledge base using the getInformation tool
    2. If no direct matches are found, the tool will automatically search by section
    3. Format your response professionally and conversationally
    4. If multiple relevant FAQ items are found, combine them into a coherent answer
    5. If no relevant information is found even after section search, respond with "Sorry, I don't know."
    
    Do not invent information that isn't in the knowledge base.`,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your FAQ knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the user's question"),
        }),
        execute: async ({ question }) => {
          // First try direct match
          const directResults = await findRelevantContent(question)
          let resultsToProcess = directResults
          let hasMatchingFAQs = false

          // Check if we have proper FAQ matches
          try {
            for (const item of directResults) {
              if (item.content) {
                try {
                  const faqData = JSON.parse(item.content)
                  if (
                    (faqData.question &&
                      faqData.answer &&
                      faqData.question
                        .toLowerCase()
                        .includes(question.toLowerCase().substring(0, 15))) ||
                    question
                      .toLowerCase()
                      .includes(faqData.question.toLowerCase().substring(0, 15))
                  ) {
                    hasMatchingFAQs = true
                    break
                  }
                } catch (e) {
                  // Not JSON or not FAQ format, continue
                }
              }
            }
          } catch (error) {
            // Error checking, assume no matches
          }

          // If no good matches found from direct question, try searching by potential sections
          if (!hasMatchingFAQs && directResults.length > 0) {
            try {
              // Try to extract potential section information from the first result
              let sectionToSearch = ""

              for (const item of directResults) {
                if (item.content) {
                  try {
                    const faqData = JSON.parse(item.content)
                    if (faqData.section) {
                      sectionToSearch = faqData.section
                      break
                    }
                  } catch (e) {
                    // Continue to next item
                  }
                }
              }

              // If we found a section, search by that section
              if (sectionToSearch) {
                const sectionResults = await findRelevantContent(
                  `section: ${sectionToSearch}`
                )

                if (sectionResults.length > 2) {
                  resultsToProcess = sectionResults
                }
              }
            } catch (error) {
              // If section search fails, use original results
            }
          }

          // Process the results (either direct or section-based)
          try {
            return resultsToProcess.map((item) => {
              if (item.content) {
                try {
                  // Try to parse as JSON in case it's an FAQ resource
                  const faqData = JSON.parse(item.content)
                  if (faqData.question && faqData.answer) {
                    return {
                      ...item,
                      parsedContent: faqData,
                      isDirectMatch: hasMatchingFAQs,
                    }
                  }
                } catch (e) {
                  // Not JSON or not FAQ format, return as is
                }
              }
              return item
            })
          } catch (error) {
            // If anything goes wrong, return original results
            return directResults
          }
        },
      }),
    },
    onFinish: async (completion) => {
      try {
        // Calculate response time
        const endTime = new Date()
        const responseTimeMs = endTime.getTime() - startTime.getTime()
        const responseTime = `${responseTimeMs}ms`

        // Get token counts from the completion
        promptTokens = completion.usage.promptTokens || 0
        completionTokens = completion.usage.completionTokens || 0
        totalTokens = completion.usage.totalTokens || 0

        usageCost =
          (promptTokens / 1_000_000) * inputCostPer1M +
          (completionTokens / 1_000_000) * outputCostPer1M
        usageCost = Number(usageCost.toFixed(6))

        // Save the API call directly using Prisma
        try {
          await db.ai_api_calls.create({
            data: {
              id: randomUUID(),
              userId: session?.user.id || "",
              provider: "openai",
              model: "gpt-4o",
              prompt_string: JSON.stringify(
                messages[messages.length - 1] || {}
              ),
              prompt_tokens: promptTokens,
              completion_tokens: completionTokens,
              total_tokens: totalTokens,
              responseData: completion.text || "",
              response_time: responseTime,
              status_code: 200,
              usage_cost: usageCost,
            },
          })
        } catch (err) {
          console.error("Failed to save AI API call to database:", err)
        }
      } catch (error) {
        console.error("Failed to process AI API call:", error)
      }
    },
  })

  return result.toDataStreamResponse()
}

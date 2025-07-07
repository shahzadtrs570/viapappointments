/* eslint-disable */
import { randomUUID } from "crypto"

import { openai } from "@ai-sdk/openai"
import { createResource, findRelevantContent } from "@package/ai_chatbot"
import { db } from "@package/db"
import { streamText, tool } from "ai"
import { z } from "zod"

import { srenovaPrompt } from "./prompt"
// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Note: The comprehensive FAQ data is now stored in srenova-faq-json.json
// which includes all the specific questions that were previously causing issues:
// - Who instructs the independent valuation?
// - How do I know the valuation is independent?
// - Who pays for the valuation?
// - Will I need to pay rent?
// - Will I need to pay property taxes or insurance?
// - Who pays for property insurance?
// - How many years will I receive monthly payments for?
// - If I die after 10 years you will have paid me only £520k for my home?
// - Can I speak to a real person?
// - How do I schedule a free consultation?
// - What documents will I need to get started?

export async function POST(req: Request) {
  const { messages } = await req.json()
  const startTime = new Date()
  let totalTokens = 0
  let promptTokens = 0
  let completionTokens = 0
  let usageCost = 0
  const inputCostPer1M = 5.0
  const outputCostPer1M = 15.0

  // Check if we should use RAG (vector database) or direct FAQ in prompt
  const useRAG = process.env.SRENOVA_USE_RAG === "true"

  const systemPrompt = useRAG
    ? `You are a helpful, friendly guide at Srenova who specializes in explaining our viager programme to potential customers. Your tone is warm, conversational and reassuring - like a trusted advisor rather than a formal representative.

    When a user asks a question:
    1. First determine if the question is related to Srenova, real estate, property services, or viager arrangements
    2. If the question is clearly unrelated to Srenova (like cars, cooking, entertainment, etc.), respond with: "I'm afraid I can't help with that, but I'd be happy to tell you about our viager programme or answer any questions about how it works"
    3. For Srenova-related questions, search the FAQ knowledge base using the getInformation tool
    4. If no direct matches are found, the tool will automatically search by section
    5. Format your response naturally and conversationally - keep answers brief and friendly (3-5 sentences for most responses)
    6. If multiple relevant FAQ items are found, combine them into a coherent answer
    7. After answering, briefly suggest one related question the person might want to ask
    8. If no relevant information is found for a Srenova-related question, respond with: "Good question, but not one I can answer. Click here to book a time to speak with one of the Srenova team."
    
    Never mention "context," "FAQs," or refer to yourself as an AI assistant. Answer questions naturally as if you simply know about Srenova's viager offering. Use British English spelling and terminology.`
    : srenovaPrompt

  const streamConfig = {
    model: openai("gpt-4o"),
    messages,
    system: systemPrompt,
  }

  // Add tools only if using RAG
  if (useRAG) {
    Object.assign(streamConfig, {
      tools: {
        addResource: tool({
          description: `add a resource to your knowledge base.
            If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
          parameters: z.object({
            content: z
              .string()
              .describe("the content or resource to add to the knowledge base"),
          }),
          execute: ({ content }) => createResource({ content }),
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
                        .includes(
                          faqData.question.toLowerCase().substring(0, 15)
                        )
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
    })
  }

  // Add onFinish handler to streamConfig
  Object.assign(streamConfig, {
    onFinish: async (completion: any) => {
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
              userId: "", // No user ID since we don't use sessions
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

  const result = streamText(streamConfig as any)

  return result.toDataStreamResponse()
}

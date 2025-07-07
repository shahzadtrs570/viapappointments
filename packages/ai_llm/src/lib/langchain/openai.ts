import { ChatOpenAI } from "@langchain/openai"
import { LLMAPI } from "../llmapi"
import { getLogger } from "@package/logger"
import { z } from "zod"
import { aiApiCallsService } from "../../../../api/src/routers/ai_api_calls/service/ai_api_calls.service"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate } from "@langchain/core/prompts"

export class LangChainOpenAI implements LLMAPI {
  private model: ChatOpenAI
  private logger = getLogger()
  private OPENAI_TEXT_MODEL: string

  constructor() {
    const apiKey = process.env.OPENAI_AUTH
    this.OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-4"

    if (!apiKey) {
      this.logger.error(`OPENAI_API_KEY is not set`, {
        app: process.env.NEXT_PUBLIC_APP_NAME,
        env: process.env.NEXT_PUBLIC_APP_ENV,
        error: "OPENAI_API_KEY is not set",
        currentClass: "LangChainOpenAI",
        currentMethod: "constructor",
      })
      throw new Error("OPENAI_API_KEY is not set")
    }

    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: this.OPENAI_TEXT_MODEL,
      temperature: 0.7,
    })
  }

  async generateResponse(
    stringifiedPrompt: string,
    userId?: string,
    AI_LLM_PROVIDER?: "openai" | "anthropic",
    schema?: z.ZodType<any>
  ): Promise<string> {
    const startTime = Date.now()
    let statusCode = 200

    try {
      const prompt = JSON.parse(stringifiedPrompt)

      // Create a chat prompt template
      const chatPrompt = ChatPromptTemplate.fromMessages([["human", prompt]])

      // Create the chain
      const chain = chatPrompt.pipe(this.model).pipe(new StringOutputParser())

      // Invoke the chain
      const response = await chain.invoke({})

      // Calculate metrics
      const endTime = Date.now()
      const responseTimeInSeconds = ((endTime - startTime) / 1000).toFixed(3)

      // Get token usage from the model's last call info
      const usage = await this.model.getNumTokens(prompt)
      const costPerMillionTokens = 0.15
      const convertTokenToMillions = usage / 1000000
      const usage_cost = convertTokenToMillions * costPerMillionTokens

      const wordsAndChars = this.getWordsAndChars(response)
      const promptWordsAndChars = this.getWordsAndChars(prompt)

      if (userId) {
        await aiApiCallsService.createAiApiCall({
          input: {
            id: Date.now().toString(), // LangChain doesn't provide an ID, so we create one
            provider: AI_LLM_PROVIDER || "openai",
            model: this.OPENAI_TEXT_MODEL,
            prompt_string: stringifiedPrompt,
            prompt_tokens: usage,
            completion_tokens: usage, // Approximate as LangChain doesn't split this
            total_tokens: usage,
            responseData: JSON.stringify(response),
            response_time: responseTimeInSeconds,
            status_code: statusCode,
            usage_cost,
            ai_response_words: wordsAndChars.numberOfWords,
            ai_response_chars: wordsAndChars.numberOfCharacters,
            prompt_number_words: promptWordsAndChars.numberOfWords,
            prompt_number_chars: promptWordsAndChars.numberOfCharacters,
          },
          userId,
        })
      }

      return response
    } catch (error) {
      this.logger.error(`Error generating response with LangChain OpenAI`, {
        error: error instanceof Error ? error.message : String(error),
        currentClass: "LangChainOpenAI",
        currentMethod: "generateResponse",
      })
      throw error
    }
  }

  private getWordsAndChars(text: string) {
    const cleanText = text.trim().replace(/\s\s+/g, " ")
    return {
      numberOfWords: cleanText.length > 0 ? cleanText.split(" ").length : 0,
      numberOfCharacters: cleanText.length,
    }
  }
}

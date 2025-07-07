import { ChatAnthropic } from "@langchain/anthropic"
import { LLMAPI } from "../llmapi"
import { getLogger } from "@package/logger"
import { z } from "zod"
import { aiApiCallsService } from "../../../../api/src/routers/ai_api_calls/service/ai_api_calls.service"

export class LangChainAnthropic implements LLMAPI {
  private model: ChatAnthropic
  private logger = getLogger()
  private ANTHROPIC_MODEL: string

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY
    this.ANTHROPIC_MODEL = "claude-3-sonnet-20240229"

    if (!apiKey) {
      this.logger.error(`ANTHROPIC_API_KEY is not set`, {
        app: process.env.NEXT_PUBLIC_APP_NAME,
        env: process.env.NEXT_PUBLIC_APP_ENV,
        error: "ANTHROPIC_API_KEY is not set",
        currentClass: "LangChainAnthropic",
        currentMethod: "constructor",
      })
      throw new Error("ANTHROPIC_API_KEY is not set")
    }

    this.model = new ChatAnthropic({
      anthropicApiKey: apiKey,
      modelName: this.ANTHROPIC_MODEL,
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

      const response = await this.model.invoke([
        {
          role: "user",
          content: typeof prompt === "string" ? prompt : JSON.stringify(prompt),
        },
      ])
      const result =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content)

      // Calculate metrics
      const endTime = Date.now()
      const responseTimeInSeconds = ((endTime - startTime) / 1000).toFixed(3)

      // Get token usage from the model's last call info
      const usage = await this.model.getNumTokens(prompt)
      const costPerMillionTokens = 0.15
      const convertTokenToMillions = usage / 1000000
      const usage_cost = convertTokenToMillions * costPerMillionTokens

      const wordsAndChars = this.getWordsAndChars(result)
      const promptWordsAndChars = this.getWordsAndChars(prompt)

      if (userId) {
        await aiApiCallsService.createAiApiCall({
          input: {
            id: Date.now().toString(),
            provider: AI_LLM_PROVIDER || "anthropic",
            model: this.ANTHROPIC_MODEL,
            prompt_string: stringifiedPrompt,
            prompt_tokens: usage,
            completion_tokens: usage,
            total_tokens: usage,
            responseData: JSON.stringify(result),
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

      return result
    } catch (error) {
      this.logger.error(`Error generating response with LangChain Anthropic`, {
        error: error instanceof Error ? error.message : String(error),
        currentClass: "LangChainAnthropic",
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

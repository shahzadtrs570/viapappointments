// import axios from "axios"
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"

import { aiApiCallsService } from "../../../api/src/routers/ai_api_calls/service/ai_api_calls.service"
import { LLMAPI } from "./llmapi"
import { z } from "zod"
import { getLogger } from "@package/logger"
// Add this interface for type safety

export class OpenAILLM implements LLMAPI {
  // private openaiAxios: any
  private openaii: OpenAI
  private OPENAI_TEXT_MODEL: string
  private OPENAI_API_KEY: string
  private logger = getLogger()

  constructor() {
    this.OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || ""
    this.OPENAI_API_KEY = process.env.OPENAI_AUTH || ""

    if (!this.OPENAI_API_KEY) {
      this.logger.error(`OPENAI_API_KEY is not set`, {
        app: process.env.NEXT_PUBLIC_APP_NAME,
        env: process.env.NEXT_PUBLIC_APP_ENV,
        error: "OPENAI_API_KEY is not set",
        currentClass: "OpenAILLM",
        currentMethod: "constructor",
        currentFile: "openai.ts",
      })
      throw new Error("OPENAI_API_KEY is not set")
    }
    if (!this.OPENAI_TEXT_MODEL) {
      this.logger.error(`OPENAI_TEXT_MODEL is not set`, {
        app: process.env.NEXT_PUBLIC_APP_NAME,
        env: process.env.NEXT_PUBLIC_APP_ENV,
        error: "OPENAI_TEXT_MODEL is not set",
        currentClass: "OpenAILLM",
        currentMethod: "constructor",
        currentFile: "openai.ts",
      })
      throw new Error("OPENAI_TEXT_MODEL is not set")
    }
    // this.openaiAxios = axios.create({
    //   baseURL: "https://api.openai.com/v1",
    //   headers: {
    //     Authorization: `Bearer ${this.OPENAI_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    // })
    this.openaii = // Initialize OpenAI with API Key from environment variable
      new OpenAI({
        apiKey: this.OPENAI_API_KEY,
      })
  }

  safeStringify(obj: any) {
    const seen = new WeakSet()
    return JSON.stringify(obj, function (key, value) {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return // Skip circular reference
        }
        seen.add(value)
      }
      return value
    })
  }

  getWordsAndChars(prompt: string) {
    let numberOfWords = 0
    let numberOfCharacters = 0

    // Remove leading and trailing white space and replace multiple spaces with a single space.
    const promptWithoutExtraWhiteSpace = prompt?.trim().replace(/\s\s+/g, " ")

    if (promptWithoutExtraWhiteSpace?.length > 0) {
      numberOfWords = promptWithoutExtraWhiteSpace.split(" ")?.length

      // Note that this includes spaces, and does not count new lines.
      numberOfCharacters = promptWithoutExtraWhiteSpace?.length
    }

    return {
      numberOfWords,
      numberOfCharacters,
    }
  }

  async generateResponse(
    stringifyedPrompt: string,
    userId?: string,
    AI_LLM_PROVIDER?: "openai" | "anthropic",
    schema?: z.ZodType<any>
  ): Promise<string> {
    if (!schema) {
      throw new Error("Schema is required for OpenAI response parsing")
    }
    try {
      const prompt = JSON.parse(stringifyedPrompt)

      // Start timing the API call
      const startTime = Date.now()

      let statusCode = 200 // Default status code
      let response

      try {
        response = await this.openaii.beta.chat.completions.parse({
          model: this.OPENAI_TEXT_MODEL,
          messages: [{ role: "user", content: prompt }],
          response_format: zodResponseFormat(schema, "event"),
        })
      } catch (apiError: any) {
        // Handle API errors and capture status code
        statusCode = apiError?.status || 500
        throw apiError
      }

      const endTime = Date.now()
      const responseTimeInSeconds = ((endTime - startTime) / 1000).toFixed(3)

      // Access the parsed content directly from response

      const result = response.choices[0]?.message?.content

      if (!result) {
        throw new Error("No content in OpenAI response")
      }

      let parsedContent
      try {
        parsedContent = JSON.parse(result)
      } catch (e) {
        throw new Error("Failed to parse OpenAI response as JSON")
      }

      // here we need to call the ai_api_calls api

      const usage = response.usage || {
        total_tokens: 0,
        prompt_tokens: 0,
        completion_tokens: 0,
      }
      // let processingTime = parseInt(response.headers["openai-processing-ms"])
      const costPerMillionTokens = 0.15
      const convertTokenToMillions = usage.total_tokens / 1000000
      const usage_cost = convertTokenToMillions * costPerMillionTokens

      let wordsAndAlphabetsOfContent = this.getWordsAndChars(
        parsedContent.content
      )

      let wordAndAlphabetsOfPrompt = this.getWordsAndChars(prompt)

      let input = {
        id: response.id,
        userId: userId,
        provider: AI_LLM_PROVIDER || "",
        model: response.model,
        prompt_string: stringifyedPrompt,
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        responseData: this.safeStringify(response),
        status_code: statusCode, // Use the captured status code
        usage_cost,
        response_time: responseTimeInSeconds,

        ai_response_words: wordsAndAlphabetsOfContent.numberOfWords,
        ai_response_chars: wordsAndAlphabetsOfContent.numberOfCharacters,

        prompt_number_words: wordAndAlphabetsOfPrompt.numberOfWords,
        prompt_number_chars: wordAndAlphabetsOfPrompt.numberOfCharacters,
      }

      await aiApiCallsService.createAiApiCall({
        input,

        userId: userId,
      })

      return response.choices[0].message.content?.trim() ?? ""
    } catch (error: any) {
      console.error("OPENAI ERROR", error)
      // Include status code in the error message if available
      const errorMessage = error?.status
        ? `Failed to generate openai response. Status: ${error.status}. Please try again.`
        : "Failed to generate openai response. Please try again."
      throw new Error(errorMessage)
    }
  }
}

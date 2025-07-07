import Anthropic from "@anthropic-ai/sdk"
import { LLMAPI } from "./llmapi"
import { getLogger } from "@package/logger"

export class AnthropicLLM implements LLMAPI {
  private anthropic: Anthropic
  private ANTHROPIC_MODEL: string
  private logger = getLogger()

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      this.logger.error(`ANTHROPIC_API_KEY is not set`, {
        app: process.env.NEXT_PUBLIC_APP_NAME,
        env: process.env.NEXT_PUBLIC_APP_ENV,
        error: "ANTHROPIC_API_KEY is not set",
        currentClass: "AnthropicLLM",
        currentMethod: "constructor",
        currentFile: "anthropic.ts",
      })
      throw new Error("ANTHROPIC_API_KEY is not set")
    }

    this.anthropic = new Anthropic({
      apiKey: apiKey,
    })
    this.ANTHROPIC_MODEL = "claude-3-sonnet-20240229"
  }

  // Rename this fn name to generate llmResponse
  async generateResponse(stringifiedPrompt: string): Promise<string> {
    try {
      const prompt = JSON.parse(stringifiedPrompt)
      const response = await this.anthropic.messages.create({
        model: this.ANTHROPIC_MODEL,
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      })

      // Check if the response content is of a type that has the 'text' property
      const contentBlock = response.content[0]

      if ("text" in contentBlock) {
        return contentBlock.text
      } else {
        throw new Error("The response did not contain a valid 'text' property.")
      }
    } catch (error) {
      console.error("Error generating story with Anthropic:", error)
      throw new Error(
        "Failed to generate story with Anthropic. Please try again."
      )
    }
  }
}

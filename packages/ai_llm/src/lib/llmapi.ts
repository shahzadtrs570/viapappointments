import { z } from "zod"

export interface LLMAPI {
  generateResponse: (
    stringifyedPrompt: string,
    userId?: string,
    AI_LLM_PROVIDER?: "openai" | "anthropic",
    schema?: z.ZodType<any>
  ) => Promise<string>
}

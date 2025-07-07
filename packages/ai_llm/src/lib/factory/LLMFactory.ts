import { LLMAPI } from "../llmapi"
import { OpenAILLM } from "../openai"
import { AnthropicLLM } from "../anthropic"
import { LangChainOpenAI } from "../langchain/openai"
import { LangChainAnthropic } from "../langchain/anthropic"

type ProviderType = "openai" | "anthropic"
type ImplementationType = "default" | "langchain"

export class LLMFactory {
  static createLLM(
    provider: ProviderType,
    implementation: ImplementationType
  ): LLMAPI {
    const key = `${provider}_${implementation}`

    const implementations: Record<string, new () => LLMAPI> = {
      openai_default: OpenAILLM,
      openai_langchain: LangChainOpenAI,
      anthropic_default: AnthropicLLM,
      anthropic_langchain: LangChainAnthropic,
    }

    const LLMClass = implementations[key]
    if (!LLMClass) {
      throw new Error(`Unsupported LLM implementation: ${key}`)
    }

    return new LLMClass()
  }
}

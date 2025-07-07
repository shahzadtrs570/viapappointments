import { LLMAPI } from "./lib/llmapi"
import { LLMFactory } from "./lib/factory/LLMFactory"

type ProviderType = "openai" | "anthropic"
type ImplementationType = "default" | "langchain"

export class AILLM {
  private provider: LLMAPI

  constructor(
    provider: ProviderType = "openai",
    implementation: ImplementationType = "default"
  ) {
    this.provider = LLMFactory.createLLM(provider, implementation)
  }

  // Public method to return the current provider
  getProvider(): LLMAPI {
    return this.provider
  }
}

// To use it:
// const llm = new AILLM("anthropic", "langchain")
// const response = await llm.getProvider().generateResponse(...)

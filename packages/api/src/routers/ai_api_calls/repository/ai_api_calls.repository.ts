import { db } from "@package/db"

import type { CreateAiApiCallData } from "./ai_api_calls.repository.types"

class AiApiCallsRepository {
  public async createAiApiCall(data: CreateAiApiCallData) {
    const response = await db.ai_api_calls.create({
      data: {
        id: data.id,
        userId: data.userId,
        provider: data.provider,
        model: data.model,
        prompt_string: data.prompt_string,
        prompt_tokens: data.prompt_tokens,
        completion_tokens: data.completion_tokens,
        total_tokens: data.total_tokens,
        responseData: data.responseData,
        response_time: data.response_time,
        status_code: data.status_code,
        usage_cost: data.usage_cost,

        ai_response_words: data.ai_response_words,
        ai_response_chars: data.ai_response_chars,

        prompt_number_words: data.prompt_number_words,
        prompt_number_chars: data.prompt_number_chars,
        audio_length_mins: data.audio_length_mins,
      },
    })

    return response
  }

  public async getAiApiCallsByUserId(userId: string) {
    return await db.ai_api_calls.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: "desc",
      },
    })
  }
}

export const aiApiCallsRepository = new AiApiCallsRepository()

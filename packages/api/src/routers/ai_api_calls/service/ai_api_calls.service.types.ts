import type { Ai_api_calls } from "@package/db"

export type CreateAiApiCallArgs = {
  input: {
    id: string
    provider: string
    model: string
    prompt_string: string
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    responseData: string
    response_time: string
    status_code: number
    usage_cost: number

    ai_response_words?: number
    ai_response_chars?: number

    prompt_number_words?: number
    prompt_number_chars?: number
    audio_length_mins?: number
  }
  userId: string | undefined
}

// Use Prisma's built-in Partial type utility
export type UpdateAiApiCallArgs = {
  id: string
  userId: string
  input: Partial<Omit<Ai_api_calls, "id" | "userId" | "createdAt">> // Omit fields that shouldn't be updated
}

export type CreateAiApiCallData = {
  id: string
  userId: string
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

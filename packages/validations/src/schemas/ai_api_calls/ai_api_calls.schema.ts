import { z } from "zod"

export const createAiApiCallSchema = z.object({
  id: z.string(),
  provider: z.string(),
  model: z.string(),
  prompt_string: z.string(),
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
  responseData: z.string(),
  response_time: z.string(),
  status_code: z.number(),
  usage_cost: z.number(),
})

export type CreateAiApiCall = z.infer<typeof createAiApiCallSchema>

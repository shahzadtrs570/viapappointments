import { TRPCError } from "@trpc/server"

import type { CreateAiApiCallArgs } from "./ai_api_calls.service.types"

import { getLogger } from "../../../../../logger/src/lib/logger"
import { aiApiCallsRepository } from "../repository/ai_api_calls.repository"

class AiApiCallsService {
  public async createAiApiCall(args: CreateAiApiCallArgs) {
    const logger = getLogger()
    if (!args.userId) {
      // send error to
      // const error = {
      //   app: "storykraft",
      //   env: "dev/prod",
      //   error: "error message",
      //   params: args,
      //   currentClass: "AiApiCallsService",
      //   currentMethod: "createAiApiCall",
      // }
      await logger.error(`You need to be logged in to create an AI API call.`, {
        app: "storykraft",
        env: process.env.NEXT_PUBLIC_APP_ENV,
        error:
          "You need to be logged in to create an AI API call. userId is not found",
        params: args,
        currentClass: "AiApiCallsService",
        currentMethod: "createAiApiCall",
        currentFile: "ai_api_calls.service.ts",
      })
      throw new TRPCError({
        message: "You need to be logged in to create an AI API call.",
        code: "UNAUTHORIZED",
      })
    }

    return await aiApiCallsRepository.createAiApiCall({
      ...args.input,
      userId: args.userId,
    })
  }

  public async getAiApiCallsByUserId(userId: string) {
    return await aiApiCallsRepository.getAiApiCallsByUserId(userId)
  }
}

export const aiApiCallsService = new AiApiCallsService()

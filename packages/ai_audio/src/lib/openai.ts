import axios, { AxiosInstance, AxiosResponse } from "axios"
import { AudioAPI } from "../index"
import crypto from "crypto"
import { aiApiCallsService } from "../../../api/src/routers/ai_api_calls/service/ai_api_calls.service"
import { parseBuffer, IAudioMetadata } from "music-metadata"
import { getLogger } from "@package/logger"
import { FileStorage } from "@package/file_storage"

export interface AudioGenerationData {
  userId: string
  id: string
  title?: string
  content: string
}

interface AudioDuration {
  minutes: number
  seconds: number
  totalMinutes: number
}

interface AudioResponse {
  audioMP3Object: string
  audioUrl: string
  duration: AudioDuration
}

interface AudioMetadata {
  contentType?: string
  fileName?: string
  title?: string
  artist?: string
  album?: string
}

interface LogApiCallParams {
  response: AxiosResponse
  userId?: string
  AI_AUDIO_PROVIDER: AudioProvider
  model: string
  prompt: string
  responseTimeSeconds: string
  inputTokenEstimate: number
  content: string
  duration: AudioDuration
}

type AudioProvider = "openai" | "elevenlabs"

class AudioDurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AudioDurationError"
  }
}

export class OpenAIAudio implements AudioAPI {
  private openaiAxios: AxiosInstance
  private readonly OPENAI_AUDIO_MODEL: string
  private readonly OPENAI_VOICE: string
  private readonly OPENAI_API_KEY: string
  private logger = getLogger()
  private fileStorage: FileStorage

  constructor() {
    this.OPENAI_API_KEY = process.env.OPENAI_AUTH || ""
    this.OPENAI_AUDIO_MODEL = process.env.OPENAI_AUDIO_MODEL || "tts-1"
    this.OPENAI_VOICE = process.env.OPENAI_VOICE || "fable"

    // Initialize FileStorage without explicit config
    // This will use loadConfigFromEnv() internally
    this.fileStorage = new FileStorage()

    // or
    // this.fileStorage = new FileStorage({
    //   provider: 'cloudflare',
    //   endpoint: process.env.CLOUDFLARE_ENDPOINT,
    //   bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    //   publicUrl: process.env.CLOUDFLARE_PUBLIC_URL,
    //   credentials: {
    //     accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY_SECRET
    //   }
    // });

    if (!this.OPENAI_API_KEY) {
      this.logger.error(`OPENAI_API_KEY is not set`, {
        app: process.env.NEXT_PUBLIC_APP_NAME,
        env: process.env.NEXT_PUBLIC_APP_ENV,
        error: "OPENAI_API_KEY is not set",
        currentClass: "OpenAIAudio",
        currentMethod: "constructor",
        currentFile: "openai.ts",
      })
      throw new Error("OPENAI_API_KEY is not set")
    }
    if (!this.OPENAI_AUDIO_MODEL) {
      this.logger.error(`OPENAI_AUDIO_MODEL is not set`, {
        app: process.env.NEXT_PUBLIC_APP_NAME,
        env: process.env.NEXT_PUBLIC_APP_ENV,
        error: "OPENAI_AUDIO_MODEL is not set",
        currentClass: "OpenAIAudio",
        currentMethod: "constructor",
        currentFile: "openai.ts",
      })
      throw new Error("OPENAI_AUDIO_MODEL is not set")
    }
    if (!this.OPENAI_VOICE) {
      this.logger.error(`OPENAI_VOICE is not set`, {
        app: process.env.NEXT_PUBLIC_APP_NAME,
        env: process.env.NEXT_PUBLIC_APP_ENV,
        error: "OPENAI_VOICE is not set",
        currentClass: "OpenAIAudio",
        currentMethod: "constructor",
        currentFile: "openai.ts",
      })
      throw new Error("OPENAI_VOICE is not set")
    }

    this.openaiAxios = axios.create({
      baseURL: "https://api.openai.com/v1",
      headers: {
        Authorization: `Bearer ${this.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    })
  }

  private safeStringify(obj: unknown): string {
    const seen = new WeakSet()
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return undefined // Skip circular reference
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
    const promptWithoutExtraWhiteSpace = prompt.trim().replace(/\s\s+/g, " ")

    if (promptWithoutExtraWhiteSpace.length > 0) {
      numberOfWords = promptWithoutExtraWhiteSpace.split(" ").length

      // Note that this includes spaces, and does not count new lines.
      numberOfCharacters = promptWithoutExtraWhiteSpace.length
    }

    return {
      numberOfWords,
      numberOfCharacters,
    }
  }

  private async getAudioDurationFromMetadata(
    audioBuffer: Buffer
  ): Promise<AudioDuration> {
    try {
      const metadata: IAudioMetadata = await parseBuffer(
        audioBuffer,
        "audio/mpeg"
      )
      const durationInMinutes = (metadata.format.duration || 0) / 60

      return {
        minutes: Math.floor(durationInMinutes),
        seconds: Math.round((durationInMinutes % 1) * 60),
        totalMinutes: durationInMinutes,
      }
    } catch (error) {
      throw new AudioDurationError(
        `Failed to parse audio metadata: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  async generateAudioFile(
    data: AudioGenerationData,
    metadata: AudioMetadata,
    userId?: string,
    audioProvider: AudioProvider = "openai"
  ): Promise<AudioResponse | null> {
    try {
      const uuid = crypto.randomUUID()
      const baseFolder =
        process.env.NEXT_PUBLIC_APP_ENV === "production" ? "prod" : "dev"
      const userFolder = `${baseFolder}/${data.userId}`

      // Generate formatted file name
      const fileFormatedName = data.title
        ? `${userFolder}/${data.title.toLowerCase().split(" ").join("_")}`
        : `${userFolder}/${data.id}-${uuid}`

      const fileName = `${fileFormatedName}.mp3`

      const sanitizedContent = this.sanitizeContent(data.content)
      const contentChunks = this.splitContentIntoChunks(sanitizedContent, 4000)

      const audioBuffers: Buffer[] = []
      const totalDuration: AudioDuration = {
        minutes: 0,
        seconds: 0,
        totalMinutes: 0,
      }

      for (const chunk of contentChunks) {
        const audioResponse: AxiosResponse = await this.openaiAxios.post(
          "/audio/speech",
          {
            model: this.OPENAI_AUDIO_MODEL,
            input: chunk,
            voice: this.OPENAI_VOICE,
          },
          {
            responseType: "arraybuffer",
          }
        )

        const processingTime = parseInt(
          audioResponse.headers["openai-processing-ms"] || "0"
        )
        const responseData = JSON.parse(audioResponse.config.data)
        const model = responseData.model || "unknown"
        const prompt = responseData.input || ""
        const responseTimeSeconds = (processingTime / 1000).toFixed(3)
        const inputTokenEstimate = Math.ceil(prompt.length / 4)

        const chunkBuffer = Buffer.from(audioResponse.data)
        const chunkDuration =
          await this.getAudioDurationFromMetadata(chunkBuffer)

        // Update total duration
        totalDuration.totalMinutes += chunkDuration.totalMinutes
        totalDuration.minutes = Math.floor(totalDuration.totalMinutes)
        totalDuration.seconds = Math.round(
          (totalDuration.totalMinutes % 1) * 60
        )

        // Log API call
        await this.logApiCall({
          response: audioResponse,
          userId,
          AI_AUDIO_PROVIDER: audioProvider,
          model,
          prompt,
          responseTimeSeconds,
          inputTokenEstimate,
          content: chunk,
          duration: chunkDuration,
        } as LogApiCallParams)

        audioBuffers.push(chunkBuffer)
      }

      // Combine audio buffers
      const combinedAudioBuffer = Buffer.concat(audioBuffers)
      const audioBase64 = combinedAudioBuffer.toString("base64")
      const uploadedFileResponse = await this.uploadFileFromOpenAIResponse(
        fileName,
        audioBase64,
        metadata
      )

      return {
        audioMP3Object: `data:audio/mp3;base64,${audioBase64}`,
        audioUrl: uploadedFileResponse,
        duration: totalDuration,
      }
    } catch (error) {
      console.error("Error in generateAudioFile:", error)
      return null
    }
  }

  private async logApiCall({
    response,
    userId,
    AI_AUDIO_PROVIDER,
    model,
    prompt,
    responseTimeSeconds,
    inputTokenEstimate,
    content,
    duration,
  }: LogApiCallParams): Promise<void> {
    const calculateAudioCost = (
      model: string,
      characterCount: number
    ): number => {
      const pricePerCharacter: Record<string, number> = {
        "tts-1": 0.000015,
        "tts-1-hd": 0.00003,
      }
      return (pricePerCharacter[model] || 0) * characterCount
    }

    let promptNumberOfWordsAndCharacters = this.getWordsAndChars(content)

    const input = {
      id: response.headers["x-request-id"] || "",
      userId,
      provider: AI_AUDIO_PROVIDER,
      model,
      prompt_string: prompt,
      prompt_tokens: inputTokenEstimate,
      completion_tokens: 0,
      total_tokens: inputTokenEstimate,
      responseData: this.safeStringify(response),
      response_time: responseTimeSeconds,
      status_code: response.status,
      usage_cost: calculateAudioCost(model, prompt.length),
      prompt_number_words: promptNumberOfWordsAndCharacters.numberOfWords,
      prompt_number_chars: promptNumberOfWordsAndCharacters.numberOfCharacters,
      audio_length_mins: duration.totalMinutes,
    }

    await aiApiCallsService.createAiApiCall({
      input,
      userId,
    })
  }

  private sanitizeContent(content: string): string {
    return content.replace(/[^\w\s.,!?'"()-]/g, "")
  }

  private splitContentIntoChunks(content: string, chunkSize: number): string[] {
    const chunks: string[] = []
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize))
    }
    return chunks
  }

  private async uploadFileFromOpenAIResponse(
    fileName: string,
    audioBase64: string,
    metadata: AudioMetadata
  ): Promise<string> {
    // Use the FileStorage service instead of FileUpload
    return await this.fileStorage.uploadFile(fileName, audioBase64, {
      ...metadata,
      contentType: "audio/mpeg",
    })
  }
}

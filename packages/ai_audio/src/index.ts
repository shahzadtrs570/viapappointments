import { OpenAIAudio } from "./lib/openai"
import { ElevenLabsAudio } from "./lib/elevenlabs"

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
export interface AudioAPI {
  generateAudioFile: (
    data: AudioGenerationData,
    metadata: {
      title?: string
      artist?: string
      album?: string
    },
    userId: string,
    AI_AUDIO_PROVIDER: "openai" | "elevenlabs"
  ) => Promise<{
    audioMP3Object: string
    audioUrl: string
    duration: AudioDuration
  } | null>
}

export class AIAudio {
  private provider: AudioAPI

  constructor(provider: "openai" | "elevenlabs" = "openai") {
    if (provider === "openai") {
      this.provider = new OpenAIAudio()
    } else if (provider === "elevenlabs") {
      this.provider = new ElevenLabsAudio()
    } else {
      throw new Error("Invalid audio provider")
    }
  }

  async generateAudioFile(
    data: AudioGenerationData,
    metadata: {
      title?: string
      artist?: string
      album?: string
    },
    userId: string,
    AI_AUDIO_PROVIDER: "openai" | "elevenlabs"
  ): Promise<{
    audioMP3Object: string
    audioUrl: string
    duration: AudioDuration
  } | null> {
    return this.provider.generateAudioFile(
      data,
      metadata,
      userId,
      AI_AUDIO_PROVIDER
    )
  }
}

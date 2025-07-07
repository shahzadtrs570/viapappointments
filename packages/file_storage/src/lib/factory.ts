import { StorageConfig, StorageServiceInterface } from "./types"
import { CloudflareService } from "./services/cloudflare.service"
import { LocalService } from "./services/local.service"
import { AWSService } from "./services/aws.service"
import { getLogger } from "@package/logger"

export class StorageServiceFactory {
  private static logger = getLogger()

  static createService(config: StorageConfig): StorageServiceInterface {
    switch (config.provider) {
      case "cloudflare":
        return new CloudflareService(config)

      case "aws":
        return new AWSService(config)

      case "local":
        return new LocalService(config)

      default:
        this.logger.error(`Unsupported storage provider: ${config.provider}`)
        throw new Error(`Unsupported storage provider: ${config.provider}`)
    }
  }
}

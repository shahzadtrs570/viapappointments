import { getLogger } from "@package/logger"
import { TRPCError } from "@trpc/server"

import type {
  DeletePropertyByIdArgs,
  GetPaginatedPropertiesArgs,
  GetPropertyByIdArgs,
  RequestProvisionalOfferArgs,
  SearchPropertiesArgs,
} from "./properties.service.types"

import { addBackofficeRequestToQueue } from "../../../../../services/queue/queue.property.request.offer.service"
import { propertiesRepository } from "../repository/properties.repository"
// import { propertyDetailsResponseSchema } from "../schema/property.schema"

const logger = getLogger()

class PropertiesService {
  public async getPropertyById(args: GetPropertyByIdArgs) {
    const property = await propertiesRepository.getPropertyById(
      args.input.propertyId
    )

    if (!property) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Property not found." })
    }

    return property
  }

  public async getPaginatedProperties(args: GetPaginatedPropertiesArgs) {
    const allowedLimits = [10, 20, 30, 40, 50]
    const { limit, page } = args.input

    if (!allowedLimits.includes(limit)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid limit." })
    }

    if (page < 1) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid page." })
    }

    const totalProperties = await propertiesRepository.getTotalProperties()
    const totalPages = Math.ceil(totalProperties / limit)
    const hasMore = page < totalPages

    if (page > totalPages && totalPages > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid page. You can't go beyond the last page.",
      })
    }

    const properties = await propertiesRepository.getPaginatedProperties(
      args.input
    )
    const pagination = { totalPages, hasMore, currentPage: page, limit }

    return { properties, pagination }
  }

  public async searchProperties(args: SearchPropertiesArgs) {
    const query = args.input.query.trim()

    if (!query) {
      return []
    }

    return propertiesRepository.searchProperties(query)
  }

  public async deletePropertyById(args: DeletePropertyByIdArgs) {
    try {
      await propertiesRepository.deletePropertyById(args.input.propertyId)
    } catch (error) {
      throw new TRPCError({
        message: "Failed to delete property.",
        code: "INTERNAL_SERVER_ERROR",
      })
    }

    return { id: args.input.propertyId }
  }

  public async getPropertyJsonData(args: GetPropertyByIdArgs) {
    try {
      // Use the new transformation method that formats the data in the desired structure
      const transformedProperty =
        await propertiesRepository.transformPropertyData(args.input.propertyId)

      if (!transformedProperty) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Property not found.",
        })
      }

      // Convert to JSON and rename the applicationReview field if it exists
      const jsonData = JSON.parse(JSON.stringify(transformedProperty))

      // Handle the field renaming for proper frontend display
      if (jsonData.applicationReview) {
        // Create the renamed field with the same data
        jsonData.reviewAndReccommendations = jsonData.applicationReview
        // Delete the old field
        delete jsonData.applicationReview
      }

      return jsonData
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        message: "Failed to generate property JSON data.",
        code: "INTERNAL_SERVER_ERROR",
      })
    }
  }

  public async generatePropertyOfferPayload(args: GetPropertyByIdArgs) {
    try {
      const result = await propertiesRepository.generatePropertyOfferPayload(
        args.input.propertyId
      )

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to generate property offer payload.",
        })
      }

      // Handle the field renaming for proper frontend display
      if (result.data && result.data.applicationReview) {
        // Create the renamed field with the same data
        result.data.reviewAndReccommendations = result.data.applicationReview
        // Delete the old field
        delete result.data.applicationReview
      }

      return result.data
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        message: "Failed to generate property offer payload.",
        code: "INTERNAL_SERVER_ERROR",
      })
    }
  }

  public async requestProvisionalOffer(args: RequestProvisionalOfferArgs) {
    try {
      // Generate the payload
      const payload = await this.generatePropertyOfferPayload({
        input: { propertyId: args.input.propertyId },
      })

      // Add to queue for processing
      const task = await addBackofficeRequestToQueue(
        "PROVISIONAL_OFFER",
        {
          requestType: "PROVISIONAL_OFFER",
          payload,
          requestedByUserId: args.session.id,
        },
        {
          id: args.input.propertyId,
          type: "Property",
        }
      )

      // Log the request
      await logger.info("Provisional offer request queued", {
        propertyId: args.input.propertyId,
        userId: args.session.id,
        taskId: task.id,
      })

      return {
        success: true,
        message: "Provisional offer request has been queued for processing.",
        taskId: task.id,
      }
    } catch (error) {
      // Log the error
      await logger.error("Failed to request provisional offer", {
        propertyId: args.input.propertyId,
        userId: args.session.id,
        error: error instanceof Error ? error.message : String(error),
      })

      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        message: "Failed to request provisional offer.",
        code: "INTERNAL_SERVER_ERROR",
      })
    }
  }
}

export const propertiesService = new PropertiesService()
